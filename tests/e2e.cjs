// Browser test of the full flow, using the fake Gemini in tests/mock-gemini.mjs.
// Needs Playwright (npm i -D playwright, then npx playwright install chromium). Steps:
//   1) node tests/mock-gemini.mjs
//   2) npm run build && NODE_ENV=production GEMINI_API_KEY=test GEMINI_API_BASE_URL=http://127.0.0.1:8911 PORT=3456 npx tsx server.ts
//   3) npm run test:e2e
const { chromium } = require('playwright');
const path = require('path');
const OUT = process.env.E2E_OUT || path.join(__dirname, 'e2e-output');
const FIX = path.join(__dirname, 'fixtures');
const APP = process.env.APP_URL || 'http://127.0.0.1:3456/';
require('fs').mkdirSync(OUT, { recursive: true });
const JD = `Strategy Analyst, Example Consulting (fictional), Mumbai, India
Example Consulting helps banks and insurers with strategy.
Responsibilities
- Structure business problems and build Excel models
- Create client-ready PowerPoint presentations
Requirements
- MBA, 2 to 5 years of experience in financial services
- Advanced Excel and PowerPoint`;
const fs = require('fs');
const results = [];
// Click a section in the tab rail (tabs carry titles like "09. Company Research")
const tab = (p, label) => p.click(`nav[aria-label="Report sections"] button[title$="${label}"]`);
const check = (name, ok, extra = '') => { results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ' :: ' + extra : ''}`); };
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1360, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(APP); await p.waitForTimeout(1500);

  // Demo: fictional and labelled
  const body0 = await p.$eval('body', e => e.innerText);
  check('demo has no Stripe', !/stripe/i.test(body0));
  check('no Download ZIP button', !/Download ZIP/i.test(body0));
  await tab(p, 'Company Research'); await p.waitForTimeout(500);
  const demoRes = await p.$eval('main', e => e.innerText);
  check('demo research labelled illustrative', /Illustrative example/i.test(demoRes) && /fictional company/i.test(demoRes));
  await p.screenshot({ path: OUT + '/e2e-0-demo-research.png' });

  // Open input, upload a legacy .doc CV
  await p.click('button:has-text("New Analysis")'); await p.waitForTimeout(500);
  const fileInputs = await p.$$('input[type=file]');
  await fileInputs[1].setInputFiles(FIX + '/cv.doc'); await p.waitForTimeout(2500);
  const cvVal = await p.locator('textarea').nth(1).inputValue();
  check('.doc CV upload read', cvVal.includes('Northwind Bank') && cvVal.includes('PRIYA SHARMA'), cvVal.slice(0, 60).replace(/\n/g, ' '));
  const modalText = await p.$eval('body', e => e.innerText);
  check('.doc upload labels', /Upload PDF \/ DOC \/ DOCX/.test(modalText));
  check('privacy notice updated', /scanned PDF is the one exception/.test(modalText));
  await fileInputs[0].setInputFiles(FIX + '/fake.pdf'); await p.waitForTimeout(1500);
  const badMsg = await p.$eval('body', e => e.innerText);
  check('fake PDF rejected with clear message', /not a valid PDF/.test(badMsg));
  await p.screenshot({ path: OUT + '/e2e-1-doc-upload.png' });

  // Run analysis (fit step fails twice on the mock, so it should fail and the rest should load)
  await p.locator('textarea').nth(0).fill(JD);
  await p.click('button:has-text("Run Comprehensive")');
  await p.waitForSelector('text=Some steps did not finish', { timeout: 60000 });
  await p.waitForTimeout(800);
  const afterRun = await p.$eval('body', e => e.innerText);
  check('partial report loads with banner', /Some steps did not finish: Fit score, strengths and gaps, Preparation plan/.test(afterRun), (afterRun.match(/Some steps did not finish[^\n]*/) || [''])[0]);
  check('overview shows retry card, no invented score', /Overview Dashboard is not ready yet/.test(afterRun) && /Retry this step/.test(afterRun));
  check('candidate real name shown locally', /PRIYA SHARMA/.test(afterRun));
  await p.screenshot({ path: OUT + '/e2e-2-partial.png', fullPage: false });

  // Other sections still work
  await tab(p, 'Interview Questions'); await p.waitForTimeout(400);
  check('interview section available', /Tell me about yourself/.test(await p.$eval('main', e => e.innerText)));
  await tab(p, 'CV Optimizer'); await p.waitForTimeout(400);
  const cvo = await p.$eval('main', e => e.innerText);
  check('tailored CV has name restored', /PRIYA SHARMA/.test(cvo) && !/\[Candidate name\]/.test(cvo));
  check('integrity check flags invented $5M', /\$5M/.test(cvo));
  await tab(p, 'Company Research'); await p.waitForTimeout(400);
  const comp = await p.$eval('main', e => e.innerText);
  check('company facts with source chips', /Example Consulting is a professional services company\.\s*\[1\]/.test(comp), '');
  check('unsourced facts removed + notice', /2 AI statements were removed/.test(comp) && !/Invented fact/.test(comp) && !/does not exist/.test(comp));
  check('sources table with honest dates', /Not shown on the page/.test(comp) && /Checked/i.test(comp));
  check('analysis labelled as AI', /AI analysis, not a sourced fact/i.test(comp));
  await p.screenshot({ path: OUT + '/e2e-3-company.png', fullPage: true });
  await tab(p, 'Industry Research'); await p.waitForTimeout(400);
  check('industry facts sourced', /Banks are adopting generative AI\.\s*\[3\]/.test(await p.$eval('main', e => e.innerText)));
  await tab(p, 'Fit Score'); await p.waitForTimeout(400);
  check('fit section shows retry card', /is not ready yet/.test(await p.$eval('main', e => e.innerText)));
  await p.screenshot({ path: OUT + '/e2e-4-fit-retry-card.png' });

  // Retry the fit step: it should succeed now and also run the plan
  await p.click('button:has-text("Retry this step")');
  await p.waitForSelector('text=is not ready yet', { state: 'detached', timeout: 30000 });
  await p.waitForTimeout(800);
  const fitText = await p.$eval('main', e => e.innerText);
  check('fit section renders after retry', /77/.test(fitText), (fitText.match(/\b77\b/) || ['no 77'])[0]);
  await tab(p, 'Strengths & Gaps'); await p.waitForTimeout(400);
  check('fewer than five strengths note', /Only 2 strengths are shown/.test(await p.$eval('main', e => e.innerText)));
  await tab(p, 'Interview Readiness'); await p.waitForTimeout(400);
  const ready = await p.$eval('main', e => e.innerText);
  check('readiness computed from real parts = 78', /78\s*\/ 100/.test(ready) && /fit 31 of 40, ATS 14 of 20, STAR stories 14 of 20, gaps 19 of 20/.test(ready), (ready.match(/Calculated in code[^\n]*/) || [''])[0]);
  await p.screenshot({ path: OUT + '/e2e-5-readiness.png' });
  await tab(p, 'Overview'); await p.waitForTimeout(500);
  const ov = await p.$eval('main', e => e.innerText);
  check('overview renders after retry', !/not ready yet/.test(ov) && /\b77\b/.test(ov));
  check('banner cleared after all steps succeed', !/Some steps did not finish/.test(await p.$eval('body', e => e.innerText)));
  await p.screenshot({ path: OUT + '/e2e-6-overview.png' });
  check('no page errors', errs.length === 0, errs.join(' | '));
  fs.writeFileSync(OUT + '/e2e-results.txt', results.join('\n'));
  console.log(results.join('\n'));
  await b.close();
  if (results.some((r) => r.startsWith('FAIL'))) process.exit(1);
})().catch(e => { console.log(results.join('\n')); console.error('ABORT', e.message); process.exit(1); });

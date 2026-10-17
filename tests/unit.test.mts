// Unit tests for the safeguards added in this version. Run with: npm test
// No Gemini key or internet connection needed.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { redactCandidatePii, detectCandidateName } from '../src/utils/redact';
import { computeReadiness } from '../src/utils/readiness';
import { Stage2aFitSchema, Stage2bCvOptimizerSchema } from '../src/types/schemas';
import { detectKind, readDoc, readDocx, readPdfTextLayer, looksLikeText, rtfToText } from '../src/server/parseDocument';
import {
  extractPublishedDate,
  extractTitle,
  formatDate,
  addCitationMarkers,
  validIds,
  resolveSource,
  NOT_SHOWN,
  isGroundingUnavailable,
  isSearchQuotaError,
} from '../src/server/sources';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = (f: string) => fs.readFileSync(path.join(here, 'fixtures', f));
let passed = 0;
const failures: string[] = [];
async function test(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    passed++;
    console.log(`  PASS  ${name}`);
  } catch (e: any) {
    failures.push(name);
    console.log(`  FAIL  ${name}\n        ${e.message}`);
  }
}

console.log('\nPrivacy: contact details are removed before text goes to Gemini');
const phones = ['+91 98765 43210', '022 2623 7454', '9876543210', '+91-98765-43210', '(415) 555-0134', '+44 20 7946 0958', '+1 415.555.0134'];
for (const p of phones) {
  await test(`phone "${p}" is redacted`, () => assert.equal(redactCandidatePii(`Call ${p} today`), 'Call [PHONE] today'));
}
const keep = ['2018 - 2022', 'Jul 2022 - Jan 2026', 'Resolved 850+ tickets (20-25 per month)', 'saved 6-8 hours', '1,200,000 transactions', 'Revenue of 12345678'];
for (const k of keep) {
  await test(`"${k}" is left alone`, () => assert.equal(redactCandidatePii(k), k));
}
await test('email and profile links are redacted', () => {
  const out = redactCandidatePii('a.b@example.com | linkedin.com/in/someone | https://github.com/someone');
  assert.equal(out, '[EMAIL] | [LINK] | [LINK]');
});
await test('name, header address, email, phone removed from a full CV; dates kept', async () => {
  const { default: mammoth } = await import('mammoth');
  const text = (await mammoth.extractRawText({ buffer: fixture('cv.docx') })).value;
  assert.equal(detectCandidateName(text), 'PRIYA SHARMA');
  const out = redactCandidatePii(text);
  for (const leak of ['PRIYA', 'Priya', '411001', '90000', 'priya.sharma@', 'priya-sharma-example']) {
    assert.ok(!out.includes(leak), `leaked: ${leak}`);
  }
  assert.ok(out.includes('2025 - 2027') && out.includes('400+') && out.includes('20%'));
});

console.log('\nDocuments: PDF, DOC, DOCX and broken files');
await test('file types detected from names', () => {
  assert.equal(detectKind('a.PDF', ''), 'pdf');
  assert.equal(detectKind('a.doc', ''), 'doc');
  assert.equal(detectKind('a.docx', ''), 'docx');
  assert.equal(detectKind('a.txt', ''), 'txt');
  assert.equal(detectKind('a.png', ''), 'unsupported');
});
for (const [file, reader] of [
  ['cv.doc', readDoc],
  ['cv.docx', readDocx],
  ['cv.pdf', readPdfTextLayer],
  ['cv-rtf-saved-as.doc', readDoc],
  ['old-doc-renamed.docx', readDocx],
] as const) {
  await test(`${file} is read`, async () => {
    const text = await (reader as (b: Buffer) => Promise<string>)(fixture(file));
    assert.ok(looksLikeText(text), 'not readable text');
    assert.ok(text.includes('Northwind Bank') && text.includes('PRIYA SHARMA'), text.slice(0, 120));
    assert.ok(!/Times New Roman|Liberation/.test(text), 'RTF font table leaked into text');
  });
}
await test('a text file named .pdf is rejected with a clear message', async () => {
  await assert.rejects(readPdfTextLayer(fixture('fake.pdf')), /not a valid PDF/);
});
await test('a damaged .docx is rejected', async () => {
  await assert.rejects(readDocx(fixture('corrupt.docx')));
});
await test('RTF special characters', () => assert.equal(rtfToText("{\\rtf1 caf\\'e9\\par next}"), 'café\nnext'));

console.log('\nScores: never invented');
const base = { atsExplanation: '', missingKeywords: { hardSkills: [], tools: [], domainTerms: [] }, tailoredCvMarkdown: '' };
await test('ATS score "72" or 72 accepted', () => {
  assert.equal(Stage2bCvOptimizerSchema.parse({ ...base, atsScore: '72' }).atsScore, 72);
  assert.equal(Stage2bCvOptimizerSchema.parse({ ...base, atsScore: 72 }).atsScore, 72);
});
for (const bad of [null, undefined, '', 'abc', 140]) {
  await test(`ATS score ${JSON.stringify(bad)} rejected (no default 75)`, () => {
    assert.equal(Stage2bCvOptimizerSchema.safeParse({ ...base, atsScore: bad }).success, false);
  });
}
await test('a missing fit dimension score is rejected (no default 70)', () => {
  const dim = { score: 80, weight: 10, explanation: '', keyStrengths: [], keyShortfalls: [] };
  const dims: any = Object.fromEntries(
    ['experience', 'skills', 'education', 'industryKnowledge', 'jobResponsibilities', 'leadership', 'technicalSkills', 'softSkills'].map((k) => [k, { ...dim }])
  );
  const fit = { dimensions: dims, strengthsAndGaps: {} };
  assert.equal(Stage2aFitSchema.safeParse(fit).success, true);
  delete dims.leadership.score;
  assert.equal(Stage2aFitSchema.safeParse(fit).success, false);
});
await test('readiness formula: 40% fit + 20% ATS + 20% stories + 20% gaps', () => {
  const r = computeReadiness({ fitScore: 77, atsScore: 72, storiesWithEvidence: 5, criticalGaps: 0, moderateGaps: 1, minorGaps: 0 });
  assert.deepEqual(r.breakdown, { fitContribution: 31, atsContribution: 14, storyContribution: 14, gapContribution: 19, storiesWithEvidence: 5, gapScore: 93 });
  assert.equal(r.score, 78);
});
await test('readiness refuses to calculate with a missing score (no fallback 75)', () => {
  assert.throws(() => computeReadiness({ fitScore: undefined as any, atsScore: 70, storiesWithEvidence: 3, criticalGaps: 0, moderateGaps: 0, minorGaps: 0 }));
  // A real score of 0 stays 0 (the old code turned 0 into 75)
  assert.equal(computeReadiness({ fitScore: 0, atsScore: 0, storiesWithEvidence: 0, criticalGaps: 0, moderateGaps: 0, minorGaps: 0 }).score, 20);
});

console.log('\nResearch: real dates, real links, no unsourced facts');
const now = new Date('2026-10-17T12:00:00Z');
await test('publication date read from article metadata', () => {
  const d = extractPublishedDate('<meta property="article:published_time" content="2026-09-30T08:15:00+05:30">', now);
  assert.equal(d && formatDate(d), '30 Sep 2026');
});
await test('publication date read from JSON-LD', () => {
  const d = extractPublishedDate('<script type="application/ld+json">{"datePublished":"2026-07-04"}</script>', now);
  assert.equal(d && formatDate(d), '4 Jul 2026');
});
await test('no date on page means no date (never guessed)', () => assert.equal(extractPublishedDate('<title>x</title>', now), null));
await test('future dates rejected', () => assert.equal(extractPublishedDate('<time datetime="2031-01-01">', now), null));
await test('title read from page', () => assert.equal(extractTitle('<meta property="og:title" content="A &amp; B">'), 'A & B'));
await test('citation markers added after supported sentences only', () => {
  const out = addCitationMarkers(
    'Fact one. Fact two. Unsupported.',
    [
      { segment: { text: 'Fact one.' }, groundingChunkIndices: [0, 1] },
      { segment: { text: 'Fact two.' }, groundingChunkIndices: [1] },
    ],
    new Map([[0, 1], [1, 2]])
  );
  assert.equal(out, 'Fact one. [1][2] Fact two. [2] Unsupported.');
});
await test('made-up source numbers dropped', () => assert.deepEqual(validIds([1, '2', 9, 1], new Set([1, 2, 3])), [1, 2]));
await test('source resolved to real article link, title, publisher and date', async () => {
  const realFetch = globalThis.fetch;
  (globalThis as any).fetch = async () => ({
    ok: true,
    url: 'https://www.example-news.com/business/deal-2026-09-22/',
    headers: new Headers({ 'content-type': 'text/html' }),
    body: new Blob([
      '<meta property="og:title" content="Firm announces deal"><meta property="og:site_name" content="Example News"><meta property="article:published_time" content="2026-09-22T10:00:00Z">',
    ]).stream(),
  });
  try {
    const s = await resolveSource(1, 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/X', 'example-news.com', now);
    assert.equal(s.url, 'https://www.example-news.com/business/deal-2026-09-22/');
    assert.equal(s.title, 'Firm announces deal');
    assert.equal(s.publisher, 'Example News');
    assert.equal(s.publicationDate, '22 Sep 2026');
  } finally {
    globalThis.fetch = realFetch;
  }
});
await test('unreachable source keeps its link and says the date is not shown', async () => {
  const realFetch = globalThis.fetch;
  (globalThis as any).fetch = async () => {
    throw new Error('offline');
  };
  try {
    const s = await resolveSource(2, 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/Y', 'example.org', now);
    assert.equal(s.publicationDate, NOT_SHOWN);
    assert.ok(s.url.startsWith('https://vertexaisearch'));
  } finally {
    globalThis.fetch = realFetch;
  }
});
await test('redirects to internal addresses are not followed', async () => {
  const realFetch = globalThis.fetch;
  (globalThis as any).fetch = async () => ({ ok: true, url: 'http://169.254.169.254/latest', headers: new Headers({ 'content-type': 'text/html' }), body: new Blob(['']).stream() });
  try {
    const s = await resolveSource(3, 'https://vertexaisearch.cloud.google.com/z', 'x.com', now);
    assert.ok(!s.url.includes('169.254'));
  } finally {
    globalThis.fetch = realFetch;
  }
});

console.log('\nFree-tier keys: research explains itself instead of failing silently');
for (const m of [
  'Grounding with Google Search is not available on the free tier.',
  '[400 Bad Request] Search Grounding is not supported.',
  'google_search tool is not enabled for this project',
  '{"error":{"status":"FAILED_PRECONDITION","message":"Tool google_search requires billing"}}',
]) {
  await test(`recognised as free-tier search refusal: "${m.slice(0, 50)}"`, () => assert.equal(isGroundingUnavailable({ message: m }), true));
}
for (const m of ['API key not valid. Please pass a valid API key.', 'Internal error', 'Request timed out after 120 seconds.', '429 Resource exhausted']) {
  await test(`not mistaken for a free-tier refusal: "${m.slice(0, 40)}"`, () => assert.equal(isGroundingUnavailable({ message: m }), false));
}

await test('free-tier search quota error recognised (real wording from AI Studio)', () => {
  const real = { status: 429, message: '{"error":{"code":429,"message":"You exceeded your current quota, please check your plan and billing details.","status":"RESOURCE_EXHAUSTED"}}' };
  assert.equal(isSearchQuotaError(real), true);
});
await test('other errors are not treated as search quota errors', () => {
  assert.equal(isSearchQuotaError({ status: 503, message: 'This model is currently experiencing high demand.' }), false);
  assert.equal(isSearchQuotaError({ status: 400, message: 'API key not valid.' }), false);
});

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);

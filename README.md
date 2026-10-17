# CareerMatch AI

CareerMatch AI compares a job description (JD) with a candidate's CV and produces a 13-section report. The report covers job fit, strengths and gaps, CV improvement, interview questions, case interview practice, company and industry research, a STAR story bank, a seven-day plan and an interview readiness dashboard.

The app was first generated in Google AI Studio and then refined with Claude. It runs on Google Gemini, with an Express server and a React front end.

## Run it

**In Google AI Studio.** Import the project, add your Gemini API key in the Secrets panel as `GEMINI_API_KEY`, and run it.

**On your own computer.** You need Node.js 22 or later (the version these changes were tested on).

1. Install the packages with `npm install`.
2. Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` to your Gemini API key.
3. Start the app with `npm run dev`, then open http://localhost:3000.

The model defaults to the name set in `server.ts`. To use a different Gemini model, set `GEMINI_MODEL`.

### Free or paid Gemini API key

A free Gemini API key runs every section except Company Research and Industry Research. Those two use Google Search grounding, which Google does not offer on the free tier. On a free key, both sections say that live research needs a paid key, and the rest of the report works as normal.

To turn research on, enable billing for the key in Google AI Studio (Google's billing guide is at https://ai.google.dev/gemini-api/docs/billing), then click "Retry this step" in either research section. Google asks for a prepayment of at least $5 to move a key from the free tier to the paid tier. At the time of writing, paid keys include 5,000 free Google Search requests a month, and each analysis uses one. Check Google's Gemini API pricing page for current prices before enabling billing. On the free tier, Google may use the text you send to improve its products. On the paid tier it mostly does not.

## What changed in this version

These changes fix gaps found when the first version was checked against the assignment brief.

**1. Old Word files (.doc) now work.** The brief asks for DOC uploads for both the JD and the CV. The first version rejected them. The server now reads .doc files, including ones that are really DOCX or RTF files with a .doc name. It gives a clear message for damaged, empty or mislabelled files.

**2. Company research shows real dates and only sourced facts.**
- Every source used to show "Date not stated". The server now follows each Google Search link to the real article and reads the publication date the article states about itself. If a page does not state a date, the app says "Not shown on the page" instead of guessing.
- Links now point to the real article, with its real title and publisher, not a Google redirect.
- Each fact carries numbered source links. Google's own grounding data shows which source supports which sentence. The server removes any fact that cites no source, or cites a source number that does not exist, and the page says how many were removed.
- AI opinion and interview advice sit in separate boxes labelled "AI analysis, not a sourced fact".
- When the JD does not name the company, the app no longer searches for the word "Company". It researches only the industry and says why. The industry now comes from the JD instead of a default of "Technology".
- Filler text such as "Information retrieved via research" is gone. Empty areas say "Not found in the sources returned by the search".
- Google's search suggestion chips are shown with grounded results, as Google's terms for search grounding require.

**3. One failed step no longer loses the whole report.** Before, if any one AI step failed, the user lost everything. Now each step runs on its own. If one fails, the rest of the report still appears, and the affected sections show a "Retry this step" button. Each request is also retried once automatically. Retrying the fit step also runs the preparation plan, which depends on it.

**4. Contact details are really removed before text goes to Gemini.**
- The old phone check only recognised US-style numbers, so Indian numbers such as +91 98765 43210 or 022 2623 7454 went to Gemini unchanged. The new check covers Indian, UK, US and other international formats, and leaves years, ranges and counts such as "2018 - 2022" or "850+" alone.
- The candidate's name and the address line in the CV header are now also replaced with placeholders. The name is put back on the user's own device for display and in the tailored CV.
- PDF, DOC and DOCX files are now read on the server. Before, every PDF was sent whole to Gemini to be read, contact details included. Now only scanned PDFs, which have no text to extract, go to Gemini, and the user sees a warning when that happens.
- The privacy notice now describes exactly what happens.

**5. No invented scores.**
- If the AI left out a score, the old code quietly filled in 70 for a fit area, 75 for the ATS score, and 75 for the fit or ATS score inside the readiness formula. A real score of 0 also became 75. Missing scores now count as an error and the step is retried, so no number is ever made up.
- The interview readiness score is calculated in code (`src/utils/readiness.ts`) only when the fit score, ATS score and story bank all exist. The dashboard shows how it was built, with fit out of 40, ATS out of 20, STAR stories out of 20 and gaps out of 20.
- The AI used to be told to find exactly five strengths, which pushed it to stretch thin evidence. It is now asked for up to five, and the page explains when there are fewer.

**6. The demo is fictional.** The demo used Stripe, a real company, and showed made-up research as "verified facts". It now uses a fictional company (Lumora Pay), a fictional employer and university, and every research item is labelled "Illustrative example".

**7. Smaller fixes.**
- Removed the "Download ZIP" button and the two copies of the project zip that were bundled inside the project.
- Fixed sideways scrolling on phones.
- Error messages now say what went wrong, for example that the AI took too long or the API key is missing.
- The extraction error now shows inside the input window instead of behind it.
- Prompts now forbid stating company facts from memory in sample answers, and forbid treating protected characteristics as CV red flags.

**8. A new design, adapted from the TalentPulse look.** The interface now uses TalentPulse's design language in a light version.
- A lavender background with slowly drifting coloured light, frosted-glass cards and one violet, cyan and lime gradient for highlights and main buttons.
- Sora for headings, Manrope for text and IBM Plex Mono for numbers and small labels.
- A header with a grouped tab rail (Start, Analysis, Improve your CV, Interview prep, Research, Plan). The current tab has a gradient underline and visited tabs get a green dot.
- Semicircle score gauges for job fit, ATS readiness and interview readiness, and gradient bars that turn green, amber or red with the score.
- A new Overview with a light hero panel, a four-step progress strip, a 2 by 2 summary, a "Your preparation" tracker and a grid of tools.
- A bar on every section showing the role and the three scores, and previous and next cards with an "n / 13" counter at the bottom.
- Sections rise in, bars grow and gauges draw each time a section opens. Cards and buttons lift slightly on hover. All motion switches off for people who turn on "reduce motion" in their system settings.
- The loading screen now appears above the input window. Before, it was hidden behind it.

The theme lives in `src/index.css`. It remaps the Tailwind colours, so every section picks up the new look. The gauge, bar, tab rail, context bar and pager are in `src/components/`.

## Tests

The tests use fictional data and need no Gemini key or internet connection.

- `npm test` runs 53 unit tests. They cover phone and contact redaction, reading PDF, DOC and DOCX files, rejecting broken files, refusing missing scores, the readiness formula, reading article dates and titles, citation markers, dropping made-up source numbers, and recognising a free-tier key, including the quota wording Google uses for it.
- `tests/mock-gemini.mjs` is a fake Gemini API that misbehaves on purpose. It returns missing scores, a fact with no source and a made-up source number.
- `npm run test:e2e` runs a browser test of the whole flow against the fake Gemini. It covers uploading a .doc CV, rejecting a fake PDF, loading a partial report when the fit step fails, retrying that step, checking that removed facts never appear, and checking the readiness score. The steps to start it are at the top of `tests/e2e.cjs`.

The fake Gemini also confirms that the candidate's name and phone number never reach the AI.

## How the brief is covered

| Brief section | How the app meets it |
|---|---|
| 1. Inputs | Paste text or upload PDF, DOC, DOCX or TXT for the JD, and PDF, DOC or DOCX for the CV. Extracts every field the brief lists. |
| 2. Job fit | Eight areas scored by Gemini. The weighted total is calculated in code. A requirement-by-requirement table shows strong match, partial match and gap. A disclaimer says it is not a hiring probability. |
| 3. Strengths and gaps | Up to five strengths, each with CV evidence. Critical, moderate and minor gaps, each with why it matters, what to do and a learning resource. |
| 4. CV improvement | ATS score, missing keywords, weak statements, rewritten bullets and a tailored CV. A check flags any number in the tailored CV that is not in the original. |
| 5. Interview preparation | Six question categories, each question with what is evaluated, an answer framework, a sample answer and feedback guidance. Seven case types for consulting roles. |
| 6. Company and industry research | Live Google Search through Gemini, with source links, publication dates as stated on each page, facts kept apart from AI analysis, and no unsourced facts. |
| 7. Career coaching | Four core answers and a seven-theme STAR story bank. Themes with no CV evidence are flagged instead of invented. Red flags come with honest responses. |
| 8. Preparation plan | Seven days of tasks, practice questions, resources and revision priorities, plus three top actions. |
| 9. Readiness dashboard | Fit, ATS and readiness scores, with the readiness formula shown, plus qualifications, gaps, risks, advantages and the top three priorities. |
| 10. Design | 13 sections, each reachable on its own once the analysis finishes. |
| 11. Rules | Findings based on the CV. Contact details removed before AI processing. No protected characteristics. Claim labels separate facts, assumptions and AI recommendations. |

## Known limits

- Company and industry research need a paid Gemini API key, because Google Search grounding is not available on the free tier. On a free key, both sections explain this and every other section works.
- The AI steps were tested against a fake Gemini, not the real service, because no API key was available while these changes were made. The first real run should be checked.
- Some news sites block automated reading. For those, the publication date shows as "Not shown on the page" even when the article has one.
- Scanned PDFs still have to be sent to Gemini to be read.
- The candidate's name is found from the first lines of the CV. If the name appears somewhere unusual, it may not be removed.
- "Why this company?" answers use a placeholder for company facts, because the interview step runs at the same time as the research. The user fills it in from the Company Research section.
- The tool gives guidance only. It does not make hiring decisions.

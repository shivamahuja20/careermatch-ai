# CareerMatch AI

**JD and CV Matcher, built in Google AI Studio and refined with Claude**

| | |
|---|---|
| Student | Shivam Ahuja, PGPM, SPJIMR Mumbai |
| Course | [ADD: course name] |
| Live app | [ADD: link from AI Studio "Publish"] |
| Source code | [ADD: GitHub repository link] |
| AI model | Google Gemini 3.8 Flash, with Google Search grounding for research |
| Date | [ADD: submission date] |

---

## 1. What the app does

CareerMatch AI helps a candidate decide how well they fit a job and how to prepare for it. The user gives it two things, a job description (JD) and their CV. The app reads both and produces one report with 13 sections.

1. **Overview.** The three headline scores, top strengths, top gaps and a preparation checklist.
2. **JD Analysis.** Job title, company, responsibilities, qualifications, skills, experience, tools and industry knowledge pulled from the JD.
3. **CV Analysis.** Education, experience, skills, projects, achievements, certifications and measurable results pulled from the CV.
4. **Fit Score.** A score out of 100 built from eight areas, with a requirement-by-requirement table marking each one as a strong match, partial match or gap.
5. **Strengths and Gaps.** Up to five strengths backed by CV evidence, and critical, moderate and minor gaps with ways to close them.
6. **CV Optimizer.** An ATS-readiness score, missing keywords, weak statements, rewritten bullets and a tailored CV.
7. **Interview Questions.** Questions in six categories, each with what the interviewer is checking, an answer framework, a sample answer and feedback guidance.
8. **Case Interview Preparation.** Seven case types for consulting roles (profitability, market entry, growth strategy, pricing, operations, market sizing and business problem-solving).
9. **Company Research.** A live Google Search on the employer. Every fact links to its source and shows the date the source states.
10. **Industry Research.** Trends, challenges, regulation and technology changes, from the same search.
11. **Story Bank.** Answers to the four core questions and seven STAR stories built from the candidate's real experience, plus CV red flags with honest responses.
12. **Preparation Plan.** A seven-day plan with tasks, practice questions, resources and revision priorities, plus the three most effective actions.
13. **Interview Readiness.** A final dashboard with all three scores, strongest qualifications, key gaps, interview risks, competitive advantages and the top three priorities.

The app gives career guidance and decision support. It does not make hiring decisions, and its scores are not a probability of being hired.

## 2. How to use it

1. Open the live app. It first shows an example report for a fictional candidate and company, so every section can be explored straight away.
2. Click **New analysis**.
3. Paste the JD, or upload it as PDF, DOC, DOCX or TXT. Paste the CV, or upload it as PDF, DOC or DOCX.
4. Click **Run Comprehensive Match Analysis**. The report is ready in about a minute.
5. Move through the 13 sections with the tab bar at the top, or with the Previous and Next cards at the bottom of each section.
6. Download the tailored CV as Word or Markdown from the CV Optimizer, or print the report as a PDF.

## 3. How it works

The app has a React front end and an Express server. The server holds the Gemini API key, so the key never reaches the browser.

An analysis runs in three stages.

| Stage | What happens |
|---|---|
| 1. Read | Gemini extracts structured facts from the JD and the CV. |
| 2. Analyse | Four steps run at the same time. They are the fit score, the CV optimizer, the interview preparation, and the company and industry research. |
| 3. Plan | Gemini builds the seven-day plan and the readiness lists from the fit results. |

Each step returns JSON that is checked against a fixed format before it is shown. If a step fails, the rest of the report still appears, and the affected section offers a "Retry this step" button.

**Scores that are calculated in code, not by the AI**

- **Job fit.** Gemini scores each of the eight areas, and the code adds them up using fixed weights (experience 20, skills 15, industry knowledge 15, education 10, job responsibilities 10, leadership 10, technical skills 10, soft skills 10).
- **Interview readiness.** 40 percent job fit, 20 percent ATS readiness, 20 percent STAR story coverage and 20 percent gap score. The dashboard shows each part.

**How the research stays honest**

1. Gemini searches Google through its built-in search grounding.
2. The server follows each search result to the real article and reads the title, publisher and publication date the article states about itself. If a page shows no date, the app says "Not shown on the page" instead of guessing.
3. Google's grounding data shows which source supports which sentence. The server keeps only facts that cite a source the search actually returned, and the page says how many were removed.
4. AI opinion and interview advice are shown in separate boxes labelled as AI analysis, not as facts.

## 4. Built in AI Studio, refined with Claude

The first version was generated in Google AI Studio from the assignment brief. It was then checked against the brief point by point, and refined with Claude in four rounds.

| Round | What changed | Why |
|---|---|---|
| Fixes | Added .doc uploads for the JD and the CV | The brief asks for DOC files, and the first version rejected them |
| | Research now shows real article links and publication dates, keeps only sourced facts, and separates facts from AI analysis | The brief asks for source links with dates and forbids invented sources. The first version showed "Date not stated" for every source |
| | Each AI step can fail and be retried on its own | One failed step used to lose the whole report |
| | Contact details are removed before text goes to Gemini, including Indian phone formats and the candidate's name | The first version only recognised US phone numbers and sent whole PDFs to Gemini |
| | Missing scores are treated as errors and retried, never filled with a default | The first version quietly showed 70 or 75 when the AI left a score out |
| | Up to five strengths instead of exactly five | Forcing five pushed the AI to stretch thin evidence |
| | The demo uses a fictional company | The first demo showed made-up research about a real company as verified facts |
| Design | A light, frosted-glass design with gauges, a grouped tab bar and gentle animations | Easier to read and closer to a finished product |
| Free key | A clear message when research needs a paid Gemini key | Google Search grounding is not part of the Gemini free tier |

## 5. How the brief's rules are met

| Rule in the brief | How the app meets it |
|---|---|
| Base findings on the submitted CV | Every prompt tells Gemini to use only the CV. A check flags any number in the tailored CV that does not appear in the original CV. |
| Never fabricate candidate information or sources | Missing details are shown as placeholders such as [Candidate note: add a metric]. Unsourced research facts are removed by the server. |
| Consider transferable skills | The fit prompt asks for transferable skills, and partial matches explain the related experience. |
| Explain scores and recommendations | Every area score has a written explanation, and both calculated scores show their formula. |
| Cite external research | Every research fact carries numbered links to its sources, with a sources table showing title, publisher, publication date and the date it was checked. |
| Protect candidate privacy | Name, email, phone numbers, profile links and the header address are replaced with placeholders before any text goes to Gemini. Uploaded files are read on the server. Nothing is saved. |
| No protected characteristics | The system instruction forbids using age, gender, religion, nationality, family status, disability and similar traits, including as CV red flags. |
| Guidance, not hiring decisions | Every score carries a notice that it is not a probability of being hired. |
| Separate facts, assumptions and AI recommendations | Items are labelled as Fact from CV, Fact from JD, Verified (sourced), Assumption or AI recommendation, with a legend on the Overview. |

## 6. Testing

The app was tested without a Gemini key, using a fake Gemini service that misbehaves on purpose. It returns missing scores, a fact with no source and a made-up source number.

- **51 unit tests** cover contact-detail removal, reading PDF, DOC and DOCX files, rejecting broken files, refusing missing scores, the readiness formula, reading article dates, citation checks and recognising a free-tier key.
- **A 25-check browser test** covers uploading a .doc CV, rejecting a fake PDF, loading a partial report when one step fails, retrying that step, and confirming that removed facts never appear.
- The fake Gemini confirmed that the candidate's name and phone number never reach the AI.
- The layout was checked on desktop and at phone widths of 360, 375 and 414 pixels.

[ADD: one line on your own test run in AI Studio, for example the role you tested and what the scores were]

## 7. Known limits

- **Research needs a paid key.** Google Search grounding is not available on the Gemini free tier. On a free key, the two research sections explain this and every other section works.
- **Some sites hide dates.** Some news sites block automated reading, so their publication date shows as "Not shown on the page".
- **Scanned PDFs go to Gemini.** A scanned PDF has no text to extract, so the whole file is sent to Gemini to be read, and the user is warned.
- **Name detection is simple.** The candidate's name is found from the first lines of the CV and may be missed if it appears somewhere unusual.
- **"Why this company?" needs the user.** That answer uses a placeholder for company facts, because the interview step runs at the same time as the research. The user fills it in from Company Research.
- **Guidance only.** The tool supports career decisions and does not make hiring decisions.

## 8. Technology

React 19, Vite and Tailwind CSS for the front end. Express and TypeScript for the server. Google Gen AI SDK with Gemini 3.8 Flash and Google Search grounding. Zod for checking AI output. Mammoth, word-extractor and unpdf for reading Word and PDF files on the server.

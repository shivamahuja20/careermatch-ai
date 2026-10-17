import {
  CareerMatchAnalysis,
  CompanyResearch,
  IndustryResearch,
  StageKey,
  StageState,
} from '../types/career';
import { computeReadiness } from '../utils/readiness';
import { detectCandidateName } from '../utils/redact';

// ---------------------------------------------------------------------------
// HTTP helper: 120 s timeout, one automatic retry for server or network errors
// ---------------------------------------------------------------------------
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 120000, retries = 1): Promise<any> {
  for (let attempt = 0; ; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        const err: any = new Error(errorJson.error || `Server responded with status ${res.status}`);
        err.status = res.status;
        throw err;
      }
      return await res.json();
    } catch (err: any) {
      const isTimeout = err.name === 'AbortError';
      const retryable = !isTimeout && (err.status === undefined || err.status >= 500) && err.status !== 429;
      if (retryable && attempt < retries) {
        await new Promise((r) => setTimeout(r, 1500));
        continue;
      }
      if (isTimeout) throw new Error('The request timed out after 120 seconds. Please try again.');
      const message = err.message || 'An unexpected network error occurred.';
      throw new Error(message.replace(/https?:\/\/[^\s]+/g, '[service]').slice(0, 400));
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

const post = (url: string, body: unknown) =>
  fetchWithTimeout(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

// ---------------------------------------------------------------------------
// Individual stages
// ---------------------------------------------------------------------------
export const extractStage = (jdText: string, cvText: string) => post('/api/extract', { jdText, cvText });
export const fitStage = (jdText: string, cvText: string, extractedData: any) =>
  post('/api/fit', { jdText, cvText, extractedData });
export const cvOptimizerStage = (jdText: string, cvText: string, extractedData: any) =>
  post('/api/cv-optimizer', { jdText, cvText, extractedData });
export const interviewStage = (jdText: string, cvText: string, extractedData: any) =>
  post('/api/interview', { jdText, cvText, extractedData });

export function researchStage(input: {
  companyName: string;
  industry: string;
  location?: string;
  roleTitle?: string;
}): Promise<{ companyResearch: CompanyResearch; industryResearch: IndustryResearch }> {
  return post('/api/research', input);
}

export const planStage = (payload: { fitScore: any; metadata: any; jdAnalysis: any }) => post('/api/plan', payload);

export async function parseUploadedDocument(file: File): Promise<{ text: string; warning?: string }> {
  const maxSizeBytes = 10 * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error('File size exceeds 10 MB limit.');
  }

  const name = file.name.toLowerCase();

  // Validate allowed extensions. TXT is read here; PDF, DOC and DOCX are read on the server.
  if (!/\.(pdf|docx?|txt)$/.test(name)) {
    throw new Error('Unsupported file type. Please upload a PDF, DOC, DOCX or TXT file.');
  }
  if (file.size === 0) {
    throw new Error('The file is empty. Please choose another file or paste the text.');
  }

  // TXT reading directly on client
  if (name.endsWith('.txt')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = (reader.result as string).trim();
        const warning =
          text.length < 100
            ? 'The extracted text is shorter than 100 characters. Please check it.'
            : undefined;
        resolve({ text, warning });
      };
      reader.onerror = () => reject(new Error('Failed to read text file'));
      reader.readAsText(file);
    });
  }

  // Convert to base64 and send to server
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        const data = await fetchWithTimeout('/api/parse-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileBase64: base64,
            mimeType: file.type || 'application/octet-stream',
            fileName: file.name,
          }),
        });

        resolve({
          text: data.text || '',
          warning: data.warning,
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file as binary.'));
    reader.readAsDataURL(file);
  });
}

// ---------------------------------------------------------------------------
// Pipeline: every stage after extraction can fail on its own and be retried
// ---------------------------------------------------------------------------
export interface PipelineState {
  jdText: string;
  cvText: string;
  candidateName: string;
  extract: any;
  fit?: any;
  cvOptimizer?: any;
  interview?: any;
  research?: { companyResearch: CompanyResearch; industryResearch: IndustryResearch };
  plan?: any;
  errors: Partial<Record<StageKey, string>>;
}

export const STAGE_LABELS: Record<StageKey, string> = {
  fit: 'Fit score, strengths and gaps',
  cvOptimizer: 'CV optimizer and ATS check',
  interview: 'Interview questions, cases and story bank',
  research: 'Company and industry research',
  plan: 'Preparation plan and readiness lists',
};

function researchInput(extract: any) {
  return {
    companyName: (extract?.metadata?.company || extract?.jdAnalysis?.company || '').trim(),
    industry: (extract?.jdAnalysis?.industry || '').trim(),
    location: (extract?.jdAnalysis?.location || '').trim(),
    roleTitle: (extract?.metadata?.jobTitle || extract?.jdAnalysis?.jobTitle || '').trim(),
  };
}

function noResearchResult(reason: string): { companyResearch: CompanyResearch; industryResearch: IndustryResearch } {
  return {
    companyResearch: {
      companyName: '',
      overview: [], businessModel: [], productsAndMarkets: [], competitors: [], strategy: [],
      recentDevelopments: [], analysis: [], interviewAngles: [], sources: [],
      hasVerifiedSources: false,
      notResearchedReason: reason,
    },
    industryResearch: {
      industryName: '',
      landscape: [], trends: [], challengesAndRegulation: [], technologyChanges: [], analysis: [],
      notResearchedReason: reason,
    },
  };
}

async function runOneStage(state: PipelineState, key: StageKey): Promise<any> {
  const { jdText, cvText, extract } = state;
  switch (key) {
    case 'fit':
      return fitStage(jdText, cvText, extract);
    case 'cvOptimizer':
      return cvOptimizerStage(jdText, cvText, extract);
    case 'interview':
      return interviewStage(jdText, cvText, extract);
    case 'research': {
      const input = researchInput(extract);
      if (!input.companyName && !input.industry) {
        return noResearchResult('The job description names neither the company nor its industry, so there was nothing to research.');
      }
      return researchStage(input);
    }
    case 'plan':
      if (!state.fit) throw new Error('The preparation plan needs the fit analysis, which has not finished yet.');
      return planStage({ fitScore: state.fit, metadata: extract.metadata, jdAnalysis: extract.jdAnalysis });
  }
}

/** Runs one stage and returns a new state with either its result or its error. */
async function settle(state: PipelineState, key: StageKey): Promise<PipelineState> {
  try {
    const result = await runOneStage(state, key);
    const errors = { ...state.errors };
    delete errors[key];
    return { ...state, [key]: result, errors };
  } catch (err: any) {
    return { ...state, [key]: undefined, errors: { ...state.errors, [key]: err?.message || 'This step failed.' } };
  }
}

export async function runStagedCareerAnalysis(
  jdText: string,
  cvText: string,
  onProgress: (status: string, stageNum: number) => void
): Promise<PipelineState> {
  // Stage 1 is required by everything else, so a failure here stops the run.
  onProgress('Stage 1/3: Extracting role requirements and candidate qualifications...', 1);
  const extract = await extractStage(jdText, cvText);
  let state: PipelineState = {
    jdText,
    cvText,
    candidateName: detectCandidateName(cvText),
    extract,
    errors: {},
  };

  // Stage 2: four independent steps. Each can fail without losing the others.
  onProgress('Stage 2/3: Fit scores, ATS check, interview questions and grounded research (in parallel)...', 2);
  const keys: StageKey[] = ['fit', 'cvOptimizer', 'interview', 'research'];
  const settled = await Promise.all(keys.map((k) => settle(state, k)));
  keys.forEach((k, i) => {
    state = { ...state, [k]: settled[i][k], errors: { ...state.errors, ...settled[i].errors } };
  });

  // Stage 3: the plan needs the fit analysis.
  onProgress('Stage 3/3: Building the 7-day plan and interview readiness score...', 3);
  if (state.fit) {
    state = await settle(state, 'plan');
  } else {
    state = { ...state, errors: { ...state.errors, plan: 'Waiting for the fit analysis. Retry the fit step first.' } };
  }
  return state;
}

/** Retries one failed stage. Retrying the fit step also runs the plan, which depends on it. */
export async function retryStage(state: PipelineState, key: StageKey): Promise<PipelineState> {
  let next = await settle(state, key);
  if (key === 'fit' && next.fit && (!next.plan || next.errors.plan)) {
    next = await settle(next, 'plan');
  }
  return next;
}

// ---------------------------------------------------------------------------
// Turning the pipeline state into the report object the sections display
// ---------------------------------------------------------------------------
const emptyDimension = { score: 0, weight: 0, explanation: '', keyStrengths: [], keyShortfalls: [] };

/** Puts the candidate's name back into AI text, on this device only (it was never sent). */
function restoreName(text: string, name: string): string {
  if (!text || !name) return text;
  return text.replace(/\[Candidate name\]/g, name);
}

export function buildAnalysis(state: PipelineState): CareerMatchAnalysis {
  const { extract, fit, cvOptimizer: cvo, interview, research, plan, errors } = state;
  const name = state.candidateName;

  const status = (key: StageKey): StageState => {
    if (errors[key]) {
      const skipped = key === 'plan' && !fit;
      return { status: skipped ? 'skipped' : 'failed', error: errors[key] };
    }
    return state[key] ? { status: 'ok' } : { status: 'skipped' };
  };
  const stageStatus: Partial<Record<StageKey, StageState>> = {
    fit: status('fit'),
    cvOptimizer: status('cvOptimizer'),
    interview: status('interview'),
    research: status('research'),
    plan: status('plan'),
  };

  let readiness: ReturnType<typeof computeReadiness> | null = null;
  if (fit && cvo && interview) {
    readiness = computeReadiness({
      fitScore: fit.overallScore,
      atsScore: cvo.atsScore,
      storiesWithEvidence: (interview.storyBank || []).filter((s: any) => s.hasRealEvidence !== false).length,
      criticalGaps: fit.strengthsAndGaps?.criticalGaps?.length || 0,
      moderateGaps: fit.strengthsAndGaps?.moderateGaps?.length || 0,
      minorGaps: fit.strengthsAndGaps?.minorGaps?.length || 0,
    });
  }

  const research_ = research || noResearchResult('Research did not finish.');

  return {
    isDemo: false,
    stageStatus,
    metadata: {
      ...extract.metadata,
      candidateName: name || 'Candidate',
    },
    jdAnalysis: extract.jdAnalysis,
    cvAnalysis: { ...extract.cvAnalysis, candidateName: name || 'Candidate' },
    fitScore: fit
      ? {
          overallScore: fit.overallScore,
          scoreExplanation: fit.scoreExplanation,
          disclaimer: fit.disclaimer,
          dimensions: fit.dimensions,
          requirementsComparison: fit.requirementsComparison,
        }
      : {
          overallScore: 0,
          scoreExplanation: '',
          disclaimer: '',
          dimensions: {
            experience: emptyDimension, skills: emptyDimension, education: emptyDimension,
            industryKnowledge: emptyDimension, jobResponsibilities: emptyDimension, leadership: emptyDimension,
            technicalSkills: emptyDimension, softSkills: emptyDimension,
          },
          requirementsComparison: [],
        },
    strengthsAndGaps: fit?.strengthsAndGaps || { topStrengths: [], criticalGaps: [], moderateGaps: [], minorGaps: [] },
    cvOptimizer: cvo
      ? {
          atsScore: cvo.atsScore,
          atsExplanation: cvo.atsExplanation,
          missingKeywords: cvo.missingKeywords,
          weakStatements: cvo.weakStatements,
          tailoredCvMarkdown: restoreName(cvo.tailoredCvMarkdown, name),
          candidateNoteGuidance: cvo.candidateNoteGuidance,
          unverifiedTerms: cvo.unverifiedTerms || [],
        }
      : {
          atsScore: 0, atsExplanation: '', missingKeywords: { hardSkills: [], tools: [], domainTerms: [] },
          weakStatements: [], tailoredCvMarkdown: '', candidateNoteGuidance: '', unverifiedTerms: [],
        },
    interviewQuestions: interview?.interviewQuestions || [],
    caseInterviewQuestions: interview?.caseInterviewQuestions || [],
    companyResearch: research_.companyResearch,
    industryResearch: research_.industryResearch,
    storyBank: interview?.storyBank || [],
    preparationPlan: plan?.preparationPlan || { sevenDayPlan: [], topThreeActions: [] },
    readinessDashboard: {
      overallJobFitScore: fit?.overallScore ?? 0,
      atsReadinessScore: cvo?.atsScore ?? 0,
      interviewReadinessScore: readiness?.score ?? 0,
      readinessScoreBreakdown: readiness?.breakdown || {
        fitContribution: 0, atsContribution: 0, storyContribution: 0, gapContribution: 0, storiesWithEvidence: 0, gapScore: 0,
      },
      strongestQualifications: plan?.readinessLists?.strongestQualifications || [],
      mostImportantSkillGaps: plan?.readinessLists?.mostImportantSkillGaps || [],
      biggestInterviewRisks: plan?.readinessLists?.biggestInterviewRisks || [],
      competitiveAdvantages: plan?.readinessLists?.competitiveAdvantages || [],
      topThreePriorities: plan?.readinessLists?.topThreePriorities || [],
      cvRedFlagsAndMitigations: interview?.cvRedFlagsAndMitigations || [],
      coreInterviewNarratives: interview?.coreInterviewNarratives || {
        tellMeAboutYourself: '', whyThisCompany: '', whyThisRole: '', whyShouldWeHireYou: '',
      },
    },
  };
}

/** Which stages each section needs. If any of them failed, the section shows a retry card. */
export const SECTION_STAGES: Record<string, StageKey[]> = {
  overview: ['fit', 'cvOptimizer', 'interview', 'plan'],
  'jd-analysis': [],
  'cv-analysis': [],
  'fit-score': ['fit'],
  'strengths-gaps': ['fit'],
  'cv-optimizer': ['cvOptimizer'],
  'interview-questions': ['interview'],
  'case-interview': ['interview'],
  'company-research': ['research'],
  'industry-research': ['research'],
  'story-bank': ['interview'],
  'preparation-plan': ['plan'],
  'interview-readiness': ['fit', 'cvOptimizer', 'interview', 'plan'],
};

export type ClaimType =
  | 'Fact (from CV)'
  | 'Fact (from JD)'
  | 'Verified (sourced)'
  | 'Assumption'
  | 'AI recommendation';

export interface RequirementMatch {
  requirement: string;
  category: 'Experience' | 'Technical Skill' | 'Soft Skill' | 'Education' | 'Domain' | 'Leadership';
  status: 'strong_match' | 'partial_match' | 'gap';
  cvEvidence: string;
  analysis: string;
  claimType?: ClaimType;
}

export interface DimensionScore {
  score: number; // 0-100
  weight: number;
  explanation: string;
  keyStrengths: string[];
  keyShortfalls: string[];
  claimType?: ClaimType;
}

export interface GapItem {
  id: string;
  title: string;
  severity: 'critical' | 'moderate' | 'minor';
  importance: string;
  suggestedAction: string;
  learningResource?: {
    name: string;
    type: 'Course' | 'Certification' | 'Documentation' | 'Book' | 'Project Idea';
    url?: string;
  };
  claimType?: ClaimType;
}

export interface StrengthItem {
  title: string;
  cvEvidence: string;
  impactForRole: string;
  claimType?: ClaimType;
}

export interface BulletImprovement {
  original: string;
  issue: string;
  improved: string;
  metricHighlight: string;
  rationale: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category:
    | 'HR & Behavioral'
    | 'CV-Specific'
    | 'JD-Specific'
    | 'Company-Specific'
    | 'Technical & Functional'
    | 'Pressure & Follow-up';
  priority: 'Critical' | 'High' | 'Medium';
  whatInterviewerEvaluates: string;
  framework: string;
  sampleAnswer: string;
  feedbackGuidance: string; // Evaluation guide: signs of a strong answer & common pitfalls
  candidateTips: string;
}

export interface CaseInterviewQuestion {
  id: string;
  title: string;
  caseType:
    | 'Profitability'
    | 'Market Entry'
    | 'Growth Strategy'
    | 'Pricing'
    | 'Operations'
    | 'Market Sizing'
    | 'Business Problem Solving';
  scenario: string;
  interviewerObjective: string;
  recommendedFramework: string;
  keyFormulasOrDrivers: string[];
  stepByStepSolution: string[];
  interviewerFollowUps: string[];
}

export interface StarStory {
  id: string;
  theme:
    | 'Leadership'
    | 'Teamwork'
    | 'Conflict Resolution'
    | 'Overcoming Failure'
    | 'Problem Solving'
    | 'Initiative'
    | 'Peak Achievement';
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  cvEvidenceSource: string;
  applicableQuestions: string[];
  hasRealEvidence: boolean;
}

export interface DailyPlanItem {
  day: number;
  title: string;
  focusArea: string;
  tasks: { id: string; text: string; done: boolean }[];
  practiceQuestions: string[];
  learningResources: string[];
  revisionPriorities: string;
  claimType?: ClaimType;
}

export interface ResearchSource {
  id: number;
  title: string;
  publisher: string;
  domain: string;
  url: string;
  /** As stated on the page itself, e.g. "14 Oct 2026", or "Not shown on the page". Never guessed. */
  publicationDate: string;
  publicationDateIso?: string;
  retrievedDate: string;
}

/** A factual statement and the numbers of the sources that support it. */
export interface SourcedFact {
  text: string;
  sourceIds: number[];
}

export interface CompanyResearch {
  companyName: string;
  overview: SourcedFact[];
  businessModel: SourcedFact[];
  productsAndMarkets: SourcedFact[];
  competitors: { name: string; distinction: string; sourceIds: number[] }[];
  strategy: SourcedFact[];
  recentDevelopments: { title: string; summary: string; sourceIds: number[] }[];
  /** AI analysis and interview advice. Opinion, not fact. */
  analysis: string[];
  interviewAngles: string[];
  sources: ResearchSource[];
  hasVerifiedSources: boolean;
  /** Set when company research was not run, e.g. the JD does not name the company. */
  notResearchedReason?: string;
  /** Number of AI statements removed because no real source supported them. */
  removedUnsourced?: number;
  /** Google Search suggestion chips that must be shown with grounded results. */
  searchSuggestionsHtml?: string;
  searchedOn?: string;
  isDemo?: boolean;
}

export interface IndustryResearch {
  industryName: string;
  landscape: SourcedFact[];
  trends: SourcedFact[];
  challengesAndRegulation: SourcedFact[];
  technologyChanges: SourcedFact[];
  analysis: string[];
  notResearchedReason?: string;
  isDemo?: boolean;
}

export type StageKey = 'fit' | 'cvOptimizer' | 'interview' | 'research' | 'plan';

export interface StageState {
  status: 'ok' | 'failed' | 'skipped';
  error?: string;
}

export interface IntegrityCheckItem {
  term: string;
  category: 'Number / Metric' | 'Percentage' | 'Currency' | 'Organization' | 'Degree / Credential';
  contextSnippet: string;
}

export interface CareerMatchAnalysis {
  isDemo?: boolean;
  /** Which AI steps finished. Missing means every step finished (for example, demo data). */
  stageStatus?: Partial<Record<StageKey, StageState>>;
  metadata: {
    analysisDate: string;
    jobTitle: string;
    company: string;
    candidateName: string;
    isConsultingRole: boolean;
    consultingRoleReason: string;
  };

  // Section 2: JD Analysis
  jdAnalysis: {
    jobTitle: string;
    company: string;
    industry: string;
    location: string;
    seniorityLevel: string;
    responsibilities: string[];
    qualifications: string[];
    requiredSkills: string[];
    preferredSkills: string[];
    toolsAndTechStack: string[];
    industryKnowledge: string[];
    summary: string;
  };

  // Section 3: CV Analysis
  cvAnalysis: {
    candidateName: string;
    currentOrLatestRole: string;
    yearsOfExperience: string;
    education: { degree: string; institution: string; year?: string }[];
    coreSkills: string[];
    keyProjects: { title: string; description: string; impact: string }[];
    achievements: string[];
    certifications: string[];
    measurableResults: string[];
    summary: string;
  };

  // Section 4: Fit Score
  fitScore: {
    overallScore: number; // Computed in code
    scoreExplanation: string;
    disclaimer: string;
    dimensions: {
      experience: DimensionScore;
      skills: DimensionScore;
      education: DimensionScore;
      industryKnowledge: DimensionScore;
      jobResponsibilities: DimensionScore;
      leadership: DimensionScore;
      technicalSkills: DimensionScore;
      softSkills: DimensionScore;
    };
    requirementsComparison: RequirementMatch[];
  };

  // Section 5: Strengths and Gaps
  strengthsAndGaps: {
    topStrengths: StrengthItem[];
    criticalGaps: GapItem[];
    moderateGaps: GapItem[];
    minorGaps: GapItem[];
  };

  // Section 6: CV Improvement
  cvOptimizer: {
    atsScore: number;
    atsExplanation: string;
    missingKeywords: {
      hardSkills: string[];
      tools: string[];
      domainTerms: string[];
    };
    weakStatements: BulletImprovement[];
    tailoredCvMarkdown: string;
    candidateNoteGuidance: string;
    unverifiedTerms: IntegrityCheckItem[];
  };

  // Section 7: Interview Preparation
  interviewQuestions: InterviewQuestion[];

  // Section 8: Case Interview Preparation
  caseInterviewQuestions: CaseInterviewQuestion[];

  // Section 9: Company Research
  companyResearch: CompanyResearch;

  // Section 10: Industry Research
  industryResearch: IndustryResearch;

  // Section 11: Story Bank
  storyBank: StarStory[];

  // Section 12: Preparation Plan
  preparationPlan: {
    sevenDayPlan: DailyPlanItem[];
    topThreeActions: { title: string; description: string; impact: string; claimType?: ClaimType }[];
  };

  // Section 13: Interview Readiness Dashboard
  readinessDashboard: {
    overallJobFitScore: number; // Reused from fitScore.overallScore
    atsReadinessScore: number; // Reused from cvOptimizer.atsScore
    interviewReadinessScore: number; // Calculated in code
    readinessScoreBreakdown: {
      fitContribution: number;
      atsContribution: number;
      storyContribution: number;
      gapContribution: number;
      storiesWithEvidence: number;
      gapScore: number;
    };
    strongestQualifications: string[];
    mostImportantSkillGaps: string[];
    biggestInterviewRisks: string[];
    competitiveAdvantages: string[];
    topThreePriorities: string[];
    cvRedFlagsAndMitigations: { flag: string; mitigationStrategy: string }[];
    coreInterviewNarratives: {
      tellMeAboutYourself: string;
      whyThisCompany: string;
      whyThisRole: string;
      whyShouldWeHireYou: string;
    };
  };
}

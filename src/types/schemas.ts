import { z } from 'zod';

export const ClaimTypeSchema = z
  .enum([
    'Fact (from CV)',
    'Fact (from JD)',
    'Verified (sourced)',
    'Assumption',
    'AI recommendation',
  ])
  .catch('AI recommendation');

// A 0-100 score that must be present. Accepts "72" or 72, but null, missing or blank fails,
// so a missing score is retried instead of being shown as an invented number.
const RequiredScore = z.preprocess(
  (v) => (v === null || v === undefined || v === '' ? undefined : Number(v)),
  z.number().min(0).max(100)
);

// Stage 1 Schema: Extraction
export const Stage1ExtractSchema = z.object({
  metadata: z.object({
    jobTitle: z.string().default(''),
    company: z.string().default(''),
    candidateName: z.string().default(''),
    isConsultingRole: z.boolean().default(false),
    consultingRoleReason: z.string().default(''),
  }),
  jdAnalysis: z.object({
    jobTitle: z.string().default(''),
    company: z.string().default(''),
    industry: z.string().default(''),
    location: z.string().default(''),
    seniorityLevel: z.string().default(''),
    responsibilities: z.array(z.string()).default([]),
    qualifications: z.array(z.string()).default([]),
    requiredSkills: z.array(z.string()).default([]),
    preferredSkills: z.array(z.string()).default([]),
    toolsAndTechStack: z.array(z.string()).default([]),
    industryKnowledge: z.array(z.string()).default([]),
    summary: z.string().default(''),
  }),
  cvAnalysis: z.object({
    candidateName: z.string().default(''),
    currentOrLatestRole: z.string().default(''),
    yearsOfExperience: z.string().default(''),
    education: z
      .array(
        z.object({
          degree: z.string().default(''),
          institution: z.string().default(''),
          year: z.string().optional().default(''),
        })
      )
      .default([]),
    coreSkills: z.array(z.string()).default([]),
    keyProjects: z
      .array(
        z.object({
          title: z.string().default(''),
          description: z.string().default(''),
          impact: z.string().default(''),
        })
      )
      .default([]),
    achievements: z.array(z.string()).default([]),
    certifications: z.array(z.string()).default([]),
    measurableResults: z.array(z.string()).default([]),
    summary: z.string().default(''),
  }),
});

// Dimension Score Schema
const DimensionScoreSchema = z.object({
  // No default: a missing score fails validation and the step is retried, rather than showing an invented 70.
  score: RequiredScore,
  weight: z.coerce.number().default(10),
  explanation: z.string().default(''),
  keyStrengths: z.array(z.string()).default([]),
  keyShortfalls: z.array(z.string()).default([]),
  claimType: ClaimTypeSchema.default('AI recommendation'),
});

// Stage 2a: Fit & Gaps
export const Stage2aFitSchema = z.object({
  scoreExplanation: z.string().default(''),
  dimensions: z.object({
    experience: DimensionScoreSchema,
    skills: DimensionScoreSchema,
    education: DimensionScoreSchema,
    industryKnowledge: DimensionScoreSchema,
    jobResponsibilities: DimensionScoreSchema,
    leadership: DimensionScoreSchema,
    technicalSkills: DimensionScoreSchema,
    softSkills: DimensionScoreSchema,
  }),
  requirementsComparison: z
    .array(
      z.object({
        requirement: z.string().default(''),
        category: z
          .enum([
            'Experience',
            'Technical Skill',
            'Soft Skill',
            'Education',
            'Domain',
            'Leadership',
          ])
          .catch('Technical Skill'),
        status: z.enum(['strong_match', 'partial_match', 'gap']).catch('partial_match'),
        cvEvidence: z.string().default(''),
        analysis: z.string().default(''),
        claimType: ClaimTypeSchema.default('AI recommendation'),
      })
    )
    .default([]),
  strengthsAndGaps: z.object({
    topStrengths: z
      .array(
        z.object({
          title: z.string().default(''),
          cvEvidence: z.string().default(''),
          impactForRole: z.string().default(''),
          claimType: ClaimTypeSchema.default('Fact (from CV)'),
        })
      )
      .default([]),
    criticalGaps: z
      .array(
        z.object({
          id: z.string().default(''),
          title: z.string().default(''),
          severity: z.literal('critical').default('critical'),
          importance: z.string().default(''),
          suggestedAction: z.string().default(''),
          learningResource: z
            .object({
              name: z.string().default(''),
              type: z
                .enum(['Course', 'Certification', 'Documentation', 'Book', 'Project Idea'])
                .catch('Course'),
              url: z.string().optional().default(''),
            })
            .optional(),
          claimType: ClaimTypeSchema.default('AI recommendation'),
        })
      )
      .default([]),
    moderateGaps: z
      .array(
        z.object({
          id: z.string().default(''),
          title: z.string().default(''),
          severity: z.literal('moderate').default('moderate'),
          importance: z.string().default(''),
          suggestedAction: z.string().default(''),
          learningResource: z
            .object({
              name: z.string().default(''),
              type: z
                .enum(['Course', 'Certification', 'Documentation', 'Book', 'Project Idea'])
                .catch('Course'),
              url: z.string().optional().default(''),
            })
            .optional(),
          claimType: ClaimTypeSchema.default('AI recommendation'),
        })
      )
      .default([]),
    minorGaps: z
      .array(
        z.object({
          id: z.string().default(''),
          title: z.string().default(''),
          severity: z.literal('minor').default('minor'),
          importance: z.string().default(''),
          suggestedAction: z.string().default(''),
          learningResource: z
            .object({
              name: z.string().default(''),
              type: z
                .enum(['Course', 'Certification', 'Documentation', 'Book', 'Project Idea'])
                .catch('Course'),
              url: z.string().optional().default(''),
            })
            .optional(),
          claimType: ClaimTypeSchema.default('AI recommendation'),
        })
      )
      .default([]),
  }),
});

// Stage 2b: CV Optimizer
export const Stage2bCvOptimizerSchema = z.object({
  // No default: a missing ATS score fails validation and the step is retried, rather than showing an invented 75.
  atsScore: RequiredScore,
  atsExplanation: z.string().default(''),
  missingKeywords: z.object({
    hardSkills: z.array(z.string()).default([]),
    tools: z.array(z.string()).default([]),
    domainTerms: z.array(z.string()).default([]),
  }),
  weakStatements: z
    .array(
      z.object({
        original: z.string().default(''),
        issue: z.string().default(''),
        improved: z.string().default(''),
        metricHighlight: z.string().default(''),
        rationale: z.string().default(''),
      })
    )
    .default([]),
  tailoredCvMarkdown: z.string().default(''),
  candidateNoteGuidance: z
    .string()
    .default(
      'Review bracketed [Candidate note: ...] items and insert your verifiable metrics before submission.'
    ),
});

// Stage 2c: Interview Preparation
export const Stage2cInterviewSchema = z.object({
  interviewQuestions: z
    .array(
      z.object({
        id: z.string().default(''),
        question: z.string().default(''),
        category: z
          .enum([
            'HR & Behavioral',
            'CV-Specific',
            'JD-Specific',
            'Company-Specific',
            'Technical & Functional',
            'Pressure & Follow-up',
          ])
          .catch('HR & Behavioral'),
        priority: z.enum(['Critical', 'High', 'Medium']).catch('High'),
        whatInterviewerEvaluates: z.string().default(''),
        framework: z.string().default(''),
        sampleAnswer: z.string().default(''),
        feedbackGuidance: z
          .string()
          .default(
            'Strong answer signs: Quantified results and clear ownership. Common mistakes: Rambling or omitting the end result.'
          ),
        candidateTips: z.string().default(''),
      })
    )
    .default([]),
  caseInterviewQuestions: z
    .array(
      z.object({
        id: z.string().default(''),
        title: z.string().default(''),
        caseType: z
          .enum([
            'Profitability',
            'Market Entry',
            'Growth Strategy',
            'Pricing',
            'Operations',
            'Market Sizing',
            'Business Problem Solving',
          ])
          .catch('Business Problem Solving'),
        scenario: z.string().default(''),
        interviewerObjective: z.string().default(''),
        recommendedFramework: z.string().default(''),
        keyFormulasOrDrivers: z.array(z.string()).default([]),
        stepByStepSolution: z.array(z.string()).default([]),
        interviewerFollowUps: z.array(z.string()).default([]),
      })
    )
    .default([]),
  storyBank: z
    .array(
      z.object({
        id: z.string().default(''),
        theme: z
          .enum([
            'Leadership',
            'Teamwork',
            'Conflict Resolution',
            'Overcoming Failure',
            'Problem Solving',
            'Initiative',
            'Peak Achievement',
          ])
          .catch('Leadership'),
        title: z.string().default(''),
        situation: z.string().default(''),
        task: z.string().default(''),
        action: z.string().default(''),
        result: z.string().default(''),
        cvEvidenceSource: z.string().default(''),
        applicableQuestions: z.array(z.string()).default([]),
        hasRealEvidence: z.boolean().default(true),
      })
    )
    .default([]),
  cvRedFlagsAndMitigations: z
    .array(
      z.object({
        flag: z.string().default(''),
        mitigationStrategy: z.string().default(''),
      })
    )
    .default([]),
  coreInterviewNarratives: z.object({
    tellMeAboutYourself: z.string().default(''),
    whyThisCompany: z.string().default(''),
    whyThisRole: z.string().default(''),
    whyShouldWeHireYou: z.string().default(''),
  }),
});

// Stage 2d: Research Schema (what the AI is allowed to return when structuring grounded research)
const SourceIdsSchema = z.array(z.coerce.number()).default([]);
const SourcedFactSchema = z.object({ text: z.string().default(''), sourceIds: SourceIdsSchema });
export const ResearchStructureSchema = z.object({
  company: z
    .object({
      overview: z.array(SourcedFactSchema).default([]),
      businessModel: z.array(SourcedFactSchema).default([]),
      productsAndMarkets: z.array(SourcedFactSchema).default([]),
      competitors: z
        .array(z.object({ name: z.string().default(''), distinction: z.string().default(''), sourceIds: SourceIdsSchema }))
        .default([]),
      strategy: z.array(SourcedFactSchema).default([]),
      recentDevelopments: z
        .array(z.object({ title: z.string().default(''), summary: z.string().default(''), sourceIds: SourceIdsSchema }))
        .default([]),
      analysis: z.array(z.string()).default([]),
      interviewAngles: z.array(z.string()).default([]),
    })
    .default({
      overview: [], businessModel: [], productsAndMarkets: [], competitors: [], strategy: [],
      recentDevelopments: [], analysis: [], interviewAngles: [],
    }),
  industry: z
    .object({
      landscape: z.array(SourcedFactSchema).default([]),
      trends: z.array(SourcedFactSchema).default([]),
      challengesAndRegulation: z.array(SourcedFactSchema).default([]),
      technologyChanges: z.array(SourcedFactSchema).default([]),
      analysis: z.array(z.string()).default([]),
    })
    .default({ landscape: [], trends: [], challengesAndRegulation: [], technologyChanges: [], analysis: [] }),
});

// Stage 3: Plan & Dashboard Lists
export const Stage3PlanSchema = z.object({
  preparationPlan: z.object({
    sevenDayPlan: z
      .array(
        z.object({
          day: z.coerce.number().min(1).max(7).default(1),
          title: z.string().default(''),
          focusArea: z.string().default(''),
          tasks: z
            .array(
              z.object({
                id: z.string().default(''),
                text: z.string().default(''),
                done: z.boolean().default(false),
              })
            )
            .default([]),
          practiceQuestions: z.array(z.string()).default([]),
          learningResources: z.array(z.string()).default([]),
          revisionPriorities: z.string().default(''),
          claimType: ClaimTypeSchema.default('AI recommendation'),
        })
      )
      .default([]),
    topThreeActions: z
      .array(
        z.object({
          title: z.string().default(''),
          description: z.string().default(''),
          impact: z.string().default(''),
          claimType: ClaimTypeSchema.default('AI recommendation'),
        })
      )
      .default([]),
  }),
  readinessLists: z.object({
    strongestQualifications: z.array(z.string()).default([]),
    mostImportantSkillGaps: z.array(z.string()).default([]),
    biggestInterviewRisks: z.array(z.string()).default([]),
    competitiveAdvantages: z.array(z.string()).default([]),
    topThreePriorities: z.array(z.string()).default([]),
  }),
});

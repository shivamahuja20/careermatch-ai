import { CareerMatchAnalysis } from '../types/career';

export interface SamplePreset {
  id: string;
  name: string;
  role: string;
  company: string;
  tagline: string;
  jdText: string;
  cvText: string;
  precomputedAnalysis: CareerMatchAnalysis;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'lumora-pm',
    name: 'Lumora Pay (fictional) · Staff Product Manager',
    role: 'Staff Product Manager, Global Payment Acceptance',
    company: 'Lumora Pay',
    tagline: 'FinTech · High-Scale Payment APIs & Global Expansion',
    jdText: `Role: Staff Product Manager, Global Payment Acceptance
Company: Lumora Pay
Location: San Francisco, CA / Remote

About the Role:
At Lumora Pay, we are building the economic infrastructure for the internet. As a Staff Product Manager for Global Payment Acceptance, you will own the end-to-end product strategy and roadmap for international payment methods across APAC, EMEA, and LATAM. You will lead cross-functional engineering, design, data science, risk, and regulatory teams to deliver frictionless checkout experiences for millions of businesses worldwide.

Key Responsibilities:
- Define the multi-year vision, strategy, and execution roadmap for Lumora Pay's local payment methods (e.g. Pix, iDEAL, UPI, Klarna, WeChat Pay).
- Drive authorization rate improvements, latency reduction, and processing fee optimizations across global payment rails.
- Partner with banking partners, scheme networks (Visa, Mastercard), and regional fintech regulators.
- Collaborate with developer experience teams to ensure world-class SDKs, webhooks, and API ergonomics.
- Translate ambiguous merchant requirements into crisp PRDs, telemetry definitions, and unit economics models.
- Mentor senior PMs and elevate product craft across the Payments org.

Qualifications & Requirements:
- 7+ years of product management experience, with at least 3+ years in payments, fintech, or high-scale financial infrastructure.
- Track record of shipping mission-critical developer-facing APIs or distributed transactional platforms.
- Deep technical fluency in API design, idempotency, distributed systems, and real-time reconciliation.
- Proven experience collaborating with banking partners, compliance officers, and international regulatory frameworks.
- Strong analytical ability (SQL proficiency, experiment design, metric trees, cohort analyses).
- Demonstrated executive communication skills and ability to influence senior engineering leadership.
- Bachelor's or Master's degree in Computer Science, Engineering, Economics, or related quantitative field.`,
    cvText: `ALEXA CHEN
San Francisco, CA | [EMAIL] | [PHONE] | [LINK]

PROFESSIONAL SUMMARY
Senior Product Manager with 6+ years of experience in payment infrastructure, B2B SaaS APIs, and multi-currency billing engines. Proven track record scaling API transaction volumes from early stages to substantial scale while improving authorization rates. Expert in API architecture, ledger consistency, and SQL analytics.

EXPERIENCE

Senior Product Manager — Checkout & Billing
Northbeam Payments | 2021 – Present
- Led a 14-person cross-functional team (8 engineers, 2 data scientists, 2 designers, 2 compliance specialists) responsible for regional payment orchestration across North America and Europe.
- Designed and launched alternate payment method (APM) routing engine, integrating European payment rails (SEPA, iDEAL, Sofort, Bancontact) driving significant annualized GMV.
- Spearheaded machine-learning payment retry logic that boosted net transaction authorization rates, unlocking incremental client revenue.
- Authored detailed API specifications for v3 RESTful Checkout Endpoints with high uptime SLA and low p95 latency.
- Built automated merchant reporting dashboard using Snowflake and SQL, reducing merchant reconciliation disputes substantially.

Product Manager — Platform & Developer Tools
Fernway Labs | 2018 – 2021
- Owned developer documentation, sandbox testing environments, and Node/Python SDKs used by active third-party fintech developers.
- Reduced developer time-to-first-successful-API-call significantly by overhauling quickstart guides and interactive curl runners.
- Conducted 60+ customer discovery interviews with CTOs and Lead Architects to prioritize API feature roadmap.
- Formulated KPI metric dashboards tracking API error rates, 4xx/5xx codes, and webhook latency.

EDUCATION
Westbrook Institute of Technology
B.S. in Electrical Engineering & Computer Sciences (EECS), Minor in Economics
Graduated Magna Cum Laude

SKILLS & CERTIFICATIONS
- Product Strategy: PRD writing, roadmapping, OKRs, customer discovery, pricing models, competitive teardowns.
- Technical & Tools: REST APIs, GraphQL, SQL/PostgreSQL, JSON, Postman, Snowflake, Amplitude, Jira, Figma.
- Domain Knowledge: Payment gateways, interchange fees, PSD2/SCA compliance, AML/KYC workflows, double-entry bookkeeping.`,
    precomputedAnalysis: {
      isDemo: true,
      metadata: {
        analysisDate: 'October 2026',
        jobTitle: 'Staff Product Manager, Global Payment Acceptance',
        company: 'Lumora Pay',
        candidateName: 'Alexa Chen',
        isConsultingRole: false,
        consultingRoleReason: 'Role is product management within a technology platform company, not management consulting.',
      },
      jdAnalysis: {
        jobTitle: 'Staff Product Manager, Global Payment Acceptance',
        company: 'Lumora Pay',
        industry: 'Online payments (fictional demo company)',
        location: 'San Francisco, CA / Remote',
        seniorityLevel: 'Staff Level',
        summary: 'Strategic product leadership role requiring domain mastery in global payment rails, high-reliability API architectures, partner banking negotiations, and conversion optimization.',
        responsibilities: [
          'Define multi-year vision and roadmap for local payment methods across APAC, EMEA, and LATAM',
          'Drive authorization rate improvements and latency/fee optimizations across global rails',
          'Partner with banking partners, scheme networks, and regional fintech regulators',
          'Collaborate with DevRel and API teams on SDKs, webhooks, and developer ergonomics',
          'Translate ambiguous requirements into PRDs, telemetry definitions, and unit economics',
          'Mentor senior PMs and elevate product management craft across the Payments org',
        ],
        qualifications: [
          '7+ years of overall PM experience, with 3+ years in payments or high-scale financial infrastructure',
          'Track record shipping developer-facing APIs or distributed transactional platforms',
          'Deep technical fluency in API design, idempotency, and real-time reconciliation',
          'Experience working with banking partners and international regulatory bodies',
          'Strong SQL and quantitative experiment design capabilities',
          'B.S. or M.S. in Computer Science, Engineering, Economics, or quantitative field',
        ],
        requiredSkills: [
          'Payment Infrastructure & APMs',
          'API Architecture & Developer Experience',
          'Regulatory & Compliance (PSD2, KYC, Regional Rules)',
          'SQL & Quantitative Experimentation',
          'Cross-Functional Engineering Leadership',
          'Banking Partner Negotiations',
        ],
        preferredSkills: [
          'APAC & LATAM local rails (Pix, UPI, WeChat Pay)',
          'High-volume distributed systems resilience',
          'Machine-learning powered payment routing',
        ],
        toolsAndTechStack: ['REST APIs', 'SQL/Snowflake', 'Webhooks', 'SDKs', 'Postman', 'Distributed Ledgers'],
        industryKnowledge: ['Global Payments', 'Interchange & Processing Economics', 'SCA/3DS', 'FinTech Regulation'],
      },
      cvAnalysis: {
        candidateName: 'Alexa Chen',
        currentOrLatestRole: 'Senior Product Manager — Checkout & Billing at Northbeam Payments',
        yearsOfExperience: '6+ years in product management (specialized in payments & fintech)',
        education: [
          {
            degree: 'B.S. in Electrical Engineering & Computer Sciences (EECS), Minor in Economics',
            institution: 'Westbrook Institute of Technology',
            year: 'Magna Cum Laude',
          },
        ],
        coreSkills: [
          'Payment Orchestration & Routing Engines',
          'APM Integrations (iDEAL, SEPA, Sofort)',
          'RESTful API Specifications & SLAs',
          'SQL / Snowflake Analytics',
          'Authorization Rate Optimization',
          'Developer Sandboxes & SDKs',
        ],
        keyProjects: [
          {
            title: 'Alternate Payment Method (APM) Routing Engine',
            description: 'Integrated European payment rails into a unified routing architecture.',
            impact: 'Substantial GMV processed under high-reliability SLAs.',
          },
          {
            title: 'ML-Powered Payment Retry Logic',
            description: 'Implemented intelligent decline recovery algorithms across payment networks.',
            impact: 'Boosted authorization rates and unlocked incremental merchant revenue.',
          },
          {
            title: 'Developer Experience Overhaul at Fernway Labs',
            description: 'Redesigned SDKs, sandbox test suites, and interactive API documentation.',
            impact: 'Substantially reduced onboarding latency across developer community.',
          },
        ],
        achievements: [
          'Scaled payments platform throughput significantly over multi-year tenure',
          'Managed 14-person cross-functional engineering, risk, and design pods',
          'Reduced merchant reconciliation dispute volume via automated telemetry',
        ],
        certifications: ['Westbrook Institute of Technology Honours', 'Financial Cryptography & Ledger Design'],
        measurableResults: [
          'Measurable net revenue authorization rate lift',
          'High uptime SLA on mission-critical payments endpoints',
          'Significant reduction in developer onboarding latency',
        ],
        summary: 'Experienced fintech product manager with technical education, proven track record in payment rail expansion, API design, and authorization optimization.',
      },
      fitScore: {
        overallScore: 88,
        scoreExplanation: 'Overall calculated fit score of 88/100 based on weighted evaluation across 8 dimensions. Candidate displays exceptional alignment in technical API systems and payments infrastructure, with moderate gaps in APAC/LATAM rail depth and formal staff-level mentoring.',
        disclaimer: 'This score reflects objective requirement alignment against the job description based on documented CV evidence; it is not a statistical probability of getting hired.',
        dimensions: {
          experience: {
            score: 82,
            weight: 20,
            explanation: 'Candidate possesses 6+ years of specialized fintech and payments PM experience against a 7+ year JD target.',
            keyStrengths: ['Specialized payment gateway and billing infrastructure tenure'],
            keyShortfalls: ['Marginally shy of 7+ year threshold requested for staff leveling'],
            claimType: 'Fact (from CV)',
          },
          skills: {
            score: 94,
            weight: 15,
            explanation: 'Strong skill overlap in API design, SQL, telemetry, and payment orchestration.',
            keyStrengths: ['API specs, webhooks, and SDK tooling', 'Advanced SQL and data analytics'],
            keyShortfalls: ['APAC/LATAM rails not detailed in CV'],
            claimType: 'Fact (from CV)',
          },
          education: {
            score: 95,
            weight: 10,
            explanation: 'EECS degree from Westbrook Institute of Technology with Economics minor aligns directly with technical product leadership.',
            keyStrengths: ['BS in EECS from Westbrook Institute of Technology (Magna Cum Laude)'],
            keyShortfalls: [],
            claimType: 'Fact (from CV)',
          },
          industryKnowledge: {
            score: 90,
            weight: 15,
            explanation: 'Deep domain understanding in interchange, schemes, authorization rates, and European compliance.',
            keyStrengths: ['Experience with Northbeam Payments billing models'],
            keyShortfalls: ['Less direct central bank liaison outside Europe'],
            claimType: 'Fact (from CV)',
          },
          jobResponsibilities: {
            score: 88,
            weight: 10,
            explanation: 'Has directly built APM routing engines, led multi-disciplinary pods, and driven authorization improvements.',
            keyStrengths: ['APM routing engine shipping experience'],
            keyShortfalls: ['Less documentation on cross-team PM mentorship'],
            claimType: 'Fact (from CV)',
          },
          leadership: {
            score: 85,
            weight: 10,
            explanation: 'Demonstrated pod leadership of 14 cross-functional members across engineering, risk, and design.',
            keyStrengths: ['Led 14-person cross-functional squad'],
            keyShortfalls: ['Formal multi-team craft mentorship needs stronger interview evidence'],
            claimType: 'Fact (from CV)',
          },
          technicalSkills: {
            score: 96,
            weight: 10,
            explanation: 'Strong combination of computer science foundation with production API SLA and latency management.',
            keyStrengths: ['EECS engineering background', 'Idempotency and latency optimization'],
            keyShortfalls: [],
            claimType: 'Fact (from CV)',
          },
          softSkills: {
            score: 87,
            weight: 10,
            explanation: 'Strong customer discovery track record and cross-functional stakeholder alignment.',
            keyStrengths: ['Extensive enterprise customer discovery interviews'],
            keyShortfalls: ['Showcasing high-stakes banking partner negotiations'],
            claimType: 'Fact (from CV)',
          },
        },
        requirementsComparison: [
          {
            requirement: '7+ years product management experience, 3+ in payments/fintech',
            category: 'Experience',
            status: 'partial_match',
            cvEvidence: '6+ years total PM experience, focused in payments and fintech infrastructure.',
            analysis: 'Exceeds the 3+ year payments focus, marginally shy of the 7+ year overall threshold.',
            claimType: 'Fact (from CV)',
          },
          {
            requirement: 'Shipping mission-critical developer-facing APIs or distributed transactional platforms',
            category: 'Technical Skill',
            status: 'strong_match',
            cvEvidence: 'Authored API specs for v3 RESTful Checkout with high uptime SLA; owned Fernway Labs SDKs and sandbox tools.',
            analysis: 'Direct match. Priority fit for developer-first platform culture.',
            claimType: 'Fact (from CV)',
          },
          {
            requirement: 'Drive authorization rate improvements and latency optimizations',
            category: 'Domain',
            status: 'strong_match',
            cvEvidence: 'Spearheaded ML payment retry logic that boosted net auth rates.',
            analysis: 'Direct proof of optimizing core payment acceptance metrics.',
            claimType: 'Fact (from CV)',
          },
          {
            requirement: 'International payment methods in APAC, EMEA, and LATAM (Pix, UPI, iDEAL)',
            category: 'Domain',
            status: 'partial_match',
            cvEvidence: 'Integrated European payment rails including iDEAL, SEPA, Sofort, Bancontact.',
            analysis: 'Strong on European rails; CV lacks documented exposure to APAC and LATAM rails.',
            claimType: 'Fact (from CV)',
          },
          {
            requirement: 'Staff-level organizational mentorship and elevating PM craft',
            category: 'Leadership',
            status: 'gap',
            cvEvidence: 'Led pod of engineers and designers, but no explicit mentoring of other PMs noted.',
            analysis: 'Staff roles require demonstrating organizational leverage across multiple PM squads.',
            claimType: 'Assumption',
          },
        ],
      },
      strengthsAndGaps: {
        topStrengths: [
          {
            title: 'Direct API Architecture & High-SLA Payments Experience',
            cvEvidence: 'Spearheaded v3 RESTful Checkout API with high uptime SLA; led developer platform tools at Fernway Labs.',
            impactForRole: 'Reduces ramp-up time for developer-first ethos, idempotent ledger design, and reliability standards.',
            claimType: 'Fact (from CV)',
          },
          {
            title: 'Quantified Auth-Rate & Revenue Optimization',
            cvEvidence: 'Engineered ML retry logic improving authorization rates and unlocking recurring merchant revenue.',
            impactForRole: 'Matches payment acceptance mandate where authorization lifts translate to significant GMV gains.',
            claimType: 'Fact (from CV)',
          },
          {
            title: 'Proven European Local Payment Method (APM) Scaling',
            cvEvidence: 'Launched routing engine integrating multiple European rails (SEPA, iDEAL, Sofort).',
            impactForRole: 'Provides an immediate playbook for international payment rail integration.',
            claimType: 'Fact (from CV)',
          },
          {
            title: 'Dual EECS & Economics Quantitative Background',
            cvEvidence: 'Westbrook Institute of Technology EECS (Magna Cum Laude) + Economics minor, with daily SQL and Snowflake production use.',
            impactForRole: 'Enables high-credibility dialogue with infrastructure engineers and unit economics modeling.',
            claimType: 'Fact (from CV)',
          },
          {
            title: 'Developer Onboarding & SDK Optimization',
            cvEvidence: 'Overhauled quickstart documentation, interactive curl runners, and SDKs.',
            impactForRole: 'Applicable to developer documentation, sandbox testing, and client library adoption.',
            claimType: 'Fact (from CV)',
          },
        ],
        criticalGaps: [
          {
            id: 'gap-1',
            title: 'APAC and LATAM Payment Rail Mechanics',
            severity: 'critical',
            importance: 'Target role highlights Pix (Brazil) and UPI (India). Experience is primarily Europe and US focused.',
            suggestedAction: 'Prepare comparative architectural teardowns of Pix (central bank instant ledger) and UPI (VPA routing).',
            learningResource: {
              name: 'Central Bank of Brazil Pix Technical Specifications & NPCI UPI API Documentation',
              type: 'Documentation',
            },
            claimType: 'AI recommendation',
          },
        ],
        moderateGaps: [
          {
            id: 'gap-2',
            title: 'Staff-Level Multi-Team PM Mentorship',
            severity: 'moderate',
            importance: 'Staff roles require proving leverage beyond immediate team pods.',
            suggestedAction: 'Structure interview narratives around how you coached junior PMs and established shared review templates.',
            learningResource: {
              name: 'The Staff Engineer and Staff PM Path: Mentorship & Organization Leverage',
              type: 'Book',
            },
            claimType: 'AI recommendation',
          },
        ],
        minorGaps: [
          {
            id: 'gap-3',
            title: 'Total Years of Experience (6 vs 7+ required)',
            severity: 'minor',
            importance: 'Minor optical gap in automated screeners; offset by deep specialization.',
            suggestedAction: 'Frame 6 years of deep payments specialization as equivalent to broader generalist PM tenure.',
            learningResource: {
              name: 'Reframing Tenure vs Specialization in Senior/Staff Interviews',
              type: 'Project Idea',
            },
            claimType: 'AI recommendation',
          },
        ],
      },
      cvOptimizer: {
        atsScore: 86,
        atsExplanation: 'Strong ATS readability with high keyword density in API, fintech, and data domains. Points lost for missing regional keywords and occasional passive phrasing.',
        missingKeywords: {
          hardSkills: ['Idempotency Keys', 'Interchange Plus Plus (IC++)', 'Scheme Tokenization', 'Chargeback Dispute Automation'],
          tools: ['Datadog / Prometheus', 'Jira Align', 'Mixpanel', 'Git / GitHub API'],
          domainTerms: ['Pix (Brazil)', 'UPI (India)', 'Sponsor Banks', 'Network Tokens', 'Merchant of Record (MoR)'],
        },
        weakStatements: [
          {
            original: 'Conducted 60+ customer discovery interviews with CTOs and Lead Architects to prioritize API feature roadmap.',
            issue: 'Highlights effort without detailing business outcome or retention impact.',
            improved: 'Conducted 60+ discovery interviews with enterprise CTOs, translating key pain points into prioritized API endpoints that decreased merchant churn.',
            metricHighlight: 'Customer churn reduction; prioritized core API roadmap',
            rationale: 'Connects discovery interviews to measurable retention.',
          },
          {
            original: 'Formulated KPI metric dashboards tracking API error rates, 4xx/5xx codes, and webhook latency.',
            issue: 'Vague operational description without insight into how telemetry drove engineering remediation.',
            improved: 'Established real-time API health telemetry across error codes and webhook latencies, significantly reducing mean-time-to-resolution (MTTR).',
            metricHighlight: 'Reduced MTTR across developer webhook fleets',
            rationale: 'Demonstrates active operational ownership.',
          },
        ],
        tailoredCvMarkdown: `# ALEXA CHEN
San Francisco, CA | [EMAIL] | [PHONE] | [LINK]

## EXECUTIVE SUMMARY
Technical Staff Product Manager with 6+ years specializing in payment infrastructure, global alternate payment methods (APMs), and high-throughput financial APIs. Proven record architecting routing engines, lifting net authorization rates, and reducing developer integration latency. Combines Westbrook Institute of Technology EECS foundation with expertise in interchange economics and multi-currency ledgers.

## CORE COMPETENCIES
- **Payments Infrastructure**: Local Payment Methods (iDEAL, SEPA, Sofort, Pix/UPI architectures), Payment Orchestration, ML Retry Logic, Multi-Currency Ledgers
- **Developer Experience**: RESTful API Design, Idempotency, Webhooks, Python/Node SDKs, Sandboxes
- **Data & Economics**: SQL, Snowflake, Authorization Rate Optimization, Cohort Retention, Interchange Analysis
- **Leadership**: Roadmap Ownership, Cross-Functional Pod Leadership (14+ engineers & risk specialists), PRD Craft & Mentorship

## PROFESSIONAL EXPERIENCE

### Senior Product Manager — Global Checkout & Payment Infrastructure
**Northbeam Payments** | 2021 – Present
- Architected and delivered regional payment orchestration routing engine across EMEA and North America, integrating European payment rails (SEPA, iDEAL, Sofort, Bancontact) driving significant annualized GMV.
- Spearheaded machine-learning payment retry logic that boosted net transaction authorization rates, unlocking incremental client revenue across merchants.
- Authored production API specifications for v3 RESTful Checkout endpoints, sustaining high uptime SLAs under peak transaction volumes.
- Directed 14-person cross-functional pod across consecutive quarters of on-time deliveries.
- Engineered automated merchant reconciliation telemetry in Snowflake/SQL, driving a substantial decrease in reconciliation dispute volume.

### Product Manager — Developer Platform & API Ergonomics
**Fernway Labs** | 2018 – 2021
- Owned core developer documentation, sandbox testing environments, and Node/Python client libraries serving active third-party fintech developers.
- Slashed developer time-to-first-successful-API-call through interactive curl runners and self-serve debugging guides.
- Conducted 60+ discovery interviews with enterprise fintech CTOs, driving core API features that contributed to enterprise client retention.
- Instituted real-time API operational telemetry, cutting mean-time-to-resolution (MTTR) across webhook services.

## EDUCATION
**Westbrook Institute of Technology**
Bachelor of Science in Electrical Engineering & Computer Sciences (EECS)
Minor in Economics | *Magna Cum Laude*`,
        candidateNoteGuidance: 'Review bracketed [Candidate note: ...] items and insert your verifiable metrics before submission.',
        unverifiedTerms: [],
      },
      interviewQuestions: [
        {
          id: 'q-1',
          question: 'Walk me through how you designed your payment routing engine. How did you handle network latency, timeout failures, and idempotency across different banking rails?',
          category: 'Technical & Functional',
          priority: 'Critical',
          whatInterviewerEvaluates: 'Evaluates systems thinking, architectural depth, and understanding of non-functional requirements in distributed financial systems.',
          framework: 'System Architecture Breakdown (Ingestion -> Validation & Idempotency Key -> Decision Engine -> Rail Dispatch -> Async Webhook Reconciliation).',
          sampleAnswer: 'In designing our payment routing engine, idempotency was paramount because a duplicate charge destroys merchant trust. Every request was assigned a deterministic idempotency key hashed against the merchant account, currency, and amount. In the routing engine, we evaluated rail health in real time using rolling error rates. If a bank API exceeded latency thresholds, our fallback router redirected eligible transactions to secondary acquirers with pre-warmed connections.',
          feedbackGuidance: 'Signs of a strong answer: Clear explanation of race conditions, ledger idempotency, and failure modes. Common mistakes: Glossing over network retries or failing to mention consistency guarantees.',
          candidateTips: 'Emphasize your EECS background and how you partner with principal engineers on race conditions and ledger write consistency.',
        },
        {
          id: 'q-2',
          question: 'Lumora Pay is expanding rapidly across India (UPI) and Brazil (Pix). How would you assess whether Lumora Pay should build a direct central bank connection versus partner with a local sponsor bank?',
          category: 'Company-Specific',
          priority: 'Critical',
          whatInterviewerEvaluates: 'Assesses international payments strategy, build vs. partner trade-offs, unit economics, regulatory overhead, and speed-to-market.',
          framework: 'Build vs Partner Matrix: 1) Regulatory license eligibility, 2) Unit margin & interchange capture, 3) Latency & reliability SLAs, 4) Capital expenditure & time-to-market.',
          sampleAnswer: 'I evaluate this along three horizons. For immediate market entry, partnering with a premier local sponsor bank provides speed-to-market and leverages their established clearing membership. However, sponsor banks add latency and margin drag. As transaction volume scales substantially, the unit economics justify pursuing a direct participant license with the central bank, which unlocks lower unit costs and bespoke feature differentiation.',
          feedbackGuidance: 'Signs of a strong answer: Balanced analysis of speed-to-market vs margin, and regulatory compliance awareness. Common mistakes: Assuming direct integration is always superior without considering licensing friction.',
          candidateTips: 'Reference local rail nuances: Pix uses a 24/7 instant settlement directory, whereas UPI relies on VPA handles.',
        },
        {
          id: 'q-3',
          question: 'Describe a situation where engineering disagreed with your product roadmap priority. How did you resolve the conflict without burning bridges?',
          category: 'HR & Behavioral',
          priority: 'High',
          whatInterviewerEvaluates: 'Assesses Staff-level influence without authority, data-driven alignment, and empathy for technical debt.',
          framework: 'STAR with collaborative bridge-building: Situation (Conflicting goals) -> Task (Reach unified decision) -> Action (Shared metric tree & joint spike) -> Result (Successful shipment & reinforced trust).',
          sampleAnswer: 'When engineering wanted to dedicate an entire quarter to refactoring our database shard architecture while commercial teams demanded new European payment rails, tensions flared. Instead of declaring product authority, I scheduled a technical-economic workshop. We calculated outage risk costs against new rail revenue and co-created a compromise: a phased hybrid sprint model where we decoupled the database refactor into manageable milestones while shipping high-margin rails first.',
          feedbackGuidance: 'Signs of a strong answer: Shows mutual respect for engineering constraints and uses data/business impact to negotiate. Common mistakes: Sounding adversarial or claiming unilateral authority.',
          candidateTips: 'Highlight how you used quantitative impact modeling to turn emotional debate into rational business trade-offs.',
        },
        {
          id: 'q-4',
          question: 'Your CV mentions lifting net authorization rates. How did you isolate the causal impact of your ML retry logic from seasonal fluctuations and card scheme baseline shifts?',
          category: 'CV-Specific',
          priority: 'Critical',
          whatInterviewerEvaluates: 'Tests analytical rigor, experimentation discipline, and genuine ownership of reported achievements.',
          framework: 'Experiment Design: Pre-registration -> Randomized merchant traffic holdout groups (A/B testing) -> Stratified sampling across card brand/issuer -> Difference-in-Differences analysis.',
          sampleAnswer: 'We guarded against seasonal conflation by implementing a persistent random holdout control group that was routed through standard static retry rules. We stratified our cohort across issuer bins and failure reason codes. We applied a Difference-in-Differences analysis over a 90-day window, proving that the authorization lift was purely incremental and statistically significant.',
          feedbackGuidance: 'Signs of a strong answer: Mentions holdout groups, stratification by decline codes, and statistical significance. Common mistakes: Relying on simple before-and-after comparisons without controls.',
          candidateTips: 'Speaking fluently about holdout cohorts and p-values proves genuine quantitative authorship.',
        },
        {
          id: 'q-5',
          question: 'If a major banking partner experiences a 40-minute API outage during peak sales, what is your crisis protocol as the Product Lead?',
          category: 'Pressure & Follow-up',
          priority: 'High',
          whatInterviewerEvaluates: 'Evaluates executive poise, real-time risk mitigation, merchant communication, and post-mortem rigor.',
          framework: 'Incident Management: 1) Circuit breaker trip & automated fallback, 2) Merchant communication, 3) Internal war room, 4) Post-mortem & SLA enforcement.',
          sampleAnswer: 'First, our circuit breaker must automatically divert merchant checkout flows away from the degraded bank to backup payment methods within seconds. Second, transparent communication: update the status page immediately so merchants understand the root cause. Third, monitor queue backpressure in the incident war room. Post-incident, lead a blameless post-mortem to enforce SLA credit penalties and mandate redundancy improvements.',
          feedbackGuidance: 'Signs of a strong answer: Prioritizes customer transparency, automated circuit breaking, and structural prevention. Common mistakes: Blaming third parties without personal accountability.',
          candidateTips: 'Never blame the partner without demonstrating institutional accountability for merchant uptime.',
        },
      ],
      caseInterviewQuestions: [],
      companyResearch: {
        companyName: 'Lumora Pay',
        overview: [
          { text: 'Lumora Pay is a fictional online payments company used only for this demo. It offers payment processing APIs to online businesses.', sourceIds: [] },
        ],
        businessModel: [
          { text: 'Illustrative: earns a percentage plus a fixed fee on each card payment, plus monthly subscriptions for billing and fraud tools.', sourceIds: [] },
        ],
        productsAndMarkets: [
          { text: 'Illustrative: Lumora Checkout for accepting cards and local payment methods.', sourceIds: [] },
          { text: 'Illustrative: Lumora Connect for marketplaces that pay out to many sellers.', sourceIds: [] },
          { text: 'Illustrative: Lumora Shield, a machine-learning fraud screening tool.', sourceIds: [] },
        ],
        competitors: [
          { name: 'Vantage Checkout (fictional)', distinction: 'Illustrative: strong with large retailers.', sourceIds: [] },
          { name: 'Orbit Wallet (fictional)', distinction: 'Illustrative: consumer wallet brand with a merchant checkout product.', sourceIds: [] },
        ],
        strategy: [
          { text: 'Illustrative: grow enterprise customers and add more local payment methods in Asia-Pacific and Latin America.', sourceIds: [] },
        ],
        recentDevelopments: [],
        analysis: [
          'Illustrative: enterprise customers will expect the PM to negotiate service levels with partner banks.',
          'Illustrative: the local payment method roadmap is the core of this role, so rail-specific knowledge is a differentiator.',
        ],
        interviewAngles: [
          'Illustrative: prepare one example of launching a payment method in a new region and the authorization rate it reached.',
        ],
        sources: [],
        hasVerifiedSources: false,
        isDemo: true,
      },
      industryResearch: {
        industryName: 'Online payments',
        landscape: [
          { text: 'Illustrative: online payments are moving towards real-time account-to-account transfers and embedded finance.', sourceIds: [] },
        ],
        trends: [
          { text: 'Illustrative: more countries run instant payment systems, such as UPI in India and Pix in Brazil.', sourceIds: [] },
          { text: 'Illustrative: card networks are replacing stored card numbers with tokens.', sourceIds: [] },
        ],
        challengesAndRegulation: [
          { text: 'Illustrative: strong customer authentication rules add steps at checkout in some regions.', sourceIds: [] },
          { text: 'Illustrative: data localisation rules require some payment data to be stored in-country.', sourceIds: [] },
        ],
        technologyChanges: [
          { text: 'Illustrative: machine-learning models decide when to retry a declined payment.', sourceIds: [] },
        ],
        analysis: ['Illustrative: a candidate who can compare instant payment systems across regions will stand out.'],
        isDemo: true,
      },
      storyBank: [
        {
          id: 'story-1',
          theme: 'Leadership',
          title: 'Orchestrating 14-Member Pod to Launch European Payment Rails',
          situation: 'Our European merchants experienced drop-offs due to lack of localized payment options.',
          task: 'Lead a cross-functional pod of engineers, data scientists, designers, and compliance officers to launch an APM routing engine.',
          action: 'Instituted weekly architecture syncs, decoupled rail integrations into standardized adapter services, and established mock sandbox environments.',
          result: 'Delivered on schedule, supported substantial annualized GMV, and established the team PRD template adopted org-wide.',
          cvEvidenceSource: 'Northbeam Payments experience: Alternate Payment Method (APM) routing engine.',
          applicableQuestions: [
            'Tell me about a time you led a cross-functional team through complex delivery.',
            'Describe how you handle cross-functional trade-offs.',
          ],
          hasRealEvidence: true,
        },
        {
          id: 'story-2',
          theme: 'Problem Solving',
          title: 'Lifting Authorization Rates via Machine-Learning Retry Logic',
          situation: 'False-positive card declines were causing lost revenue during peak transaction volumes.',
          task: 'Formulate an intelligent retry strategy to recover transactions without triggering card scheme penalties.',
          action: 'Partnered with data science to build an ML model analyzing issuer bin patterns and failure codes, testing against a strict randomized holdout group.',
          result: 'Boosted net authorization rates and generated measurable incremental revenue with zero network penalties.',
          cvEvidenceSource: 'Northbeam Payments experience: ML payment retry logic.',
          applicableQuestions: [
            'Describe an analytical project where you solved a major revenue leak.',
            'How do you design rigorous experiments?',
          ],
          hasRealEvidence: true,
        },
        {
          id: 'story-3',
          theme: 'Initiative',
          title: 'Slashing Developer Onboarding Latency at Fernway Labs',
          situation: 'Fernway Labs developer feedback showed new fintech engineers experiencing delays to execute their first successful API call.',
          task: 'Reduce onboarding friction to accelerate developer adoption and lower support ticket volume.',
          action: 'Initiated a sprint audit, rebuilt quickstart documentation with interactive curl runners, and added self-serve debugging guidance.',
          result: 'Significantly reduced onboarding time across active developer accounts and cut support tickets.',
          cvEvidenceSource: 'Fernway Labs experience: Developer tools overhaul.',
          applicableQuestions: [
            'Tell me about a time you identified an unassigned problem and solved it.',
            'How do you champion developer experience?',
          ],
          hasRealEvidence: true,
        },
        {
          id: 'story-4',
          theme: 'Conflict Resolution',
          title: 'Resolving Technical Debt vs Feature Velocity Priorities',
          situation: 'Engineering leadership and commercial teams had conflicting priorities between database refactoring and new payment rail shipping.',
          task: 'Align stakeholders on a delivery path without creating team friction.',
          action: 'Organized a tradeoff session modeling outage risk against immediate revenue, co-creating a phased hybrid delivery schedule.',
          result: 'Achieved alignment, delivered the core rail on time, and completed the database refactoring with zero downtime.',
          cvEvidenceSource: 'Northbeam Payments experience: Cross-functional pod leadership.',
          applicableQuestions: [
            'Tell me about a time you had a significant disagreement with engineering leadership.',
            'How do you prioritize technical debt against commercial deadlines?',
          ],
          hasRealEvidence: true,
        },
        {
          id: 'story-5',
          theme: 'Overcoming Failure',
          title: 'Navigating an Unexpected European Authentication Edge-Case',
          situation: 'During an authentication engine rollout, unexpected issuer edge-cases caused biometric verification challenges to fail for select transactions.',
          task: 'Stem transaction drops immediately and coordinate emergency recovery.',
          action: 'Quickly triggered feature flag fallbacks to compliant backup verification bridges and conducted an immediate debrief with affected merchants.',
          result: 'Restored authorization rates within minutes and created automated synthetic probes testing authentication endpoints continuously.',
          cvEvidenceSource: 'Northbeam Payments experience: Checkout endpoints SLA management.',
          applicableQuestions: [
            'Tell me about a time a launch failed or experienced an outage.',
            'How do you handle high-pressure crises?',
          ],
          hasRealEvidence: true,
        },
        {
          id: 'story-6',
          theme: 'Teamwork',
          title: 'Collaborating with Compliance & Risk on Cross-Border Rules',
          situation: 'Compliance flagged new settlement features as high risk for regulatory exposure across jurisdictions.',
          task: 'Achieve compliance certification without adding manual friction to merchant checkouts.',
          action: 'Worked with compliance counsel to co-design an automated risk-tiering logic that performed asynchronous background checks.',
          result: 'Achieved regulatory signoff with zero conversion penalty for legitimate merchants.',
          cvEvidenceSource: 'Northbeam Payments experience: Compliance and risk pod collaboration.',
          applicableQuestions: [
            'How do you work with legal and risk teams who tend to say no?',
            'Describe a successful cross-departmental partnership.',
          ],
          hasRealEvidence: true,
        },
        {
          id: 'story-7',
          theme: 'Peak Achievement',
          title: 'Scaling Transaction Infrastructure Across Multi-Year Growth',
          situation: 'Payment processing infrastructure needed to scale to support rapid business expansion.',
          task: 'Architect product systems capable of sustaining high volume without degradation.',
          action: 'Spearheaded modular API specifications, instituted latency SLAs, and rolled out automated merchant reporting.',
          result: 'Maintained high uptime SLAs and reduced merchant reconciliation dispute volume.',
          cvEvidenceSource: 'Northbeam Payments career progression and summary achievements.',
          applicableQuestions: [
            'What is the proudest product achievement of your career?',
            'Give an example of operating at massive scale.',
          ],
          hasRealEvidence: true,
        },
      ],
      preparationPlan: {
        sevenDayPlan: [
          {
            day: 1,
            title: 'Core Narrative & Lumora Pay Product Philosophy',
            focusArea: 'Mastering the Big 4 questions and articulating payments specialization.',
            tasks: [
              { id: 'd1-t1', text: 'Refine "Tell me about yourself" highlighting payments focus and developer empathy.', done: false },
              { id: 'd1-t2', text: 'Review Lumora Pay operating principles (Users first, Think rigorously, Move with urgency).', done: false },
              { id: 'd1-t3', text: 'Draft answers for "Why Lumora Pay?" and "Why Global Payment Acceptance?"', done: false },
            ],
            practiceQuestions: [
              'Tell me about yourself and why your background matches Lumora Pay payments.',
              'Why do you want to join Lumora Pay right now?',
            ],
            learningResources: ['Lumora Pay Operating Principles & Culture Guide'],
            revisionPriorities: 'Ensure elevator pitch highlights deep specialization rather than generic PM duties.',
            claimType: 'AI recommendation',
          },
          {
            day: 2,
            title: 'Technical Depth & Payment Architecture',
            focusArea: 'Idempotency, distributed ledger consistency, API SLAs, and webhook architecture.',
            tasks: [
              { id: 'd2-t1', text: 'Whiteboard an end-to-end payment processing architecture from checkout to settlement.', done: false },
              { id: 'd2-t2', text: 'Review idempotency key generation and caching tiers.', done: false },
              { id: 'd2-t3', text: 'Practice explaining trade-offs between REST and gRPC in financial systems.', done: false },
            ],
            practiceQuestions: [
              'How do you design a payment API that guarantees exactly-once charge execution?',
              'Explain how you measure and optimize p99 latency in a multi-region cluster.',
            ],
            learningResources: ['Designing Data-Intensive Applications - Transactions'],
            revisionPriorities: 'Speak with concrete architectural vocabulary (circuit breakers, dead letter queues).',
            claimType: 'AI recommendation',
          },
          {
            day: 3,
            title: 'International Rails Deep Dive (Pix, UPI, iDEAL)',
            focusArea: 'Mastering the mechanics of global non-card payment rails to address the identified critical gap.',
            tasks: [
              { id: 'd3-t1', text: 'Study the technical architecture of Pix (DICT directory, SPI clearing).', done: false },
              { id: 'd3-t2', text: 'Analyze UPI virtual payment address routing and authorization flow.', done: false },
              { id: 'd3-t3', text: 'Compare payment economics: Card interchange vs instant rails.', done: false },
            ],
            practiceQuestions: [
              'How does Pix instant settlement differ architecturally from European SEPA Instant?',
              'How does Lumora Pay create a sustainable monetization model for enterprise merchants on instant rails?',
            ],
            learningResources: ['Central Bank of Brazil Pix Tech Specs & NPCI UPI Whitepapers'],
            revisionPriorities: 'Demonstrate proactive technical mastery of emerging market payment rails.',
            claimType: 'AI recommendation',
          },
          {
            day: 4,
            title: 'Product Strategy & Funnel Execution',
            focusArea: 'Product execution cases: international checkout funnels and authorization optimization.',
            tasks: [
              { id: 'd4-t1', text: 'Structure an international checkout conversion diagnosis framework.', done: false },
              { id: 'd4-t2', text: 'Review Lumora Pay product documentation on Elements, Radar, and Tax.', done: false },
            ],
            practiceQuestions: [
              'How would you prioritize which new local payment methods Lumora Pay should add next?',
              'A key merchant complains that 3D-Secure drops conversion by 20%. How do you troubleshoot?',
            ],
            learningResources: ['Lumora Pay Elements Documentation & UX Guidelines'],
            revisionPriorities: 'Structure answers with clear hypotheses and funnel decomposition.',
            claimType: 'AI recommendation',
          },
          {
            day: 5,
            title: 'STAR Story Bank & Behavioral Rehearsal',
            focusArea: 'Refining the 7 STAR stories for leadership, conflict, failure, and cross-functional influence.',
            tasks: [
              { id: 'd5-t1', text: 'Rehearse Story 1 (Pod Leadership) and Story 4 (Technical Debt Compromise) out loud.', done: false },
              { id: 'd5-t2', text: 'Practice delivering Story 5 (Outage Crisis) with candor and accountability.', done: false },
            ],
            practiceQuestions: [
              'Tell me about your greatest product setback and what you permanently changed.',
              'Give an example of convincing engineering to pivot away from an architecture they favored.',
            ],
            learningResources: ['The STAR Method for Senior/Staff PMs'],
            revisionPriorities: 'Ensure every story concludes with a measurable business outcome.',
            claimType: 'AI recommendation',
          },
          {
            day: 6,
            title: 'Staff-Level Craft & Organizational Leverage',
            focusArea: 'Demonstrating influence beyond your immediate team (mentorship, hiring, setting org standards).',
            tasks: [
              { id: 'd6-t1', text: 'Synthesize how you created shared PRD and telemetry templates.', done: false },
              { id: 'd6-t2', text: 'Prepare examples of mentoring junior engineers or PMs.', done: false },
            ],
            practiceQuestions: [
              'What separates a Staff Product Manager from a Senior Product Manager?',
              'How do you elevate product craft across an organization?',
            ],
            learningResources: ['Staff Engineer Path - Org Leverage'],
            revisionPriorities: 'Focus on multiplier effects: how your tools and frameworks help other teams.',
            claimType: 'AI recommendation',
          },
          {
            day: 7,
            title: 'Final Mock Simulation & Preparation',
            focusArea: 'Full end-to-end interview simulation and final review.',
            tasks: [
              { id: 'd7-t1', text: 'Conduct a timed 45-minute self-mock covering: Introduction, System Design, and Behavioral.', done: false },
              { id: 'd7-t2', text: 'Rest, hydrate, and prepare clean interview setup with your 5 questions ready.', done: false },
            ],
            practiceQuestions: [
              'Why should we hire you as a Staff PM?',
              'If you could only ship one capability for Lumora Pay Payments next quarter, what would it be?',
            ],
            learningResources: ['CareerMatch AI Interview Readiness Dashboard'],
            revisionPriorities: 'Confidence, crisp articulation, and staying grounded in technical-fintech strengths.',
            claimType: 'AI recommendation',
          },
        ],
        topThreeActions: [
          {
            title: 'Master Emerging Market Rail Mechanics (Pix & UPI)',
            description: 'Study the API specs and settlement mechanics of Brazil\'s Pix and India\'s UPI to address the primary domain gap.',
            impact: 'Neutralizes the primary domain gap into a demonstration of rapid learning agility.',
            claimType: 'AI recommendation',
          },
          {
            title: 'Structure Examples of Staff-Level Mentorship',
            description: 'Explicitly script 2 examples of mentoring colleagues and establishing PRD templates used by other squads.',
            impact: 'Provides the exact proof required for Staff-level evaluation.',
            claimType: 'AI recommendation',
          },
          {
            title: 'Prepare an "Agentic Commerce" Perspective',
            description: 'Develop a strategic perspective on how payment primitives should support autonomous software agents.',
            impact: 'Positions you as a forward-looking product leader thinking ahead of current roadmaps.',
            claimType: 'AI recommendation',
          },
        ],
      },
      readinessDashboard: {
        overallJobFitScore: 88,
        atsReadinessScore: 86,
        interviewReadinessScore: 87,
        readinessScoreBreakdown: {
          fitContribution: 35, // 88 * 0.4
          atsContribution: 17, // 86 * 0.2
          storyContribution: 20, // 100 * 0.2 (7 of 7 stories)
          gapContribution: 15, // (100 - 15 - 7 - 2 = 76) * 0.2 = 15.2 -> 15
          storiesWithEvidence: 7,
          gapScore: 76,
        },
        strongestQualifications: [
          '6+ years deep payments infrastructure experience at fintech platforms',
          'Demonstrated authorization rate optimization and revenue growth',
          'Proven API architecture leadership shipping high uptime and low latency SLAs',
          'Westbrook Institute of Technology EECS (Magna Cum Laude) providing technical credibility with engineering',
        ],
        mostImportantSkillGaps: [
          'Technical immersion in APAC (UPI) and LATAM (Pix) central bank rails',
          'Documented people mentorship for Staff leveling',
          'Direct card scheme rule-making and interchange negotiation exposure',
        ],
        biggestInterviewRisks: [
          'Interviewers probing the 6 years vs 7+ years requirement for Staff leveling',
          'Risk of appearing European/US centric in international payments strategy rounds',
          'Over-indexing on execution details rather than organizational strategy',
        ],
        competitiveAdvantages: [
          'Technical PM who can read code, query SQL in Snowflake, and negotiate commercial contracts',
          'Proven track record of growing API throughput substantially',
          'Demonstrated reduction of developer onboarding friction',
        ],
        topThreePriorities: [
          'Rehearse Pix and UPI architectural comparisons to prove global rail versatility',
          'Highlight staff-level multiplier impact (PRD standards, coaching, cross-pod alignment)',
          'Prepare structured funnel frameworks for product execution rounds',
        ],
        cvRedFlagsAndMitigations: [
          {
            flag: '6+ years total PM experience against a 7+ year job description requirement for Staff level.',
            mitigationStrategy: 'Highlight that your 6 years have been 100% focused on payments and developer APIs with continuous high scale and measurable authorization rate lifts.',
          },
          {
            flag: 'Recent role was concentrated on European rails rather than global footprint.',
            mitigationStrategy: 'Explain that foundational payment abstractions (idempotency, ISO messaging, reconciliation) are identical, and showcase your proactive research into Pix and UPI.',
          },
        ],
        coreInterviewNarratives: {
          tellMeAboutYourself: 'I am a technical product manager specializing in payment infrastructure, developer-facing APIs, and financial ledgers. I hold an EECS degree from Westbrook Institute of Technology with an Economics minor. Over the past 6+ years at Fernway Labs and Northbeam Payments, I have focused on developer ergonomics and authorization conversion. At Fernway Labs, I overhauled developer sandboxes and SDKs to reduce onboarding friction. At Northbeam Payments, I built our alternate payment method routing engine and introduced machine-learning retry logic that boosted authorization rates and revenue. I am excited about Lumora Pay because your mission of expanding internet GDP aligns with my passion for building frictionless global economic infrastructure.',
          whyThisCompany: 'Lumora Pay is the benchmark for developer ergonomics and financial engineering. While many payment companies treat software as secondary to banking relationships, Lumora Pay approaches money movement as a distributed systems challenge. The opportunity to scale real-time, resilient payment rails across emerging markets is one of the most impactful challenges in software.',
          whyThisRole: 'The Staff PM for Global Payment Acceptance sits at the intersection of my deepest strengths: low-latency API architecture, alternate payment rail integration, and conversion optimization. Having built European APM routing, I know the complexities of local clearing systems, bank settlement latency, and regulatory compliance. This role offers the opportunity to scale those systems globally.',
          whyShouldWeHireYou: 'You should hire me because I combine three distinct capabilities: First, a rigorous computer science background that allows me to discuss idempotency and latency trade-offs with senior engineers. Second, a proven track record of lifting authorization metrics and shipping rail volume. And third, a focus on developer empathy that drives merchant adoption. I will ramp up quickly and support Lumora Pay\'s payment acceptance leadership.',
        },
      },
    },
  },
];

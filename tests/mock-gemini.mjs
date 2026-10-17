// TEST ONLY: a fake Gemini API. Answers by recognising which CareerMatch step sent the prompt.
// It misbehaves on purpose: the first two fit replies have missing scores, the research
// structure cites a source that does not exist and includes a fact with no source.
import http from 'node:http';

const PORT = Number(process.env.MOCK_PORT || 8911);
// MOCK_FREE_TIER=1 makes the search step fail the way a free-tier key does.
const FREE_TIER = process.env.MOCK_FREE_TIER === '1';
let fitCalls = 0;
const log = [];

const dims = (s) =>
  Object.fromEntries(
    ['experience', 'skills', 'education', 'industryKnowledge', 'jobResponsibilities', 'leadership', 'technicalSkills', 'softSkills'].map(
      (k, i) => [k, { score: s[i], weight: 10, explanation: `Explanation for ${k}.`, keyStrengths: ['x'], keyShortfalls: ['y'] }]
    )
  );

function replyFor(prompt, hasSearchTool) {
  if (hasSearchTool) {
    return {
      text: 'Example Consulting is a professional services company. Example Consulting announced an acquisition in India. Banks are adopting generative AI. Unsupported sentence.',
      groundingMetadata: {
        groundingChunks: [
          { web: { uri: 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AAA', title: 'exampleconsulting.com' } },
          { web: { uri: 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/BBB', title: 'news.example.com' } },
          { web: { uri: 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/CCC', title: 'research.example.org' } },
        ],
        groundingSupports: [
          { segment: { text: 'Example Consulting is a professional services company.' }, groundingChunkIndices: [0] },
          { segment: { text: 'Example Consulting announced an acquisition in India.' }, groundingChunkIndices: [1] },
          { segment: { text: 'Banks are adopting generative AI.' }, groundingChunkIndices: [2] },
        ],
        searchEntryPoint: { renderedContent: '<div style="font:12px sans-serif">Google Search suggestions: <a href="https://www.google.com/search?q=exampleconsulting">exampleconsulting news</a></div>' },
      },
    };
  }
  if (prompt.includes('Extract structured role and candidate profiles')) {
    log.push({ step: 'extract', sawRealName: /PRIYA|Priya/.test(prompt), sawPhone: prompt.includes('90000') });
    return {
      json: {
        metadata: { jobTitle: 'Strategy Analyst', company: 'Example Consulting', candidateName: '[Candidate name]', isConsultingRole: true, consultingRoleReason: 'Strategy consulting.' },
        jdAnalysis: { jobTitle: 'Strategy Analyst', company: 'Example Consulting', industry: 'Banking and financial services consulting', location: 'Mumbai, India', seniorityLevel: 'Analyst', responsibilities: ['Structure problems'], qualifications: ['MBA'], requiredSkills: ['Excel', 'PowerPoint'], preferredSkills: ['SQL'], toolsAndTechStack: ['Excel'], industryKnowledge: ['Banking'], summary: 'Strategy analyst role.' },
        cvAnalysis: { candidateName: '[Candidate name]', currentOrLatestRole: 'Analyst', yearsOfExperience: '3.5 years', education: [{ degree: 'MBA', institution: 'Example Business School', year: '2027' }], coreSkills: ['Java', 'SQL'], keyProjects: [], achievements: ['400+ applications'], certifications: [], measurableResults: ['400+ applications'], summary: 'Analyst turned MBA.' },
      },
    };
  }
  if (prompt.includes('requirement-by-requirement job fit analysis')) {
    fitCalls++;
    const broken = fitCalls <= 2;
    const d = dims([80, 75, 90, 85, 70, 60, 80, 70]);
    if (broken) delete d.leadership.score; // missing score must NOT become an invented number
    return {
      json: {
        scoreExplanation: 'Good fit.',
        dimensions: d,
        requirementsComparison: [{ requirement: 'MBA', category: 'Education', status: 'strong_match', cvEvidence: 'MBA, Example Business School', analysis: 'Met.' }],
        strengthsAndGaps: {
          topStrengths: [
            { title: 'Banking domain', cvEvidence: 'Loan review work', impactForRole: 'BFSI clients' },
            { title: 'Problem solving', cvEvidence: 'Root-cause analysis', impactForRole: 'Structuring' },
          ],
          criticalGaps: [],
          moderateGaps: [{ id: 'g1', title: 'Consulting experience', severity: 'moderate', importance: 'Core', suggestedAction: 'Case practice' }],
          minorGaps: [],
        },
      },
    };
  }
  if (prompt.includes('Optimize the candidate')) {
    return {
      json: {
        atsScore: 72,
        atsExplanation: 'Decent.',
        missingKeywords: { hardSkills: ['Financial modelling'], tools: [], domainTerms: [] },
        weakStatements: [],
        tailoredCvMarkdown: '# [Candidate name]\n[EMAIL] | [PHONE]\n\n## Experience\n- Reviewed 400+ loan applications\n- Grew revenue by $5M',
        candidateNoteGuidance: 'Check notes.',
      },
    };
  }
  if (prompt.includes('personalized interview preparation questionnaire')) {
    return {
      json: {
        interviewQuestions: [{ id: 'q1', question: 'Tell me about yourself', category: 'HR & Behavioral', priority: 'High', whatInterviewerEvaluates: 'Story', framework: 'Present-past-future', sampleAnswer: 'I am...', feedbackGuidance: 'Be concise', candidateTips: 'Practise' }],
        caseInterviewQuestions: [{ id: 'c1', title: 'Bank profitability', caseType: 'Profitability', scenario: 'A bank...', interviewerObjective: 'Structure', recommendedFramework: 'Revenue - cost', keyFormulasOrDrivers: ['Profit = R - C'], stepByStepSolution: ['Clarify'], interviewerFollowUps: ['Why?'] }],
        storyBank: ['Leadership', 'Teamwork', 'Conflict Resolution', 'Overcoming Failure', 'Problem Solving', 'Initiative', 'Peak Achievement'].map((t, i) => ({
          id: `s${i}`, theme: t, title: t, situation: 'S', task: 'T', action: 'A', result: 'R', cvEvidenceSource: 'CV', applicableQuestions: [], hasRealEvidence: i < 5,
        })),
        cvRedFlagsAndMitigations: [{ flag: 'Career switch', mitigationStrategy: 'Explain the why' }],
        coreInterviewNarratives: { tellMeAboutYourself: 'T', whyThisCompany: 'W', whyThisRole: 'R', whyShouldWeHireYou: 'H' },
      },
    };
  }
  if (prompt.includes('Turn this grounded research into structured JSON')) {
    log.push({ step: 'research-structure', hasMarkers: prompt.includes('[1]') && prompt.includes('[2]') });
    return {
      json: {
        company: {
          overview: [{ text: 'Example Consulting is a professional services company.', sourceIds: [1] }],
          businessModel: [{ text: 'Invented fact with no source.', sourceIds: [] }],
          productsAndMarkets: [{ text: 'Fact citing a source that does not exist.', sourceIds: [9] }],
          competitors: [{ name: 'Rival Advisory', distinction: 'Large rival', sourceIds: [1, 9] }],
          strategy: [],
          recentDevelopments: [{ title: 'Acquisition in India', summary: 'Example Consulting announced an acquisition in India.', sourceIds: [2] }],
          analysis: ['This is AI opinion.'],
          interviewAngles: ['Mention the acquisition.'],
        },
        industry: {
          landscape: [],
          trends: [{ text: 'Banks are adopting generative AI.', sourceIds: [3] }],
          challengesAndRegulation: [],
          technologyChanges: [],
          analysis: ['Industry opinion.'],
        },
      },
    };
  }
  if (prompt.includes('7-day interview preparation plan')) {
    log.push({ step: 'plan' });
    return {
      json: {
        preparationPlan: {
          sevenDayPlan: [1, 2, 3, 4, 5, 6, 7].map((d) => ({ day: d, title: `Day ${d}`, focusArea: 'Focus', tasks: [{ id: `d${d}`, text: 'Task', done: false }], practiceQuestions: ['Q'], learningResources: ['Case in Point'], revisionPriorities: 'Revise' })),
          topThreeActions: [{ title: 'A1', description: 'D', impact: 'High' }, { title: 'A2', description: 'D', impact: 'High' }, { title: 'A3', description: 'D', impact: 'Medium' }],
        },
        readinessLists: { strongestQualifications: ['Banking'], mostImportantSkillGaps: ['Consulting'], biggestInterviewRisks: ['Cases'], competitiveAdvantages: ['Tech'], topThreePriorities: ['P1', 'P2', 'P3'] },
      },
    };
  }
  return { text: 'UNKNOWN PROMPT' };
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/__log') {
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end(JSON.stringify({ fitCalls, log }));
  }
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    let payload = {};
    try { payload = JSON.parse(body); } catch {}
    const parts = (payload.contents || []).flatMap((c) => c.parts || []);
    const prompt = parts.map((p) => p.text || '').join('\n');
    const hasSearchTool = JSON.stringify(payload.tools || payload.config?.tools || []).includes('googleSearch');
    if (FREE_TIER && hasSearchTool) {
      res.writeHead(400, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ error: { code: 400, message: 'Grounding with Google Search is not available on the free tier.', status: 'FAILED_PRECONDITION' } }));
    }
    const r = replyFor(prompt, hasSearchTool);
    const text = r.json ? JSON.stringify(r.json) : r.text;
    const candidate = { content: { role: 'model', parts: [{ text }] }, finishReason: 'STOP', index: 0 };
    if (r.groundingMetadata) candidate.groundingMetadata = r.groundingMetadata;
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ candidates: [candidate], usageMetadata: {} }));
  });
});
server.listen(PORT, '127.0.0.1', () => console.log('mock gemini on', PORT));

import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Info,
  Target,
  FileCheck2,
  HelpCircle,
  Building2,
  BookmarkCheck,
  CalendarCheck2,
} from 'lucide-react';
import { CareerMatchAnalysis } from '../../types/career';
import { SectionKey } from '../NavigationTabs';
import { ClaimLegend } from '../ClaimTag';
import { ArcGauge, scoreBand } from '../ui/ArcGauge';
import { GradientBar } from '../ui/GradientBar';

interface OverviewSectionProps {
  analysis: CareerMatchAnalysis;
  onNavigate: (section: SectionKey) => void;
  visited?: Set<SectionKey>;
  onOpenNewInput?: () => void;
}

const DIMENSION_LABELS: Record<string, string> = {
  experience: 'Experience',
  skills: 'Skills',
  education: 'Education',
  industryKnowledge: 'Industry knowledge',
  jobResponsibilities: 'Job responsibilities',
  leadership: 'Leadership',
  technicalSkills: 'Technical skills',
  softSkills: 'Soft skills',
};

/** Original illustration: a CV and a JD matched line by line, with a fit gauge card. */
const MatchIllustration: React.FC<{ score: number }> = ({ score }) => (
  <svg viewBox="0 0 420 250" className="w-full h-auto" aria-hidden="true">
    <defs>
      <linearGradient id="ill-g" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#6b55f0" />
        <stop offset="1" stopColor="#12b5d9" />
      </linearGradient>
    </defs>
    <ellipse cx="210" cy="225" rx="170" ry="16" fill="rgba(91,69,224,.08)" />
    <g transform="rotate(-6 110 110)">
      <rect x="40" y="30" width="140" height="170" rx="12" fill="#fff" stroke="#d6d3ea" />
      <circle cx="66" cy="58" r="11" fill="#ebe7ff" />
      <rect x="84" y="50" width="70" height="7" rx="3.5" fill="#1d1b3d" />
      <rect x="84" y="62" width="44" height="5" rx="2.5" fill="#d6d3ea" />
      {[88, 100, 112, 124].map((y, i) => (
        <rect key={y} x="56" y={y} width={i % 2 ? 90 : 108} height="5" rx="2.5" fill={i === 1 || i === 2 ? '#a99cf7' : '#d6d3ea'} />
      ))}
      <rect x="56" y="146" width="40" height="6" rx="3" fill="#1d1b3d" />
      {[160, 172, 184].map((y, i) => (
        <rect key={y} x="56" y={y} width={i === 1 ? 70 : 100} height="5" rx="2.5" fill={i === 0 ? '#a99cf7' : '#d6d3ea'} />
      ))}
      <text x="56" y="196" fontSize="8" fontFamily="IBM Plex Mono, monospace" fill="#6a6989" letterSpacing="1">YOUR CV</text>
    </g>
    <g transform="rotate(5 310 110)">
      <rect x="240" y="26" width="140" height="170" rx="12" fill="#fff" stroke="#d6d3ea" />
      <rect x="256" y="44" width="16" height="12" rx="3" fill="none" stroke="#a99cf7" strokeWidth="2" />
      <rect x="280" y="46" width="72" height="7" rx="3.5" fill="#1d1b3d" />
      {[78, 90, 102, 114, 126].map((y, i) => (
        <rect key={y} x="256" y={y} width={i % 2 ? 84 : 108} height="5" rx="2.5" fill={i === 1 || i === 3 ? '#a99cf7' : '#d6d3ea'} />
      ))}
      <rect x="256" y="146" width="44" height="6" rx="3" fill="#1d1b3d" />
      {[160, 172].map((y) => (
        <rect key={y} x="256" y={y} width="96" height="5" rx="2.5" fill="#d6d3ea" />
      ))}
      <text x="256" y="190" fontSize="8" fontFamily="IBM Plex Mono, monospace" fill="#6a6989" letterSpacing="1">JOB DESCRIPTION</text>
    </g>
    <path d="M170 104 C 200 92, 220 92, 252 98" fill="none" stroke="#6b55f0" strokeWidth="2" strokeDasharray="4 5" />
    <path d="M168 128 C 200 140, 222 128, 252 120" fill="none" stroke="#12b5d9" strokeWidth="2" strokeDasharray="4 5" />
    <circle cx="210" cy="95" r="9" fill="#6b55f0" />
    <path d="M206 95l3 3 5-6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    <circle cx="210" cy="134" r="9" fill="#12b5d9" />
    <path d="M206 134l3 3 5-6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    <g>
      <rect x="150" y="168" width="124" height="54" rx="12" fill="#fff" stroke="#e4e2f2" />
      <circle cx="178" cy="195" r="16" fill="none" stroke="#e6e4f3" strokeWidth="5" />
      <circle
        cx="178"
        cy="195"
        r="16"
        fill="none"
        stroke="url(#ill-g)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={`${(2 * Math.PI * 16 * Math.max(0, Math.min(100, score))) / 100} 200`}
        transform="rotate(-90 178 195)"
      />
      <text x="178" y="199" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="IBM Plex Mono, monospace" fill="#14132b">
        {score}
      </text>
      <text x="202" y="191" fontSize="10" fontWeight="700" fontFamily="Manrope, sans-serif" fill="#14132b">Job fit</text>
      <text x="202" y="205" fontSize="8.5" fontFamily="Manrope, sans-serif" fill="#6a6989">{scoreBand(score).label.split(' ')[0]} match</text>
    </g>
    <path d="M330 232 l18 -22 l12 10 l22 -30" fill="none" stroke="#12b5d9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M374 188 l9 -2 l-1 9" fill="none" stroke="#12b5d9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const OverviewSection: React.FC<OverviewSectionProps> = ({ analysis, onNavigate, visited }) => {
  const { fitScore, cvOptimizer, readinessDashboard, metadata } = analysis;
  const seen = visited || new Set<SectionKey>();
  const fitVal = fitScore.overallScore;
  const atsVal = cvOptimizer.atsScore;
  const readyVal = readinessDashboard.interviewReadinessScore;
  const b = readinessDashboard.readinessScoreBreakdown;

  const dims = Object.entries(fitScore.dimensions || {});
  const missingKeywords =
    (cvOptimizer.missingKeywords?.hardSkills?.length || 0) +
    (cvOptimizer.missingKeywords?.tools?.length || 0) +
    (cvOptimizer.missingKeywords?.domainTerms?.length || 0);
  const strongCount = fitScore.requirementsComparison.filter((r) => r.status === 'strong_match').length;

  // Progress strip in the hero
  const pipeline = [
    { n: '01', title: 'Read the job and CV', sub: 'Every field extracted', done: true },
    { n: '02', title: 'Check your fit', sub: '8 areas, every requirement', done: seen.has('fit-score') || seen.has('strengths-gaps') },
    { n: '03', title: 'Improve your CV', sub: 'ATS check and rewrites', done: seen.has('cv-optimizer') },
    {
      n: '04',
      title: 'Prepare to interview',
      sub: 'Questions, cases, stories, plan',
      done: seen.has('interview-questions') && seen.has('story-bank') && seen.has('preparation-plan'),
    },
  ];
  const firstOpen = pipeline.findIndex((p) => !p.done);

  // "Your preparation" tracker
  const milestones: { key: SectionKey; title: string; sub: string }[] = [
    { key: 'fit-score', title: 'Check your fit', sub: 'See which requirements your CV proves' },
    { key: 'strengths-gaps', title: 'Review strengths and gaps', sub: 'Know what to lead with and what to fix' },
    { key: 'cv-optimizer', title: 'Finish your tailored CV', sub: 'Fill the placeholders and review the draft' },
    { key: 'interview-questions', title: 'Practise your questions', sub: 'Start with the high-priority ones' },
    { key: 'story-bank', title: 'Prepare your STAR stories', sub: 'Seven themes from your own experience' },
    { key: 'preparation-plan', title: 'Open your 7-day plan', sub: 'Schedule the week before your interview' },
  ];
  const doneCount = milestones.filter((m) => seen.has(m.key)).length;
  const nextMilestone = milestones.find((m) => !seen.has(m.key));

  const tiles: {
    key: SectionKey;
    title: string;
    text: string;
    icon: React.ElementType;
    tone: string;
    value: number;
    label: string;
    status: string;
  }[] = [
    {
      key: 'fit-score',
      title: 'Job fit',
      text: '',
      icon: Target,
      tone: '',
      value: fitVal,
      label: 'Job fit',
      status: `${scoreBand(fitVal).label} · ${strongCount} strong matches`,
    },
    {
      key: 'cv-optimizer',
      title: 'ATS readiness',
      text: '',
      icon: FileCheck2,
      tone: '',
      value: atsVal,
      label: 'ATS readiness',
      status: `${atsVal >= 75 ? 'Good' : atsVal >= 55 ? 'Fair' : 'Needs work'} · ${missingKeywords} missing keywords`,
    },
    {
      key: 'interview-readiness',
      title: 'Interview readiness',
      text: '',
      icon: CheckCircle2,
      tone: '',
      value: readyVal,
      label: 'Interview readiness',
      status: `${readyVal >= 75 ? 'Interview-ready' : readyVal >= 55 ? 'Getting there' : 'Needs preparation'} · ${b.storiesWithEvidence} of 7 stories`,
    },
  ];

  const bento: { key: SectionKey; title: string; text: string; icon: React.ElementType; iconCls: string }[] = [
    {
      key: 'cv-optimizer',
      title: 'ATS-ready CV',
      text: 'Keyword coverage, weak-bullet rewrites and a tailored draft that never invents experience.',
      icon: FileCheck2,
      iconCls: 'bg-[var(--tp-accent-soft)] text-[var(--tp-accent)]',
    },
    {
      key: 'interview-questions',
      title: 'Personal interview prep',
      text: 'Likely questions with sample answers from your CV, and a guide to judge your own answers.',
      icon: HelpCircle,
      iconCls: 'bg-emerald-50 text-emerald-700',
    },
    {
      key: 'company-research',
      title: 'Company and industry research',
      text: 'A live Google Search where every fact links to its source and shows its publication date.',
      icon: Building2,
      iconCls: 'bg-indigo-100 text-indigo-600',
    },
    {
      key: 'story-bank',
      title: 'STAR story bank',
      text: 'Seven stories drafted from your real experience, with prompts where details are missing.',
      icon: BookmarkCheck,
      iconCls: 'bg-[var(--tp-accent-soft)] text-[var(--tp-accent)]',
    },
    {
      key: 'preparation-plan',
      title: 'Seven-day plan',
      text: 'A day-by-day plan built around your gaps, with your three most effective actions first.',
      icon: CalendarCheck2,
      iconCls: 'bg-emerald-50 text-emerald-700',
    },
  ];

  return (
    <div className="space-y-8">
      {analysis.isDemo && (
        <div className="p-3.5 bg-amber-50/90 border border-amber-200 border-l-4 border-l-amber-400 rounded-xl text-xs text-amber-900 flex items-center gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Example data.</strong> You are viewing a fictional candidate and a fictional company. Choose "New analysis" to use
            your own job description and CV.
          </span>
        </div>
      )}

      {/* Hero */}
      <section className="tp-hero px-5 sm:px-10 pt-12 sm:pt-14 pb-6 sm:pb-8 text-center">
        <span className="tp-pill">
          <span className="tp-pulse-dot" aria-hidden="true" />
          Your career match report · {metadata.analysisDate || 'Today'}
        </span>
        <h1 className="mt-5 text-[2rem] sm:text-5xl leading-[1.06] font-bold text-slate-900 max-w-[22ch] mx-auto">
          {metadata.jobTitle || 'Your target role'}
          <br />
          {metadata.company ? (
            <>
              at <span className="tp-grad-text">{metadata.company}</span>
            </>
          ) : (
            <span className="tp-grad-text">employer not named</span>
          )}
        </h1>
        <p className="mt-4 text-[15px] sm:text-[1.05rem] text-slate-600 max-w-[62ch] mx-auto leading-relaxed">
          Prepared for <strong className="text-slate-900">{metadata.candidateName}</strong>. Every score is explained, every CV
          claim is checked against your CV, and every research fact links to its source.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          <button type="button" onClick={() => onNavigate('fit-score')} className="tp-btn tp-btn-primary !text-sm !px-5 !py-2.5">
            See your fit breakdown <ArrowRight className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => onNavigate('preparation-plan')} className="tp-btn !text-sm !px-5 !py-2.5 bg-white/70">
            Open the 7-day plan
          </button>
        </div>
        <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-1 font-mono text-[0.7rem] uppercase tracking-[0.06em] text-slate-500">
          {['Scores explained', 'Nothing invented', 'Sources cited'].map((t) => (
            <li key={t} className="flex items-center gap-1.5">
              <span className="text-[var(--tp-g2)] text-[0.6rem]">◆</span>
              {t}
            </li>
          ))}
        </ul>
        <ol className="tp-pipeline mt-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-left">
          {pipeline.map((p, i) => (
            <li key={p.n} className={`p-4 flex flex-col gap-0.5 min-w-0 ${p.done ? 'done' : ''} ${i === firstOpen ? 'on' : ''}`}>
              <span className="n font-mono text-[0.75rem] font-semibold text-slate-500 mb-1.5">
                {p.n}
                {p.done ? ' · done' : i === firstOpen ? ' · next' : ''}
              </span>
              <b className="font-display font-semibold text-[0.95rem] text-slate-900">{p.title}</b>
              <small className="text-[0.8rem] text-slate-500">{p.sub}</small>
            </li>
          ))}
        </ol>
      </section>

      {/* Score band */}
      <section>
        <div className="tp-eyebrow mb-3">Your results</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiles.map((t, i) => (
            <button
              key={t.key}
              type="button"
              onClick={() => onNavigate(t.key)}
              className={`tp-card tp-tile text-left md:text-center flex md:flex-col items-center gap-4 md:gap-2 px-5 py-5 md:pt-6 cursor-pointer ${
                i === 0 ? 'tp-tile-featured-fill' : ''
              }`}
            >
              <div className="shrink-0 w-[118px] md:w-[150px]">
                <ArcGauge value={t.value} label={t.label} size={150} />
              </div>
              <div className="flex flex-col md:items-center gap-1 min-w-0">
                <span className="font-display font-semibold text-[1.05rem] text-slate-900">{t.title}</span>
                <span className="text-[13px] text-slate-600">{t.status}</span>
                <span className="text-[13px] font-semibold text-[var(--tp-accent)] flex items-center gap-1">
                  See breakdown <ArrowRight className="w-3.5 h-3.5 tp-go" />
                </span>
              </div>
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500 leading-relaxed">{fitScore.disclaimer}</p>
      </section>

      {/* 2 x 2 dashboard */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="tp-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[1.02rem] font-semibold text-slate-900">Strongest qualifications</h3>
            <button type="button" onClick={() => onNavigate('strengths-gaps')} className="text-xs font-semibold text-indigo-600 underline underline-offset-2 cursor-pointer">
              All strengths
            </button>
          </div>
          <ul className="space-y-3">
            {(readinessDashboard.strongestQualifications.length
              ? readinessDashboard.strongestQualifications
              : readinessDashboard.competitiveAdvantages
            )
              .slice(0, 3)
              .map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[13.5px] text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
          </ul>
        </div>

        <div className="tp-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[1.02rem] font-semibold text-slate-900">Gaps to address</h3>
            <button type="button" onClick={() => onNavigate('strengths-gaps')} className="text-xs font-semibold text-indigo-600 underline underline-offset-2 cursor-pointer">
              All gaps
            </button>
          </div>
          <ul className="space-y-3">
            {readinessDashboard.mostImportantSkillGaps.slice(0, 3).map((gap, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[13.5px] text-slate-700">
                <span className="w-6 h-6 rounded-lg bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </span>
                <span className="leading-relaxed">{gap}</span>
              </li>
            ))}
            {readinessDashboard.mostImportantSkillGaps.length === 0 && (
              <li className="text-xs text-slate-500 italic">No priority skill gaps recorded.</li>
            )}
          </ul>
        </div>

        <div className="tp-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[1.02rem] font-semibold text-slate-900">Fit by area</h3>
            <button type="button" onClick={() => onNavigate('fit-score')} className="text-xs font-semibold text-indigo-600 underline underline-offset-2 cursor-pointer">
              Details
            </button>
          </div>
          <div className="space-y-2.5">
            {dims.map(([key, dim]) => (
              <div key={key} className="grid grid-cols-[minmax(0,9.5rem)_1fr_2.2rem] items-center gap-3 text-[13px]">
                <span className="text-slate-600 truncate">{DIMENSION_LABELS[key] || key}</span>
                <GradientBar value={dim.score} label={DIMENSION_LABELS[key]} />
                <span className="font-mono font-semibold text-slate-900 text-right">{dim.score}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="tp-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[1.02rem] font-semibold text-slate-900">Top priorities</h3>
            <button type="button" onClick={() => onNavigate('preparation-plan')} className="text-xs font-semibold text-indigo-600 underline underline-offset-2 cursor-pointer">
              7-day plan
            </button>
          </div>
          <ol className="space-y-3.5">
            {readinessDashboard.topThreePriorities.slice(0, 3).map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[13.5px] text-slate-700">
                <span className="tp-num-badge w-6 h-6 rounded-full flex items-center justify-center text-[12px] shrink-0">{i + 1}</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Preparation tracker */}
      <section className="tp-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="tp-eyebrow">Your preparation</div>
            <h3 className="mt-1 text-[1.05rem] font-semibold text-slate-900">
              {doneCount} of {milestones.length} steps opened
            </h3>
          </div>
          {nextMilestone ? (
            <button type="button" onClick={() => onNavigate(nextMilestone.key)} className="tp-btn tp-btn-primary self-start sm:self-auto">
              Next: {nextMilestone.title} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-xs font-semibold text-emerald-700">All steps opened. Good luck with the interview.</span>
          )}
        </div>
        <GradientBar value={(doneCount / milestones.length) * 100} label="Preparation steps opened" className="mt-4 !bg-[var(--tp-track)]" height={6} />
        <ol className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {milestones.map((m, i) => {
            const isDone = seen.has(m.key);
            const isNext = nextMilestone?.key === m.key;
            return (
              <li key={m.key}>
                <button
                  type="button"
                  onClick={() => onNavigate(m.key)}
                  className={`w-full h-full text-left flex items-start gap-3 rounded-2xl border px-3.5 py-3 transition-colors cursor-pointer ${
                    isNext
                      ? 'border-cyan-300 bg-[var(--tp-accent-soft)]'
                      : 'border-[var(--tp-glass-border)] bg-white/60 hover:bg-white'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-mono font-semibold shrink-0 border ${
                      isDone
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : isNext
                        ? 'tp-num-badge border-transparent'
                        : 'border-slate-300 text-slate-500'
                    }`}
                  >
                    {isDone ? '✓' : i + 1}
                  </span>
                  <span className="min-w-0">
                    <b className="block text-[13.5px] font-semibold text-slate-900">{m.title}</b>
                    <span className="block text-xs text-slate-500 mt-0.5">{m.sub}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Bento toolkit */}
      <section>
        <div className="tp-eyebrow">Inside the toolkit</div>
        <h2 className="mt-1 mb-4 text-2xl sm:text-[1.9rem] font-bold text-slate-900 leading-tight">
          Thirteen focused tools,
          <br className="hidden sm:block" /> one guided flow.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <button
            type="button"
            onClick={() => onNavigate('fit-score')}
            className="tp-card tp-tile relative text-left p-6 sm:col-span-2 lg:row-span-2 flex flex-col cursor-pointer overflow-hidden"
          >
            <ArrowRight className="tp-go absolute top-5 right-5 w-4 h-4" />
            <span className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </span>
            <h3 className="mt-4 text-[1.3rem] font-semibold text-slate-900">Fit check</h3>
            <p className="mt-1.5 text-sm text-slate-600 max-w-[46ch] leading-relaxed">
              Every requirement in the job checked against your CV, with the evidence and reasoning behind each score, across 8
              weighted areas.
            </p>
            <div className="mt-auto pt-4 self-center w-full max-w-[400px] hidden sm:block">
              <MatchIllustration score={fitVal} />
            </div>
          </button>
          {bento.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => onNavigate(t.key)}
                className="tp-card tp-tile relative text-left p-5 cursor-pointer"
              >
                <ArrowRight className="tp-go absolute top-5 right-5 w-4 h-4" />
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.iconCls}`}>
                  <Icon className="w-[18px] h-[18px]" />
                </span>
                <h3 className="mt-4 text-[1.02rem] font-semibold text-slate-900">{t.title}</h3>
                <p className="mt-1 text-[13px] text-slate-600 leading-relaxed">{t.text}</p>
              </button>
            );
          })}
        </div>
      </section>

      <ClaimLegend />

      <div className="p-3.5 tp-card !rounded-2xl text-xs text-slate-500 leading-relaxed flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
        <span>
          <strong className="text-slate-700">Decision support only.</strong> {fitScore.disclaimer}
        </span>
      </div>
    </div>
  );
};

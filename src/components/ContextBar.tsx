import React from 'react';
import { CareerMatchAnalysis } from '../types/career';
import { SectionKey } from './NavigationTabs';

/** Pill bar on every section: the role, plus the three scores as links (TalentPulse's context bar). */
export const ContextBar: React.FC<{ analysis: CareerMatchAnalysis; onNavigate: (s: SectionKey) => void }> = ({
  analysis,
  onNavigate,
}) => {
  const st = analysis.stageStatus;
  const ok = (k: 'fit' | 'cvOptimizer' | 'plan' | 'interview') => !st || st[k]?.status === 'ok';
  const scores: { label: string; value: number | null; to: SectionKey }[] = [
    { label: 'Fit', value: ok('fit') ? analysis.fitScore.overallScore : null, to: 'fit-score' },
    { label: 'ATS', value: ok('cvOptimizer') ? analysis.cvOptimizer.atsScore : null, to: 'cv-optimizer' },
    {
      label: 'Readiness',
      value: ok('fit') && ok('cvOptimizer') && ok('interview') && ok('plan') ? analysis.readinessDashboard.interviewReadinessScore : null,
      to: 'interview-readiness',
    },
  ];
  return (
    <div className="tp-card !rounded-[18px] sm:!rounded-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 sm:pl-5 sm:pr-2 py-2 print:hidden">
      <div className="text-[13px] text-slate-600 truncate min-w-0">
        <strong className="text-slate-900 font-semibold">{analysis.metadata.jobTitle || 'Target role'}</strong>
        {analysis.metadata.company ? <> at {analysis.metadata.company}</> : <> (employer not named)</>}
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {scores.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => onNavigate(s.to)}
            className="rounded-full border border-[var(--tp-glass-border)] bg-[var(--tp-glass-2)] hover:bg-white px-3 py-1 text-[12px] text-slate-600 cursor-pointer transition-colors"
          >
            {s.label}{' '}
            <b className="font-mono font-semibold tp-grad-text">{s.value === null ? '–' : s.value}</b>
          </button>
        ))}
      </div>
    </div>
  );
};

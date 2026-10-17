import React, { useState } from 'react';
import { Award, Target, FileCheck2, ShieldAlert, CheckCircle2, AlertTriangle, Copy, Check, MessageSquare, AlertCircle } from 'lucide-react';
import { ArcGauge } from '../ui/ArcGauge';
import { CareerMatchAnalysis } from '../../types/career';

interface InterviewReadinessSectionProps {
  analysis: CareerMatchAnalysis;
}

export const InterviewReadinessSection: React.FC<InterviewReadinessSectionProps> = ({ analysis }) => {
  const { readinessDashboard, fitScore, cvOptimizer } = analysis;
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 uppercase tracking-wider">
              <span>Section 13</span>
              <span>·</span>
              <span>Final Readiness Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Interview Readiness Dashboard
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Final executive evaluation synthesizing match scores, competitive advantages, interview risks, and master interview narrative answers.
            </p>
          </div>
        </div>

        {/* 3 score tiles with arc gauges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {[
            { label: 'Overall job fit', value: readinessDashboard.overallJobFitScore, note: 'Requirement alignment, weighted across 8 areas' },
            { label: 'ATS readiness', value: readinessDashboard.atsReadinessScore, note: 'How well an applicant tracking system can read and match your CV' },
            {
              label: 'Interview readiness',
              value: readinessDashboard.interviewReadinessScore,
              note: `Calculated in code: fit ${readinessDashboard.readinessScoreBreakdown.fitContribution} of 40, ATS ${readinessDashboard.readinessScoreBreakdown.atsContribution} of 20, STAR stories ${readinessDashboard.readinessScoreBreakdown.storyContribution} of 20, gaps ${readinessDashboard.readinessScoreBreakdown.gapContribution} of 20`,
            },
          ].map((t, i) => (
            <div
              key={t.label}
              className={`tp-tile rounded-[20px] border border-[var(--tp-glass-border)] bg-white/70 p-5 flex flex-col items-center text-center gap-2 ${i === 2 ? 'tp-tile-featured-fill' : ''}`}
            >
              <ArcGauge value={t.value} label={t.label} size={150} />
              <span className="font-display font-semibold text-[1.02rem] text-slate-900">{t.label}</span>
              <span className="text-xs text-slate-600 leading-relaxed">{t.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4-Quadrant Strategic Synthesis Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Quadrant 1: Strongest Qualifications */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Strongest Qualifications
            </h3>
          </div>
          <ul className="space-y-2">
            {readinessDashboard.strongestQualifications.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-700">
                <span className="font-mono text-emerald-600 font-bold shrink-0">0{idx + 1}.</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quadrant 2: Competitive Advantages */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
            <Award className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Competitive Advantages Over Other Candidates
            </h3>
          </div>
          <ul className="space-y-2">
            {readinessDashboard.competitiveAdvantages.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-700">
                <span className="font-mono text-indigo-600 font-bold shrink-0">0{idx + 1}.</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quadrant 3: Most Important Skill Gaps */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Most Important Skill Gaps
            </h3>
          </div>
          <ul className="space-y-2">
            {readinessDashboard.mostImportantSkillGaps.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-700">
                <span className="font-mono text-amber-600 font-bold shrink-0">0{idx + 1}.</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quadrant 4: Biggest Interview Risks */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Biggest Potential Interview Risks
            </h3>
          </div>
          <ul className="space-y-2">
            {readinessDashboard.biggestInterviewRisks.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-700">
                <span className="font-mono text-rose-600 font-bold shrink-0">0{idx + 1}.</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Top 3 Preparation Priorities */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Top Three Immediate Preparation Priorities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {readinessDashboard.topThreePriorities.map((item, idx) => (
            <div key={idx} className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg text-indigo-950 font-medium leading-relaxed">
              <span className="font-mono font-bold text-indigo-600 block mb-1">Priority 0{idx + 1}:</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* CV Red Flags & Honest Mitigation Strategies */}
      {readinessDashboard.cvRedFlagsAndMitigations && readinessDashboard.cvRedFlagsAndMitigations.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Identified CV Red Flags & Honest Interview Positioning Strategies
            </h3>
          </div>
          <div className="space-y-3 text-xs">
            {readinessDashboard.cvRedFlagsAndMitigations.map((flagItem, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-rose-900 font-bold">
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-[10px] font-mono">FLAG 0{idx + 1}</span>
                  <span>{flagItem.flag}</span>
                </div>
                <div className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200/80 leading-relaxed">
                  <strong className="text-slate-900 block mb-1">Honest & Confident Mitigation Strategy:</strong>
                  {flagItem.mitigationStrategy}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personalized Career Coaching: The "Big 4" Tailored Narrative Answers */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 uppercase tracking-wider">
            <span>Career Coaching</span>
            <span>·</span>
            <span>The Big 4 Master Narratives</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Personalized Master Answers for the Big 4 Core Questions
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Tailored specifically connecting your documented achievements directly to the role requirements and company culture.
          </p>
        </div>

        <div className="space-y-5 text-xs">
          {/* 1. Tell Me About Yourself */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                1. "Tell Me About Yourself" (2-Minute Elevator Pitch)
              </span>
              <button
                onClick={() => handleCopy('pitch', readinessDashboard.coreInterviewNarratives.tellMeAboutYourself)}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                {copiedKey === 'pitch' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'pitch' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-slate-800 leading-relaxed font-serif sm:text-sm bg-white p-3.5 rounded-lg border border-slate-200">
              "{readinessDashboard.coreInterviewNarratives.tellMeAboutYourself}"
            </p>
          </div>

          {/* 2. Why This Company? */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                2. "Why This Company?"
              </span>
              <button
                onClick={() => handleCopy('whyCompany', readinessDashboard.coreInterviewNarratives.whyThisCompany)}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                {copiedKey === 'whyCompany' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'whyCompany' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-slate-800 leading-relaxed font-serif sm:text-sm bg-white p-3.5 rounded-lg border border-slate-200">
              "{readinessDashboard.coreInterviewNarratives.whyThisCompany}"
            </p>
          </div>

          {/* 3. Why This Role? */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                3. "Why This Role?"
              </span>
              <button
                onClick={() => handleCopy('whyRole', readinessDashboard.coreInterviewNarratives.whyThisRole)}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                {copiedKey === 'whyRole' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'whyRole' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-slate-800 leading-relaxed font-serif sm:text-sm bg-white p-3.5 rounded-lg border border-slate-200">
              "{readinessDashboard.coreInterviewNarratives.whyThisRole}"
            </p>
          </div>

          {/* 4. Why Should We Hire You? */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                4. "Why Should We Hire You?" (The Ultimate Closing Value Proposition)
              </span>
              <button
                onClick={() => handleCopy('whyHire', readinessDashboard.coreInterviewNarratives.whyShouldWeHireYou)}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                {copiedKey === 'whyHire' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'whyHire' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-slate-800 leading-relaxed font-serif sm:text-sm bg-white p-3.5 rounded-lg border border-slate-200">
              "{readinessDashboard.coreInterviewNarratives.whyShouldWeHireYou}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

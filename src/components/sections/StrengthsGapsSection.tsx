import React from 'react';
import { ShieldCheck, AlertCircle, AlertTriangle, Info, BookOpen, ExternalLink, ArrowRight } from 'lucide-react';
import { CareerMatchAnalysis } from '../../types/career';

interface StrengthsGapsSectionProps {
  analysis: CareerMatchAnalysis;
}

export const StrengthsGapsSection: React.FC<StrengthsGapsSectionProps> = ({ analysis }) => {
  const { strengthsAndGaps } = analysis;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Section Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 uppercase tracking-wider">
          <span>Section 05</span>
          <span>·</span>
          <span>Core Advantages & Remediation</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
          Candidate Strengths & Gap Remediation
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Up to five CV-backed strengths paired with an actionable taxonomy of critical, moderate, and minor skill gaps.
        </p>
      </div>

      {/* Top 5 Strengths */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Top Candidate Strengths (Backed by Documented CV Evidence)
          </h3>
        </div>

        {strengthsAndGaps.topStrengths.length < 5 && (
          <p className="mb-4 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3">
            Only {strengthsAndGaps.topStrengths.length} strength{strengthsAndGaps.topStrengths.length === 1 ? ' is' : 's are'} shown
            because the CV does not give direct evidence for more. Adding concrete results to the CV may surface others.
          </p>
        )}

        <div className="grid grid-cols-1 gap-4">
          {strengthsAndGaps.topStrengths.map((item, idx) => (
            <div key={idx} className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-600 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                    0{idx + 1}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</h4>
                </div>
                <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200/70 leading-relaxed font-mono text-[11px]">
                  <strong className="text-slate-400 font-sans uppercase text-[10px] tracking-wider block mb-1">
                    CV Evidence:
                  </strong>
                  {item.cvEvidence}
                </div>
              </div>

              <div className="md:w-80 shrink-0 bg-emerald-50/40 border border-emerald-100 p-3 rounded-lg flex flex-col justify-center">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  Strategic Impact for Role:
                </span>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  {item.impactForRole}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gaps Breakdown (Critical, Moderate, Minor) */}
      <div className="space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">Identified Gaps & Remediation Plans</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Severity classifications with strategic importance, practical interview mitigation, and curated learning resources
          </p>
        </div>

        {/* 1. Critical Gaps */}
        <div className="bg-white rounded-xl border border-rose-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-rose-100">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900">
              Critical Gaps ({strengthsAndGaps.criticalGaps.length}) — High Recruiter Scrutiny
            </h4>
          </div>

          <div className="space-y-4">
            {strengthsAndGaps.criticalGaps.map((gap) => (
              <div key={gap.id} className="bg-rose-50/40 border border-rose-100 rounded-xl p-4">
                <h5 className="text-xs sm:text-sm font-bold text-slate-900">{gap.title}</h5>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  <strong className="text-rose-900 font-medium">Why it matters:</strong> {gap.importance}
                </p>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-rose-100 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-800 block mb-1">Practical Mitigation:</span>
                    <p className="text-slate-600 leading-relaxed">{gap.suggestedAction}</p>
                  </div>

                  {gap.learningResource && (
                    <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between">
                      <div>
                        <span className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Recommended Learning Resource ({gap.learningResource.type}):</span>
                        </span>
                        <p className="text-slate-600">{gap.learningResource.name}</p>
                      </div>
                      {gap.learningResource.url && (
                        <a
                          href={gap.learningResource.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 text-[11px]"
                        >
                          <span>Open Resource</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Moderate Gaps */}
        <div className="bg-white rounded-xl border border-amber-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-amber-100">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Moderate Gaps ({strengthsAndGaps.moderateGaps.length}) — Can Be Addressed via Experience Framing
            </h4>
          </div>

          <div className="space-y-4">
            {strengthsAndGaps.moderateGaps.map((gap) => (
              <div key={gap.id} className="bg-amber-50/40 border border-amber-100 rounded-xl p-4">
                <h5 className="text-xs sm:text-sm font-bold text-slate-900">{gap.title}</h5>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  <strong className="text-amber-900 font-medium">Importance:</strong> {gap.importance}
                </p>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-amber-100 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-800 block mb-1">Practical Mitigation:</span>
                    <p className="text-slate-600 leading-relaxed">{gap.suggestedAction}</p>
                  </div>

                  {gap.learningResource && (
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Recommended Resource:</span>
                      </span>
                      <p className="text-slate-600">{gap.learningResource.name}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Minor Gaps */}
        {strengthsAndGaps.minorGaps.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <Info className="w-4 h-4 text-slate-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Minor Gaps ({strengthsAndGaps.minorGaps.length}) — Secondary Preferences
              </h4>
            </div>

            <div className="space-y-3">
              {strengthsAndGaps.minorGaps.map((gap) => (
                <div key={gap.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <div className="font-semibold text-slate-900">{gap.title}</div>
                  <p className="text-slate-600 mt-1 leading-relaxed">{gap.suggestedAction}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

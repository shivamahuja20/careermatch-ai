import React, { useState } from 'react';
import { Target, ShieldAlert, CheckCircle2, AlertTriangle, XCircle, Filter, Info, ShieldCheck } from 'lucide-react';
import { ArcGauge, scoreBand } from '../ui/ArcGauge';
import { GradientBar } from '../ui/GradientBar';
import { CareerMatchAnalysis, RequirementMatch } from '../../types/career';
import { ClaimTag } from '../ClaimTag';

interface FitScoreSectionProps {
  analysis: CareerMatchAnalysis;
}

export const FitScoreSection: React.FC<FitScoreSectionProps> = ({ analysis }) => {
  const { fitScore } = analysis;
  const [statusFilter, setStatusFilter] = useState<'all' | 'strong_match' | 'partial_match' | 'gap'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = Array.from(
    new Set(fitScore.requirementsComparison.map((r) => r.category))
  );

  const filteredRequirements = fitScore.requirementsComparison.filter((item) => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesStatus && matchesCategory;
  });

  const strongCount = fitScore.requirementsComparison.filter((r) => r.status === 'strong_match').length;
  const partialCount = fitScore.requirementsComparison.filter((r) => r.status === 'partial_match').length;
  const gapCount = fitScore.requirementsComparison.filter((r) => r.status === 'gap').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Score Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 uppercase tracking-wider">
              <span>Section 04</span>
              <span>·</span>
              <span>Quantitative Job Fit</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              AI-Estimated Job Fit Analysis
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {fitScore.scoreExplanation}
            </p>
          </div>

          {/* Large Visual Score Card */}
          <div className="flex items-center gap-5 tp-tile-featured-fill p-5 rounded-2xl shrink-0">
            <div className="text-center">
              <ArcGauge value={fitScore.overallScore} label="Job fit" size={150} />
              <div className="text-[11px] font-semibold text-slate-600 mt-1.5">{scoreBand(fitScore.overallScore).label}</div>
            </div>
            <div className="h-16 w-px bg-[var(--tp-glass-border)]" />
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{strongCount} Strong Matches</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-700 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{partialCount} Partial Matches</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-700 font-medium">
                <XCircle className="w-3.5 h-3.5" />
                <span>{gapCount} Gaps</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory Ethical Disclaimer */}
        <div className="mt-4 p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">Important Decision-Support Notice:</strong> {fitScore.disclaimer}
          </div>
        </div>
      </div>

      {/* 8 Dimension Breakdown Matrix */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">8 Evaluated Fit Dimensions</h3>
          <p className="text-xs text-slate-500 mt-0.5">Weighted criteria assessing candidate qualifications against the position specification</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(fitScore.dimensions).map(([key, dim]) => {
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
            return (
              <div key={key} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-900">{label}</span>
                    <span className="text-[11px] font-mono text-slate-400">wt: {dim.weight}%</span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-extrabold text-slate-900">{dim.score}</span>
                    <span className="text-xs text-slate-400">/ 100</span>
                  </div>

                  <GradientBar value={dim.score} label={label} className="mb-3" height={7} />

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-3">
                    {dim.explanation}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] space-y-1">
                  {dim.keyStrengths?.[0] && (
                    <div className="text-emerald-800 flex items-start gap-1">
                      <span className="font-bold shrink-0">+</span>
                      <span className="truncate">{dim.keyStrengths[0]}</span>
                    </div>
                  )}
                  {dim.keyShortfalls?.[0] && (
                    <div className="text-amber-800 flex items-start gap-1">
                      <span className="font-bold shrink-0">-</span>
                      <span className="truncate">{dim.keyShortfalls[0]}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Requirement-by-Requirement Comparison Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Requirement-by-Requirement Comparison</h3>
            <p className="text-xs text-slate-500 mt-0.5">Direct mapping of JD requirements against documented CV evidence</p>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Segmented Buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({fitScore.requirementsComparison.length})
              </button>
              <button
                onClick={() => setStatusFilter('strong_match')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  statusFilter === 'strong_match' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Strong ({strongCount})
              </button>
              <button
                onClick={() => setStatusFilter('partial_match')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  statusFilter === 'partial_match' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Partial ({partialCount})
              </button>
              <button
                onClick={() => setStatusFilter('gap')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  statusFilter === 'gap' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Gaps ({gapCount})
              </button>
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-1/4">JD Requirement</th>
                <th className="py-3 px-4 w-32">Status</th>
                <th className="py-3 px-4 w-1/3">Documented CV Evidence</th>
                <th className="py-3 px-4">Match Analysis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequirements.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 align-top">
                    <div className="font-semibold text-slate-900">{item.requirement}</div>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="text-[11px] text-slate-400">{item.category}</span>
                      {item.claimType && <ClaimTag type={item.claimType} />}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 align-top">
                    {item.status === 'strong_match' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Strong Match</span>
                      </span>
                    )}
                    {item.status === 'partial_match' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Partial Match</span>
                      </span>
                    )}
                    {item.status === 'gap' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-800 border border-rose-200">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        <span>Gap</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 align-top">
                    <p className="text-slate-700 leading-relaxed font-mono text-[11px] bg-slate-50 p-2 rounded border border-slate-200/60">
                      {item.cvEvidence}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 align-top">
                    <p className="text-slate-600 leading-relaxed">
                      {item.analysis}
                    </p>
                  </td>
                </tr>
              ))}
              {filteredRequirements.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                    No requirements match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

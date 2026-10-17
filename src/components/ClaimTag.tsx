import React from 'react';
import { ClaimType } from '../types/career';

interface ClaimTagProps {
  type?: ClaimType;
  className?: string;
}

export const ClaimTag: React.FC<ClaimTagProps> = ({ type = 'AI recommendation', className = '' }) => {
  const styles: Record<ClaimType, { bg: string; text: string; border: string }> = {
    'Fact (from CV)': {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
    },
    'Fact (from JD)': {
      bg: 'bg-indigo-50',
      text: 'text-indigo-800',
      border: 'border-indigo-200',
    },
    'Verified (sourced)': {
      bg: 'bg-cyan-50',
      text: 'text-cyan-800',
      border: 'border-cyan-200',
    },
    'Assumption': {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
    },
    'AI recommendation': {
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      border: 'border-purple-200',
    },
  };

  const style = styles[type] || styles['AI recommendation'];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${style.bg} ${style.text} ${style.border} ${className}`}
      title={`Claim verification status: ${type}`}
    >
      {type}
    </span>
  );
};

export const ClaimLegend: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 ${className}`}>
      <span className="font-semibold text-slate-800 block mb-1 text-[11px] uppercase tracking-wider">
        Evidence & Classification Legend:
      </span>
      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <ClaimTag type="Fact (from CV)" />
        <span className="text-slate-500">Verified from candidate CV</span>
        <span className="text-slate-300">·</span>
        <ClaimTag type="Fact (from JD)" />
        <span className="text-slate-500">Stated in job description</span>
        <span className="text-slate-300">·</span>
        <ClaimTag type="Verified (sourced)" />
        <span className="text-slate-500">Confirmed via grounded search</span>
        <span className="text-slate-300">·</span>
        <ClaimTag type="Assumption" />
        <span className="text-slate-500">Inferred baseline</span>
        <span className="text-slate-300">·</span>
        <ClaimTag type="AI recommendation" />
        <span className="text-slate-500">Model-generated coaching</span>
      </div>
    </div>
  );
};

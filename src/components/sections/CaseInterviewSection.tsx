import React, { useState } from 'react';
import { BriefcaseBusiness, Calculator, HelpCircle, Layers, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { CareerMatchAnalysis } from '../../types/career';

interface CaseInterviewSectionProps {
  analysis: CareerMatchAnalysis;
}

export const CaseInterviewSection: React.FC<CaseInterviewSectionProps> = ({ analysis }) => {
  const { caseInterviewQuestions } = analysis;
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);

  if (!caseInterviewQuestions || caseInterviewQuestions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
        No case interviews required for this role profile.
      </div>
    );
  }

  const activeCase = caseInterviewQuestions[selectedCaseIdx] || caseInterviewQuestions[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 uppercase tracking-wider">
              <span>Section 08</span>
              <span>·</span>
              <span>Strategy & Quantitative Case Drills</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Case Interview Preparation Questionnaire
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Structured consulting and business problem-solving cases spanning profitability, market entry, pricing, operations, and market sizing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Select Case:</span>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
              {caseInterviewQuestions.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCaseIdx(i)}
                  className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                    selectedCaseIdx === i
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Case 0{i + 1}: {c.caseType}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Case Container */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Case Title & Type Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 uppercase tracking-wider">
              {activeCase.caseType} Case
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-2">
              {activeCase.title}
            </h3>
          </div>
        </div>

        {/* 1. Case Scenario */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200/80">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
            Case Prompt & Business Scenario:
          </span>
          <p className="text-xs text-slate-800 leading-relaxed font-serif sm:text-sm">
            "{activeCase.scenario}"
          </p>
        </div>

        {/* 2-Column: Interviewer Objective & Recommended Framework */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Interviewer Objective */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block mb-1">
              What the Interviewer is Evaluating:
            </span>
            <p className="text-slate-700 leading-relaxed">{activeCase.interviewerObjective}</p>
          </div>

          {/* Recommended Framework */}
          <div className="bg-indigo-50/40 p-4 rounded-xl border border-indigo-100">
            <span className="font-bold text-indigo-950 uppercase tracking-wider text-[11px] block mb-1">
              Recommended Problem Framework:
            </span>
            <p className="text-indigo-900 leading-relaxed font-mono text-[11px]">
              {activeCase.recommendedFramework}
            </p>
          </div>
        </div>

        {/* 3. Key Mathematical Drivers & Formulas */}
        {activeCase.keyFormulasOrDrivers && activeCase.keyFormulasOrDrivers.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Calculator className="w-3.5 h-3.5 text-indigo-600" />
              <span>Key Quantitative Drivers & Equations</span>
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeCase.keyFormulasOrDrivers.map((formula, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800">
                  {formula}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Step-by-Step Solution Walkthrough */}
        <div>
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-3">
            Structured Solution Walkthrough:
          </span>
          <div className="space-y-3">
            {activeCase.stepByStepSolution.map((step, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 text-xs text-slate-800 flex items-start gap-3">
                <span className="font-mono text-indigo-600 font-bold shrink-0 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                  0{idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Difficult Follow-Ups */}
        {activeCase.interviewerFollowUps && activeCase.interviewerFollowUps.length > 0 && (
          <div className="p-4 bg-rose-50/30 border border-rose-100 rounded-xl text-xs">
            <span className="font-bold text-rose-950 uppercase tracking-wider text-[11px] block mb-2">
              Anticipated Pressure & Follow-Up Probes:
            </span>
            <ul className="space-y-1.5">
              {activeCase.interviewerFollowUps.map((fu, idx) => (
                <li key={idx} className="text-slate-800 flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">•</span>
                  <span className="italic leading-relaxed">{fu}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

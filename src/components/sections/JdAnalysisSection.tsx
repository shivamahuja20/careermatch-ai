import React from 'react';
import { Briefcase, Building2, Layers, CheckSquare, GraduationCap, Wrench, Globe2, Sparkles, Info } from 'lucide-react';
import { CareerMatchAnalysis } from '../../types/career';

interface JdAnalysisSectionProps {
  analysis: CareerMatchAnalysis;
}

export const JdAnalysisSection: React.FC<JdAnalysisSectionProps> = ({ analysis }) => {
  const { jdAnalysis } = analysis;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Demo Banner */}
      {analysis.isDemo && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>DEMO DATA:</strong> Illustrative job description for a fictional company.
          </span>
        </div>
      )}

      {/* Header Info Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 uppercase tracking-wider">
              <span>Section 02</span>
              <span>·</span>
              <span>Target Role Extraction</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              {jdAnalysis.jobTitle || 'Job Title Not Specified'}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2">
              <span className="flex items-center gap-1 font-semibold text-slate-900">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {jdAnalysis.company || 'Company Not Specified'}
              </span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                Seniority: <strong className="text-slate-800">{jdAnalysis.seniorityLevel || 'Standard'}</strong>
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 mt-4 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-100">
          <strong className="text-slate-900 font-semibold">Role Summary:</strong> {jdAnalysis.summary || 'No summary available.'}
        </p>
      </div>

      {/* Grid: Responsibilities & Qualifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Responsibilities */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <CheckSquare className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Core Responsibilities</h3>
          </div>
          <ul className="space-y-2.5">
            {(jdAnalysis.responsibilities || []).map((resp, i) => (
              <li key={`resp-${i}`} className="text-xs text-slate-700 flex items-start gap-2.5 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                <span className="font-mono text-indigo-600 font-bold shrink-0">{String(i + 1).padStart(2, '0')}.</span>
                <span className="leading-relaxed">{resp}</span>
              </li>
            ))}
            {(!jdAnalysis.responsibilities || jdAnalysis.responsibilities.length === 0) && (
              <li className="text-xs text-slate-400 italic">No specific responsibilities extracted.</li>
            )}
          </ul>
        </div>

        {/* Qualifications */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Key Qualifications & Prerequisites</h3>
          </div>
          <ul className="space-y-2.5">
            {(jdAnalysis.qualifications || []).map((qual, i) => (
              <li key={`qual-${i}`} className="text-xs text-slate-700 flex items-start gap-2.5 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                <span className="font-mono text-emerald-600 font-bold shrink-0">{String(i + 1).padStart(2, '0')}.</span>
                <span className="leading-relaxed">{qual}</span>
              </li>
            ))}
            {(!jdAnalysis.qualifications || jdAnalysis.qualifications.length === 0) && (
              <li className="text-xs text-slate-400 italic">No specific qualifications extracted.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Required vs Preferred Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Required Must-Have Skills</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(jdAnalysis.requiredSkills || []).map((skill, i) => (
              <span
                key={`req-${i}`}
                className="text-xs px-2.5 py-1 rounded bg-indigo-50/80 text-indigo-900 font-medium border border-indigo-100"
              >
                {skill}
              </span>
            ))}
            {(!jdAnalysis.requiredSkills || jdAnalysis.requiredSkills.length === 0) && (
              <span className="text-xs text-slate-400 italic">No required skills parsed.</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">Preferred & Nice-to-Have Skills</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {jdAnalysis.preferredSkills && jdAnalysis.preferredSkills.length > 0 ? (
              jdAnalysis.preferredSkills.map((skill, i) => (
                <span
                  key={`pref-${i}`}
                  className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-medium border border-slate-200"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No preferred skills listed.</span>
            )}
          </div>
        </div>
      </div>

      {/* Tools & Industry Knowledge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-bold text-slate-900">Tools & Technology Stack</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(jdAnalysis.toolsAndTechStack || []).map((tool, i) => (
              <span
                key={`tool-${i}`}
                className="text-xs font-mono px-2.5 py-1 rounded bg-slate-50 text-slate-800 border border-slate-200"
              >
                {tool}
              </span>
            ))}
            {(!jdAnalysis.toolsAndTechStack || jdAnalysis.toolsAndTechStack.length === 0) && (
              <span className="text-xs text-slate-400 italic">No tools or tech stack specified.</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Globe2 className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-bold text-slate-900">Industry & Domain Knowledge</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(jdAnalysis.industryKnowledge || []).map((domain, i) => (
              <span
                key={`dom-${i}`}
                className="text-xs px-2.5 py-1 rounded bg-slate-50 text-slate-800 border border-slate-200 font-medium"
              >
                {domain}
              </span>
            ))}
            {(!jdAnalysis.industryKnowledge || jdAnalysis.industryKnowledge.length === 0) && (
              <span className="text-xs text-slate-400 italic">No domain topics parsed.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { User, Briefcase, GraduationCap, Award, TrendingUp, FolderGit2, CheckCircle2, Info } from 'lucide-react';
import { CareerMatchAnalysis } from '../../types/career';

interface CvAnalysisSectionProps {
  analysis: CareerMatchAnalysis;
}

export const CvAnalysisSection: React.FC<CvAnalysisSectionProps> = ({ analysis }) => {
  const { cvAnalysis } = analysis;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Demo Banner */}
      {analysis.isDemo && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>DEMO DATA:</strong> Illustrative CV for a fictional candidate.
          </span>
        </div>
      )}

      {/* Header Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 uppercase tracking-wider">
              <span>Section 03</span>
              <span>·</span>
              <span>Candidate Profile Extraction</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
              <User className="w-5 h-5 text-slate-400" />
              <span>{cvAnalysis.candidateName || 'Candidate Profile'}</span>
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2">
              <span className="flex items-center gap-1 font-semibold text-slate-900">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {cvAnalysis.currentOrLatestRole || 'Current Role Not Stated'}
              </span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1">
                Experience: <strong className="text-slate-800">{cvAnalysis.yearsOfExperience || 'Not specified'}</strong>
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 mt-4 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-100">
          <strong className="text-slate-900 font-semibold">Candidate Summary:</strong> {cvAnalysis.summary || 'No summary parsed.'}
        </p>
      </div>

      {/* Measurable Results & Quantified Metrics */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">Extracted Measurable Results & Impact Metrics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(cvAnalysis.measurableResults || []).map((result, i) => (
            <div key={`res-${i}`} className="bg-emerald-50/50 border border-emerald-100/80 rounded-xl p-3.5 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-xs font-medium text-slate-800 leading-relaxed">{result}</span>
            </div>
          ))}
          {(!cvAnalysis.measurableResults || cvAnalysis.measurableResults.length === 0) && (
            <div className="col-span-3 text-xs text-slate-400 italic">No explicit measurable metrics found in CV.</div>
          )}
        </div>
      </div>

      {/* Key Projects */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <FolderGit2 className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Key Projects & Systems Shipped</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(cvAnalysis.keyProjects || []).map((proj, i) => (
            <div key={`proj-${i}`} className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">{proj.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{proj.description}</p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-200/70 text-xs text-indigo-900 font-semibold flex items-center gap-1.5">
                <span className="text-slate-400 font-normal">Impact:</span>
                <span>{proj.impact}</span>
              </div>
            </div>
          ))}
          {(!cvAnalysis.keyProjects || cvAnalysis.keyProjects.length === 0) && (
            <div className="col-span-2 text-xs text-slate-400 italic">No specific projects parsed.</div>
          )}
        </div>
      </div>

      {/* 2-Column: Education, Achievements & Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Education */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-bold text-slate-900">Education & Academic Background</h3>
          </div>
          <div className="space-y-3">
            {(cvAnalysis.education || []).map((edu, i) => (
              <div key={`edu-${i}`} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-xs font-bold text-slate-900">{edu.degree}</div>
                <div className="text-xs text-slate-600 flex items-center justify-between mt-1">
                  <span>{edu.institution}</span>
                  {edu.year && <span className="text-slate-400 font-mono text-[11px]">{edu.year}</span>}
                </div>
              </div>
            ))}
            {(!cvAnalysis.education || cvAnalysis.education.length === 0) && (
              <div className="text-xs text-slate-400 italic">No education entries extracted.</div>
            )}
          </div>
        </div>

        {/* Core Skills & Certifications */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">Extracted Core Skills & Certifications</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Core Verified Skills
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(cvAnalysis.coreSkills || []).map((skill, i) => (
                  <span
                    key={`skill-${i}`}
                    className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-medium border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {cvAnalysis.certifications && cvAnalysis.certifications.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Certifications & Honors
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cvAnalysis.certifications.map((cert, i) => (
                    <span
                      key={`cert-${i}`}
                      className="text-xs px-2.5 py-1 rounded bg-amber-50 text-amber-900 font-medium border border-amber-200"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

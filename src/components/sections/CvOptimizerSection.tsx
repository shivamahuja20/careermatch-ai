import React, { useState } from 'react';
import { FileCheck2, Copy, Check, Download, AlertTriangle, ArrowRight, Sparkles, Tag, ShieldAlert, FileText } from 'lucide-react';
import { ArcGauge } from '../ui/ArcGauge';
import { CareerMatchAnalysis } from '../../types/career';
import { exportMarkdownToDocx } from '../../utils/docxExport';

interface CvOptimizerSectionProps {
  analysis: CareerMatchAnalysis;
}

// Safe file name such as "Priya_Sharma_Tailored_CV_Example_Consulting"
function cvFileStem(metadata: { candidateName: string; company: string; jobTitle: string }): string {
  const clean = (x: string) => (x || '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  const who = clean(metadata.candidateName) || 'Candidate';
  const where = clean(metadata.company) || clean(metadata.jobTitle) || 'Role';
  return `${who}_Tailored_CV_${where}`;
}

export const CvOptimizerSection: React.FC<CvOptimizerSectionProps> = ({ analysis }) => {
  const { cvOptimizer, metadata } = analysis;
  const [copied, setCopied] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [activeTab, setActiveTab] = useState<'rewrites' | 'tailored-cv'>('tailored-cv');

  const handleCopyCv = () => {
    navigator.clipboard.writeText(cvOptimizer.tailoredCvMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCv = () => {
    const element = document.createElement('a');
    const file = new Blob([cvOptimizer.tailoredCvMarkdown], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${cvFileStem(metadata)}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadDocx = async () => {
    setIsExportingDocx(true);
    try {
      const filename = cvFileStem(metadata);
      await exportMarkdownToDocx(cvOptimizer.tailoredCvMarkdown, filename);
    } catch (err) {
      console.error('Failed to export DOCX:', err);
    } finally {
      setIsExportingDocx(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top ATS Score Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 uppercase tracking-wider">
              <span>Section 06</span>
              <span>·</span>
              <span>ATS Optimization & CV Tailoring</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              CV Optimization & ATS Readiness
            </h2>
            <p className="text-xs text-slate-600 mt-2 max-w-2xl leading-relaxed">
              {cvOptimizer.atsExplanation}
            </p>
          </div>

          <div className="flex items-center gap-5 tp-tile-featured-fill p-5 rounded-2xl shrink-0">
            <div className="text-center">
              <ArcGauge value={cvOptimizer.atsScore} label="ATS readiness" size={140} />
              <div className="text-[11px] font-semibold text-slate-600 mt-1.5">ATS readiness</div>
            </div>
            <div className="h-14 w-px bg-[var(--tp-glass-border)]" />
            <div className="text-xs text-slate-600 space-y-0.5">
              <div>
                <strong className="text-slate-900">{cvOptimizer.missingKeywords.hardSkills.length}</strong> missing skills
              </div>
              <div>
                <strong className="text-slate-900">{cvOptimizer.weakStatements.length}</strong> bullets improved
              </div>
            </div>
          </div>
        </div>

        {/* Missing Keywords Grid */}
        <div className="mt-6 pt-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Tag className="w-3.5 h-3.5 text-indigo-600" />
            <span>Missing Keyword & Skill Requirements Identified from JD</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Hard Skills */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-800 block mb-2">Hard Technical Skills:</span>
              <div className="flex flex-wrap gap-1.5">
                {cvOptimizer.missingKeywords.hardSkills.map((k, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 font-medium border border-rose-200 text-[11px]">
                    + {k}
                  </span>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-800 block mb-2">Tools & Platforms:</span>
              <div className="flex flex-wrap gap-1.5">
                {cvOptimizer.missingKeywords.tools.map((k, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 font-medium border border-indigo-200 text-[11px]">
                    + {k}
                  </span>
                ))}
              </div>
            </div>

            {/* Domain Terms */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-800 block mb-2">Domain & Industry Keywords:</span>
              <div className="flex flex-wrap gap-1.5">
                {cvOptimizer.missingKeywords.domainTerms.map((k, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-medium border border-amber-200 text-[11px]">
                    + {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Selector: Tailored CV vs Weak Statement Rewrites */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('tailored-cv')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'tailored-cv'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Tailored CV for Target Role
          </button>
          <button
            onClick={() => setActiveTab('rewrites')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'rewrites'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Weak Bullet Point Rewrites ({cvOptimizer.weakStatements.length})
          </button>
        </div>

        {activeTab === 'tailored-cv' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCv}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
            </button>
            <button
              onClick={handleDownloadCv}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download (.md)</span>
            </button>
            <button
              onClick={handleDownloadDocx}
              disabled={isExportingDocx}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isExportingDocx ? 'Generating Word...' : 'Export Word (.docx)'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Tab 1: Tailored CV Preview */}
      {activeTab === 'tailored-cv' && (
        <div className="space-y-4">
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Integrity Rule Strictly Enforced:</strong> No qualifications, employers, or metrics have been fabricated. 
              Review bracketed notes such as <code className="bg-indigo-100 px-1 py-0.5 rounded text-[11px] font-mono font-bold">[Candidate note: ...]</code> and substitute your exact personal data before application submission.
            </div>
          </div>

          {/* Unverified Terms Integrity Audit (B5) */}
          {cvOptimizer.unverifiedTerms && cvOptimizer.unverifiedTerms.length > 0 && (
            <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Integrity Audit: Unverified Numbers or Figures Detected</span>
              </div>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                The automated CV integrity check detected the following numbers or metrics in the tailored CV that were not found verbatim in your submitted CV. Please verify or replace them:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {cvOptimizer.unverifiedTerms.map((item, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-lg border border-amber-200/80 flex items-start gap-2">
                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 font-mono font-bold rounded text-[10px] shrink-0">
                      {item.category}
                    </span>
                    <div className="text-[11px]">
                      <span className="font-bold text-slate-900">{item.term}</span>
                      <p className="text-slate-500 mt-0.5 text-[10px]">{item.contextSnippet}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <pre className="font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed select-text overflow-x-auto bg-slate-50/50 p-4 rounded-xl border border-slate-200/80">
              {cvOptimizer.tailoredCvMarkdown}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: Weak Bullet Rewrites */}
      {activeTab === 'rewrites' && (
        <div className="space-y-4">
          {cvOptimizer.weakStatements.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Transformation {idx + 1}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Original */}
                <div className="bg-rose-50/40 border border-rose-100 p-3.5 rounded-lg text-xs">
                  <span className="font-bold text-rose-900 block mb-1">Original CV Statement:</span>
                  <p className="text-slate-700 italic">"{item.original}"</p>
                  <div className="mt-2 text-[11px] text-rose-700 font-medium">
                    <strong className="font-semibold">Identified Weakness:</strong> {item.issue}
                  </div>
                </div>

                {/* Improved */}
                <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-lg text-xs flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-emerald-900 block mb-1">Impact-Optimized Rewrite:</span>
                    <p className="text-slate-900 font-medium leading-relaxed">"{item.improved}"</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-emerald-100 text-[11px] space-y-1">
                    <div className="text-emerald-800 font-semibold">
                      Metric Highlight: <span className="underline">{item.metricHighlight}</span>
                    </div>
                    <div className="text-slate-600">
                      <strong>Why this wins:</strong> {item.rationale}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

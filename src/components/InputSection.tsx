import React, { useState, useEffect } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Loader2,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { parseUploadedDocument } from '../services/api';
import { SAMPLE_PRESETS, SamplePreset } from '../data/samplePresets';

interface InputSectionProps {
  onAnalyze: (jdText: string, cvText: string) => void;
  onSelectPreset: (preset: SamplePreset) => void;
  isLoading: boolean;
  initialJd?: string;
  initialCv?: string;
  onClose?: () => void;
  analysisError?: string | null;
  onDraftChange?: (jdText: string, cvText: string) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  onAnalyze,
  onSelectPreset,
  isLoading,
  initialJd = '',
  initialCv = '',
  onClose,
  analysisError = null,
  onDraftChange,
}) => {
  const [jdText, setJdText] = useState(initialJd);
  const [cvText, setCvText] = useState(initialCv);
  const [isParsingJd, setIsParsingJd] = useState(false);
  const [isParsingCv, setIsParsingCv] = useState(false);
  const [jdFileName, setJdFileName] = useState<string | null>(null);
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [extractionWarning, setExtractionWarning] = useState<string | null>(null);

  useEffect(() => {
    setJdText(initialJd);
  }, [initialJd]);

  useEffect(() => {
    setCvText(initialCv);
  }, [initialCv]);

  const handleJdChange = (val: string) => {
    setJdText(val);
    onDraftChange?.(val, cvText);
  };

  const handleCvChange = (val: string) => {
    setCvText(val);
    onDraftChange?.(jdText, val);
  };

  const handleJdFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setJdFileName(file.name);
    setIsParsingJd(true);
    setLocalError(null);
    setExtractionWarning(null);

    try {
      const result = await parseUploadedDocument(file);
      handleJdChange(result.text);
      if (result.warning) {
        setExtractionWarning(`Job Description: ${result.warning}`);
      }
    } catch (err: any) {
      setLocalError(err.message || `Failed to extract text from ${file.name}`);
    } finally {
      setIsParsingJd(false);
      // B11: Reset file input value so same file can be selected again
      e.target.value = '';
    }
  };

  const handleCvFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvFileName(file.name);
    setIsParsingCv(true);
    setLocalError(null);
    setExtractionWarning(null);

    try {
      const result = await parseUploadedDocument(file);
      handleCvChange(result.text);
      if (result.warning) {
        setExtractionWarning(`Candidate CV: ${result.warning}`);
      }
    } catch (err: any) {
      setLocalError(err.message || `Failed to extract text from ${file.name}`);
    } finally {
      setIsParsingCv(false);
      // B11: Reset file input value so same file can be selected again
      e.target.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdText.trim() || !cvText.trim()) {
      setLocalError('Please provide both the Job Description and Candidate CV before proceeding.');
      return;
    }
    setLocalError(null);
    onAnalyze(jdText, cvText);
  };

  const activeError = localError || analysisError;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-6xl mx-auto my-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Assess Job Fit & Prepare Your Interview
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Submit a Job Description and Candidate CV to unlock match scoring, ATS optimization, grounded company research, and a 7-day interview plan.
          </p>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Or test with demo:</span>
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>{preset.company} ({preset.role.includes('Consultant') ? 'Consulting' : 'Product'})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Extraction Warning Banner */}
      {extractionWarning && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{extractionWarning}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Job Description Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>1. Job Description (JD)</span>
              </label>
              <label className="cursor-pointer text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                <Upload className="w-3 h-3" />
                <span>Upload PDF / DOC / DOCX / TXT</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleJdFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {jdFileName && (
              <div className="text-[11px] text-slate-500 flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span className="truncate">Loaded: {jdFileName}</span>
              </div>
            )}

            <div className="relative">
              <textarea
                value={jdText}
                onChange={(e) => handleJdChange(e.target.value)}
                placeholder="Paste the target job description here (title, requirements, responsibilities, qualifications, tech stack, and company name)..."
                rows={11}
                className="w-full text-xs font-mono bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all resize-y leading-relaxed"
              />
              {isParsingJd && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-xs rounded-xl flex items-center justify-center gap-2 text-xs font-medium text-slate-700">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  <span>Parsing Job Description document...</span>
                </div>
              )}
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Extracts title, company, skills, qualifications & responsibilities</span>
              <span>{jdText.length} characters</span>
            </div>
          </div>

          {/* 2. Candidate CV Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>2. Candidate CV / Resume</span>
              </label>
              <label className="cursor-pointer text-xs font-medium text-emerald-600 hover:text-emerald-800 flex items-center gap-1">
                <Upload className="w-3 h-3" />
                <span>Upload PDF / DOC / DOCX</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleCvFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {cvFileName && (
              <div className="text-[11px] text-slate-500 flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span className="truncate">Loaded: {cvFileName}</span>
              </div>
            )}

            <div className="relative">
              <textarea
                value={cvText}
                onChange={(e) => handleCvChange(e.target.value)}
                placeholder="Paste the candidate's CV / resume text here (experience, accomplishments, skills, education, projects, metrics)..."
                rows={11}
                className="w-full text-xs font-mono bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all resize-y leading-relaxed"
              />
              {isParsingCv && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-xs rounded-xl flex items-center justify-center gap-2 text-xs font-medium text-slate-700">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>Parsing Candidate CV document...</span>
                </div>
              )}
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Extracts experience, education, skills, metrics & project results</span>
              <span>{cvText.length} characters</span>
            </div>
          </div>
        </div>

        {/* Honest Privacy Notice (C5) */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-slate-800">Privacy Notice:</strong> Uploaded DOC, DOCX, TXT and text-based PDF files are read on this app's server. Before your CV is sent to Google Gemini for analysis, your name, email, phone numbers, profile links and the address in the CV header are replaced with placeholders such as [PHONE]. A scanned PDF is the one exception: the whole file has to be sent to Gemini to be read, and you will see a warning when that happens. The server does not save your documents or results, and your protected characteristics (age, gender, religion and similar) are never used in the assessment.
          </div>
        </div>

        {/* Error Display inside the modal/form (A4) */}
        {activeError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">Submission Issue</strong>
              <span>{activeError}</span>
            </div>
          </div>
        )}

        {/* Footer info & CTA */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            AI-generated analysis. Review all recommendations against your verified experience.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || !jdText.trim() || !cvText.trim()}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-300" />
                  <span>Processing Analysis...</span>
                </>
              ) : (
                <>
                  <span>Run Comprehensive Match Analysis</span>
                  <ArrowRight className="w-4 h-4 text-indigo-300" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import { Header } from './components/Header';
import { NavigationTabs, SectionKey, SECTIONS } from './components/NavigationTabs';
import { ContextBar } from './components/ContextBar';
import { SectionPager } from './components/SectionPager';
import { InputSection } from './components/InputSection';
import { SAMPLE_PRESETS, SamplePreset } from './data/samplePresets';
import { CareerMatchAnalysis, StageKey } from './types/career';
import {
  runStagedCareerAnalysis,
  retryStage,
  buildAnalysis,
  PipelineState,
  SECTION_STAGES,
  STAGE_LABELS,
} from './services/api';
import { StageUnavailable } from './components/StageUnavailable';

// Section Components
import { OverviewSection } from './components/sections/OverviewSection';
import { JdAnalysisSection } from './components/sections/JdAnalysisSection';
import { CvAnalysisSection } from './components/sections/CvAnalysisSection';
import { FitScoreSection } from './components/sections/FitScoreSection';
import { StrengthsGapsSection } from './components/sections/StrengthsGapsSection';
import { CvOptimizerSection } from './components/sections/CvOptimizerSection';
import { InterviewQuestionsSection } from './components/sections/InterviewQuestionsSection';
import { CaseInterviewSection } from './components/sections/CaseInterviewSection';
import { CompanyResearchSection } from './components/sections/CompanyResearchSection';
import { IndustryResearchSection } from './components/sections/IndustryResearchSection';
import { StoryBankSection } from './components/sections/StoryBankSection';
import { PreparationPlanSection } from './components/sections/PreparationPlanSection';
import { InterviewReadinessSection } from './components/sections/InterviewReadinessSection';
import { ErrorBoundary } from './components/ErrorBoundary';

import { Sparkles, Loader2, AlertCircle, Printer, X, ArrowLeft, ArrowRight } from 'lucide-react';

export default function App() {
  const [currentPreset, setCurrentPreset] = useState<SamplePreset>(SAMPLE_PRESETS[0]);
  const [analysis, setAnalysis] = useState<CareerMatchAnalysis>(SAMPLE_PRESETS[0].precomputedAnalysis);
  const [activeSection, setActiveSection] = useState<SectionKey>('overview');
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pipeline, setPipeline] = useState<PipelineState | null>(null);
  const [retrying, setRetrying] = useState<StageKey | null>(null);
  const [visited, setVisited] = useState<Set<SectionKey>>(() => new Set<SectionKey>(['overview']));

  const goToSection = (section: SectionKey) => {
    setActiveSection(section);
    setVisited((prev) => {
      if (prev.has(section)) return prev;
      const next = new Set(prev);
      next.add(section);
      return next;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPreset = (preset: SamplePreset) => {
    setPipeline(null);
    setVisited(new Set<SectionKey>(['overview']));
    setCurrentPreset(preset);
    setAnalysis(preset.precomputedAnalysis);
    setActiveSection('overview');
    setIsInputModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRunAnalysis = async (jdText: string, cvText: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStep('Stage 1/3: Extracting role requirements and candidate qualifications...');

    try {
      const state = await runStagedCareerAnalysis(jdText, cvText, (status) => {
        setLoadingStep(status);
      });

      setPipeline(state);
      setAnalysis(buildAnalysis(state));
      setVisited(new Set<SectionKey>(['overview']));
      const failed = Object.keys(state.errors) as StageKey[];
      if (failed.length > 0) {
        setErrorMessage(
          `Some steps did not finish: ${failed.map((k) => STAGE_LABELS[k]).join(', ')}. ` +
            'The rest of your report is ready. Open an affected section to retry just that step.'
        );
      }
      setActiveSection('overview');
      setIsInputModalOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error analyzing career match:', err);
      setErrorMessage(err.message || 'Analysis failed. Please check your JD and CV content and try again.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Retry a single failed step, keeping everything else in the report
  const handleRetryStage = async (key: StageKey) => {
    if (!pipeline || retrying) return;
    setRetrying(key);
    try {
      const next = await retryStage(pipeline, key);
      setPipeline(next);
      setAnalysis(buildAnalysis(next));
      if (Object.keys(next.errors).length === 0) setErrorMessage(null);
    } finally {
      setRetrying(null);
    }
  };

  // Renders a section, or a retry card if a step it needs did not finish
  const renderSection = (key: string, sectionName: string, element: React.ReactNode) => {
    const needed = (SECTION_STAGES[key] || []) as StageKey[];
    const status = analysis?.stageStatus;
    const blocked = status && needed.some((k) => status[k] && status[k]!.status !== 'ok');
    return (
      <ErrorBoundary sectionName={sectionName}>
        {blocked ? (
          <StageUnavailable
            sectionName={sectionName}
            stages={needed}
            stageStatus={status!}
            retrying={retrying}
            onRetry={handleRetryStage}
          />
        ) : (
          element
        )}
      </ErrorBoundary>
    );
  };

  // Section index helper for next / previous navigation
  const currentSectionIdx = SECTIONS.findIndex((s) => s.key === activeSection);
  const prevSection = currentSectionIdx > 0 ? SECTIONS[currentSectionIdx - 1] : null;
  const nextSection = currentSectionIdx < SECTIONS.length - 1 ? SECTIONS[currentSectionIdx + 1] : null;

  return (
    <div className="min-h-screen text-slate-900 font-sans flex flex-col antialiased">
      {/* Drifting aurora light behind everything */}
      <div className="tp-aurora print:hidden" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>

      {/* Glass header with the grouped section tab rail */}
      <Header
        currentAnalysis={analysis}
        onSelectPreset={handleSelectPreset}
        onOpenNewInput={() => setIsInputModalOpen(true)}
        isLoading={isLoading}
      >
        {analysis && <NavigationTabs activeSection={activeSection} onSelectSection={goToSection} visited={visited} />}
      </Header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading screen */}
        {isLoading && (
          <div
            className="fixed inset-0 z-[60] bg-[#f3f2fb]/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
            role="status"
            aria-live="polite"
          >
            <div className="tp-card max-w-md w-full px-8 py-10 flex flex-col items-center">
              <div className="tp-spinner mb-6" aria-hidden="true" />
              <div className="tp-eyebrow mb-2">Analysing</div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-2">Building your career match report</h3>
              <p className="text-xs text-slate-600 font-mono leading-relaxed">
                {loadingStep || 'Reading the job description and CV...'}
              </p>
              <ol className="mt-6 w-full grid grid-cols-3 gap-2 text-left">
                {['Read', 'Analyse', 'Plan'].map((label, i) => {
                  const stage = loadingStep.startsWith('Stage 3') ? 3 : loadingStep.startsWith('Stage 2') ? 2 : 1;
                  const state = i + 1 < stage ? 'done' : i + 1 === stage ? 'on' : '';
                  return (
                    <li
                      key={label}
                      className={`rounded-xl border px-3 py-2 text-[11px] font-semibold ${
                        state === 'on'
                          ? 'border-cyan-300 bg-[var(--tp-accent-soft)] text-slate-900'
                          : state === 'done'
                          ? 'border-[var(--tp-glass-border)] bg-white/70 text-slate-500'
                          : 'border-[var(--tp-glass-border)] bg-white/40 text-slate-400'
                      }`}
                    >
                      <span className="font-mono block text-[10px] opacity-70">0{i + 1}</span>
                      {label}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">Analysis Issue</strong>
                <p>{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-600 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Modal / Drawer when user clicks "New Analysis" */}
        {isInputModalOpen && (
          <div className="tp-modal fixed inset-0 z-50 bg-[#14132b]/35 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 flex items-start justify-center">
            <div className="relative w-full max-w-5xl my-6">
              <button
                onClick={() => setIsInputModalOpen(false)}
                className="absolute top-4 right-4 z-10 tp-icon-btn"
                title="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
              <InputSection
                onAnalyze={handleRunAnalysis}
                onSelectPreset={handleSelectPreset}
                isLoading={isLoading}
                initialJd={currentPreset.jdText}
                initialCv={currentPreset.cvText}
                onClose={() => setIsInputModalOpen(false)}
                analysisError={errorMessage}
              />
            </div>
          </div>
        )}

        {/* Active Section Renderer with Section-level ErrorBoundaries (A3) */}
        {analysis && (
          <div className="space-y-6">
            {activeSection !== 'overview' && <ContextBar analysis={analysis} onNavigate={goToSection} />}
            {/* Keyed wrapper: the section's cards rise in, bars grow and gauges draw on each visit */}
            <div key={activeSection} className="tp-anim">
            {activeSection === 'overview' &&
              renderSection('overview', 'Overview Dashboard', <OverviewSection
                  analysis={analysis}
                  onNavigate={goToSection}
                  visited={visited}
                  onOpenNewInput={() => setIsInputModalOpen(true)}
                />)}
            {activeSection === 'jd-analysis' &&
              renderSection('jd-analysis', 'Job Description Analysis', <JdAnalysisSection analysis={analysis} />)}
            {activeSection === 'cv-analysis' &&
              renderSection('cv-analysis', 'Candidate CV Extraction', <CvAnalysisSection analysis={analysis} />)}
            {activeSection === 'fit-score' &&
              renderSection('fit-score', 'Job Fit Score Breakdown', <FitScoreSection analysis={analysis} />)}
            {activeSection === 'strengths-gaps' &&
              renderSection('strengths-gaps', 'Strengths & Gaps Matrix', <StrengthsGapsSection analysis={analysis} />)}
            {activeSection === 'cv-optimizer' &&
              renderSection('cv-optimizer', 'CV Optimizer & Tailored CV', <CvOptimizerSection analysis={analysis} />)}
            {activeSection === 'interview-questions' &&
              renderSection('interview-questions', 'Interview Preparation Questionnaire', <InterviewQuestionsSection analysis={analysis} />)}
            {activeSection === 'case-interview' &&
              renderSection('case-interview', 'Case Interview Drills', <CaseInterviewSection analysis={analysis} />)}
            {activeSection === 'company-research' &&
              renderSection('company-research', 'Grounded Company Research', <CompanyResearchSection
                  analysis={analysis}
                  onRefresh={pipeline ? () => handleRetryStage('research') : undefined}
                  isRefreshing={retrying === 'research'}
                />)}
            {activeSection === 'industry-research' &&
              renderSection('industry-research', 'Industry & Macro Landscape', <IndustryResearchSection analysis={analysis} />)}
            {activeSection === 'story-bank' &&
              renderSection('story-bank', 'STAR Story Bank', <StoryBankSection analysis={analysis} />)}
            {activeSection === 'preparation-plan' &&
              renderSection('preparation-plan', '7-Day Preparation Roadmap', <PreparationPlanSection analysis={analysis} />)}
            {activeSection === 'interview-readiness' &&
              renderSection('interview-readiness', 'Interview Readiness Dashboard', <InterviewReadinessSection analysis={analysis} />)}

            </div>

            {/* Pager closing every section */}
            <SectionPager
              prev={prevSection}
              next={nextSection}
              index={currentSectionIdx}
              total={SECTIONS.length}
              onNavigate={goToSection}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 print:hidden text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-[var(--tp-glass-border)] flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
          <span className="font-mono font-semibold text-slate-700">CareerMatch AI</span>
          <span>
            Career guidance and decision support, not a hiring decision. Protected characteristics are never used.
          </span>
        </div>
      </footer>
    </div>
  );
}

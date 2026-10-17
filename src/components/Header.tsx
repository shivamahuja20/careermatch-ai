import React from 'react';
import { Sparkles, Printer, RefreshCw, FilePlus2, ChevronDown } from 'lucide-react';
import { SAMPLE_PRESETS, SamplePreset } from '../data/samplePresets';
import { CareerMatchAnalysis } from '../types/career';
import { LogoMark } from './ui/Logo';

interface HeaderProps {
  currentAnalysis: CareerMatchAnalysis | null;
  onSelectPreset: (preset: SamplePreset) => void;
  onOpenNewInput: () => void;
  isLoading: boolean;
  /** The section tab rail, shown as the header's second row. */
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  currentAnalysis,
  onSelectPreset,
  onOpenNewInput,
  isLoading,
  children,
}) => {
  const [presetsOpen, setPresetsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setPresetsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="tp-topbar sticky top-0 z-40 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 pt-3 pb-1">
          {/* Logo */}
          <div className="flex items-center gap-2.5 min-w-0 shrink">
            <LogoMark size={34} />
            <span className="truncate font-display font-bold text-[1.12rem] tracking-tight text-slate-900 whitespace-nowrap">
              Career<span className="tp-grad-text">Match</span>
              <span className="hidden sm:inline-block ml-2 align-[3px] font-mono text-[0.6rem] font-semibold tracking-[0.08em] text-slate-600 border border-[var(--tp-glass-border)] bg-[var(--tp-glass-2)] rounded-full px-2 py-0.5">
                AI
              </span>
            </span>
            {currentAnalysis?.isDemo && (
              <span className="hidden md:inline-flex font-mono text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-amber-800 bg-amber-50 border border-amber-300 rounded-full px-2.5 py-1">
                Example data
              </span>
            )}
          </div>

          {/* Current role */}
          {currentAnalysis && (
            <div className="hidden xl:flex items-center gap-2 text-xs rounded-full border border-[var(--tp-glass-border)] bg-white/60 px-3.5 py-1.5 text-slate-600 min-w-0">
              <span className="font-semibold text-slate-900 truncate max-w-[160px]">
                {currentAnalysis.metadata.candidateName || 'Candidate'}
              </span>
              <span className="text-slate-300">→</span>
              <span className="truncate max-w-[200px]">{currentAnalysis.metadata.jobTitle}</span>
              <span className="text-slate-300">@</span>
              <span className="font-semibold tp-grad-text truncate max-w-[140px]">
                {currentAnalysis.metadata.company || 'Employer not named'}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setPresetsOpen(!presetsOpen)}
                className="tp-btn !py-2 !px-3"
                title="Example reports"
                aria-expanded={presetsOpen}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Examples</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {presetsOpen && (
                <div className="absolute right-0 mt-2 w-72 tp-card !rounded-2xl py-1.5 z-50 !bg-white">
                  <div className="px-3 py-1.5 tp-eyebrow !text-[0.6rem]">Example reports</div>
                  {SAMPLE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        onSelectPreset(preset);
                        setPresetsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex flex-col gap-0.5 rounded-lg"
                    >
                      <span className="font-semibold text-slate-900">{preset.name}</span>
                      <span className="text-[11px] text-slate-500">{preset.tagline}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={onOpenNewInput} disabled={isLoading} className="tp-btn tp-btn-primary !py-2">
              {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FilePlus2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{currentAnalysis ? 'New analysis' : 'Start'}</span>
              <span className="sm:hidden">New</span>
            </button>

            {currentAnalysis && (
              <span className="hidden sm:block">
                <button onClick={() => window.print()} className="tp-icon-btn" title="Print or save the report as PDF">
                  <Printer className="w-4 h-4" />
                  <span className="sr-only">Print report</span>
                </button>
              </span>
            )}
          </div>
        </div>
        {children}
      </div>
    </header>
  );
};

import React from 'react';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { StageKey, StageState } from '../types/career';
import { STAGE_LABELS } from '../services/api';

interface StageUnavailableProps {
  sectionName: string;
  stages: StageKey[];
  stageStatus: Partial<Record<StageKey, StageState>>;
  retrying: StageKey | null;
  onRetry: (stage: StageKey) => void;
}

/** Shown instead of a section when an AI step it depends on did not finish. */
export const StageUnavailable: React.FC<StageUnavailableProps> = ({
  sectionName,
  stages,
  stageStatus,
  retrying,
  onRetry,
}) => {
  const blocking = stages.filter((k) => stageStatus[k] && stageStatus[k]!.status !== 'ok');
  return (
    <div className="bg-white rounded-xl border border-amber-200 p-6 shadow-xs" role="alert">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-slate-900">{sectionName} is not ready yet</h2>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            One or more AI steps this section needs did not finish. Nothing has been filled in or guessed. The sections
            that did finish are still available in the tabs above.
          </p>
          <ul className="mt-4 space-y-2.5">
            {blocking.map((key) => {
              const st = stageStatus[key]!;
              const isRetrying = retrying === key;
              const waitingOnFit = key === 'plan' && st.status === 'skipped';
              return (
                <li
                  key={key}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 bg-amber-50/60 border border-amber-100 rounded-lg text-xs"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900">{STAGE_LABELS[key]}</div>
                    <div className="text-slate-600 mt-0.5 break-words">{st.error || 'This step did not run.'}</div>
                    {/billing/i.test(st.error || '') && (
                      <a
                        href="https://ai.google.dev/gemini-api/docs/billing"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-block mt-1.5 font-semibold text-indigo-600 underline underline-offset-2"
                      >
                        How to turn on billing for a Gemini API key
                      </a>
                    )}
                  </div>
                  {waitingOnFit ? (
                    <span className="text-[11px] text-slate-500">Runs automatically after the fit step succeeds.</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onRetry(key)}
                      disabled={retrying !== null}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg disabled:opacity-50 cursor-pointer shrink-0"
                    >
                      {isRetrying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      <span>{isRetrying ? 'Retrying...' : 'Retry this step'}</span>
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { SectionKey, TabItem } from './NavigationTabs';

interface SectionPagerProps {
  prev: TabItem | null;
  next: TabItem | null;
  index: number;
  total: number;
  onNavigate: (key: SectionKey) => void;
}

/** Previous / next cards with an "n / 13" counter, closing every section. */
export const SectionPager: React.FC<SectionPagerProps> = ({ prev, next, index, total, onNavigate }) => (
  <nav
    className="grid grid-cols-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch gap-3 mt-10 pt-6 border-t border-[var(--tp-glass-border)] print:hidden"
    aria-label="Section navigation"
  >
    {prev ? (
      <button
        type="button"
        onClick={() => onNavigate(prev.key)}
        className="tp-pg tp-card !rounded-2xl flex flex-col items-start gap-0.5 px-4 py-3.5 text-left cursor-pointer min-w-0"
      >
        <small className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-slate-500">← Previous</small>
        <b className="font-display font-semibold text-[0.98rem] text-slate-900 truncate max-w-full">{prev.label}</b>
      </button>
    ) : (
      <span />
    )}
    <span className="hidden sm:block self-center font-mono text-xs text-slate-500 px-3 py-1 rounded-full border border-[var(--tp-glass-border)]">
      {index + 1} / {total}
    </span>
    {next ? (
      <button
        type="button"
        onClick={() => onNavigate(next.key)}
        className="tp-pg tp-card !rounded-2xl flex flex-col items-end gap-0.5 px-4 py-3.5 text-right cursor-pointer min-w-0"
      >
        <small className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-[var(--tp-accent)]">Next step →</small>
        <b className="font-display font-semibold text-[0.98rem] text-slate-900 truncate max-w-full">{next.label}</b>
      </button>
    ) : (
      <span />
    )}
  </nav>
);

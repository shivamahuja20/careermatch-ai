import React from 'react';
import { ExternalLink, Info, Sparkles } from 'lucide-react';
import { ResearchSource, SourcedFact } from '../../types/career';

/** Small numbered links after a fact, pointing at the sources that support it. */
export const SourceChips: React.FC<{ ids: number[]; sources: ResearchSource[] }> = ({ ids, sources }) => {
  if (!ids || ids.length === 0) return null;
  return (
    <span className="inline-flex flex-wrap gap-1 ml-1 align-baseline">
      {ids.map((id) => {
        const src = sources.find((s) => s.id === id);
        if (!src) return null;
        return (
          <a
            key={id}
            href={src.url}
            target="_blank"
            rel="noreferrer noopener"
            title={`${src.title} (${src.publisher}, published: ${src.publicationDate})`}
            className="inline-block px-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-mono text-[10px] font-semibold no-underline"
          >
            [{id}]
          </a>
        );
      })}
    </span>
  );
};

/** Latest stated publication date among a fact's sources, or '' if none of them states one. */
export function latestDate(ids: number[], sources: ResearchSource[]): string {
  const dated = ids
    .map((id) => sources.find((s) => s.id === id))
    .filter((s): s is ResearchSource => !!s && !!s.publicationDateIso)
    .sort((a, b) => (b.publicationDateIso || '').localeCompare(a.publicationDateIso || ''));
  return dated[0]?.publicationDate || '';
}

export const FactList: React.FC<{
  title: string;
  icon?: React.ReactNode;
  facts: SourcedFact[];
  sources: ResearchSource[];
  emptyText?: string;
  illustrative?: boolean;
}> = ({ title, icon, facts, sources, emptyText, illustrative }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
      {icon}
      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{title}</h3>
      {illustrative ? (
        <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
          Illustrative example
        </span>
      ) : (
        <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5">
          Sourced fact
        </span>
      )}
    </div>
    {facts.length === 0 ? (
      <p className="text-xs text-slate-500 italic">{emptyText || 'Not found in the sources returned by the search.'}</p>
    ) : (
      <ul className="space-y-2 text-xs">
        {facts.map((f, idx) => (
          <li key={idx} className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
            {f.text}
            <SourceChips ids={f.sourceIds} sources={sources} />
          </li>
        ))}
      </ul>
    )}
  </div>
);

export const AnalysisBox: React.FC<{ title: string; items: string[] }> = ({ title, items }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="bg-indigo-50/40 rounded-xl border border-dashed border-indigo-200 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-indigo-600" />
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{title}</h3>
        <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-indigo-700 bg-white border border-indigo-200 rounded px-1.5 py-0.5">
          AI analysis, not a sourced fact
        </span>
      </div>
      <ul className="space-y-2 text-xs">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-slate-700">
            <span className="font-mono text-indigo-600 font-bold shrink-0">{String(idx + 1).padStart(2, '0')}.</span>
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const NoticeBox: React.FC<{ children: React.ReactNode; tone?: 'amber' | 'slate' }> = ({ children, tone = 'amber' }) => (
  <div
    className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 border ${
      tone === 'amber' ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-700'
    }`}
  >
    <Info className={`w-4 h-4 shrink-0 mt-0.5 ${tone === 'amber' ? 'text-amber-600' : 'text-slate-500'}`} />
    <div className="leading-relaxed">{children}</div>
  </div>
);

/** Table of sources: title, publisher, date the page states, date checked, link. */
export const SourcesTable: React.FC<{ sources: ResearchSource[]; title?: string }> = ({ sources, title }) => {
  if (!sources || sources.length === 0) return null;
  const sorted = [...sources].sort((a, b) => (b.publicationDateIso || '').localeCompare(a.publicationDateIso || ''));
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
        {title || 'Sources, recent articles and reports'} ({sources.length})
      </h3>
      <p className="text-[11px] text-slate-500 mb-3">
        Every link below was returned by the Google Search step. Publication dates are read from each article's own page.
        Where a page does not state one, it says so rather than guessing.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px] text-left border-collapse">
          <thead>
            <tr className="text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <th className="py-2 pr-3 font-semibold">#</th>
              <th className="py-2 pr-3 font-semibold">Title</th>
              <th className="py-2 pr-3 font-semibold">Publisher</th>
              <th className="py-2 pr-3 font-semibold whitespace-nowrap">Published</th>
              <th className="py-2 pr-3 font-semibold whitespace-nowrap">Checked</th>
              <th className="py-2 font-semibold">Link</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 align-top">
                <td className="py-2 pr-3 font-mono text-indigo-700 font-semibold">[{s.id}]</td>
                <td className="py-2 pr-3 text-slate-900 font-medium min-w-[180px]">{s.title}</td>
                <td className="py-2 pr-3 text-slate-600">{s.publisher}</td>
                <td className={`py-2 pr-3 whitespace-nowrap ${s.publicationDateIso ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                  {s.publicationDate}
                </td>
                <td className="py-2 pr-3 whitespace-nowrap text-slate-500">{s.retrievedDate}</td>
                <td className="py-2">
                  {s.url && (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 whitespace-nowrap"
                    >
                      Open <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/** Google requires its search suggestion chips to be shown with grounded results. */
export const SearchSuggestions: React.FC<{ html?: string }> = ({ html }) => {
  if (!html) return null;
  return (
    <iframe
      title="Google Search suggestions"
      srcDoc={html}
      sandbox="allow-popups allow-popups-to-escape-sandbox"
      className="w-full h-[72px] border-0 rounded-lg bg-transparent"
    />
  );
};

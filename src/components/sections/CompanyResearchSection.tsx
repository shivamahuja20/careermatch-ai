import React from 'react';
import { Building2, Globe2, TrendingUp, Layers, Newspaper, RefreshCw, Coins, Target } from 'lucide-react';
import { CareerMatchAnalysis } from '../../types/career';
import {
  AnalysisBox,
  FactList,
  NoticeBox,
  SearchSuggestions,
  SourceChips,
  SourcesTable,
  latestDate,
} from '../research/ResearchParts';

interface CompanyResearchSectionProps {
  analysis: CareerMatchAnalysis;
  /** Runs the research step again. Not available for demo data. */
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const CompanyResearchSection: React.FC<CompanyResearchSectionProps> = ({
  analysis,
  onRefresh,
  isRefreshing,
}) => {
  const r = analysis.companyResearch;
  const sources = r.sources || [];
  const companyLabel = r.companyName || analysis.metadata.company || 'Company';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 uppercase tracking-wider">
              <span>Section 09</span>
              <span>·</span>
              <span>Grounded Company Research</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <span>{r.companyName ? `${companyLabel}: company research` : 'Company research'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Facts come from a live Google Search and each one links to its source.
              {r.searchedOn ? ` Searched on ${r.searchedOn}.` : ''}
            </p>
          </div>

          {onRefresh && !analysis.isDemo && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              title="Run the Google Search research step again"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Searching the web...' : 'Search again'}</span>
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
          <span className="px-2 py-1 rounded bg-emerald-50 border border-emerald-100 text-emerald-800">
            <strong>Sourced fact</strong>: found by the search, with numbered source links
          </span>
          <span className="px-2 py-1 rounded bg-indigo-50 border border-indigo-100 text-indigo-800">
            <strong>AI analysis</strong>: opinion and advice, not a fact
          </span>
        </div>
      </div>

      {analysis.isDemo && (
        <NoticeBox>
          <strong>Example data.</strong> This is a fictional company, so every item below is illustrative and none of it is
          real research. Run a new analysis to research a real employer.
        </NoticeBox>
      )}

      {r.notResearchedReason && (
        <NoticeBox>
          <strong>Company research was not run.</strong> {r.notResearchedReason} Add the employer's name to the job description
          and run the analysis again to research it.
        </NoticeBox>
      )}

      {!r.notResearchedReason && !analysis.isDemo && sources.length === 0 && (
        <NoticeBox>
          <strong>No sources were returned by the search,</strong> so no company facts are shown. Nothing has been filled in from
          the AI's memory. Try "Search again", or research the company yourself using its official website and annual report. If
          your Gemini API key is on the free tier, live research is not available, because Google Search grounding needs a paid key.
        </NoticeBox>
      )}

      {typeof r.removedUnsourced === 'number' && r.removedUnsourced > 0 && (
        <NoticeBox tone="slate">
          {r.removedUnsourced} AI statement{r.removedUnsourced === 1 ? ' was' : 's were'} removed because no returned source
          supported {r.removedUnsourced === 1 ? 'it' : 'them'}.
        </NoticeBox>
      )}

      {!r.notResearchedReason && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FactList title="Company overview" icon={<Building2 className="w-4 h-4 text-slate-600" />} facts={r.overview} sources={sources} illustrative={!!analysis.isDemo} />
            <FactList title="Business model" icon={<Coins className="w-4 h-4 text-slate-600" />} facts={r.businessModel} sources={sources} illustrative={!!analysis.isDemo} />
            <FactList title="Products, services and markets" icon={<Layers className="w-4 h-4 text-slate-600" />} facts={r.productsAndMarkets} sources={sources} illustrative={!!analysis.isDemo} />
            <FactList title="Strategy and growth priorities" icon={<Target className="w-4 h-4 text-slate-600" />} facts={r.strategy} sources={sources} illustrative={!!analysis.isDemo} />
          </div>

          {/* Competitors */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <Globe2 className="w-4 h-4 text-slate-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Competitors</h3>
            </div>
            {r.competitors.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Not found in the sources returned by the search.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                {r.competitors.map((comp, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="font-bold text-slate-900">
                      {comp.name}
                      <SourceChips ids={comp.sourceIds} sources={sources} />
                    </div>
                    <div className="text-slate-600 mt-0.5 text-[11px] leading-relaxed">{comp.distinction}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent developments */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <Newspaper className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recent announcements, deals and developments
              </h3>
            </div>
            {r.recentDevelopments.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No recent developments were found in the returned sources.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {r.recentDevelopments.map((dev, idx) => {
                  const date = latestDate(dev.sourceIds, sources);
                  return (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-mono text-slate-500 block mb-1">
                        {date ? `Source published ${date}` : 'Source page shows no date'}
                      </span>
                      <h4 className="font-bold text-slate-900 mb-1">{dev.title}</h4>
                      <p className="text-slate-600 leading-relaxed text-[11px]">
                        {dev.summary}
                        <SourceChips ids={dev.sourceIds} sources={sources} />
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnalysisBox title="What this means for the role" items={r.analysis} />
            <AnalysisBox title="How to use this in your interview" items={r.interviewAngles} />
          </div>
        </>
      )}

      <SourcesTable sources={sources} />

      {r.searchSuggestionsHtml && (
        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
          <SearchSuggestions html={r.searchSuggestionsHtml} />
        </div>
      )}

      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
        <TrendingUp className="w-3 h-3" />
        <span>Industry trends, regulation and technology changes are in the next section, Industry Research.</span>
      </div>
    </div>
  );
};

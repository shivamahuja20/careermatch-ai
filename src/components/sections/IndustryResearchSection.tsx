import React from 'react';
import { TrendingUp, Globe2, ShieldAlert, Cpu, Layers } from 'lucide-react';
import { CareerMatchAnalysis } from '../../types/career';
import { AnalysisBox, FactList, NoticeBox, SourcesTable } from '../research/ResearchParts';

interface IndustryResearchSectionProps {
  analysis: CareerMatchAnalysis;
}

export const IndustryResearchSection: React.FC<IndustryResearchSectionProps> = ({ analysis }) => {
  const ind = analysis.industryResearch;
  const sources = analysis.companyResearch.sources || [];
  const name = ind.industryName || analysis.jdAnalysis.industry || 'Industry';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 uppercase tracking-wider">
          <span>Section 10</span>
          <span>·</span>
          <span>Industry Research</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <span>{name}: trends, challenges, regulation and technology</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          From the same live Google Search as Company Research. Numbers in brackets link to the sources at the bottom of this page.
        </p>
      </div>

      {analysis.isDemo && (
        <NoticeBox>
          <strong>Example data.</strong> Illustrative only, not real research.
        </NoticeBox>
      )}

      {ind.notResearchedReason ? (
        <NoticeBox>
          <strong>Industry research was not run.</strong> {ind.notResearchedReason}
        </NoticeBox>
      ) : (
        <>
          <FactList title="Industry landscape" icon={<Layers className="w-4 h-4 text-slate-600" />} facts={ind.landscape} sources={sources} illustrative={!!analysis.isDemo} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FactList title="Trends" icon={<Globe2 className="w-4 h-4 text-emerald-600" />} facts={ind.trends} sources={sources} illustrative={!!analysis.isDemo} />
            <FactList title="Technology changes" icon={<Cpu className="w-4 h-4 text-indigo-600" />} facts={ind.technologyChanges} sources={sources} illustrative={!!analysis.isDemo} />
          </div>
          <FactList
            title="Challenges and regulation"
            icon={<ShieldAlert className="w-4 h-4 text-amber-600" />}
            facts={ind.challengesAndRegulation}
            sources={sources} illustrative={!!analysis.isDemo}
          />
          <AnalysisBox title="What this means for the candidate" items={ind.analysis} />
        </>
      )}

      <SourcesTable sources={sources} title="Sources, recent articles and reports" />
    </div>
  );
};

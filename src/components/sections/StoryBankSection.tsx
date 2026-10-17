import React, { useState } from 'react';
import { BookmarkCheck, Sparkles, Filter, CheckCircle2, ChevronRight, MessageSquare, Layers } from 'lucide-react';
import { CareerMatchAnalysis, StarStory } from '../../types/career';

interface StoryBankSectionProps {
  analysis: CareerMatchAnalysis;
}

export const StoryBankSection: React.FC<StoryBankSectionProps> = ({ analysis }) => {
  const { storyBank } = analysis;
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [activeStoryId, setActiveStoryId] = useState<string>(storyBank[0]?.id || '');

  const themes = Array.from(new Set(storyBank.map((s) => s.theme)));

  const filteredStories = storyBank.filter(
    (s) => selectedTheme === 'all' || s.theme === selectedTheme
  );

  const activeStory =
    filteredStories.find((s) => s.id === activeStoryId) || filteredStories[0] || storyBank[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 uppercase tracking-wider">
              <span>Section 11</span>
              <span>·</span>
              <span>Behavioral STAR Story Bank</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Candidate STAR Story Bank (7 Core Behavioral Themes)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Grounded exclusively in candidate CV achievements. Structured for leadership, teamwork, conflict, failure, problem-solving, initiative, and peak outcomes.
            </p>
          </div>

          {/* Theme Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => setSelectedTheme('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedTheme === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Themes ({storyBank.length})
            </button>
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTheme(t)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  selectedTheme === t
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout: Story Selector List + Active Story Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Stories */}
        <div className="lg:col-span-5 space-y-2.5">
          {filteredStories.map((story) => {
            const isSelected = activeStory?.id === story.id;
            return (
              <button
                key={story.id}
                onClick={() => setActiveStoryId(story.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'tp-tile-featured-fill text-slate-900 shadow-sm'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded ${
                        isSelected ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {story.theme}
                    </span>
                    <span className={isSelected ? 'text-slate-400' : 'text-slate-400 font-mono'}>
                      STAR Format
                    </span>
                  </div>
                  <h4 className={`text-xs sm:text-sm font-bold leading-snug ${isSelected ? 'text-slate-900' : 'text-slate-900'}`}>
                    {story.title}
                  </h4>
                </div>

                <div className={`mt-3 pt-2 text-[11px] border-t flex items-center justify-between ${
                  isSelected ? 'border-[var(--tp-glass-border)] text-slate-600' : 'border-slate-100 text-slate-500'
                }`}>
                  <span className="truncate max-w-[240px]">Source: {story.cvEvidenceSource}</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Active Story Deep-Dive */}
        {activeStory && (
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="pb-4 border-b border-slate-100">
              <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 uppercase tracking-wider">
                {activeStory.theme}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-2">
                {activeStory.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                CV Origin: {activeStory.cvEvidenceSource}
              </p>
            </div>

            {/* STAR Breakdown */}
            <div className="space-y-3.5 text-xs">
              {/* Situation */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block mb-1">
                  [S] Situation
                </span>
                <p className="text-slate-700 leading-relaxed">{activeStory.situation}</p>
              </div>

              {/* Task */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block mb-1">
                  [T] Task & Objective
                </span>
                <p className="text-slate-700 leading-relaxed">{activeStory.task}</p>
              </div>

              {/* Action */}
              <div className="bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100">
                <span className="font-bold text-indigo-950 uppercase tracking-wider text-[11px] block mb-1">
                  [A] Tactical Actions Taken (Candidate Leadership)
                </span>
                <p className="text-indigo-900 leading-relaxed font-medium">{activeStory.action}</p>
              </div>

              {/* Result */}
              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
                <span className="font-bold text-emerald-950 uppercase tracking-wider text-[11px] block mb-1">
                  [R] Quantified Business Result & Long-Term Impact
                </span>
                <p className="text-emerald-900 leading-relaxed font-semibold">{activeStory.result}</p>
              </div>
            </div>

            {/* Deployable Interview Questions */}
            {activeStory.applicableQuestions && activeStory.applicableQuestions.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Deploy this story when asked:</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {activeStory.applicableQuestions.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                      <span className="text-indigo-600 font-bold shrink-0">•</span>
                      <span>"{q}"</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

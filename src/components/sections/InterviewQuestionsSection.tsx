import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, AlertCircle, Sparkles, Filter, CheckCircle2, Bookmark } from 'lucide-react';
import { CareerMatchAnalysis, InterviewQuestion } from '../../types/career';

interface InterviewQuestionsSectionProps {
  analysis: CareerMatchAnalysis;
}

export const InterviewQuestionsSection: React.FC<InterviewQuestionsSectionProps> = ({ analysis }) => {
  const { interviewQuestions } = analysis;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(interviewQuestions[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = Array.from(new Set(interviewQuestions.map((q) => q.category)));

  const filteredQuestions = interviewQuestions.filter((q) => {
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || q.priority === selectedPriority;
    const matchesSearch =
      searchQuery.trim() === '' ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.whatInterviewerEvaluates.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 uppercase tracking-wider">
              <span>Section 07</span>
              <span>·</span>
              <span>Interview Questionnaire & Evaluation Rubric</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Personalized Interview Preparation Questionnaire
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Structured mock interview questions across behavioral, technical, JD-specific, and high-pressure follow-up domains.
            </p>
          </div>

          <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg font-mono">
            {interviewQuestions.length} Questions Ready
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search questions or evaluation topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 w-full sm:w-64"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
          >
            <option value="all">All Categories ({interviewQuestions.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical Priority</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
          </select>
        </div>
      </div>

      {/* Questions Accordion List */}
      <div className="space-y-4">
        {filteredQuestions.map((item, idx) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl border transition-all duration-150 shadow-xs overflow-hidden ${
                isExpanded ? 'border-indigo-300 ring-1 ring-indigo-200' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full text-left p-5 flex items-start justify-between gap-4 cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        item.priority === 'Critical'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : item.priority === 'High'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {item.question}
                  </h3>
                </div>

                <div className="p-1 rounded-md text-slate-400 hover:text-slate-600 shrink-0 mt-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 text-xs">
                  {/* What interviewer evaluates */}
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1 text-[11px] uppercase tracking-wider">
                      What the Interviewer is Evaluating:
                    </span>
                    <p className="text-slate-700 leading-relaxed">{item.whatInterviewerEvaluates}</p>
                  </div>

                  {/* Framework */}
                  <div className="bg-indigo-50/50 p-3.5 rounded-lg border border-indigo-100">
                    <span className="font-bold text-indigo-950 block mb-1 text-[11px] uppercase tracking-wider">
                      Recommended Answer Framework:
                    </span>
                    <p className="text-indigo-900 leading-relaxed font-mono text-[11px]">{item.framework}</p>
                  </div>

                  {/* Sample Answer */}
                  <div className="bg-emerald-50/40 p-4 rounded-lg border border-emerald-100">
                    <span className="font-bold text-emerald-950 block mb-2 text-[11px] uppercase tracking-wider">
                      Sample High-Caliber Response:
                    </span>
                    <p className="text-slate-800 leading-relaxed italic bg-white p-3 rounded border border-emerald-100">
                      "{item.sampleAnswer}"
                    </p>
                  </div>

                  {/* Candidate Tips */}
                  {item.candidateTips && (
                    <div className="text-[11px] text-slate-600 flex items-start gap-2 pt-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-800">Tactical Delivery Tip:</strong> {item.candidateTips}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredQuestions.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
            No questions match your current search and filter settings.
          </div>
        )}
      </div>
    </div>
  );
};

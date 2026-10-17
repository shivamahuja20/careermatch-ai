import React, { useState } from 'react';
import { CalendarCheck2, CheckCircle2, Circle, Sparkles, BookOpen, HelpCircle, ArrowRight, Zap } from 'lucide-react';
import { CareerMatchAnalysis, DailyPlanItem } from '../../types/career';

interface PreparationPlanSectionProps {
  analysis: CareerMatchAnalysis;
}

export const PreparationPlanSection: React.FC<PreparationPlanSectionProps> = ({ analysis }) => {
  const { preparationPlan } = analysis;
  const [planState, setPlanState] = useState<DailyPlanItem[]>(preparationPlan.sevenDayPlan);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const toggleTask = (dayNum: number, taskId: string) => {
    setPlanState((prev) =>
      prev.map((day) => {
        if (day.day === dayNum) {
          return {
            ...day,
            tasks: day.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)),
          };
        }
        return day;
      })
    );
  };

  const totalTasks = planState.reduce((acc, d) => acc + d.tasks.length, 0);
  const completedTasks = planState.reduce(
    (acc, d) => acc + d.tasks.filter((t) => t.done).length,
    0
  );
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const currentDayPlan = planState.find((d) => d.day === selectedDay) || planState[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 uppercase tracking-wider">
              <span>Section 12</span>
              <span>·</span>
              <span>7-Day Structured Interview Plan</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Personalized 7-Day Interview Preparation Roadmap
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Engineered specifically around your identified skill gaps, company research priorities, and role-specific requirements.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl min-w-[200px]">
            <div className="flex items-center justify-between text-xs mb-1 font-semibold text-slate-800">
              <span>Sprint Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="tp-bar" role="img" aria-label={`Plan progress: ${progressPercent}%`}>
              <i style={{ width: `${progressPercent}%`, transition: 'width .4s ease' }} />
            </div>
            <div className="text-[11px] text-slate-400 mt-1 text-right font-mono">
              {completedTasks} of {totalTasks} tasks completed
            </div>
          </div>
        </div>

        {/* Top 3 High-Leverage Actions */}
        <div className="mt-6 pt-2">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Top 3 Highest-Leverage Actions to Boost Competitiveness
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {preparationPlan.topThreeActions.map((action, idx) => (
              <div key={idx} className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-indigo-600 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200">
                      0{idx + 1}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{action.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2">{action.description}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/80 text-[11px] text-emerald-800 font-semibold bg-emerald-50/50 p-2 rounded">
                  Impact: {action.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7-Day Day Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {planState.map((day) => {
          const isSelected = selectedDay === day.day;
          const dayCompleted = day.tasks.every((t) => t.done);
          return (
            <button
              key={day.day}
              onClick={() => setSelectedDay(day.day)}
              className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'tp-tile-featured-fill text-slate-900 shadow-sm'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className={`font-mono font-bold ${isSelected ? 'text-[var(--tp-accent)]' : 'text-slate-500'}`}>
                    DAY 0{day.day}
                  </span>
                  {dayCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Circle className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-slate-300'}`} />
                  )}
                </div>
                <div className={`text-xs font-bold line-clamp-1 text-slate-900`}>
                  {day.title}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Action Plan Card */}
      {currentDayPlan && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-mono font-bold text-indigo-600 uppercase tracking-wider">
                Day 0{currentDayPlan.day} Deep Dive
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{currentDayPlan.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{currentDayPlan.focusArea}</p>
            </div>
            <div className="text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto font-mono">
              Priority: <strong className="text-slate-900">{currentDayPlan.revisionPriorities}</strong>
            </div>
          </div>

          {/* Daily Tasks Checkbox List */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Daily Action Checklist:
            </h4>
            <div className="space-y-2.5">
              {currentDayPlan.tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => toggleTask(currentDayPlan.day, task.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer flex items-start gap-3 ${
                    task.done
                      ? 'bg-emerald-50/40 border-emerald-200 text-slate-500 line-through'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100/70'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-xs font-medium leading-relaxed">{task.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2-Column: Practice Questions & Learning Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
            {/* Practice Questions to Drill */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-2">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                <span>Practice Questions to Drill Out Loud:</span>
              </span>
              <ul className="space-y-2 text-slate-700">
                {currentDayPlan.practiceQuestions.map((q, idx) => (
                  <li key={idx} className="bg-white p-2.5 rounded border border-slate-200/80 leading-relaxed">
                    "{q}"
                  </li>
                ))}
              </ul>
            </div>

            {/* Curated Resources */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-2">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Target Learning & Study Materials:</span>
              </span>
              <ul className="space-y-2 text-slate-700">
                {currentDayPlan.learningResources.map((res, idx) => (
                  <li key={idx} className="bg-white p-2.5 rounded border border-slate-200/80 font-medium">
                    {res}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

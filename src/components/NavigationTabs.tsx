import React from 'react';
import {
  LayoutDashboard,
  FileSearch,
  UserCheck,
  Target,
  ShieldAlert,
  FileCheck2,
  HelpCircle,
  BriefcaseBusiness,
  Building2,
  TrendingUp,
  BookmarkCheck,
  CalendarCheck2,
  Award,
} from 'lucide-react';

export type SectionKey =
  | 'overview'
  | 'jd-analysis'
  | 'cv-analysis'
  | 'fit-score'
  | 'strengths-gaps'
  | 'cv-optimizer'
  | 'interview-questions'
  | 'case-interview'
  | 'company-research'
  | 'industry-research'
  | 'story-bank'
  | 'preparation-plan'
  | 'interview-readiness';

export interface TabItem {
  key: SectionKey;
  number: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const SECTIONS: TabItem[] = [
  { key: 'overview', number: '01', label: 'Overview', icon: LayoutDashboard },
  { key: 'jd-analysis', number: '02', label: 'JD Analysis', icon: FileSearch },
  { key: 'cv-analysis', number: '03', label: 'CV Analysis', icon: UserCheck },
  { key: 'fit-score', number: '04', label: 'Fit Score', icon: Target },
  { key: 'strengths-gaps', number: '05', label: 'Strengths & Gaps', icon: ShieldAlert },
  { key: 'cv-optimizer', number: '06', label: 'CV Optimizer', icon: FileCheck2 },
  { key: 'interview-questions', number: '07', label: 'Interview Questions', icon: HelpCircle },
  { key: 'case-interview', number: '08', label: 'Case Interview', icon: BriefcaseBusiness },
  { key: 'company-research', number: '09', label: 'Company Research', icon: Building2 },
  { key: 'industry-research', number: '10', label: 'Industry Research', icon: TrendingUp },
  { key: 'story-bank', number: '11', label: 'Story Bank', icon: BookmarkCheck },
  { key: 'preparation-plan', number: '12', label: 'Preparation Plan', icon: CalendarCheck2 },
  { key: 'interview-readiness', number: '13', label: 'Interview Readiness', icon: Award },
];

/** Tab groups, as in TalentPulse: Start, Analysis, Improve your CV, Interview prep, Research, Plan. */
export const SECTION_GROUPS: { label: string; keys: SectionKey[] }[] = [
  { label: 'Start', keys: ['overview'] },
  { label: 'Analysis', keys: ['jd-analysis', 'cv-analysis', 'fit-score', 'strengths-gaps'] },
  { label: 'Improve your CV', keys: ['cv-optimizer'] },
  { label: 'Interview prep', keys: ['interview-questions', 'case-interview', 'story-bank'] },
  { label: 'Research', keys: ['company-research', 'industry-research'] },
  { label: 'Plan', keys: ['preparation-plan', 'interview-readiness'] },
];

const SHORT_LABELS: Partial<Record<SectionKey, string>> = {
  overview: 'Home',
  'jd-analysis': 'Job',
  'cv-analysis': 'CV',
  'fit-score': 'Fit',
  'strengths-gaps': 'Strengths & gaps',
  'cv-optimizer': 'CV optimizer',
  'interview-questions': 'Questions',
  'case-interview': 'Cases',
  'story-bank': 'Stories',
  'company-research': 'Company',
  'industry-research': 'Industry',
  'preparation-plan': '7-day plan',
  'interview-readiness': 'Readiness',
};

interface NavigationTabsProps {
  activeSection: SectionKey;
  onSelectSection: (key: SectionKey) => void;
  visited?: Set<SectionKey>;
}

/** Horizontally scrolling tab rail with group labels, a gradient underline and visited dots. */
export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeSection, onSelectSection, visited }) => {
  const activeRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }, [activeSection]);

  return (
    <nav className="tp-tabrail print:hidden -mx-2" aria-label="Report sections">
      <div className="flex items-stretch w-max min-w-full px-2">
        {SECTION_GROUPS.map((group, gi) => (
          <div key={group.label} className={`tp-tn-group relative flex items-center gap-0.5 ${gi === 0 ? 'pr-2.5' : 'px-2.5'}`}>
            <span className="tp-tn-label hidden lg:inline pr-1.5 pl-0.5 whitespace-nowrap">{group.label}</span>
            {group.keys.map((key) => {
              const tab = SECTIONS.find((s) => s.key === key)!;
              const Icon = tab.icon;
              const isActive = key === activeSection;
              const isVisited = !isActive && visited?.has(key);
              return (
                <button
                  key={key}
                  ref={isActive ? activeRef : undefined}
                  type="button"
                  onClick={() => onSelectSection(key)}
                  aria-current={isActive ? 'page' : undefined}
                  title={`${tab.number}. ${tab.label}`}
                  className="tp-tab flex items-center gap-1.5 px-2.5 pt-3 pb-3.5 text-[13px] font-semibold whitespace-nowrap rounded-t-lg cursor-pointer"
                >
                  <Icon className="w-4 h-4 opacity-80" aria-hidden="true" />
                  <span>{SHORT_LABELS[key] || tab.label}</span>
                  {isVisited && <span className="tp-dot-done w-1.5 h-1.5 rounded-full ml-0.5" aria-label="visited" />}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </nav>
  );
};

import type { TimelineEntry } from '../types';

/**
 * ============================================================
 *  EXPERIENCE TIMELINE
 *  Add internships ONLY when you have verified details:
 *  { category: 'internship', title: 'Role', organisation: 'Company', ... }
 * ============================================================
 */
export const experience: TimelineEntry[] = [
  {
    id: 'btech',
    category: 'academic',
    title: 'B.E. Computer Science & Engineering',
    organisation: 'Mangalore Institute of Technology & Engineering',
    period: '2023 — 2027 (Expected)',
    description:
      'Coursework across programming, OOP, data structures and DBMS, with a focus on applied AI and NLP in my projects.',
    tags: ['Python', 'Java', 'DBMS', 'OOP'],
  },
  {
    id: 'project-location',
    category: 'project',
    title: 'Script-to-Location Recommendation System',
    organisation: 'Final Year Project',
    period: 'Apr 2026 — Oct 2026',
    description:
      'Ranks real filming locations per script scene with sentence embeddings, review sentiment and the Google Places API. Paper accepted at Springer AICCoNS 2027.',
    tags: ['Sentence-Transformers', 'VADER', 'pytest'],
  },
  {
    id: 'project-evaltrack',
    category: 'project',
    title: 'EvalTrack',
    organisation: 'LLM evaluation & regression testing',
    period: 'Nov 2026',
    description: 'Runs prompt versions against test datasets, flags regressions and fails CI when quality drops. 88 pytest tests.',
    tags: ['Flask', 'SQLite', 'GitHub Actions'],
  },
  {
    id: 'class-committee',
    category: 'leadership',
    title: 'Class Committee Member',
    organisation: 'MITE',
    period: '',
    description: 'Coordinated communication and academic activities for a 200+ student branch.',
  },
  {
    id: 'badminton-head',
    category: 'leadership',
    title: 'Head, Badminton Association',
    organisation: 'Local indoor sports association',
    period: '',
    description: 'Lead the association; district-level medalist in badminton.',
  },
  {
    id: 'sap-hackfest',
    category: 'activity',
    title: 'SAP HackFest 2024',
    organisation: 'Participant',
    period: '2024',
    description: 'Took part in SAP HackFest, building a solution with a team under hackathon time limits.',
  },
];

export const categoryLabel: Record<TimelineEntry['category'], string> = {
  academic: 'Academic',
  project: 'Project',
  leadership: 'Leadership',
  activity: 'Activity',
  internship: 'Internship',
};

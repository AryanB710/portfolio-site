import type { SkillCategory } from '../types';

/**
 * ============================================================
 *  SKILLS — honest levels, no fake percentages.
 *  working   = used in real projects
 *  learning  = actively studying / building with
 *  exploring = area of interest
 * ============================================================
 */
export const skillCategories: SkillCategory[] = [
  {
    id: 'programming',
    index: '01',
    title: 'Programming Languages',
    description: 'Python for AI and backend work; Java for coursework and OOP.',
    items: [
      { name: 'Python', level: 'working', icon: 'python' },
      { name: 'Java', level: 'working', icon: 'java' },
      { name: 'JavaScript', level: 'working', icon: 'javascript' },
      { name: 'SQL', level: 'working', icon: 'sql' },
    ],
  },
  {
    id: 'frontend',
    index: '02',
    title: 'Frontend Development',
    description: 'Building the interfaces and dashboards on top of my backends.',
    items: [
      { name: 'HTML', level: 'working', icon: 'html' },
      { name: 'CSS', level: 'working', icon: 'css' },
      { name: 'Streamlit', level: 'working', icon: 'streamlit' },
    ],
  },
  {
    id: 'databases',
    index: '03',
    title: 'Backend & Databases',
    description: 'APIs, storage and data processing for real applications.',
    items: [
      { name: 'Flask', level: 'working', icon: 'flask' },
      { name: 'REST APIs', level: 'working', icon: 'api' },
      { name: 'MySQL', level: 'working', icon: 'mysql' },
      { name: 'SQLite', level: 'working', icon: 'sqlite' },
      { name: 'MongoDB', level: 'working', icon: 'mongodb' },
      { name: 'NumPy', level: 'working', icon: 'numpy' },
    ],
  },
  {
    id: 'tools',
    index: '04',
    title: 'Developer Tools & Testing',
    description: 'Testing, version control and the everyday toolkit.',
    items: [
      { name: 'pytest', level: 'working', icon: 'test' },
      { name: 'Git / GitHub', level: 'working', icon: 'github' },
      { name: 'GitHub Actions', level: 'working', icon: 'actions' },
      { name: 'Postman', level: 'working', icon: 'postman' },
      ],
  },
  {
    id: 'ai-data',
    index: '05',
    title: 'AI, NLP & Data',
    description: 'Where most of my building and learning happens right now.',
    items: [
      { name: 'Sentence-Transformers', level: 'working', icon: 'embeddings' },
      { name: 'Semantic Search', level: 'working', icon: 'nlp' },
      { name: 'VADER Sentiment', level: 'working', icon: 'sentiment' },
      { name: 'Groq LLM API', level: 'working', icon: 'llm' },
      { name: 'Prompt Engineering', level: 'working', icon: 'prompt' },
      { name: 'LLM Evaluation', level: 'working', icon: 'test' },
    ],
  },
];

export const levelLabel: Record<'working' | 'learning' | 'exploring', string> = {
  working: 'Hands-on',
  learning: 'Learning',
  exploring: 'Exploring',
};

export type ProjectStatus = 'completed' | 'in-progress' | 'planned';

export interface Project {
  id: string;
  index: string; // "01", "02"...
  title: string;
  shortTitle: string;
  tagline: string;
  status: ProjectStatus;
  problem: string;
  solution: string;
  stack: string[];
  features: string[];
  /** Leave empty ('') until you have a real link — the button hides itself. */
  githubUrl: string;
  liveUrl: string;
  /** Optional screenshot in /public/images/projects. If empty, a generated visual is shown. */
  image?: string;
  /** Which built-in visual to render when no image is set. */
  visual: 'geo' | 'eval' | 'recon' | 'placeholder';
  /** Period shown on the card, e.g. 'Apr 2026 – Oct 2026' */
  year?: string;
  /** Real, verifiable numbers only */
  metrics?: { value: string; label: string }[];
  /** Optional badge, e.g. a publication */
  badge?: string;
}

export interface SkillCategory {
  id: string;
  index: string;
  title: string;
  description: string;
  items: SkillItem[];
}

export interface SkillItem {
  name: string;
  /** 'working' = used in coursework/projects, 'learning' = actively studying, 'exploring' = interest area */
  level: 'working' | 'learning' | 'exploring';
  icon: SkillIconKey;
}

export type SkillIconKey =
  | 'java'
  | 'python'
  | 'html'
  | 'css'
  | 'mysql'
  | 'mongodb'
  | 'github'
  | 'vscode'
  | 'intellij'
  | 'figma'
  | 'tableau'
  | 'arduino'
  | 'ml'
  | 'genai'
  | 'data'
  | 'web'
  | 'nlp'
  | 'javascript'
  | 'sql'
  | 'flask'
  | 'api'
  | 'test'
  | 'postman'
  | 'sqlite'
  | 'embeddings'
  | 'sentiment'
  | 'llm'
  | 'numpy'
  | 'actions'
  | 'streamlit'
  | 'prompt';

export interface TimelineEntry {
  id: string;
  category: 'academic' | 'project' | 'leadership' | 'activity' | 'internship';
  title: string;
  organisation: string;
  /** Leave '' if you haven't confirmed the dates — the UI will hide it. */
  period: string;
  description: string;
  tags?: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  /** Leave '' until confirmed. */
  year: string;
  /** Link to the verify page or PDF. Leave '' to hide the button. */
  credentialUrl: string;
  /** Optional image in /public/images/certificates */
  image?: string;
  note?: string;
}

export interface Achievement {
  id: string;
  title: string;
  category: 'music' | 'sport' | 'academic' | 'other';
  description: string;
  year: string;
}

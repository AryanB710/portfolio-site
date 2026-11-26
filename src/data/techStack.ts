export type TechItem = {
  name: string;
  color: string;     // brand colour, 6-digit hex
  icon?: string;     // logo URL (leave out to show `glyph` instead)
  glyph?: string;    // short text shown when there's no logo
  invert?: boolean;  // true for black logos so they show on the dark card
};

export type TechRow = { label: string; items: TechItem[] };

const devicon = (name: string, variant = 'original') =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-${variant}.svg`;

export const techRows: TechRow[] = [
  {
    label: 'Languages',
    items: [
      { name: 'Python', color: '#3776AB', icon: devicon('python') },
      { name: 'Java', color: '#E76F00', icon: devicon('java') },
      { name: 'TypeScript', color: '#3178C6', icon: devicon('typescript') },
      { name: 'JavaScript', color: '#F7DF1E', icon: devicon('javascript') },
      { name: 'HTML', color: '#E34F26', icon: devicon('html5') },
      { name: 'CSS', color: '#1572B6', icon: devicon('css3') },
      { name: 'SQL', color: '#159E91', glyph: 'SQL' },
    ],
  },
  {
    label: 'AI & NLP',
    items: [
      { name: 'Sentence-Transformers', color: '#159E91', glyph: 'ST' },
      { name: 'BERT', color: '#FFB000', glyph: 'BERT' },
      { name: 'Groq LLM API', color: '#F55036', glyph: 'GQ' },
      { name: 'VADER', color: '#8B5CF6', glyph: 'VD' },
      { name: 'RAG', color: '#22D3EE', glyph: 'RAG' },
      { name: 'Prompt Engineering', color: '#159E91', glyph: '>_' },
      { name: 'LLM Evaluation', color: '#10B981', glyph: '✓' },
    ],
  },
  {
    label: 'Backend & Data',
    items: [
      { name: 'Flask', color: '#9CA3AF', icon: devicon('flask'), invert: true },
      { name: 'REST APIs', color: '#159E91', glyph: '{ }' },
      { name: 'MySQL', color: '#4479A1', icon: devicon('mysql') },
      { name: 'MongoDB', color: '#47A248', icon: devicon('mongodb') },
      { name: 'SQLite', color: '#0F80CC', icon: devicon('sqlite') },
      { name: 'pytest', color: '#0A9EDC', icon: devicon('pytest') },
    ],
  },
  {
    label: 'Tools',
    items: [
      { name: 'Git', color: '#F05032', icon: devicon('git') },
      { name: 'GitHub Actions', color: '#2088FF', icon: devicon('githubactions') },
      { name: 'React', color: '#61DAFB', icon: devicon('react') },
      { name: 'Tailwind CSS', color: '#06B6D4', icon: devicon('tailwindcss') },
      { name: 'Three.js', color: '#9CA3AF', icon: devicon('threejs'), invert: true },
      { name: 'Vercel', color: '#9CA3AF', icon: devicon('vercel'), invert: true },
      { name: 'Figma', color: '#F24E1E', icon: devicon('figma') },
      { name: 'VS Code', color: '#007ACC', icon: devicon('vscode') },
    ],
  },
];
/**
 * ============================================================
 *  YOUR PERSONAL DETAILS — edit this file first.
 *  (Filled in from your resume, November 2026.)
 * ============================================================
 */
export const profile = {
  name: 'Aryan Bose',
  firstName: 'Aryan',
  role: 'Computer Science Engineer',
  status: 'Open to opportunities',
  location: 'Mangaluru, Karnataka, India',
  availability: 'Bengaluru (on-site / hybrid) or remote',
  university: 'Mangalore Institute of Technology & Engineering (MITE)',
  universityShort: 'MITE',
  degree: 'B.E. Computer Science & Engineering',
  graduationYear: '2027',

  intro:
    "Hi, I'm Aryan Bose — a Computer Science student passionate about software engineering, artificial intelligence and building meaningful digital experiences.",

  email: 'aryanbose.710@gmail.com',
  linkedin: 'https://linkedin.com/in/aryan-bose-b73960227/',
  github: 'https://github.com/AryanB710',
  githubHandle: 'AryanB710',

  /** Replace public/resume/Aryan_Bose_Resume.pdf (same name) to update. */
  resumeUrl: '/resume/Aryan_Bose_Resume.pdf',
  resumeFileName: 'Aryan_Bose_Resume.pdf',

  /** Optional photo in public/images/profile.jpg. Leave '' to show the monogram card. */
  photo: '',
} as const;

/** Headline numbers — every one comes straight from the resume. */
export const highlights = [
  { value: '4', label: 'Projects on GitHub' },
  { value: '150+', label: 'Automated pytest tests written' },
  { value: '1', label: 'Springer paper accepted' },
] as const;

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
] as const;

export const aboutCopy = {
  headline: ['Curious Mind.', 'Creative Builder.', 'Future Engineer.'],
  paragraphs: [
    "I'm a final-year Computer Science student at MITE who builds and tests NLP and LLM applications in Python. I like the moment an idea turns into something people can actually use.",
    'My final-year project recommends real filming locations from a film script using sentence embeddings and review sentiment, and the paper on it was accepted at Springer AICCoNS 2027. Since then I built EvalTrack, a platform that catches quality regressions in LLM prompts before they ship.',
    "My approach is simple: understand the real need, break it into small pieces, build something that works, then prove it with tests. I'm looking for a GenAI / AI Engineering or Software Development internship in Bengaluru.",
  ],
  focus: ['Generative AI', 'NLP & LLM Apps', 'Software Development', 'Data Analytics', 'Full-Stack Development'],
  /** Personal journey timeline — edit freely. Leave year '' if unsure. */
  journey: [
    { year: '2023', title: 'Started B.E. in CSE at MITE', text: 'Built foundations in programming, data structures, OOP and databases.' },
    { year: '2026', title: 'Script-to-Location Recommender', text: 'Final-year project combining semantic search, sentiment and the Google Places API.' },
    { year: '2026', title: 'EvalTrack & Payment Reconciliation', text: 'Shipped an LLM regression-testing platform and a reconciliation tool, both test-driven.' },
    { year: '2027', title: 'AICCoNS paper & graduation', text: 'Oral presentation at Springer AICCoNS 2027, Dubai; graduating in 2027.' },
  ],
} as const;

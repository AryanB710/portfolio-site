import type { Achievement, Certification } from '../types';

/**
 * ============================================================
 *  PUBLICATION, CERTIFICATIONS & ACHIEVEMENTS
 *  Empty `year` / `credentialUrl` values are hidden automatically.
 *  Optional images go in public/images/certificates/.
 * ============================================================
 */
export const publication = {
  title: 'Location Recommendation System for Content Shooting Using BERT and Geospatial APIs',
  role: 'Co-author',
  venue: 'Springer AICCoNS 2027, Dubai',
  status: 'Accepted for oral presentation · to appear in Springer CCIS (Scopus-indexed)',
  url: '', // add the DOI / proceedings link once it's published
};

export const certifications: Certification[] = [
  {
    id: 'intro-vr',
    title: 'Introduction to Virtual Reality',
    issuer: 'NPTEL (SWAYAM) · IIT Kharagpur',
    year: '',
    credentialUrl: '',
    note: 'Silver · 80%',
  },
  {
    id: 'genai-swe',
    title: 'Generative AI for Software Development',
    issuer: 'DeepLearning.AI',
    year: '',
    credentialUrl: '',
  },
  {
    id: 'ml-specialization',
    title: 'Machine Learning Specialization',
    issuer: 'DeepLearning.AI · Stanford Online',
    year: '',
    credentialUrl: '',
  },
  {
    id: 'intro-ml-google',
    title: 'Introduction to Machine Learning',
    issuer: 'Google Developers',
    year: '',
    credentialUrl: '',
  },
];

export const achievements: Achievement[] = [
  {
    id: 'badminton',
    title: 'District-level Badminton Medalist',
    category: 'sport',
    description: 'Medalled at district level; also head of a local badminton association.',
    year: '',
  },
  {
    id: 'piano',
    title: 'Piano — Grade 5',
    category: 'music',
    description: 'Trinity College London graded examination.',
    year: '',
  },
];

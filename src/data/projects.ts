import type { Project } from '../types';

/**
 * ============================================================
 *  PROJECTS — add a new object to this array to add a project.
 *  Only put real numbers in `metrics`. Empty githubUrl / liveUrl
 *  hide those buttons automatically.
 * ============================================================
 */
export const projects: Project[] = [
  {
    id: 'location-recommender',
    index: '01',
    title: 'Script-to-Location Recommendation System for Film Shoots',
    shortTitle: 'Location Intelligence',
    tagline: 'Turns a film script into ranked, real-world shooting locations — scene by scene.',
    status: 'completed',
    year: 'Apr 2026 – Oct 2026',
    badge: 'Final Year Project · Springer AICCoNS 2027',
    problem:
      'Location scouting is slow and manual. A scene described in a script ("quiet beach at golden hour") doesn\'t map neatly onto map searches, and listings are often incomplete, so ranking them fairly is hard.',
    solution:
      'A web app that splits a script into scenes, fetches real candidate places from the Google Places API, and ranks the top 5 per scene with an adaptive weighted score: semantic similarity, review sentiment, verified facilities and rating — with weights that renormalise when data is missing.',
    stack: ['Python', 'Sentence-Transformers', 'VADER', 'Google Places API (New)', 'pytest'],
    features: [
      'Adaptive ranking: 40% semantic similarity, 20% review sentiment, 20% verified facilities, 20% rating',
      'Weights renormalise when data is missing, so incomplete listings are still ranked fairly',
      'Explainable "Why this place?" results and review-based crowd estimation',
      'Colour-graded Atmosphere Preview rendering a 1600×1200 photo in ~0.2s',
      'Lightweight inference: a scene and 21 candidate places embedded in ~58ms on CPU, no GPU',
      '65 pytest tests with mocked APIs plus 26 functional tests; 2 failures documented as known limitations',
    ],
    metrics: [
      { value: '~58ms', label: 'CPU embedding, 21 places' },
      { value: '79%', label: 'Test coverage (100% ranking)' },
      { value: 'Top 5', label: 'Ranked places per scene' },
    ],
    githubUrl: 'https://github.com/AryanB710/location-recommendation-system',
    liveUrl: '',
    visual: 'geo',
  },
  {
    id: 'evaltrack',
    index: '02',
    title: 'EvalTrack — LLM Evaluation & Regression Testing Platform',
    shortTitle: 'EvalTrack',
    tagline: 'Catches prompt regressions case by case before they reach production.',
    status: 'completed',
    year: 'Nov 2026',
    problem:
      'Changing a prompt can quietly break answers that used to work. Without repeatable tests, teams only find out after deployment — sometimes via a prompt-injection leak.',
    solution:
      'A platform that runs prompt versions against reusable test datasets, scores them with automated checks plus a human-review queue, compares versions on quality, latency and cost, and blocks CI when quality regresses.',
    stack: ['Python', 'Flask', 'SQLite', 'Groq / OpenAI-compatible APIs', 'pytest', 'GitHub Actions'],
    features: [
      '12 automated check types: keyword, regex, similarity, JSON, length and more',
      'Human-review queue whose verdicts override automated results',
      'Dashboards comparing pass rate, avg/p95 latency, tokens and cost per prompt version',
      'Caught a prompt that cut tokens by 56% but broke 4 answers, including a prompt-injection leak',
      'Retries with exponential backoff for rate limits and timeouts',
      'CLI quality gate that fails CI on regressions; covered by 88 pytest tests',
    ],
    metrics: [
      { value: '12', label: 'Automated check types' },
      { value: '88', label: 'pytest tests' },
      { value: 'CI', label: 'Quality gate on regressions' },
    ],
    githubUrl: 'https://github.com/AryanB710/evaltrack',
    liveUrl: '',
    visual: 'eval',
  },
  {
    id: 'payment-reconciliation',
    index: '03',
    title: 'Payment Reconciliation & Exception Tracker',
    shortTitle: 'Reconciliation',
    tagline: 'Matches orders, payments and settlements — and surfaces what doesn\'t add up.',
    status: 'completed',
    year: 'Nov 2026',
    problem:
      'Orders, payments and settlements live in separate CSV exports. Duplicates, missing settlements and amount mismatches are easy to miss when you reconcile them by hand.',
    solution:
      'A web app that reconciles the three record types with explicit matching rules, then routes every exception to a dashboard with resolution tracking and a full audit history.',
    stack: ['Python', 'pytest', 'CSV data processing'],
    features: [
      'Matching rules for duplicate transactions, missing settlements and amount mismatches',
      'Exception dashboard with resolution tracking and full audit history',
      'On a 204-order sample run: 84.8% auto-matched, 36 exceptions surfaced for review',
      'Matching logic validated with pytest on synthetic data containing injected discrepancies',
    ],
    metrics: [
      { value: '84.8%', label: 'Orders auto-matched (sample)' },
      { value: '36', label: 'Exceptions surfaced' },
      { value: '204', label: 'Orders in sample run' },
    ],
    githubUrl: 'https://github.com/AryanB710/payment-reconciliation-tracker',
    liveUrl: '',
    visual: 'recon',
  },
];

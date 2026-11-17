import type { ReactNode } from 'react';
import type { Project } from '../types';
import { GeoVisual } from './GeoVisual';

const mono = 'JetBrains Mono, monospace';
const sans = 'Inter, sans-serif';

function Frame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 720 440" className="h-full w-full" role="img" aria-label={label}>
      <defs>
        <radialGradient id={`bg-${label.length}`} cx="70%" cy="20%" r="90%">
          <stop offset="0%" stopColor="#0d2522" />
          <stop offset="55%" stopColor="#080d0d" />
          <stop offset="100%" stopColor="#050505" />
        </radialGradient>
        <pattern id="pv-grid" width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M36 0H0V36" fill="none" stroke="rgba(255,255,255,0.035)" />
        </pattern>
      </defs>
      <rect width="720" height="440" fill={`url(#bg-${label.length})`} />
      <rect width="720" height="440" fill="url(#pv-grid)" />
      {/* window chrome */}
      <rect x="24" y="22" width="672" height="396" rx="18" fill="rgba(10,14,14,0.75)" stroke="rgba(255,255,255,0.08)" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={46 + i * 16} cy="44" r="4.5" fill={i === 0 ? '#2dd4bf' : 'rgba(255,255,255,0.15)'} />
      ))}
      {children}
      <text x="40" y="408" fontFamily={mono} fontSize="9" fill="rgba(255,255,255,0.28)" letterSpacing="1.5">
        ILLUSTRATIVE PREVIEW
      </text>
    </svg>
  );
}

/** EvalTrack: prompt version comparison dashboard */
export function EvalVisual({ animated = true }: { animated?: boolean }) {
  const rows = [
    { name: 'v3 · concise', pass: 0.82, lat: '1.4s', bad: true },
    { name: 'v2 · baseline', pass: 0.96, lat: '1.9s', bad: false },
    { name: 'v1 · first draft', pass: 0.74, lat: '2.3s', bad: false },
  ];
  return (
    <Frame label="Illustration: LLM evaluation dashboard comparing prompt versions">
      <text x="110" y="48" fontFamily={mono} fontSize="10" fill="#7d8590" letterSpacing="1.5">
        EVALTRACK · PROMPT VERSIONS
      </text>
      {/* stat tiles */}
      {[
        ['PASS RATE', '96%'],
        ['P95 LATENCY', '2.1s'],
        ['CHECK TYPES', '12'],
      ].map(([k, v], i) => (
        <g key={k} transform={`translate(${44 + i * 152} 72)`}>
          <rect width="140" height="70" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" />
          <text x="14" y="26" fontFamily={mono} fontSize="9" fill="#7d8590" letterSpacing="1.2">
            {k}
          </text>
          <text x="14" y="54" fontFamily={sans} fontSize="22" fontWeight="600" fill="#e6edf3">
            {v}
          </text>
        </g>
      ))}
      {/* sparkline */}
      <g transform="translate(504 72)">
        <rect width="172" height="70" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" />
        <polyline points="14,52 38,44 62,48 86,30 110,34 134,22 158,26" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeLinejoin="round">
          {animated && <animate attributeName="stroke-dasharray" values="0 400;400 0" dur="2.5s" fill="freeze" />}
        </polyline>
      </g>
      {/* version table */}
      {rows.map((r, i) => (
        <g key={r.name} transform={`translate(44 ${166 + i * 58})`}>
          <rect width="632" height="48" rx="12" fill={r.bad ? 'rgba(251,191,36,0.06)' : 'rgba(255,255,255,0.025)'} stroke={r.bad ? 'rgba(251,191,36,0.35)' : 'rgba(255,255,255,0.06)'} />
          <text x="18" y="29" fontFamily={sans} fontSize="13" fill="#e6edf3">
            {r.name}
          </text>
          <rect x="200" y="20" width="240" height="8" rx="4" fill="rgba(255,255,255,0.07)" />
          <rect x="200" y="20" width={240 * r.pass} height="8" rx="4" fill={r.bad ? '#fbbf24' : '#2dd4bf'} />
          <text x="456" y="29" fontFamily={mono} fontSize="11" fill="#c4c7cc">
            {Math.round(r.pass * 100)}%
          </text>
          <text x="520" y="29" fontFamily={mono} fontSize="11" fill="#7d8590">
            {r.lat}
          </text>
          {r.bad && (
            <g transform="translate(560 13)">
              <rect width="60" height="22" rx="11" fill="rgba(251,191,36,0.15)" />
              <text x="30" y="15" textAnchor="middle" fontFamily={mono} fontSize="9" fill="#fbbf24">
                REGRESS
              </text>
            </g>
          )}
        </g>
      ))}
      {/* CI gate */}
      <g transform="translate(44 344)">
        <rect width="250" height="40" rx="10" fill="#071311" stroke="rgba(45,212,191,0.25)" />
        <text x="14" y="25" fontFamily={mono} fontSize="11" fill="#2dd4bf">
          $ evaltrack gate
        </text>
        <text x="138" y="25" fontFamily={mono} fontSize="11" fill="#fbbf24">
          ✕ 4 regressions
        </text>
      </g>
    </Frame>
  );
}

/** Payment reconciliation: three-way matching + exceptions */
export function ReconVisual({ animated = true }: { animated?: boolean }) {
  const cols = ['ORDERS', 'PAYMENTS', 'SETTLEMENTS'];
  return (
    <Frame label="Illustration: payment reconciliation matching orders, payments and settlements">
      <text x="110" y="48" fontFamily={mono} fontSize="10" fill="#7d8590" letterSpacing="1.5">
        RECONCILIATION · RUN
      </text>
      {cols.map((c, ci) => (
        <g key={c} transform={`translate(${44 + ci * 150} 72)`}>
          <text x="0" y="12" fontFamily={mono} fontSize="9" fill="#7d8590" letterSpacing="1.4">
            {c}
          </text>
          {[0, 1, 2, 3, 4].map((ri) => {
            const missing = ci === 2 && ri === 3;
            const mismatch = ci === 1 && ri === 1;
            return (
              <rect
                key={ri}
                x="0"
                y={26 + ri * 46}
                width="120"
                height="34"
                rx="9"
                fill={missing ? 'transparent' : 'rgba(255,255,255,0.035)'}
                stroke={missing ? 'rgba(251,191,36,0.6)' : mismatch ? 'rgba(251,191,36,0.6)' : 'rgba(255,255,255,0.08)'}
                strokeDasharray={missing ? '4 4' : undefined}
              />
            );
          })}
        </g>
      ))}
      {/* match connectors */}
      {[0, 2, 4].map((ri) => (
        <g key={ri} stroke="#2dd4bf" strokeWidth="1.5" opacity="0.8">
          <line x1="164" y1={115 + ri * 46} x2="194" y2={115 + ri * 46}>
            {animated && <animate attributeName="opacity" values="0;1" dur="0.6s" begin={`${ri * 0.2}s`} fill="freeze" />}
          </line>
          <line x1="314" y1={115 + ri * 46} x2="344" y2={115 + ri * 46}>
            {animated && <animate attributeName="opacity" values="0;1" dur="0.6s" begin={`${ri * 0.2 + 0.3}s`} fill="freeze" />}
          </line>
        </g>
      ))}
      {/* summary panel */}
      <g transform="translate(500 72)">
        <rect width="176" height="232" rx="14" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" />
        <text x="16" y="30" fontFamily={mono} fontSize="9" fill="#7d8590" letterSpacing="1.4">
          AUTO-MATCHED
        </text>
        <text x="16" y="66" fontFamily={sans} fontSize="34" fontWeight="600" fill="#e6edf3">
          84.8%
        </text>
        <rect x="16" y="80" width="144" height="6" rx="3" fill="rgba(255,255,255,0.08)" />
        <rect x="16" y="80" width="122" height="6" rx="3" fill="#2dd4bf" />
        {[
          ['Duplicates', '#fbbf24'],
          ['Missing settlement', '#fbbf24'],
          ['Amount mismatch', '#fbbf24'],
        ].map(([t, c], i) => (
          <g key={t} transform={`translate(16 ${116 + i * 34})`}>
            <circle cx="4" cy="-4" r="4" fill={c} opacity="0.85" />
            <text x="16" y="0" fontFamily={sans} fontSize="12" fill="#c4c7cc">
              {t}
            </text>
          </g>
        ))}
        <text x="16" y="214" fontFamily={mono} fontSize="10" fill="#2dd4bf">
          36 exceptions → review
        </text>
      </g>
      <g transform="translate(44 330)">
        <rect width="440" height="46" rx="12" fill="rgba(251,191,36,0.06)" stroke="rgba(251,191,36,0.3)" />
        <text x="16" y="28" fontFamily={sans} fontSize="12" fill="#e6edf3">
          Exception · amount mismatch
        </text>
        <text x="424" y="28" textAnchor="end" fontFamily={mono} fontSize="10" fill="#fbbf24">
          OPEN · audit trail
        </text>
      </g>
    </Frame>
  );
}

/** Picks the right visual (or screenshot) for a project. */
export function ProjectVisual({ project, animated = true }: { project: Project; animated?: boolean }) {
    const cover = project.image || project.screenshots?.[0]?.src;
  if (cover) {
    return <img src={cover} alt={`${project.title} screenshot`} className="h-full w-full object-cover object-top" loading="lazy" decoding="async" />;
  }
  if (project.visual === 'eval') return <EvalVisual animated={animated} />;
  if (project.visual === 'recon') return <ReconVisual animated={animated} />;
  return <GeoVisual animated={animated} />;
}

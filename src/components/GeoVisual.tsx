/**
 * Generated product visual for the Location Recommendation project:
 * a dark map with contour lines, scored location pins, a route and
 * a weather/match panel. Pure SVG — crisp at any size, ~0 KB.
 */
export function GeoVisual({ animated = true }: { animated?: boolean }) {
  const pins = [
    { x: 248, y: 182, score: 94, label: 'Panambur Beach', main: true },
    { x: 418, y: 120, score: 88, label: 'Old Port' },
    { x: 520, y: 262, score: 81, label: 'Hill Viewpoint' },
    { x: 150, y: 300, score: 76, label: 'Riverside' },
  ];

  return (
    <svg viewBox="0 0 720 440" className="h-full w-full" role="img" aria-label="Illustration: map with ranked shooting locations and a score breakdown">
      <defs>
        <radialGradient id="geo-bg" cx="35%" cy="40%" r="80%">
          <stop offset="0%" stopColor="#0d2522" />
          <stop offset="60%" stopColor="#080d0d" />
          <stop offset="100%" stopColor="#050505" />
        </radialGradient>
        <radialGradient id="geo-pulse">
          <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="geo-route" x1="0" x2="1">
          <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0" />
          <stop offset="50%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#159e91" stopOpacity="0.2" />
        </linearGradient>
        <pattern id="geo-grid" width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M36 0H0V36" fill="none" stroke="rgba(255,255,255,0.04)" />
        </pattern>
      </defs>

      <rect width="720" height="440" fill="url(#geo-bg)" />
      <rect width="720" height="440" fill="url(#geo-grid)" />

      {/* coastline / land mass */}
      <path d="M0 360 C80 330 110 250 90 190 C70 120 130 70 210 60 C300 50 340 0 360 0 L0 0 Z" fill="rgba(21,158,145,0.05)" stroke="rgba(45,212,191,0.18)" />
      {/* contour lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx={510} cy={250} rx={60 + i * 38} ry={36 + i * 24} fill="none" stroke="rgba(45,212,191,0.09)" strokeDasharray={i % 2 ? '3 5' : undefined} transform="rotate(-12 510 250)" />
      ))}
      {/* roads */}
      <path d="M0 230 C160 220 220 120 400 130 S640 220 720 190" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
      <path d="M300 440 C300 330 360 260 520 262" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />

      {/* recommended route */}
      <path d="M150 300 C190 250 210 200 248 182 S380 110 418 120" fill="none" stroke="url(#geo-route)" strokeWidth="2.5" strokeDasharray="6 8">
        {animated && <animate attributeName="stroke-dashoffset" from="0" to="-56" dur="2.4s" repeatCount="indefinite" />}
      </path>

      {/* pins */}
      {pins.map((p) => (
        <g key={p.label} transform={`translate(${p.x} ${p.y})`}>
          {p.main && (
            <circle r="46" fill="url(#geo-pulse)">
              {animated && <animate attributeName="r" values="20;52;20" dur="3s" repeatCount="indefinite" />}
              {animated && <animate attributeName="opacity" values="1;0;1" dur="3s" repeatCount="indefinite" />}
            </circle>
          )}
          <circle r={p.main ? 9 : 6} fill={p.main ? '#2dd4bf' : '#0b1716'} stroke="#2dd4bf" strokeWidth="2" />
          <g transform={`translate(${p.main ? 16 : 12} -14)`}>
            <rect width={p.main ? 150 : 124} height="28" rx="14" fill="rgba(10,14,14,0.85)" stroke="rgba(255,255,255,0.1)" />
            <text x="12" y="18" fontFamily="Inter, sans-serif" fontSize="11" fill="#e6edf3">
              {p.label}
            </text>
            <text x={p.main ? 138 : 112} y="18" textAnchor="end" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#2dd4bf">
              {p.score}
            </text>
          </g>
        </g>
      ))}

      {/* query panel */}
      <g transform="translate(24 24)">
        <rect width="292" height="52" rx="14" fill="rgba(12,16,16,0.9)" stroke="rgba(255,255,255,0.1)" />
        <circle cx="26" cy="26" r="9" fill="none" stroke="#2dd4bf" strokeWidth="1.6" />
        <path d="M32.5 32.5 L37 37" stroke="#2dd4bf" strokeWidth="1.6" strokeLinecap="round" />
        <text x="50" y="22" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#7d8590" letterSpacing="1.5">
          SCENE 12
        </text>
        <text x="50" y="38" fontFamily="Inter, sans-serif" fontSize="12" fill="#e6edf3">
          “quiet beach at golden hour, wide shots”
        </text>
      </g>

      {/* "Why this place?" score breakdown */}
      <g transform="translate(478 296)">
        <rect width="218" height="120" rx="16" fill="rgba(12,16,16,0.9)" stroke="rgba(255,255,255,0.1)" />
        <text x="16" y="24" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#7d8590" letterSpacing="1.5">
          WHY THIS PLACE?
        </text>
        {[
          ['Semantic match', 0.4, 0.92],
          ['Review sentiment', 0.2, 0.86],
          ['Facilities', 0.2, 0.75],
          ['Rating', 0.2, 0.9],
        ].map(([label, w, v], i) => (
          <g key={label as string} transform={`translate(16 ${42 + i * 19})`}>
            <text x="0" y="4" fontFamily="Inter, sans-serif" fontSize="10" fill="#c4c7cc">
              {label} · {Math.round((w as number) * 100)}%
            </text>
            <rect x="112" y="-2" width="74" height="5" rx="2.5" fill="rgba(255,255,255,0.08)" />
            <rect x="112" y="-2" width={74 * (v as number)} height="5" rx="2.5" fill="#2dd4bf" />
          </g>
        ))}
      </g>
      <text x="24" y="420" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(255,255,255,0.3)" letterSpacing="1.5">
        ILLUSTRATIVE PREVIEW
      </text>
    </svg>
  );
}

import { useRef } from 'react';
import { ArrowUpRight, Award, Mic, Music2, ScrollText, Trophy } from 'lucide-react';
import { achievements, certifications, publication } from '../data/achievements';
import { SectionHeading } from '../components/SectionHeading';
import { useReveal, useSplitHeadings } from '../animations/useReveal';
import type { Achievement } from '../types';

const achIcon: Record<Achievement['category'], typeof Trophy> = {
  music: Music2,
  sport: Trophy,
  academic: Award,
  other: Award,
};

export function Achievements() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  useSplitHeadings(root);

  return (
    <section id="achievements" ref={root} className="section">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
      <div className="container-x">
        <SectionHeading
          index="06"
          eyebrow="Achievements & certifications"
          title={
            <>
              Always <span className="text-accent-bright">learning</span>, on and off the screen.
            </>
          }
        />

        {/* ---------- featured publication ---------- */}
        <article data-reveal="scale" className="relative mb-20 overflow-hidden rounded-[32px] border border-accent/25 bg-gradient-to-br from-accent/[0.12] via-ink-2 to-ink p-8 md:p-12">
          <div aria-hidden="true" className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent/25 blur-[100px]" />
          <div className="relative grid gap-8 md:grid-cols-[auto_1fr] md:items-start md:gap-10">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/40 bg-accent/15 text-accent-bright">
              <ScrollText size={28} strokeWidth={1.5} />
            </span>
            <div>
              <p className="eyebrow">Publication · {publication.role}</p>
              <h3 className="mt-4 max-w-3xl font-display text-2xl leading-snug font-semibold tracking-tight md:text-4xl">“{publication.title}”</h3>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-medium text-ink">
                  <Mic size={14} /> {publication.venue}
                </span>
                <span className="text-soft">{publication.status}</span>
              </div>
              {publication.url && (
                <a href={publication.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-1.5 text-sm text-accent-bright hover:underline">
                  Read the paper <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          </div>
        </article>

        <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          {/* ---------- certifications ---------- */}
          <div>
            <h3 className="mb-6 font-mono text-xs tracking-widest text-muted uppercase" data-reveal>
              Certifications
            </h3>
            <ul className="border-t border-line">
              {certifications.map((c) => {
                const rowClass = 'group flex items-center gap-5 border-b border-line py-6 transition-colors';
                const inner = (
                  <>
                      {c.image ? (
                        <img src={c.image} alt="" className="h-14 w-20 shrink-0 rounded-lg border border-line object-cover" loading="lazy" />
                      ) : (
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-line bg-white/[0.02] text-accent-bright transition-all duration-500 group-hover:border-accent/50 group-hover:bg-accent/10">
                          <Award size={20} strokeWidth={1.6} />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-lg leading-snug font-medium text-white transition-transform duration-500 group-hover:translate-x-1 md:text-xl">
                          {c.title}
                        </p>
                        <p className="mt-1 text-sm text-muted">
                          {c.issuer}
                          {c.note && <span className="text-accent-bright"> · {c.note}</span>}
                          {c.year && <span> · {c.year}</span>}
                        </p>
                      </div>
                      {c.credentialUrl && (
                        <ArrowUpRight size={20} className="shrink-0 text-muted transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-bright" />
                      )}
                  </>
                );
                return (
                  <li key={c.id} data-reveal>
                    {c.credentialUrl ? (
                      <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className={rowClass}>
                        {inner}
                      </a>
                    ) : (
                      <div className={rowClass}>{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ---------- other achievements ---------- */}
          <div>
            <h3 className="mb-6 font-mono text-xs tracking-widest text-muted uppercase" data-reveal>
              Beyond the code
            </h3>
            <div className="space-y-4">
              {achievements.map((a) => {
                const Icon = achIcon[a.category];
                return (
                  <article key={a.id} data-reveal="right" className="glass group relative overflow-hidden rounded-3xl p-7 transition-colors duration-500 hover:border-accent/40">
                    <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-accent/10 blur-3xl transition-opacity duration-700 group-hover:opacity-100 md:opacity-0" />
                    <Icon size={26} strokeWidth={1.5} className="relative text-accent-bright" />
                    <h4 className="relative mt-5 font-display text-2xl font-semibold tracking-tight">{a.title}</h4>
                    <p className="relative mt-2 text-muted">{a.description}</p>
                    {a.year && <p className="relative mt-4 font-mono text-xs text-muted">{a.year}</p>}
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

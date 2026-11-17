import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { gsap, useGSAP } from '../animations/gsap';
import { useMotion } from '../animations/MotionContext';

/** The two expandable cards on the right. Edit to taste. */
const services = [
  {
    title: 'AI & NLP Engineering',
    subtitle: 'LLM apps, semantic search & evaluation',
    text: 'I build and test NLP and LLM applications in Python — from semantic search with sentence embeddings and review-sentiment ranking to evaluation pipelines that catch prompt regressions before they ship.',
    tags: ['Sentence-Transformers', 'Groq LLM API', 'Prompt Engineering', 'LLM Evaluation', 'VADER'],
  },
  {
    title: 'Software & Backend',
    subtitle: 'APIs, data processing & testing',
    text: 'Flask backends, REST APIs and data tools with a strong testing habit: mocked APIs, coverage targets and CI quality gates, so things keep working after the demo.',
    tags: ['Python', 'Flask', 'REST APIs', 'SQL', 'pytest', 'GitHub Actions'],
  },
];

function Corners() {
  const c = 'absolute h-4 w-4 border-accent-bright/70';
  return (
    <span aria-hidden="true">
      <span className={`${c} top-0 left-0 border-t-2 border-l-2`} />
      <span className={`${c} top-0 right-0 border-t-2 border-r-2`} />
      <span className={`${c} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${c} right-0 bottom-0 border-r-2 border-b-2`} />
    </span>
  );
}

/**
 * "What I do" — on desktop the character sits down at his desk
 * behind this section (three/HeroScene.tsx STAGES.desk).
 */
export function WhatIDo() {
  const root = useRef<HTMLElement>(null);
  const { reducedMotion } = useMotion();
  const [open, setOpen] = useState(0);

  useGSAP(
    () => {
      if (reducedMotion) return;
      gsap.from('.wid-title span', {
        yPercent: 100,
        autoAlpha: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 55%', once: true },
      });
      gsap.from('.wid-card', {
        x: 60,
        autoAlpha: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 45%', once: true },
      });
    },
    { scope: root, dependencies: [reducedMotion] },
  );

  return (
    <section id="what-i-do" ref={root} className="relative flex min-h-[100svh] items-center py-24">
      <div className="mx-auto grid w-full max-w-[1500px] items-center gap-12 px-6 md:grid-cols-[1fr_1.1fr_1.1fr] md:px-24 lg:px-36">
        <h2 className="wid-title font-display text-[clamp(3rem,6vw,6rem)] leading-[0.92] font-semibold tracking-tight uppercase">
          <span className="block overflow-hidden">What</span>
          <span className="block overflow-hidden">
            I <span className="text-accent-bright">do</span>
          </span>
        </h2>
        {/* middle column stays empty: the 3D desk scene shows through */}
        <div className="hidden md:block" />
        <div className="space-y-4">
          {services.map((s, i) => {
            const isOpen = open === i;
            return (
              <article key={s.title} className="wid-card relative bg-ink/60 backdrop-blur-sm">
                <div className="relative border border-dashed border-line-strong p-6 md:p-7">
                  <Corners />
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-start justify-between gap-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span>
                      <span className="block font-display text-2xl font-semibold tracking-tight uppercase md:text-3xl">{s.title}</span>
                      <span className="mt-1 block text-sm text-muted">{s.subtitle}</span>
                    </span>
                    <span className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center border border-line-strong transition-transform duration-500 ${isOpen ? 'rotate-180 border-accent/60 text-accent-bright' : ''}`}>
                      <ChevronDown size={16} />
                    </span>
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <p className="mt-5 text-sm leading-relaxed text-soft">{s.text}</p>
                      <p className="mt-5 font-mono text-[10px] tracking-widest text-muted uppercase">Skillset &amp; tools</p>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {s.tags.map((t) => (
                          <li key={t} className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-soft">
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

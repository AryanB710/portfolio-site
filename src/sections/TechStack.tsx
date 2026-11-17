import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { skillCategories, levelLabel } from '../data/skills';
import { useMotion } from '../animations/MotionContext';
import { useReveal, useSplitHeadings } from '../animations/useReveal';
import type { StackItem } from '../three/TechStackScene';

const TechStackScene = lazy(() => import('../three/TechStackScene'));

/** Balls in the pile. Colours are the stripe on each ball. */
const STACK: StackItem[] = [
  { name: 'Python', color: '#3b82f6' },
  { name: 'Java', color: '#f97316' },
  { name: 'JavaScript', color: '#facc15' },
  { name: 'SQL', color: '#38bdf8' },
  { name: 'Flask', color: '#94a3b8' },
  { name: 'pytest', color: '#2dd4bf' },
  { name: 'MySQL', color: '#0ea5e9' },
  { name: 'MongoDB', color: '#22c55e' },
  { name: 'SQLite', color: '#60a5fa' },
  { name: 'NumPy', color: '#6366f1' },
  { name: 'Git', color: '#ef4444' },
  { name: 'Actions', color: '#a3a3a3' },
  { name: 'Postman', color: '#fb923c' },
  { name: 'Streamlit', color: '#f43f5e' },
  { name: 'HTML', color: '#f97316' },
  { name: 'CSS', color: '#3b82f6' },
  { name: 'S-BERT', color: '#159e91' },
  { name: 'Groq', color: '#f472b6' },
  { name: 'VADER', color: '#a78bfa' },
  { name: 'REST', color: '#14b8a6' },
];

export function TechStack() {
  const root = useRef<HTMLElement>(null);
  const motion = useMotion();
  const [inView, setInView] = useState(false);
  useSplitHeadings(root);
  useReveal(root);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const show3D = !motion.reducedMotion && !motion.isMobile;

  return (
    <section id="skills" ref={root} className="relative bg-ink py-28 md:py-36">
      <div className="mx-auto max-w-[1300px] px-6 md:px-24">
        <h2 data-split className="text-center font-display text-[clamp(2.6rem,6vw,5.5rem)] leading-[1] font-medium tracking-tight">
          My tech <span className="text-accent-bright">stack</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-center text-muted" data-reveal>
          {show3D ? 'Move your mouse through the pile.' : 'The tools I build with.'} Everything here has been used in a real project.
        </p>
      </div>

      {show3D ? (
        <div className="relative mt-6 h-[70svh] min-h-[480px] w-full">
          <Suspense fallback={null}>
            <TechStackScene items={STACK} active={inView} animate={!motion.reducedMotion} rich={motion.rich} />
          </Suspense>
        </div>
      ) : (
        <ul className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-3 px-6">
          {STACK.map((s) => (
            <li key={s.name} className="rounded-full border border-line bg-white/[0.03] px-4 py-2 text-sm text-soft">
              {s.name}
            </li>
          ))}
        </ul>
      )}

      {/* accessible, honest skill list grouped by category */}
      <div className="mx-auto mt-16 grid max-w-[1300px] gap-8 px-6 sm:grid-cols-2 md:px-24 lg:grid-cols-5">
        {skillCategories.map((cat) => (
          <div key={cat.id} data-reveal>
            <p className="font-mono text-[11px] tracking-widest text-accent-bright uppercase">
              {cat.index} · {cat.title}
            </p>
            <ul className="mt-4 space-y-2">
              {cat.items.map((s) => (
                <li key={s.name} className="flex items-baseline justify-between gap-3 border-b border-line pb-2 text-sm">
                  <span className="text-soft">{s.name}</span>
                  <span className="font-mono text-[10px] text-muted uppercase">{levelLabel[s.level]}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

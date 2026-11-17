import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { experience, categoryLabel } from '../data/experience';
import { gsap, useGSAP } from '../animations/gsap';
import { useMotion } from '../animations/MotionContext';
import { useSplitHeadings } from '../animations/useReveal';

/**
 * Career & experience: a centre line that fills with a glowing
 * gradient as you scroll, with a light that travels down it.
 */
export function Career() {
  const root = useRef<HTMLElement>(null);
  const { reducedMotion } = useMotion();
  useSplitHeadings(root);

  useGSAP(
    () => {
      if (reducedMotion) return;
      const st = { trigger: '.career-list', start: 'top 60%', end: 'bottom 60%', scrub: true };
      gsap.fromTo('.career-fill', { scaleY: 0 }, { scaleY: 1, ease: 'none', transformOrigin: 'top', scrollTrigger: st });
      gsap.fromTo('.career-dot', { top: '0%' }, { top: '100%', ease: 'none', scrollTrigger: st });
      gsap.utils.toArray<HTMLElement>('.career-item').forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0.25 },
          { autoAlpha: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 75%', end: 'top 50%', scrub: true } },
        );
      });
    },
    { scope: root, dependencies: [reducedMotion] },
  );

  return (
    <section id="experience" ref={root} className="relative bg-ink py-28 md:py-40">
      <div className="mx-auto max-w-[1300px] px-6 md:px-24">
        <h2 data-split className="text-center font-display text-[clamp(2.6rem,6vw,5.5rem)] leading-[1.02] font-medium tracking-tight">
          My career &amp; <br />
          <span className="text-accent-bright">experience</span>
        </h2>

        <div className="career-list relative mt-20 md:mt-28">
          {/* centre line (left on mobile) */}
          <div className="absolute top-0 bottom-0 left-[7px] w-px bg-line md:left-1/2" aria-hidden="true" />
          <div className="career-fill absolute top-0 bottom-0 left-[7px] w-[2px] bg-gradient-to-b from-accent-bright via-accent to-accent-bright/40 shadow-[0_0_16px_rgba(45,212,191,0.6)] md:left-1/2 md:-translate-x-[0.5px]" aria-hidden="true" />
          <span className="career-dot absolute left-[8px] z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-bright shadow-[0_0_24px_6px_rgba(45,212,191,0.55)] md:left-1/2" aria-hidden="true" />

          <ol className="space-y-16 md:space-y-24">
            {experience.map((e) => (
              <li key={e.id} className="career-item relative grid gap-4 pl-10 md:grid-cols-2 md:gap-24 md:pl-0">
                <div className="md:pr-10 md:text-right">
                  <p className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">
                    {categoryLabel[e.category]}
                    {e.period && <span className="text-soft"> · {e.period}</span>}
                  </p>
                  <h3 className="mt-2 font-display text-2xl leading-tight font-medium text-white md:text-3xl">{e.title}</h3>
                  <p className="mt-2 inline-flex items-center gap-1 text-accent-bright">
                    {e.organisation} <ArrowUpRight size={14} className="opacity-60" />
                  </p>
                </div>
                <div className="md:pl-6">
                  <p className="leading-relaxed text-soft">{e.description}</p>
                  {e.tags && e.tags.length > 0 && (
                    <p className="mt-4 text-sm">
                      <span className="text-accent-bright">Tools: </span>
                      <span className="text-muted">{e.tags.join(' · ')}</span>
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

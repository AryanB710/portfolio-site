import { useRef } from 'react';
import { aboutCopy, highlights } from '../data/profile';
import { gsap, SplitText, useGSAP } from '../animations/gsap';
import { useMotion } from '../animations/MotionContext';

/**
 * "About me" — on desktop the 3D character slides to the left and
 * turns toward this text (see three/HeroScene.tsx STAGES.about).
 */
export function AboutStage() {
  const root = useRef<HTMLElement>(null);
  const { reducedMotion } = useMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      const split = SplitText.create('.about-lead', { type: 'lines', mask: 'lines', autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 100,
            duration: 1.1,
            stagger: 0.08,
            ease: 'expo.out',
            scrollTrigger: { trigger: '.about-lead', start: 'top 80%', once: true },
          }),
      });
      gsap.from('.about-fade', { y: 24, autoAlpha: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.about-lead', start: 'top 70%', once: true } });
      return () => split.revert();
    },
    { scope: root, dependencies: [reducedMotion] },
  );

  return (
    <section id="about" ref={root} className="relative flex min-h-[100svh] items-center py-24">
      <div className="mx-auto grid w-full max-w-[1500px] px-6 md:grid-cols-2 md:px-24 lg:px-36">
        <div className="hidden md:block" />
        <div>
          <p className="about-fade eyebrow mb-6 text-base tracking-[0.3em]">About me</p>
          <p className="about-lead font-display text-[clamp(1.35rem,2vw,1.85rem)] leading-[1.35] font-medium text-white">{aboutCopy.paragraphs[0]}</p>
          <p className="about-fade mt-6 text-base leading-relaxed text-muted md:text-lg">{aboutCopy.paragraphs[1]}</p>
          <dl className="about-fade mt-10 grid grid-cols-3 gap-4 border-t border-line pt-8">
            {highlights.map((h) => (
              <div key={h.label}>
                <dt className="sr-only">{h.label}</dt>
                <dd className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">{h.value}</dd>
                <dd className="mt-2 text-xs leading-snug text-muted">{h.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

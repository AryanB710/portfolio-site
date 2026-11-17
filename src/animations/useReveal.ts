import { type RefObject } from 'react';
import { gsap, SplitText, useGSAP } from './gsap';
import { useMotion } from './MotionContext';

/**
 * Fades + lifts every element with [data-reveal] inside `scope`
 * when it scrolls into view. Staggers siblings with the same parent.
 *
 *   <div data-reveal>…</div>
 *   <div data-reveal="left">…</div>   (slides in from the left)
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  const { reducedMotion } = useMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      const els = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      els.forEach((el) => {
        const dir = el.dataset.reveal;
        const from: gsap.TweenVars = { autoAlpha: 0, y: 40 };
        if (dir === 'left') Object.assign(from, { x: -40, y: 0 });
        if (dir === 'right') Object.assign(from, { x: 40, y: 0 });
        if (dir === 'scale') Object.assign(from, { scale: 0.94, y: 20 });

        gsap.from(el, {
          ...from,
          duration: 1.1,
          ease: 'expo.out',
          delay: Number(el.dataset.revealDelay ?? 0),
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });
    },
    { scope, dependencies: [reducedMotion] },
  );
}

/**
 * Split-text heading animation. Every element with [data-split]
 * inside `scope` gets its lines masked and words slid up.
 */
export function useSplitHeadings(scope: RefObject<HTMLElement | null>) {
  const { reducedMotion } = useMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      const headings = gsap.utils.toArray<HTMLElement>('[data-split]');
      const splits: SplitText[] = [];

      headings.forEach((heading) => {
        const split = SplitText.create(heading, {
          type: 'lines,words',
          mask: 'lines',
          linesClass: 'split-line',
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.words, {
              yPercent: 110,
              opacity: 0,
              duration: 1.1,
              ease: 'expo.out',
              stagger: 0.045,
              scrollTrigger: { trigger: heading, start: 'top 85%', once: true },
            });
          },
        });
        splits.push(split);
      });

      return () => splits.forEach((s) => s.revert());
    },
    { scope, dependencies: [reducedMotion] },
  );
}

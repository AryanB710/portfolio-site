import { useEffect, useRef, useState } from 'react';
import { gsap } from '../animations/gsap';

interface Props {
  onComplete: () => void;
  reducedMotion: boolean;
}

/**
 * Elegant intro: counter + name reveal, then the panel lifts away.
 * Waits for fonts so the hero never flashes in a fallback font.
 */
export function Loader({ onComplete, reducedMotion }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      onComplete();
      return;
    }
    document.documentElement.style.overflow = 'hidden';
    const counter = { v: 0 };
    let tl: gsap.core.Timeline | undefined;
    let cancelled = false;

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    // Never let the loader hang for more than ~2.5s
    const timeout = new Promise((r) => setTimeout(r, 2500));

    const ctx = gsap.context(() => {
      gsap.to(counter, {
        v: 80,
        duration: 1.2,
        ease: 'power2.out',
        onUpdate: () => setCount(Math.round(counter.v)),
      });
      gsap.from('.loader-name span', { yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.04, delay: 0.1 });
    }, root);

    Promise.race([fontsReady, timeout]).then(() => {
      if (cancelled) return;
      ctx.add(() => {
        tl = gsap.timeline({
          onComplete: () => {
            document.documentElement.style.overflow = '';
            onComplete();
          },
        });
        tl.to(counter, { v: 100, duration: 0.5, ease: 'power2.out', onUpdate: () => setCount(Math.round(counter.v)) })
          .to('.loader-name span', { yPercent: -110, duration: 0.7, ease: 'expo.in', stagger: 0.02 }, '+=0.15')
          .to('.loader-meta', { opacity: 0, duration: 0.3 }, '<')
          .to(root.current, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '-=0.2');
      });
    });

    return () => {
      cancelled = true;
      tl?.kill();
      ctx.revert();
      document.documentElement.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (reducedMotion) return null;

  const name = 'ARYAN BOSE';
  return (
    <div ref={root} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink" role="status" aria-label="Loading portfolio">
      <div className="loader-name flex overflow-hidden font-display text-5xl font-semibold tracking-tight md:text-7xl">
        {name.split('').map((ch, i) => (
          <span key={i} className={`inline-block ${i >= 6 ? 'text-accent' : 'text-white'}`}>
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
      </div>
      <div className="loader-meta absolute inset-x-0 bottom-10 container-x flex items-end justify-between font-mono text-xs text-muted">
        <span>Portfolio — {new Date().getFullYear()}</span>
        <span className="text-4xl text-white tabular-nums md:text-6xl">{count.toString().padStart(3, '0')}</span>
      </div>
      <div className="loader-meta absolute bottom-0 left-0 h-px bg-accent" style={{ width: `${count}%` }} />
    </div>
  );
}

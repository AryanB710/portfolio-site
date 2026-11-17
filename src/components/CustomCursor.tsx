import { useEffect, useRef } from 'react';
import { gsap } from '../animations/gsap';

/**
 * Two-part cursor: a precise dot and a lagging ring that grows over
 * links/buttons. Only mounted on mouse/trackpad devices.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.add('has-custom-cursor');
    const xDot = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' });
    const yDot = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' });
    const xRing = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'power3' });
    const yRing = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'power3' });

    const move = (e: PointerEvent) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };

    const over = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest('a, button, [data-cursor="hover"], input, textarea, select');
      const isText = (e.target as HTMLElement).closest('input, textarea');
      gsap.to(ring.current, {
        scale: target ? (isText ? 0.6 : 1.9) : 1,
        backgroundColor: target && !isText ? 'rgba(21,158,145,0.12)' : 'rgba(21,158,145,0)',
        borderColor: target ? 'rgba(45,212,191,0.9)' : 'rgba(255,255,255,0.35)',
        duration: 0.35,
      });
      gsap.to(dot.current, { scale: target ? 0 : 1, duration: 0.25 });
    };

    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.3 });
    const enter = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 });

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerover', over);
    document.documentElement.addEventListener('mouseleave', leave);
    document.documentElement.addEventListener('mouseenter', enter);
    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('mouseleave', leave);
      document.documentElement.removeEventListener('mouseenter', enter);
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[90] -mt-5 -ml-5 h-10 w-10 rounded-full border border-white/35"
      />
      <div
        ref={dot}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[91] -mt-[3px] -ml-[3px] h-1.5 w-1.5 rounded-full bg-accent-bright"
      />
    </>
  );
}

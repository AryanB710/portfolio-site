import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

const LenisContext = createContext<Lenis | null>(null);

/** Use inside components to scroll programmatically: lenis?.scrollTo('#projects') */
export const useLenis = () => useContext(LenisContext);

interface Props {
  children: ReactNode;
  enabled: boolean;
}

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger
 * and Lenis stay perfectly in sync (no jitter on pinned/scrubbed sections).
 */
export function SmoothScroll({ children, enabled }: Props) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    instance.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => instance.raf(time * 1000);
    rafRef.current = raf;
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      if (rafRef.current) gsap.ticker.remove(rafRef.current);
      instance.destroy();
      setLenis(null);
    };
  }, [enabled]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

/** Scroll to a section, smoothly if Lenis is running, natively otherwise. */
export function scrollToId(lenis: Lenis | null, id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  if (lenis) lenis.scrollTo(target, { offset: id === 'home' ? 0 : -72, duration: 1.4 });
  else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

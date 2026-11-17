import { lazy, Suspense, useRef } from 'react';
import { ArrowDown, Hand } from 'lucide-react';
import { profile } from '../data/profile';
import { gsap, SplitText, useGSAP } from '../animations/gsap';
import { useMotion } from '../animations/MotionContext';
import { scrollToId, useLenis } from '../animations/SmoothScroll';
import { waveHello } from '../three/events';

const HeroScene = lazy(() => import('../three/HeroScene'));

/** Words that roll on the right side of the hero. Edit freely. */
const ROLES = ['LLM Apps', 'NLP Apps', 'Python APIs'];

interface Props {
  ready: boolean;
  /** true on desktop: the 3D stage is rendered once, fixed, by App */
  sharedStage: boolean;
}

export function Hero({ ready, sharedStage }: Props) {
  const root = useRef<HTMLElement>(null);
  const motion = useMotion();
  const lenis = useLenis();

  useGSAP(
    () => {
      if (!ready || motion.reducedMotion) return;
      const nameSplit = SplitText.create('.hero-name', { type: 'chars', mask: 'chars' });
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from('.hero-hello', { y: 20, autoAlpha: 0, duration: 1 }, 0.3)
        .from(nameSplit.chars, { yPercent: 110, duration: 1.2, stagger: 0.035 }, 0.4)
        .from('.hero-role-intro', { y: 20, autoAlpha: 0, duration: 1 }, 0.6)
        .from('.hero-roles', { autoAlpha: 0, duration: 1 }, 0.8)
        .from('.hero-foot > *', { y: 16, autoAlpha: 0, duration: 1, stagger: 0.1 }, 1);

      // rolling role words: slide up in, hold, slide up out
      const words = gsap.utils.toArray<HTMLElement>('.hero-role-word');
      gsap.set(words, { yPercent: 110, autoAlpha: 1 });
      const roll = gsap.timeline({ repeat: -1, delay: 1.2 });
      words.forEach((w) => {
        roll
          .to(w, { yPercent: 0, duration: 0.9, ease: 'expo.out' })
          .to(w, { yPercent: -110, duration: 0.8, ease: 'expo.in' }, '+=1.6')
          .set(w, { yPercent: 110 });
      });

      // copy drifts apart as you scroll into About
      gsap.to('.hero-left', { xPercent: -30, autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: '60% top', scrub: true } });
      gsap.to('.hero-right', { xPercent: 30, autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: '60% top', scrub: true } });

      return () => nameSplit.revert();
    },
    { scope: root, dependencies: [ready, motion.reducedMotion] },
  );

  return (
    <section id="home" ref={root} className="relative h-[100svh] min-h-[620px] overflow-hidden">
      {/* Mobile / tablet: the scene lives inside the hero */}
      {!sharedStage && (
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <HeroScene rich={false} interactive={false} animate={!motion.reducedMotion} entered={ready} compact />
          </Suspense>
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
        </div>
      )}

      <h1 className="sr-only">
        {profile.name} — Software Developer building NLP and LLM applications
      </h1>

      <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-[1500px] flex-col justify-end px-6 pb-28 md:flex-row md:items-center md:justify-between md:px-24 md:pb-0 lg:px-28">
        {/* LEFT: hello + name */}
        <div className="hero-left">
          <p className="hero-hello font-display text-lg tracking-wide text-accent-bright md:text-2xl">Hello! I&apos;m</p>
          <p className="hero-name mt-1 font-display text-[clamp(2.4rem,3.9vw,4rem)] leading-[0.95] font-semibold tracking-[0.02em] text-white uppercase" aria-hidden="true">
            Aryan
            <br />
            Bose
          </p>
        </div>

        {/* RIGHT: role + rolling word */}
        <div className="hero-right mt-6 md:mt-0 md:text-right">
          <p className="hero-role-intro font-display text-lg tracking-wide text-soft md:text-2xl">Software Developer building</p>
          <div className="hero-roles relative mt-1 overflow-hidden font-display text-[clamp(2rem,3.5vw,3.6rem)] leading-[1.05] font-semibold tracking-tight text-accent-bright uppercase">
            {/* invisible sizer: reserves the width of the longest word */}
            <span className="invisible block whitespace-nowrap" aria-hidden="true">
              {ROLES.reduce((a, b) => (b.length > a.length ? b : a))}
            </span>
            {ROLES.map((r, i) => (
              <span
                key={r}
                className={`hero-role-word absolute inset-0 block whitespace-nowrap md:text-right ${motion.reducedMotion && i > 0 ? 'hidden' : ''}`}
                style={{ opacity: motion.reducedMotion ? 1 : 0 }}
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* bottom: say hi + scroll cue */}
      <div className="hero-foot pointer-events-none absolute inset-x-0 bottom-8 z-10 flex items-center justify-center gap-6">
        {!motion.reducedMotion && (
          <button
            type="button"
            onClick={waveHello}
            className="glass pointer-events-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs text-soft transition-colors hover:border-accent/60 hover:text-white"
          >
            <Hand size={14} className="text-accent-bright" /> Say hi
          </button>
        )}
        <button
          type="button"
          onClick={() => scrollToId(lenis, 'about')}
          className="pointer-events-auto hidden items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-muted uppercase transition-colors hover:text-white md:inline-flex"
        >
          <span className="flex h-8 w-5 justify-center rounded-full border border-line-strong pt-1.5">
            <span className="h-1.5 w-[3px] rounded-full bg-accent-bright" style={{ animation: 'scroll-wheel 1.8s ease-in-out infinite' }} />
          </span>
          Scroll <ArrowDown size={11} />
        </button>
      </div>
    </section>
  );
}

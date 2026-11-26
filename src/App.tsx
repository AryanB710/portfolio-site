import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { MotionContext, type MotionSettings } from './animations/MotionContext';
import { SmoothScroll } from './animations/SmoothScroll';
import { ScrollTrigger, useGSAP } from './animations/gsap';
import { useDeviceProfile } from './hooks/useDeviceProfile';
import { sceneScroll } from './three/events';
import { Loader } from './components/Loader';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { SideRail } from './components/SideRail';
import { Hero } from './sections/Hero';
import { AboutStage } from './sections/AboutStage';
import { WhatIDo } from './sections/WhatIDo';
import { Career } from './sections/Career';
import { Projects } from './sections/Projects';
import WhatIUse from './sections/WhatIUse';
import { TechStack } from './sections/TechStack';
import { Achievements } from './sections/Achievements';
import { Resume } from './sections/Resume';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';

const HeroScene = lazy(() => import('./three/HeroScene'));

export default function App() {
  const device = useDeviceProfile();
  const [ready, setReady] = useState(false);
  const [stageActive, setStageActive] = useState(true);
  const onLoaded = useCallback(() => setReady(true), []);

  const motion = useMemo<MotionSettings>(
    () => ({ ...device, rich: !device.reducedMotion && !device.lowPower && !device.isMobile }),
    [device],
  );

  /** Desktop: one fixed 3D stage behind Hero → About → What I do. */
  const sharedStage = !device.isMobile;

  // Scroll → 3D stage progress
  useGSAP(
    () => {
      if (!sharedStage) return;
      const triggers = [
        ScrollTrigger.create({
          trigger: '#about',
          start: 'top bottom',
          end: 'top top',
          onUpdate: (s) => (sceneScroll.about = s.progress),
          onLeaveBack: () => (sceneScroll.about = 0),
        }),
        ScrollTrigger.create({
          trigger: '#what-i-do',
          start: 'top bottom',
          end: 'top 15%',
          onUpdate: (s) => (sceneScroll.desk = s.progress),
          onLeaveBack: () => (sceneScroll.desk = 0),
        }),
        // stop rendering once the stage is fully covered by later sections
        ScrollTrigger.create({
          trigger: '#what-i-do',
          start: 'bottom top',
          onEnter: () => setStageActive(false),
          onLeaveBack: () => setStageActive(true),
        }),
      ];
      return () => triggers.forEach((t) => t.kill());
    },
    { dependencies: [sharedStage, ready] },
  );

  return (
    <MotionContext.Provider value={motion}>
      <SmoothScroll enabled={!device.reducedMotion && !device.isMobile}>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-ink">
          Skip to content
        </a>

        {!ready && <Loader onComplete={onLoaded} reducedMotion={device.reducedMotion} />}
        {motion.finePointer && !device.reducedMotion && <CustomCursor />}

        {/* ---------- fixed 3D stage (desktop) ---------- */}
        {sharedStage && (
          <div className={`pointer-events-none fixed inset-0 z-0 transition-opacity duration-700 ${stageActive ? 'opacity-100' : 'opacity-0'}`}>
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#0c1716_0%,#050505_65%)]" />
            <Suspense fallback={null}>
              <HeroScene
                rich={motion.rich}
                interactive={motion.finePointer && !motion.reducedMotion}
                animate={!motion.reducedMotion}
                entered={ready}
                compact={false}
                active={stageActive}
              />
            </Suspense>
          </div>
        )}

        <Navbar visible={ready} />
        <SideRail visible={ready} />

        <main id="main" className="relative z-10">
          {/* transparent sections: the 3D stage shows through */}
          <Hero ready={ready} sharedStage={sharedStage} />
          <AboutStage />
          <WhatIDo />

          {/* solid sections slide up over the stage */}
          <div className="relative bg-ink">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-40 h-40 bg-gradient-to-b from-transparent to-ink" />
            <Career />
            <Projects />
            <WhatIUse />
            <TechStack />
            <Achievements />
            <Resume />
            <Contact />
            <Footer />
          </div>
        </main>
      </SmoothScroll>
    </MotionContext.Provider>
  );
}
/**
 * Tiny shared state between the page (DOM + GSAP) and the 3D scene.
 * Kept free of three.js imports so the main bundle stays small.
 */
export const characterEvents = new EventTarget();
export const waveHello = () => characterEvents.dispatchEvent(new Event('wave'));

/**
 * Scroll-driven stage progress, written by ScrollTrigger (src/animations/useSceneScroll.ts)
 * and read every frame by the 3D scene.
 *  about: 0 → 1 while scrolling from the hero into "About me"
 *  desk:  0 → 1 while scrolling from "About me" into "What I do"
 *  exit:  0 → 1 while "What I do" scrolls away (scene fades out)
 */
export const sceneScroll = { about: 0, desk: 0, exit: 0 };

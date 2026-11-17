/**
 * Central GSAP setup. Import gsap from HERE (not from 'gsap')
 * so plugins are always registered exactly once.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

gsap.defaults({ ease: 'power3.out', duration: 1 });

export const EASE = {
  expo: 'expo.out',
  smooth: 'power3.out',
  inOut: 'power2.inOut',
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };

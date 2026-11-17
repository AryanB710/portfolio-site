import { ArrowUp } from 'lucide-react';
import { profile } from '../data/profile';
import { SocialLinks } from '../components/SocialLinks';
import { scrollToId, useLenis } from '../animations/SmoothScroll';

export function Footer() {
  const lenis = useLenis();
  return (
    <footer className="relative border-t border-line py-10">
      <div className="container-x flex flex-col items-center justify-between gap-6 md:flex-row">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {profile.name}. Designed &amp; built with React, Three.js and GSAP.
        </p>
        <div className="flex items-center gap-5">
          <SocialLinks />
          <button
            type="button"
            onClick={() => scrollToId(lenis, 'home')}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink transition-transform hover:-translate-y-1"
            aria-label="Back to top"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
}

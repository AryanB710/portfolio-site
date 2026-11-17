import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { navLinks, profile } from '../data/profile';
import { useActiveSection } from '../hooks/useActiveSection';
import { scrollToId, useLenis } from '../animations/SmoothScroll';

const ids = navLinks.map((l) => l.id);
/** Links shown in the desktop bar; everything is in the mobile menu. */
const primary = ['about', 'projects', 'contact'] as const;
const primaryLabel: Record<(typeof primary)[number], string> = { about: 'About', projects: 'Work', contact: 'Contact' };

export function Navbar({ visible }: { visible: boolean }) {
  const active = useActiveSection(ids);
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open, lenis]);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(lenis, id);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-ink via-ink/80 to-transparent transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'}`}
    >
      <nav aria-label="Main" className="flex h-20 items-center justify-between px-6 md:px-11">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            go('home');
          }}
          className="font-display text-lg font-semibold tracking-tight"
          aria-label={`${profile.name} — home`}
        >
          A<span className="text-accent-bright">B</span>
        </a>

        <button
          type="button"
          onClick={copyEmail}
          className="absolute left-1/2 hidden -translate-x-1/2 font-mono text-[13px] tracking-wide text-soft transition-colors hover:text-accent-bright md:block"
          aria-label={`Copy email address ${profile.email}`}
        >
          {copied ? 'copied to clipboard ✓' : profile.email}
        </button>

        <ul className="hidden items-center gap-12 lg:flex">
          {primary.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(id);
                }}
                className={`group relative font-display text-[13px] font-medium tracking-[0.14em] uppercase transition-colors ${active === id ? 'text-accent-bright' : 'text-white hover:text-accent-bright'}`}
              >
                {primaryLabel[id]}
                <span className={`absolute -bottom-1.5 left-0 h-px bg-accent-bright transition-all duration-500 ${active === id ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`fixed inset-0 -z-10 bg-ink/95 backdrop-blur-xl transition-all duration-500 lg:hidden ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}
      >
        <ul className="flex h-full flex-col justify-center gap-2 px-6">
          {navLinks.map((link, i) => (
            <li
              key={link.id}
              className="transition-all duration-500"
              style={{ transitionDelay: open ? `${i * 50}ms` : '0ms', transform: open ? 'none' : 'translateY(20px)', opacity: open ? 1 : 0 }}
            >
              <a
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(link.id);
                }}
                className={`flex items-baseline gap-4 py-2 font-display text-4xl font-semibold tracking-tight ${active === link.id ? 'text-accent-bright' : 'text-white'}`}
              >
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

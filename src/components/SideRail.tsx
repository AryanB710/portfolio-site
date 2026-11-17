import { FileText, Mail } from 'lucide-react';
import { profile } from '../data/profile';
import { GithubIcon, LinkedinIcon } from './BrandIcons';

/**
 * Fixed social rail on the left and a "RESUME" link bottom-right,
 * visible on every screen (desktop only).
 */
export function SideRail({ visible }: { visible: boolean }) {
  const links = [
    { label: 'GitHub', href: profile.github, icon: <GithubIcon size={22} /> },
    { label: 'LinkedIn', href: profile.linkedin, icon: <LinkedinIcon size={22} /> },
    { label: 'Email', href: `mailto:${profile.email}`, icon: <Mail size={22} strokeWidth={1.7} /> },
  ];
  return (
    <div className={`transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <ul className="fixed bottom-10 left-8 z-40 hidden flex-col items-center gap-7 md:flex">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-label={l.label}
              className="block text-soft transition-all duration-300 hover:-translate-y-1 hover:text-accent-bright"
            >
              {l.icon}
            </a>
          </li>
        ))}
        <li aria-hidden="true" className="h-16 w-px bg-gradient-to-b from-line-strong to-transparent" />
      </ul>
      <a
        href={profile.resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group fixed right-10 bottom-10 z-40 hidden items-center gap-2 font-display text-sm font-semibold tracking-[0.35em] text-muted uppercase transition-colors hover:text-accent-bright md:flex"
      >
        Resume
        <FileText size={16} className="transition-transform group-hover:-translate-y-0.5" />
      </a>
    </div>
  );
}

import { Mail } from 'lucide-react';
import { profile } from '../data/profile';
import { GithubIcon, LinkedinIcon } from './BrandIcons';

export function SocialLinks({ className = '' }: { className?: string }) {
  const links = [
    { label: 'LinkedIn', href: profile.linkedin, icon: <LinkedinIcon size={17} /> },
    { label: 'GitHub', href: profile.github, icon: <GithubIcon size={17} /> },
    { label: 'Email', href: `mailto:${profile.email}`, icon: <Mail size={17} strokeWidth={1.6} /> },
  ];
  return (
    <ul className={`flex items-center gap-3 ${className}`}>
      {links.map((l) => (
        <li key={l.label}>
          <a
            href={l.href}
            target={l.href.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            aria-label={l.label}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent-bright"
          >
            {l.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}

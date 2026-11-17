import { useEffect, useRef } from 'react';
import { ArrowUpRight, Check, X } from 'lucide-react';
import type { Project } from '../types';
import { ProjectVisual } from './ProjectVisuals';
import { GithubIcon } from './BrandIcons';
import { gsap } from '../animations/gsap';
import { useLenis } from '../animations/SmoothScroll';
import { useMotion } from '../animations/MotionContext';

interface Props {
  project: Project;
  onClose: () => void;
}

/** Full-screen case-study view for a project. */
export function ProjectModal({ project, onClose }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();
  const { reducedMotion } = useMotion();

  useEffect(() => {
    lenis?.stop();
    document.body.style.overflow = 'hidden';
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();

    if (!reducedMotion) {
      gsap.fromTo(backdrop.current, { opacity: 0 }, { opacity: 1, duration: 0.4 });
      gsap.fromTo(panel.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' });
      gsap.from(panel.current!.querySelectorAll('[data-modal-item]'), { y: 24, opacity: 0, duration: 0.7, stagger: 0.05, delay: 0.15, ease: 'expo.out' });
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // simple focus trap
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      lenis?.start();
      previouslyFocused?.focus();
    };
  }, [lenis, onClose, reducedMotion]);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center md:items-center md:p-6" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
      <div ref={backdrop} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div
        ref={panel}
        data-lenis-prevent
        className="relative max-h-[92svh] w-full max-w-5xl overflow-y-auto overscroll-contain rounded-t-[28px] border border-line bg-ink-2 md:rounded-[28px]"
      >
        <button
          ref={closeBtn}
          onClick={onClose}
          className="sticky top-4 z-10 float-right mr-4 flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-ink/80 backdrop-blur transition-colors hover:border-accent"
          aria-label="Close project details"
        >
          <X size={18} />
        </button>

        <div className="aspect-[720/440] w-full overflow-hidden border-b border-line">
          <ProjectVisual project={project} animated={!reducedMotion} />
        </div>

        <div className="p-6 md:p-12">
          <p className="eyebrow" data-modal-item>
            Project {project.index} · Case study{project.year ? ` · ${project.year}` : ''}
          </p>
          <h3 id="project-modal-title" className="mt-4 font-display text-3xl leading-tight font-semibold tracking-tight md:text-5xl" data-modal-item>
            {project.title}
          </h3>

          {project.metrics && project.metrics.length > 0 && (
            <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line" data-modal-item>
              {project.metrics.map((m) => (
                <div key={m.label} className="bg-ink-2 p-4 md:p-5">
                  <dt className="sr-only">{m.label}</dt>
                  <dd className="font-display text-2xl font-semibold md:text-3xl">{m.value}</dd>
                  <dd className="mt-1 text-xs text-muted">{m.label}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <div data-modal-item>
              <h4 className="font-mono text-xs tracking-widest text-muted uppercase">The problem</h4>
              <p className="mt-3 leading-relaxed text-soft">{project.problem}</p>
            </div>
            <div data-modal-item>
              <h4 className="font-mono text-xs tracking-widest text-muted uppercase">The solution</h4>
              <p className="mt-3 leading-relaxed text-soft">{project.solution}</p>
            </div>
          </div>

          <div className="mt-10 grid gap-10 md:grid-cols-[1.3fr_1fr]">
            <div data-modal-item>
              <h4 className="font-mono text-xs tracking-widest text-muted uppercase">Key features</h4>
              <ul className="mt-4 space-y-3">
                {project.features.map((f) => (
                  <li key={f} className="flex gap-3 text-soft">
                    <Check size={18} className="mt-0.5 shrink-0 text-accent-bright" /> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div data-modal-item>
              <h4 className="font-mono text-xs tracking-widest text-muted uppercase">Built with</h4>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <li key={s} className="rounded-full border border-line px-3.5 py-1.5 text-sm text-soft">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-3" data-modal-item>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5">
                <GithubIcon size={16} /> View repository
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line-strong px-6 text-sm font-medium transition-colors hover:border-accent">
                Live demo <ArrowUpRight size={16} />
              </a>
            )}
            {!project.githubUrl && !project.liveUrl && <p className="font-mono text-xs text-muted">Repository and demo links coming soon.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

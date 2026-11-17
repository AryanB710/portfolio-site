import { lazy, Suspense, useCallback, useRef, useState, type MouseEvent } from 'react';
import { ArrowUpRight, Plus } from 'lucide-react';
import { projects } from '../data/projects';
import { profile } from '../data/profile';
import type { Project } from '../types';
import { SectionHeading } from '../components/SectionHeading';
import { ProjectVisual } from '../components/ProjectVisuals';
import { GithubIcon } from '../components/BrandIcons';
import { useReveal, useSplitHeadings } from '../animations/useReveal';
import { gsap, useGSAP } from '../animations/gsap';
import { useMotion } from '../animations/MotionContext';

const ProjectModal = lazy(() => import('../components/ProjectModal').then((m) => ({ default: m.ProjectModal })));

function FeaturedProject({ project, onOpen, flip }: { project: Project; onOpen: () => void; flip: boolean }) {
  const media = useRef<HTMLDivElement>(null);
  const { finePointer, reducedMotion } = useMotion();

  const move = (e: MouseEvent<HTMLDivElement>) => {
    if (!finePointer || reducedMotion || !media.current) return;
    const r = media.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(media.current.querySelector('.media-inner'), { x: x * -18, y: y * -12, scale: 1.04, duration: 0.8, ease: 'power3.out' });
  };
  const leave = () => {
    if (!media.current) return;
    gsap.to(media.current.querySelector('.media-inner'), { x: 0, y: 0, scale: 1, duration: 1, ease: 'expo.out' });
  };

  return (
    <article className={`project-card group grid gap-8 lg:gap-14 ${flip ? 'lg:grid-cols-[1fr_1.35fr]' : 'lg:grid-cols-[1.35fr_1fr]'}`}>
      <div
        ref={media}
        onMouseMove={move}
        onMouseLeave={leave}
        className={`project-media relative self-center overflow-hidden rounded-[28px] border border-line bg-ink-2 transition-colors duration-500 group-hover:border-accent/40 ${flip ? 'lg:order-2' : ''}`}
      >
        <button type="button" onClick={onOpen} className="block w-full text-left" aria-label={`Open case study: ${project.title}`} data-cursor="hover">
          <div className="aspect-[720/440] w-full overflow-hidden">
            <div className="media-inner h-full w-full will-transform">
              <ProjectVisual project={project} animated={!reducedMotion} />
            </div>
          </div>
          <span className="absolute right-5 bottom-5 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-ink opacity-0 transition-all duration-500 group-hover:opacity-100 max-lg:opacity-100 lg:translate-y-2 lg:group-hover:translate-y-0">
            View case study <ArrowUpRight size={14} />
          </span>
        </button>
      </div>

      <div className={`flex flex-col justify-center ${flip ? 'lg:order-1' : ''}`}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-display text-6xl font-semibold text-white/10 md:text-7xl">{project.index}</span>
          <div className="flex flex-col gap-1.5">
            {project.year && <span className="font-mono text-[11px] tracking-widest text-muted uppercase">{project.year}</span>}
            {project.badge && (
              <span className="w-fit rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[10px] tracking-wider text-accent-bright uppercase">
                {project.badge}
              </span>
            )}
          </div>
        </div>
        <h3 className="mt-4 font-display text-3xl leading-[1.1] font-semibold tracking-tight md:text-4xl">{project.title}</h3>
        <p className="mt-4 text-lg text-soft">{project.tagline}</p>

        {project.metrics && project.metrics.length > 0 && (
          <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line">
            {project.metrics.map((m) => (
              <div key={m.label} className="bg-ink-2 p-4">
                <dt className="sr-only">{m.label}</dt>
                <dd className="font-display text-xl font-semibold text-white md:text-2xl">{m.value}</dd>
                <dd className="mt-1 text-[11px] leading-snug text-muted">{m.label}</dd>
              </div>
            ))}
          </dl>
        )}

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technology stack">
          {project.stack.map((s) => (
            <li key={s} className="rounded-full bg-white/[0.04] px-3 py-1.5 font-mono text-[11px] text-soft ring-1 ring-line">
              {s}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line-strong px-5 text-sm transition-colors hover:border-accent"
            >
              <GithubIcon size={16} /> Code
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line-strong px-5 text-sm transition-colors hover:border-accent">
              Live demo <ArrowUpRight size={14} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function PlaceholderProject({ project }: { project: Project }) {
  return (
    <article className="project-card relative flex min-h-[260px] flex-col items-center justify-center overflow-hidden rounded-[28px] border border-dashed border-line-strong p-10 text-center">
      <div className="grid-bg absolute inset-0 opacity-60" />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-line-strong text-accent-bright">
        <Plus size={22} />
      </span>
      <p className="relative mt-5 font-mono text-xs tracking-widest text-muted uppercase">Project {project.index}</p>
      <h3 className="relative mt-2 font-display text-2xl font-semibold">{project.shortTitle}</h3>
      <p className="relative mt-2 max-w-sm text-sm text-muted">{project.tagline}</p>
    </article>
  );
}

export function Projects() {
  const root = useRef<HTMLElement>(null);
  const { reducedMotion } = useMotion();
  const [open, setOpen] = useState<Project | null>(null);
  const close = useCallback(() => setOpen(null), []);
  useReveal(root);
  useSplitHeadings(root);

  useGSAP(
    () => {
      if (reducedMotion) return;
      gsap.utils.toArray<HTMLElement>('.project-media').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(12% 12% 12% 12% round 28px)', opacity: 0.3 },
          {
            clipPath: 'inset(0% 0% 0% 0% round 28px)',
            opacity: 1,
            duration: 1.4,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 80%', once: true },
          },
        );
      });
      gsap.utils.toArray<HTMLElement>('.project-card').forEach((el) => {
        gsap.from(el.querySelectorAll('h3, p, dl, ul, .flex.flex-wrap'), {
          y: 30,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.07,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 75%', once: true },
        });
      });
    },
    { scope: root, dependencies: [reducedMotion] },
  );

  const real = projects.filter((p) => p.status !== 'planned');
  const planned = projects.filter((p) => p.status === 'planned');

  return (
    <section id="projects" ref={root} className="section">
      <div className="container-x">
        <SectionHeading
          index="05"
          eyebrow="My work"
          title={
            <>
              Projects that turn <span className="text-accent-bright">ideas</span> into working software.
            </>
          }
          description="Each one starts with a real problem and ends with tests that prove it works. Open a project for the full case study."
        />

        <div className="space-y-24 md:space-y-32">
          {real.map((p, i) => (
            <FeaturedProject key={p.id} project={p} flip={i % 2 === 1} onOpen={() => setOpen(p)} />
          ))}
        </div>

        {planned.length > 0 && (
          <div className={`mt-24 grid gap-4 ${planned.length > 1 ? 'md:grid-cols-2' : ''}`}>
            {planned.map((p) => (
              <PlaceholderProject key={p.id} project={p} />
            ))}
          </div>
        )}

        <div className="mt-20 flex justify-center" data-reveal>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-full border border-line-strong px-6 py-3.5 text-sm text-soft transition-colors hover:border-accent hover:text-white"
          >
            <GithubIcon size={16} /> More on GitHub · @{profile.githubHandle}
            <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      {open && (
        <Suspense fallback={null}>
          <ProjectModal project={open} onClose={close} />
        </Suspense>
      )}
    </section>
  );
}

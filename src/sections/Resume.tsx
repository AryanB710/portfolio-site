import { useEffect, useRef, useState } from 'react';
import { Download, Eye, FileText, X } from 'lucide-react';
import { profile } from '../data/profile';
import { MagneticButton } from '../components/MagneticButton';
import { useReveal } from '../animations/useReveal';
import { useLenis } from '../animations/SmoothScroll';

/**
 * Resume block. To update your resume, just replace
 * public/resume/Aryan_Bose_Resume.pdf — nothing else to change.
 */
export function Resume() {
  const root = useRef<HTMLElement>(null);
  const [preview, setPreview] = useState(false);
  const lenis = useLenis();
  useReveal(root);

  useEffect(() => {
    if (!preview) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPreview(false);
    window.addEventListener('keydown', onKey);
    return () => {
      lenis?.start();
      window.removeEventListener('keydown', onKey);
    };
  }, [preview, lenis]);

  return (
    <section id="resume" ref={root} className="relative py-10 md:py-16" aria-labelledby="resume-title">
      <div className="container-x">
        <div data-reveal="scale" className="relative overflow-hidden rounded-[32px] border border-line bg-gradient-to-br from-ink-3 via-ink-2 to-ink p-8 md:p-14">
          <div aria-hidden="true" className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-accent/20 blur-[100px]" />
          <div className="grid-bg absolute inset-0 opacity-50" aria-hidden="true" />

          <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto]">
            <div>
              <p className="eyebrow">Resume</p>
              <h2 id="resume-title" className="mt-4 max-w-xl font-display text-3xl leading-tight font-semibold tracking-tight md:text-5xl">
                Everything on one page.
              </h2>
              <p className="mt-4 max-w-lg text-muted">Education, projects, skills and certifications — ready to download or preview right here.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <MagneticButton href={profile.resumeUrl} download={profile.resumeFileName} icon={<Download size={16} />}>
                  Download PDF
                </MagneticButton>
                <MagneticButton variant="ghost" onClick={() => setPreview(true)} icon={<Eye size={16} />}>
                  Preview
                </MagneticButton>
              </div>
            </div>

            {/* decorative document stack */}
            <button
              type="button"
              onClick={() => setPreview(true)}
              className="group relative mx-auto hidden h-56 w-44 md:block"
              aria-label="Preview resume"
            >
              <span className="absolute inset-0 translate-x-4 translate-y-3 rotate-6 rounded-2xl border border-line bg-ink-3 transition-transform duration-700 group-hover:rotate-12" />
              <span className="absolute inset-0 flex flex-col gap-2.5 rounded-2xl border border-line-strong bg-[#f4f5f6] p-5 text-left transition-transform duration-700 group-hover:-translate-y-2 group-hover:-rotate-3">
                <FileText size={18} className="text-accent" />
                <span className="mt-1 h-2 w-3/4 rounded bg-neutral-800" />
                <span className="h-1.5 w-1/2 rounded bg-neutral-400" />
                <span className="mt-2 h-1.5 w-full rounded bg-neutral-300" />
                <span className="h-1.5 w-11/12 rounded bg-neutral-300" />
                <span className="h-1.5 w-4/5 rounded bg-neutral-300" />
                <span className="mt-2 h-1.5 w-full rounded bg-neutral-300" />
                <span className="h-1.5 w-2/3 rounded bg-neutral-300" />
                <span className="mt-auto h-1.5 w-1/3 rounded bg-accent" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {preview && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 md:p-8" role="dialog" aria-modal="true" aria-label="Resume preview">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setPreview(false)} />
          <div className="relative flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-line bg-ink-2">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <span className="font-mono text-xs text-muted">{profile.resumeFileName}</span>
              <div className="flex items-center gap-2">
                <a href={profile.resumeUrl} download={profile.resumeFileName} className="flex h-10 items-center gap-2 rounded-full bg-accent px-4 text-xs font-medium">
                  <Download size={14} /> Download
                </a>
                <button onClick={() => setPreview(false)} className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong" aria-label="Close preview" autoFocus>
                  <X size={16} />
                </button>
              </div>
            </div>
            <object data={`${profile.resumeUrl}#view=FitH`} type="application/pdf" className="h-full w-full bg-white">
              {/* Shown on browsers that can't render PDFs inline (most phones) */}
              <div className="flex h-full flex-col items-center justify-center gap-4 bg-ink-2 p-8 text-center">
                <p className="text-muted">Your browser can&apos;t display the PDF here.</p>
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-accent px-5 py-3 text-sm font-medium">
                  Open resume in a new tab
                </a>
              </div>
            </object>
          </div>
        </div>
      )}
    </section>
  );
}

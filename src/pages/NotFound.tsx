import { ArrowLeft } from 'lucide-react';

/** Custom 404 page — shown for any URL other than "/". */
export function NotFound() {
  return (
    <main className="noise relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="grid-bg absolute inset-0" aria-hidden="true" />
      <div aria-hidden="true" className="absolute h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(21,158,145,0.16),transparent_60%)]" />
      <p className="eyebrow relative">Error 404</p>
      <h1 className="relative mt-6 font-display text-[clamp(6rem,22vw,16rem)] leading-none font-semibold tracking-tighter">
        4<span className="text-accent-bright">0</span>4
      </h1>
      <p className="relative mt-6 max-w-md text-lg text-muted">This page wandered off. Let&apos;s get you back to something that exists.</p>
      <a
        href="/"
        className="relative mt-10 inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-7 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
      >
        <ArrowLeft size={16} /> Back to home
      </a>
    </main>
  );
}

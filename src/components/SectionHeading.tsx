import type { ReactNode } from 'react';

interface Props {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: 'left' | 'center';
}

/** Consistent "01 / ABOUT" style heading used by every section. */
export function SectionHeading({ index, eyebrow, title, description, align = 'left' }: Props) {
  const center = align === 'center';
  return (
    <header className={`mb-14 md:mb-20 ${center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}`}>
      <div className={`mb-6 flex items-center gap-4 ${center ? 'justify-center' : ''}`} data-reveal>
        <span className="font-mono text-xs text-muted">{index}</span>
        <span className="h-px w-10 bg-accent" />
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h2 data-split className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-white md:text-6xl">
        {title}
      </h2>
      {description && (
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg" data-reveal>
          {description}
        </p>
      )}
    </header>
  );
}

import { useRef, type ReactNode, type MouseEvent, type RefObject } from 'react';
import { gsap } from '../animations/gsap';
import { useMotion } from '../animations/MotionContext';

type Variant = 'primary' | 'ghost';

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  icon?: ReactNode;
}

type ButtonProps = BaseProps & {
  href?: undefined;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
};
type LinkProps = BaseProps & {
  href: string;
  download?: string | boolean;
  external?: boolean;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

const styles: Record<Variant, string> = {
  primary:
    'bg-accent text-white shadow-[0_0_0_1px_rgba(45,212,191,0.35),0_10px_40px_-10px_rgba(21,158,145,0.65)] hover:shadow-[0_0_0_1px_rgba(45,212,191,0.6),0_14px_50px_-8px_rgba(21,158,145,0.85)]',
  ghost: 'border border-line-strong bg-white/[0.02] text-white hover:border-accent/60 hover:bg-accent/10',
};

/**
 * Button that leans toward the cursor (desktop only) and has a
 * sliding fill on hover. Renders <a> when `href` is given.
 */
export function MagneticButton(props: ButtonProps | LinkProps) {
  const { children, variant = 'primary', className = '', icon } = props;
  const ref = useRef<HTMLElement>(null);
  const inner = useRef<HTMLSpanElement>(null);
  const { finePointer, reducedMotion } = useMotion();
  const magnetic = finePointer && !reducedMotion;

  const onMove = (e: MouseEvent) => {
    if (!magnetic || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    gsap.to(ref.current, { x: x * 0.25, y: y * 0.35, duration: 0.5, ease: 'power3.out' });
    gsap.to(inner.current, { x: x * 0.1, y: y * 0.12, duration: 0.5, ease: 'power3.out' });
  };
  const onLeave = () => {
    if (!magnetic) return;
    gsap.to([ref.current, inner.current], { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
  };

  const cls = `group relative inline-flex min-h-12 items-center justify-center gap-2.5 overflow-hidden rounded-full px-7 text-sm font-medium tracking-wide transition-[box-shadow,border-color,background-color] duration-500 will-transform disabled:opacity-60 ${styles[variant]} ${className}`;

  const content = (
    <>
      {variant === 'primary' && (
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
      )}
      <span ref={inner} className="relative inline-flex items-center gap-2.5">
        {children}
        {icon && <span className="transition-transform duration-500 group-hover:translate-x-0.5">{icon}</span>}
      </span>
    </>
  );

  if ('href' in props && props.href !== undefined) {
    const { href, download, external, onClick } = props;
    return (
      <a
        ref={ref as RefObject<HTMLAnchorElement>}
        href={href}
        download={download}
        onClick={onClick}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={cls}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        data-cursor="hover"
      >
        {content}
      </a>
    );
  }

  const { onClick, type = 'button', disabled } = props as ButtonProps;
  return (
    <button
      ref={ref as RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cls}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="hover"
    >
      {content}
    </button>
  );
}

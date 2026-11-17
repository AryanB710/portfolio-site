import { useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, CircleCheck, LoaderCircle, Mail, Send, TriangleAlert } from 'lucide-react';
import { profile } from '../data/profile';
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons';
import { MagneticButton } from '../components/MagneticButton';
import { useReveal, useSplitHeadings } from '../animations/useReveal';

type Status = 'idle' | 'sending' | 'success' | 'error';

/**
 * Contact form backed by Web3Forms (free, no server to run).
 * Set VITE_WEB3FORMS_KEY in .env (see .env.example).
 * Without a key the form tells the visitor and offers email instead.
 */
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  useReveal(root);
  useSplitHeadings(root);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // honeypot — bots fill hidden fields, humans don't
    if (data.get('botcheck')) return;

    if (!WEB3FORMS_KEY) {
      setStatus('error');
      setError(`The contact form isn't connected yet. Please email me directly at ${profile.email}.`);
      return;
    }

    setStatus('sending');
    setError('');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: data.get('name'),
          email: data.get('email'),
          subject: `[Portfolio] ${data.get('subject')}`,
          message: data.get('message'),
          from_name: 'Portfolio contact form',
        }),
      });
      const json = (await res.json()) as { success?: boolean; message?: string };
      if (!res.ok || !json.success) throw new Error(json.message || 'Something went wrong.');
      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? `${err.message} You can also email me directly.` : 'Could not send. Please email me directly.');
    }
  };

  const field =
    'peer w-full rounded-2xl border border-line bg-white/[0.02] px-5 pt-6 pb-2.5 text-white placeholder-transparent transition-colors outline-none focus:border-accent focus:bg-accent/[0.04]';
  const label =
    'pointer-events-none absolute top-2 left-5 font-mono text-[10px] tracking-widest text-muted uppercase transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-placeholder-shown:font-sans peer-focus:top-2 peer-focus:font-mono peer-focus:text-[10px] peer-focus:tracking-widest peer-focus:text-accent-bright peer-focus:uppercase';

  const channels = [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, icon: <Mail size={18} strokeWidth={1.6} /> },
    { label: 'LinkedIn', value: 'aryan-bose', href: profile.linkedin, icon: <LinkedinIcon size={18} /> },
    { label: 'GitHub', value: `@${profile.githubHandle}`, href: profile.github, icon: <GithubIcon size={18} /> },
  ];

  return (
    <section id="contact" ref={root} className="section overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(21,158,145,0.18),transparent_60%)]" />
      <div className="container-x relative">
        <div className="mb-8 flex items-center gap-4" data-reveal>
          <span className="font-mono text-xs text-muted">06</span>
          <span className="h-px w-10 bg-accent" />
          <span className="eyebrow">Contact</span>
        </div>
        <h2 data-split className="max-w-5xl font-display text-[clamp(2.5rem,6.5vw,5.8rem)] leading-[1] font-semibold tracking-[-0.035em]">
          Have an Interesting Idea? <span className="text-accent-bright">Let&apos;s Build Something.</span>
        </h2>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="max-w-md text-lg leading-relaxed text-soft" data-reveal>
              I&apos;m looking for a GenAI / AI Engineering or Software Development internship — in Bengaluru (on-site or hybrid) or remote. If you&apos;re building something interesting, I&apos;d love to hear about it.
            </p>
            <ul className="mt-10 space-y-3">
              {channels.map((c) => (
                <li key={c.label} data-reveal>
                  <a
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border border-line p-4 transition-all duration-500 hover:border-accent/50 hover:bg-accent/[0.05]"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] text-accent-bright">{c.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-[10px] tracking-widest text-muted uppercase">{c.label}</span>
                      <span className="block truncate text-white">{c.value}</span>
                    </span>
                    <ArrowUpRight size={18} className="text-muted transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-bright" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={onSubmit} className="glass relative rounded-[28px] p-6 md:p-10" data-reveal="scale">
            <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="relative">
                <input id="name" name="name" required maxLength={80} placeholder="Name" className={field} autoComplete="name" />
                <label htmlFor="name" className={label}>
                  Name
                </label>
              </div>
              <div className="relative">
                <input id="email" name="email" type="email" required placeholder="Email" className={field} autoComplete="email" />
                <label htmlFor="email" className={label}>
                  Email
                </label>
              </div>
            </div>
            <div className="relative mt-4">
              <input id="subject" name="subject" required maxLength={120} placeholder="Subject" className={field} />
              <label htmlFor="subject" className={label}>
                Subject
              </label>
            </div>
            <div className="relative mt-4">
              <textarea id="message" name="message" required rows={6} maxLength={4000} placeholder="Message" className={`${field} resize-none`} />
              <label htmlFor="message" className={label}>
                Message
              </label>
            </div>

            <div className="mt-6 flex flex-col-reverse items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div aria-live="polite" className="min-h-6 text-sm">
                {status === 'success' && (
                  <p className="flex items-center gap-2 text-accent-bright">
                    <CircleCheck size={16} /> Thanks! Your message is on its way.
                  </p>
                )}
                {status === 'error' && (
                  <p className="flex items-start gap-2 text-amber-300">
                    <TriangleAlert size={16} className="mt-0.5 shrink-0" /> {error}
                  </p>
                )}
              </div>
              <MagneticButton
                type="submit"
                disabled={status === 'sending'}
                className="w-full sm:w-auto"
                icon={status === 'sending' ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />}
              >
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </MagneticButton>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

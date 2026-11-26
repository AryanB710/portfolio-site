import { useEffect, useRef, useState } from 'react';
import { techRows, type TechItem } from '../data/techStack';

const COPIES = 4;

function TechCard({ item }: { item: TechItem }) {
  const [broken, setBroken] = useState(false);
  const showLogo = Boolean(item.icon) && !broken;

  return (
    <div
      className="ts-card"
      style={{
        background: `linear-gradient(160deg, ${item.color}33 0%, #0b0f0f 70%)`,
        borderColor: `${item.color}55`,
      }}
    >
      <span className="ts-label">{item.name}</span>
      {showLogo ? (
        <img
          src={item.icon}
          alt=""
          className="ts-logo"
          loading="lazy"
          draggable={false}
          style={item.invert ? { filter: 'invert(1)' } : undefined}
          onError={() => setBroken(true)}
        />
      ) : (
        <span className="ts-glyph" style={{ color: item.color }}>
          {item.glyph ?? item.name.slice(0, 2)}
        </span>
      )}
    </div>
  );
}

export default function WhatIUse() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="stack" className="ts-section">
      <style>{css}</style>

      <div className="ts-head">
        <p className="ts-eyebrow">Tech stack</p>
        <h2 ref={titleRef} className={`ts-title${inView ? ' is-in' : ''}`}>
          What I use
        </h2>
        <p className="ts-sub">The languages, models and tools behind my projects.</p>
      </div>

      <div className="ts-stage" aria-hidden="true">
        <div className="ts-plane">
          {techRows.map((row, i) => (
            <div key={row.label} className="ts-row">
              <div
                className={`ts-track${i % 2 ? ' ts-reverse' : ''}`}
                style={{ animationDuration: `${40 + i * 8}s` }}
              >
                {Array.from({ length: COPIES }, (_, copy) => (
                  <div key={copy} className="ts-set">
                    {row.items.map((item) => (
                      <TechCard key={item.name} item={item} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ul className="sr-only">
        {techRows.flatMap((row) =>
          row.items.map((item) => <li key={`${row.label}-${item.name}`}>{item.name}</li>),
        )}
      </ul>
    </section>
  );
}

const css = `
.ts-section{position:relative;min-height:115svh;overflow:hidden;padding:6rem 0;background:#050505;}
.ts-head{position:relative;z-index:2;max-width:72rem;margin:0 auto;padding:0 1.5rem;pointer-events:none;}
.ts-eyebrow{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.75rem;letter-spacing:.3em;text-transform:uppercase;color:#159E91;}
.ts-title{margin-top:.75rem;font-size:clamp(3.5rem,11vw,9rem);font-weight:800;line-height:.9;letter-spacing:-.045em;
  background:linear-gradient(180deg,#ffffff 10%,#8a9693 100%);-webkit-background-clip:text;background-clip:text;color:transparent;
  opacity:0;filter:blur(16px);transform:translateY(40px);
  transition:opacity 1.1s ease,filter 1.1s ease,transform 1.1s cubic-bezier(.2,.8,.2,1);}
.ts-title.is-in{opacity:1;filter:blur(0);transform:none;}
.ts-sub{margin-top:1rem;max-width:26rem;font-size:.95rem;color:rgba(255,255,255,.55);}
.ts-stage{position:absolute;inset:0;z-index:1;perspective:2400px;}
.ts-stage::after{content:'';position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse at 60% 60%,transparent 35%,#050505 85%),linear-gradient(180deg,#050505 0%,transparent 30%);}
.ts-plane{position:absolute;left:58%;top:62%;width:2600px;display:flex;flex-direction:column;gap:2rem;
  transform:translate(-50%,-50%) rotateX(55deg) rotateZ(-35deg);transform-style:preserve-3d;}
.ts-row,.ts-track,.ts-set{transform-style:preserve-3d;}
.ts-track{display:flex;width:max-content;animation:ts-marquee linear infinite;}
.ts-reverse{animation-direction:reverse;}
.ts-row:hover .ts-track{animation-play-state:paused;}
.ts-set{display:flex;gap:1.5rem;padding-right:1.5rem;}
.ts-card{flex:none;width:150px;height:170px;border:1px solid;border-radius:24px;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:1rem;padding:1rem;box-shadow:0 30px 60px -20px rgba(0,0,0,.8);
  transition:transform .35s ease,box-shadow .35s ease;}
.ts-card:hover{transform:translateZ(40px);box-shadow:0 0 40px -6px rgba(21,158,145,.6);}
.ts-label{font-size:.7rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#d7e0de;text-align:center;line-height:1.3;}
.ts-logo{width:58px;height:58px;object-fit:contain;}
.ts-glyph{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:1.9rem;font-weight:800;line-height:1;}
@keyframes ts-marquee{from{transform:translateX(0)}to{transform:translateX(-25%)}}
@media (max-width:768px){
  .ts-section{min-height:95svh;}
  .ts-plane{left:50%;top:68%;transform:translate(-50%,-50%) rotateX(55deg) rotateZ(-35deg) scale(.62);}
}
@media (prefers-reduced-motion:reduce){.ts-track{animation:none}.ts-title{transition:none}}
`;
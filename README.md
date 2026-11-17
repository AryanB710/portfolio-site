# Aryan Bose — 3D Interactive Portfolio

React + TypeScript + Vite + Tailwind CSS v4 + GSAP/ScrollTrigger + Three.js (React Three Fiber + Drei) + Lenis.

This guide assumes you've never set up a project like this before. Follow it top to bottom.

---

## Phase 1 — What's in the folder

```
aryan-portfolio/
├── public/                     ← files served as-is
│   ├── resume/Aryan_Bose_Resume.pdf   ← REPLACE with your real resume (same name)
│   ├── models/                 ← optional custom 3D model (avatar.glb)
│   ├── images/                 ← profile photo, project screenshots, certificates
│   ├── favicon.svg, og-image.png, apple-touch-icon.png, site.webmanifest, robots.txt
├── src/
│   ├── data/          ← ★ ALL YOUR CONTENT LIVES HERE ★
│   │   ├── profile.ts       name, email, links, about text, journey timeline
│   │   ├── projects.ts      projects (add one = add an object)
│   │   ├── skills.ts        skill categories + honest levels
│   │   ├── experience.ts    academic / project / leadership / internship timeline
│   │   └── achievements.ts  certifications + other achievements
│   ├── sections/      ← each page section (Hero, About, Experience, Skills, Projects…)
│   ├── components/    ← reusable pieces (Navbar, Loader, cursor, buttons, modal…)
│   ├── three/         ← the 3D scene and character
│   │   ├── config.ts        swap in your own .glb model here / change colours
│   │   ├── Character.tsx    the code-built 3D character
│   │   ├── GLBCharacter.tsx loader for a custom model
│   │   └── HeroScene.tsx    lights, pedestal, floating objects, camera
│   ├── animations/    ← GSAP setup, Lenis smooth scroll, reveal hooks
│   ├── hooks/         ← device detection, active section
│   ├── pages/         ← custom 404 page
│   ├── styles/        ← global CSS + design tokens (colours, fonts)
│   └── types/         ← TypeScript types for the data files
├── index.html         ← SEO + Open Graph tags
├── vercel.json        ← deployment config
└── .env.example       ← contact-form key template
```

You will mostly only touch **`src/data/`** and **`public/`**.

---

## Phase 2 — Install and run

1. Install **Node.js 20 or newer** from https://nodejs.org (choose "LTS"). Check it worked:
   ```bash
   node -v
   npm -v
   ```
2. Open a terminal **inside the `aryan-portfolio` folder** (in VS Code: *Terminal → New Terminal*).
3. Install the packages (takes a minute, only needed once):
   ```bash
   npm install
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open the address it prints (usually http://localhost:5173). Edits you save show up instantly.

Stop the server with `Ctrl + C`.

---

## Phase 3 — Replace the placeholders (do this before sharing)

| What | Where | How |
|---|---|---|
| Email, LinkedIn, GitHub | `src/data/profile.ts` | ✅ filled in from your resume |
| Resume | `public/resume/Aryan_Bose_Resume.pdf` | ✅ your resume is in place — overwrite it (same name) to update |
| Profile photo (optional) | `public/images/profile.jpg` | then set `photo: '/images/profile.jpg'` in `profile.ts` |
| Live demo links | `src/data/projects.ts` | GitHub links are filled; add `liveUrl` if you host a demo |
| Leadership dates | `src/data/experience.ts` | optional: fill `period` |
| Certificate years & links | `src/data/achievements.ts` | fill `year`, `credentialUrl` (empty = hidden) |
| Paper link | `src/data/achievements.ts` | add `publication.url` once the CCIS paper is online |
| Website URL | `index.html` | replace every `https://your-domain.vercel.app` after deploying |

Nothing is invented: anything you don't fill in simply doesn't appear.

### Adding a project
Open `src/data/projects.ts`, copy the first object, change the fields, set `status: 'completed'` (or `'in-progress'`). Add a screenshot at `public/images/projects/my-project.webp` and set `image: '/images/projects/my-project.webp'`. Delete the `next-project-1` placeholder when you have real projects.

### Adding an internship (only when confirmed)
In `src/data/experience.ts`:
```ts
{ id: 'intern-x', category: 'internship', title: 'Software Engineering Intern', organisation: 'Company', period: 'Jan 2027 — Mar 2027', description: 'What you did.', tags: ['Python'] },
```
An "Internship" filter tab appears automatically.

---

## Phase 4 — The 3D character and the scroll story

On desktop one 3D stage sits fixed behind the first three sections and changes shot as you scroll:

1. **Hero:** a giant bust of your character in the centre, "Hello! I'm ARYAN BOSE" on the left and a rolling job title on the right. He lands, waves, follows the mouse, blinks and breathes. Click him (or **Say hi**) to wave again.
2. **About me:** he slides left and turns toward the text.
3. **What I do:** the laptop disappears, a desk, chair and monitor appear, and he sits down and types.

Then solid sections slide up over the stage: the career timeline (glowing line that fills as you scroll), your work, the tech-stack ball pit (push the balls with your mouse), achievements, resume and contact.

The character is built in code and fully rigged (`src/three/Character.tsx`): hips, knees, shoulders, elbows, head and eyes. Tweak:
- **Colours / glasses:** `src/three/config.ts` (`characterPalette`, `glasses`).
- **Camera shots per section:** `STAGES` in `src/three/HeroScene.tsx`.
- **Rolling words:** `ROLES` in `src/sections/Hero.tsx`.
- **Tech-stack balls:** `STACK` in `src/sections/TechStack.tsx`.
- **"What I do" cards:** `services` in `src/sections/WhatIDo.tsx`.

On phones the character stays in the hero only (no fixed stage), and the ball pit becomes a simple list, to keep things fast.

**Using your own model instead:** export a `.glb` (Ready Player Me / Avaturn / Blender), compress it:
```bash
npx @gltf-transform/cli optimize avatar-raw.glb public/models/avatar.glb --compress draco --texture-compress webp
```
then set `modelUrl: '/models/avatar.glb'` in `src/three/config.ts`. A custom model keeps the scroll camera shots, mouse-follow and entrance; it won't sit at the desk unless its file includes a sitting animation. Set `idleClip` / `waveClip` to clip names in your file.

---

## Phase 5 — Contact form (real email delivery)

The form sends through **Web3Forms** (free, no server needed).
1. Go to https://web3forms.com, enter your email, and copy the **access key** they email you.
2. In the project folder, copy `.env.example` to a new file named `.env`, and paste:
   ```
   VITE_WEB3FORMS_KEY=your-key-here
   ```
3. Restart `npm run dev`. Submit a test message — it arrives in your inbox.

Without a key, the form tells visitors it isn't connected and shows your email instead (no fake "sent" message).

---

## Phase 6 — Animations and performance

- **GSAP + ScrollTrigger**: split-text headings, staggered reveals, parallax hero, clip-path project reveals, drawn timeline line, animated nav indicator, magnetic buttons, tilt cards.
- **Lenis** smooth scrolling, synced to GSAP's ticker.
- **Loader**, **custom cursor** (mouse devices only), **particle field** (desktop only).
- **Respects `prefers-reduced-motion`**: all motion is switched off, the loader is skipped.
- **Low-power / mobile**: no shadows, fewer floating objects, no particles, no smooth-scroll hijacking, lower pixel ratio. The 3D canvas stops rendering when scrolled out of view.
- **Code splitting**: three.js loads in its own chunk after the page paints; the project modal loads on demand.

---

## Phase 7 — Check before deploying

```bash
npm run build     # type-checks and builds into dist/
npm run preview   # serves the production build at http://localhost:4173
```
If `npm run build` prints a TypeScript error, it shows the file and line. Then run a Lighthouse audit in Chrome DevTools (*Lighthouse tab → Analyze page load*).

Test on your phone: while `npm run dev` is running, use `npm run dev -- --host` and open the "Network" URL on your phone (same Wi-Fi).

---

## Phase 8 — Deploy to Vercel

1. Create a GitHub repository and push the project:
   ```bash
   git init
   git add .
   git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/portfolio.git
   git push -u origin main
   ```
2. Go to https://vercel.com → sign in with GitHub → **Add New → Project** → import the repo. Vercel detects Vite automatically (settings are in `vercel.json`).
3. Under **Environment Variables** add `VITE_WEB3FORMS_KEY` with your key.
4. Click **Deploy**. You'll get a URL like `aryan-bose.vercel.app`.
5. Put that URL into `index.html` (canonical, `og:url`, `og:image`, `twitter:image`), commit and push — Vercel redeploys automatically on every push.

Any unknown URL (e.g. `/abc`) shows the custom 404 page.

---

## Troubleshooting

- **`npm install` errors about peer dependencies** → run `npm install --legacy-peer-deps`.
- **Blank hero on an old laptop** → WebGL may be disabled; the site shows a soft glow instead and everything else still works.
- **Fonts look different offline** → fonts load from Google Fonts; they appear once you're online.

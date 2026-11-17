/**
 * ============================================================
 *  3D CHARACTER CONFIG
 *
 *  By default the hero shows a stylised character built in code
 *  (src/three/Character.tsx) — no download needed.
 *
 *  To use your own model instead:
 *   1. Export a .glb (Ready Player Me, Avaturn, Blender, Spline…)
 *   2. Compress it:  npx @gltf-transform/cli optimize in.glb avatar.glb --compress draco --texture-compress webp
 *   3. Put it at public/models/avatar.glb
 *   4. Set modelUrl below to '/models/avatar.glb'
 *  Tweak scale / position until it sits nicely on the pedestal.
 * ============================================================
 */
export const characterConfig = {
  /** Round glasses on the code-built character */
  glasses: true,
  modelUrl: '' as string, // e.g. '/models/avatar.glb'
  scale: 1.8,
  position: [0, 0.05, 0] as [number, number, number],
  rotationY: 0,
  /** Name of the animation clip to play (leave '' to play the first one) */
  idleClip: '',
  /** Optional clip played on "Say hi" / click (e.g. a Mixamo 'Waving' clip). */
  waveClip: '',
  /** Bone that should follow the mouse. Ready Player Me uses 'Head'. */
  headBone: 'Head',
};

/** Palette for the code-built character. Change these to restyle him. */
export const characterPalette = {
  skin: '#c98d68',
  skinShade: '#b57a57',
  hair: '#17110d',
  jacket: '#1f252c',
  jacketTrim: '#161a1f',
  shirt: '#e8ecef',
  pants: '#1c2635',
  shoes: '#f1f3f5',
  shoeSole: '#d9dde1',
  laptop: '#b9c0c7',
  accent: '#159e91',
  accentBright: '#2dd4bf',
};

import * as THREE from 'three';

/**
 * Draws a "code editor" onto a canvas so the laptop screen shows
 * glowing code without loading any image file.
 */
export function createCodeTexture(): THREE.CanvasTexture {
  const w = 512;
  const h = 640; // taller than the screen so it can scroll
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#071311';
  ctx.fillRect(0, 0, w, h);

  const colors = ['#2dd4bf', '#159e91', '#e6edf3', '#7d8590', '#5eead4', '#a7f3d0'];
  let y = 26;
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  while (y < h - 10) {
    // line number gutter
    ctx.fillStyle = 'rgba(125,133,144,0.35)';
    ctx.fillRect(14, y - 6, 14, 6);

    const indent = Math.floor(rand() * 4) * 22;
    let x = 44 + indent;
    const tokens = 1 + Math.floor(rand() * 4);
    for (let i = 0; i < tokens; i++) {
      const tw = 24 + rand() * 90;
      if (x + tw > w - 20) break;
      ctx.fillStyle = colors[Math.floor(rand() * colors.length)];
      ctx.globalAlpha = 0.55 + rand() * 0.45;
      ctx.beginPath();
      ctx.roundRect(x, y - 7, tw, 7, 3.5);
      ctx.fill();
      x += tw + 10;
    }
    ctx.globalAlpha = 1;
    y += rand() > 0.85 ? 30 : 18;
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 0.8);
  tex.anisotropy = 4;
  return tex;
}

/** Soft radial glow used as a halo behind the character. */
export function createGlowTexture(color = '21,158,145'): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, `rgba(${color},0.55)`);
  g.addColorStop(0.35, `rgba(${color},0.18)`);
  g.addColorStop(1, `rgba(${color},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { characterPalette as C } from './config';

export interface StackItem {
  name: string;
  /** stripe colour on the ball */
  color: string;
}

interface Props {
  items: StackItem[];
  /** drop the balls in once the section is visible */
  active: boolean;
  animate: boolean;
  rich: boolean;
}

/** Paints a wrap-around label texture: white ball, coloured band, name on both sides. */
function makeLabel(name: string, color: string) {
  const w = 512;
  const h = 256;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#f4f6f7';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = color;
  ctx.fillRect(0, h * 0.62, w, h * 0.1);
  ctx.fillStyle = '#16191c';
  const size = name.length > 9 ? 30 : name.length > 6 ? 38 : 48;
  ctx.font = `600 ${size}px "Space Grotesk", Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, w * 0.25, h * 0.5);
  ctx.fillText(name, w * 0.75, h * 0.5);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

type Body = { p: THREE.Vector3; v: THREE.Vector3; r: number; spin: THREE.Vector3 };

/**
 * A small custom physics sim (no physics library): balls are pulled
 * toward the centre, collide with each other, and get shoved by the
 * mouse. Cheap enough for ~24 balls at 60fps.
 */
function Balls({ items, active, animate }: Omit<Props, 'rich'>) {
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const { viewport, pointer } = useThree();
  const pointerWorld = useMemo(() => new THREE.Vector3(), []);
  const prevPointer = useMemo(() => new THREE.Vector3(), []);

  const bodies = useMemo<Body[]>(
    () =>
      items.map((_, i) => {
        const r = 0.55 + ((i * 37) % 10) / 40; // 0.55 – 0.8, deterministic variety
        return {
          p: new THREE.Vector3((Math.random() - 0.5) * 8, 10 + Math.random() * 8, (Math.random() - 0.5) * 2),
          v: new THREE.Vector3(),
          r,
          spin: new THREE.Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(0.6),
        };
      }),
    [items],
  );

  const materials = useMemo(
    () =>
      items.map(
        (it) =>
          new THREE.MeshPhysicalMaterial({
            map: makeLabel(it.name, it.color),
            roughness: 0.18,
            clearcoat: 1,
            clearcoatRoughness: 0.1,
            sheen: 0.4,
            sheenColor: new THREE.Color(C.accentBright),
          }),
      ),
    [items],
  );
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 40, 40), []);

  useEffect(
    () => () => {
      materials.forEach((m) => {
        m.map?.dispose();
        m.dispose();
      });
      geometry.dispose();
    },
    [materials, geometry],
  );

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 1 / 30);
    if (!active) return;

    prevPointer.copy(pointerWorld);
    pointerWorld.set((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 0);
    const pointerSpeed = pointerWorld.distanceTo(prevPointer) / Math.max(dt, 1e-3);

    // forces
    for (const b of bodies) {
      // pull toward centre (stronger when far)
      b.v.addScaledVector(b.p, -2.4 * dt);
      // mouse shove
      const dx = b.p.x - pointerWorld.x;
      const dy = b.p.y - pointerWorld.y;
      const dist = Math.hypot(dx, dy);
      const reach = b.r + 0.9;
      if (animate && dist < reach && dist > 1e-4) {
        const push = (1 - dist / reach) * (6 + Math.min(pointerSpeed, 30) * 0.6);
        b.v.x += (dx / dist) * push * dt;
        b.v.y += (dy / dist) * push * dt;
      }
      b.v.multiplyScalar(1 - 2.2 * dt); // drag
      b.p.addScaledVector(b.v, dt);
      b.p.z *= 1 - 3 * dt; // keep the pile shallow
    }

    // collisions (pairwise)
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i];
        const b = bodies[j];
        const d = a.p.distanceTo(b.p);
        const min = a.r + b.r;
        if (d < min && d > 1e-5) {
          const n = new THREE.Vector3().subVectors(b.p, a.p).divideScalar(d);
          const overlap = (min - d) / 2;
          a.p.addScaledVector(n, -overlap);
          b.p.addScaledVector(n, overlap);
          const rel = new THREE.Vector3().subVectors(b.v, a.v).dot(n);
          if (rel < 0) {
            a.v.addScaledVector(n, rel * 0.6);
            b.v.addScaledVector(n, -rel * 0.6);
          }
        }
      }
    }

    bodies.forEach((b, i) => {
      const mesh = meshes.current[i];
      if (!mesh) return;
      mesh.position.copy(b.p);
      mesh.scale.setScalar(b.r);
      // roll a little with velocity
      mesh.rotation.x += (b.v.y * 0.4 + b.spin.x * 0.05) * dt;
      mesh.rotation.y += (b.v.x * 0.4 + b.spin.y * 0.05) * dt;
    });
  });

  return (
    <>
      {items.map((it, i) => (
        <mesh
          key={it.name}
          ref={(el) => {
            meshes.current[i] = el;
          }}
          geometry={geometry}
          material={materials[i]}
          position={bodies[i].p}
          castShadow
        />
      ))}
    </>
  );
}

export default function TechStackScene(props: Props) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapper} className="h-full w-full">
      <Canvas
        dpr={props.rich ? [1, 2] : [1, 1.5]}
        frameloop={visible ? 'always' : 'never'}
        camera={{ fov: 32, position: [0, 0, 18] }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        eventSource={document.getElementById('root') ?? undefined}
        eventPrefix="client"
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 10]} intensity={2.2} />
        <spotLight position={[-10, 5, 4]} angle={0.5} penumbra={1} intensity={120} color={C.accentBright} distance={40} />
        <Environment resolution={64} frames={1}>
          <Lightformer form="rect" intensity={3} position={[0, 6, 6]} scale={[12, 4, 1]} />
          <Lightformer form="rect" intensity={2} position={[-8, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} color={C.accentBright} />
        </Environment>
        <Balls items={props.items} active={props.active && visible} animate={props.animate} />
      </Canvas>
    </div>
  );
}

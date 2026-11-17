import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Float, Lightformer, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { Character } from './Character';
import { GLBCharacter } from './GLBCharacter';
import { characterConfig, characterPalette as C } from './config';
import { createGlowTexture } from './textures';
import { sceneScroll } from './events';

interface Props {
  rich: boolean; // full quality (desktop, decent GPU)
  interactive: boolean; // mouse-follow
  animate: boolean; // false when prefers-reduced-motion
  entered: boolean; // loader finished
  compact: boolean; // mobile framing, no scroll stages
}

/**
 * Camera + character placement for each scroll stage.
 *  hero  → giant bust in the centre
 *  about → character slides left and turns toward the text
 *  desk  → wide shot, seated at the desk, facing the monitor
 */
const STAGES = {
  hero: { cam: [0, 2.85, 3.35], look: [0, 2.58, 0], x: 0, rotY: 0 },
  about: { cam: [0, 2.62, 3.9], look: [0, 2.32, 0], x: -1.05, rotY: 0.5 },
  desk: { cam: [0, 2.4, 7.4], look: [0, 1.28, 0], x: -0.95, rotY: 0.62 },
  mobile: { cam: [0, 2.55, 4.9], look: [0, 2.15, 0], x: 0, rotY: 0 },
} as const;

const v = new THREE.Vector3();
const lookTarget = new THREE.Vector3();

function StageRig({ compact, interactive, children }: { compact: boolean; interactive: boolean; children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const look = useRef(new THREE.Vector3(...STAGES.hero.look));

  useFrame((state, delta) => {
    const a = compact ? 0 : sceneScroll.about;
    const d = compact ? 0 : sceneScroll.desk;
    const from = compact ? STAGES.mobile : STAGES.hero;
    const L = THREE.MathUtils.lerp;
    const mix = (k: 0 | 1 | 2, key: 'cam' | 'look') => L(L(from[key][k], STAGES.about[key][k], a), STAGES.desk[key][k], d);

    // camera with subtle mouse parallax
    const par = interactive ? 1 - d * 0.6 : 0;
    v.set(mix(0, 'cam') + state.pointer.x * 0.12 * par, mix(1, 'cam') + state.pointer.y * 0.06 * par, mix(2, 'cam'));
    state.camera.position.lerp(v, 1 - Math.exp(-6 * delta));
    lookTarget.set(mix(0, 'look'), mix(1, 'look'), mix(2, 'look'));
    look.current.lerp(lookTarget, 1 - Math.exp(-6 * delta));
    state.camera.lookAt(look.current);

    if (group.current) {
      const x = L(L(from.x, STAGES.about.x, a), STAGES.desk.x, d);
      const r = L(L(from.rotY, STAGES.about.rotY, a), STAGES.desk.rotY, d);
      group.current.position.x = THREE.MathUtils.damp(group.current.position.x, x, 6, delta);
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, r, 6, delta);
    }
  });

  return <group ref={group}>{children}</group>;
}

/** Big soft glow behind the character, plus a cooler one off to the side. */
function Glows() {
  const tex = useMemo(() => createGlowTexture(), []);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <>
      <mesh position={[0, 2.3, -2.2]}>
        <planeGeometry args={[7, 7]} />
        <meshBasicMaterial map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <mesh position={[3.2, 1.2, -3]}>
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial map={tex} transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
    </>
  );
}

function SceneContents({ rich, interactive, animate, entered, compact }: Props) {
  const useGLB = characterConfig.modelUrl.trim() !== '';
  const body = (
    <Suspense fallback={null}>
      {useGLB ? (
        <GLBCharacter url={characterConfig.modelUrl} interactive={interactive} animate={animate} entered={entered} />
      ) : (
        <Character interactive={interactive} animate={animate} entered={entered} scrollPoses={!compact} />
      )}
    </Suspense>
  );

  return (
    <>
      {/* ---------- cinematic studio lighting ---------- */}
      <ambientLight intensity={0.22} />
      <directionalLight
        position={[2.5, 6, 5]}
        intensity={2.1}
        color="#fff4ea"
        castShadow={rich}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={4}
        shadow-camera-bottom={-1}
        shadow-bias={-0.0004}
      />
      {/* teal rim lights from behind, both sides — the signature edge glow */}
      <spotLight position={[-3.5, 4, -3]} angle={0.6} penumbra={1} intensity={70} color={C.accentBright} distance={14} />
      <spotLight position={[3.5, 3.5, -3]} angle={0.6} penumbra={1} intensity={45} color="#7dd3fc" distance={14} />
      <pointLight position={[0, 1.5, 3]} intensity={4} color="#dfe8ff" distance={8} />

      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 5, -6]} scale={[10, 4, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} color={C.accentBright} />
        <Lightformer form="rect" intensity={1.5} position={[5, 2, 1]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} color="#dfe8ff" />
      </Environment>

      <Glows />

      <StageRig compact={compact} interactive={interactive}>
        {animate ? (
          <Float speed={1.4} rotationIntensity={0.04} floatIntensity={0.18} floatingRange={[-0.02, 0.03]}>
            {body}
          </Float>
        ) : (
          body
        )}
        {rich && <ContactShadows position={[0, 0.005, 0.4]} opacity={0.55} scale={5} blur={2.6} far={2} resolution={512} color="#000000" />}
      </StageRig>

      {animate && rich && <Sparkles count={36} scale={[7, 4, 3]} position={[0, 2, -0.5]} size={2} speed={0.2} opacity={0.45} color={C.accentBright} />}
    </>
  );
}

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * The 3D stage. On desktop it sits fixed behind the first three
 * sections and changes shot as you scroll. Lazy-loaded so three.js
 * never blocks the first paint. Stops rendering when hidden.
 */
export default function HeroScene(props: Props & { active?: boolean }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [supported] = useState(hasWebGL);
  const active = props.active ?? true;

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!supported) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(21,158,145,0.35),transparent_70%)]" />
      </div>
    );
  }

  return (
    <div ref={wrapper} className="h-full w-full" aria-hidden="true">
      <Canvas
        shadows={props.rich}
        dpr={props.rich ? [1, 2] : [1, 1.5]}
        frameloop={visible && active ? 'always' : 'never'}
        camera={{ fov: 30, near: 0.1, far: 60, position: [...STAGES.hero.cam] }}
        // track the mouse across the whole page, not just the canvas
        eventSource={document.getElementById('root') ?? undefined}
        eventPrefix="client"
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      >
        <SceneContents {...props} />
      </Canvas>
    </div>
  );
}

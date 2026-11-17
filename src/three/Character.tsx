import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { characterPalette as C, characterConfig } from './config';
import { createCodeTexture } from './textures';
import { characterEvents, sceneScroll } from './events';

interface Props {
  /** follow the mouse with head + body */
  interactive: boolean;
  /** run idle animations (breathing, blinking, sway) */
  animate: boolean;
  /** play the entrance animation once this becomes true */
  entered: boolean;
  /** drive the seated "desk" pose from scroll (desktop only) */
  scrollPoses: boolean;
}

const { damp, lerp } = THREE.MathUtils;

/** Rest poses. Standing = holding the laptop; seated = typing at the desk. */
const POSE = {
  stand: { shX: -0.25, shZ: 0.14, elY: -0.32, foreX: -1.42, hipX: 0, kneeX: 0, bodyY: 0 },
  sit: { shX: -0.63, shZ: 0.1, elY: -0.18, foreX: -0.94, hipX: -Math.PI / 2, kneeX: Math.PI / 2, bodyY: -0.5 },
};

/**
 * Original stylised developer character built from geometry and
 * physically-based materials. Fully rigged in code: hips, knees,
 * shoulders, elbows, head and eyes, so he can stand, wave, turn and
 * sit down at a desk as you scroll.
 */
export function Character({ interactive, animate, entered, scrollPoses }: Props) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const pupils = useRef<THREE.Group>(null);
  const hips = [useRef<THREE.Group>(null), useRef<THREE.Group>(null)];
  const knees = [useRef<THREE.Group>(null), useRef<THREE.Group>(null)];
  const shoulders = [useRef<THREE.Group>(null), useRef<THREE.Group>(null)];
  const elbows = [useRef<THREE.Group>(null), useRef<THREE.Group>(null)];
  const forearms = [useRef<THREE.Group>(null), useRef<THREE.Group>(null)];
  const laptop = useRef<THREE.Group>(null);
  const desk = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const screenLight = useRef<THREE.PointLight>(null);
  const blink = useRef({ next: 2.5, until: 0 });
  const wave = useRef({ w: 0 });
  const waving = useRef<gsap.core.Timeline | null>(null);
  const sit = useRef(0);

  // ---------- materials ----------
  const m = useMemo(() => {
    const skin = new THREE.MeshPhysicalMaterial({ color: C.skin, roughness: 0.55, sheen: 0.4, sheenColor: new THREE.Color('#ffb59a') });
    const skinShade = new THREE.MeshStandardMaterial({ color: C.skinShade, roughness: 0.6 });
    const hair = new THREE.MeshPhysicalMaterial({ color: C.hair, roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.5 });
    const jacket = new THREE.MeshPhysicalMaterial({ color: C.jacket, roughness: 0.78, sheen: 1, sheenRoughness: 0.6, sheenColor: new THREE.Color('#4b5866') });
    const jacketTrim = new THREE.MeshStandardMaterial({ color: C.jacketTrim, roughness: 0.8 });
    const shirt = new THREE.MeshStandardMaterial({ color: C.shirt, roughness: 0.85 });
    const pants = new THREE.MeshPhysicalMaterial({ color: C.pants, roughness: 0.8, sheen: 0.6, sheenColor: new THREE.Color('#3b4d66') });
    const shoes = new THREE.MeshStandardMaterial({ color: C.shoes, roughness: 0.45 });
    const sole = new THREE.MeshStandardMaterial({ color: C.accent, roughness: 0.5 });
    const eyeWhite = new THREE.MeshStandardMaterial({ color: '#f7f7f5', roughness: 0.25 });
    const pupil = new THREE.MeshStandardMaterial({ color: '#1b120c', roughness: 0.15 });
    const glint = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    const mouth = new THREE.MeshStandardMaterial({ color: '#5b2a22', roughness: 0.6 });
    const metal = new THREE.MeshPhysicalMaterial({ color: C.laptop, metalness: 0.92, roughness: 0.28, clearcoat: 0.6 });
    const dark = new THREE.MeshStandardMaterial({ color: '#0b0d0f', roughness: 0.35 });
    const watch = new THREE.MeshStandardMaterial({ color: C.accent, metalness: 0.4, roughness: 0.3, emissive: C.accent, emissiveIntensity: 0.4 });
    const frames = new THREE.MeshPhysicalMaterial({ color: '#101214', metalness: 0.6, roughness: 0.25, clearcoat: 1 });
    const lens = new THREE.MeshPhysicalMaterial({ color: '#bfeee8', transmission: 0, transparent: true, opacity: 0.18, roughness: 0.05, metalness: 0 });
    const deskTop = new THREE.MeshPhysicalMaterial({ color: '#e9ecef', roughness: 0.35, clearcoat: 0.6 });
    const deskLeg = new THREE.MeshStandardMaterial({ color: '#141619', metalness: 0.6, roughness: 0.4 });
    const chair = new THREE.MeshPhysicalMaterial({ color: '#f2f4f5', roughness: 0.4, clearcoat: 0.5 });
    const wood = new THREE.MeshStandardMaterial({ color: '#6b4a33', roughness: 0.7 });
    const keys = new THREE.MeshStandardMaterial({ color: '#d7dbdf', roughness: 0.5 });
    return { skin, skinShade, hair, jacket, jacketTrim, shirt, pants, shoes, sole, eyeWhite, pupil, glint, mouth, metal, dark, watch, frames, lens, deskTop, deskLeg, chair, wood, keys };
  }, []);

  const codeTexture = useMemo(() => createCodeTexture(), []);
  const screenMat = useMemo(() => new THREE.MeshBasicMaterial({ map: codeTexture, toneMapped: false }), [codeTexture]);

  useEffect(
    () => () => {
      Object.values(m).forEach((mat) => mat.dispose());
      screenMat.dispose();
      codeTexture.dispose();
    },
    [m, screenMat, codeTexture],
  );

  // ---------- wave ----------
  const sayHi = () => {
    if (!animate || sit.current > 0.4 || waving.current?.isActive()) return;
    waving.current = gsap
      .timeline()
      .to(wave.current, { w: 1, duration: 0.55, ease: 'power3.out' })
      .to(wave.current, { w: 0, duration: 0.7, ease: 'power2.inOut' }, '+=1.7');
  };

  useEffect(() => {
    const onWave = () => sayHi();
    characterEvents.addEventListener('wave', onWave);
    return () => characterEvents.removeEventListener('wave', onWave);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate]);

  useEffect(() => {
    if (!entered || !animate) return;
    const id = window.setTimeout(sayHi, 1600);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entered, animate]);

  // ---------- entrance ----------
  useEffect(() => {
    const g = root.current;
    if (!g) return;
    g.visible = entered;
    if (!entered || !animate) return;
    const tl = gsap.timeline();
    tl.from(g.position, { y: -1.6, duration: 1.8, ease: 'expo.out' })
      .from(g.rotation, { y: -0.9, duration: 2, ease: 'expo.out' }, 0)
      .from(g.scale, { x: 0.9, y: 0.9, z: 0.9, duration: 1.6, ease: 'expo.out' }, 0);
    return () => {
      tl.kill();
    };
  }, [entered, animate]);

  // ---------- per-frame ----------
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const w = wave.current.w;

    // seated blend follows scroll (smoothed)
    const targetSit = scrollPoses ? sceneScroll.desk : 0;
    sit.current = damp(sit.current, targetSit, 6, delta);
    const p = THREE.MathUtils.smoothstep(sit.current, 0, 1);
    const P = (k: keyof typeof POSE.stand) => lerp(POSE.stand[k], POSE.sit[k], p);

    // look at the mouse in the hero; look at the monitor when seated
    const looking = interactive && p < 0.5;
    const px = looking ? state.pointer.x : Math.sin(t * 0.4) * 0.25 * (1 - p);
    const py = looking ? state.pointer.y : Math.sin(t * 0.3) * 0.1 * (1 - p);

    if (body.current) {
      body.current.position.y = P('bodyY');
      body.current.rotation.y = damp(body.current.rotation.y, px * 0.22 * (1 - p), 3, delta);
      if (animate) {
        body.current.position.x = Math.sin(t * 0.55) * 0.025 * (1 - p);
        body.current.rotation.z = Math.sin(t * 0.55) * 0.012 * (1 - p);
      }
    }
    if (head.current) {
      head.current.rotation.y = damp(head.current.rotation.y, px * 0.45, 4, delta);
      head.current.rotation.x = damp(head.current.rotation.x, -py * 0.22 + 0.06 + p * 0.12 + (animate ? Math.sin(t * 0.9) * 0.02 : 0), 4, delta);
      head.current.rotation.z = damp(head.current.rotation.z, -px * 0.06 + w * 0.12, 3, delta);
    }
    if (pupils.current) {
      pupils.current.position.x = damp(pupils.current.position.x, px * 0.018, 6, delta);
      pupils.current.position.y = damp(pupils.current.position.y, py * 0.012 - p * 0.01, 6, delta);
    }

    // legs
    hips.forEach((h) => h.current && (h.current.rotation.x = P('hipX')));
    knees.forEach((k) => k.current && (k.current.rotation.x = P('kneeX')));

    // arms (index 0 = left, 1 = right)
    const breath = animate ? Math.sin(t * 1.6) * 0.025 : 0;
    const typingSpeed = 11 + p * 7;
    const typingAmp = animate ? 0.018 + p * 0.05 : 0;
    [0, 1].forEach((i) => {
      const side = i === 0 ? -1 : 1;
      const sh = shoulders[i].current;
      const el = elbows[i].current;
      const fo = forearms[i].current;
      if (!sh || !el || !fo) return;
      const tap = Math.sin(t * typingSpeed + i * 1.7) * typingAmp;
      let shX = P('shX') + breath * (1 - p);
      let shZ = side * P('shZ');
      let elY = side * P('elY');
      let foX = P('foreX') + tap;
      let foZ = 0;
      if (i === 1 && w > 0) {
        shX = lerp(shX, -0.12, w);
        shZ = lerp(shZ, 2.55, w);
        elY = lerp(elY, 0, w);
        foX = lerp(foX, 0, w);
        foZ = lerp(0, 0.6 + Math.sin(t * 9) * 0.38, w);
      }
      sh.rotation.set(shX, 0, shZ);
      el.rotation.set(0, elY, 0);
      fo.rotation.set(foX, 0, foZ);
    });

    // laptop out, desk in
    if (laptop.current) {
      const s = 1 - THREE.MathUtils.smoothstep(p, 0, 0.35);
      laptop.current.scale.setScalar(Math.max(s, 0.0001));
      laptop.current.visible = s > 0.01;
      laptop.current.rotation.z = -0.09 * w;
      laptop.current.position.y = 1.5 - 0.035 * w;
    }
    if (desk.current) {
      const s = THREE.MathUtils.smoothstep(p, 0.35, 1);
      desk.current.scale.setScalar(Math.max(s, 0.0001));
      desk.current.visible = s > 0.01;
    }

    if (!animate) return;

    if (torso.current) {
      const b = Math.sin(t * 1.6) * 0.012;
      torso.current.scale.set(1 + b * 0.6, 1 + b, 1 + b * 0.8);
    }
    if (eyes.current) {
      const bl = blink.current;
      if (t > bl.next) {
        bl.until = t + 0.13;
        bl.next = t + 2.5 + Math.random() * 3;
      }
      eyes.current.scale.y = damp(eyes.current.scale.y, t < bl.until ? 0.08 : 1, 30, delta);
    }
    if (mouthRef.current) mouthRef.current.scale.set(1 + 0.35 * w, 1 + 0.5 * w, 1);
    codeTexture.offset.y = (codeTexture.offset.y + delta * (0.035 + p * 0.06)) % 1;
    if (screenLight.current) screenLight.current.intensity = 2.2 + Math.sin(t * 3) * 0.15;
  });

  return (
    <group
      ref={root}
      dispose={null}
      onClick={(e) => {
        e.stopPropagation();
        sayHi();
      }}
      onPointerOver={() => {
        if (interactive) document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = '';
      }}
    >
      {/* ================= DESK SET (fades in when seated) ================= */}
      <group ref={desk} visible={false}>
        {/* chair */}
        <group position={[0, 0, -0.02]}>
          <RoundedBox args={[0.66, 0.07, 0.62]} radius={0.03} smoothness={3} position={[0, 0.3, 0.06]} material={m.chair} castShadow receiveShadow />
          <RoundedBox args={[0.66, 0.62, 0.06]} radius={0.03} smoothness={3} position={[0, 0.66, -0.27]} rotation={[-0.12, 0, 0]} material={m.chair} castShadow />
          {[
            [-0.28, -0.22],
            [0.28, -0.22],
            [-0.28, 0.32],
            [0.28, 0.32],
          ].map(([x, z], i) => (
            <mesh key={i} material={m.wood} position={[x, 0.135, z]} rotation={[z > 0 ? 0.08 : -0.08, 0, x > 0 ? -0.06 : 0.06]} castShadow>
              <cylinderGeometry args={[0.022, 0.016, 0.28, 10]} />
            </mesh>
          ))}
        </group>
        {/* desk */}
        <group position={[0, 0, 0.98]}>
          <RoundedBox args={[1.7, 0.05, 0.78]} radius={0.015} smoothness={3} position={[0, 1.04, 0]} material={m.deskTop} castShadow receiveShadow />
          {[-0.75, 0.75].map((x) => (
            <group key={x} position={[x, 0, 0]}>
              <mesh material={m.deskLeg} position={[0, 0.52, -0.25]} castShadow>
                <boxGeometry args={[0.04, 1.02, 0.04]} />
              </mesh>
              <mesh material={m.deskLeg} position={[0, 0.52, 0.25]} castShadow>
                <boxGeometry args={[0.04, 1.02, 0.04]} />
              </mesh>
              <mesh material={m.deskLeg} position={[0, 0.02, 0]}>
                <boxGeometry args={[0.06, 0.03, 0.66]} />
              </mesh>
            </group>
          ))}
          {/* keyboard */}
          <RoundedBox args={[0.62, 0.025, 0.2]} radius={0.01} smoothness={2} position={[0, 1.08, -0.17]} material={m.keys} castShadow />
          <mesh position={[0, 1.094, -0.17]} rotation={[-Math.PI / 2, 0, 0]} material={m.dark}>
            <planeGeometry args={[0.58, 0.16]} />
          </mesh>
          {/* monitor facing the character */}
          <group position={[0, 1.07, 0.18]} rotation={[0, Math.PI, 0]}>
            <mesh material={m.metal} position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.12, 0.14, 0.03, 24]} />
            </mesh>
            <mesh material={m.metal} position={[0, 0.2, -0.04]}>
              <boxGeometry args={[0.05, 0.36, 0.03]} />
            </mesh>
            <RoundedBox args={[0.98, 0.6, 0.04]} radius={0.02} smoothness={3} position={[0, 0.62, 0]} material={m.metal} castShadow />
            <mesh position={[0, 0.62, 0.021]} material={m.dark}>
              <planeGeometry args={[0.94, 0.56]} />
            </mesh>
            <mesh position={[0, 0.625, 0.022]} material={screenMat}>
              <planeGeometry args={[0.88, 0.5]} />
            </mesh>
            <pointLight position={[0, 0.6, 0.4]} color={C.accentBright} intensity={2.5} distance={2.4} decay={2} />
          </group>
          {/* phone on a stand + mug */}
          <group position={[0.55, 1.07, 0.05]} rotation={[0, Math.PI + 0.4, 0]}>
            <RoundedBox args={[0.12, 0.22, 0.015]} radius={0.01} smoothness={2} position={[0, 0.13, 0]} rotation={[-0.25, 0, 0]} material={m.dark} />
          </group>
          <mesh material={m.watch} position={[-0.6, 1.13, -0.05]} castShadow>
            <cylinderGeometry args={[0.06, 0.055, 0.14, 20]} />
          </mesh>
        </group>
      </group>

      <group ref={body}>
        {/* ================= LEGS (hip → knee → ankle) ================= */}
        {[-1, 1].map((side, i) => (
          <group key={`leg${side}`} ref={hips[i]} position={[side * 0.19, 1.0, 0]}>
            <mesh material={m.pants} position={[0, -0.26, 0]} castShadow>
              <capsuleGeometry args={[0.17, 0.36, 8, 20]} />
            </mesh>
            <group ref={knees[i]} position={[0, -0.5, 0]}>
              <mesh material={m.pants} position={[0, -0.22, 0]} castShadow>
                <capsuleGeometry args={[0.155, 0.32, 8, 20]} />
              </mesh>
              {/* sneaker */}
              <RoundedBox args={[0.28, 0.15, 0.48]} radius={0.07} smoothness={4} position={[0, -0.41, 0.07]} material={m.shoes} castShadow />
              <RoundedBox args={[0.3, 0.05, 0.5]} radius={0.02} smoothness={2} position={[0, -0.48, 0.07]} material={m.sole} />
            </group>
          </group>
        ))}

        {/* hips */}
        <RoundedBox args={[0.64, 0.32, 0.38]} radius={0.14} smoothness={4} position={[0, 1.1, 0]} material={m.pants} castShadow />

        {/* ================= TORSO ================= */}
        <group ref={torso} position={[0, 1.15, 0]}>
          <mesh material={m.jacket} position={[0, 0.5, 0]} scale={[1.12, 1, 0.74]} castShadow>
            <capsuleGeometry args={[0.36, 0.5, 10, 28]} />
          </mesh>
          <mesh material={m.shirt} position={[0, 0.62, 0.2]} rotation={[-0.08, 0, 0]} scale={[0.6, 1, 0.3]}>
            <capsuleGeometry args={[0.2, 0.42, 6, 18]} />
          </mesh>
          {[-1, 1].map((side) => (
            <RoundedBox
              key={`lapel${side}`}
              args={[0.1, 0.62, 0.05]}
              radius={0.02}
              smoothness={2}
              position={[side * 0.16, 0.66, 0.255]}
              rotation={[-0.1, 0, side * 0.2]}
              material={m.jacketTrim}
            />
          ))}
          <mesh material={m.jacketTrim} position={[0, 1.02, -0.01]} rotation={[Math.PI / 2 - 0.15, 0, 0]}>
            <torusGeometry args={[0.2, 0.05, 10, 28, Math.PI * 1.25]} />
          </mesh>

          {/* ================= ARMS ================= */}
          {[-1, 1].map((side, i) => (
            <group key={`arm${side}`} ref={shoulders[i]} position={[side * 0.47, 0.9, 0]}>
              <mesh material={m.jacket} castShadow>
                <sphereGeometry args={[0.15, 20, 20]} />
              </mesh>
              <mesh material={m.jacket} position={[0, -0.3, 0]} castShadow>
                <capsuleGeometry args={[0.12, 0.42, 6, 16]} />
              </mesh>
              <group ref={elbows[i]} position={[0, -0.58, 0]}>
                <group ref={forearms[i]}>
                  <mesh material={m.jacket} position={[0, -0.22, 0]} castShadow>
                    <capsuleGeometry args={[0.11, 0.36, 6, 16]} />
                  </mesh>
                  <mesh material={side === -1 ? m.watch : m.jacketTrim} position={[0, -0.46, 0]}>
                    <cylinderGeometry args={[0.1, 0.1, 0.05, 18]} />
                  </mesh>
                  <mesh material={m.skin} position={[0, -0.56, 0]} scale={[0.9, 1.15, 0.7]} castShadow>
                    <sphereGeometry args={[0.095, 18, 18]} />
                  </mesh>
                  <mesh material={m.skin} position={[0, -0.66, 0.005]} scale={[1, 0.8, 0.6]}>
                    <capsuleGeometry args={[0.06, 0.06, 4, 10]} />
                  </mesh>
                  <mesh material={m.skin} position={[side * -0.075, -0.55, 0.03]} rotation={[0, 0, side * 0.6]}>
                    <capsuleGeometry args={[0.026, 0.07, 4, 8]} />
                  </mesh>
                </group>
              </group>
            </group>
          ))}
        </group>

        {/* ================= LAPTOP (hero pose) ================= */}
        <group ref={laptop} position={[0, 1.5, 0.74]} rotation={[0.05, 0, 0]}>
          <RoundedBox args={[0.94, 0.04, 0.6]} radius={0.018} smoothness={3} material={m.metal} castShadow />
          <mesh position={[0, 0.021, 0.04]} rotation={[-Math.PI / 2, 0, 0]} material={m.dark}>
            <planeGeometry args={[0.8, 0.32]} />
          </mesh>
          <group position={[0, 0.02, -0.29]} rotation={[-0.22, 0, 0]}>
            <RoundedBox args={[0.94, 0.6, 0.026]} radius={0.012} smoothness={3} position={[0, 0.3, 0]} material={m.metal} castShadow />
            <mesh position={[0, 0.3, 0.0135]} material={m.dark}>
              <planeGeometry args={[0.9, 0.56]} />
            </mesh>
            <mesh position={[0, 0.305, 0.0145]} material={screenMat}>
              <planeGeometry args={[0.84, 0.5]} />
            </mesh>
            <pointLight ref={screenLight} position={[0, 0.3, -0.25]} color={C.accentBright} intensity={2.2} distance={2.2} decay={2} />
          </group>
        </group>

        {/* ================= HEAD ================= */}
        <mesh material={m.skin} position={[0, 2.26, 0]} castShadow>
          <cylinderGeometry args={[0.115, 0.13, 0.26, 18]} />
        </mesh>

        <group ref={head} position={[0, 2.38, 0]}>
          <group position={[0, 0.4, 0]}>
            <mesh material={m.skin} scale={[1, 1.06, 0.96]} castShadow>
              <sphereGeometry args={[0.5, 48, 48]} />
            </mesh>
            <mesh material={m.skin} position={[0, -0.2, 0.08]} scale={[0.82, 0.62, 0.78]}>
              <sphereGeometry args={[0.42, 32, 32]} />
            </mesh>
            {[-1, 1].map((side) => (
              <mesh key={`ear${side}`} material={m.skinShade} position={[side * 0.49, -0.02, -0.02]} scale={[0.55, 1, 0.8]}>
                <sphereGeometry args={[0.095, 16, 16]} />
              </mesh>
            ))}
            <mesh material={m.skinShade} position={[0, -0.07, 0.47]} scale={[1, 0.9, 0.8]}>
              <sphereGeometry args={[0.055, 16, 16]} />
            </mesh>
            <mesh ref={mouthRef} material={m.mouth} position={[0, -0.2, 0.452]} rotation={[0.25, 0, Math.PI]}>
              <torusGeometry args={[0.085, 0.017, 8, 24, Math.PI]} />
            </mesh>
            {[-1, 1].map((side) => (
              <RoundedBox
                key={`brow${side}`}
                args={[0.16, 0.034, 0.04]}
                radius={0.015}
                smoothness={2}
                position={[side * 0.17, 0.19, 0.44]}
                rotation={[-0.25, side * 0.18, side * -0.1]}
                material={m.hair}
              />
            ))}
            <group ref={eyes} position={[0, 0.05, 0]}>
              {[-1, 1].map((side) => (
                <mesh key={`eye${side}`} material={m.eyeWhite} position={[side * 0.17, 0, 0.42]} scale={[1, 1.12, 0.55]}>
                  <sphereGeometry args={[0.085, 24, 24]} />
                </mesh>
              ))}
              <group ref={pupils}>
                {[-1, 1].map((side) => (
                  <group key={`pupil${side}`} position={[side * 0.17, 0, 0.462]}>
                    <mesh material={m.pupil} scale={[1, 1.1, 0.5]}>
                      <sphereGeometry args={[0.052, 20, 20]} />
                    </mesh>
                    <mesh material={m.glint} position={[0.018, 0.022, 0.024]}>
                      <sphereGeometry args={[0.013, 8, 8]} />
                    </mesh>
                  </group>
                ))}
              </group>
            </group>

            {/* round glasses */}
            {characterConfig.glasses && (
              <group position={[0, 0.05, 0.5]}>
                {[-1, 1].map((side) => (
                  <group key={`lens${side}`} position={[side * 0.175, 0, 0]}>
                    <mesh material={m.frames}>
                      <torusGeometry args={[0.105, 0.012, 10, 40]} />
                    </mesh>
                    <mesh material={m.lens}>
                      <circleGeometry args={[0.1, 32]} />
                    </mesh>
                  </group>
                ))}
                <mesh material={m.frames} position={[0, 0.01, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.01, 0.01, 0.08, 8]} />
                </mesh>
                {[-1, 1].map((side) => (
                  <mesh key={`arm${side}`} material={m.frames} position={[side * 0.385, 0.01, -0.25]} rotation={[0, -side * 0.4, 0]}>
                    <boxGeometry args={[0.015, 0.018, 0.54]} />
                  </mesh>
                ))}
              </group>
            )}

            {/* ============ HAIR — textured modern crop ============ */}
            <mesh material={m.hair} position={[0, 0.04, -0.02]} rotation={[-0.32, 0, 0]} castShadow>
              <sphereGeometry args={[0.525, 40, 40, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            </mesh>
            <mesh material={m.hair} position={[0, 0, -0.01]} scale={[1.02, 1.04, 1]}>
              <sphereGeometry args={[0.515, 40, 40, Math.PI, Math.PI, 0, Math.PI * 0.72]} />
            </mesh>
            {[-1, 1].map((side) => (
              <mesh key={`burn${side}`} material={m.hair} position={[side * 0.47, 0.08, 0.1]} scale={[0.35, 1, 0.8]}>
                <sphereGeometry args={[0.14, 14, 14]} />
              </mesh>
            ))}
            {[
              [0.0, 0.47, 0.22, 0.2, -0.5],
              [-0.18, 0.44, 0.17, 0.17, -0.3],
              [0.19, 0.45, 0.15, 0.17, -0.35],
              [-0.08, 0.52, 0.02, 0.2, -0.2],
              [0.12, 0.5, -0.06, 0.19, -0.1],
              [-0.25, 0.36, 0.05, 0.16, 0],
              [0.27, 0.37, 0.02, 0.15, 0],
              [0.05, 0.44, 0.33, 0.13, -0.8],
            ].map(([x, y, z, r, rx], i) => (
              <mesh key={`tuft${i}`} material={m.hair} position={[x, y, z]} rotation={[rx, i * 0.7, 0]} scale={[1.15, 0.72, 1]} castShadow>
                <sphereGeometry args={[r, 18, 18]} />
              </mesh>
            ))}
          </group>
        </group>
      </group>
    </group>
  );
}

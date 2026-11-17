import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { characterConfig } from './config';
import { characterEvents } from './events';

interface Props {
  url: string;
  interactive: boolean;
  animate: boolean;
  entered: boolean;
}

/**
 * Loads your own .glb character (see src/three/config.ts).
 * Plays an idle clip if the file has one and turns the head bone
 * toward the mouse.
 */
export function GLBCharacter({ url, interactive, animate, entered }: Props) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);
  const { actions, names } = useAnimations(animations, group);
  const headBone = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    headBone.current = scene.getObjectByName(characterConfig.headBone) ?? null;
  }, [scene]);

  useEffect(() => {
    if (!animate || names.length === 0) return;
    const clip = characterConfig.idleClip && actions[characterConfig.idleClip] ? characterConfig.idleClip : names[0];
    actions[clip]?.reset().fadeIn(0.5).play();
    return () => {
      actions[clip]?.fadeOut(0.3);
    };
  }, [actions, names, animate]);

  // play the wave clip (if your model has one) on "Say hi" or click
  const playWave = () => {
    const wave = characterConfig.waveClip && actions[characterConfig.waveClip];
    if (!wave || !animate) return;
    wave.reset().setLoop(THREE.LoopOnce, 1).fadeIn(0.3).play();
    wave.clampWhenFinished = false;
  };
  useEffect(() => {
    const on = () => playWave();
    characterEvents.addEventListener('wave', on);
    return () => characterEvents.removeEventListener('wave', on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, animate]);

  useEffect(() => {
    const g = group.current;
    if (!g) return;
    g.visible = entered;
    if (!entered || !animate) return;
    const tween = gsap.from(g.position, { y: characterConfig.position[1] - 2, duration: 1.8, ease: 'expo.out' });
    return () => {
      tween.kill();
    };
  }, [entered, animate]);

  useFrame((state, delta) => {
    const bone = headBone.current;
    if (!bone || !interactive) return;
    bone.rotation.y = THREE.MathUtils.damp(bone.rotation.y, state.pointer.x * 0.5, 4, delta);
    bone.rotation.x = THREE.MathUtils.damp(bone.rotation.x, -state.pointer.y * 0.25, 4, delta);
  });

  return (
    <group
      ref={group}
      position={characterConfig.position}
      rotation={[0, characterConfig.rotationY, 0]}
      scale={characterConfig.scale}
      dispose={null}
      onClick={(e) => {
        e.stopPropagation();
        playWave();
      }}
    >
      <primitive object={scene} />
    </group>
  );
}

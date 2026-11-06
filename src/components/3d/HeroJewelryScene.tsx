'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export default function HeroJewelryScene() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const gemRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle interactive mouse lag
      const targetX = (state.pointer.x * Math.PI) / 8;
      const targetY = (state.pointer.y * Math.PI) / 8;

      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05 + delta * 0.2;
      groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.05;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.15;
    }

    if (gemRef.current) {
      gemRef.current.rotation.y += delta * 0.4;
      gemRef.current.rotation.x += delta * 0.2;
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.x += delta * 0.25;
    }
  });

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 10, 5]} intensity={2.5} color="#FFF8EE" />
      <directionalLight position={[-10, -5, -5]} intensity={1.0} color="#B89A69" />
      <pointLight position={[0, 0, 4]} intensity={2} color="#FFFFFF" distance={10} />

      <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.8}>
        <group ref={groupRef} position={[0, 0, 0]} scale={1.25}>
          {/* Outer Champagne Gold Ring Band */}
          <mesh ref={ringRef} castShadow receiveShadow>
            <torusGeometry args={[1.5, 0.12, 32, 100]} />
            <meshStandardMaterial
              color="#D4AF37"
              roughness={0.15}
              metalness={0.92}
              envMapIntensity={1.5}
            />
          </mesh>

          {/* Inner Intersecting Rose Gold Orbital Band */}
          <mesh ref={innerRingRef} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
            <torusGeometry args={[1.2, 0.08, 24, 80]} />
            <meshStandardMaterial
              color="#C58F78"
              roughness={0.2}
              metalness={0.88}
            />
          </mesh>

          {/* Central Floating Faceted Gemstone / Celestial Core */}
          <mesh ref={gemRef} position={[0, 0, 0]}>
            <octahedronGeometry args={[0.55, 0]} />
            <meshPhysicalMaterial
              color="#FFFBF2"
              roughness={0.05}
              metalness={0.1}
              transmission={0.85}
              thickness={1.2}
              ior={2.417} // Diamond index of refraction
              reflectivity={0.9}
              clearcoat={1.0}
              clearcoatRoughness={0.1}
            />
          </mesh>

          {/* Accent Gold Bezel Prongs */}
          {[0, 1, 2, 3].map((i) => {
            const angle = (i * Math.PI) / 2;
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * 0.7, Math.sin(angle) * 0.7, 0]}
              >
                <sphereGeometry args={[0.07, 16, 16]} />
                <meshStandardMaterial
                  color="#B89A69"
                  roughness={0.1}
                  metalness={0.95}
                />
              </mesh>
            );
          })}
        </group>
      </Float>

      {/* Floating Gold Stardust Particles */}
      <Sparkles
        count={45}
        scale={6}
        size={2.5}
        speed={0.4}
        opacity={0.6}
        color="#D7C4A5"
      />
    </>
  );
}

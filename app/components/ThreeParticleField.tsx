"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

function Stars() {
  const ref = useRef<THREE.Points>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const positions = useMemo(() => {
    const count = 2000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.random() * 6; // radius
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      pos.set([x, y, z], i * 3);
    }
    return pos;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.x = mouse.y * 0.15 + Math.sin(t * 0.05) * 0.05;
      ref.current.rotation.y = mouse.x * 0.15 + Math.cos(t * 0.05) * 0.05;
    }
  });

  return (
    <group
      onPointerMove={(e) => {
        const x = (e.pointer.x as number) || 0;
        const y = (e.pointer.y as number) || 0;
        setMouse({ x, y });
      }}
    >
      <Points ref={ref} positions={positions} stride={3} frustumCulled>
        <PointMaterial
          transparent
          size={0.02}
          color="#67e8f9"
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function ThreeParticleField() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 5, 15]} />
        <Stars />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />
    </div>
  );
}
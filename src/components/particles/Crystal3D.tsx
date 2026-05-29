"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function CrystalMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      meshRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} scale={1.2}>
        <octahedronGeometry args={[1.2, 0]} />
        <MeshDistortMaterial
          color="#00D4FF"
          emissive="#00F5FF"
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.1}
          distort={0.2}
          speed={2}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh scale={1.35} rotation={[0, Math.PI / 4, 0]}>
        <octahedronGeometry args={[1.2, 0]} />
        <meshBasicMaterial
          color="#6B46C1"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </Float>
  );
}

export default function Crystal3D({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-full min-h-[200px] ${className}`} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#00D4FF" />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#6B46C1" />
        <CrystalMesh />
      </Canvas>
    </div>
  );
}

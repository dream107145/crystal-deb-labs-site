"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT_DESKTOP = 100;
const PARTICLE_COUNT_MOBILE = 50;
const CONNECTION_DISTANCE = 1.8;

function Particles({ count }: { count: number }) {
  const meshRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const targetMouse = useRef({ x: 0, y: 0 });

  const { positions, colors, velocities, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const colorPalette = [
      new THREE.Color("#00D4FF"),
      new THREE.Color("#00F5FF"),
      new THREE.Color("#6B46C1"),
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;

      velocities[i * 3] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.001;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = Math.random() * 0.08 + 0.04;
    }

    return { positions, colors, velocities, sizes };
  }, [count]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      targetMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const pos = meshRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const time = state.clock.elapsedTime;

    mouse.current.x += (targetMouse.current.x - mouse.current.x) * 0.05;
    mouse.current.y += (targetMouse.current.y - mouse.current.y) * 0.05;

    const linePositions: number[] = [];
    const tempPositions: THREE.Vector3[] = [];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let x = pos.array[i3] + velocities[i3];
      let y = pos.array[i3 + 1] + velocities[i3 + 1];
      let z = pos.array[i3 + 2] + velocities[i3 + 2];

      x += Math.sin(time * 0.3 + i) * 0.001 - mouse.current.x * 0.003;
      y += Math.cos(time * 0.2 + i) * 0.001 - mouse.current.y * 0.003;
      z += Math.sin(time * 0.15 + i * 0.5) * 0.0005;

      if (x > 6) x = -6;
      if (x < -6) x = 6;
      if (y > 4) y = -4;
      if (y < -4) y = 4;
      if (z > 3) z = -3;
      if (z < -3) z = 3;

      pos.array[i3] = x;
      pos.array[i3 + 1] = y;
      pos.array[i3 + 2] = z;

      const pulse = 1 + Math.sin(time * 2 + i * 0.5) * 0.15;
      tempPositions.push(new THREE.Vector3(x, y, z));

      const sizeAttr = meshRef.current.geometry.attributes
        .size as THREE.BufferAttribute;
      if (sizeAttr) sizeAttr.array[i] = sizes[i] * pulse;
    }

    pos.needsUpdate = true;
    if (meshRef.current.geometry.attributes.size) {
      (
        meshRef.current.geometry.attributes.size as THREE.BufferAttribute
      ).needsUpdate = true;
    }

    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dist = tempPositions[i].distanceTo(tempPositions[j]);
        if (dist < CONNECTION_DISTANCE) {
          linePositions.push(
            tempPositions[i].x,
            tempPositions[i].y,
            tempPositions[i].z,
            tempPositions[j].x,
            tempPositions[j].y,
            tempPositions[j].z
          );
        }
      }
    }

    if (linesRef.current) {
      const lineGeo = linesRef.current.geometry;
      lineGeo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(linePositions, 3)
      );
      lineGeo.attributes.position.needsUpdate = true;
      linesRef.current.visible = linePositions.length > 0;
    }

    meshRef.current.rotation.y = time * 0.02;
  });

  return (
    <>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={count}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial
          color="#00D4FF"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  );
}

export default function ParticleBackground({
  className = "",
}: {
  className?: string;
}) {
  const [count, setCount] = useState(PARTICLE_COUNT_DESKTOP);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateCount = () => {
      setCount(
        window.innerWidth < 768
          ? PARTICLE_COUNT_MOBILE
          : window.innerWidth < 1024
            ? 75
            : PARTICLE_COUNT_DESKTOP
      );
    };
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  if (!mounted) return <div className={className} aria-hidden />;

  return (
    <div className={`particle-canvas ${className}`} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <Particles count={count} />
      </Canvas>
    </div>
  );
}

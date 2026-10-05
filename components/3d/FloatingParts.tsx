"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

const COLORS = ["#e8590c", "#ffd23f", "#17a566", "#ff9d5c", "#6cf0a8"];

function Chip({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.getElapsedTime() * speed;
    ref.current.rotation.z = state.clock.getElapsedTime() * speed * 0.6;
  });
  return (
    <Float speed={1.5 + speed} floatIntensity={0.6} rotationIntensity={0.4}>
      <mesh ref={ref} position={position}>
        <boxGeometry args={[0.35, 0.08, 0.22]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
      </mesh>
    </Float>
  );
}

function Screw({ position, speed }: { position: [number, number, number]; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.getElapsedTime() * speed;
  });
  return (
    <Float speed={2} floatIntensity={0.8}>
      <mesh ref={ref} position={position}>
        <cylinderGeometry args={[0.06, 0.06, 0.18, 12]} />
        <meshStandardMaterial color="#9aaac0" metalness={0.9} roughness={0.2} />
      </mesh>
    </Float>
  );
}

function Gear({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.getElapsedTime() * speed;
  });
  return (
    <Float speed={1.2} floatIntensity={0.5}>
      <mesh ref={ref} position={position}>
        <torusGeometry args={[0.18, 0.05, 8, 16]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
    </Float>
  );
}

export default function FloatingParts() {
  const parts = useMemo(
    () => [
      { type: "chip" as const, pos: [-2.2, 1.1, 0.4] as [number, number, number], color: COLORS[0], speed: 0.8 },
      { type: "chip" as const, pos: [2.0, 0.6, -0.5] as [number, number, number], color: COLORS[1], speed: 1.1 },
      { type: "chip" as const, pos: [-1.6, -0.8, 0.8] as [number, number, number], color: COLORS[2], speed: 0.6 },
      { type: "screw" as const, pos: [1.8, 1.4, 0.6] as [number, number, number], speed: 1.4 },
      { type: "screw" as const, pos: [-2.0, 0.2, -0.7] as [number, number, number], speed: 0.9 },
      { type: "gear" as const, pos: [2.3, -0.5, 0.3] as [number, number, number], color: COLORS[3], speed: 1.2 },
      { type: "gear" as const, pos: [-1.3, 1.5, -0.4] as [number, number, number], color: COLORS[4], speed: 0.7 },
      { type: "chip" as const, pos: [0.8, -1.2, 0.9] as [number, number, number], color: COLORS[0], speed: 1.0 },
    ],
    []
  );

  return (
    <group>
      {parts.map((p, i) => {
        if (p.type === "chip") return <Chip key={i} position={p.pos} color={p.color} speed={p.speed} />;
        if (p.type === "screw") return <Screw key={i} position={p.pos} speed={p.speed} />;
        return <Gear key={i} position={p.pos} color={p.color!} speed={p.speed} />;
      })}
    </group>
  );
}
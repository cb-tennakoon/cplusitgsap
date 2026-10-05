"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";

export default function Laptop3D({ scale = 1 }: { scale?: number }) {
  const root = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const screenMat = useRef<THREE.MeshStandardMaterial>(null);

  // GSAP — lid opens smoothly
  useEffect(() => {
    if (!lid.current) return;
    lid.current.rotation.x = 0.05; // almost closed
    gsap.to(lid.current.rotation, {
      x: -1.2,
      duration: 2,
      ease: "power3.inOut",
      delay: 0.5,
    });
    if (screenMat.current) {
      gsap.fromTo(
        screenMat.current,
        { emissiveIntensity: 0 },
        { emissiveIntensity: 0.4, duration: 1.4, delay: 1.4 }
      );
    }
  }, []);

  // Soft idle motion
  useFrame((state) => {
    if (!root.current) return;
    const t = state.clock.getElapsedTime();
    root.current.rotation.y = Math.sin(t * 0.25) * 0.12;
    root.current.position.y = Math.sin(t * 0.4) * 0.03;
  });

  const bodyColor = "#c0c0c5";   // silver
  const darkColor = "#1a1a1c";   // dark grey
  const screenColor = "#0b1220";

  return (
    <group ref={root} scale={scale} position={[0, -0.5, 0]}>
      {/* ========== BASE ========== */}
      <RoundedBox args={[3.2, 0.09, 2.2]} radius={0.08} smoothness={16} position={[0, 0, 0]}>
        <meshStandardMaterial color={bodyColor} metalness={0.9} roughness={0.2} />
      </RoundedBox>

      {/* Keyboard deck */}
      <RoundedBox args={[2.9, 0.02, 1.05]} radius={0.02} position={[0, 0.055, -0.35]}>
        <meshStandardMaterial color={darkColor} metalness={0.5} roughness={0.45} />
      </RoundedBox>

      {/* Trackpad */}
      <RoundedBox args={[1.15, 0.018, 0.75]} radius={0.04} position={[0, 0.06, 0.55]}>
        <meshStandardMaterial color="#a8a8ae" metalness={0.7} roughness={0.3} />
      </RoundedBox>

      {/* ========== LID ========== */}
      <group ref={lid} position={[0, 0.05, -1.08]}>
        {/* Outer lid (silver) */}
        <RoundedBox args={[3.2, 2.1, 0.07]} radius={0.08} smoothness={16} position={[0, 1.05, 0]}>
          <meshStandardMaterial color={bodyColor} metalness={0.9} roughness={0.2} />
        </RoundedBox>

        {/* Inner bezel (black) */}
        <RoundedBox args={[3.0, 1.95, 0.025]} radius={0.04} position={[0, 1.05, 0.04]}>
          <meshStandardMaterial color="#0d0d0d" metalness={0.3} roughness={0.6} />
        </RoundedBox>

        {/* Display */}
        <mesh position={[0, 1.05, 0.055]}>
          <planeGeometry args={[2.85, 1.8]} />
          <meshStandardMaterial
            ref={screenMat}
            color={screenColor}
            emissive="#e8590c"
            emissiveIntensity={0}
            roughness={0.8}
            metalness={0.05}
          />
        </mesh>

        {/* Simple clean UI on screen */}
        <mesh position={[0, 1.55, 0.06]}>
          <planeGeometry args={[1.2, 0.08]} />
          <meshBasicMaterial color="#ff9d5c" transparent opacity={0.85} />
        </mesh>
        <mesh position={[0, 1.35, 0.06]}>
          <planeGeometry args={[1.6, 0.05]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
        </mesh>
        <mesh position={[0, 1.15, 0.06]}>
          <planeGeometry args={[1.4, 0.05]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
        </mesh>

        {/* Webcam */}
        <mesh position={[0, 1.95, 0.06]}>
          <circleGeometry args={[0.03, 20]} />
          <meshStandardMaterial color="#111" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>
    </group>
  );
}
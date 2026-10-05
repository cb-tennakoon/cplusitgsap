"use client";

import { Environment, ContactShadows, OrbitControls } from "@react-three/drei";
import Canvas3D from "./Canvas3D";
import Laptop3D from "./Laptop3D";
import FloatingParts from "./FloatingParts";

type Hero3DProps = {
  className?: string;
  interactive?: boolean;
  height?: string | number;
};

export default function Hero3D({ className, interactive = false, height = "100%" }: Hero3DProps) {
  return (
    <Canvas3D className={className} style={{ height }}>
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 8, 4]} intensity={1.2} castShadow />
      <pointLight position={[-4, 3, -2]} intensity={0.6} color="#ff9d5c" />
      <pointLight position={[3, -1, 3]} intensity={0.4} color="#6cf0a8" />

      <Laptop3D scale={1.15} />
      <FloatingParts />

      <ContactShadows position={[0, -1.6, 0]} opacity={0.45} scale={12} blur={2.5} far={4} />
      <Environment preset="city" />

      {interactive && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate
          autoRotateSpeed={0.6}
        />
      )}
    </Canvas3D>
  );
}
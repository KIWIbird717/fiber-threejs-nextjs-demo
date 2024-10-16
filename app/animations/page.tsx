"use client";

import { Box } from "@/shared/geometry/Box";
import { Canvas } from "@/shared/geometry/Canvas";
import { useFrame } from "@react-three/fiber";
import React, { FC, useRef } from "react";
import { Color, Mesh, ShaderMaterial, Uniform, Vector2 } from "three";
import vertexShader from "@/public/shaders/dither/vertex.glsl";
import fragmentShader from "@/public/shaders/dither/fragment.glsl";

export default function AnimationsPage() {
  return (
    <main className="h-screen w-screen">
      <Canvas grid gizmoHelper orbitControls stats>
        <Scene />
      </Canvas>
    </main>
  );
}

const RADIUS = 1;

const Scene: FC = () => {
  const boxRef = useRef<Mesh | null>(null);

  useFrame((state, delta) => {
    if (!boxRef?.current?.rotation) return;

    // поворот вокруг оси
    boxRef.current.rotation.y -= delta * 1;

    // анимация вращения по кругу
    const x = RADIUS * Math.cos(state.clock.elapsedTime);
    const z = RADIUS * Math.sin(state.clock.elapsedTime);
    boxRef.current.position.set(x, 0, z);
  });

  return (
    <>
      <ambientLight />
      <directionalLight />
      <Box ref={boxRef}>
        <DitherShader />
      </Box>
    </>
  );
};

export const sinPalette = {
  c0: new Color(0x404040),
  c1: new Color(0xcef316),
  c2: new Color(0x815903),
  c3: new Color(0xae00ff),
};
const DitherShader: FC = () => {
  const materialRef = useRef<ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime() * 1000;
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      transparent
      depthWrite={false}
      depthTest={false}
      uniforms={{
        uResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
        uTime: new Uniform(0),
        uVisibility: { value: 1 },
        uMouseSize: { value: 0 },
        uAspect: { value: new Vector2(1, 1) },
        c0: { value: sinPalette.c0 },
        c1: { value: sinPalette.c1 },
        c2: { value: sinPalette.c2 },
        c3: { value: sinPalette.c3 },
      }}
    />
  );
};

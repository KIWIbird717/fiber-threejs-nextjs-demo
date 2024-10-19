"use client";

import { Box } from "@/shared/geometry/Box";
import { Canvas } from "@/shared/geometry/Canvas";
import {
  AccumulativeShadows,
  AsciiRenderer,
  Caustics,
  Edges,
  Environment,
  MeshDiscardMaterial,
  MeshDistortMaterial,
  MeshReflectorMaterial,
  MeshTransmissionMaterial,
  MeshWobbleMaterial,
  RandomizedLight,
} from "@react-three/drei";
import { Color, Euler, ThreeElements, Vector3 } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import React, { FC, useState } from "react";
import { AsciiEffect } from "three/examples/jsm/Addons.js";

export default function EventsPage() {
  return (
    <main className="h-screen w-screen">
      <Canvas shadows grid={false} gizmoHelper orbitControls stats>
        <Scene />
      </Canvas>
    </main>
  );
}

const Scene: FC = () => {
  return (
    <>
      <color attach="background" args={["#f0f0f0"]} />
      <spotLight decay={0} position={[5, 5, -10]} angle={0.15} penumbra={1} />
      <ambientLight intensity={0.5 * Math.PI} />
      <pointLight decay={0} position={[-10, -10, -10]} />

      <GlassSphere />
      <DynamicSphere />
      <Plane position={[0, -0.501, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Plane position={[0, 2, -2.5]} />
      <Plane position={[2.5, 2, 0]} rotation={[0, -Math.PI / 2, 0]} color={"red"} />
      <Plane position={[-2.5, 2, 0]} rotation={[0, Math.PI / 2, 0]} color={"blue"} />
      <Plane position={[0, 4.5, 0]} rotation={[Math.PI / 2, 0, 0]} color={"white"} />

      {/* <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr" /> */}
      <AccumulativeShadows
        temporal
        frames={100}
        color="hotpink"
        colorBlend={2}
        toneMapped={true}
        alphaTest={0.7}
        opacity={1}
        scale={12}
        position={[0, -0.5, 0]}
      >
        <RandomizedLight amount={8} radius={10} ambient={0.5} position={[5, 5, -10]} bias={0.001} />
      </AccumulativeShadows>
      {/* <EffectComposer>
        <Bloom luminanceThreshold={1} intensity={2} levels={9} mipmapBlur />
      </EffectComposer> */}
    </>
  );
};

const GlassSphere: FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerEnter: ThreeElements["mesh"]["onPointerEnter"] = (event) => {
    event.stopPropagation();
    setIsHovered(true);
  };

  const handlePointerLeave: ThreeElements["mesh"]["onPointerLeave"] = () => {
    setIsHovered(false);
  };

  return (
    <Caustics
      color={isHovered ? "magenta" : "hotpink"}
      position={[0, -0.5, 0]}
      lightSource={[5, 5, -10]}
      worldRadius={0.01}
      ior={1.2}
      intensity={0.005}
      causticsOnly={false}
      backside={false}
    >
      <mesh
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        castShadow
        receiveShadow
        position={[0, 0.5, 0]}
        scale={0.5}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial
          resolution={1024}
          distortion={0.25}
          color={isHovered ? "magenta" : "hotpink"}
          thickness={1}
          anisotropy={1}
        />
      </mesh>
    </Caustics>
  );
};

const DynamicSphere: FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerEnter: ThreeElements["mesh"]["onPointerEnter"] = (event) => {
    event.stopPropagation();
    setIsHovered(true);
  };

  const handlePointerLeave: ThreeElements["mesh"]["onPointerLeave"] = () => {
    setIsHovered(false);
  };

  return (
    <mesh
      castShadow
      receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      position={[-1.2, 0.25, -1]}
      scale={0.75}
    >
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial color={isHovered ? "purple" : "hotpink"} />
    </mesh>
  );
};

type PlaneProps = {
  position?: Vector3;
  rotation?: Euler;
  color?: Color;
};
const Plane: FC<PlaneProps> = (props) => {
  return (
    <mesh castShadow receiveShadow position={props.position} rotation={props.rotation}>
      <planeGeometry args={[5, 5]} />
      <meshStandardMaterial color={props.color} />
    </mesh>
  );
};

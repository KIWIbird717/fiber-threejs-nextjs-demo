"use client";

import { Canvas } from "@/shared/geometry/Canvas";
import { Color, useFrame, Vector3 } from "@react-three/fiber";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import React, { FC, useMemo, useReducer, useRef } from "react";
import {
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  Vector3 as ThreeVector3,
} from "three";
import { easing } from "maath";
import { Environment, Lightformer } from "@react-three/drei";

const accents = ["#4060ff", "#20ffa0", "#ff4060", "#ffcc00"] as const;
const shuffle = (accent = 0) => [
  { color: "#444", roughness: 0.1 },
  { color: "#444", roughness: 0.75 },
  { color: "#444", roughness: 0.75 },
  { color: "white", roughness: 0.1 },
  { color: "white", roughness: 0.75 },
  { color: "white", roughness: 0.1 },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: accents[accent], roughness: 0.75, accent: true },
  { color: accents[accent], roughness: 0.1, accent: true },
];

export default function Page() {
  const [accent, click] = useReducer((state) => ++state % accents.length, 0);

  return (
    <main className="h-screen w-screen">
      <Canvas onClick={click} grid={false} gizmoHelper={false} orbitControls={false} stats>
        <Scene accent={accent} />
      </Canvas>
    </main>
  );
}

type SceneProps = {
  accent: number;
};
const Scene: FC<SceneProps> = (props) => {
  const connectors = useMemo(() => shuffle(props.accent), [props.accent]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <Physics debug={false} gravity={[0, 0, 0]}>
        <Pointer />
        {connectors.map((props, i) => (
          <Connector key={i} {...props} />
        ))}
      </Physics>

      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer
            form="circle"
            intensity={4}
            rotation-x={Math.PI / 2}
            position={[0, 5, -9]}
            scale={2}
          />
          <Lightformer
            form="circle"
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-5, 1, -1]}
            scale={2}
          />
          <Lightformer
            form="circle"
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-5, -1, -1]}
            scale={2}
          />
          <Lightformer
            form="circle"
            intensity={2}
            rotation-y={-Math.PI / 2}
            position={[10, 1, 0]}
            scale={8}
          />
        </group>
      </Environment>
    </>
  );
};

const Pointer: FC = () => {
  const ref = useRef<RapierRigidBody>(null);
  useFrame(({ mouse, viewport }) => {
    if (!ref.current) return;
    ref.current?.setNextKinematicTranslation(
      new ThreeVector3().set((mouse.x * viewport.width) / 2, (mouse.y * viewport.height) / 2, 0),
    );
  });
  return (
    <RigidBody position={[0, 0, 0]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[1]} />
    </RigidBody>
  );
};

type ConnectorProps = {
  position?: Vector3;
  accent?: boolean;
  color?: Color;
};
const Connector: FC<ConnectorProps> = (props) => {
  const r = MathUtils.randFloatSpread;
  const vec = new ThreeVector3();

  const api = useRef<RapierRigidBody>(null);
  const pos = useMemo(() => props.position || ([r(10), r(10), r(10)] as Vector3), []);

  useFrame(() => {
    if (!api.current) return;
    api.current?.applyImpulse(
      vec.copy(api.current.translation()).negate().multiplyScalar(0.2),
      false,
    );
  });

  return (
    <RigidBody
      linearDamping={4}
      angularDamping={1}
      friction={0.1}
      position={pos}
      ref={api}
      colliders={false}
    >
      <CuboidCollider args={[0.38, 1.27, 0.38]} />
      <CuboidCollider args={[1.27, 0.38, 0.38]} />
      <CuboidCollider args={[0.38, 0.38, 1.27]} />
      <Box color={props.color} />
      {props.accent && <pointLight intensity={4} distance={2.5} color={props.color} />}
    </RigidBody>
  );
};

type BoxProps = {
  color?: Color;
};
const Box: FC<BoxProps> = (props) => {
  const ref = useRef<Mesh<SphereGeometry, MeshStandardMaterial>>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    easing.dampC(ref.current.material.color, props.color || "white", 0.2, delta);
  });

  return (
    <mesh ref={ref} castShadow receiveShadow scale={10}>
      <meshStandardMaterial color={props.color} />
      <sphereGeometry args={[0.1, 5, 5]} />
    </mesh>
  );
};

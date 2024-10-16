"use client";

import {
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
  Stats,
  TransformControls,
} from "@react-three/drei";
import {
  Canvas,
  Color,
  DirectionalLightProps as FiberDirectionalLightProps,
  Vector3,
} from "@react-three/fiber";
import { useControls } from "leva";
import { FC } from "react";

const editorConfig = {
  orbitControls: true,
  stats: true,
  gizmoHelper: true,
  grid: true,
};

export default function BasicsPage() {
  return (
    <main className="h-screen w-screen">
      <Canvas className="h-full w-full">
        {/** Tools */}
        <OrbitControls enabled={editorConfig.orbitControls} />
        {editorConfig.stats && <Stats className="translate-x-6 translate-y-14 scale-150" />}
        {editorConfig.gizmoHelper && (
          <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport axisColors={["red", "green", "blue"]} labelColor="black" />
          </GizmoHelper>
        )}
        {editorConfig.grid && <Grid args={[10, 10]} />}

        {/** Scene */}
        <BoxScene />
      </Canvas>
    </main>
  );
}

/**
 * Сцена целиком
 */
const BoxScene: FC = () => {
  const { position, color } = useControls("Box 1", {
    position: { value: [0, 0, 0], step: 0.01 },
    color: { value: "lime" },
  });

  const {
    position: dirLightPosition,
    color: dirLightColor,
    intensity: dirLightIntensity,
  } = useControls("Directional light", {
    position: { value: [4, 3, -1], step: 0.1 },
    color: { value: "magenta" },
    intensity: { value: 5, step: 0.01 },
  });

  return (
    <>
      <DirectionalLight
        position={dirLightPosition}
        intensity={dirLightIntensity}
        color={dirLightColor}
        castShadow={true}
      />
      <ambientLight intensity={0.2} />

      <BoxGeometry position={position} color={color} />
      {/** move all meshes at once */}
      <group position={[0, -1, 1]}>
        <BoxGeometry position={[0, 1, 0]} color={"blue"} />
        <BoxGeometry position={[0, 0, 1]} color={"yellow"} />
      </group>

      {/** plane */}
      <PlaneGeometry withTransformControls />
    </>
  );
};

type BoxGeometryProps = {
  position?: Vector3;
  color?: Color;
  /**
   * for debug
   */
  withTransformControls?: boolean;
};
/**
 * Фигура отдельно
 */
const BoxGeometry: FC<BoxGeometryProps> = (props) => {
  const Geometry = (
    <mesh position={props.position}>
      <meshStandardMaterial color={props.color} />
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  );

  if (props.withTransformControls) {
    return <TransformControls>{Geometry}</TransformControls>;
  }

  return Geometry;
};

type PlaneGeometryProps = {
  withTransformControls?: boolean;
};
const PlaneGeometry: FC<PlaneGeometryProps> = (props) => {
  const Geometry = (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <shadowMaterial opacity={0.3} />
      <meshStandardMaterial color={"white"} />
      <planeGeometry args={[10, 10]} />
    </mesh>
  );

  if (props.withTransformControls) {
    return <TransformControls>{Geometry}</TransformControls>;
  }

  return Geometry;
};

type DirectionalLightProps = {
  withTransformControls?: boolean;
} & FiberDirectionalLightProps;
const DirectionalLight: FC<DirectionalLightProps> = (props) => {
  const Geometry = <directionalLight {...props} />;

  if (props.withTransformControls) {
    return <TransformControls>{Geometry}</TransformControls>;
  }

  return Geometry;
};

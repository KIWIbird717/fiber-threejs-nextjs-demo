"use client";

import { TransformControls } from "@react-three/drei";
import { Color, Vector3 } from "@react-three/fiber";
import { forwardRef, ReactNode } from "react";
import { Mesh } from "three";

export type BoxProps = {
  position?: Vector3;
  color?: Color;
  /**
   * for debug
   */
  withTransformControls?: boolean;
  children?: ReactNode;
};

/**
 * Фигура отдельно
 */
export const Box = forwardRef<Mesh, BoxProps>((props, ref) => {
  const Geometry = (
    <mesh ref={ref} position={props.position}>
      <meshStandardMaterial color={props.color} />
      <boxGeometry args={[1, 1, 1]} />
      {props.children}
    </mesh>
  );

  if (props.withTransformControls) {
    return <TransformControls>{Geometry}</TransformControls>;
  }

  return Geometry;
});

Box.displayName = "Box";

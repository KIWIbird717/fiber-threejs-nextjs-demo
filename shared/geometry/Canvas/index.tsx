"use client";

import { cn } from "@/shared/utils/cn";
import { GizmoHelper, GizmoViewport, Grid, OrbitControls, Stats } from "@react-three/drei";
import { Canvas as FiberCanavas, Props as FiberCanvasProps } from "@react-three/fiber";
import { FC, forwardRef, ReactNode } from "react";

export type CanvasProps = {
  children: ReactNode;
  className?: string;
  orbitControls?: boolean;
  stats?: boolean;
  gizmoHelper?: boolean;
  grid?: boolean;
} & FiberCanvasProps;
export const Canvas: FC<CanvasProps> = forwardRef<HTMLCanvasElement, CanvasProps>(
  ({ className, children, orbitControls, stats, gizmoHelper, grid, ...props }, ref) => {
    return (
      <FiberCanavas ref={ref} {...props} className={cn("", className)}>
        {/** Tools */}
        <OrbitControls enabled={Boolean(orbitControls)} />
        {stats && <Stats className="translate-x-6 translate-y-14 scale-150" />}
        {gizmoHelper && (
          <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport axisColors={["red", "green", "blue"]} labelColor="black" />
          </GizmoHelper>
        )}
        {grid && <Grid args={[10, 10]} />}

        {/** Scene */}
        {children}
      </FiberCanavas>
    );
  },
);

Canvas.displayName = "Canvas";

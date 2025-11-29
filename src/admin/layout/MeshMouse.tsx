import React from "react";
import { useModel } from "../context/useModel";
import type { ThreeEvent } from "@react-three/fiber";
import DraggingEvent from "./DraggingEvent";

interface DataTypeProps {
  children: React.ReactNode;
}
const MeshMouse = ({ children }: DataTypeProps) => {
  const { mousePositionRef, offsetRef } = useModel();
  const handleMouseMove = (e: ThreeEvent<PointerEvent>) => {
    if (mousePositionRef) {
      mousePositionRef.current = e.point;
    }
    if (offsetRef) {
      offsetRef.current = {
        offsetX: e.offsetX,
        offsetY: e.offsetY,
      };
    }
  };

  return (
    <mesh onPointerMove={(e) => handleMouseMove(e)}>
      {children}
      <DraggingEvent />
    </mesh>
  );
};

export default MeshMouse;

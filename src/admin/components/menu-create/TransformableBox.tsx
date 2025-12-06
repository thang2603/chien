import { Box, TransformControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { ModelType } from "../../types/model";
import cloneDeep from "lodash.clonedeep";
import { useModel } from "../../context/useModel";
type ModeType = "translate" | "scale" | "rotate" | undefined;
const TransformableBox = () => {
  const { listInstances, setSelectMultiple, isSelectMultiple } = useModel();
  const boxRef = useRef<any>(null);
  const transformRef = useRef<any>(null);
  const [mode, setMode] = useState<ModeType>("translate");
  const [boxVisible, setBoxVisible] = useState<boolean>(false);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "b") {
        setBoxVisible((pre) => !pre);
        isSelectMultiple.current = !isSelectMultiple.current;
      }
      if (!boxVisible) return;
      switch (e.key.toLowerCase()) {
        case "w":
          setMode("translate");
          break;
        case "e":
          setMode("rotate");
          break;
        case "r":
          setMode("scale");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [boxVisible, isSelectMultiple]);

  const handleMouseUp = () => {
    const box = boxRef.current;
    if (!box) return;
    let data: ModelType[] = [];
    Object.values(listInstances).forEach((instance) => {
      data = [...data, ...cloneDeep(instance.data)];
    });

    const boxGeometry = new THREE.Box3().setFromObject(box);
    const inside = data.filter((model) => {
      const modelPos = new THREE.Vector3(
        model.position.x,
        model.position.y,
        model.position.z
      );
      return boxGeometry.containsPoint(modelPos);
    });
    setSelectMultiple(cloneDeep(inside));
  };
  return (
    boxVisible && (
      <TransformControls
        ref={transformRef}
        mode={mode}
        onMouseUp={() => handleMouseUp()}
      >
        <Box ref={boxRef} args={[2, 2, 2]}>
          <meshBasicMaterial color="cyan" opacity={0.5} transparent />
        </Box>
      </TransformControls>
    )
  );
};

export default TransformableBox;

import { Canvas } from "@react-three/fiber";

import { OrbitControls, Stats } from "@react-three/drei";
import MeshMouse from "./MeshMouse";
import { useModel } from "../context/useModel";
import InstanceModel from "../components/instance-model";
import type { ClipboardEvent, KeyboardEvent, MouseEvent } from "react";
import type { InstanceModelType, ModelType } from "../types/model";
import {
  convertMousePosition,
  getDeltaPosition,
  pasteFromClipboard,
} from "../utils/layout";
import { handleAddListModel } from "../context/utils";
import { v4 as uuidv4 } from "uuid";
import cloneDeep from "lodash.clonedeep";

const CanvasLayout = () => {
  const {
    listInstances,
    draggingRef,
    mousePositionRef,
    direction,
    selectedInstanceRef,
    setListInstances,
  } = useModel();

  const handlePaste = async (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const text = await pasteFromClipboard();
    if (text) {
      const originalPosition = text[text.length - 1].position;
      const mousePos = convertMousePosition(
        mousePositionRef.current,
        direction
      );
      const deltaPosition = getDeltaPosition(mousePos, originalPosition);
      const models: ModelType[] = [];
      text.forEach((model: ModelType) => {
        const newModel: ModelType = {
          ...model,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 0,
          position: {
            x: model.position.x + deltaPosition.x,
            y: model.position.y + deltaPosition.y,
            z: model.position.z + deltaPosition.z,
          },
        };
        models.push(newModel);
      });
      console.log("Pasted models:", models);
      const newInstances: Record<string, InstanceModelType> =
        handleAddListModel(models, listInstances);
      console.log("New instances after paste:", newInstances);
      setListInstances(cloneDeep(newInstances));
    }
  };

  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 60 }}
      onPasteCapture={(event) => handlePaste(event)}
      tabIndex={-1}
    >
      <MeshMouse>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        {Object.entries(listInstances || {}).map(([modelName, instance]) => (
          <InstanceModel key={modelName} instance={instance} />
        ))}
        <OrbitControls makeDefault enabled={true} />
        <gridHelper args={[30, 30]} />
        <axesHelper args={[100]} />
      </MeshMouse>
      <Stats />
    </Canvas>
  );
};

export default CanvasLayout;

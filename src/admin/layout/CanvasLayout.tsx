import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import MeshMouse from "./MeshMouse";
import { useModel } from "../context/useModel";
import InstanceModel from "../components/instance-model";
import type { ClipboardEvent, KeyboardEvent } from "react";
import type { InstanceModelType, ModelType } from "../types/model";
import {
  convertMousePosition,
  copyToClipboard,
  getDeltaPosition,
  pasteFromClipboard,
} from "../utils/layout";
import { handleAddListModel, handleDeleteListModel } from "../context/utils";
import { v4 as uuidv4 } from "uuid";
import cloneDeep from "lodash.clonedeep";

const CanvasLayout = () => {
  const {
    listInstances,
    draggingRef,
    mousePositionRef,
    selectMultiple,
    direction,
    setListInstances,
    setSelectMultiple,
  } = useModel();

  const handlePaste = async (event: ClipboardEvent<HTMLDivElement>) => {
    console.log(1);
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

      setListInstances(cloneDeep(newInstances));
    }
  };

  const handleCopyData = async () => {
    if (draggingRef.current) return;
    await copyToClipboard(selectMultiple);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (draggingRef.current) return;
    if (e.key === "Delete" || e.key === "Backspace") {
      e.stopPropagation();
      e.preventDefault();
      const newInstances = handleDeleteListModel(selectMultiple, listInstances);
      setListInstances(cloneDeep(newInstances));
      setSelectMultiple([]);
      return;
    }
    if (e.key === "Escape") {
      e.stopPropagation();
      e.preventDefault();
      setSelectMultiple([]);
      return;
    }
  };

  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 60 }}
      onPaste={(event) => handlePaste(event)}
      onCopy={handleCopyData}
      tabIndex={-1}
      onKeyDown={(e) => handleKeyDown(e)}
    >
      <MeshMouse>
        <ambientLight intensity={1.5} />

        <pointLight position={[-10, -10, -10]} intensity={1.5} />
        {Object.entries(listInstances || {}).map(([modelName, instance]) => (
          <InstanceModel key={modelName} instance={instance} />
        ))}
        <OrbitControls makeDefault enabled={true} />
        <gridHelper args={[100, 100, 100]} />
        <axesHelper args={[100]} />
      </MeshMouse>
      <Stats />
    </Canvas>
  );
};

export default CanvasLayout;

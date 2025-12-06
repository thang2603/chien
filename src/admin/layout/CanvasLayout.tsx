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
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import TransformableBox from "../components/menu-create/TransformableBox";
import { toast } from "sonner";
import { INIT_POSITION } from "../constants/layout";

const CanvasLayout = () => {
  const {
    listInstances,
    draggingRef,
    mousePositionRef,
    selectMultiple,
    direction,
    setListInstances,
    setSelectMultiple,
    groupRef,
  } = useModel();

  const handlePaste = async (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const text = await pasteFromClipboard();
    if (text) {
      const originalPosition = INIT_POSITION;
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

      setSelectMultiple(cloneDeep(models));
      const newInstances: Record<string, InstanceModelType> =
        handleAddListModel(models, listInstances);
      setListInstances(cloneDeep(newInstances));
      models.forEach((model) => {
        if (groupRef.current) {
          groupRef.current.set(model.id, cloneDeep(models));
        }
      });
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
    if (e.ctrlKey && e.key.toUpperCase() === "Q") {
      e.stopPropagation();
      e.preventDefault();

      const isGroup = selectMultiple.some((item) =>
        groupRef.current.has(item.id)
      );
      if (isGroup) {
        selectMultiple.forEach((item) => {
          groupRef.current.delete(item.id);
        });
        toast.success("Ungroup");
        return;
      }
      selectMultiple.forEach((item) => {
        groupRef.current.set(item.id, cloneDeep(selectMultiple));
      });
      toast.success("Group");

      return;
    }
  };

  return (
    <Canvas
      camera={{ position: [0, 15, 15], fov: 60 }}
      onPaste={(event) => handlePaste(event)}
      onCopy={handleCopyData}
      tabIndex={-1}
      onKeyDown={(e) => handleKeyDown(e)}
      gl={{
        outputColorSpace: SRGBColorSpace,
        toneMapping: ACESFilmicToneMapping,
      }}
    >
      <MeshMouse>
        <ambientLight intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={1.5} />
        {Object.entries(listInstances || {}).map(([modelName, instance]) => (
          <InstanceModel key={modelName} instance={instance} />
        ))}
        <OrbitControls makeDefault />
        <gridHelper args={[100, 100, 100]} position={[8, -1, 0]} />
        <axesHelper args={[100]} />
        <TransformableBox />
      </MeshMouse>
      <Stats />
    </Canvas>
  );
};

export default CanvasLayout;

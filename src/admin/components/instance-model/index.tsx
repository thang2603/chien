import { useEffect, useMemo, useRef } from "react";
import type { InstanceModelType, ModelType } from "../../types/model";
import * as THREE from "three";
import { useModel } from "../../context/useModel";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import cloneDeep from "lodash.clonedeep";
import { convertNumber, getDeltaPosition } from "../../utils/layout";
import useMousePosition from "../../context/useMousePosition";
import { useGLTF } from "@react-three/drei";

interface DataTypeProps {
  instance: InstanceModelType;
}
const InstanceModel = ({ instance }: DataTypeProps) => {
  const {
    draggingRef,
    selectedInstanceRef,
    offsetRef,
    selectMultiple,
    groupRef,
    setSelectMultiple,
  } = useModel();
  const getMousePosition = useMousePosition();
  const { data, url } = instance;
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);
  const mapSelect = useRef<Map<string, ModelType>>(new Map());

  const { nodes } = useGLTF(url);
  const model = useMemo(() => {
    let val: any = null;
    if (nodes) {
      const tempValue: any = { ...nodes };
      Object.keys(nodes as any).forEach((key) => {
        if (key !== "Scene") {
          val = {
            material: tempValue?.[key]?.material as any,
            geometry: tempValue?.[key]?.geometry as any,
          };
        }
      });
    }
    return val;
  }, [nodes]);
  console.log(nodes);

  useEffect(() => {
    if (!meshRef.current) return;
    if (draggingRef.current) return;
    mapSelect.current.clear();
    selectMultiple.forEach((model) => {
      mapSelect.current.set(model.id, model);
    });
    selectedInstanceRef.current = cloneDeep(selectMultiple);
    for (let i = 0; i < data.length; i++) {
      const item = cloneDeep(data[i]);
      const { position, rotation, scale, color, id } = item;
      const isSelected = mapSelect.current.has(id);
      if (isSelected) {
        tempColor.set("#ff0000"); // Highlight selected instances in red
      } else {
        tempColor.set(color);
      }

      tempObject.position.set(position.x, position.y, position.z);
      tempObject.rotation.set(
        THREE.MathUtils.degToRad(rotation.x),
        THREE.MathUtils.degToRad(rotation.y),
        THREE.MathUtils.degToRad(rotation.z)
      );
      tempObject.scale.set(scale.x, scale.y, scale.z);
      meshRef.current.setColorAt(i, tempColor);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
    meshRef.current.computeBoundingBox();
    meshRef.current.computeBoundingSphere();
  }, [
    data,
    selectMultiple,
    tempObject,
    tempColor,
    draggingRef,
    selectedInstanceRef,
  ]);

  useFrame(() => {
    if (!meshRef.current) return;
    if (!draggingRef.current) return;
    const { offsetX, offsetY } = offsetRef.current;
    const mousePos = getMousePosition(offsetX, offsetY);
    const deltaPosition = getDeltaPosition(mousePos, draggingRef.current);
    mapSelect.current.clear();
    selectedInstanceRef.current.forEach((model) => {
      mapSelect.current.set(model.id, model);
    });
    for (let i = 0; i < data.length; i++) {
      const item = cloneDeep(data[i]);
      const isSelected = mapSelect.current.has(item.id);
      if (isSelected) {
        const { position, rotation, scale, id } = item;
        const newPosition = {
          x: convertNumber(position.x + deltaPosition.x),
          y: convertNumber(position.y + deltaPosition.y),
          z: convertNumber(position.z + deltaPosition.z),
        };
        tempObject.position.set(
          convertNumber(newPosition.x),
          convertNumber(newPosition.y),
          convertNumber(newPosition.z)
        );
        tempObject.rotation.set(
          THREE.MathUtils.degToRad(rotation.x),
          THREE.MathUtils.degToRad(rotation.y),
          THREE.MathUtils.degToRad(rotation.z)
        );
        tempObject.scale.set(scale.x, scale.y, scale.z);
        tempColor.set("#17d91a");
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(i, tempObject.matrix);
        meshRef.current.setColorAt(i, tempColor);
        mapSelect.current.set(id, {
          ...item,
          position: newPosition,
        });
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
    meshRef.current.computeBoundingBox();
    meshRef.current.computeBoundingSphere();
    const newSelected = Array.from(mapSelect.current.values());
    selectedInstanceRef.current = cloneDeep(newSelected);
  });
  const handleMouseDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (draggingRef.current) return;
    const instanceId = e.instanceId;
    if (instanceId === undefined) return;
    const model = data[instanceId];
    const groupData = groupRef.current.get(model.id) || [];

    let newDataSelected: ModelType[] = [];
    newDataSelected = [...groupData].filter((item) => item.id !== model.id);
    newDataSelected = [...newDataSelected, model];

    if (e.shiftKey) {
      const isAlreadySelected = mapSelect.current.has(model.id);
      if (isAlreadySelected) {
        newDataSelected = selectMultiple.filter((item) => item.id !== model.id);
      } else {
        newDataSelected = [...selectMultiple, model];
      }
    }
    setSelectMultiple(newDataSelected);
  };

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, data.length]}
      material={model?.material}
      geometry={model?.geometry}
      onPointerDown={(e) => handleMouseDown(e)}
      frustumCulled={false}
    />
  );
};

export default InstanceModel;

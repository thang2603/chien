import { useGLTF } from "@react-three/drei";
import type { InstanceModelType, ModelType } from "../../../admin/types/model";
import * as THREE from "three";
import {
  useEffect,
  useMemo,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import cloneDeep from "lodash.clonedeep";
import type { ThreeEvent } from "@react-three/fiber";

interface DataTypeProps {
  instance: InstanceModelType;
  modelEdit: ModelType | null;
  setModelEdit: Dispatch<SetStateAction<ModelType | null>>;
}
const InstanceMesh = ({ instance, setModelEdit, modelEdit }: DataTypeProps) => {
  const { data, url } = instance;
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);
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

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < data.length; i++) {
      const item = cloneDeep(data[i]);
      const { position, rotation, scale, color, id } = item;
      const isSelected = modelEdit?.id === id;
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
  }, [data, tempObject, tempColor, modelEdit]);

  const handleMouseDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const instanceId = e.instanceId;
    if (instanceId === undefined) return;
    const model = cloneDeep(data[instanceId]);
    setModelEdit(model);
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

export default InstanceMesh;

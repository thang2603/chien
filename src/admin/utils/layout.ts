import cloneDeep from "lodash.clonedeep";
import type { ModelType, VectorType } from "../types/model";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import * as THREE from "three";
export async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText().then((text) => text);
    toast.success("Pasted from clipboard");
    return JSON.parse(text);
  } catch (err) {
    console.error("Paste failed:", err);
    toast.error("Paste from clipboard failed");
    return null;
  }
}

export async function copyToClipboard(obj: ModelType[]) {
  try {
    const text = JSON.stringify(obj);
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  } catch (err) {
    console.error("Copy failed:", err);
    toast.error("Copy to clipboard failed");
  }
}

export const convertMousePosition = (postion: VectorType, dir: string) => {
  const direction = dir.replace("-", "").toLowerCase();
  const newPositon: VectorType = { ...postion, [direction]: 0 };
  console.log(newPositon);
  return newPositon;
};

export const convertNumber = (value: number) => {
  const res = Math.round(value * 10000) / 10000;
  return res;
};

export const getDeltaPosition = (
  mousePosition: VectorType,
  originalPosition: VectorType
) => {
  const deltaPosition = {
    x: convertNumber(mousePosition.x - originalPosition.x),
    y: convertNumber(mousePosition.y - originalPosition.y),
    z: convertNumber(mousePosition.z - originalPosition.z),
  };
  return deltaPosition;
};

export const repeatModel = (
  models: ModelType[],
  direction: keyof VectorType,
  quantity: number,
  gap: number
) => {
  const result: ModelType[] = [];
  for (let i = 0; i < quantity; i++) {
    const offset = gap * (i + 1);

    for (const model of cloneDeep(models)) {
      const postion = cloneDeep(model.position);
      const clone = cloneDeep({
        ...model,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 0,
        position: {
          ...postion,
          [direction]: postion[direction] + offset,
        },
      });
      result.push(cloneDeep(clone));
    }
  }
  return result;
};

export const positionMultipleModels = (
  models: ModelType[],
  position: VectorType
) => {
  const result: ModelType[] = [];

  for (const model of models) {
    const clone = cloneDeep({
      ...model,
      position: {
        x: convertNumber(model.position.x + position.x),
        y: convertNumber(model.position.y + position.y),
        z: convertNumber(model.position.z + position.z),
      },
    });
    result.push(cloneDeep(clone));
  }
  return result;
};

export const rotateItemsAroundEuler = (
  items: ModelType[],
  origin: VectorType,
  rotationDeg: VectorType
): ModelType[] => {
  const originVec = new THREE.Vector3(origin.x, origin.y, origin.z);

  const quat = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(
      THREE.MathUtils.degToRad(rotationDeg.x),
      THREE.MathUtils.degToRad(rotationDeg.y),
      THREE.MathUtils.degToRad(rotationDeg.z),
      "XYZ"
    )
  );

  return items.map((item) => {
    const pos = new THREE.Vector3(
      item.position.x,
      item.position.y,
      item.position.z
    );

    const initialRot = new THREE.Euler(
      THREE.MathUtils.degToRad(item.rotation.x),
      THREE.MathUtils.degToRad(item.rotation.y),
      THREE.MathUtils.degToRad(item.rotation.z),
      "XYZ"
    );
    const initialQuat = new THREE.Quaternion().setFromEuler(initialRot);

    const localPos = pos
      .clone()
      .sub(originVec)
      .applyQuaternion(quat)
      .add(originVec);

    const newRotQuat = quat.clone().multiply(initialQuat);

    const newRotEuler = new THREE.Euler().setFromQuaternion(newRotQuat, "XYZ");

    return {
      ...item,
      position: {
        x: convertNumber(localPos.x),
        y: convertNumber(localPos.y),
        z: convertNumber(localPos.z),
      },
      rotation: {
        x: convertNumber(THREE.MathUtils.radToDeg(newRotEuler.x)),
        y: convertNumber(THREE.MathUtils.radToDeg(newRotEuler.y)),
        z: convertNumber(THREE.MathUtils.radToDeg(newRotEuler.z)),
      },
    };
  });
};

export const getOriginFromItems = (items: ModelType[]): VectorType => {
  if (items.length === 0) return { x: 0, y: 0, z: 0 };

  let sx = 0,
    sy = 0,
    sz = 0;

  for (const item of items) {
    sx += item.position.x;
    sy += item.position.y;
    sz += item.position.z;
  }

  return {
    x: sx / items.length,
    y: sy / items.length,
    z: sz / items.length,
  };
};

export const scaleItemsAroundOrigin = (
  items: ModelType[],
  origin: { x: number; y: number; z: number },
  scaleFactor: { x: number; y: number; z: number }
): ModelType[] => {
  const originVec = new THREE.Vector3(origin.x, origin.y, origin.z);

  return items.map((item) => {
    const pos = new THREE.Vector3(
      item.position.x,
      item.position.y,
      item.position.z
    );

    const local = pos.clone().sub(originVec);

    local.x *= scaleFactor.x;
    local.y *= scaleFactor.y;
    local.z *= scaleFactor.z;

    const newPos = local.add(originVec);
    const newScale = {
      x: convertNumber(item.scale.x * scaleFactor.x),
      y: convertNumber(item.scale.y * scaleFactor.y),
      z: convertNumber(item.scale.z * scaleFactor.z),
    };

    return {
      ...item,
      position: {
        x: convertNumber(newPos.x),
        y: convertNumber(newPos.y),
        z: convertNumber(newPos.z),
      },
      scale: newScale,
    };
  });
};

export const exportToJson = (data: any[], fileName = "data.json") => {
  const json = JSON.stringify(data, null, 2); // format đẹp 2 spaces
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
};

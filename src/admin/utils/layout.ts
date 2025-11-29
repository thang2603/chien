import type { ModelType, VectorType } from "../types/model";
import { toast } from "sonner";
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

export interface VectorType {
  x: number;
  y: number;
  z: number;
}

export interface OffsetType {
  offsetX: number;
  offsetY: number;
}
export interface ModelType {
  id: string;
  modelName: string;
  url: string;
  position: VectorType;
  rotation: VectorType;
  scale: VectorType;
  color: string;
  title?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export type TransformTye = "position" | "rotation" | "scale";

export interface InstanceModelType {
  modelName: string;
  url: string;
  data: ModelType[];
}

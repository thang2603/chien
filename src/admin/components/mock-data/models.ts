import type { InstanceModelType, ModelType } from "../../types/model";
import { v4 as uuidv4 } from "uuid";
export const getDataModel = (): Record<string, InstanceModelType> => {
  const models: ModelType[] = Array.from({ length: 2 }).map(() => ({
    id: uuidv4(),
    position: {
      x: Math.random() * 10 - 5,
      y: Math.random() * 10 - 5,
      z: Math.random() * 10 - 5,
    },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    color: "#cccccc",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
  }));
  return {
    exampleModel: {
      modelName: "Example",
      url: "https://example.com/model.glb",
      data: models,
    },
  };
};

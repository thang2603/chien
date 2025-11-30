import cloneDeep from "lodash.clonedeep";
import type { InstanceModelType, ModelType } from "../types/model";

export const handleAddListModel = (
  models: ModelType[],
  listModels: Record<string, InstanceModelType>
) => {
  const newListModels = cloneDeep(listModels);
  models.forEach((model) => {
    if (!newListModels[model.modelName]) {
      newListModels[model.modelName] = {
        modelName: model.modelName,
        url: model.url,
        data: [],
      };
    }
    newListModels[model.modelName].data.push(model);
  });
  return newListModels;
};

export const handleUpdateListModel = (
  models: ModelType[],
  listModels: Record<string, InstanceModelType>
) => {
  const mapModel = new Map<string, ModelType>();
  models.forEach((model) => {
    mapModel.set(model.id, model);
  });
  let newListModels = cloneDeep(listModels);
  Object.entries(newListModels).forEach(([modelName, instance]) => {
    const newData = instance.data.map((model) => {
      const modelUpdate = mapModel.get(model.id);
      if (modelUpdate) {
        return modelUpdate;
      }
      return model;
    });
    newListModels = {
      ...newListModels,
      [modelName]: {
        ...instance,
        data: newData,
      },
    };
  });
  return newListModels;
};

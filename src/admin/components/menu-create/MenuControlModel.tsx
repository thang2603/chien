import {
  INIT_MODEL,
  STEP_POSITION,
  STEP_ROTATION,
  STEP_SCALE,
  TRANFORM_CONTROLS,
} from "../../constants/layout";
import { TextField } from "@radix-ui/themes";
import { useModel } from "../../context/useModel";
import type { ModelType, TransformTye, VectorType } from "../../types/model";
import { handleUpdateListModel } from "../../context/utils";
import cloneDeep from "lodash.clonedeep";
import RepeatModel from "./RepeatModel";

const MenuControlModel = () => {
  const { selectMultiple, setSelectMultiple, listInstances, setListInstances } =
    useModel();
  const modelEdit: ModelType =
    selectMultiple[selectMultiple.length - 1] || INIT_MODEL;
  const { position, rotation, scale, id } = modelEdit;

  const handleUpDate = (modelUpdate: ModelType) => {
    const listModelUpdate = handleUpdateListModel([modelUpdate], listInstances);
    const selectMultipleUpdate = selectMultiple.map((item) =>
      item.id === id ? modelUpdate : item
    );
    setListInstances(cloneDeep(listModelUpdate));
    setSelectMultiple(selectMultipleUpdate);
  };
  const onChangeTranform = (
    mainKey: TransformTye,
    subKey: keyof VectorType,
    value: number
  ) => {
    console.log(mainKey, subKey, value);
    let transformValue = { ...modelEdit[mainKey] };
    transformValue = { ...transformValue, [subKey]: value };
    const modelUpdate = {
      ...modelEdit,
      [mainKey]: transformValue,
    };
    handleUpDate(modelUpdate);
  };

  const onChangeColor = (value: string) => {
    const modelUpdate = {
      ...modelEdit,
      color: value,
    };
    handleUpDate(modelUpdate);
  };

  return (
    <div className="absolute bg-white w-[200px] h-[calc(100vh-200px)] top-8 right-9 rounded-xl">
      <div className="p-2 flex flex-col gap-2">
        <div>
          <span>Position</span>
          <div className="flex flex-col gap-1">
            {TRANFORM_CONTROLS.map((key) => (
              <TextField.Root
                key={`position_${key}`}
                size="1"
                type="number"
                step={STEP_POSITION}
                value={position?.[key as keyof VectorType]}
                onChange={(e) =>
                  onChangeTranform(
                    "position",
                    key as keyof VectorType,
                    Number(e.target.value)
                  )
                }
              />
            ))}
          </div>
        </div>
        <div>
          <span>Rotation</span>
          <div className="flex flex-col gap-1">
            {TRANFORM_CONTROLS.map((key) => (
              <TextField.Root
                key={`rotation_${key}`}
                size="1"
                step={STEP_ROTATION}
                type="number"
                value={rotation?.[key as keyof VectorType]}
                onChange={(e) =>
                  onChangeTranform(
                    "rotation",
                    key as keyof VectorType,
                    Number(e.target.value)
                  )
                }
              />
            ))}
          </div>
        </div>
        <div>
          <span>Scale</span>
          <div className="flex flex-col gap-1">
            {TRANFORM_CONTROLS.map((key) => (
              <TextField.Root
                key={`scale_${key}`}
                size="1"
                type="number"
                step={STEP_SCALE}
                value={scale?.[key as keyof VectorType]}
                onChange={(e) =>
                  onChangeTranform(
                    "scale",
                    key as keyof VectorType,
                    Number(e.target.value)
                  )
                }
              />
            ))}
          </div>
        </div>
        <div className="flex  gap-1">
          <span> Color</span>
          <input type="color" onChange={(e) => onChangeColor(e.target.value)} />
        </div>
        <div>
          <RepeatModel />
        </div>
      </div>
    </div>
  );
};

export default MenuControlModel;

import {
  INIT_COLOR,
  INIT_POSITION,
  INIT_ROTATION,
  INIT_SCALE,
  STEP_POSITION,
  STEP_ROTATION,
  STEP_SCALE,
  TRANFORM_CONTROLS,
} from "../../constants/layout";
import { Button, TextField } from "@radix-ui/themes";
import { useModel } from "../../context/useModel";
import type { ModelType, VectorType } from "../../types/model";
import { handleUpdateListModel } from "../../context/utils";
import cloneDeep from "lodash.clonedeep";
import { useState, type KeyboardEvent } from "react";
import {
  getOriginFromItems,
  positionMultipleModels,
  rotateItemsAroundEuler,
  scaleItemsAroundOrigin,
} from "../../utils/layout";

const MenuControlMultipleModel = () => {
  const { selectMultiple, setSelectMultiple, listInstances, setListInstances } =
    useModel();

  const [position, setPosition] = useState<VectorType>(INIT_POSITION);
  const [rotation, setRotation] = useState<VectorType>(INIT_ROTATION);
  const [scale, setScale] = useState<VectorType>(INIT_SCALE);
  const [color, setColor] = useState<string>(INIT_COLOR);

  const handleUpDate = (modelsUpdate: ModelType[]) => {
    const listModelUpdate = handleUpdateListModel(modelsUpdate, listInstances);
    setListInstances(cloneDeep(listModelUpdate));
    setSelectMultiple(cloneDeep(modelsUpdate));
  };

  const handleChangePosition = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      const modelsUpdated = positionMultipleModels(selectMultiple, position);
      handleUpDate(modelsUpdated);
      setPosition(INIT_POSITION);
    }
  };

  const handleChangeRotation = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      const origin = getOriginFromItems(selectMultiple);
      const modelsUpdated = rotateItemsAroundEuler(
        selectMultiple,
        origin,
        rotation
      );
      handleUpDate(modelsUpdated);
      setRotation(INIT_ROTATION);
    }
  };

  const handleChangeScale = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      const origin = getOriginFromItems(selectMultiple);
      const modelsUpdated = scaleItemsAroundOrigin(
        selectMultiple,
        origin,
        scale
      );
      handleUpDate(modelsUpdated);
      setRotation(INIT_SCALE);
    }
  };

  const onChangeColor = () => {
    const modelsUpdate = selectMultiple.map((item) => ({
      ...item,
      color: color,
    }));
    handleUpDate(modelsUpdate);
    setColor(INIT_COLOR);
  };

  return (
    selectMultiple.length > 1 && (
      <div className="absolute bg-white w-[200px] h-[calc(100vh-200px)] top-8 left-9 rounded-xl">
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
                    setPosition((pre) => ({
                      ...pre,
                      [key]: Number(e.target.value),
                    }))
                  }
                  onKeyDown={(e) => handleChangePosition(e)}
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
                    setRotation((pre) => ({
                      ...pre,
                      [key]: Number(e.target.value),
                    }))
                  }
                  onKeyDown={(e) => handleChangeRotation(e)}
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
                    setScale((pre) => ({
                      ...pre,
                      [key]: Number(e.target.value),
                    }))
                  }
                  onKeyDown={(e) => handleChangeScale(e)}
                />
              ))}
            </div>
          </div>
          <div className="flex  gap-1 items-center">
            <span> Color</span>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <Button
              size="1"
              variant="soft"
              className=" cursor-pointer!"
              onClick={onChangeColor}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    )
  );
};

export default MenuControlMultipleModel;

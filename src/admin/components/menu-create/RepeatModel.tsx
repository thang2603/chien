import { Button, Select, TextField } from "@radix-ui/themes";
import { TRANFORM_CONTROLS } from "../../constants/layout";
import { useState } from "react";
import { repeatModel } from "../../utils/layout";
import { useModel } from "../../context/useModel";
import type { VectorType } from "../../types/model";
import { handleAddListModel } from "../../context/utils";

const RepeatModel = () => {
  const { selectMultiple, listInstances, setListInstances } = useModel();
  const [repeat, setRepeat] = useState({
    direction: "x",
    quantity: 1,
    gap: 0.1,
  });

  const handleRepeat = () => {
    const { direction, gap, quantity } = repeat;
    const models = repeatModel(
      selectMultiple,
      direction as keyof VectorType,
      quantity,
      gap
    );
    const newListModels = handleAddListModel(models, listInstances);
    setListInstances(newListModels);
  };
  return (
    <div className="border-t pt-2.5 border-gray-400 grid gap-2">
      <div className="grid gap-1">
        <div className="flex gap-2 items-center">
          <span className="text-xs w-16">Direction</span>
          <Select.Root
            size="1"
            value={repeat.direction}
            onValueChange={(value) =>
              setRepeat((pre) => ({ ...pre, direction: value }))
            }
          >
            <Select.Trigger
              style={{
                width: "100px",
              }}
            />
            <Select.Content>
              {TRANFORM_CONTROLS.map((key) => (
                <Select.Item value={key}>{key.toUpperCase()}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-xs w-20">Quantity</span>
          <TextField.Root
            size="1"
            type="number"
            step={1}
            min={1}
            value={repeat.quantity}
            onChange={(e) =>
              setRepeat((pre) => ({ ...pre, quantity: Number(e.target.value) }))
            }
          />
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-xs w-20">Gap</span>
          <TextField.Root
            size="1"
            type="number"
            value={repeat.gap}
            step={0.1}
            min={0.001}
            onChange={(e) =>
              setRepeat((pre) => ({ ...pre, gap: Number(e.target.value) }))
            }
          />
        </div>
      </div>
      <Button
        size="1"
        variant="soft"
        className=" cursor-pointer!"
        onClick={handleRepeat}
      >
        Repeat
      </Button>
    </div>
  );
};

export default RepeatModel;

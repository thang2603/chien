import { Button } from "@radix-ui/themes";
import { useModel } from "../../context/useModel";
import type { InstanceModelType, ModelType } from "../../types/model";
import cloneDeep from "lodash.clonedeep";
import { useLayoutEffect } from "react";
import { toast } from "sonner";
import { exportToJson } from "../../utils/layout";

const SaveModel = () => {
  const { listInstances, setListInstances } = useModel();
  const handleSave = () => {
    let data: ModelType[] = [];
    Object.values(listInstances).forEach((instance) => {
      data = [...data, ...cloneDeep(instance.data)];
    });
    localStorage.setItem("data", JSON.stringify(data));
    toast.success("Saved successfully");
  };

  const handleExport = () => {
    let data: ModelType[] = [];
    Object.values(listInstances).forEach((instance) => {
      data = [...data, ...cloneDeep(instance.data)];
    });
    exportToJson(data);
  };

  useLayoutEffect(() => {
    const newData = localStorage.getItem("data");
    if (newData) {
      const tempData = JSON.parse(newData);
      let newListInstance: Record<string, InstanceModelType> = {};
      tempData.forEach((item: ModelType) => {
        if (!newListInstance?.[item.modelName]) {
          newListInstance = {
            ...newListInstance,
            [item.modelName]: {
              data: [],
              modelName: item.modelName,
              url: item.url,
            },
          };
        }
        newListInstance = {
          ...newListInstance,
          [item.modelName]: {
            ...cloneDeep(newListInstance[item.modelName]),
            data: [...cloneDeep(newListInstance[item.modelName].data), item],
          },
        };
      });
      setListInstances(cloneDeep(newListInstance));
    }
  }, [setListInstances]);

  return (
    <div className="flex items-center gap-2">
      <Button
        size="1"
        variant="solid"
        onClick={handleSave}
        className="cursor-pointer!"
      >
        Save
      </Button>

      <Button
        size="1"
        variant="soft"
        onClick={handleExport}
        className="cursor-pointer!"
      >
        Export
      </Button>
    </div>
  );
};

export default SaveModel;

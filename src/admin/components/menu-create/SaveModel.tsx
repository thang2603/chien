import { Button } from "@radix-ui/themes";
import { useModel } from "../../context/useModel";
import type { InstanceModelType, ModelType } from "../../types/model";
import cloneDeep from "lodash.clonedeep";
import { useLayoutEffect } from "react";
import { toast } from "sonner";
import { exportToJson } from "../../utils/layout";
import { useParams } from "react-router-dom";
import { getLayoutDetail, putLayout } from "../../../services/layout";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loading from "../../../component/loading";

const SaveModel = () => {
  const { id } = useParams();

  const { listInstances, setListInstances } = useModel();

  const { data: dataLayout, isFetching } = useQuery({
    queryKey: ["layout", id],
    queryFn: () => getLayoutDetail(id as string),
    select: (d) => {
      return d?.data;
    },
  });

  const putMutation = useMutation({
    mutationFn: (payload: ModelType[]) =>
      putLayout(id as string, {
        models: payload,
      }),
    onSuccess: () => {
      toast.success("Lưu thành công");
    },
    onError: () => {
      toast.error("Lưu thất bại");
    },
  });

  const handleSave = () => {
    let data: ModelType[] = [];
    Object.values(listInstances).forEach((instance) => {
      data = [...data, ...cloneDeep(instance.data)];
    });
    if (id) {
      putMutation.mutate(data);
      localStorage.setItem("data", JSON.stringify(data));
    }
  };

  const handleExport = () => {
    let data: ModelType[] = [];
    Object.values(listInstances).forEach((instance) => {
      data = [...data, ...cloneDeep(instance.data)];
    });
    exportToJson(data);
  };

  useLayoutEffect(() => {
    if (!dataLayout) return;

    if (dataLayout) {
      const tempData = cloneDeep(dataLayout?.models || []);
      let newListInstance: Record<string, InstanceModelType> = {};
      tempData?.forEach((item: ModelType) => {
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
  }, [setListInstances, dataLayout]);

  return isFetching ? (
    <Loading />
  ) : (
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

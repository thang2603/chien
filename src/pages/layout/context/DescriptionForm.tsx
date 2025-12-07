import { useLayout } from "./useLayout";
import { Html } from "@react-three/drei";
import { Button, Flex, Text, TextArea, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { Pencil1Icon } from "@radix-ui/react-icons";
import type { ModelType } from "../../../admin/types/model";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putLayout } from "../../../services/layout";
import { toast } from "sonner";
import { useThree } from "@react-three/fiber";
import { useParams } from "react-router-dom";

interface DataTypeProps {
  listModels: any;
}
const DescriptionForm = ({ listModels }: DataTypeProps) => {
  const { modelEdit } = useLayout();
  const { id } = useParams();
  const { position, title, description, id: modelId } = modelEdit || {};

  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const orbitControls: any = useThree((state) => state.controls);
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const putMutation = useMutation({
    mutationFn: (payload: ModelType[]) =>
      putLayout(id as string, {
        models: payload,
      }),
    onSuccess: () => {
      toast.success("Lưu thành công");
      queryClient.invalidateQueries({ queryKey: ["layout-detail"] });
      handleClose();
    },
    onError: () => {
      toast.error("Lưu thất bại");
    },
  });

  const handleOpen = () => {
    if (orbitControls && "enabled" in orbitControls) {
      orbitControls.enabled = false;
    }
    setForm((pre) => ({
      ...pre,
      title: title || "",
      description: description || "",
    }));
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (orbitControls && "enabled" in orbitControls) {
      orbitControls.enabled = true;
    }
  };

  const handleSubmit = () => {
    if (id) {
      const data = (listModels?.models || []).map((item: ModelType) => {
        if (item.id === modelId) {
          return {
            ...item,
            title: form.title,
            description: form.description,
          };
        }
        return item;
      });
      putMutation.mutate(data);
    }
  };
  return (
    position && (
      <Html position={[position.x, position.y + 2, position.z]}>
        <div>
          <div className="bg-gray-200 grid gap-1.5 p-2 rounded-md">
            <div className="flex items-center  justify-between gap-1">
              <p className="whitespace-nowrap text-xs font-bold">{title}</p>
              <div>
                <Pencil1Icon
                  onClick={handleOpen}
                  className="cursor-pointer hover:text-blue-500 font-bold text-2xl"
                />
              </div>
            </div>
            <p className="whitespace-nowrap text-xs">{description}</p>
          </div>
          {isOpen && (
            <div className="w-60 absolute bg-gray-300 p-2 rounded-md">
              <Flex direction="column" gap="3">
                <label>
                  <Text as="div" size="1" mb="1" weight="bold">
                    Tiêu đề
                  </Text>
                  <TextField.Root
                    placeholder="Nhập tiêu đề..."
                    onChange={(e) =>
                      setForm((pre) => ({ ...pre, title: e.target.value }))
                    }
                  />
                </label>
                <label>
                  <Text as="div" size="1" mb="1" weight="bold">
                    Mô tả
                  </Text>
                  <TextArea
                    placeholder="Nhập mô tả…"
                    onChange={(e) =>
                      setForm((pre) => ({
                        ...pre,
                        description: e.target.value,
                      }))
                    }
                  />
                </label>
              </Flex>
              <Flex gap="3" mt="4" justify="end">
                <Button variant="soft" color="gray" onClick={handleClose}>
                  Hủy
                </Button>
                <Button className="cursor-pointer!" onClick={handleSubmit}>
                  Lưu
                </Button>
              </Flex>
            </div>
          )}
        </div>
      </Html>
    )
  );
};

export default DescriptionForm;

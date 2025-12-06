import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useMutation } from "@tanstack/react-query";
import { PlusIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { postLayout } from "../../../services/layout";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const AddDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState<string>("");

  const createMutation = useMutation({
    mutationFn: () => postLayout({ id: uuidv4(), name }),
    onSuccess: () => {
      handleClose();
      toast.success("Tạo thành công");
    },
    onError: () => {
      toast.error("Tạo thất bại");
    },
  });
  const handleOpen = () => {
    setName("");
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = () => {
    createMutation.mutate();
  };

  return (
    <div>
      <Button className="cursor-pointer!" onClick={() => handleOpen()}>
        <span>Tạo mới</span>
        <PlusIcon />
      </Button>
      <Dialog.Root open={isOpen}>
        <Dialog.Content maxWidth="450px">
          <Dialog.Title>Tạo thiết kế</Dialog.Title>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Tên thiết kế
              </Text>
              <TextField.Root
                value={name}
                placeholder="Tên thiết kế"
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          </Flex>
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray" onClick={handleClose}>
                Hủy
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button onClick={handleSubmit}>Lưu</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};

export default AddDialog;

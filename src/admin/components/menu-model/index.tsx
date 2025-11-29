import { Tabs, Box, Text } from "@radix-ui/themes";
import BasicModel from "./BasicModel";
const MenuModel = () => {
  return (
    <div className=" h-screen bg-white ">
      <div>
        <Tabs.Root defaultValue="basic">
          <Tabs.List>
            <Tabs.Trigger value="basic">Basic</Tabs.Trigger>
            <Tabs.Trigger value="documents">Documents</Tabs.Trigger>
          </Tabs.List>

          <Box pt="3">
            <Tabs.Content value="basic">
              <BasicModel />
            </Tabs.Content>

            <Tabs.Content value="documents">
              <Text size="2">Access and update your documents.</Text>
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </div>
    </div>
  );
};

export default MenuModel;

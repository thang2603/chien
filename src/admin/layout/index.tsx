import MenuControlModel from "../components/menu-create/MenuControlModel";
import MenuControlMultipleModel from "../components/menu-create/MenuControlMultipleModel";
import MenuModel from "../components/menu-model";
import { ModelProvider } from "../context/ModelContext";
import CanvasLayout from "./CanvasLayout";

const Layout = () => {
  return (
    <ModelProvider>
      <div className="w-screen h-screen bg-gray-200 relative">
        <div className="flex w-full h-full gap-1">
          <div className="h-screen w-[calc(100vw-200px)] relative border border-gray-300">
            <CanvasLayout />
            <MenuControlModel />
            <MenuControlMultipleModel />
          </div>
          <MenuModel />
        </div>
      </div>
    </ModelProvider>
  );
};

export default Layout;

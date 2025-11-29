import { TRANFORM_CONTROLS, TRANSFORM_MODEL } from "../../constants/layout";
import { TextField } from "@radix-ui/themes";
const MenuControlModel = () => {
  return (
    <div className="absolute bg-white w-[200px] h-[calc(100vh-200px)] top-8 right-9 rounded-xl">
      <div className="p-2 flex flex-col gap-2">
        {Object.values(TRANSFORM_MODEL).map((transform) => (
          <div key={transform.label}>
            <span> {transform.label}</span>
            <div className="flex flex-col gap-1">
              {TRANFORM_CONTROLS.map((key) => (
                <TextField.Root
                  key={key}
                  size="1"
                  type="number"
                  placeholder="Search the docs…"
                />
              ))}
            </div>
          </div>
        ))}
        <div className="flex  gap-1">
          <span> Color</span>
          <input type="color" />
        </div>
      </div>
    </div>
  );
};

export default MenuControlModel;

import { createContext, useState } from "react";
import type { ModelType } from "../../../admin/types/model";

export interface LayoutContextType {
  modelEdit: ModelType | null;
  setModelEdit: React.Dispatch<React.SetStateAction<ModelType | null>>;
}

const LayoutContext = createContext<LayoutContextType>({
  modelEdit: null,
  setModelEdit: () => {},
});

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [modelEdit, setModelEdit] = useState<ModelType | null>(null);

  return (
    <LayoutContext.Provider
      value={{
        modelEdit,
        setModelEdit,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutContext;

import { useContext } from "react";
import LayoutContext from "./LayoutContext";

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("use must be used within a ModelProvider");
  }
  return context;
};

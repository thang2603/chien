import { createContext, useRef, useState, type RefObject } from "react";
import type {
  InstanceModelType,
  ModelType,
  OffsetType,
  VectorType,
} from "../types/model";

export interface ModelContextType {
  listInstances: Record<string, InstanceModelType>;
  setListInstances: React.Dispatch<
    React.SetStateAction<Record<string, InstanceModelType>>
  >;

  direction: string;
  setDirection: React.Dispatch<React.SetStateAction<string>>;
  selectMultiple: ModelType[];
  setSelectMultiple: React.Dispatch<React.SetStateAction<ModelType[]>>;
  selectedInstanceRef: RefObject<ModelType[]>;
  mousePositionRef: RefObject<VectorType>;
  offsetRef: RefObject<OffsetType>;
  draggingRef: RefObject<VectorType | null>;
  groupRef: RefObject<Map<string, ModelType[]>>;
}

const ModelContext = createContext<ModelContextType>({
  listInstances: {},
  setListInstances: () => {},
  direction: "",
  setDirection: () => {},
  selectMultiple: [],
  setSelectMultiple: () => {},
  selectedInstanceRef: { current: [] },
  mousePositionRef: { current: { x: 0, y: 0, z: 0 } },
  offsetRef: { current: { offsetX: 0, offsetY: 0 } },
  draggingRef: { current: null },
  groupRef: { current: new Map() },
});

export const ModelProvider = ({ children }: { children: React.ReactNode }) => {
  const [listInstances, setListInstances] = useState<
    Record<string, InstanceModelType>
  >({});

  const [direction, setDirection] = useState<string>("");
  const [selectMultiple, setSelectMultiple] = useState<ModelType[]>([]);
  const selectedInstanceRef = useRef<ModelType[]>([]);
  const mousePositionRef = useRef<VectorType>({ x: 0, y: 0, z: 0 });
  const draggingRef = useRef<VectorType | null>(null);
  const offsetRef = useRef<OffsetType>({ offsetX: 0, offsetY: 0 });
  const groupRef = useRef<Map<string, ModelType[]>>(new Map());

  return (
    <ModelContext.Provider
      value={{
        listInstances,
        setListInstances,
        direction,
        setDirection,
        selectMultiple,
        setSelectMultiple,
        selectedInstanceRef,
        mousePositionRef,
        draggingRef,
        offsetRef,
        groupRef,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};

export default ModelContext;

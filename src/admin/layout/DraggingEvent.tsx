import { useEffect } from "react";
import { useModel } from "../context/useModel";
import { useThree } from "@react-three/fiber";
import { toast } from "sonner";
import cloneDeep from "lodash.clonedeep";
import useMousePosition from "../context/useMousePosition";
import { handleUpdateListModel } from "../context/utils";
const DraggingEvent = () => {
  const {
    draggingRef,
    selectedInstanceRef,
    offsetRef,
    listInstances,
    setSelectMultiple,
    setListInstances,
  } = useModel();
  const orbitControls = useThree((state) => state.controls);
  const getMousePosition = useMousePosition();
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toUpperCase() === "G") {
        e.stopPropagation();
        e.preventDefault();
        if (!draggingRef.current) {
          const { offsetX, offsetY } = offsetRef.current;
          const mousePos = getMousePosition(offsetX, offsetY);
          draggingRef.current = cloneDeep(mousePos);
          if (orbitControls && "enabled" in orbitControls) {
            orbitControls.enabled = false;
          }
          toast.success("Started dragging ");
        } else {
          const newListInstances = handleUpdateListModel(
            cloneDeep(selectedInstanceRef.current),
            listInstances
          );
          setListInstances(newListInstances);
          setSelectMultiple(cloneDeep(selectedInstanceRef.current));
          draggingRef.current = null;
          if (orbitControls && "enabled" in orbitControls) {
            orbitControls.enabled = true;
          }
          toast.success("Stopped dragging");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    draggingRef,
    offsetRef,
    getMousePosition,
    orbitControls,
    selectedInstanceRef,
    setSelectMultiple,
    listInstances,
    setListInstances,
  ]);
  return <mesh></mesh>;
};

export default DraggingEvent;

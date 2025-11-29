import { useCallback, useMemo } from "react";
import { Plane, Raycaster, Vector2, Vector3 } from "three";
import { useModel } from "./useModel";
import { convertNumber } from "../utils/layout";
import { useThree } from "@react-three/fiber";

const useMousePosition = () => {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const { direction } = useModel();

  const raycaster = useMemo(() => new Raycaster(), []);
  const intersection = useMemo(() => new Vector3(), []);
  const plane = useMemo(() => {
    switch (direction.toUpperCase()) {
      case "X":
      case "-X":
        return new Plane(new Vector3(1, 0, 0));
      case "Y":
      case "-Y":
        return new Plane(new Vector3(0, 1, 0));
      case "Z":
      case "-Z":
        return new Plane(new Vector3(0, 0, 1));
      default:
        return new Plane(new Vector3(0, 1, 0));
    }
  }, [direction]);

  const getMousePosition = useCallback(
    (offsetX: number, offsetY: number) => {
      const x = (offsetX / size.width) * 2 - 1;
      const y = -(offsetY / size.height) * 2 + 1;
      const vector = new Vector2(x, y);
      raycaster.setFromCamera(vector, camera);
      raycaster.ray.intersectPlane(plane, intersection);
      const position = {
        x: convertNumber(intersection.x),
        y: convertNumber(intersection.y),
        z: convertNumber(intersection.z),
      };
      return position;
    },
    [camera, intersection, plane, raycaster, size.height, size.width]
  );
  return getMousePosition;
};

export default useMousePosition;

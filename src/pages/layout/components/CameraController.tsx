import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export const CameraController = ({
  targetPosition,
}: {
  targetPosition: THREE.Vector3 | null;
}) => {
  const { camera } = useThree();

  useFrame(() => {
    if (targetPosition) {
      // Offset để camera ở vị trí đẹp so với item
      const offset = new THREE.Vector3(0, 2, 4);
      const targetCameraPosition = new THREE.Vector3()
        .copy(targetPosition)
        .add(offset);

      // Di chuyển camera mượt mà
      camera.position.lerp(targetCameraPosition, 0.05);

      // Camera nhìn vào item
      camera.lookAt(targetPosition);
    }
  });

  return null;
};

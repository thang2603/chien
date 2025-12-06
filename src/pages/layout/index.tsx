import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useNavigate, useParams } from "react-router-dom";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import { getLayoutDetail } from "../../services/layout";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../component/loading";
import InstanceMesh from "./components/InstanceMesh";
import type { InstanceModelType, ModelType } from "../../admin/types/model";
import cloneDeep from "lodash.clonedeep";
import { useEffect, useState } from "react";

const Layout = () => {
  const { id } = useParams();
  const [modelEdit, setModelEdit] = useState<ModelType | null>(null);
  const navigate = useNavigate();
  const {
    data: dataLayout,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["layout-detail", id],
    queryFn: () => getLayoutDetail(id as string),
    select: (d) => {
      const newData = cloneDeep(d?.data);
      let newListInstance: Record<string, InstanceModelType> = {};
      const tempData = cloneDeep(newData.models || []);
      tempData?.forEach((item: ModelType) => {
        if (!newListInstance?.[item.modelName]) {
          newListInstance = {
            ...newListInstance,
            [item.modelName]: {
              data: [],
              modelName: item.modelName,
              url: item.url,
            },
          };
        }
        newListInstance = {
          ...newListInstance,
          [item.modelName]: {
            ...cloneDeep(newListInstance[item.modelName]),
            data: [...cloneDeep(newListInstance[item.modelName].data), item],
          },
        };
      });
      return {
        instanceMesh: cloneDeep(newListInstance),
        listModels: cloneDeep(d?.data),
      };
    },
  });

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
  }, [isError, navigate]);

  return isFetching ? (
    <Loading />
  ) : (
    <div className="w-screee h-[calc(100vh-80px)]">
      <Canvas
        camera={{ position: [0, 15, 15], fov: 60 }}
        tabIndex={-1}
        gl={{
          outputColorSpace: SRGBColorSpace,
          toneMapping: ACESFilmicToneMapping,
        }}
      >
        <ambientLight intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={1.5} />
        {dataLayout &&
          Object.entries(dataLayout?.instanceMesh)?.map(([key, instance]) => (
            <InstanceMesh
              key={key}
              instance={instance}
              modelEdit={modelEdit}
              setModelEdit={setModelEdit}
            />
          ))}
        <OrbitControls makeDefault />
        <gridHelper args={[100, 100, 100]} position={[0, 0, 0]} />
        <axesHelper args={[100]} />
        <Stats />
      </Canvas>
    </div>
  );
};

export default Layout;

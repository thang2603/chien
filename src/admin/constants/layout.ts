export const INIT_POSITION = { x: 0, y: 0, z: 0 };
export const INIT_ROTATION = { x: 0, y: 0, z: 0 };
export const INIT_SCALE = { x: 1, y: 1, z: 1 };
export const INIT_COLOR = "#ffffff";
export const INIT_VERSION = 0;
export const DIRECTIONS = ["X", "-X", "Y", "-Y", "Z", "-Z"];
export const STEP_POSITION = 0.1;
export const STEP_ROTATION = 5;
export const STEP_SCALE = 0.1;
export const TRANFORM_CONTROLS = ["x", "y", "z"];

export const INIT_MODEL = {
  position: INIT_POSITION,
  rotation: INIT_ROTATION,
  scale: INIT_SCALE,
  color: INIT_COLOR,
  version: INIT_VERSION,
};

export const BASIC_MODELS = [
  {
    label: "Cube",
    modelName: "cube",
    url: "/models/cube.glb",
  },
  {
    label: "Cone",
    modelName: "cone",
    url: "/models/cone.glb",
  },
  {
    label: "Cylinder",
    modelName: "cylinder",
    url: "/models/cylinder.glb",
  },
  {
    label: "Sphere",
    modelName: "sphere",
    url: "/models/sphere.glb",
  },
  {
    label: "torus",
    modelName: "torus",
    url: "/models/torus.glb",
  },
  {
    label: "glass",
    modelName: "glass",
    url: "/models/glass.glb",
  },
  {
    label: "location",
    modelName: "location",
    url: "/models/location.glb",
  },
];

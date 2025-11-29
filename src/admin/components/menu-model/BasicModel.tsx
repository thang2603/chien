import { BASIC_MODELS, INIT_MODEL } from "../../constants/layout";
import type { ModelType } from "../../types/model";
import { v4 as uuidv4 } from "uuid";
import { copyToClipboard } from "../../utils/layout";
const BasicModel = () => {
  const handleClick = (modelName: string, url: string) => {
    const model: ModelType = {
      ...INIT_MODEL,
      modelName,
      url,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 0,
    };
    copyToClipboard([model]);
  };
  return (
    <div className="grid grid-cols-2 gap-4">
      {BASIC_MODELS.map(({ modelName, url, label }) => (
        <div
          key={modelName}
          className="border rounded-lg w-20 h-20 cursor-copy"
          onClick={() => handleClick(modelName, url)}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

export default BasicModel;

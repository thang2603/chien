import { Spinner } from "@radix-ui/themes";

const Loading = () => {
  return (
    <div className="h-screen w-screen fixed top-0 left-0 flex items-center justify-center bg-gray-200 opacity-50">
      <span>Đang tải....</span>
      <Spinner size={"3"} />
    </div>
  );
};

export default Loading;

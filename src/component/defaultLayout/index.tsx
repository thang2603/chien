import { type ReactNode } from "react";
import { PersonIcon } from "@radix-ui/react-icons";
interface DataTypeProps {
  children: ReactNode;
}
const DefaultLayout = ({ children }: DataTypeProps) => {
  return (
    <div className="w-screen h-screen ">
      <div className="border-t border-b border-gray-500 h-12">
        <div>
          <PersonIcon />
        </div>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
};

export default DefaultLayout;

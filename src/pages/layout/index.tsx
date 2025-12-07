import { LayoutProvider } from "./context/LayoutContext";
import CanvasDetail from "./CanvasDetail";

const Layout = () => {
  return (
    <LayoutProvider>
      <CanvasDetail />
    </LayoutProvider>
  );
};

export default Layout;

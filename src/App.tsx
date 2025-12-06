import { Outlet } from "react-router-dom";
import Home from "./pages/home";

const App = () => {
  return (
    <div>
      <Home />
      <Outlet />
    </div>
  );
};

export default App;

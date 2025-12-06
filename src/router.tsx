import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { lazy } from "react";
import DefaultLayout from "./component/defaultLayout";

const LayoutPage = lazy(() => import("./pages/layout"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <DefaultLayout>
        <App />
      </DefaultLayout>
    ),
  },
  {
    path: "/layout/:id",
    element: (
      <DefaultLayout>
        <LayoutPage />,
      </DefaultLayout>
    ),
  },
]);

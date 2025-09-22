import { createHashRouter } from "react-router-dom";
import { Layout } from "../Components/Layout";
import { Login } from "../Auth/Login";
import { Dashboard } from "../Components/Dashboard";
import { ProtectedRoute, PublicOnlyRoute } from "./ProtectedRoutes";
import Timeout from "../Components/Timeout";

const routes = createHashRouter([
  {
    path: "/",
    element: <PublicOnlyRoute element={<Login />} />,
  },
  {
    path: "/login",
    element: <PublicOnlyRoute element={<Login />} />,
  },
  {
    path: "/timeout",
    element: <Timeout />,
  },
  {
    path: "/",
    element: <ProtectedRoute element={<Layout />} />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

export default routes;

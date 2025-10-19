import { createHashRouter } from "react-router-dom";
import { Layout } from "../Components/Layout";
import { Login } from "../Auth/Login";
import { Tickets } from "../Pages/Tickets";
import { Masters } from "../Components/Masters";
import { Profile } from "../Components/Profile";
import { ProtectedRoute, PublicOnlyRoute } from "./ProtectedRoutes";
import Timeout from "../Components/Timeout";
import { ForgetPassword } from "../Auth/ForgetPassword";
import { ResetPassword } from "../Auth/ResetPassword";
import { CreateRide } from "../Pages/Ride";
import Dashboard from "../Components/Dashboard";

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
    path: "/forget-password",
    element: <ForgetPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/",
    element: <ProtectedRoute element={<Layout />} />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "tickets",
        element: <Tickets />,
      },
      {
        path: "masters",
        element: <Masters />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "ride",
        element: <CreateRide />,
      },
    ],
  },
]);

export default routes;

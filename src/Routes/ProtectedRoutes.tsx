import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../Config/userContext";

export const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({
  element,
}) => {
  const { user } = useUser();
  if (!user?.token) return <Navigate to="/login" replace />;
  return element;
};

export const PublicOnlyRoute: React.FC<{ element: React.ReactElement }> = ({
  element,
}) => {
  const { user } = useUser();
  // if (user?.token) return <Navigate to="/tickets" replace />;
  if (user?.token) {
    if (user?.user?.role === "user") {
      return <Navigate to="/ride" replace />;
    } else if (user?.user?.role === "vendor") {
      return <Navigate to="/masters" replace />;
    }
    return <Navigate to="/tickets" replace />;
  }
  return element;
};

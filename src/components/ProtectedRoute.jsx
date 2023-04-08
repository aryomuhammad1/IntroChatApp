import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ currentUser, children }) {
  if (!currentUser) return <Navigate to={"/Login"} replace />;
  return children;
}

export default ProtectedRoute;

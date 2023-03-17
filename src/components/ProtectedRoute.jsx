import React from "react";
import { Route, Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../App";

function ProtectedRoute({ currentUser, children }) {
  //   const { currentUser } = React.useContext(AuthContext);
  console.log("currentUser from protectedroute : ", currentUser);
  if (!currentUser) return <Navigate to={"/Login"} replace />;
  return children;
}

export default ProtectedRoute;

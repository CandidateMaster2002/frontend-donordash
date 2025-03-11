import React from "react";
import { Navigate } from "react-router-dom";
import { getRedirectPath } from "./services";

const PrivateRoute = ({ allowedRoles, component: Component }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <Navigate to="/login-page" />;
  }


  if (!allowedRoles.includes(user.userType)) {
  return <Navigate to={getRedirectPath(user.userType)} />;
  }

  return <Component />;
};

export default PrivateRoute;
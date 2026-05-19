import { Navigate }
from "react-router-dom";

import {
  getUser,
  getToken
}
from "../utils/auth";

function RoleProtectedRoute({

  children,

  allowedRoles,
}) {

  const token = getToken();

  const user = getUser();

  // NOT LOGGED IN
  if (!token) {

    return <Navigate to="/login" />;
  }

  // ROLE NOT ALLOWED
  if (
    !allowedRoles.includes(
      user?.role
    )
  ) {

    return (
      <Navigate to="/dashboard" />
    );
  }

  return children;
}

export default RoleProtectedRoute;
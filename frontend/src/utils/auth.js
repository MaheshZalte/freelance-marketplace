import { jwtDecode }
  from "jwt-decode";

export const getUserData = () => {

  const token =
    localStorage.getItem(
      "token"
    );

  if (!token) {
    return null;
  }

  return jwtDecode(token);
};

export const getToken = () => {

  return localStorage.getItem(
    "token"
  );
};

export const getUser = () => {

  const user =
    localStorage.getItem(
      "user"
    );

  return user
    ? JSON.parse(user)
    : null;
};

export const isAuthenticated =
  () => {

    return !!getToken();
};

export const logout = () => {

  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "user"
  );

  window.location.href =
    "/login";
};
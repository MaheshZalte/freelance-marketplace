import { jwtDecode } from "jwt-decode";

// Use same API base as the rest of the frontend services
const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL =", API_URL);


export const getUserData = () => {

  const token =
    localStorage.getItem("token");

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
    localStorage.getItem("user");

  return user
    ? JSON.parse(user)
    : null;
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const logout = () => {


  const token =
    localStorage.getItem(
      "token"
    );

  if (token) {

    fetch(
      `${API_URL}/users/online?online=false`,
      {
        method: "PUT",
        keepalive: true,
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      },
    ).catch(() => {});
  }

  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "user"
  );

  window.location.href =
    "/login";
};



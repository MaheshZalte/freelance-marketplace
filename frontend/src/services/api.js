import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// REQUEST INTERCEPTOR
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    // DEBUG
    console.log("TOKEN =", token);

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },

  (error) => {
    return Promise.reject(error);
  },
);

// RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (response) => response,

  (error) => {
    console.log("API ERROR =", error.response);

    // TOKEN EXPIRED / INVALID
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default API;

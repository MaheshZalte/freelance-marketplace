// import axios from "axios";
// import { logout } from "../utils/auth";


// // Get API URL from environment variables with fallback to localhost
// const API_URL = import.meta.env.VITE_API_URL;

// const API = axios.create({
//   baseURL: API_URL,
// });

// API.interceptors.request.use((req) => {

//   const token = localStorage.getItem("token");

//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }

//   return req;
// });

// API.interceptors.response.use(

//   (response) => response,

//   (error) => {

//     // TOKEN EXPIRED
//     if (
//       error.response &&
//       error.response.status === 401
//     ) {

//       logout();
//     }

//     return Promise.reject(error);
//   }
// );

// export default API;


console.log("API URL =", import.meta.env.VITE_API_URL);

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default API;
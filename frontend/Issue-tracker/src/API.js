import axios from 'axios';



export const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_PROD,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const Auth = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_PROD,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      console.error("Session expired. Redirecting to login.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
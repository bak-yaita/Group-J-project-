import axios from 'axios';


const API = axios.create({
  baseURL: "jessymay.pythonanywhere.com/",
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
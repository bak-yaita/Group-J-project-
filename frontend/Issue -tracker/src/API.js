import axios from 'axios';

const API = axios.create({
  baseURL: "http://jessymay.pythonanywhere.com/api",  // Base URL for your deployed backend
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      
      if (status === 403 || status === 401) {
        console.error("Session expired or unauthorized. Redirecting to login.");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;

import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;
const api = axios.create({
  baseURL: backendURL,
  withCredentials: true,
});

// add token to auth header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

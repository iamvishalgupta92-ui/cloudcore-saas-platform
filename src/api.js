 import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Automatically attach JWT to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired/invalid JWT
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("tenantId");
      localStorage.removeItem("email");

      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export default api;
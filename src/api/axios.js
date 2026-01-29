import axios from "axios";

// Base URL from .env
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// MAIN API instance
const API = axios.create({
  baseURL: BASE_URL,
});

// SEPARATE instance ONLY for refresh (no interceptors)
const refreshAPI = axios.create({
  baseURL: BASE_URL,
});

/* ================================
   REQUEST INTERCEPTOR
================================ */
API.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem("access");
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================================
   RESPONSE INTERCEPTOR
================================ */
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ❌ If refresh endpoint itself fails → logout
    if (originalRequest.url.includes("/api/refresh/")) {
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) throw new Error("No refresh token");

        // ✅ Refresh token request
        const res = await refreshAPI.post("/api/refresh/", { refresh });

        localStorage.setItem("access", res.data.access);

        originalRequest.headers.Authorization =
          `Bearer ${res.data.access}`;

        return API(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
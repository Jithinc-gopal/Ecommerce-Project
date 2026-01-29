import axios from "axios";

// MAIN API instance (used everywhere in your app)
const API = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});

// SEPARATE instance ONLY for refresh (no interceptors)
const refreshAPI = axios.create({
  baseURL: "http://127.0.0.1:8000/",
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

    // ❌ If refresh endpoint itself fails → do NOT retry
    if (originalRequest.url.includes("/api/refresh/")) {
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");

        if (!refresh) {
          throw new Error("No refresh token");
        }

        // ✅ Use refreshAPI (NO Authorization header)
        const res = await refreshAPI.post("/api/refresh/", {
          refresh,
        });

        localStorage.setItem("access", res.data.access);

        // Update headers and retry original request  
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
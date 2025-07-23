import axios from "axios";
import { useAuthStore } from "../stores/auth";

const api = axios.create({
  baseURL: "https://api.7srating.uz/api/",
  headers: {
    "Accept-Language": localStorage.getItem("locale") || "en",
  },
});

api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore();

    if (error.response && error.response.status === 401) {
      try {
        const refreshResponse = await axios.post(
          "https://api.7srating.uz/api/user/refresh-token/",
          {
            refresh: authStore.refreshToken,
          }
        );

        authStore.token = refreshResponse.data.token;

        error.config.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
        return api.request(error.config);
      } catch (refreshError) {
        authStore.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

import axios from "axios";
import { useAuthStore } from "../stores/auth";

// Create an instance of Axios
const api = axios.create({
  // baseURL: "https://api.zmseld.com", // Replace with your API URL
  // timeout: 10000,
  baseURL: "https://api.7srating.uz/api/",
  headers: {
    "Accept-Language": localStorage.getItem("locale") || "en", // Add fallback for locale
  },
});

// Request Interceptor to Attach Token
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

// Response Interceptor to Handle Token Expiry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore();

    // Check if the error is due to an expired token
    if (error.response && error.response.status === 401) {
      try {
        // Attempt to refresh the token
        const refreshResponse = await axios.post(
          "https://api.7srating.uz/api/user/refresh-token/",
          {
            refresh: authStore.refreshToken, // Assumes you store the refresh token
          }
        );

        // Update the token in the store
        authStore.token = refreshResponse.data.token;

        // Retry the original request with the new token
        error.config.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
        return api.request(error.config);
      } catch (refreshError) {
        // If refresh fails, log out the user
        authStore.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

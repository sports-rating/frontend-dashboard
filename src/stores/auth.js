import { defineStore } from "pinia";
import api from "../utils/axios";
import router from "../router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    refreshToken: null,
    loginPayload: null,
  }),
  actions: {
    async login(payload) {
      try {
        await api.post(
          "https://api.7srating.uz/api/user/auth/send-code/",
          payload
        );
        this.loginPayload = payload;
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },

    async resetVerify() {
      try {
        const payload = { ...this.loginPayload };
        await api.post(
          "https://api.7srating.uz/api/user/auth/send-code/",
          payload
        );
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },

    async verify(verify) {
      try {
        const payload = { ...this.loginPayload, ...verify };
        const response = await api.post(
          "https://api.7srating.uz/api/user/auth/verify-code/",
          payload
        );
        console.log("API response:", response.data.data);
        this.token = response.data.data.tokens.access;
        this.refreshToken = response.data.data.tokens.refresh;

        api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },

    // async fetchUser() {
    //   if (!this.token) return;

    //   try {
    //     const response = await api.get("/user/me");
    //     this.user = response.data.data;
    //   } catch (error) {
    //     console.error("Fetching user failed:", error);
    //     throw error;
    //   }
    // },
    logout() {
      this.token = null;
      this.refreshToken = null;
      delete api.defaults.headers.common["Authorization"];
      router.push("/login");
    },
  },
  persist: true,
});

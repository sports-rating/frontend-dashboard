import { defineStore } from "pinia";

export const useRangeDate = defineStore("date", {
  state: () => ({
    date: {},
  }),
  actions: {
    async range(payload) {
      try {
        this.date = payload;
        console.log(this.date);
      } catch (error) {
        console.error("date error", error);
      }
    },
  },
  persist: false,
});

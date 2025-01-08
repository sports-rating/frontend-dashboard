// src/composables/usePostSportsman.js

import { useMutation } from "@tanstack/vue-query";
import axios from "axios";

export const usePostSportsman = () => {
  const mutationFn = async (formData) => {
    return axios
      .post(
        "https://8321-90-156-194-145.ngrok-free.app/api/user/profile/sportsman/",
        formData
      )
      .then((res) => res.data);
  };

  return useMutation(mutationFn);
};

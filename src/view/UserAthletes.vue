<template>
  <div class="mx-auto p-4 rounded-xl border">
    <Loading :isLoading="isLoading || isUploading" />
    <h2 class="text-2xl font-bold mb-6">Добавить спортсменов</h2>

    <el-steps
      style="max-width: 600px"
      :active="active"
      finish-status="success"
    ></el-steps>

    <UserStep1
      v-if="active === 1"
      :form="form"
      :handleFileUpload="handleFileUpload"
      :athleteTypes="athleteTypes"
      :errors="errors"
    />

    <UserStepAthletes2
      v-if="active === 2"
      :education="form.educations"
      @update-education="(updatedEducation) => (form.educations = updatedEducation)"
    />

    <UserStepAthletes3
      v-if="active === 3"
      :type-results="form.results"
      @update-result="(updatedResults) => (form.results = updatedResults)"
    />
    <UserStepAthletes4
      v-if="active === 4"
      :media_ids="form.media_ids"
      @update-media="(updatedMedia) => (form.media_ids = updatedMedia)"
    />

    <div class="flex justify-end space-x-4 mt-5">
      <button
        type="button"
        @click="goBack"
        class="px-4 py-2 border border-gray-300 rounded-md p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Назад
      </button>
      <button
        type="submit"
        @click="handleSubmit"
        :disabled="
          isSubmitting ||
          (active === 2 && form.educations.length === 0) ||
          (active === 3 && form.results.length === 0)
        "
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opadistrict-50"
      >
        {{ isSubmitting ? "Сохранение..." : active === 4 ? "Сохранить" : "Продолжить" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import UserStep1 from "../components/UserAthletes/UserStepAthletes1.vue";
import UserStepAthletes2 from "../components/UserAthletes/UserStepAthletes2.vue";
import UserStepAthletes3 from "../components/UserAthletes/UserStepAthletes3.vue";
import UserStepAthletes4 from "../components/UserAthletes/UserStepAthletes4.vue";
import Loading from "../components/Loading.vue";
import api from "../utils/axios";
import router from "../router";

const errors = reactive({});
const isSubmitting = ref(false);
const isUploading = ref(false);
const active = ref(1);
const isLoading = ref(false);
const athleteTypes = ["Любитель", "Профессионал", "Начинающий"];

const form = reactive({
  phone_number: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  pinfl: "",
  gender: "",
  user_role: "sportsman",
  email: "",
  media_ids: [],
  birth_date: "",
  educations: [],
  results: [],
  region: "",
  district: "",
  
  sportsman_profile: {
    sport_rank: "",
    sport_id: "",
    trainer_id: "",
    division: "",
    user_metrics: {
      height: "",
      weight: "",
    },
    bio: "",
    address: {
      
      street: "",
      place_of_birth: "",
      citizenship: "",
    },
    social_media: {
      telegram: "",
      instagram: "",
    },
  },
});

const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);

  if (active.value === 1) {
    if (!form.first_name) errors.first_name = "Имя обязательно.";
    if (!form.last_name) errors.last_name = "Фамилия обязательна.";
    // if (!form.phone_number) {
    //   errors.phone_number = 'Номер телефона обязателен.';
    // } else {
    //   const digitsOnly = form.phone_number.replace(/\D/g, '');
    //   if (digitsOnly.length > 17) {
    //     errors.phone_number = 'Номер телефона не должен превышать 17 цифр.';
    //   } else if (digitsOnly.length < 9) {
    //     errors.phone_number = 'Номер телефона слишком короткий.';
    //   }
    // }

    if (!form.pinfl) {
      errors.pinfl = "ЖШШИР обязательна.";
    } else {
      const trimmedPinfl = form.pinfl.replace(/\s/g, "");
      if (trimmedPinfl.length !== 14) {
        errors.pinfl = "ЖШШИР должен содержать ровно 14 символов";
      }
    }
    if (!form.middle_name) errors.middle_name = "Отчество обязательна.";
    if (!form.sportsman_profile.trainer_id) errors.trainer_id = "Tренер  обязательна.";
    if (!form.sportsman_profile.sport_rank)
      errors.sport_rank = "Cпортивный разряд обязателен.";
    if (!form.sportsman_profile.sport_id)
      errors.sport_direction = "Направление спорта обязательно.";
    if (!form.sportsman_profile.division)
      errors.division = "Девизион спортсмена обязательно.";
    if (!form.birth_date) errors.birth_date = "Дата рождения обязательна.";
    if (!form.gender) errors.gender = "Пол обязателен.";
    if (!form.sportsman_profile.bio) errors.bio = "Обо мне обязателен.";
    if (!form.sportsman_profile.user_metrics.height) errors.height = "Рост обязатлен.";
    if (!form.sportsman_profile.user_metrics.weight) errors.weight = "Вес обязателен.";
    if (!form.region) errors.region = "Регион обязателен.";
    if (!form.district) errors.district = "Город обязателен.";
    if (!form.sportsman_profile.address.street) errors.street = "Улица обязателен.";
    if (!form.sportsman_profile.address.place_of_birth)
      errors.place_of_birth = "Место рождения обязательна.";
    if (!form.sportsman_profile.address.citizenship)
      errors.citizenship = "Гражданство обязательна.";
  }

  return Object.keys(errors).length === 0;
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];

  if (!file) {
    console.error("No file selected.");
    return;
  }
  isUploading.value = true;

  // Agar avval yuklangan fayl bo'lsa, uni o‘chirish
  if (form.photoId) {
    try {
      await api.delete(`https://api.7srating.uz/api/user/media/${form.photoId}/`);
      console.log("Oldingi fayl o‘chirildi:", form.photoId);
    } catch (error) {
      console.error(
        "Oldingi faylni o‘chirishda xatolik:",
        error.response?.data || error.message
      );
    }
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", "user");
  formData.append("is_profile_photo", true);

  try {
    // Yangi faylni yuklash
    const response = await api.post(
      "https://api.7srating.uz/api/user/media-upload/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!Array.isArray(form.media_ids)) {
      form.media_ids = [];
    }

    // Eski IDni o‘chirib, yangisini qo‘shish
    form.media_ids = [response.data.data.id];
    form.photoId = response.data.data.id; // Oxirgi yuklangan fayl ID sini saqlash
    form.photoName = file.name;

    console.log("Yangi fayl yuklandi:", response.data.data.id);
  } catch (error) {
    console.error("Fayl yuklashda xatolik:", error.response?.data || error.message);
  } finally {
    isUploading.value = false;
  }
};

const handleSubmit = async () => {
  if (!validateForm()) {
    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey) {
      toast.error(errors[firstErrorKey], {
        autoClose: 3000,
      });
    }
    return;
  }

  console.log(form);
  

  if (active.value < 4) {
    active.value++;
    console.log(form, "form");
  } else {
    isSubmitting.value = true;
    isLoading.value = true;

    try {
      const payload = {
        ...form,
        phone_number:
          form.phone_number.length === 17 ? form.phone_number.replaceAll(" ", "") : null,
          district: form.district.id,
        region: form.region.id,
          
        sportsman_profile: {
          ...form.sportsman_profile,
          send_request:false,
        },
      };

      await api.post("https://api.7srating.uz/api/user/profile/sportsman/", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Success to Sportsman", {
        autoClose: 3000,
      });

      localStorage.removeItem("selectedSport");
      localStorage.removeItem("selectedTrainer");
      router.push("/");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.response.data.message, {
        autoClose: 3000,
      });
    } finally {
      isSubmitting.value = false;
      isLoading.value = false;
    }
  }
};

const goBack = () => {
  if (active.value > 1) {
    active.value -= 1;
  } else {
    window.history.go(-1);

    localStorage.removeItem("schools");
    localStorage.removeItem("selectedSport");
    localStorage.removeItem("selectedTrainer");

    Object.keys(form).forEach((key) => {
      form[key] = Array.isArray(form[key]) ? [] : "";
    });
    Object.keys(errors).forEach((key) => delete errors[key]);
  }
};
</script>

<template>
  <div class="mx-auto p-4 rounded-xl border">
    <Loading :isLoading="isLoading || isUploading" />
    <h2 class="text-2xl font-bold mb-6">Обновлять спортсменов</h2>

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
    <UserStepAthletes5
      v-if="active === 4"
      :media_ids="form.media_ids"
      :media_bay="mediaBay"
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
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {{ isSubmitting ? "Сохранение..." : active === 4 ? "Сохранить" : "Продолжить" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { ElMessage } from "element-plus";
import UserStep1 from "../components/UserAthletes/UserStepAthletes1.vue";
import UserStepAthletes2 from "../components/UserAthletes/UserStepAthletes2.vue";
import UserStepAthletes3 from "../components/UserAthletes/UserStepAthletes3.vue";
import UserStepAthletes5 from "../components/UserAthletes/UserStepAthletes5.vue";
import Loading from "../components/Loading.vue";
import api from "../utils/axios";
import router from "../router";
import { useRoute } from "vue-router";

const route = useRoute();
const errors = reactive({});
const isSubmitting = ref(false);
const isUploading = ref(false);
const active = ref(1);
const isLoading = ref(false);
const data = ref([]);
const mediaBay = ref([]);

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
  photoName: "",
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
      height: "",
      weight: "",
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

const getData = async () => {
  try {
    const res = await api.get(
      `https://api.7srating.uz/api/user/profile/sportsman/${route.params.id}`
    );

    data.value = res.data.data;
    form.first_name = res.data.data.first_name;
    form.last_name = res.data.data.last_name;
    form.middle_name = res.data.data.middle_name;
    form.birth_date = res.data.data.birth_date;
    form.phone_number = res.data.data.phone_number;
    form.pinfl = res.data.data.pinfl;
    form.email = res.data.data.email;
    form.sportsman_profile.sport_rank = res.data.data.sportsman_profile.sport_rank;
    form.sportsman_profile.sport_id = res.data.data.sportsman_profile.sport.id;
    form.sportsman_profile.division = res.data.data.sportsman_profile.division;
    form.sportsman_profile.height =
      res.data.data.sportsman_profile.height;
    form.sportsman_profile.weight =
      res.data.data.sportsman_profile.weight;
    form.gender = res.data.data.gender;
    form.sportsman_profile.bio = res.data.data.sportsman_profile.bio;
    form.region = res.data.data.region;
    form.district = res.data.data.district;
    form.sportsman_profile.address.street =
      res.data.data.sportsman_profile.address.street;
    form.sportsman_profile.address.place_of_birth =
      res.data.data.sportsman_profile.address.place_of_birth;
    form.sportsman_profile.address.citizenship =
      res.data.data.sportsman_profile.address.citizenship;
    form.sportsman_profile.social_media.telegram =
      res.data.data.sportsman_profile.social_media.telegram;
    form.sportsman_profile.social_media.instagram =
      res.data.data.sportsman_profile.social_media.instagram;
    form.sportsman_profile.trainer_id = res.data.data.sportsman_profile.trainer_id;

    form.educations = res.data.data.educations.map((edu) => ({
      id: edu.id || "",
      school_id: edu.school_id || "",
      sport_id: edu.sport_id || "",
      start_year: edu.start_year || "",
      end_year: edu.end_year || "",
      currently_studying: edu.currently_studying || false,
    }));

    form.results = res.data.data.results.map((res) => ({
      id: res.id || "",
      name: res.tournament_name || "",
      // country: res.country || "",
      year: res.year || "",
      tournament_id: res.tournament_id || "",
      trainer_id: res.trainer_id || "",
      trainer: res.trainer_name || "",
      rating: res.rating || "",
      currently_participating: res.currently_participating || false,
    }));

    form.media_ids = res.data.data.media.map((item) => item.id);
    mediaBay.value = res.data.data.media;

    const profilePhoto = res.data.data.media.find(
      (item) => item.is_profile_photo === true
    );

    if (profilePhoto) {
      form.photoId = profilePhoto.id;
      form.photoName = profilePhoto.file?.split("/").pop();
    }
  } catch (e) {
    console.log(e);
  }
};

getData();

const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);

  if (active.value === 1) {
    if (!form.first_name) errors.first_name = "Имя обязательно.";
    if (!form.last_name) errors.last_name = "Фамилия обязательна.";

    if (!form.pinfl) {
      errors.pinfl = "ЖШШИР обязательна.";
    } else {
      const trimmedPinfl = form.pinfl.replace(/\s/g, "");
      if (trimmedPinfl.length !== 14) {
        errors.pinfl = "ЖШШИР должен содержать ровно 14 символов";
      }
    }
    if (!form.middle_name) errors.middle_name = "Отчество обязательна.";
    if (!form.sportsman_profile.sport_rank)
      errors.sport_rank = "Cпортивный разряд обязателен.";
    if (!form.sportsman_profile.sport_id)
      errors.sport_direction = "Направление спорта обязательно.";
    if (!form.sportsman_profile.division)
      errors.division = "Девизион спортсмена обязательно.";
    if (!form.birth_date) errors.birth_date = "Дата рождения обязательна.";
    if (!form.gender) errors.gender = "Пол обязателен.";
    if (!form.sportsman_profile.bio) errors.bio = "Обо мне обязателен.";
    if (!form.sportsman_profile.height) errors.height = "Рост обязатлен.";
    if (!form.sportsman_profile.weight) errors.weight = "Вес обязателен.";
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

  try {
    // Eski profil rasmini o‘chirish (agar mavjud bo‘lsa)
    if (form.photoId) {
      await api.delete(`https://api.7srating.uz/api/user/media/${form.photoId}/`);
      form.media_ids = form.media_ids.filter((id) => id !== form.photoId); // Eski ID ni olib tashlash
      form.photoId = null; // ID ni tozalash
    }

    // Yangi rasmni yuklash
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "user");
    formData.append("is_profile_photo", true);

    const response = await api.post(
      "https://api.7srating.uz/api/user/media-upload/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const newPhotoId = response.data.data.id;
    form.photoId = newPhotoId; 
    form.media_ids.push(newPhotoId); 
    form.photoName = file.name;
  } catch (error) {
    console.error("File upload failed:", error.response?.data || error.message);
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

  if (active.value < 4) {
    active.value++;
    console.log(form);
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

      await api.put(
        `https://api.7srating.uz/api/user/profile/sportsman/${route.params.id}/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Success to Sportsman", {
        autoClose: 3000,
      });
      localStorage.removeItem("selectedSport");
      localStorage.removeItem("selectedTrainer");
      router.push("/");
    } catch (error) {
      console.error("Submission error:", error);
      ElMessage.error(error.response.data.message);
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

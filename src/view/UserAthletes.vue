<template>
  <div class=" mx-auto  p-4 rounded-xl border">
  <Loading :isLoading="isLoading || isUploading" />
    <h2 class="text-2xl font-bold mb-6">Добавить спортсменов</h2>
    
      <el-steps style="max-width: 600px" :active="active" finish-status="success"></el-steps>
    
    
    <UserStep1 
    v-if="active === 1"
    :form="form"
    :handleFileUpload="handleFileUpload" 
    :athleteTypes="athleteTypes"
    :sportsDirections="sportsDirections"
    :sportsDivisions="sportsDivisions"
    :regions="regions"
    :cities="cities"
    :countries="countries"
    :errors="errors"
    />

    <UserStepAthletes2
    v-if="active === 2"
    :education="form.sportsman_profile.educations" 
    @update-education="(updatedEducation) => form.sportsman_profile.educations = updatedEducation"
    />

    <UserStepAthletes3 
    v-if="active === 3"
    :type-results="form.sportsman_profile.results" 
    @update-result="(updatedResults) => form.sportsman_profile.results = updatedResults"
    />
    <UserStepAthletes4 
    v-if="active === 4"
    :media_ids="form.sportsman_profile.media_ids" 
    @update-media="(updatedMedia) => form.sportsman_profile.media_ids = updatedMedia"
    />
    
      <div class="flex justify-end space-x-4 mt-5">
        <button
          type="button"
          @click="goBack"
          class="px-4 py-2 border border-gray-300 rounded-md  p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Назад
        </button>
        <button
          type="submit"
          @click="handleSubmit"
          :disabled="isSubmitting ||
          (active === 2 && (form.sportsman_profile.educations.length === 0)) ||
          (active === 3 && (form.sportsman_profile.results.length === 0 ))

          "
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {{ isSubmitting ? 'Сохранение...' : active === 4 ? 'Сохранить' :'Продолжить' }}
        </button>

        

      </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import UserStep1 from '../components/UserAthletes/UserStepAthletes1.vue';
import UserStepAthletes2 from '../components/UserAthletes/UserStepAthletes2.vue';
import UserStepAthletes3 from '../components/UserAthletes/UserStepAthletes3.vue';
import UserStepAthletes4 from '../components/UserAthletes/UserStepAthletes4.vue';
import Loading from "../components/Loading.vue"
import api from "../utils/axios"
import router from '../router';


const errors = reactive({})
const isSubmitting = ref(false)
const isUploading = ref(false);
const active = ref(1)
const isLoading = ref(false);

const athleteTypes = ['Любитель', 'Профессионал', 'Начинающий']
const sportsDirections = ['Футбол', 'Баскетбол', 'Теннис']
const sportsDivisions = ['Дивизион 1', 'Дивизион 2', 'Дивизион 3']
const regions = ['Москва', 'Санкт-Петербург', 'Новосибирск']
const cities = ['Город 1', 'Город 2', 'Город 3']
const countries = ['Россия', 'Казахстан', 'Беларусь']



const form = reactive({
  first_name: '',
  last_name: '',
  middle_name: '',
  birth_date: '',
  phone_number: '',
  user_role:'sportsman',
  email: '',
  photo_id: '',
  sportsman_profile: {
    sport_type: '',
    sport_id: '',
    motto: '',
    height: '',
    weight: '',
    gender: '',
    about_me:'',
    region: '',
    city: '',
    street: '',
    place_of_birth: '',
    citizenship: '',
    telegram: '',
    instagram: '',
    moving_date_month: '',
    moving_date_year:'',
    educations: [],
    media_ids: [],
    results: [],
  },

})




const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);

  if (active.value === 1) {
    if (!form.first_name) errors.first_name = 'Имя обязательно.';
    if (!form.last_name) errors.last_name = 'Фамилия обязательна.';
    if (!form.phone_number) {
      errors.phone_number = 'Номер телефона обязателен.';
    } else {
      const digitsOnly = form.phone_number.replace(/\D/g, '');
      if (digitsOnly.length > 17) {
        errors.phone_number = 'Номер телефона не должен превышать 17 цифр.';
      } else if (digitsOnly.length < 9) {
        errors.phone_number = 'Номер телефона слишком короткий.';
      }
    }
    if (!form.middle_name) errors.middle_name = 'Отчество обязательна.';
    if (!form.sportsman_profile.sport_type) errors.sport_type = 'Тип спортсмена обязателен.';
    if (!form.sportsman_profile.sport_id) errors.sport_direction = 'Направление спорта обязательно.';
    if (!form.sportsman_profile.motto) errors.motto = 'Девизион спортсмена обязательно.';
    if (!form.birth_date) errors.birth_date = 'Дата рождения обязательна.';
    if (!form.sportsman_profile.gender) errors.gender = 'Пол обязателен.';
    if (!form.sportsman_profile.about_me) errors.about_me = 'Обо мне обязателен.';
    if (!form.sportsman_profile.height) errors.height = 'Рост обязатлен.';
    if (!form.sportsman_profile.weight) errors.weight = 'Вес обязателен.';
    if (!form.sportsman_profile.region) errors.region = 'Регион обязателен.';
    if (!form.sportsman_profile.city) errors.city = 'Город обязателен.';
    if (!form.sportsman_profile.street) errors.street = 'Улица обязателен.';
    if (!form.sportsman_profile.moving_date_year) errors.moving_date_year = 'Год обязателен.';
    if (!form.sportsman_profile.moving_date_month) errors.moving_date_month = 'Месяц обязателен.';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Введите корректный адрес электронной почты.';
    if (!form.sportsman_profile.place_of_birth) errors.place_of_birth = 'Место рождения обязательна.';
    if (!form.sportsman_profile.citizenship) errors.citizenship = 'Гражданство обязательна.';
    // if (!form.sportsman_profile.telegram || !/^https?:\/\/(www\.)?t\.me\/[a-zA-Z0-9_]+$/.test(form.sportsman_profile.telegram)) {
    // errors.telegram = 'Введите корректный линк в Телеграм (например, https://t.me/username).';
    // }

    //  if (!form.sportsman_profile.instagram || !/^https?:\/\/(www\.)?t\.me\/[a-zA-Z0-9_]+$/.test(form.sportsman_profile.instagram)) {
    // errors.instagram = 'Введите корректный линк в Инстаграм (например, https://t.me/username).';
    // }
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

  const formData = new FormData();
  formData.append("file", file);
  formData.append("owner", "sportsman");

  try {
    // Send the file using axios
    const response = await api.post(
      "https://api.7srating.uz/api/user/media-upload/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    isUploading.value = true;
    // Ensure form.photo_id is an array and append the new id
    // if (!Array.isArray(form.photo_id)) {
    //   form.photo_id = [];
    // }
    // form.photo_id.push(response.data.data.id);
    form.photo_id = response.data.data.id; 

    // Optionally, store the file name
    form.photoName = file.name;
  } catch (error) {
    console.error("File upload failed:", error.response?.data || error.message);
  }
  finally {
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
    
    
  } else {
    isSubmitting.value = true;
    isLoading.value = true;

    try {
      const payload = {
        ...form,
        phone_number: form.phone_number.replaceAll(' ', ''),
      };

      await api.post(
        "https://api.7srating.uz/api/user/profile/sportsman/",
        payload, 
        {
          headers: {
            'Content-Type': 'application/json', // JSON formatda yuborish
          },
        }
      );
      toast.success('Success to Sportsman', {
      autoClose: 3000,
    })
        router.push('/')
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.response.data.message, {
      autoClose: 3000,
    })
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
    localStorage.removeItem('schools');

    Object.keys(form).forEach((key) => {
    form[key] = Array.isArray(form[key]) ? [] : '';
    });
    Object.keys(errors).forEach((key) => delete errors[key]);
  }
};


</script>
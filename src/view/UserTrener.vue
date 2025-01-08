<template>
  <div class=" mx-auto  p-4 rounded-xl border">
    <h2 class="text-2xl font-bold mb-6">Добавить тренера</h2>
    
      <el-steps style="max-width: 600px" :active="active" finish-status="success"></el-steps>
    
    
    <UserStepTrener1 
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

    <UserStepTrener2
    v-if="active === 2"
    :education="form.education" 
    @update-education="(updatedEducation) => form.education = updatedEducation"
    />

    <UserStepTrener3 
    v-if="active === 3"
    :type-results="form.results" 
    @update-result="(updatedResults) => form.results = updatedResults"
    />
    <UserStepTrener4 
    v-if="active === 4"
    :media="form.media" 
    @update-media="(updatedMedia) => form.media = updatedMedia"
    />
    
      <!-- Form Actions -->
      <div class="flex justify-end space-x-4 mt-5">
        <button
          type="button"
          @click="resetForm"
          class="px-4 py-2 border border-gray-300 rounded-md  p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Отмена
        </button>
        <button
          type="button"
          @click="saveAsDraft"
          class="px-4 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Сохранить как черновик
        </button>
        <button
          type="submit"
          @click="handleSubmit"
          :disabled="isSubmitting"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {{ isSubmitting ? 'Сохранение...' : active === 4 ? 'Сохранить' :'Продолжить' }}
        </button>

        

      </div>
  </div>
</template>




<script setup>
import { reactive, ref } from 'vue'
import UserStepTrener1 from '../components/UserTrener/UserStepTrener1.vue';
import UserStepTrener2 from '../components/UserTrener/UserStepTrener2.vue';
import UserStepTrener3 from '../components/UserTrener/UserStepTrener3.vue';
import UserStepTrener4 from '../components/UserTrener/UserStepTrener4.vue';

const errors = reactive({});
const isSubmitting = ref(false);
const active = ref(1);

const athleteTypes = ['Любитель', 'Профессионал', 'Начинающий'];
const sportsDirections = ['Футбол', 'Баскетбол', 'Теннис'];
const sportsDivisions = ['Дивизион 1', 'Дивизион 2', 'Дивизион 3'];
const regions = ['Москва', 'Санкт-Петербург', 'Новосибирск'];
const cities = ['Город 1', 'Город 2', 'Город 3'];
const countries = ['Россия', 'Казахстан', 'Беларусь'];

const form = reactive({
  firstName: '',
  lastName: '',
  surName: '',
  athleteType: '',
  sportsDirection: '',
  sportsDivision: '',
  birthDate: '',
  gender: '',
  photo: null,
  region: '',
  city: '',
  street: '',
  movingDateMonth: '',
  movingDateYear: '',
  phone: '',
  birthPlace: '',
  citizenship: '',
  telegram: '',
  instagram: '',
  email: '',
  photoName: '',
  education: {
    school: '',
    sport: '',
    date: '',
    period: '',
  },
  results: {
    name: '',
    icon: '',
    country: '',
    date: '',
    rating: '',
  },
  media: {
    photos: {
      url: '',
      name: '',
    },
    videos: {
      thumbnail: '',
      name: '',
    },
  },
});

const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach((key) => delete errors[key]);

  // Validate required fields
  // if (active.value === 1) {
    
  //   if (!form.firstName) errors.firstName = 'Имя обязательно.';
  //   if (!form.lastName) errors.lastName = 'Фамилия обязательна.';
  //   if (!form.surName) errors.surName = 'Отчество обязательна.';
  //   if (!form.athleteType) errors.athleteType = 'Тип спортсмена обязателен.';
  //   if (!form.sportsDirection) errors.sportsDirection = 'Направление спорта обязательно.';
  //   if (!form.sportsDivision) errors.sportsDivision = 'Девизион спортсмена обязательно.';
  //   if (!form.birthDate) errors.birthDate = 'Дата рождения обязательна.';
  //   if (!form.gender) errors.gender = 'Пол обязателен.';
  //   if (!form.region) errors.region = 'Регион обязателен.';
  //   if (!form.movingDateYear) errors.movingDateYear = 'Год обязателен.';
  //   if (!form.movingDateMonth) errors.movingDateMonth = 'Месяц обязателен.';
  //   if (!form.street) errors.street = 'Улица обязателен.';
  //   if (!form.city) errors.city = 'Город обязателен.';
  //   if (!form.phone) errors.phone = 'Телефон обязателен.';
  //   if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Введите корректный адрес электронной почты.';
  //   if (!form.photo) errors.photo = 'Фотография обязательна.';
  //   if (!form.birthPlace) errors.birthPlace = 'Место рождения обязательна.';
  //   if (!form.citizenship) errors.citizenship = 'Гражданство обязательна.';
  //   if (!form.telegram) errors.telegram = 'Телеграм обязательна.';
  //   if (!form.instagram) errors.instagram = 'Инстаграм обязательна.';
  // }

  // if (active.value === 2) {
    
  //   // Validation for nested objects
  //   if (!form.education.school) errors['education.school'] = 'Школа обязательна.';
  //   if (!form.education.sport) errors['education.sport'] = 'Спорт обязателен.';
  //   if (!form.education.date) errors['education.date'] = 'Дата обязательна.';
  //   if (!form.results.name) errors['results.name'] = 'Название результата обязательно.';
  //   if (!form.results.country) errors['results.country'] = 'Страна обязательна.';
  // }


  // Return validation result
  return Object.keys(errors).length === 0;
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.photo = file;
    form.photoName = file.name;
    console.log('File uploaded:', file);
  }
};

const handleSubmit = async () => {
  if (!validateForm()) {
    console.error('Validation failed:', errors);
    return;
  }

  if (active.value < 4) active.value++;
  else {
    console.log('Final step submitted');
  }

  isSubmitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Form submitted:', form);
  } catch (error) {
    console.error('Submission error:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const saveAsDraft = () => {
  console.log('Saved as draft:', form);
};

const resetForm = () => {
  Object.keys(form).forEach((key) => {
    form[key] = key === 'photo' ? null : typeof form[key] === 'object' ? {} : '';
  });
  Object.keys(errors).forEach((key) => delete errors[key]);
};
</script>

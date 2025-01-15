<template>
  <div class=" mx-auto  p-4 rounded-xl border">
    <h2 class="text-2xl font-bold mb-6">Добавить Школы</h2>


      <form @submit.prevent="handleSubmit" class="space-y-8" >
      <section>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label class="block text-sm font-medium text-gray-700">Имя</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Введите Имя"
              class="mt-1 bg-white block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.name">{{ errors.name }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Номер телефона</label>
            

            <vue-tel-input
              v-model="form.phone_number"
              :autoFormat="true"
              :inputOptions="{
                showDialCode: true,
                maxlength: 17,
                valid: false,
                required: true,
                type: 'tel',
                autocomplete: 'on',
                autofocus: false,
              }"
              :dropdownOptions="{
                showFlags: true,
              }"
              :onlyCountries="['UZ']"
              :defaultCountry="'UZ'"
              class="!bg-gray-200 mt-1 p-[2px] w-full rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200"
            ></vue-tel-input>
            <span class="text-red-500 mt-1" v-if="errors.phone_number">{{ errors.phone_number }}</span>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Место</label>
            <input
              v-model="form.address"
              type="text"
              placeholder="Введите Место"
              class="mt-1  bg-white block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />

            <span class="text-red-500 mt-1" v-if="errors.address">{{ errors.address }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Электронный адрес</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="Введите электронную почту"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.email">{{ errors.email }}</span>
          </div>


          <div>
            <label class="block text-sm font-medium text-gray-700">Веб-сайт</label>
            <input
              v-model="form.website"
              type="text"
              placeholder="Введите линк в website"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.website">{{ errors.website }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Дата рождения</label>
            

            <input v-model="form.established_date" type="date"   min="2000-01-01" max="2026-01-01" class="!h-10 !w-full !mt-1 !border !rounded-md p-2">

            <span class="text-red-500 mt-1" v-if="errors.established_date">{{ errors.established_date }}</span>
          </div>


          

          

          <div>
            <label class="block text-sm font-medium text-gray-700">Введите спорт</label>

        <multiselect
              v-model="form.sport_ids"
              :options="data"
              label="name"
              track-by="id"
              value-prop="id"
              placeholder="Выберите sport"
              class="mt-1 "
              :multiple="true"
            />
            <span class="text-red-500 mt-1" v-if="errors.sport_ids">{{ errors.sport_ids }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Введите тренер</label>

        <multiselect
              v-model="form.trainer_ids"
              :options="dataTrainer"
              label="first_name"
              track-by="id"
              value-prop="id"
              placeholder="Выберите trainer"
              class="mt-1 "
              :multiple="true"
            />
<span class="text-red-500 mt-1" v-if="errors.trainer_ids">{{ errors.trainer_ids }}</span>
          </div>

            

        </div>
      </section>



    </form>
      <div class="col-span-1 mt-5">
      <h2 class="text-2xl font-semibold mb-4">Фотографии</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="(photo, index) in photos"
          :key="'photo-' + index"
          class="relative aspect-video bg-gray-100 rounded-lg overflow-hidden"
        >
          <img :src="photo.url" :alt="photo.name" class="w-full h-full object-cover" />
          <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-100 text-white text-xs p-2 flex justify-between items-center">
            <span>{{ photo.name }}</span>
            <button @click="deletePhoto(photo, index)" class="text-red-500 hover:text-red-700 font-bold z-20">Удалить</button>
          </div>
        </div>

        <label
          class="cursor-pointer aspect-video flex flex-col items-center justify-center bg-pink-50 rounded-lg border-2 border-dashed border-pink-200 hover:bg-pink-100 transition-colors"
        >
          <input type="file" accept="image/*" class="hidden" @change="handleFileUpload" />
          <div class="w-8 h-8 mb-2 text-pink-500">
            <img src="../../assets/img/plus.svg" alt="plus" />
          </div>
          <span class="text-sm text-pink-600">Добавить новый фотографию</span>
        </label>
      </div>
      </div>
    
      <div class="flex justify-end space-x-4 mt-5">
        <button
          type="button"
          @click="goBack"
          class="px-4 py-2 border border-gray-300 rounded-md  p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Отмена
        </button>
        <button
          type="submit"
          @click="handleSubmit"
          :disabled="isSubmitting || isUploading"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {{ isSubmitting ?  'Сохранить...' :'Сохранить' }}
        </button>

        

      </div>
  </div>
</template>

<script setup>
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css';
import { reactive, ref } from 'vue'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import api from "../../utils/axios"
import router from '../../router';

const errors = reactive({})
const isSubmitting = ref(false)
const data = ref([])
const dataTrainer = ref([])
const isUploading = ref(false); 
const photos = ref([]);


const form = reactive({
  name: '',
  address: '',
  phone_number: '',
  established_date: '',
  photoNames:'',
  website: '',
  media_ids: [],
  sport_ids: [],
  trainer_ids:[],
})


const deletePhoto = async (photo, index) => {
  try {
    await api.delete(`https://api.7srating.uz/api/user/media/${photo.id}/`);
    photos.value.splice(index, 1);
    form.media_ids = form.media_ids.filter((id) => id !== photo.id);
  } catch (error) {
    console.error('Failed to delete photo:', error.response?.data || error.message);
  }
};


const handleFileUpload = async (event) => {
  
  const file = event.target.files[0];
  if (!file) return;
  isUploading.value = true;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('owner', 'school');

  try {
    const response = await api.post(
      'https://api.7srating.uz/api/user/media-upload/',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    form.media_ids.push(response.data.data.id);
    photos.value.push({
      id: response.data.data.id,
      url: URL.createObjectURL(file),
      name: file.name,
    });
  } catch (error) {
    console.error('File upload failed:', error.response?.data || error.message);
  } finally {
    isUploading.value = false;
  }
};



const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach((key) => delete errors[key]);

  // Validate name
  if (!form.name) errors.name = 'Имя обязательно.';

  // Validate address
  if (!form.address) errors.address = 'Место обязательно.';
  else if (form.address.length < 3) errors.address = 'Адрес слишком короткий.';

  // Validate phone number
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

  // Validate email
  if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Введите корректный адрес электронной почты.';
  }

  // Validate established_date
  if (!form.established_date) {
    errors.established_date = 'Дата основания обязательна.';
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(form.established_date)) {
    errors.established_date = 'Введите корректную дату (YYYY-MM-DD).';
  }

  // Validate website
  if (!form.website) {
    errors.website = 'Веб-сайт обязателен.';
  }
  // else if (!/^https?:\/\/[^\s$.?#].[^\s]*$/.test(form.website)) {
  //   errors.website = 'Введите корректный URL веб-сайта.';
  // }

  // Validate sport_ids
  if (!form.sport_ids.length) {
    errors.sport_ids = 'Выберите хотя бы один вид спорта.';
  }

  // Validate trainer_ids
  if (!form.trainer_ids.length) {
    errors.trainer_ids = 'Выберите хотя бы одного тренера.';
  }

  return Object.keys(errors).length === 0;
};



const goBack = () => {
    window.history.go(-1);
};


const getData = async() => {
  try {
    const res = await api.get(
      'https://api.7srating.uz/api/dashboard/sport/');

    data.value = res.data.data
      
  } catch (e) {
    console.log(e);
    
  }
}

getData()

const getTrainer = async () => {
  try {
    const res = await api.get('https://api.7srating.uz/api/user/profile/trainer/');
    dataTrainer.value = res.data.data;
    
  } catch (e) {
    console.error(e);
  }
};

getTrainer()

const handleSubmit = async () => {
  if (!validateForm()) {
    console.error('Validation failed:', errors);
    return;
  }


  try {
    const payload = {
        ...form,
      phone_number: form.phone_number.replaceAll(' ', ''),
      sport_ids: form.sport_ids.map((item) => item.id),
      trainer_ids: form.trainer_ids.map((item) => item.id)
      };
    await api.post(
      "https://api.7srating.uz/api/dashboard/school/",
      payload
    );
    toast.success("Success to School", {
      autoClose: 3000,
    });
    router.push('/school-list');
  } catch (error) {
    console.error('Submission error:', error);
    toast.error(error.response?.data?.message || 'An error occurred', {
      autoClose: 3000,
    });
  } finally {
    isSubmitting.value = false;
  }
};


</script>



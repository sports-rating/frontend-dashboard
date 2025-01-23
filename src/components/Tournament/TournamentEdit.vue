<template>
  <div class=" mx-auto  p-4 rounded-xl border">
    <h2 class="text-2xl font-bold mb-6">Обновить турнир</h2>


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
            <label class="block text-sm font-medium text-gray-700">Место</label>
            <input
              v-model="form.place"
              type="text"
              placeholder="Введите Место"
              class="mt-1  bg-white block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />

            <span class="text-red-500 mt-1" v-if="errors.place">{{ errors.place }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Разделение</label>
            <input
              v-model="form.division"
              type="text"
              placeholder="Введите Разделение"
              class="mt-1 bg-white block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.division">{{ errors.division }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Время </label>
            

            <input v-model="form.start_time" type="date"  min="2000-01-01" max="2026-01-01" class="!h-10 !w-full !mt-1 !border !rounded-md p-2 ">

            <span class="text-red-500 mt-1" v-if="errors.start_time">{{ errors.start_time }}</span>
          </div>



          <div>
            <label class="block text-sm font-medium text-gray-700">Введите sport</label>
            

        <multiselect
              v-model="form.sport_id"
              :options="data"
              label="name"
              track-by="id"
              value-prop="id"
              placeholder="Выберите sport"
              class="mt-1 "
            />

            <span class="text-red-500 mt-1" v-if="errors.sport_id">{{ errors.sport_id }}</span>
          </div>

          

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700">
              Фотография
            </label>
            <div class="mt-1 flex items-center">
              <input
                id="upload"
                type="file"
                @change="handleFileUpload"
                accept="image/*"
                class="hidden"
              />
              <label
                for="upload"
                class="mt-1 w-full flex items-center px-4 py-2 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-50"
              >
                <span class="text-sm text-gray-600">{{ form.photoName || 'Выберите файл' }}</span>
              </label>
            </div>
            <span class="text-red-500 mt-1" v-if="errors.photo">{{ errors.photo }}</span>
          </div>
        </div>
      </section>

      

    </form>
    
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
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {{ isSubmitting ?  'Сохранить...' :'Обновить ' }}
        </button>

        

      </div>
  </div>
</template>

<script setup>
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import { reactive, ref, onMounted } from 'vue';
import api from "../../utils/axios";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const errors = reactive({});
const isSubmitting = ref(false);
const isUploading = ref(false);
const data = ref([]);

const form = reactive({
  name: '',
  place: '',
  division: '',
  start_time: '',
  sport_type: '',
  logo_id: [],
  sport_id: null, // Ensure it's initially null
});

const handleFileUpload = async (event) => {
  const file = event.target.files[0];

  if (!file) {
    console.error("No file selected.");
    return;
  }

  isUploading.value = true;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("owner", "tournament");

  try {
    const response = await api.post(
      "https://api.7srating.uz/api/user/media-upload/",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (!Array.isArray(form.logo_id)) {
      form.logo_id = [];
    }
    form.logo_id.push(response.data.data.id);
    form.photoName = file.name;
  } catch (error) {
    console.error("File upload failed:", error.response?.data || error.message);
  } finally {
    isUploading.value = false;
  }
};

const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);

  if (!form.name) errors.name = 'Имя обязательно.';
  if (!form.place) errors.place = 'Место обязательно.';
  if (!form.division) errors.division = 'Разделение обязательно.';
  if (!form.sport_id) errors.sport_id = 'Тип спорта обязателен.';

  if (!form.start_time) {
    errors.start_time = 'Время обязательно.';
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(form.start_time)) {
    errors.start_time = 'Введите корректную дату (YYYY-MM-DD).';
  }


  return Object.keys(errors).length === 0;
};

const getDataa = async () => {
  try {
    const res = await api.get('https://api.7srating.uz/api/dashboard/sport/');
    data.value = res.data.data;
  } catch (e) {
    console.log(e);
  }
};

const getData = async () => {
  try {
    const res = await api.get(
      `https://api.7srating.uz/api/dashboard/tournament/${route.params.id}/`
    );

    form.name = res.data.data.name;
    form.place = res.data.data.place;
    form.division = res.data.data.division;
    form.sport_type = res.data.data.sport_type;
    form.start_time = res.data.data.start_time;
    form.photoName = res.data.data.logo[0]?.file.match(/[^/]+$/)[0];
    form.sport_id = res.data.data.sport; 
  } catch (e) {
    console.log(e);
  }
};

const goBack = () => {
  window.history.go(-1);
};

const handleSubmit = async () => {
  if (!validateForm()) {
    console.error('Validation failed:', errors);
    return;
  }

  isSubmitting.value = true;

  const payload = {
    ...form,
    sport_id: form.sport_id?.id, 
  };

  try {
    await api.patch(
      `https://api.7srating.uz/api/dashboard/tournament/${route.params.id}/`,
      payload
    );
    router.push('/tournament-list');
  } catch (error) {
    console.error('Submission error:', error);
    toast.error(error.response?.data?.data || 'An error occurred', {
      autoClose: 3000,
    });
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  getData();
  getDataa();
});
</script>


<template>
  <div class=" mx-auto  p-4 rounded-xl border">
    <h2 class="text-2xl font-bold mb-6">Добавить турнир</h2>


      <form @submit.prevent="handleSubmit" class="space-y-8" >
      <!-- Personal Information Section -->
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

          <!-- <div>
            <label class="block text-sm font-medium text-gray-700">Тип спорта</label>
            <input
              v-model="form.sport_type"
              type="text"
              placeholder="Введите Тип спорта"
              class="mt-1 bg-[#EFF0F3] block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.sport_type">{{ errors.sport_type }}</span>
          </div> -->

          <div>
            <label class="block text-sm font-medium text-gray-700">Время начала</label>
            <!-- <el-date-picker
              v-model="form.start_time"
              type="date"
              placeholder=" Введите Время начала"
              :size="size"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              class="!h-10 !w-full !mt-1 !border !rounded-md !bg-[#EFF0F3]"
            /> -->

            <input v-model="form.start_time" type="date"  min="2000-01-01" max="2026-01-01" class="!h-10 !w-full !mt-1 !border !rounded-md ">

            <span class="text-red-500 mt-1" v-if="errors.start_time">{{ errors.start_time }}</span>
          </div>


          <div>
            <label class="block text-sm font-medium text-gray-700">Конец Времени</label>
            <!-- <el-date-picker
              v-model="form.end_time"
              type="date"
              placeholder="Введите Конец Времени"
              :size="size"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              class="!h-10 !w-full !mt-1 !border !rounded-md !bg-[#EFF0F3]"
            /> -->
              <input v-model="form.end_time" type="date"  min="2000-01-01" max="2026-01-01" class="!h-10 !w-full !mt-1 !border !rounded-md ">


            <span class="text-red-500 mt-1" v-if="errors.end_time">{{ errors.end_time }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Введите sport</label>
            <!-- <select
          v-model="form.sport_id"
          class="mt-1  block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Выберите sport</option>
          <option v-for="item in data" :key="item.id" :value="item.id">{{ item.name }}</option>
          
        </select> -->

        <multiselect
              v-model="form.sport_id"
              :options="data"
              label="name"
              track-by="id"
              value-prop="id"
              placeholder="Выберите sport"
              class="mt-1 "
            />

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
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {{ isSubmitting ?  'Сохранить...' :'Сохранить' }}
        </button>

        

      </div>
  </div>
</template>

<script setup>
import Multiselect from 'vue-multiselect'
import { reactive, ref } from 'vue'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import api from "../../utils/axios"
import router from '../../router';

const errors = reactive({})
const isSubmitting = ref(false)
const data = ref([])
const isUploading = ref(false); 


const form = reactive({
  name: '',
  place: '',
  division: '',
  start_time: '',
  end_time: '',
  sport_type:'',
  logo_id: [],
  sport_id:'',
})

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

    // Ensure form.photo_id is an array and append the new id
    if (!Array.isArray(form.logo_id)) {
      form.logo_id = [];
    }
    form.logo_id.push(response.data.data.id);

    // Optionally, store the file name
    form.photoName = file.name;
  } catch (error) {
    console.error("File upload failed:", error.response?.data || error.message);
  } finally {
    isUploading.value = false; // Set loading state to false when done
  }
};

const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach((key) => delete errors[key]);

  // Validate required fields
  if (!form.name) errors.name = 'Имя обязательно.';
  if (!form.place) errors.place = 'Место обязательно.';
  if (!form.division) errors.division = 'Разделение обязательно.';
  // if (!form.sport_type) errors.sport_type = 'Тип спорта обязателен.';

  // Validate start_time and end_time
  if (!form.start_time) {
    errors.start_time = 'Время начала обязательно.';
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(form.start_time)) {
    errors.start_time = 'Введите корректную дату (YYYY-MM-DD).';
  }

  if (!form.end_time) {
    errors.end_time = 'Конец времени обязателен.';
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(form.end_time)) {
    errors.end_time = 'Введите корректную дату (YYYY-MM-DD).';
  } else if (form.start_time && form.end_time < form.start_time) {
    errors.end_time = 'Конец времени не может быть раньше времени начала.';
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

const handleSubmit = async () => {
  if (!validateForm()) {
    console.error('Validation failed:', errors);
    return;
  }

  // Add sport_id directly to the form object
  form.sport_id = form.sport_id.id;

  try {
    await api.post(
      "https://api.7srating.uz/api/dashboard/tournament/",
      form // form now contains sport_id
    );
    toast.success("Success to Tournament", {
      autoClose: 3000,
    });
    router.push('/tournament-list');
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


<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
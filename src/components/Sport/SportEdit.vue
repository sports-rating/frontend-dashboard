<template>
  <div class=" mx-auto  p-4 rounded-xl border">
    <h2 class="text-2xl font-bold mb-6">Обновить Sport</h2>


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
          
          <div class="col-span-2">
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
            >
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
import { reactive, ref } from 'vue'
import api from "../../utils/axios"
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const errors = reactive({})
const isSubmitting = ref(false)
const isUploading = ref(false); 



const form = reactive({
  name: '',
  logo_id:[]
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
  formData.append("owner", "sport");

  try {
    const response = await api.post(
      "https://api.7srating.uz/api/user/media-upload/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!Array.isArray(form.logo_id)) {
      form.logo_id = [];
    }
    form.logo_id.push(response.data.data.id);

    form.photoName = file.name;
  } catch (error) {
    console.error("File upload failed:", error.response?.data || error.message);
  }
  finally {
    isUploading.value = false; // Set loading state to false when done
  }
};

const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);

  if (!form.name) errors.name = 'Имя обязательно.';

  return Object.keys(errors).length === 0;
};



const getData = async() => {
  try {
    const res = await api.get(
      `https://api.7srating.uz/api/dashboard/sport/${route.params.id}/`);

    form.name = res.data.data.name
    // form.logo_id = [res.data.data.logo[0].id];
    form.photoName = res.data.data.logo[0].file.match(/[^/]+$/)[0]; 
      
  } catch (e) {
    console.log(e);
    
  }
}

getData()

const goBack = () => {
    window.history.go(-1);
};



const handleSubmit = async () => {
  if (!validateForm()) {
    console.error('Validation failed:', errors);
    return;
  }

    try {
      await api.patch(
        `https://api.7srating.uz/api/dashboard/sport/${route.params.id}/`,
        form, 
      );
        router.push('/sport-list')
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      isSubmitting.value = false;
    }
};



</script>



<template>
  <div>
    <!-- Breadcrumb -->
    <div class="mb-6 text-sm text-gray-600">
      <span>Главная</span>
      <span class="mx-2">›</span>
      <span>Пользователи</span>
      <span class="mx-2">›</span>
      <span>Добавить пользователя</span>
    </div>

    <!-- Main Content -->
    <div class="">
      <div class="p-4">
        <h1 class="text-2xl font-semibold mb-6">Образование</h1>

        <!-- Table -->
        <div v-if="schools.length > 0" class="overflow-x-auto bg-white rounded-lg shadow w-full">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4">#</th>
                <th class="text-left py-3 px-4">Школа</th>
                <th class="text-left py-3 px-4">Вид спорта</th>
                <th class="text-left py-3 px-4">Период</th>
                <th class="text-left py-3 px-4">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(school, index) in schools" :key="school.id" class="border-b">
                <td class="py-3 px-4">{{ index + 1 }}</td>
                <td class="py-3 px-4">{{ school.name }}</td>
                <td class="py-3 px-4">
                <!-- {{ school.sport_type }} -->
                {{ getSportName(school.sport_type) }}
                </td>
                 <td class="py-3 px-4">
                {{ school.start_year }} - {{ school.end_year }}
              </td>
                <td class="py-3 px-4 space-x-2">
                  <button @click="editSchool(school)" class="text-blue-600 hover:text-blue-800">
                    <img src="../../assets/img/edit.svg"  alt="edit" >
                  </button>
                  <button @click="deleteSchool(school.id)" class="text-red-600 hover:text-red-800">
                    <img src="../../assets/img/delete.svg" alt="delete" >
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Add Button -->
        <button 
          @click="openModal()"
          :class="schools.length > 0 ? 'mt-6' : 'mt-0'"
          class=" px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Добавить запись
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg w-full max-w-md p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">{{ editingSchool ? 'Редактировать школу' : 'Добавить новую школу' }}</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <!-- <XIcon class="h-5 w-5" /> -->

            <el-icon><Close class="h-5 w-5" /></el-icon>
          </button>
        </div>

        <form @submit.prevent="submitForm">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Наименование школы
              </label>
              <input 
                v-model="currentSchool.name"
                type="text"
                placeholder="Школа молодых спортсменов"
                class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
               <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Вид спорта
              </label>
              
              <multiselect
              v-model="currentSchool.sport_type"
              :options="data"
              label="name"
              track-by="id"
              value-prop="id"
              placeholder="Выберите вид спорта"
              class="mt-1 "
            />
            <p v-if="errors.sport_type" class="text-red-500 text-sm mt-1">{{ errors.sport_type }}</p>
            </div>

            <div>
        <label class="block text-sm font-medium text-gray-700">Период времени</label>
        <div class="grid grid-cols-2 gap-4 mt-1">
        <input v-model="currentSchool.start_year" type="date"  min="2000-01-01" max="2026-01-01" class="!h-10 !w-full !mt-1 !border !rounded-md ">
          <input v-model="currentSchool.end_year" type="date"  min="2000-01-01" max="2026-01-01" class="!h-10 !w-full !mt-1 !border !rounded-md ">

          <p v-if="errors.start_year" class="text-red-500 text-sm mt-1">{{ errors.start_year }}</p>
            <p v-if="errors.end_year" class="text-red-500 text-sm mt-1">{{ errors.end_year }}</p>
            <p v-if="errors.date" class="text-red-500 text-sm mt-1">{{ errors.date }}</p>
        </div>
      </div>

            <div class="flex items-center gap-4">
              <input 
                v-model="currentSchool.currently_studying"
                type="checkbox"
                class="px-3 py-2 "
              />
              <label class=" text-sm font-medium text-gray-700 ">
                участвую в настоящий время
              </label>
            </div>
          </div>

          <button 
            type="submit"
            class="w-full mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            {{ editingSchool ? 'Сохранить' : 'Готово' }}
          </button>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css';
import { ref, onMounted, watch } from 'vue'
import api from "../../utils/axios"

const props = defineProps({
  education: {
    type: Array,
    required: true
  }
});

const schools = ref([])
const data = ref([])
const showModal = ref(false)
const errors = ref({}); 
const editingSchool = ref(null)

const currentSchool = ref({
  id: '',
  name: '',
  sport_type: '',
  start_year: '',
  end_year: '',
  currently_studying: false,
})


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

const emit = defineEmits(['update-education']);
const currentEducation = ref({ ...props.education });
currentEducation.value = schools.value


onMounted(() => {
  if (props.education.length > 0) {
    schools.value = props.education.map((edu) => ({
      id: edu.id || '',
      name: edu.name || '',
      sport_type: edu.sport_id || '',
      start_year: edu.start_year || '',
      end_year: edu.end_year || '',
      currently_studying: edu.currently_studying || false,
    }));
  }

  
  const savedSchools = localStorage.getItem('schools')
  if (savedSchools) {
    schools.value = JSON.parse(savedSchools)
  }
})

watch(schools, (newSchools) => {
  localStorage.setItem('schools', JSON.stringify(newSchools))
  currentEducation.value = newSchools
}, { deep: true })

const openModal = () => {
  editingSchool.value = null
  currentSchool.value = {
    id: '',
    name: '',
    sport_type: '',
    start_year: '',
    end_year: '',
    currently_studying: false,
  }
  errors.value = {}; 
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingSchool.value = null
  errors.value = {};
}

const getSportName = (sportTypeId) => {
  const sport = data.value.find((item) => item.id === sportTypeId);
  return sport ? sport.name : 'Неизвестно'; 
};


// Validate fields
const validateForm = () => {
  const { name, sport_type, start_year, end_year } = currentSchool.value;
  const validationErrors = {};

  if (!name) validationErrors.name = "Наименование школы обязательно.";
  if (!sport_type) validationErrors.sport_type = "Вид спорта обязателен.";
  if (!start_year) validationErrors.start_year = "Укажите начальный год.";
  if (!end_year) validationErrors.end_year = "Укажите конечный год.";
  if (start_year && end_year && new Date(start_year) >= new Date(end_year)) {
    validationErrors.date = "Начальный год не может быть позже конечного.";
  }

  errors.value = validationErrors;
  return Object.keys(validationErrors).length === 0;
};


const submitForm = () => {
   if (!validateForm()) return;

   
   const { id, name, sport_type, start_year, end_year, currently_studying } = currentSchool.value
  const newSchool = {
    id: id || String(Math.floor(10000 + Math.random() * 90000)),
    name,
    sport_type: sport_type.id,
    start_year,
    end_year,
    currently_studying,
  }

  if (editingSchool.value) {
    const index = schools.value.findIndex(school => school.id === editingSchool.value.id)
    if (index !== -1) {
      schools.value[index] = newSchool
    }
  } else {
    schools.value.push(newSchool)
  }

  closeModal()
}

const editSchool = (school) => {
  const selectedSchool = data.value.find(item => item.id === school.sport_type);
  
  editingSchool.value = school
  currentSchool.value = {
      id: school.id || '',
      name: school.name || '',
      sport_type: selectedSchool,
      start_year: school.start_year || '',
      end_year: school.end_year || '',
      currently_studying: school.currently_studying || false,
    };

  errors.value = {};
  showModal.value = true
}

const deleteSchool = (id) => {
    schools.value = schools.value.filter(school => school.id !== id)
  }



watch(currentEducation, (newValue) => {
  emit('update-education', newValue);
  
}, { deep: true });




</script>

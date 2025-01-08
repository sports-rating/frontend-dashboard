<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Результаты</h1>
    </div>

    <!-- Results Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden mb-6">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Страна</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Рейтинг</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="result in results" :key="result.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ result.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <img :src="result.icon" class="h-8 w-8 rounded-full" />
                <span class="ml-2 text-sm text-gray-900">{{ result.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ result.country }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ result.date }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ result.rating }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Result Button -->
    <button
      @click="showModal = true"
      class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
    >
      Добавить новый результат
    </button>


     <div class="my-6">
      <h1 class="text-2xl font-semibold text-gray-900">Общие показатели игрока</h1>
    </div>


    <div class="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-12">
          <div>
            <label class="block text-sm font-medium text-gray-700">Количество игр</label>
            <input
              v-model="newResult.name"
              type="text"
              placeholder="Введите количество игр"
              class="mt-1 bg-[#EFF0F3] block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Количество учеников</label>
            <input
              v-model="newResult.name"
              type="text"
              placeholder="Введите количество учеников"
              class="mt-1  bg-[#EFF0F3] block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Количество наград</label>
            <input
              v-model="newResult.name"
              type="text"
              placeholder="Введите количество наград"
              class="mt-1 bg-[#EFF0F3] block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed  inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg border max-w-lg w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Добавить новую результат</h2>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-500">
            <!-- <XIcon class="h-5 w-5" /> -->
            <el-icon><Close class="h-5 w-5" /></el-icon>
          </button>
        </div>

        <form @submit.prevent="addResult">
           <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <!-- Name Field -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Название турнира</label>
        <input
          v-model="newResult.name"
          type="text"
          placeholder="Финал мировой Серии в помещении"
          class="mt-1 bg-[#EFF0F3] block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
        />
        <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
      </div>

      <!-- Country Field -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Страна</label>
        <select
          v-model="newResult.country"
          class="mt-1 bg-[#EFF0F3] block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Выберите страну</option>
          <option value="США">США</option>
          <option value="Россия">Россия</option>
        </select>
        <p v-if="errors.country" class="text-sm text-red-500">{{ errors.country }}</p>
      </div>
      </div>

      <!-- Dates -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Период оценки</label>
        <div class="grid grid-cols-2 gap-4 mt-1">
          <el-date-picker
            v-model="newResult.startDate"
            type="date"
            placeholder="Pick a day"
            :size="size"
            class="!h-10 !w-full !mt-1 !border !rounded-md !bg-[#EFF0F3]"
          />
          <el-date-picker
            v-model="newResult.endDate"
            type="date"
            placeholder="Pick a day"
            :size="size"
            class="!h-10 !w-full !mt-1 !border !rounded-md !bg-[#EFF0F3]"
          />
        </div>
        <p v-if="errors.startDate || errors.endDate" class="text-sm text-red-500">
          {{ errors.startDate || errors.endDate }}
        </p>
      </div>

      <div class="flex items-center gap-4">
              <input 
                v-model="newResult.check"
                type="checkbox"
                placeholder="Школа молодых спортсменов"
                class="px-3 py-2 "
              />
              <label class=" text-sm font-medium text-gray-700 ">
                Учусь в настоящий время
              </label>
            </div>

      <!-- Rating -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Ваш рейтинг</label>
        <div class="grid grid-cols-2 gap-4">
        
        <div class="relative">
        <input 
          type="text" 
          v-model="newResult.rating"
          placeholder="Введите количество"
          class="w-full px-4 py-2 pr-12 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
        />
        <div class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-300 shadow-sm"></div>
        </div>

        <div class="relative">
        <input 
          type="text" 
          v-model="newResult.rating"
          placeholder="Введите количество"
          class="w-full px-4 py-2 pr-12 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
        />
        <div class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gradient-to-r from-gray-300 to-gray-200 shadow-sm"></div>
      </div>

       <div class="relative">
        <input 
          type="text" 
          v-model="newResult.rating"
          placeholder="Введите количество"
          class="w-full px-4 py-2 pr-12 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
        />
        <div class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gradient-to-r from-orange-300 to-orange-200 shadow-sm"></div>
      </div>
        </div>
        <p v-if="errors.rating" class="text-sm text-red-500">{{ errors.rating }}</p>
      </div>

      <!-- File Upload -->
      <div>
      <label class="block text-sm font-medium text-gray-700">Логотип турнира</label>
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
            class="mt-1 w-full bg-[#EFF0F3] flex items-center px-4 py-2 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-50"
          >
            <span class="text-sm text-gray-600">{{ fileName || 'Выберите файл' }}</span>
          </label>
        </div>
        <p v-if="errors.icon" class="text-sm text-red-500">{{ errors.icon }}</p>
      </div>
    </div>

          <div class="mt-6 flex justify-center ">
            
            <button
              type="submit"
              class="w-[50%] px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600"
            >
              Готово
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref , watch} from 'vue'
// import { XIcon } from 'lucide-vue-next'

const emit = defineEmits(['update-result']);

const showModal = ref(false)
const fileName = ref('')

const results = ref([
  {
    id: '0001',
    name: 'Финал мировой Серии в помещении',
    icon: '/placeholder.svg?height=32&width=32',
    country: 'США',
    date: '2.02.2024 Г.',
    rating: 2
  },
  {
    id: '0002',
    name: 'Осенка в Боске',
    icon: '/placeholder.svg?height=32&width=32',
    country: 'США',
    date: '2.02.2024 Г.',
    rating: 2
  },
  {
    id: '0003',
    name: 'Турнир по стрельбе из лука в Нями',
    icon: '/placeholder.svg?height=32&width=32',
    country: 'США',
    date: '2.02.2024 Г.',
    rating: 2
  }
])

const props = defineProps({
  typeResults: {
    type: Object,
    required: true
  }
});
const currentResults = ref({ ...props.education });

currentResults.value = results.value




const errors = ref({
  name: '',
  country: '',
  startDate: '',
  endDate: '',
  rating: '',
  icon: '',
});

const validateForm = () => {
  let isValid = true;

  // Clear previous errors
  Object.keys(errors.value).forEach((key) => (errors.value[key] = ''));

  // Validate Name
  if (!newResult.value.name.trim()) {
    errors.value.name = 'Название турнира обязательно.';
    isValid = false;
  }

  // Validate Country
  if (!newResult.value.country) {
    errors.value.country = 'Пожалуйста, выберите страну.';
    isValid = false;
  }

  // Validate Dates
  if (!newResult.value.startDate) {
    errors.value.startDate = 'Начальная дата обязательна.';
    isValid = false;
  }
  if (!newResult.value.endDate) {
    errors.value.endDate = 'Конечная дата обязательна.';
    isValid = false;
  } else if (new Date(newResult.value.endDate) < new Date(newResult.value.startDate)) {
    errors.value.endDate = 'Конечная дата не может быть раньше начальной.';
    isValid = false;
  }

  // Validate Rating
  if (!newResult.value.rating) {
    errors.value.rating = 'Рейтинг обязателен.';
    isValid = false;
  } else if (isNaN(newResult.value.rating) || Number(newResult.value.rating) <= 0) {
    errors.value.rating = 'Рейтинг должен быть положительным числом.';
    isValid = false;
  }

  // Validate File Upload
  if (!newResult.value.icon) {
    errors.value.icon = 'Изображение обязательно.';
    isValid = false;
  }

  return isValid;
};

const newResult = ref({
  name: '',
  country: '',
  startDate: '',
  endDate: '',
  rating: '',
  icon: '',
  check:false
})

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      newResult.value.icon = e.target.result; // Save the base64 URL to display the image
    };
    reader.readAsDataURL(file);
    fileName.value = file.name; // Save the file name for display
    console.log('File uploaded:', fileName.value);
  }
};
const close = () =>{
  showModal.value = false
  fileName.value = ''
}

const addResult = () => {

  if (!validateForm()) {
    console.log('Validation failed');
    return;
  }
  // Add validation and form submission logic here
  results.value.push({
    id: String(results.value.length + 1).padStart(4, '0'),
    name: newResult.value.name,
    icon: newResult.value.icon,
    country: newResult.value.country,
    date: new Date(newResult.value.startDate).toLocaleDateString('ru-RU') + ' Г.',
    rating: Number(newResult.value.rating),
    check: newResult.value.check
  })
  
  showModal.value = false
  // Reset form
  newResult.value = {
    name: '',
    country: '',
    startDate: '',
    endDate: '',
    rating: '',
    file: '',
    check:false
  }
}

watch(currentResults, (newValue) => {
  emit('update-result', newValue);
}, { deep: true });
</script>
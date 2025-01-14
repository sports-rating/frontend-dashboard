



<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Результаты</h1>
    </div>

    <div v-if="results.length > 0" class="bg-white rounded-lg shadow overflow-hidden mb-6">
      <table class="min-w-full divide-y  divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Страна</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Рейтинг</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y  divide-gray-200">
          <tr v-for="(result, index) in results" :key="result.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ index +1 }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <span class="ml-2 text-sm text-gray-900">{{ result.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ result.country }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ result.year }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ result.number_of_gold }} {{ result.number_of_silver }} {{ result.number_of_bronze }}</td>
            <td class="px-6 py-4 whitespace-nowrap  text-sm font-medium space-x-4 text-start">
                


                <button @click="editResult(result)" class="text-blue-600 hover:text-blue-800">
                    <img src="../../assets/img/edit.svg"  alt="edit" >
                  </button>
                  <button @click="deleteResult(result.id)" class="text-red-600 hover:text-red-800">
                    <img src="../../assets/img/delete.svg" alt="delete" >
                  </button>
              </td>
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



    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg border max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Добавить новую результат</h2>
          <button @click="show" class="text-gray-400 hover:text-gray-500">
            <el-icon><Close class="h-5 w-5" /></el-icon>
          </button>
        </div>

        <form @submit.prevent="addResult">
           <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Название турнира</label>
        
        

        <multiselect
              v-model="newResult.name"
              @update:modelValue="handleSelection"
              :options="data"
              label="name"
              track-by="id"
              value-prop="id"
              placeholder="Выберите турнир"
              class="mt-1 "
            />
        <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
      </div>

      <!-- Country Field -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Страна</label>

        <input
          v-model="newResult.country"
          type="text"
          placeholder="Выберите страна"
          class="mt-1  block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
        />
        <p v-if="errors.country" class="text-sm text-red-500">{{ errors.country }}</p>
      </div>

      <!-- Dates -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Период оценки</label>
        <div class="grid  gap-4 mt-1">
          <el-date-picker
            v-model="newResult.year"
            type="date"
            disabled
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="Pick a day"
            :size="size"
            class="!h-10 !w-full !mt-1 !border !rounded-md !bg-[#EFF0F3]"
          />
          
        </div>
        <p v-if="errors.year " class="text-sm text-red-500">
          {{ errors.year }}
        </p>
      </div>

            <div>
            
            <div class="relative">
            <label class="block text-sm font-medium text-gray-700">Ваш рейтинг</label>
            <input
              v-model="newResult.number_of_gold"
              type="number"
              placeholder="Введите количество"
              class="mt-1  block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="absolute right-3 top-2/3 -translate-y-1/2">
              <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-yellow-500 shadow-sm" />
            </div>
            </div>

            <div class="relative mt-2">
            <input
              v-model="newResult.number_of_silver"
              type="number"
              placeholder="Введите количество"
              class="mt-1  block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="absolute right-3 top-1/3 -translate-y-1/3">
              <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-gray-300 shadow-sm" />
            </div>
            </div>

            <div class="relative mt-2">
            <input
              v-model="newResult.number_of_bronze"
              type="number"
              placeholder="Введите количество"
              class="mt-1  block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="absolute right-3 top-1/3 -translate-y-1/3">
              <div className="w-8 h-8 rounded-full bg-orange-300 border-2 border-orange-400 shadow-sm" />
            </div>
            </div>
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
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css';
import { ref , watch, onMounted,} from 'vue'
import api from "../../utils/axios"

const emit = defineEmits(['update-result',"update:games", "update:students", "update:awards"]);

const showModal = ref(false)

const results = ref([])
const data = ref([])

const props = defineProps({
  typeResults: {
    type: Object,
    required: true
  },
  handleFileUploadd: {
    type: Function,
    required: true,
  },
  // games:Number,
  // students:Number,
  // awards:Number,
  errors:Array,
});




// const localGames = computed({
//   get: () => props.games,
//   set: (value) => emit("update:games", value),
// });

// const localStudents = computed({
//   get: () => props.students,
//   set: (value) => emit("update:students", value),
// });

// const localAwards = computed({
//   get: () => props.awards,
//   set: (value) => emit("update:awards", value),
// });

const currentResults = ref({ ...props.typeResults });

currentResults.value = results.value

const getData = async() => {
  try {
    const res = await api.get(
      'https://api.7srating.uz/api/dashboard/tournament/');

    data.value = res.data.data
      
  } catch (e) {
    console.log(e);
    
  }
}


const handleSelection = (selectedOption) => {
  const selectedItem = data.value.find((item) => item.id === selectedOption.id);
      if (selectedItem) {
        newResult.value.year = selectedItem.start_time
      }
  
}


const errors = ref({
  tournament_id: '',
  country: '',
  year:'',
  number_of_gold: '',
  number_of_silver: '',
  number_of_bronze: '',
  logo: '',
  name:'',
});

const validateForm = () => {
  let isValid = true;

  // Clear previous errors
  Object.keys(errors.value).forEach((key) => (errors.value[key] = ''));

  // Validate Name
  if (!newResult.value.name.id.trim()) {
    errors.value.name = 'Название турнира обязательно.';
    isValid = false;
  }

  // Validate Country
  if (!newResult.value.country) {
    errors.value.country = 'Пожалуйста, выберите страну.';
    isValid = false;
  }

  // Validate Dates
  if (!newResult.value.year) {
    errors.value.year = 'Начальная дата обязательна.';
    isValid = false;
  }
  

  return isValid;
};

const newResult = ref({
  tournament_id: '',
  country: '',
  year:'',
  number_of_gold: '',
  number_of_silver: '',
  number_of_bronze: '',
  currently_participating: false,
  name:'',
})

const show = () =>{
  showModal.value = false
  newResult.value.country = '',
  newResult.value.year = '',
  newResult.value.number_of_gold = '',
  newResult.value.number_of_silver = '',
  newResult.value.number_of_bronze = '',
  newResult.value.name = '',
  newResult.value.currently_participating = false,
  newResult.value.tournament_id = ''
}


const close = () =>{
  showModal.value = false
  newResult.value.country = '',
  newResult.value.year = '',
  newResult.value.number_of_gold = '',
  newResult.value.number_of_silver = '',
  newResult.value.number_of_bronze = '',
  newResult.value.name = '',
  newResult.value.currently_participating = false,
  newResult.value.tournament_id = ''
}

const editResult = (result) => {
  
  const selectedTournament = data.value.find(item => item.id === result.tournament_id);
  

  newResult.value = {
      id: result.id || '',
      country: result.country || '',
      year: result.year || '',
      tournament_id: selectedTournament,
      number_of_gold: result.number_of_gold || '',
      number_of_silver: result.number_of_silver || '',
      number_of_bronze: result.number_of_bronze || '',
      name: selectedTournament,
      currently_participating: result.currently_participating || false,
  }

  showModal.value = true;
};

const deleteResult = (id) => {
  // Filter out the record with the specified ID
  results.value = results.value.filter((result) => result.id !== id);
};

const addResult = () => {
  if (!validateForm()) {
    console.log('Validation failed');
    return;
  }

  const selectedTournament = data.value.find(item => item.id === newResult.value.name.id);
  
  const existingIndex = results.value.findIndex(r => r.id === newResult.value.id);

  if (existingIndex !== -1) {
    // Update existing result
    results.value[existingIndex] = {
      ...newResult.value,
      tournament_id: selectedTournament ? selectedTournament.id : '',
      name:selectedTournament ? selectedTournament.name : ''
    };
  } else {
    // Add new result
    results.value.push({
      id: String(results.value.length + 1).padStart(4, '0'),
      tournament_id: selectedTournament ? selectedTournament.id : '',
      country: newResult.value.country,
      year: new Date(newResult.value.year).toLocaleDateString('en-CA'),
      number_of_gold: Number(newResult.value.number_of_gold),
      number_of_silver: Number(newResult.value.number_of_silver),
      number_of_bronze: Number(newResult.value.number_of_bronze),
      currently_participating: newResult.value.currently_participating,
      name:selectedTournament ? selectedTournament.name : ''
    });
  }

  close();
};

onMounted(() => {
  getData()

  if (props.typeResults.length > 0) {
    results.value = props.typeResults.map((res) => ({
      id: res.id || '',
      country: res.country || '',
      year: res.year || '',
      tournament_id: res.tournament_id || '',
      number_of_gold: res.number_of_gold || '',
      number_of_silver: res.number_of_silver || '',
      number_of_bronze: res.number_of_bronze || '',
      name: res.name || '',
      currently_participating: res.currently_participating || false,
    }));
  }

  const savedResults = localStorage.getItem('results')
  if (savedResults) {
    results.value = JSON.parse(savedResults)
  }
  
  
})
watch(results, (newResults) => {
  localStorage.setItem('results', JSON.stringify(newResults))
  currentResults.value = newResults
}, { deep: true })

watch(currentResults, (newValue) => {
  emit('update-result', newValue);
}, { deep: true });
</script>


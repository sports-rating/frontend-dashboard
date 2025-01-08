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
        <div class="overflow-x-auto bg-white rounded-lg shadow w-full">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4">ID</th>
                <th class="text-left py-3 px-4">Школа</th>
                <th class="text-left py-3 px-4">Вид спорта</th>
                <th class="text-left py-3 px-4">Период</th>
                <th class="text-left py-3 px-4">Дата</th>
                <th class="text-left py-3 px-4">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="school in schools" :key="school.id" class="border-b">
                <td class="py-3 px-4">{{ school.id }}</td>
                <td class="py-3 px-4">{{ school.name }}</td>
                <td class="py-3 px-4">{{ school.sport }}</td>
                <td class="py-3 px-4">{{ school.period }}</td>
                <td class="py-3 px-4">{{ school.date }}</td>
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
          class="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Вид спорта
              </label>
              <select 
                v-model="currentSchool.sport"
                class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Выберите вид спорта</option>
                <option value="Стрельба из лука">Стрельба из лука</option>
                <option value="Футбол">Футбол</option>
                <option value="Баскетбол">Баскетбол</option>
              </select>
            </div>

            <div class="flex flex-col gap-4">
              <div class="flex flex-col">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Период времени
                </label>
                <div class="flex gap-4">
                  <select 
                  v-model="currentSchool.startYear"
                  class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Выберите год</option>
                  <option v-for="year in years" :key="year" :value="year">
                    {{ year }}
                  </option>
                </select>
                <select 
                  v-model="currentSchool.endYear"
                  class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Выберите год</option>
                  <option v-for="year in years" :key="year" :value="year">
                    {{ year }}
                  </option>
                </select>
                </div>
              </div>
            </div>


             <div class="flex items-center gap-4">
              <input 
                v-model="currentSchool.check"
                type="checkbox"
                placeholder="Школа молодых спортсменов"
                class="px-3 py-2 "
              />
              <label class=" text-sm font-medium text-gray-700 ">
                Учусь в настоящий время
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
import { ref, computed, watch } from 'vue'


const props = defineProps({
  education: {
    type: Object,
    required: true
  }
});

const schools = ref([
  {
    id: '00001',
    name: 'Школа молодых спортсменов',
    sport: 'Стрельба из лука',
    period: '2018-2020',
    date: '03.02.2024'
  },
  {
    id: '00003',
    name: 'Школа молодых спортсменов',
    sport: 'Стрельба из лука',
    period: '2018-2020',
    date: '03.02.2024'
  }
])

const currentSchool = ref({
  id: '',
  name: '',
  sport: '',
  startYear: '',
  endYear: '',
  date: '',
  check:false,
})

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 10 }, (_, i) => currentYear - i)
})


const emit = defineEmits(['update-education']);
const currentEducation = ref({ ...props.education });
const showModal = ref(false)
const editingSchool = ref(null)
currentEducation.value = schools.value


const submitForm = () => {
  const { id, name, sport, startYear, endYear, check } = currentSchool.value
  const newSchool = {
    id: id || String(Math.floor(10000 + Math.random() * 90000)),
    name,
    sport,
    period: `${startYear}-${endYear}`,
    date: new Date().toLocaleDateString('ru-RU'),
    check,
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
  editingSchool.value = school
  const [startYear, endYear] = school.period.split('-')
  currentSchool.value = {
    ...school,
    startYear,
    endYear
  }
  currentEducation.value = schools.value
  showModal.value = true
}

const deleteSchool = (id) => {
  if (confirm('Вы уверены, что хотите удалить эту школу?')) {
    schools.value = schools.value.filter(school => school.id !== id)
    currentEducation.value = schools.value
  }
}




const openModal = () => {
  editingSchool.value = null
  currentSchool.value = {
    id: '',
    name: '',
    sport: '',
    startYear: '',
    endYear: '',
    date: '',
    check:false,
  }
  showModal.value = true
}

watch(currentEducation, (newValue) => {
  emit('update-education', newValue);
}, { deep: true });

const closeModal = () => {
  showModal.value = false
  editingSchool.value = null
}
</script>
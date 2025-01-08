<template>
  <div class="min-h-screen ">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Фонд "Бирлик"</h1>
      <nav class="flex space-x-2 text-sm text-gray-500">
        <a href="#" class="hover:text-gray-900">Главная</a>
        <span>→</span>
        <span>Фонд "Бирлик"</span>
      </nav>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <div class="bg-white p-4 rounded-lg shadow flex flex-col justify-between">
        <div class="text-2xl font-bold">{{ stats.total }}</div>
        <div class="text-sm text-gray-500 ">Всего проектов</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow flex flex-col justify-between">
        <div class="text-2xl font-bold">{{ stats.active }}</div>
        <div class="text-sm text-gray-500">Активные проекты</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow flex flex-col justify-between">
        <div class="text-2xl font-bold">{{ stats.completed }}</div>
        <div class="text-sm text-gray-500">Завершенные проекты</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow flex flex-col justify-between">
        <div class="text-2xl font-bold">{{ stats.pending }}</div>
        <div class="text-sm text-gray-500">Проекты на проверке</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow flex flex-col justify-between">
        <div class="text-2xl font-bold">{{ stats.totalFunds }} млн. сум</div>
        <div class="text-sm text-gray-500">Собрано средств</div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-4 mb-6">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-4 py-2 rounded',
          activeTab === tab.id 
            ? 'bg-red-500 text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-50 border'
        ]"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <div class="flex-1">
        <input 
          v-model="filters.search"
          type="text" 
          placeholder="Поиск..." 
          class="w-full px-4 py-2 border rounded bg-white"
        >
      </div>
      <select 
        v-model="filters.deadline"
        class="px-4 py-2 border rounded bg-white"
      >
        <option value="">Все сроки</option>
        <option value="upcoming">Предстоящие</option>
        <option value="past">Прошедшие</option>
      </select>
      <select 
        v-model="filters.userType"
        class="px-4 py-2 border rounded bg-white"
      >
        <option value="">Все типы пользователей</option>
        <option value="Спортсмен">Спортсмен</option>
        <option value="Тренер">Тренер</option>
      </select>
      <button 
        @click="exportData"
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Экспорт
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow overflow-x-scroll no-scrollbar ">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th v-for="header in tableHeaders" :key="header" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="project in filteredProjects" :key="project.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ project.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ project.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ project.userType }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ project.goal }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(project.status)" class="px-2 py-1 text-xs rounded-full">
                {{ project.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ project.collected }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ project.target }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ project.deadline }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button @click="handleAction('/found-id')" class="text-gray-600 hover:text-gray-900">
                Действие
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'


const stats = ref({
  total: 30,
  active: 15,
  completed: 10,
  pending: 5,
  totalFunds: 200
})

const tabs = [
  { id: 'list', name: 'Список проектов' },
  { id: 'pending', name: 'Заявки на проверку' },
  { id: 'create', name: 'Создать проект' }
]

const activeTab = ref('list')
const route = useRoute()
const router = useRouter()

const filters = ref({
  search: '',
  deadline: '',
  userType: ''
})

const tableHeaders = [
  'ID', 'ФИО', 'Тип пользователя', 'Цель сбора средств', 'Статус',
  'Собрано', 'Нужно собрать', 'Сроки', 'Действие'
]

const projects = ref([
  {
    id: '001',
    name: 'Пулатов Майколбек Мухтарович',
    userType: 'Спортсмен',
    goal: 'Подготовка к Олимпиаде',
    status: 'На проверке',
    collected: '24 000 сум',
    target: '120 000 сум',
    deadline: '15.02.2024'
  },
  {
    id: '002',
    name: 'Ахмедов Рустам Каримович',
    userType: 'Тренер',
    goal: 'Организация спортивного лагеря',
    status: 'Активен',
    collected: '50 000 сум',
    target: '200 000 сум',
    deadline: '01.03.2024'
  },
  {
    id: '003',
    name: 'Abduvohid',
    userType: 'Спортсмен',
    goal: 'Участие в международных соревнованиях',
    status: 'Завершено',
    collected: '100 000 сум',
    target: '100 000 сум',
    deadline: '10.01.2024'
  },
  // Add more projects as needed
])

const filteredProjects = computed(() => {
  return projects.value.filter(project => {
    const searchMatch = project.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
                        project.goal.toLowerCase().includes(filters.value.search.toLowerCase())
    const deadlineMatch = filters.value.deadline === '' || 
                          (filters.value.deadline === 'upcoming' && new Date(project.deadline) > new Date()) ||
                          (filters.value.deadline === 'past' && new Date(project.deadline) < new Date())
    const userTypeMatch = filters.value.userType === '' || project.userType === filters.value.userType

    return searchMatch && deadlineMatch && userTypeMatch
  })
})

const getStatusClass = (status) => {
  const classes = {
    'На проверке': 'bg-yellow-100 text-yellow-800',
    'Активен': 'bg-purple-100 text-purple-800',
    'Завершено': 'bg-green-100 text-green-800',
    'Отубликовано': 'bg-blue-100 text-blue-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const handleAction = (project) => {
  // console.log('Action clicked for project:', project.id)
  router.push(project)
}

const exportData = () => {
  console.log('Exporting data...')
}
</script>

<style>
.no-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e1e1e1;
  border: 7px solid transparent;
  border-radius: 8px;
  background-clip: padding-box;
}

.no-scrollbar::-webkit-scrollbar {
  width: 12px;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scroll-margin-block-start: 0;
}
</style>
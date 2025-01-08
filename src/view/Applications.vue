<template>
  <div class="">
    <!-- Header -->
    <div class="flex flex-col mb-6">
      <h1 class="text-xl font-medium dark:text-white text-[#1E1E2D]">Заявки на регистрацию</h1>
      <div class="flex items-center text-sm dark:text-white text-[#1E1E2D] mt-1">
        <span>Главная</span>
        <span class="mx-1"> {{ '->' }}</span>
        <span class="dark:text-white text-[#1E1E2D]">Заявки на регистрацию</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-[#1E1E2D] rounded-lg border mb-6 w-full">
      <div class="p-4">
        <div class="flex flex-wrap gap-4 w-full">
          <div class="flex-1">
            <input
              v-model="search"
              type="search"
              placeholder="Поиск..."
              class="w-[15rem] px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
            />

            
          </div>
            <div class="flex gap-6">


          <select v-model="userStatus"  class="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500">
            <option value="">Все типы оплаты</option>
            <option value="Оплачено">Оплачено</option>
            <option value="Не оплачено">Не оплачено	</option>
          </select>
          
          <div>
              
          <el-date-picker
          style="width: 20rem !important;"
          v-model="dateRange"
          type="daterange"
          start-placeholder="Весь период"
          end-placeholder="Весь период"
        />
          </div>
          <select  v-model="userType" class="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500">
            <option value="">Все типы пользователей</option>
            <option value="Тренер" >Тренер</option>
            <option value="Спортсмен" >Спортсмен</option>
          </select>
          <button @click="showExportModal = true" class="flex gap-2 items-center  px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600">
          <img src="../assets/img/up.svg" alt="up">
            Экспорт
          </button>

            </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow w-full">
      <div class=" overflow-x-scroll no-scrollbar  "> 
        <table class="min-w-full divide-y divide-gray-200"> 
          <thead class="bg-gray-50">
            <tr>
              <th v-for="header in headers" :key="header" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 !w-full">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.phone.replace(/(\+998)(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span class="px-2 py-1 text-xs rounded-md" :class="getTypeClass(user.type)">
                {{ user.type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs rounded-full" :class="getStatusClass(user.status)">
                  {{ user.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button class="hover:text-gray-900 border p-2 rounded-lg bg-[#EFF0F3]">
                  Действие
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    
    
    <ExportModal
    :is-open="showExportModal"
    @close="showExportModal = false"
    @export="handleExport"
  />
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue'
import ExportModal from '../components/ExportModal.vue';
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const search = ref("");
const userStatus = ref("");
const userType = ref("");
const dateRange = ref(null);
const showExportModal = ref(false);
const isCreate = ref(false);


const users = ref([
  { id: 1, name: 'John Doe', phone: '+998998577232', email: 'john@example.com', type: 'Спортсмен', status: 'Оплачено', date: '2024-10-01' },
  { id: 2, name: 'Jane Smith', phone: '0987654321', email: 'ane@example.com', type: 'Тренер', status: 'Оплачено', date: '2024-10-15' },
  { id: 3, name: 'Alisher', phone: '4567890321', email: 'hn@example.com', type: 'Тренер', status: 'Не оплачено', date: '2024-11-01' },
  { id: 4, name: 'Dilshod', phone: '0987621412', email: 'ne@example.com', type: 'Спортсмен', status: 'Не оплачено', date: '2024-11-15' },
  { id: 5, name: 'Eldor', phone: '3234567890', email: 'jo@example.com', type: 'Тренер', status: 'Оплачено', date: '2024-11-09' },
  { id: 6, name: 'Abduvohid', phone: '1187654321', email: 'kel@example.com', type: 'Спортсмен', status: 'Не оплачено', date: '2024-11-28' },
]);

const headers = ref(["ID", "Пользователи", "Номер телефона", "Электронная почта", "Тип пользователя", "Статус оплаты", "Дата создание", "Действия"]);

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.value.toLowerCase()) ||
    user.phone.toLowerCase().includes(search.value.toLowerCase()) ||
    user.email.toLowerCase().includes(search.value.toLowerCase());

    const matchesStatus = userStatus.value ? user.status === userStatus.value : true;
    const matchesUserType = userType.value ? user.type === userType.value : true;
    const matchesDateRange = dateRange.value ? (new Date(user.date) >= new Date(dateRange.value[0]) && new Date(user.date) <= new Date(dateRange.value[1])) : true;

    return matchesSearch && matchesStatus && matchesUserType && matchesDateRange;
  });
});

const handleExport = (data) => {
  console.log('Export data:', data)
}

const isCreateToggle = () => {
  isCreate.value = !isCreate.value
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    isCreate.value = false;
  }
};

const navigate = (path) => {
  router.push(path)
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const getStatusClass = (status) => {
  return status === 'Оплачено' 
    ? 'bg-[#E2FFEF] text-[#27A950]' 
    : 'bg-[#FEECEC] text-[#E7273D]'
}

const getTypeClass = (type) => {
  return type === 'Спортсмен' 
    ? 'bg-[#EFF0F3] ' 
    : 'bg-[#EFF0F3] '
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

.el-date-editor.el-range-editor {
  border: 1px solid #e1e1e1; 
  background-color: #fafafb;
  border-radius: 5px;
  padding: 5px ;
  transition: border-color 0.3s ease;
  height: 2.5rem;
  cursor: pointer;  
}


</style>
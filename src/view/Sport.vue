<template>
  <div class="">

    <!-- Delete Modal -->
  <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Подтверждение удаления</h3>
        <p class="text-sm text-gray-600 mb-6">
          Вы уверены, что хотите удалить этот спорт? Это действие необратимо.
        </p>
        <div class="flex justify-end gap-4">
          <button
            @click="isModalOpen = false"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Отмена
          </button>
          <button
            @click="deleteTournament"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
    <!-- Header -->
    <div class="flex flex-col mb-6">
      <h1 class="text-xl font-medium dark:text-white text-[#1E1E2D]">Спорт</h1>
      <!-- <div class="flex items-center text-sm dark:text-white text-[#1E1E2D] mt-1">
        <span>Главная</span>
        <span class="mx-1"> {{ '->' }}</span>
        <span class="dark:text-white text-[#1E1E2D]">Турнир</span>
      </div> -->
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-[#1E1E2D] rounded-lg border mb-6 w-full">
      <div class="p-4">
        <div class="flex  gap-4 w-full">
          <div class="flex-1">
            <input
              v-model="search"
              type="search"
              placeholder="Поиск..."
              class="2xl:w-[20rem] w-[15rem] px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
            />

            
          </div>
            <div class="flex gap-6">
          <div class="relative">
          <button @click="navigate('/sport/create')" class="h-full flex gap-2 items-center px-4 py-2 text-sm text-white bg-green-500 rounded-lg hover:bg-green-600">
          <img src="../assets/img/up.svg" alt="up">
            Добавить
          </button>

          
          </div>
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
              <th v-for="header in headers" :key="header" scope="col" class="px-4  py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y text-center divide-gray-200 !w-full">
            <tr v-for="(user, index) in filteredUsers" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ index + 1  }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                {{ user.name  ? user.name: '-' }} 
              </td>
              <td class="h-[4rem] w-[4rem]">
              <img class="w-full h-full object-cover" :src="user?.logo[0]?.file" alt="">
              </td>
              
              <td class="px-6 py-4 gap-2 flex whitespace-nowrap justify-center text-sm text-gray-500">
                <button   class="w-[20%] hover:text-gray-900 border p-2 rounded-lg bg-[#EFF0F3]">
                <router-link 
                  :to="`/sport/edit/${user.id}`" 
                  >
                  Обновлять
                </router-link>
                </button>


                <button
                  @click="confirmDelete(user.id)"
                  class="w-[20%] hover:text-gray-300 text-white border p-2 rounded-lg bg-red-500"
                >
                  Удалить
                </button>


                
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    
    
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from "../utils/axios"


const route = useRoute()
const router = useRouter()
const search = ref("");
const userStatus = ref("");
const userType = ref("");
const dateRange = ref(null);
const isCreate = ref(false);
const data = ref([])
const isModalOpen = ref(false);
const sportToDelete = ref(null);

const getData = async() => {
  try {
    const res = await api.get(
      'https://api.7srating.uz/api/dashboard/sport/');

    data.value = res.data.data
      
  } catch (e) {
    console.log(e);
    
  }
}
onMounted(() => {
  getData()
})




const headers = ref(["#", "Имя", "Image",  "Действия"]);

const filteredUsers = computed(() => {
  return data.value.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(search.value.toLowerCase());
    return matchesSearch  
  });
});


const confirmDelete = (id) => {
  sportToDelete.value = id;
  isModalOpen.value = true;
};

const deleteTournament = async () => {
  try {
    await api.delete(`https://api.7srating.uz/api/dashboard/sport/${sportToDelete.value}/`);
    data.value = data.value.filter((user) => user.id !== sportToDelete.value);
    isModalOpen.value = false;
  } catch (e) {
    console.error("Failed to delete tournament:", e);
  }
};


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
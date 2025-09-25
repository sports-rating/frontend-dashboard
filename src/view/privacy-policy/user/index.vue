<template>
  <div class="">

  <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Подтверждение удаления</h3>
        <p class="text-sm text-gray-600 mb-6">
          Вы уверены, что хотите удалить этот Условия использования? Это действие необратимо.
        </p>
        <div class="flex justify-end gap-4">
          <button
            @click="isModalOpen = false"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Отмена
          </button>
          <button
            @click="deletePrivacy"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-semibold">Условия использования</h1>
      <div class="flex gap-4">
        <div class="relative">
          <button
            @click="toggleLanguageDropdown"
            class="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors"
          >
            Язык
            <ChevronDownIcon class="w-5 h-5" :class="{ 'rotate-180': isLanguageDropdownOpen }" />
          </button>
          
          <!-- Language Dropdown -->
          <div
            v-if="isLanguageDropdownOpen"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10"
          >
            <button
              v-for="lang in languages"
              :key="lang.code"
              @click="selectLanguage(lang.code)"
              class="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
            >
              <span class="w-6">{{ lang.flag }}</span>
              {{ lang.name }}
            </button>
          </div>
        </div>
        
        <button
          @click="navigate('/user-terms/create')"
          class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Создать
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold">Заголовок</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Язык</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="policy in filteredPolicies" :key="policy.id" class="border-b">
            <td class="px-6 py-4">{{ policy.title }}</td>
            <td class="px-6 py-4">{{ policy.language }}</td>
            <td class="px-6 py-4">
              <div class="flex gap-2">

                <router-link 
                  :to="`/user-terms/update/${policy.id}`" 
                  >
                <button
                  class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Обновлять
                </button>
                </router-link>
                <button
                   @click="confirmDelete(policy.id)"
                  class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Удалить
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredPolicies.length === 0">
            <td colspan="3" class="px-6 py-4 text-center text-gray-500">
             Пользовательские условия не найдены
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'


import api from "../../../utils/axios"


const router = useRouter()
const data = ref([])
const isModalOpen = ref(false);
const toDelete = ref(null);

const getData = async() => {
  try {
    const res = await api.get(
      '/dashboard/terms-of-condition/');

    data.value = res.data.data
      
  } catch (e) {
    console.log(e);
    
  }
}

getData()



const isLanguageDropdownOpen = ref(false)
const selectedLanguage = ref('all')

const languages = [
  { code: 'all', name: 'Все языки', flag: '🌐' },
  { code: 'en', name: 'Английский', flag: '🇬🇧' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'uz', name: 'Узбекский', flag: '🇺🇿' }
]

// Sample data - replace with your actual data source
const policies = ref([
  { id: 1, title: 'Privacy Policy', language: 'english' },
  { id: 2, title: 'Политика конфиденциальности', language: 'russian' },
  { id: 3, title: 'Maxfiylik siyosati', language: 'uzbek' }
])

const filteredPolicies = computed(() => {
  if (selectedLanguage.value === 'all') return data.value
  return data.value.filter(policy => 
    policy.language.toLowerCase() === selectedLanguage.value
  )
})

const toggleLanguageDropdown = () => {
  isLanguageDropdownOpen.value = !isLanguageDropdownOpen.value
}

const selectLanguage = (lang) => {
  selectedLanguage.value = lang
  isLanguageDropdownOpen.value = false
}

const confirmDelete = (id) => {
  toDelete.value = id;
  isModalOpen.value = true;
};

const deletePrivacy = async () => {
  try {
    await api.delete(`/dashboard/terms-of-condition/${toDelete.value}/`);
    isModalOpen.value = false;

    getData()
  } catch (e) {
    console.error("Failed to delete tournament:", e);
  }
};

const createPrivacyPolicy = () => {
  // Implement your create logic here
  console.log('Create new privacy policy')
}

const editPolicy = (policy) => {
  // Implement your edit logic here
  console.log('Edit policy:', policy)
}

const deletePolicy = (policy) => {
  // Implement your delete logic here
  console.log('Delete policy:', policy)
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    isLanguageDropdownOpen.value = false
  }
}

const navigate = (path) => {
  router.push(path)
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
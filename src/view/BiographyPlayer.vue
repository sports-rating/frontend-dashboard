<template>
  <div class="min-h-screen ">
    <!-- Header -->
    <div class="p-4 flex items-center gap-4 ">
      <button class="text-gray-600">
        <ChevronLeftIcon class="h-6 w-6 border rounded-full" />
      </button>

      <h1 class="text-2xl font-bold">
          Пулатов Мавлонбек Мухтаржанович
          </h1>

    </div>

    <!-- Player Info Section -->
    <div class="px-6">
      <div class="flex justify-between">
        <div class="flex-1 my-2">
          <!-- Player Number and Title -->
          <div class="flex items-center gap-4 mb-2">
            <span class="text-gray-600 text-sm">№1</span>
            <span class="text-gray-600 text-sm">ОБЩ. 96</span>
            <span class="text-gray-600 text-sm">Обладатель титула</span>
          </div>
          </div>
      </div>

      
    </div>

    <!-- Tabs -->
    <div class="px-6 mb-6">
      <div class="flex gap-2 ">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-2 text-sm font-medium',
            activeTab === tab.id 
              ? 'text-white border-b-2 border-red-500 bg-red-500 rounded-md' 
              : 'text-white bg-gray-500 rounded-md'
          ]"
        >
          {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="px-6">
      <div v-if="activeTab === 'biography'" class=" flex w-full gap-8">
        <div class="mt-5 w-full">
            <div class=" gap-6 flex w-full">
              
              <!-- Player Data Section -->
              <div class="bg-white rounded-lg border p-6 w-full">
                <h2 class="text-xl font-semibold ">Данные игрока</h2>
                
                <!-- Photo Upload -->
                <div class="mb-6">
                  
                  <div class="relative flex items-end gap-2 mt-5">
                    <img 
                      v-if="playerPhoto" 
                      :src="playerPhoto" 
                      class="w-24 h-24 object-cover rounded-lg "
                      alt="Player photo"
                    />
                    <div 
                      v-else 
                      class="w-24 h-24  bg-gray-100 rounded-lg flex items-center justify-center"
                    >
                      <!-- <UserIcon class="w-8 h-8 text-gray-400" /> -->
                    </div>
                    <input 
                      type="file" 
                      @change="handlePhotoUpload" 
                      accept="image/*"
                      class="hidden" 
                      ref="photoInput"
                    />
                    <div class="flex flex-col mt-5">
                      <div class="text-sm mb-2">Фотография игрока</div>
                    <div class="flex gap-2">
                      <button 
                      @click="triggerPhotoUpload"
                      class="!w-18 !h-10 mt-2  inline-flex items-center px-4 py-2 border border-gray-300 rounded-md  text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <!-- <UploadIcon class="w-4 h-4 mr-2" /> -->
                      Загрузить фото
                    </button>
                    <button 
                      v-if="playerPhoto"
                      @click="deletePhoto"
                      class="mt-2  inline-flex items-center px-4 py-2 border border-red-300 rounded-md  text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                    >
                      <!-- <TrashIcon class="w-4 h-4 mr-2" /> -->
                      Удалить фотографию
                    </button>
                    </div>
                    </div>
                  </div>
                </div>

                <!-- Player Form -->
                <form @submit.prevent="savePlayerData">
                  <div class="space-y-4">
                    <div class="flex w-full gap-4">
                      <!-- Name -->
                    <div class="w-full">
                      <label class="block text-sm font-medium text-gray-700">ФИО игрока</label>
                      <input 
                        v-model="playerData.name"
                        type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <!-- Birth Date -->
                    <div class="w-full">
                      <label class="block text-sm font-medium text-gray-700">Дата рождения игрока</label>
                      <input 
                        v-model="playerData.birthDate"
                        type="date"
                        class="w-full mt-1 block rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    </div>

                    <div class="flex w-full gap-4">
                    
                    <!-- Citizenship -->
                    <div class="w-full">
                      <label class="block text-sm font-medium text-gray-700">Гражданство</label>
                      <select 
                        v-model="playerData.citizenship"
                        class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="uzbekistan">Узбекистан</option>
                        <option value="russia">Россия</option>
                        <option value="kazakhstan">Казахстан</option>
                      </select>
                    </div>

                    <!-- Height -->
                    <div class="w-full">
                      <label class="block text-sm font-medium text-gray-700">Рост (м)</label>
                      <input 
                        v-model="playerData.height"
                        type="number"
                        class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    </div>

                    <div class="flex w-full gap-4">
                    
                    <!-- Number -->
                    <div class="w-full">
                      <label class="block text-sm font-medium text-gray-700">Номер</label>
                      <input 
                        v-model="playerData.number"
                        type="number"
                        class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <!-- Academy -->
                    <div class="w-full">
                      <label class="block text-sm font-medium text-gray-700">Академия</label>
                      <input 
                        v-model="playerData.academy"
                        type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    </div>


                  </div>
                </form>
              </div>

              <!-- Biography Section -->
              <div class="bg-white rounded-lg border p-6 w-full">
                <h2 class="text-xl font-semibold mb-6">Биография игрока</h2>
                
                <!-- Biography Text -->
                <div class="mb-6">
                  <textarea 
                    v-model="playerData.biography"
                    rows="6"
                    class="block w-full rounded-md border-gray-300 border focus:border-blue-500 focus:ring-blue-500"
                  ></textarea>
                </div>

                <!-- Biography Photo Upload -->
                <div 
                  class="border-2 border-dashed border-gray-300 rounded-lg p-6"
                  @dragover.prevent
                  @drop.prevent="handleBiographyPhotoDrop"
                >
                  <div class="text-center">
                    <!-- <ImageIcon class="mx-auto h-12 w-12 text-gray-400" /> -->
                    <div class="mt-4">
                      <p class="text-sm text-gray-500">
                        Перетащите изображение или выберите из файла
                      </p>
                      <p class="text-xs text-gray-400 mt-1">
                        Рекомендуемые минимальные размеры 1500 пикселей. Не более 10 МБ.
                      </p>
                    </div>
                    <input 
                      type="file"
                      @change="handleBiographyPhotoUpload"
                      accept="image/*"
                      class="hidden"
                      ref="biographyPhotoInput"
                    />
                    <button
                      @click="triggerBiographyPhotoUpload"
                      class="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <!-- <UploadIcon class="w-4 h-4 mr-2" /> -->
                      Выбрать файл
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>


      <div v-if="activeTab === 'application'" class=" flex w-full gap-8">
        <div class="mt-5  space-y-6 w-full">
      <div class=" mx-auto space-x-6 w-full flex">
      <!-- General Information Section -->
      <div class="bg-white p-6 rounded-lg shadow w-full">
        <h2 class="text-xl font-semibold mb-4">Общая информация</h2>
        <div class="grid gap-6 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Тип пользователя</label>
            <select class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500">
              <option>Опционим</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Вид спорта</label>
            <select class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500">
              <option>Футболист</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Физический адрес проживания</label>
            <input type="text" class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <!-- Financial Goal Section -->
      <div class="bg-white p-6 rounded-lg shadow w-full">
        <h2 class="text-xl font-semibold mb-4">Финансовая цель</h2>
        <p class="text-sm text-gray-600 mb-4">
          Ваша финансовая цель должна быть минимальной суммой, которая поможет получить ресурсы на достижение поставленной спортивной задачи и на которую можно рассчитывать.
        </p>
        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Выберите валюту</label>
            <select class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500">
              <option>Выберите валюту</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Введите необходимую сумму</label>
            <input type="number" class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      

      </div>

        <div class=" mx-auto space-x-6 w-full flex">

        <!-- Purpose Section -->
      <div class="bg-white p-6 rounded-lg shadow w-full">
        <h2 class="text-xl font-semibold mb-4">Цель сбора средств</h2>
        <textarea
          rows="6"
          class="block w-full rounded-md border-gray-300 border focus:border-blue-500 focus:ring-blue-500"
        ></textarea>
      </div>
          
      <!-- Photo Upload Section -->
      <div class="bg-white p-6 rounded-lg shadow w-full">
        <h2 class="text-xl font-semibold mb-4">Загрузите фотографии</h2>
        <p class="text-sm text-gray-600 mb-4">
          Загрузите свои фотографии из своей спортивной карьеры для более подробной информации
        </p>
        <div class="grid grid-cols-5 gap-4">
          <div v-for="(photo, index) in photos" :key="index" class="relative">
            <div 
              class="border-2 border-dashed border-gray-300 rounded-lg p-4 h-24 flex items-center justify-center overflow-hidden"
              :class="{ 'border-green-500': photo }"
            >
              <template v-if="photo">
                <img :src="photo" alt="Uploaded photo" class="w-full h-full object-cover" />
                <button 
                  @click="removePhoto(index)"
                  class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </template>
              <template v-else>
                <input 
                  type="file" 
                  :ref="el => { if (el) photoInputs[index] = el }"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                  @change="uploadPhoto($event, index)"
                />
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </template>
            </div>
          </div>

    </div>
        </div>
        </div>
      </div>
    

    <!-- Edit Button -->
    <div class="fixed bottom-6 right-6">
      <button
          @click="savePlayerData"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#73B906] hover:bg-[#73B906] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#73B906]"
        >
        Сохранить изменения
      </button>
    </div>
      </div>


      <div v-if="activeTab === 'statistics'" class=" flex w-full  gap-8">
        <div class="flex flex-col items-center justify-center w-full h-[40rem] p-8">
          <div class="relative mb-6">
            <img src="/public/empty.svg" alt="">
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Раздел "Статистики" пока пусто
          </h3>
          <button 
            class="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            @click="addStatistics"
          >
            Добавить данные статистики
          </button>
      </div>
      </div>

    </div>

    </div>
</template>

<script setup>
import { ref, reactive  } from 'vue'
import { ChevronLeftIcon } from 'lucide-vue-next'

const activeTab = ref('biography')

const photos = ref(Array(5).fill(null));
const photoInputs = ref([]);

const uploadPhoto = (event, index) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      photos.value[index] = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removePhoto = (index) => {
  photos.value[index] = null;
  if (photoInputs.value[index]) {
    photoInputs.value[index].value = '';
  }
};



// Player data state
const playerData = reactive({
  name: '',
  birthDate: '',
  citizenship: 'uzbekistan',
  height: '',
  number: '',
  academy: '',
  biography: ''
})

// Photo states
const playerPhoto = ref(null)
const photoInput = ref(null)
const biographyPhotoInput = ref(null)

// Photo upload handlers
const triggerPhotoUpload = () => {
  photoInput.value.click()
}

const handlePhotoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      playerPhoto.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const deletePhoto = () => {
  playerPhoto.value = null
  if (photoInput.value) {
    photoInput.value.value = ''
  }
}

// Biography photo handlers
const triggerBiographyPhotoUpload = () => {
  biographyPhotoInput.value.click()
}

const handleBiographyPhotoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Handle biography photo upload
    console.log('Biography photo uploaded:', file.name)
  }
}

const handleBiographyPhotoDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file) {
    // Handle dropped biography photo
    console.log('Biography photo dropped:', file.name)
  }
}

// Save data
const savePlayerData = () => {
  // Handle form submission
  console.log('Saving player data:', playerData)
}

const tabs = [
  { id: 'biography', name: 'Биография игрока' },
  { id: 'application', name: 'Заявка игрока' },
  { id: 'statistics', name: 'Статистика' },
  { id: 'career', name: 'Карьера' },
  { id: 'videos', name: 'Видео материалы' },
  { id: 'photos', name: 'Фотографии' },
  { id: 'files', name: 'Загруженные файлы' }
]

const statistics = ref([
  { label: 'Number of Games', value: '93' },
  { label: 'Total Points', value: '1025' },
  { label: 'Season Games', value: '13' },
  { label: 'Average per Game', value: '12' },
  { label: 'Games Played', value: '16' },
  { label: 'Special Games', value: '3' }
])

const leftStats = [
  { label: 'Количество игр', value: '93' },
  { label: 'Количество минут на поле', value: '1025' },
  { label: 'В старте', value: '13' },
  { label: 'На замену', value: '12' }
]

const rightStats = [
  { label: 'Количество передач', value: '16' },
  { label: 'Количество голевых передач', value: '3' },
  { label: 'Желтая карточка (ЖК)', value: '2' },
  { label: 'Красная карточка (КК)', value: '-' }
]


const tableData = ref(Array(10).fill({
  teamLogo: '/public/psg.svg',
  team: 'Paris Saint Germain',
  season: '2007',
  coach: 'Насимов Григорий',
  championship: '3',
  cup: '3',
  euroCup: '0'
}))

const selectedMatch = ref(null);
const videoPlayer = ref(null);

const matches = [
  {
    id: 1,
    title: 'Обзор матча Пахтакор - Ал-айн',
    description: '«Город невест» принимает у себя полуфиналов. Организаторам выступает проект «Битвы по Золотому кольцу». «Город невест» принимает у себя полуфиналов.',
    image: '/public/psg.svg',
    hasVideo: true,
    videoUrl: 'https://www.youtube.com/embed/AfpItQBKl04',
    time: '19:32',
    date: '28.01.2023'
  },
  {
    id: 2,
    title: 'Обзор матча Пахтакор - Ал-айн',
    description: '«Город невест» принимает у себя полуфиналов. Организаторам выступает проект «Битвы по Золотому кольцу». «Город невест» принимает у себя полуфиналов.',
    image: '/public/psg.svg',
    hasVideo: false,
    time: '19:32',
    date: '28.01.2023'
  },
  {
    id: 3,
    title: 'Обзор матча Пахтакор - Ал-айн',
    description: '«Город невест» принимает у себя полуфиналов. Организаторам выступает проект «Битвы по Золотому кольцу». «Город невест» принимает у себя полуфиналов.',
    image: '/public/psg.svg',
    hasVideo: true,
    videoUrl: 'https://www.youtube.com/embed/AfpItQBKl04',
    time: '19:32',
    date: '28.01.2023'
  },
  {
    id: 4,
    title: 'Обзор матча Пахтакор - Ал-айн',
    description: '«Город невест» принимает у себя полуфиналов. Организаторам выступает проект «Битвы по Золотому кольцу». «Город невест» принимает у себя полуфиналов.',
    image: '/public/psg.svg',
    hasVideo: false,
    time: '19:32',
    date: '28.01.2023'
  }
];

const images = ref([
  {
    url: '/public/football.png',
    time: '19:32 / 20.01.2023',
    description: 'Match highlights against Zenit'
  },
  {
    url: '/public/football.png',
    time: '19:32 / 20.01.2023',
    description: 'Action shot from the game'
  },
  {
    url: '/public/football.png',
    time: '19:32 / 20.01.2023',
    description: 'Key moment during play'
  },
  {
    url: '/public/football.png',
    time: '19:32 / 20.01.2023',
    description: 'Match photography highlights'
  }
])


const documents = ref([
  {
    title: 'Единый государственный реестр судебных решений за 2020 год',
    url: '#'
  },
  {
    title: 'Единый государственный реестр судебных решений за 2020 год',
    url: '#'
  },
  {
    title: 'Единый государственный реестр судебных решений за 2020 год',
    url: '#'
  },
  {
    title: 'Единый государственный реестр судебных решений за 2020 год',
    url: '#'
  }
])

const openVideo = (match) => {
  selectedMatch.value = match;
};

const closeVideo = () => {
  if (videoPlayer.value) {
    videoPlayer.value.pause();
  }
  selectedMatch.value = null;
};
</script>
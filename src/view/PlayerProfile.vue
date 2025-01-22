<template>
  <div class="min-h-screen ">
    <!-- Header -->
    <!-- <div class="p-4 flex items-center ">
      <button class="text-gray-600 ">
        <ChevronLeftIcon class="h-6 w-6 border rounded-full" />
      </button>
    </div> -->

    <!-- Player Info Section -->
    <div class="px-6">
      <div class="flex justify-between">
        <div class="flex-1">
          <!-- Player Number and Title -->
          <!-- <div class="flex items-center gap-4 mb-2">
            <span class="text-gray-600 text-sm">№1</span>
            <span class="text-gray-600 text-sm">ОБЩ. 96</span>
            <span class="text-gray-600 text-sm">Обладатель титула</span>
          </div> -->

          <!-- Player Name -->
          <h1 class="text-2xl font-bold mb-4">
            {{ data?.first_name }} {{  data?.last_name }} {{data?.middle_name}}
          </h1>

          <!-- Position Tags -->
          <div class="flex gap-2 mb-6">
            <span class="bg-red-500 text-white px-3 py-1 rounded-md text-sm">
              {{data?.sportsman_profile?.sport?.name}}
            </span>
            <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm">
              {{data?.sportsman_profile?.sport_type}}
            </span>
          </div>

          <!-- Player Details -->
          <div class="grid grid-cols-2 gap-y-4 text-sm mb-6">
            <div>
              <p class="text-gray-500">Место рождения</p>
              <p>{{data?.sportsman_profile?.place_of_birth}} {{ data?.sportsman_profile?.region }} , {{ data?.sportsman_profile?.city }} район</p>
            </div>
            <div>
              <p class="text-gray-500">Гражданство</p>
              <p>{{data?.sportsman_profile?.citizenship}}</p>
            </div>
            <div>
              <p class="text-gray-500">День рождения</p>
              <p>{{data?.birth_date}}</p>
            </div>
            <div>
              <p class="text-gray-500">Рост</p>
              <p>{{ Number(data?.sportsman_profile?.height).toFixed(0) }} см</p>
            </div>
            <div>
              <p class="text-gray-500">Вес</p>
              <p>{{ Number(data?.sportsman_profile?.weight).toFixed(0) }} кг</p>
            </div>
            <div>
              <p class="text-gray-500">Воспитанник</p>
              <p>{{data?.sportsman_profile?.educations[0]?.school_name}}</p>
            </div>
          </div>
        </div>

        <!-- Profile Image -->
        <div class="py-20 pr-28">
          <img 
            :src="data.photo?.[0]?.file" 
            alt="Player Profile"
            class=" w-[32vh] h-[56vh] p-2 object-cover rounded-full border"
          />
        </div>
      </div>

      <!-- <div v-if="activeTab === 'statistics'" class="my-5">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6">
        <h2 class="text-2xl font-semibold mb-6">Статистика по играм</h2>
        
        <div class="space-y-4">
          <div class="flex justify-between items-center border-b pb-4">
            <div class="space-y-1">
              <p class="text-sm text-gray-500">ТУРНИР</p>
              <div class="flex items-center space-x-2">
                <span class="font-medium">Мир Узбекская Премьер-Лига</span>
              </div>
            </div>
            
            <div class="space-y-1">
              <p class="text-sm text-gray-500">СЕЗОН</p>
              <div class="flex items-center space-x-2">
                <span class="font-medium">2023/2024</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-4">
              <div v-for="stat in leftStats" :key="stat.label" 
                   class="flex justify-between items-center py-2">
                <span class="text-gray-600">{{ stat.label }}</span>
                <span class="font-semibold">{{ stat.value }}</span>
              </div>
            </div>

            <div class="space-y-4">
              <div v-for="stat in rightStats" :key="stat.label" 
                   class="flex justify-between items-center py-2">
                <span class="text-gray-600">{{ stat.label }}</span>
                <span class="font-semibold">{{ stat.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      </div> -->
    </div>
    


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

    <div class="px-6">
      <!-- <div v-if="activeTab === 'overview'" class=" flex gap-8">
      <div class="flex flex-col gap-4 w-[50%]">
        

        <p class="text-sm text-gray-600">{{data?.trainer_profile?.about_me}}</p>
      </div>
        
        <div class="mt-6">
          <img 
            src="/public/football.png" 
            alt="Game Action"
            class="w-[530px]  rounded-lg object-cover"
          />
        </div>
      </div> -->

      <div v-if="activeTab === 'statistics'" class=" flex flex-col gap-8">
        <div  class=" container flex flex-col gap-8 pb-8">
        <div class="mt-5">
          <h2 class="text-2xl font-medium text-[#11101B]">Достижения</h2>
        </div>
         <div class=" overflow-hidden w-full">
        <div class="">
          <dl class="grid grid-cols-3">
            <div v-for="(stat, index) in data?.sportsman_profile?.results" :key="index" class="px-4 py-5 border border  overflow-hidden sm:p-6">
              <dt class="text-3xl font-medium text-[#11101B] truncate">
                {{ stat.tournament.name }}
              </dt>
              <dd class="mt-1 text-sm font-semibold text-[#11101B]">
              {{ stat.tournament.start_time.split('-')[0] }} - {{ stat.tournament.end_time.split('-')[0] }}
              </dd>
            </div>
          </dl>
        </div>

        </div>
      </div>
      </div>


      <div v-if="activeTab === 'career'" class=" flex flex-col gap-8">
        <div class="w-full mx-auto mt-5">
    <div class="bg-gray-800 text-white grid grid-cols-6 text-sm font-medium">
      <div class="p-3">КОМАНДА</div>
      <div class="p-3">СЕЗОН</div>
      <div class="p-3">ТРЕНЕР</div>
      <div class="p-3">ЧЕМПИОНАТ</div>
      <div class="p-3">КУБОК</div>
      <div class="p-3">ЕВРО КУБОК</div>
    </div>

    <div class="bg-white divide-y divide-gray-200">
      <div v-for="(row, index) in tableData" 
           :key="index"
           class="grid grid-cols-6 hover:bg-gray-50">
        <div class="p-3 flex items-center space-x-3">
          <img :src="row.teamLogo" alt="Team Logo" class="w-8 h-8 rounded-full"/>
          <span>{{ row.team }}</span>
        </div>
        <div class="p-3">{{ row.season }}</div>
        <div class="p-3">{{ row.coach }}</div>
        <div class="p-3">{{ row.championship }}</div>
        <div class="p-3">{{ row.cup }}</div>
        <div class="p-3">{{ row.euroCup }}</div>
      </div>
    </div>
  </div>
      </div>

      <div v-if="activeTab === 'videos'" class=" flex flex-col gap-8">
          <div class="mt-5">
    <div class="container mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="match in matches" :key="match.id" class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
          <div class="relative">
            <img :src="match.image" :alt="match.title" class="w-full h-48 object-cover" />
            <div v-if="match.hasVideo" @click="openVideo(match)" class="absolute inset-0 flex items-center justify-center cursor-pointer">
                        <img src="/public/play.svg" alt="" class="w-16 h-16 ">
            </div>
            <div class="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {{ match.time }} / {{ match.date }}
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-2">{{ match.title }}</h3>
            <p class="text-gray-600 text-sm line-clamp-2">{{ match.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedMatch" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-4 rounded-lg max-w-3xl w-full">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">{{ selectedMatch.title }}</h2>
          <button @click="closeVideo" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        


        <div v-if="selectedMatch.hasVideo" class="aspect-w-16 aspect-h-9 ">
      <iframe
        :src="selectedMatch.videoUrl"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        class="w-full h-[25rem]">
      </iframe>
    </div>
    <p v-else>No video available for this match.</p>
      </div>
    </div>
  </div>
      </div>

      <div v-if="activeTab === 'photos'" class=" flex flex-col gap-8">
              <div class="mt-5">
        <div class="w-full mx-auto">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="(image, index) in images" 
             :key="index" 
             class="relative group overflow-hidden rounded-lg">
          <img 
            :src="image.url" 
            :alt="image.description"
            class="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-105"
          />
          <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div class="text-white text-sm">
              <time class="font-mono">{{ image.time }}</time>
              <p class="mt-1">{{ image.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
      </div>

      <div v-if="activeTab === 'files'" class=" flex flex-col gap-8">
            <div class="mt-5">
    <div class="w-full mx-auto">
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(doc, index) in documents" 
          :key="index"
          class="bg-white rounded-lg border hover:shadow-md transition-shadow duration-200 p-4"
        >
            <img src="/public/pdf.svg" alt="">
          
          <h3 class="text-sm text-gray-900  font-medium my-2">
            {{ doc.title }}
          </h3>
          
        </div>
      </div>
    </div>
  </div>
      </div>
    </div>


    

    <!-- Edit Button -->
    <!-- <div class="fixed bottom-6 right-6">
      <button @click="handleAction('/biography-player')" class="bg-red-500 text-white px-4 py-2 rounded-md text-sm">
        Изменить данные спортсмена
      </button>
    </div> -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronLeftIcon } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import api from "../utils/axios"


const route = useRoute()
const router = useRouter()
const activeTab = ref('statistics')
const playerImage = '/public/boy.svg'



const data = ref([])

const getData = async () => {
  try {
    const res = await api.get(
      `https://api.7srating.uz/api/user/profile/sportsman/${route.params.id}/`
    );
    data.value = res.data.data;
  } catch (e) {
    console.log(e);
  }
};

getData()

const tabs = [
  // { id: 'overview', name: 'Заявка игрока' },
  // { id: 'statistics', name: 'Статистика' },
  // { id: 'career', name: 'Карьера' },
  // { id: 'videos', name: 'Видео материалы' },
  // { id: 'photos', name: 'Фотографии' },
  // { id: 'files', name: 'Загруженные файлы' }
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

const handleAction = (project) => {
  // console.log('Action clicked for project:', project.id)
  router.push(project)
}
</script>
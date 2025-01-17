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
              {{data?.trainer_profile?.sport?.name}}
            </span>
            <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm">
              {{data?.trainer_profile?.sport_type}}
            </span>
          </div>

          <!-- Player Details -->
          <div class="grid grid-cols-2 gap-y-4 text-sm mb-6">
            <div>
              <p class="text-gray-500">Место рождения</p>
              <p>{{data?.trainer_profile?.place_of_birth}} {{ data?.trainer_profile?.region }} , {{ data?.trainer_profile?.city }} район</p>
            </div>
            <div>
              <p class="text-gray-500">Гражданство</p>
              <p>{{data?.trainer_profile?.citizenship}}</p>
            </div>
            <div>
              <p class="text-gray-500">День рождения</p>
              <p>{{data?.birth_date}}</p>
            </div>
            <div>
              <p class="text-gray-500">Рост</p>
              <p>{{ Number(data?.trainer_profile?.height).toFixed(0) }} см</p>
            </div>
            <div>
              <p class="text-gray-500">Вес</p>
              <p>{{ Number(data?.trainer_profile?.weight).toFixed(0) }} кг</p>
            </div>
            <div>
              <p class="text-gray-500">Воспитанник</p>
              <p>{{data?.trainer_profile?.educations[0]?.name}}</p>
            </div>
          </div>
        </div>

        <!-- Profile Image -->
        <div class="p-20">
          <img 
            :src="data.photo?.[0]?.file" 
            alt="Player Profile"
            class=" w-[32vh] h-[32vh] p-2 object-cover rounded-full border"
          />
        </div>
      </div>

      
    </div>

    <!-- Tabs -->
    <!-- <div class="px-6 mb-6">
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
    </div> -->

    <!-- Content -->

     <div  class=" container flex flex-col gap-8 pb-8">
        <div class="mt-5">
          <h2 class="text-2xl font-medium text-[#11101B]">Достижения</h2>
        </div>
         <div class="  overflow-hidden w-full">
        <div class="">
          <dl class="grid grid-cols-3">
            <div v-for="(stat, index) in data?.trainer_profile?.results" :key="index" class="px-4 py-5 border border  overflow-hidden sm:p-6">
              <dt class="text-3xl font-medium text-[#11101B] truncate">
              {{ stat.tournament.start_time.split('-')[0] }} - {{ stat.tournament.end_time.split('-')[0] }}
              </dt>
              <dd class="mt-1 text-sm font-semibold text-[#11101B]">
                {{ stat.tournament.name }}
              </dd>
            </div>
          </dl>
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
const activeTab = ref('overview')
const playerImage = '/public/boy.svg'



const data = ref([])

const getData = async () => {
  try {
    const res = await api.get(
      `https://api.7srating.uz/api/user/profile/trainer/${route.params.id}/`
    );
    data.value = res.data.data;
  } catch (e) {
    console.log(e);
  }
};

getData()

const tabs = [
  { id: 'overview', name: 'Заявка игрока' },
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

const handleAction = (project) => {
  // console.log('Action clicked for project:', project.id)
  router.push(project)
}
</script>
<template>
  <div class="min-h-screen  p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Пулатов Мавлонбек Мухторжонович</h1>
      <nav class="flex space-x-2 text-sm text-gray-500">
        <a href="#" class="hover:text-gray-900">Главная</a>
        <span>→</span>
        <span>Фонд "Бирлик"</span>
      </nav>
    </div>

    <!-- Image Carousel -->
    <div class="relative mb-8">
      <div class="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        <div 
          v-for="(image, index) in images" 
          :key="index"
          class="flex-none first:ml-0"
        >
          <img 
            :src="image"
            :class="[
              'w-[300px] h-[200px] rounded-lg object-cover cursor-pointer',
              currentImage === index ? '' : ''
            ]"
            @click="currentImage = index"
            alt="Football match moment"
          />
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Application Goal -->
      <div>
        <h2 class="text-xl font-semibold mb-4">Цель заявки</h2>
        <p class="text-gray-600 leading-relaxed">
          Здравствуйте,
          Меня зовут Мавлонбек, и я из Ташкента, Узбекистан. Я профессионально увлечен и
          нацелен на успех. В течение этого года мы отправимся в Барселону, Испания, чтобы
          принять участие в международном турнире. Это важный шаг в моей карьере, так как на
          Олимпийских играх будут новые методы и детали,
          и достижение цели для нас чтобы пройти квалификацию на Париж 2024. К
          сожалению, из-за высоких затрат на поездку и проживание, я ищем спонсорскую помощь
          поэтому я создал эту кампанию.Каждый кто внесет пожертвование в эту кампанию,
          получит право выиграть майку с автографом Лионеля Месси из Барселоны на прямом
          эфире.
        </p>
      </div>

      <!-- Financial Goals -->
      <div>
        <h2 class="text-xl font-semibold mb-4">Финансовая цель</h2>
        <div class="bg-white p-6 rounded-lg border">
          <div class="grid grid-cols-3 gap-4">
            <div>
              <div class="text-2xl font-bold text-gray-900">15 млн. сум</div>
              <div class="text-sm text-gray-500">Нужно собрать</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-green-600">10 млн. сум</div>
              <div class="text-sm text-gray-500">Собрано</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900">до 15.01.2024</div>
              <div class="text-sm text-gray-500">Сроки</div>
            </div>
          </div>
          
          <!-- Progress Bar -->
          <div class="mt-4">
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="bg-green-600 h-2.5 rounded-full" style="width: 66%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Donations -->
    <div>
      <h2 class="text-xl font-semibold mb-4">Пожертвовали</h2>
      <div class="bg-white rounded-lg border">
        <div class="p-4 border-b">
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span class="text-gray-600">ПМ</span>
            </div>
            <div>
              <div class="font-medium">Пулатов Мавлонбек</div>
              <div class="text-sm text-gray-500">1 200 000 сум</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Sample image URLs - replace with actual image URLs
const images = ref([
  '/public/football.png',
  '/public/football.png',
  '/public/football.png',
  '/public/football.png',
  '/public/football.png'
])

const currentImage = ref(0)
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
<template>
  <div>
    <!-- Breadcrumbs -->
    <nav class="flex mb-6 text-sm text-gray-500">
      <a href="#" class="hover:text-gray-700">Главная</a>
      <span class="mx-2">→</span>
      <a href="#" class="hover:text-gray-700">Пользователи</a>
      <span class="mx-2">→</span>
      <span class="text-gray-900">Добавить пользователя</span>
    </nav>


    <!-- Photos Section -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Фотографии</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="(photo, index) in photos" :key="'photo-' + index" 
          class="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <img :src="photo.url" :alt="photo.name" class="w-full h-full object-cover" />
          <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
            {{ photo.name }}
          </div>
        </div>
        
        <!-- Add Photo Button -->
        <label class="cursor-pointer aspect-video flex flex-col items-center justify-center bg-pink-50 rounded-lg border-2 border-dashed border-pink-200 hover:bg-pink-100 transition-colors">
          <input type="file" accept="image/*" class="hidden" @change="handlePhotoUpload" />
          <div class="w-8 h-8 mb-2 text-pink-500">
            <img src="../../assets/img/plus.svg" alt="plus">
          </div>
          <span class="text-sm text-pink-600">Добавить новый фотографию</span>
        </label>
      </div>
    </section>

    <!-- Videos Section -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Видео материалы</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="(video, index) in videos" :key="'video-' + index"
          class="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <img :src="video.thumbnail" :alt="video.name" class="w-full h-full object-cover" />
          <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
            {{ video.name }}
          </div>
        </div>

        <!-- Add Video Button -->
        <label class="cursor-pointer aspect-video flex flex-col items-center justify-center bg-pink-50 rounded-lg border-2 border-dashed border-pink-200 hover:bg-pink-100 transition-colors">
          <input type="file" accept="video/*" class="hidden" @change="handleVideoUpload" />
          <div class="w-8 h-8 mb-2 text-pink-500">
            <img src="../../assets/img/plus.svg" alt="plus">
          </div>
          <span class="text-sm text-pink-600">Добавить новый видео материал</span>
        </label>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive ,watch} from 'vue'
// import { PlusIcon } from 'lucide-vue-next'

const props = defineProps({
  media: {
    type: Object,
    required: true,
    default: () => ({
      photos: [],
      videos: []
    }),
  }
});

// Sample data
const photos = ref([
  { url: '/public/football.png', name: 'Фото материал 001.png' },
  { url: '/public/football.png', name: 'Фото материал 001.png' },
])

const videos = ref([
  { thumbnail: '/public/football.png', name: 'Видео материал 001.MOV' },
  { thumbnail: '/public/football.png', name: 'Видео материал 001.MOV' },
])

const emit = defineEmits(['update-media']);
const currentMedia = reactive({
  photos: Array.isArray(props.media.photos) ? [...props.media.photos] : [],
  videos: Array.isArray(props.media.videos) ? [...props.media.videos] : [],
});

const handlePhotoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Handle photo upload logic here
    photos.value.push({
      url: URL.createObjectURL(file),
      name: file.name
    })

     currentMedia.photos.push({
      url: URL.createObjectURL(file),
      name: file.name,
    });
    
  }
}
const handleVideoUpload = (event) => {
  const file = event.target.files[0];

  if (file) {
    if (!file.type.startsWith("video/")) {
      console.error("Uploaded file is not a video.");
      return;
    }

    const videoURL = URL.createObjectURL(file);
    const videoElement = document.createElement("video");

    videoElement.src = videoURL;
    videoElement.currentTime = 1; 

    videoElement.addEventListener("loadeddata", () => {
      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      const context = canvas.getContext("2d");
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      const thumbnail = canvas.toDataURL("image/png"); 

      videos.value.push({
        thumbnail, 
        name: file.name
      });

      currentMedia.videos.push({
        thumbnail,
        name: file.name,
      });

      URL.revokeObjectURL(videoURL);
    });
  }
};


// watch(currentMedia, (newValue) => {
//   emit('update-media', newValue);
// }, { deep: true });


watch(
  () => currentMedia,
  (newValue) => {
    emit('update-media', { ...newValue });
  },
  { deep: true }
);
</script>
<template>
  <div>
    <Loading :isLoading="isUploading" />
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
        <div
          v-for="(photo, index) in photos"
          :key="'photo-' + index"
          class="relative aspect-video bg-gray-100 rounded-lg overflow-hidden"
        >
          <img :src="photo.url" :alt="photo.name" class="w-full h-full object-cover" />
          <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-100 text-white text-xs p-2 flex justify-between items-center">
            <span>{{ photo.name }}</span>
            <button @click="deletePhoto(photo, index)" class="text-red-500 hover:text-red-700 font-bold z-10">Удалить</button>
          </div>
        </div>

        <!-- Add Photo Button -->
        <label
          class="cursor-pointer aspect-video flex flex-col items-center justify-center bg-pink-50 rounded-lg border-2 border-dashed border-pink-200 hover:bg-pink-100 transition-colors"
        >
          <input type="file" accept="image/*" class="hidden" @change="handlePhotoUpload" />
          <div class="w-8 h-8 mb-2 text-pink-500">
            <img src="../../assets/img/plus.svg" alt="plus" />
          </div>
          <span class="text-sm text-pink-600">Добавить новый фотографию</span>
        </label>
      </div>
    </section>

    <!-- Videos Section -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Видео материалы</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="(video, index) in videos"
          :key="'video-' + index"
          class="relative aspect-video bg-gray-100 rounded-lg overflow-hidden"
        >
          <img :src="video.thumbnail" :alt="video.name" class="w-full h-full object-cover" />
          <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 flex justify-between items-center">
            <span>{{ video.name }}</span>
            <button @click="deleteVideo(video, index)" class="text-red-500 hover:text-red-700 font-bold">Удалить</button>
          </div>
        </div>

        <!-- Add Video Button -->
        <label
          class="cursor-pointer aspect-video flex flex-col items-center justify-center bg-pink-50 rounded-lg border-2 border-dashed border-pink-200 hover:bg-pink-100 transition-colors"
        >
          <input type="file" accept="video/*" class="hidden" @change="handleVideoUpload" />
          <div class="w-8 h-8 mb-2 text-pink-500">
            <img src="../../assets/img/plus.svg" alt="plus" />
          </div>
          <span class="text-sm text-pink-600">Добавить новый видео материал</span>
        </label>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import api from '../../utils/axios';
import Loading from '../../components/Loading.vue';

const props = defineProps({
  media_ids: {
    type: Array,
    required: true,
  },
  media_bay: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update-media']);
const isUploading = ref(false);
const localMediaIds = ref([...props.media_ids]);
const photos = ref(JSON.parse(localStorage.getItem('photos')) || []);
const videos = ref(JSON.parse(localStorage.getItem('videos')) || []);

const saveToLocalStorage = () => {
  localStorage.setItem('media_ids', JSON.stringify(localMediaIds.value));
  localStorage.setItem('photos', JSON.stringify(photos.value));
  localStorage.setItem('videos', JSON.stringify(videos.value));
};

const deletePhoto = async (photo, index) => {
  try {
    await api.delete(`https://api.7srating.uz/api/user/media/${photo.id}/`);
    photos.value.splice(index, 1);
    localMediaIds.value = localMediaIds.value.filter((id) => id !== photo.id);
    emit('update-media', localMediaIds.value);
    saveToLocalStorage();
  } catch (error) {
    console.error('Failed to delete photo:', error.response?.data || error.message);
  }
};

const deleteVideo = async (video, index) => {
  try {
    await api.delete(`https://api.7srating.uz/api/user/media/${video.id}/`);
    videos.value.splice(index, 1);
    localMediaIds.value = localMediaIds.value.filter((id) => id !== video.id);
    emit('update-media', localMediaIds.value);
    saveToLocalStorage();
  } catch (error) {
    console.error('Failed to delete video:', error.response?.data || error.message);
  }
};

const handlePhotoUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  isUploading.value = true;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('owner', 'sportsman');

  try {
    const response = await api.post(
      'https://api.7srating.uz/api/user/media-upload/',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    localMediaIds.value.push(response.data.data.id);
    emit('update-media', localMediaIds.value);
    photos.value.push({
      id: response.data.data.id,
      url: URL.createObjectURL(file),
      name: file.name,
    });
    saveToLocalStorage();
  } catch (error) {
    console.error('File upload failed:', error.response?.data || error.message);
  } finally {
    isUploading.value = false;
  }
};

const handleVideoUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  isUploading.value = true;
  const videoURL = URL.createObjectURL(file);
  const videoElement = document.createElement('video');
  videoElement.src = videoURL;
  videoElement.currentTime = 1;

  videoElement.addEventListener('loadeddata', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const thumbnail = canvas.toDataURL('image/png');
    URL.revokeObjectURL(videoURL);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('owner', 'sportsman');

    try {
      const response = await api.post(
        'https://api.7srating.uz/api/user/media-upload/',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      localMediaIds.value.push(response.data.data.id);
      emit('update-media', localMediaIds.value);
      videos.value.push({
        id: response.data.data.id,
        thumbnail,
        name: file.name,
      });
      saveToLocalStorage();
    } catch (error) {
      console.error('Video upload failed:', error.response?.data || error.message);
    } finally {
      isUploading.value = false;
    }
  });
};

const fetchMediaData = async () => {
  try {
    const fetchedPhotos = props.media_bay
      .filter((item) => item.media_type === 'image')
      .map((item) => ({
        id: item.id,
        url: `https://api.7srating.uz${item.file}`,
        name: `Image (${item.extension.toUpperCase()})`,
      }));

    const fetchedVideos = props.media_bay
      .filter((item) => item.media_type === 'video')
      .map((item) => ({
        id: item.id,
        thumbnail: `https://api.7srating.uz${item.file}`,
        name: `Video (${item.extension.toUpperCase()})`,
      }));

    photos.value = fetchedPhotos;
    videos.value = fetchedVideos;
  } catch (error) {
    console.error('Failed to fetch media data:', error.response?.data || error.message);
  }
};

onMounted(() => {
  const storedMediaIds = JSON.parse(localStorage.getItem('media_ids'));
  if (storedMediaIds) localMediaIds.value = storedMediaIds;

  const storedPhotos = JSON.parse(localStorage.getItem('photos'));
  if (storedPhotos) photos.value = storedPhotos;

  const storedVideos = JSON.parse(localStorage.getItem('videos'));
  if (storedVideos) videos.value = storedVideos;
  
  fetchMediaData();

});
</script>
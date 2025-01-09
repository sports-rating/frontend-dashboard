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
import { ref, reactive, watch, onMounted } from 'vue'
import api from "../../utils/axios"
import { PlusIcon } from 'lucide-vue-next'
import Loading from "../../components/Loading.vue"


const props = defineProps({
  media_ids: {
    type: Array,
    required: true,
  },
  media_bay: {
    type: Array,
    required: true,
  }
});


const emit = defineEmits(['update-media']);
const isUploading = ref(false);
const localMediaIds = ref([...props.media_ids]);

const photos = ref(JSON.parse(localStorage.getItem("photos")) || []);
const videos = ref(JSON.parse(localStorage.getItem("videos")) || []);


const saveToLocalStorage = () => {
  localStorage.setItem("media_ids", JSON.stringify(localMediaIds.value));
  localStorage.setItem("photos", JSON.stringify(photos.value));
  localStorage.setItem("videos", JSON.stringify(videos.value));
};


const handlePhotoUpload = async (event) => {
  const file = event.target.files[0];


  if (!file) {
    console.error("No file selected.");
    return;
  }
  isUploading.value = true; 

  const formData = new FormData();
  formData.append("file", file);
  formData.append("owner", "sportsman");

  try {
    // Send the file using axios
    const response = await api.post(
      "https://api.7srating.uz/api/user/media-upload/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

       isUploading.value = true; 
    localMediaIds.value.push(response.data.data.id);
    emit("update-media", localMediaIds.value);


    photos.value.push({
      url: URL.createObjectURL(file),
      name: file.name
    })
    
    saveToLocalStorage();
  } catch (error) {
    console.error("File upload failed:", error.response?.data || error.message);
  }
  finally {
    isUploading.value = false; // Set loading state to false when done
  }
};

const handleVideoUpload = async (event) => {
  const file = event.target.files[0];

  if (!file) {
    console.error("No file selected.");
    return;
  }
  isUploading.value = true; 

  if (!file.type.startsWith("video/")) {
    console.error("Uploaded file is not a video.");
    return;
  }

  const videoURL = URL.createObjectURL(file);
  const videoElement = document.createElement("video");

  videoElement.src = videoURL;
  videoElement.currentTime = 1; // Set a specific time to capture the thumbnail

  videoElement.addEventListener("loadeddata", async () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const thumbnail = canvas.toDataURL("image/png"); // Generate thumbnail as a Base64 string

    URL.revokeObjectURL(videoURL); // Revoke object URL to free memory

    const formData = new FormData();
    formData.append("file", file);
    formData.append("owner", "sportsman");

    try {
      // Upload the video file using Axios
      const response = await api.post(
        "https://api.7srating.uz/api/user/media-upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
         isUploading.value = true; 
       localMediaIds.value.push(response.data.data.id);
      emit("update-media", localMediaIds.value);

      // Push video details (thumbnail and name) into the videos list
      videos.value.push({
        thumbnail, // Generated thumbnail
        name: file.name,
      });

      saveToLocalStorage();
    } catch (error) {
      console.error("Video upload failed:", error.response?.data || error.message);
    }finally {
    isUploading.value = false; // Set loading state to false when done
  }
  });
};

// Function to fetch media data from the API
const fetchMediaData = async () => {
  try {
    const fetchedPhotos = props.media_bay.filter(item => item.media_type === "image").map(item => ({
      id: item.id,
      url: `https://api.7srating.uz${item.file}`, 
      name: `Image (${item.extension.toUpperCase()})`, 
    }));

    const fetchedVideos = props.media_bay.filter(item => item.media_type === "video").map(item => ({
      id: item.id,
      thumbnail: `https://api.7srating.uz${item.file}`, 
      name: `Video (${item.extension.toUpperCase()})`,
    }));


    photos.value = fetchedPhotos;
    videos.value = fetchedVideos;
  } catch (error) {
    console.error("Failed to fetch media data:", error.response?.data || error.message);
  }
};


onMounted(() => {
  const storedMediaIds = JSON.parse(localStorage.getItem("media_ids"));
  if (storedMediaIds) {
    localMediaIds.value = storedMediaIds;
  }

  const storedPhotos = JSON.parse(localStorage.getItem("photos"));
  if (storedPhotos) {
    photos.value = storedPhotos;
  }

  const storedVideos = JSON.parse(localStorage.getItem("videos"));
  if (storedVideos) {
    videos.value = storedVideos;
  }

  fetchMediaData();
});
</script>
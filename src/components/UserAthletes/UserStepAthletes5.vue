<template>
  <div>
    <Loading :isLoading="isUploading" />

    <!-- Photos Section -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Фотографии</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="(photo, index) in photos.filter((p) => !p.is_profile_photo)"
          :key="'photo-' + index"
          class="relative aspect-video bg-gray-100 rounded-lg overflow-hidden"
        >
          <img :src="photo.url" :alt="photo.name" class="w-full h-full object-cover" />
          <div
            class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-100 text-white text-xs p-2 flex justify-between items-center"
          >
            <span>{{ photo.name }}</span>
            <button
              @click="deletePhoto(photo, index)"
              class="text-red-500 hover:text-red-700 font-bold z-10"
            >
              Удалить
            </button>
          </div>
        </div>

        <!-- Add Photo Button -->
        <label
          class="cursor-pointer aspect-video flex flex-col items-center justify-center bg-pink-50 rounded-lg border-2 border-dashed border-pink-200 hover:bg-pink-100 transition-colors"
        >
          <input
            type="file"
            accept="image/*"
            class="hidden"
            multiple
            @change="handlePhotoUpload"
          />
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
          <img
            :src="video.thumbnail"
            :alt="video.name"
            class="w-full h-full object-cover"
          />
          <div
            class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 flex justify-between items-center"
          >
            <span>{{ video.name }}</span>
            <button
              @click="deleteVideo(video, index)"
              class="text-red-500 hover:text-red-700 font-bold"
            >
              Удалить
            </button>
          </div>
        </div>

        <!-- Add Video Button -->
        <label
          class="cursor-pointer aspect-video flex flex-col items-center justify-center bg-pink-50 rounded-lg border-2 border-dashed border-pink-200 hover:bg-pink-100 transition-colors"
        >
          <input
            type="file"
            accept="video/*"
            class="hidden"
            @change="handleVideoUpload"
          />
          <div class="w-8 h-8 mb-2 text-pink-500">
            <img src="../../assets/img/plus.svg" alt="plus" />
          </div>
          <span class="text-sm text-pink-600">Добавить новый видео материал</span>
        </label>
      </div>
    </section>

    <!-- PDFs Section -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">PDF материалы</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="(pdf, index) in pdfs"
          :key="'pdf-' + index"
          class="relative aspect-video bg-gray-100 rounded-lg overflow-hidden"
        >
          <div class="w-full h-full flex items-center justify-center">
            <img src="../../assets/img/pdf.svg" alt="pdf" class="w-16 h-16" />
          </div>
          <div
            class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 flex justify-between items-center"
          >
            <span>{{ pdf.name }}</span>
            <button
              @click="deletePdf(pdf, index)"
              class="text-red-500 hover:text-red-700 font-bold"
            >
              Удалить
            </button>
          </div>
        </div>

        <!-- Add PDF Button -->
        <label
          class="cursor-pointer aspect-video flex flex-col items-center justify-center bg-pink-50 rounded-lg border-2 border-dashed border-pink-200 hover:bg-pink-100 transition-colors"
        >
          <input
            type="file"
            accept="application/pdf"
            class="hidden"
            @change="handlePdfUpload"
          />
          <div class="w-8 h-8 mb-2 text-pink-500">
            <img src="../../assets/img/plus.svg" alt="plus" />
          </div>
          <span class="text-sm text-pink-600">Добавить новый PDF материал</span>
        </label>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import api from "../../utils/axios";
import Loading from "../../components/Loading.vue";
import { ElMessage } from "element-plus";

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

const emit = defineEmits(["update-media"]);
const isUploading = ref(false);
const localMediaIds = ref([...props.media_ids]);
const photos = ref(JSON.parse(localStorage.getItem("photos")) || []);
const videos = ref(JSON.parse(localStorage.getItem("videos")) || []);
const pdfs = ref(JSON.parse(localStorage.getItem("pdfs")) || []);

const saveToLocalStorage = () => {
  localStorage.setItem("media_ids", JSON.stringify(localMediaIds.value));
  localStorage.setItem("photos", JSON.stringify(photos.value));
  localStorage.setItem("videos", JSON.stringify(videos.value));
  localStorage.setItem("pdfs", JSON.stringify(pdfs.value));
};

const deletePhoto = async (photo, index) => {
  try {
    await api.delete(`/user/media/${photo.id}/`);
    photos.value.splice(index, 1);
    localMediaIds.value = localMediaIds.value.filter((id) => id !== photo.id);
    emit("update-media", localMediaIds.value);
    saveToLocalStorage();
  } catch (error) {
    console.error("Failed to delete photo:", error.response?.data || error.message);
  }
};

const deleteVideo = async (video, index) => {
  try {
    await api.delete(`/user/media/${video.id}/`);
    videos.value.splice(index, 1);
    localMediaIds.value = localMediaIds.value.filter((id) => id !== video.id);
    emit("update-media", localMediaIds.value);
    saveToLocalStorage();
  } catch (error) {
    console.error("Failed to delete video:", error.response?.data || error.message);
  }
};

const deletePdf = async (pdf, index) => {
  try {
    await api.delete(`/user/media/${pdf.id}/`);
    pdfs.value.splice(index, 1);
    localMediaIds.value = localMediaIds.value.filter((id) => id !== pdf.id);
    emit("update-media", localMediaIds.value);
    saveToLocalStorage();
  } catch (error) {
    console.error("Failed to delete PDF:", error.response?.data || error.message);
  }
};

const handlePhotoUpload = async (event) => {
  const files = Array.from(event.target.files); // Collect all selected files
  if (!files.length) return;

  isUploading.value = true;
  try {
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "user");
      formData.append("is_profile_photo", false);

      const response = await api.post(
        "/user/media-upload/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      localMediaIds.value.push(response.data.data.id);
      emit("update-media", localMediaIds.value);
      photos.value.push({
        id: response.data.data.id,
        url: URL.createObjectURL(file),
        name: file.name,
      });
    }
    saveToLocalStorage();
  } catch (error) {
    ElMessage.error(error.response.data.message);
  } finally {
    isUploading.value = false;
  }
};

const handleVideoUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  isUploading.value = true;
  const videoURL = URL.createObjectURL(file);
  const videoElement = document.createElement("video");
  videoElement.src = videoURL;
  videoElement.currentTime = 1;

  videoElement.addEventListener("loadeddata", async () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const thumbnail = canvas.toDataURL("image/png");
    URL.revokeObjectURL(videoURL);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "user");
    formData.append("is_profile_photo", false);

    try {
      const response = await api.post(
        "/user/media-upload/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      localMediaIds.value.push(response.data.data.id);
      emit("update-media", localMediaIds.value);
      videos.value.push({
        id: response.data.data.id,
        thumbnail,
        name: file.name,
      });
      saveToLocalStorage();
    } catch (error) {
      ElMessage.error(error.response.data.message);
    } finally {
      isUploading.value = false;
    }
  });
};

const handlePdfUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  isUploading.value = true;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", "user");
  formData.append("is_profile_photo", false);

  try {
    const response = await api.post(
      "/user/media-upload/",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    localMediaIds.value.push(response.data.data.id);
    emit("update-media", localMediaIds.value);
    pdfs.value.push({
      id: response.data.data.id,
      name: file.name,
    });
    saveToLocalStorage();
  } catch (error) {
      ElMessage.error(error.response.data.message);
  } finally {
    isUploading.value = false;
  }
};

const fetchMediaData = async () => {
  try {
    const fetchedPhotos = props.media_bay
      .filter((item) => item.media_type === "image")
      .map((item) => ({
        id: item.id,
        url: `${item.file}`,
        name: `Image (${item.extension.toUpperCase()})`,
        is_profile_photo: item.is_profile_photo,
      }));

    const fetchedVideos = props.media_bay
      .filter((item) => item.media_type === "video")
      .map((item) => ({
        id: item.id,
        thumbnail: `${item.file}`,
        name: `Video (${item.extension.toUpperCase()})`,
        is_profile_photo: item.is_profile_photo,
      }));

    const fetchedPdfs = props.media_bay
      .filter((item) => item.media_type === "pdf")
      .map((item) => ({
        id: item.id,
        name: `PDF (${item.extension.toUpperCase()})`,
        is_profile_photo: item.is_profile_photo,
      }));

    photos.value = fetchedPhotos;
    videos.value = fetchedVideos;
    pdfs.value = fetchedPdfs;
  } catch (error) {
    console.error("Failed to fetch media data:", error.response?.data || error.message);
  }
};

onMounted(() => {
  const storedMediaIds = JSON.parse(localStorage.getItem("media_ids"));
  if (storedMediaIds) {
    localMediaIds.value = storedMediaIds;
  }
  fetchMediaData();
});
</script>

<style scoped>
/* Add additional styles if needed */
</style>

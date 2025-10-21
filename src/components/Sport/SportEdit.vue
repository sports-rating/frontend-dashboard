<template>
  <div class="mx-auto p-4 rounded-xl border">
    <h2 class="text-2xl font-bold mb-6">Добавить Спорт</h2>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <section>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-4">
          <!-- Name Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Имя</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Введите Имя"
              class="mt-1 bg-white block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.name">{{ errors.name }}</span>
          </div>

          <!-- Photo Upload -->
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700"> Фотография </label>
            <div class="mt-1 flex items-center space-x-4">
              <label
                for="upload"
                class="w-full flex items-center px-4 py-2 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-50"
              >
                <span class="text-sm text-gray-600">{{
                  form.photoName || "Выберите файл"
                }}</span>
                <input
                  id="upload"
                  type="file"
                  @change="handleFileUpload"
                  accept="image/*"
                  class="hidden"
                />
              </label>
            </div>
            <span class="text-red-500 mt-1" v-if="errors.photo">{{ errors.photo }}</span>

            <!-- Image Preview -->
            <div v-if="preview" class="mt-2">
              <img
                :src="preview"
                alt="Выбранное изображение"
                class="w-32 h-32 object-cover rounded-md border"
              />
            </div>
          </div>

          <!-- Scoring Policies -->
          <div class="col-span-3 border rounded-lg p-4 space-y-4">
            <h3 class="text-md font-semibold text-gray-700">Спортивные виды</h3>

            <div v-for="(policy, index) in form.types" :key="index" class="flex items-center gap-4">
              <div class="w-1/2">
              <label class="block text-sm font-medium text-gray-700">Имя</label>
              <input
                v-model="policy.name"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Имя"
              />
            </div>
              

              <button type="button" @click="removePolicy(index)" class="mt-6 text-red-600 hover:text-red-800">
                Удалить
              </button>
            </div>

            <button
              type="button"
              @click="addPolicy"
              class="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              + Добавить вид
            </button>

            <span class="text-red-500 mt-1" v-if="errors.types">{{ errors.types }}</span>
          </div>

        </div>
      </section>
    </form>

    <!-- Buttons -->
    <div class="flex justify-end space-x-4 mt-5">
      <button
        type="button"
        @click="goBack"
        class="px-4 py-2 border border-gray-300 rounded-md p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Отмена
      </button>
      <button
        type="submit"
        @click="handleSubmit"
        :disabled="isSubmitting || isUploading"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {{ isSubmitting ? "Сохранить..." : "Добавить" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import api from "../../utils/axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const errors = reactive({});
const isSubmitting = ref(false);
const isUploading = ref(false);
const preview = ref(null);

const form = reactive({
  name: "",
  logo: null,
  photoName: "",
  types: [],
});

const addPolicy = () => {
  form.types.push({ name: '' });
};

const removePolicy = (index) => {
  form.types.splice(index, 1);
};


const initialData = reactive({
  name: "",
  logo: "",
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.logo = file;
    form.photoName = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
      preview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const getData = async () => {
  try {
    const res = await api.get(`/sport/${route.params.id}/`);

    form.name = res.data.data.name;
    form.photoName = res.data.data.logo.match(/[^/]+$/)[0];
    form.logo = res.data.data.logo;
    preview.value = res.data.data.logo;

    // Dastlabki qiymatlarni saqlab qo'yamiz
    initialData.name = res.data.data.name;
    initialData.logo = res.data.data.logo;

    form.types = d.types.map((p) => ({
      id: p.id,
      name: p.name,
    }));
  } catch (e) {
    console.log(e);
  }
};

onMounted(() => {
  getData();
});

const goBack = () => {
  window.history.go(-1);
};

const handleSubmit = async () => {
  if (!form.logo && !form.name) {
    console.error("No changes detected.");
    return;
  }

  const formData = new FormData();

  // Faqat o'zgartirilgan maydonlarni qo'shish
  if (form.name !== initialData.name) {
    formData.append("name", form.name);
  }

  if (form.logo instanceof File) {
    formData.append("logo", form.logo);
  }

  form.types.forEach((p, index) => {
    if (p.id) {
      formData.append(`types[${index}]id`, p.id);
    }
    formData.append(`types[${index}]name`, p.position);
  });

  // Agar hech qanday o'zgarish bo'lmasa, so‘rov yuborilmaydi
  if (!formData.has("name") && !formData.has("logo")) {
    toast.info("Hech qanday o'zgarish yo'q", { autoClose: 3000 });
    return;
  }

  isSubmitting.value = true;
  try {
    await api.patch(`/sport/${route.params.id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success("Muvaffaqiyatli saqlandi", { autoClose: 3000 });
    router.push("/sport-list");
  } catch (error) {
    console.error("Submission error:", error);
    ElMessage.error(error.response.data.message);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

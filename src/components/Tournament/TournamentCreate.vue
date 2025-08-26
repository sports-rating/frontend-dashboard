<template>
  <div class="mx-auto p-4 rounded-xl border">
    <h2 class="text-2xl font-bold mb-6">Добавить турнир</h2>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Personal Information Section -->
      <section>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
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
          <div>
            <label class="block text-sm font-medium text-gray-700">Введите федерацию</label>

            <Multiselect
              v-model="form.federation"
              :options="dataFederation"
              label="name"
              track-by="id"
              value-prop="id"
              placeholder="Выберите federation"
              class="mt-1"
            />
            <span class="text-red-500 mt-1" v-if="errors.federation">{{
              errors.federation
            }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Введите sport</label>

            <Multiselect
              v-model="form.sport_id"
              :options="data"
              label="name"
              track-by="id"
              value-prop="id"
              placeholder="Выберите sport"
              class="mt-1"
            />
            <span class="text-red-500 mt-1" v-if="errors.sport_id">{{
              errors.sport_id
            }}</span>
          </div>

          <!-- Photo Upload -->
          <div class="col-span-1">
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
  <h3 class="text-md font-semibold text-gray-700">Политика подсчета очков</h3>

  <div v-for="(policy, index) in form.scoring_policies" :key="index" class="flex items-center gap-4">
    <div class="w-1/2">
      <label class="block text-sm font-medium text-gray-700">Позиция</label>
      <input
        v-model.number="policy.position"
        type="number"
        min="1"
        class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
        placeholder="Например: 1"
      />
    </div>

    <div class="w-1/2">
      <label class="block text-sm font-medium text-gray-700">Счет</label>
      <input
        v-model.number="policy.score"
        type="number"
        min="0"
        class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
        placeholder="Например: 10"
      />
    </div>

    <!-- Remove button -->
    <button
      type="button"
      @click="removePolicy(index)"
      class="mt-6 text-red-600 hover:text-red-800"
    >
      Удалить
    </button>
  </div>

  <!-- Add new row -->
  <button
    type="button"
    @click="addPolicy"
    class="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
  >
    + Добавить место
  </button>

  <span class="text-red-500 mt-1" v-if="errors.scoring_policies">
    {{ errors.scoring_policies }}
  </span>
</div>

        </div>
      </section>
    </form>

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
        {{ isSubmitting ? "Сохранить..." : "Добавить " }}
      </button>
    </div>
  </div>
</template>

<script setup>
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import { reactive, ref, watch } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import api from "../../utils/axios";
import router from "../../router";

const errors = reactive({});
const isSubmitting = ref(false);
const data = ref([]); 
const dataFederation = ref([]); 
const isUploading = ref(false);
const preview = ref(null);

const form = reactive({
  name: "",
  federation: null, 
  sport_id: "",
  logo: "",
  photoName: "",
   scoring_policies: [],
});

// Policy qo‘shish
const addPolicy = () => {
  form.scoring_policies.push({ position: null, score: null });
};

// Policy o‘chirish
const removePolicy = (index) => {
  form.scoring_policies.splice(index, 1);
};

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

const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);

  if (!form.name) errors.name = "Имя обязательно.";
  if (!form.federation) errors.federation = "Федерация обязательна.";
  if (!form.sport_id) errors.sport_id = "Тип спорта обязателен.";
  if (!form.logo) errors.photo = "Фотография обязательна.";
  
    return Object.keys(errors).length === 0;
  };

const goBack = () => {
  window.history.go(-1);
};

const getSportsByFederation = async (federationId) => {
  if (!federationId) return;
  try {
    const res = await api.get(`/federation/${federationId}/`);
    data.value = res.data.data.sports;
  } catch (e) {
    console.log(e);
  }
};

const getFederation = async () => {
  try {
    const res = await api.get("/federation/");
    dataFederation.value = res.data.data.data;
  } catch (e) {
    console.log(e);
  }
};

watch(
  () => form.federation,
  (newVal) => {
    if (newVal) {
      getSportsByFederation(newVal.id); 
    } else {
      data.value = [];
    }
  }
);

getFederation();

const handleSubmit = async () => {
  if (!validateForm()) {
    console.error("Validation failed:", errors);
    return;
  }

  const formData = new FormData();
  formData.append("name", form.name);

  let scoringPoliciesIndex = 0;
      form.scoring_policies.forEach((policies) => {
          formData.append(`scoring_policies[${scoringPoliciesIndex}]position`, policies.position);
          formData.append(`scoring_policies[${scoringPoliciesIndex}]score`, policies.score);
          scoringPoliciesIndex++;
      });

  formData.append("sport_id", form.sport_id.id); 
  formData.append("federation", form.federation.id); 

  if (form.logo) {
    formData.append("logo", form.logo);
  }

  try {
    await api.post("/sport/tournament/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Success to Tournament", {
      autoClose: 3000,
    });

    router.push("/tournament-list");
  } catch (error) {
    console.error("Submission error:", error);
    toast.error(error.response?.data?.data || "An error occurred", {
      autoClose: 3000,
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>


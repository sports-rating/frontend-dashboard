<template>
  <div class="mx-auto p-4 rounded-xl border">
    <h2 class="text-2xl font-bold mb-6">Обновить турнир</h2>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <section>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <!-- Имя -->
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

          <!-- Federation -->
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
            <span class="text-red-500 mt-1" v-if="errors.federation">{{ errors.federation }}</span>
          </div>

          <!-- Sport -->
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
            <span class="text-red-500 mt-1" v-if="errors.sport_id">{{ errors.sport_id }}</span>
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700"> Логотип </label>
            <div class="mt-1 flex items-center space-x-4">
              <label
                for="upload"
                class="w-full flex items-center px-4 py-2 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-50"
              >
                <span class="text-sm text-gray-600">{{ form.photoName || "Выберите файл" }}</span>
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

            <div v-if="preview" class="mt-2">
              <img :src="preview" alt="Выбранное изображение" class="w-32 h-32 object-cover rounded-md border" />
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

              <button type="button" @click="removePolicy(index)" class="mt-6 text-red-600 hover:text-red-800">
                Удалить
              </button>
            </div>

            <button
              type="button"
              @click="addPolicy"
              class="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              + Добавить место
            </button>

            <span class="text-red-500 mt-1" v-if="errors.scoring_policies">{{ errors.scoring_policies }}</span>
          </div>
        </div>
      </section>
    </form>

    <div class="flex justify-end space-x-4 mt-5">
      <button
        type="button"
        @click="goBack"
        class="px-4 py-2 border border-gray-300 rounded-md p-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Отмена
      </button>
      <button
        type="submit"
        @click="handleSubmit"
        :disabled="isSubmitting || isUploading"
        class="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
      >
        {{ isSubmitting ? "Сохранить..." : "Обновить " }}
      </button>
    </div>
  </div>
</template>

<script setup>
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import { reactive, ref, onMounted, watch } from "vue";
import api from "../../utils/axios";
import { toast } from "vue3-toastify";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";


const route = useRoute();
const router = useRouter();

const errors = reactive({});
const isSubmitting = ref(false);
const isUploading = ref(false);

const data = ref([]);
const dataFederation = ref([]);
const preview = ref(null);

const form = reactive({
  name: "",
  sport_type: "",
  logo: null,      
  sport_id: null,
  photoName: "",
  federation: null,
  scoring_policies: [],
});

const initialData = reactive({
  name: "",
  logo: "",
});

const addPolicy = () => {
  form.scoring_policies.push({ position: null, score: null });
};

const removePolicy = (index) => {
  form.scoring_policies.splice(index, 1);
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.logo = file;
    form.photoName = file.name;
    const reader = new FileReader();
    reader.onload = (e) => (preview.value = e.target.result);
    reader.readAsDataURL(file);
  }
};

const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);

  if (!form.name) errors.name = "Имя обязательно.";
  if (!form.federation) errors.federation = "Федерация обязательна.";
  if (!form.sport_id) errors.sport_id = "Тип спорта обязателен.";


  if (!form.scoring_policies.length) {
    errors.scoring_policies = "Scoring policies обязательны.";
  } else {
    form.scoring_policies.forEach((p, i) => {
      if (!p.position || !p.score) {
        errors.scoring_policies = `Заполните все поля в строке ${i + 1}`;
      }
    });
  }
  return Object.keys(errors).length === 0;
};

const getFederation = async () => {
  try {
    const res = await api.get("/federation/");
    dataFederation.value = res.data.data.data;
  } catch (e) {
    console.log(e);
  }
};

const getData = async () => {
  try {
    const res = await api.get(`/sport/tournament/${route.params.id}/`);
    const d = res.data.data;

    form.name = d.name;
    form.sport_type = d.sport_type;
    form.photoName = d.logo.match(/[^/]+$/)[0];
    form.sport_id = d.sport;
    form.federation = d.federation;
    preview.value = d.logo;

    initialData.name = d.name;
    initialData.logo = d.logo;

    form.scoring_policies = d.scoring_policies.map((p) => ({
      id: p.id,
      position: p.position,
      score: parseFloat(p.score),
    }));
  } catch (e) {
    console.log(e);
  }
};

const goBack = () => window.history.go(-1);

const handleSubmit = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  const formData = new FormData();
  formData.append("name", form.name);

  if (form.logo instanceof File) {
    formData.append("logo", form.logo);
  }

  formData.append("federation", form.federation.id);
  formData.append("sport_id", form.sport_id.id);

  form.scoring_policies.forEach((p, index) => {
    if (p.id) {
      formData.append(`scoring_policies[${index}]id`, p.id);
    }
    formData.append(`scoring_policies[${index}]position`, p.position);
    formData.append(`scoring_policies[${index}]score`, p.score);
  });

  try {
    await api.patch(`/sport/tournament/${route.params.id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    router.push("/tournament-list");
  } catch (error) {
    console.error("Submission error:", error);
    ElMessage.error(error.response.data.message);
  } finally {
    isSubmitting.value = false;
  }
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


onMounted(() => {
  getData();
  getFederation();
});
</script>

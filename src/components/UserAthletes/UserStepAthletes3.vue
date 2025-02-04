<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Результаты</h1>
    </div>

    <div
      v-if="results.length > 0"
      class="bg-white rounded-lg shadow overflow-hidden mb-6"
    >
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              #
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Название
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Страна
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Дата
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Рейтинг
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Действия
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(result, index) in results" :key="result.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ index + 1 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <span class="ml-2 text-sm text-gray-900">{{ result.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ result.country }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ result.year }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ result.rating }}
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4 text-start"
            >
              <button
                @click="editResult(result)"
                class="text-blue-600 hover:text-blue-800"
              >
                <img src="../../assets/img/edit.svg" alt="edit" />
              </button>
              <button
                @click="deleteResult(result.id)"
                class="text-red-600 hover:text-red-800"
              >
                <img src="../../assets/img/delete.svg" alt="delete" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Result Button -->
    <button
      @click="showModal = true"
      class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
    >
      Добавить новый результат
    </button>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg border max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Добавить новую результат</h2>
          <button @click="show" class="text-gray-400 hover:text-gray-500">
            <!-- <XIcon class="h-5 w-5" /> -->
            <el-icon><Close class="h-5 w-5" /></el-icon>
          </button>
        </div>

        <form @submit.prevent="addResult">
          <div class="space-y-4">
            <!-- Name Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Название турнира</label
              >

              <multiselect
                v-model="newResult.name"
                @update:modelValue="handleSelection"
                :options="data"
                label="name"
                track-by="id"
                value-prop="id"
                placeholder="Выберите турнир"
                class="mt-1"
              />
              <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
            </div>

            <!-- Country Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Страна</label>

              <input
                v-model="newResult.country"
                type="text"
                disabled
                placeholder="Выберите страна"
                class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
              />
              <p v-if="errors.country" class="text-sm text-red-500">
                {{ errors.country }}
              </p>
            </div>

            <!-- Dates -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Период оценки</label>
              <div class="grid gap-4 mt-1">
                <el-date-picker
                  v-model="newResult.year"
                  type="date"
                  format="YYYY-MM-DD"
                  disabled
                  value-format="YYYY-MM-DD"
                  placeholder="Pick a day"
                  class="!h-10 !w-full !mt-1 !border !rounded-md !bg-[#EFF0F3]"
                />
                <!-- :size="size" -->
              </div>
              <p v-if="errors.year" class="text-sm text-red-500">
                {{ errors.year }}
              </p>
            </div>

            <!-- Rating -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Рейтинг</label>
              <input
                v-model="newResult.rating"
                type="number"
                placeholder="Введите свой рейтинг"
                class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
              />
              <p v-if="errors.rating" class="text-sm text-red-500">{{ errors.rating }}</p>
            </div>

            <div class="flex items-center gap-4">
              <input
                v-model="newResult.currently_participating"
                type="checkbox"
                class="px-3 py-2"
              />
              <label class="text-sm font-medium text-gray-700"> Есть тренер </label>
            </div>

            <div v-if="newResult.currently_participating">
              <label class="block text-sm font-medium text-gray-700">Tренер</label>

              <!-- v-model="newResult.trainer_id" -->
              <multiselect
                v-model="newResult.trainer"
                :options="trainersWithFullName"
                label="fullName"
                track-by="id"
                value-prop="id"
                placeholder="Выберите тренер"
                class="mt-1"
              />
              <span class="text-red-500 mt-1" v-if="errors.trainer_id">{{
                errors.trainer_id
              }}</span>
            </div>

            <div v-if="!newResult.currently_participating">
              <label class="block text-sm font-medium text-gray-700">Tренер</label>

              <input
                v-model="newResult.archived_trainer_name"
                type="text"
                placeholder="Выберите страна"
                class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
              />
              <span class="text-red-500 mt-1" v-if="errors.archived_trainer_name">{{
                errors.archived_trainer_name
              }}</span>
            </div>
          </div>

          <div class="mt-6 flex justify-center">
            <button
              type="submit"
              class="w-[50%] px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600"
            >
              Готово
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import { ref, watch, onMounted, computed } from "vue";
import api from "../../utils/axios";

const props = defineProps({
  typeResults: {
    type: Object,
    required: true,
  },
  handleFileUploadd: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits(["update-result"]);
const showModal = ref(false);
const showTranier = ref(true);
const results = ref([]);
const data = ref([]);
const dataTrainer = ref([]);
const currentResults = ref({ ...props.typeResults });

currentResults.value = results.value;

const getData = async () => {
  try {
    const selectedSport = JSON.parse(localStorage.getItem("selectedSport"));

    const res = await api.get(
      `https://api.7srating.uz/api/dashboard/tournament/?sport=${selectedSport.name}`
    );

    data.value = res.data.data;
  } catch (e) {
    console.log(e);
  }
};

const getTrainer = async () => {
  // const selectedT = JSON.parse(localStorage.getItem("selectedT"));
  try {
    const res = await api.get("https://api.7srating.uz/api/user/profile/trainer/");
    dataTrainer.value = res.data.data;
  } catch (e) {
    console.error(e);
  }
};

const trainersWithFullName = computed(() =>
  dataTrainer.value.map((trainer) => ({
    ...trainer,
    fullName: `${trainer.first_name} ${trainer.last_name}`,
  }))
);

const errors = ref({
  tournament_id: "",
  country: "",
  year: "",
  rating: "",
  logo: "",
  name: "",
  archived_trainer_name: "",
  trainer_id: "",
});

const validateForm = () => {
  let isValid = true;

  Object.keys(errors.value).forEach((key) => (errors.value[key] = ""));

  if (!newResult.value.name.id.trim()) {
    errors.value.name = "Название турнира обязательно.";
    isValid = false;
  }

  if (!newResult.value.country) {
    errors.value.country = "Пожалуйста, выберите страну.";
    isValid = false;
  }
  if (!newResult.value.year) {
    errors.value.year = "Начальная дата обязательна.";
    isValid = false;
  }
  if (!newResult.value.rating) {
    errors.value.rating = "Рейтинг обязателен.";
    isValid = false;
  } else if (isNaN(newResult.value.rating) || Number(newResult.value.rating) <= 0) {
    errors.value.rating = "Рейтинг должен быть положительным числом.";
    isValid = false;
  }

  return isValid;
};

const newResult = ref({
  tournament_id: "",
  country: "",
  year: "",
  rating: "",
  currently_participating: true,
  name: "",
  trainer: "",
  trainer_id: "",
  archived_trainer_name: "",
});

const show = () => {
  showModal.value = false;
  (newResult.value.country = ""),
    (newResult.value.year = ""),
    (newResult.value.rating = ""),
    (newResult.value.name = ""),
    (newResult.value.trainer = ""),
    (newResult.value.currently_participating = true),
    (newResult.value.tournament_id = "");
  newResult.value.trainer_id = "";
  newResult.value.archived_trainer_name = "";
};

const close = () => {
  showModal.value = false;
  (newResult.value.country = ""),
    (newResult.value.year = ""),
    (newResult.value.rating = ""),
    (newResult.value.name = ""),
    (newResult.value.trainer = ""),
    (newResult.value.currently_participating = true),
    (newResult.value.tournament_id = "");
  newResult.value.trainer_id = "";
  newResult.value.archived_trainer_name = "";
};

const editResult = (result) => {
  const selectedTournament = data.value.find((item) => item.id === result.tournament_id);
  const selectedT = dataTrainer.value.find((item) => item.id === result.trainer_id);

  const trainerCopy = selectedT
    ? {
        ...selectedT,
        fullName: `${selectedT.first_name} ${selectedT.last_name}`,
      }
    : null;

  newResult.value = {
    id: result.id || "",
    country: result.country || "",
    year: result.year || "",
    tournament_id: selectedTournament,
    trainer_id: selectedT,
    rating: result.rating || "",
    name: selectedTournament,
    trainer: trainerCopy,
    archived_trainer_name: result.archived_trainer_name,
    currently_participating: result.currently_participating || false,
  };

  showModal.value = true;
};

const deleteResult = (id) => {
  // Filter out the record with the specified ID
  results.value = results.value.filter((result) => result.id !== id);
};

const addResult = () => {
  if (!validateForm()) {
    console.log("Validation failed");
    return;
  }

  const selectedTournament = data.value.find(
    (item) => item.id === newResult.value.name.id
  );
  const selected = dataTrainer.value.find(
    (item) => item.id === newResult.value.trainer.id
  );

  const existingIndex = results.value.findIndex((r) => r.id === newResult.value.id);

  if (existingIndex !== -1) {
    results.value[existingIndex] = {
      ...newResult.value,
      tournament_id: selectedTournament ? selectedTournament.id : "",
      trainer_id: selected ? selected.id : "",
      name: selectedTournament ? selectedTournament.name : "",
      trainer: selected ? selected.trainer : "",
    };
  } else {
    results.value.push({
      id: String(results.value.length + 1).padStart(4, "0"),
      tournament_id: selectedTournament ? selectedTournament.id : "",
      trainer_id: selected ? selected.id : "",
      country: newResult.value.country,
      year: new Date(newResult.value.year).toLocaleDateString("en-CA"),
      rating: Number(newResult.value.rating),
      currently_participating: newResult.value.currently_participating,
      name: selectedTournament ? selectedTournament.name : "",
      trainer: selected ? selected.trainer : "",
      archived_trainer_name: newResult.value.archived_trainer_name,
    });
  }

  close();
};

onMounted(() => {
  getData();
  getTrainer();
  if (props.typeResults.length > 0) {
    results.value = props.typeResults.map((res) => ({
      id: res.id || "",
      country: res.country || "",
      year: res.year || "",
      tournament_id: res.tournament_id || "",
      trainer_id: res.trainer_id || "",
      rating: res.rating || "",
      name: res.name || "",
      archived_trainer_name: res.archived_trainer_name,
      trainer: res.trainer,
      currently_participating: res.currently_participating || false,
    }));
  }

  const savedResults = localStorage.getItem("results");
  if (savedResults) {
    results.value = JSON.parse(savedResults);
  }
});

const handleSelection = (selectedOption) => {
  const selectedItem = data.value.find((item) => item.id === selectedOption.id);
  if (selectedItem) {
    newResult.value.year = selectedItem.start_time;
    newResult.value.country = selectedItem.place;
  }
};

watch(
  results,
  (newResult) => {
    const updatedResults = newResult.map((item) => {
      if (item.currently_participating === true) {
        return {
          ...item,
          ...(item.archived_trainer_name = null),
        };
      } else {
        return {
          ...item,
          ...(item.trainer_id = null),
        };
      }
    });
    localStorage.setItem("results", JSON.stringify(updatedResults));
    currentResults.value = updatedResults;
  },
  { deep: true }
);

watch(
  results,
  (newResult) => {
    localStorage.setItem("results", JSON.stringify(newResult));
    currentResults.value = newResult;
  },
  { deep: true }
);

watch(
  currentResults,
  (newValue) => {
    emit("update-result", newValue);
  },
  { deep: true }
);
</script>

<style>
input[type="date"] {
  display: block !important;
  position: relative;
  padding: 1rem 3.5rem 1rem 0.75rem;
  font-size: 1rem;
  font-family: monospace;
  border: 1px solid #8292a2;
  border-radius: 0.25rem;
  background: white
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='22' viewBox='0 0 20 22'%3E%3Cg fill='none' fill-rule='evenodd' stroke='%23688EBB' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' transform='translate(1 1)'%3E%3Crect width='18' height='18' y='2' rx='2'/%3E%3Cpath d='M13 0L13 4M5 0L5 4M0 8L18 8'/%3E%3C/g%3E%3C/svg%3E")
    right 1rem center no-repeat;
  cursor: pointer;
}

::-webkit-calendar-picker-indicator {
  position: absolute;
  width: 2.5rem;
  height: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  opacity: 0 !important;
  cursor: pointer;
}

input[type="date"]:hover::-webkit-calendar-picker-indicator {
  opacity: 0 !important;
}
input[type="date"]:hover::-webkit-calendar-picker-indicator:hover {
  opacity: 0 !important;
}
</style>

<template>
  <div>
    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Personal Information Section -->
      <section>
        <h3 class="text-lg font-semibold mb-4 text-gray-900">Личные данные</h3>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label class="block text-sm font-medium text-gray-700">Имя</label>
            <input
              v-model="form.first_name"
              type="text"
              placeholder="Введите имя"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.first_name">{{
              errors.first_name
            }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Фамилия</label>
            <input
              v-model="form.last_name"
              type="text"
              placeholder="Введите фамилию"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />

            <span class="text-red-500 mt-1" v-if="errors.last_name">{{
              errors.last_name
            }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Отчество</label>
            <input
              v-model="form.middle_name"
              type="text"
              placeholder="Введите oтчество"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.middle_name">{{
              errors.middle_name
            }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">ЖШШИР</label>
            <input
              v-model="form.pinfl"
              type="text"
              placeholder="Введите ЖШШИР"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.pinfl">{{ errors.pinfl }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Тип спортсмена</label>
            <select
              v-model="form.sportsman_profile.sport_type"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Выберите тип спортсмена</option>
              <option v-for="type in athleteTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>

            <span class="text-red-500 mt-1" v-if="errors.sport_type">{{
              errors.sport_type
            }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Спортивное направление</label
            >

            <multiselect
              v-model="selectedSport"
              :options="data"
              label="name"
              track-by="id"
              value-prop="id"
              placeholder="Выберите спортивное направление"
              class="mt-1"
            />
            <span class="text-red-500 mt-1" v-if="errors.sport_direction">{{
              errors.sport_direction
            }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Девизион спортсмена</label
            >

            <input
              v-model="form.sportsman_profile.motto"
              type="text"
              placeholder="Выберите девизион"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />

            <span class="text-red-500 mt-1" v-if="errors.motto">{{ errors.motto }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Дата рождения</label>

            <input
              v-model="form.birth_date"
              type="date"
              min="2000-01-01"
              max="2026-01-01"
              class="!h-10 !w-full !mt-1 !border !rounded-md p-2"
            />

            <span class="text-red-500 mt-1" v-if="errors.birth_date">{{
              errors.birth_date
            }}</span>
          </div>

          <div class="w-full flex gap-4">
            <div class="w-full">
              <label class="block text-sm font-medium text-gray-700">Рост (см)</label>
              <input
                v-model="form.sportsman_profile.height"
                type="text"
                placeholder="Введите рост"
                class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
              />

              <span class="text-red-500 mt-1" v-if="errors.height">{{
                errors.height
              }}</span>
            </div>

            <div class="w-full">
              <label class="block text-sm font-medium text-gray-700">Вес (кг)</label>
              <input
                v-model="form.sportsman_profile.weight"
                type="text"
                placeholder="Введите вес"
                class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
              />

              <span class="text-red-500 mt-1" v-if="errors.weight">{{
                errors.weight
              }}</span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Пол</label>
            <div class="mt-1 w-full flex gap-4">
              <label
                class="inline-flex items-center w-[49%] px-4 py-2 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-50"
              >
                <input
                  v-model="form.sportsman_profile.gender"
                  type="radio"
                  value="male"
                  class="form-radio text-blue-500"
                />
                <span class="ml-2">Мужчина</span>
              </label>
              <label
                class="inline-flex items-center w-[49%] px-4 py-2 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-50"
              >
                <input
                  v-model="form.sportsman_profile.gender"
                  type="radio"
                  value="female"
                  class="form-radio text-blue-500"
                />
                <span class="ml-2">Женщина</span>
              </label>
            </div>
            <span class="text-red-500 mt-1" v-if="errors.gender">{{
              errors.gender
            }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Фотография для вашей главной страницы
            </label>
            <div class="mt-1 flex items-center">
              <input
                id="upload"
                type="file"
                @change="handleFileUpload"
                accept="image/*"
                class="hidden"
              />
              <label
                for="upload"
                class="mt-1 w-full flex items-center px-4 py-2 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-50"
              >
                <span class="text-sm text-gray-600">{{
                  form.photoName || "Выберите файл"
                }}</span>
              </label>
            </div>
            <span class="text-red-500 mt-1" v-if="errors.photo">{{ errors.photo }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Tренер</label>

            <multiselect
              v-model="selectedTrainer"
              :options="filteredTrainerData"
              label="full_name"
              track-by="id"
              value-prop="id"
              placeholder="Выберите тренер"
              class="mt-1"
            />
            <span class="text-red-500 mt-1" v-if="errors.trainer_id">{{
              errors.trainer_id
            }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Обо мне</label>

            <textarea
              v-model="form.sportsman_profile.about_me"
              type="textarea"
              placeholder="Выберите Обо мне"
              class="mt-1 px-2 block w-full rounded-md border-gray-300 border -p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.about_me">{{
              errors.about_me
            }}</span>
          </div>
        </div>
      </section>

      <!-- Address Section -->
      <section>
        <h3 class="text-lg font-semibold mb-4 text-gray-900">Фактический адрес</h3>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label class="block text-sm font-medium text-gray-700">Область / Город</label>

            <multiselect
              v-model="form.sportsman_profile.region"
              :options="regions"
              label="name_uz"
              track-by="name_uz"
              value-prop="name_uz"
              placeholder="Выберите название области"
              @change="onRegionChange"
              class="mt-1"
            />
            <span class="text-red-500 mt-1" v-if="errors.region">{{
              errors.region
            }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Район</label>

            <multiselect
              v-model="form.sportsman_profile.city"
              :options="filteredDistricts"
              track-by="name_uz"
              label="name_uz"
              value-prop="name_uz"
              placeholder="Выберите название города"
              class="mt-1"
            />

            <span class="text-red-500 mt-1" v-if="errors.city">{{ errors.city }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Улица</label>
            <input
              v-model="form.sportsman_profile.street"
              type="text"
              placeholder="Введите название улицы"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.street">{{
              errors.street
            }}</span>
          </div>
        </div>
      </section>

      <!-- Contact Information Section -->
      <section>
        <h3 class="text-lg font-semibold mb-4 text-gray-900">Контактные данные</h3>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label class="block text-sm font-medium text-gray-700">Номер телефона</label>

            <vue-tel-input
              v-model="form.phone_number"
              :autoFormat="true"
              :inputOptions="{
                showDialCode: true,
                maxlength: 17,
                valid: false,
                required: true,
                type: 'tel',
                autocomplete: 'on',
                autofocus: false,
              }"
              :dropdownOptions="{
                showFlags: true,
              }"
              :onlyCountries="['UZ']"
              :defaultCountry="'UZ'"
              class="!bg-gray-200 mt-1 p-[2px] w-full rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200"
            ></vue-tel-input>
            <span class="text-red-500 mt-1" v-if="errors.phone_number">{{
              errors.phone_number
            }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Место рождения</label>
            <input
              v-model="form.sportsman_profile.place_of_birth"
              type="text"
              placeholder="Введите место рождения"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />

            <span class="text-red-500 mt-1" v-if="errors.place_of_birth">{{
              errors.place_of_birth
            }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Гражданство</label>
            <input
              v-model="form.sportsman_profile.citizenship"
              type="text"
              placeholder="Выберите гражданство"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.citizenship">{{
              errors.citizenship
            }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Телеграм</label>
            <input
              v-model="form.sportsman_profile.telegram"
              type="text"
              placeholder="Введите линк в телеграм"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.telegram">{{
              errors.telegram
            }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Инстаграм</label>
            <input
              v-model="form.sportsman_profile.instagram"
              type="text"
              placeholder="Введите  линк в инстаграм"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.instagram">{{
              errors.instagram
            }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Электронный адрес</label
            >
            <input
              v-model="form.email"
              type="email"
              placeholder="Введите электронную почту"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.email">{{ errors.email }}</span>
          </div>
        </div>
      </section>
    </form>
  </div>
</template>

<script setup>
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import { ref, computed, watch, onMounted } from "vue";
import api from "../../utils/axios";
import regionsData from "../../assets/data/regions.json";
import districtsData from "../../assets/data/districts.json";

const props = defineProps({
  form: Object,
  athleteTypes: Array,
  handleFileUpload: {
    type: Function,
    required: true,
  },
  errors: Array,
});

const data = ref([]);
const dataTrainer = ref([]);
const selectedSport = ref(null);
const selectedSportName = ref(null);
const selectedTrainer = ref(null);

const regions = ref([]);
const districts = ref([]);
const filteredDistricts = ref([]);

const onRegionChange = () => {
  if (props.form.sportsman_profile.region && props.form.sportsman_profile.region.id) {
    // Проверка на наличие ID
    filteredDistricts.value = districts.value.filter(
      (district) => district.region_id === props.form.sportsman_profile.region.id
    );
    if (
      !filteredDistricts.value.find(
        (city) => city.id === props.form.sportsman_profile.city?.id
      )
    ) {
      props.form.sportsman_profile.city = null;
    }
  } else {
    filteredDistricts.value = [];
    props.form.sportsman_profile.city = null; // Очищаем город, если регион не выбран
  }
};

watch(
  () => props.form,
  (newForm) => {
    if (newForm.sportsman_profile) {
      // Обработка region (с использованием ID)
      if (typeof newForm.sportsman_profile.region === "string") {
        const initialRegionName = newForm.sportsman_profile.region;
        const foundRegion = regions.value.find(
          (region) => region.name_uz === initialRegionName
        );
        const initialCityName = newForm.sportsman_profile.city;
        const foundCity = districts.value.find(
          (city) => city.name_uz === initialCityName
        );
        if (foundRegion) {
          props.form.sportsman_profile.region = foundRegion;
          onRegionChange();
        } else {
          props.form.sportsman_profile.region = null;
        }
        if (foundCity) {
          props.form.sportsman_profile.city = foundCity;
        } else {
          props.form.sportsman_profile.city = null;
        }
      } else if (!newForm.sportsman_profile.region) {
        filteredDistricts.value = [];
        props.form.sportsman_profile.city = null;
      }
    }
  },
  { deep: true, immediate: true }
);

watch(() => props.form.sportsman_profile.region, onRegionChange);

const getData = async () => {
  try {
    const res = await api.get("https://api.7srating.uz/api/dashboard/sport/");
    data.value = res.data.data;
  } catch (e) {
    console.error(e);
  }
};

// Fetch Trainers Data
const getTrainer = async () => {
  try {
    const res = await api.get("https://api.7srating.uz/api/user/profile/trainer/");
    dataTrainer.value = res.data.data;

    if (props.form.sportsman_profile.trainer_id) {
      selectedTrainer.value = dataTrainer.value.find(
        (trainer) => trainer.id === props.form.sportsman_profile.trainer_id
      );
      if (selectedTrainer.value) {
        selectedTrainer.value.full_name = `${selectedTrainer.value.first_name} ${selectedTrainer.value.last_name}`;
      }
    }
  } catch (e) {
    console.error(e);
  }
};

// Watchers
watch(selectedSport, (newVal) => {
  selectedSportName.value = newVal ? newVal.name : "";
  props.form.sportsman_profile.sport_id = newVal ? newVal.id : null;
  localStorage.setItem("selectedSport", JSON.stringify(newVal || null));
});

watch(selectedTrainer, (newVal) => {
  props.form.sportsman_profile.trainer_id = newVal ? newVal.id : null;
  localStorage.setItem("selectedTrainer", JSON.stringify(newVal || null));
});

watch(
  () => props.form.sportsman_profile.sport_id,
  (newSportId) => {
    // Find the sport in the data array
    if (newSportId && data.value.length > 0) {
      selectedSport.value = data.value.find((sport) => sport.id === newSportId);
    } else {
      selectedSport.value = null;
    }
  },
  { immediate: true }
);

watch(
  () => props.form.sportsman_profile.trainer_id,
  (newTrainerId) => {
    // Find the trainer in the dataTrainer array
    if (newTrainerId && dataTrainer.value.length > 0) {
      selectedTrainer.value = dataTrainer.value.find(
        (trainer) => trainer.id === newTrainerId
      );
      if (selectedTrainer.value) {
        selectedTrainer.value.full_name = `${selectedTrainer.value.first_name} ${selectedTrainer.value.last_name}`;
      }
    } else {
      selectedTrainer.value = null;
    }
  },
  { immediate: true }
);

// Computed Property for Filtered Trainers Data
const filteredTrainerData = computed(() => {
  if (!selectedSportName.value) {
    return dataTrainer.value.map((trainer) => ({
      ...trainer,
      full_name: `${trainer.first_name} ${trainer.last_name}`,
    }));
  }

  return dataTrainer.value
    .filter((trainer) => trainer.sport === selectedSportName.value)
    .map((trainer) => ({
      ...trainer,
      full_name: `${trainer.first_name} ${trainer.last_name}`,
    }));
});

// Mounted Hook for LocalStorage Data
onMounted(() => {
  getData();
  getTrainer();

  const savedSport = localStorage.getItem("selectedSport");
  const savedTrainer = localStorage.getItem("selectedTrainer");

  if (savedSport && savedSport !== "undefined" && savedSport !== "null") {
    selectedSport.value = JSON.parse(savedSport);
  }

  if (savedTrainer && savedTrainer !== "undefined" && savedTrainer !== "null") {
    selectedTrainer.value = JSON.parse(savedTrainer);
  }
});

onMounted(async () => {
  try {
    regions.value = regionsData;
    districts.value = districtsData;

    if (
      props.form.sportsman_profile &&
      props.form.sportsman_profile.region &&
      typeof props.form.sportsman_profile.region === "string"
    ) {
      const initialRegionName = props.form.sportsman_profile.region;
      const foundRegion = regions.value.find(
        (region) => region.name_uz === initialRegionName
      );
      if (foundRegion) {
        props.form.sportsman_profile.region = foundRegion;
        onRegionChange();
      } else {
        console.error(`Region with name "${initialRegionName}" not found!`);
        props.form.sportsman_profile.region = null;
      }
    }
  } catch (error) {
    console.error("Failed to load data:", error);
  }
});
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

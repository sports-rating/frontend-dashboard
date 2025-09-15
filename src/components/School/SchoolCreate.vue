<template>
  <div class="mx-auto p-4 rounded-xl border">
    <h2 class="text-2xl font-bold mb-6">Добавить Школы</h2>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <section>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
              <label class="block text-sm font-medium text-gray-700"
                >Наименования школы</label
              >
              <input
                v-model="form.name"
                type="text"
                placeholder="Введите Наименования школы"
                class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
              />
              <span class="text-red-500 mt-1" v-if="errors.name">{{ errors.name }}</span>
          </div>
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
            <label class="block text-sm font-medium text-gray-700"
              >Руководитель школы</label
            >
            <input
              v-model="form.director"
              type="text"
              placeholder="Введите ФИО"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.director">{{
              errors.director
            }}</span>
          </div>

          
          <div>
            <label class="block text-sm font-medium text-gray-700">Область</label>
            <Multiselect
            v-model="form.region"
            :options="regions"
            label="name"
            track-by="id"
            value-prop="id"
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
            <Multiselect
            v-model="form.district"
            :options="filteredDistricts"
            label="name"
            track-by="id"
            value-prop="id"
            placeholder="Выберите название города"
            class="mt-1"
          />
            <span class="text-red-500 mt-1" v-if="errors.district">{{
              errors.district
            }}</span>
          </div>

          

          

          <div>
            <label class="block text-sm font-medium text-gray-700">Адрес</label>
            <input
              v-model="form.address"
              type="text"
              placeholder="Введите улицу и дом"
              class="mt-1 bg-white block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />

            <span class="text-red-500 mt-1" v-if="errors.address">{{
              errors.address
            }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Тип</label>
            <select
              v-model="form.type"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Выберите тип</option>
              <option value="ordinary">Спорт школы</option>
              <option value="club">Спорт клубы</option>
            </select>

            <span class="text-red-500 mt-1" v-if="errors.type">{{ errors.type }}</span>
          </div>

          <div>
            <label class=" block text-sm font-medium text-gray-700">Введите sport</label>

            <Multiselect
              v-model="form.sports"
              :options="data"
              label="name"
              track-by="id"
              value-prop="id"
              multiple
              placeholder="Выберите sport"
              class="mt-1"
            />
            <span class="text-red-500 mt-1" v-if="errors.sport_id">{{
              errors.sport_id
            }}</span>
          </div>

          <div>
            <label class=" block text-sm font-medium text-gray-700">Введите Федерация</label>

            <Multiselect
              v-model="form.federation"
              :options="dataFederation"
              label="name"
              track-by="id"
              value-prop="id"
              placeholder="Выберите Федерация"
              class="mt-1"
            />
            <span class="text-red-500 mt-1" v-if="errors.federation">{{
              errors.federation
            }}</span>
          </div>

        <div class="col-span-3">
          <label class="block text-sm font-medium text-gray-700">Локация на карте</label>
          <div class="h-[600px] w-full mt-2 border rounded-lg overflow-hidden">
            <MapboxMap
              access-token="pk.eyJ1IjoibXVraGFtbWFkaXJtYXRvdiIsImEiOiJjbHoxNHhmZnkyaXRoMmlxc2ExbWJpYTc1In0.CE43UNvdFFRSiDbgPDNoZQ"
              style="height: 600px"
              map-style="mapbox://styles/mapbox/streets-v11"
              :center="center" 
              :zoom="10"
              @mb-created="onMapClick"
            >
              <MapboxMarker :lng-lat="[form.longitude, form.latitude]" />
            </MapboxMap>
          </div>
          <p class="text-sm text-gray-500 mt-1">
            Latitude: {{ form.latitude }} | Longitude: {{ form.longitude }}
          </p>
          <span class="text-red-500 mt-1" v-if="errors.latitude">Локация обязательна.</span>
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
        {{ isSubmitting ? "Сохранить..." : "Добавить" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from "vue";
import { toast } from "vue3-toastify";
import { MapboxMap, MapboxMarker } from "@studiometa/vue-mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

import { ElMessage } from "element-plus";
import api from "../../utils/axios";
import router from "../../router";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";


const errors = reactive({});
const isSubmitting = ref(false);
const isUploading = ref(false);
const data = ref([]);
const dataFederation = ref([]);
const regions = ref([]);
const filteredDistricts = ref([]);
const center = ref([69.279737, 41.311151])

const form = reactive({
  name: "",
  phone_number: "",
  director: "",
  region: "",
  district: "",
  address: "",
  type: "",
  sports: [],
  federation:'',
  latitude: 41.311151,
  longitude: 69.279737,
});

const map = ref(null)
const onMapClick = (mapboxInstance) => {
  map.value = mapboxInstance
  map.value.on('click', (event) => {
    const { lngLat } = event

    form.latitude = lngLat.lat.toFixed(4)
    form.longitude = lngLat.lng.toFixed(4)
  })
};

const getData = async () => {
  try {
    const res = await api.get("https://api.7srating.uz/api/sport/");

    data.value = res.data.data;
  } catch (e) {
    console.log(e);
  }
};

getData();

const getDataFederation = async () => {
  try {
    const res = await api.get("https://api.7srating.uz/api/federation/?page_size=500");

    dataFederation.value = res.data.data.data;
  } catch (e) {
    console.log(e);
  }
};

getDataFederation()
const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach((key) => delete errors[key]);

  if (!form.name) errors.name = "Наименования школы обязательно.";
  if (!form.district) errors.district = "Район обязательно.";
  if (!form.region) errors.region = "Область обязательно.";
  if (!form.director) errors.director = "ФИО обязательно.";
  if (!form.type) errors.type = "Тип обязательно.";
  if (!form.sports) errors.sport_id = "Тип спорта обязателен.";
  if (!form.federation) errors.federation = "Тип Федерация обязателен.";
  // Validate address
  if (!form.address) errors.address = "Улицу и дом обязательно.";
  else if (form.address.length < 3) errors.address = "Адрес слишком короткий.";

    if (!form.latitude || !form.longitude) {
    errors.latitude = "Пожалуйста, выберите локацию на карте.";
  }
  // Validate phone number
  if (!form.phone_number) {
    errors.phone_number = "Номер телефона обязателен.";
  } else {
    const digitsOnly = form.phone_number.replace(/\D/g, "");
    if (digitsOnly.length > 17) {
      errors.phone_number = "Номер телефона не должен превышать 17 цифр.";
    } else if (digitsOnly.length < 9) {
      errors.phone_number = "Номер телефона слишком короткий.";
    }
  }

  return Object.keys(errors).length === 0;
};

const goBack = () => {
  window.history.go(-1);
};
const getRegions = async () => {
  try {
    const res = await api.get("/user/regions/");
    regions.value = res.data.data; 

    
  } catch (err) {
    console.error("Regions yuklashda xatolik:", err);
  }
};

const getDistricts = async (regionId) => {
  if (!regionId) {
    filteredDistricts.value = [];
    return;
  }
  try {
    const res = await api.get(`/user/districts/?region=${regionId}`);
    filteredDistricts.value = res.data.data;
  } catch (err) {
    console.error("Districts yuklashda xatolik:", err);
  }
};

const onRegionChange = () => {
  const selectedRegionId = form.region?.id;
  getDistricts(selectedRegionId);

  if (
    !filteredDistricts.value.find(
      (district) => district.id === form.district?.id
    )
  ) {
    form.district.id;
  }
};

watch(
  () => form.region,
  (newRegion) => {
    if (newRegion?.id) {
      getDistricts(newRegion.id);
    } else {
      filteredDistricts.value = [];
      form.district = null;
    }
  }
);
onMounted(() => {
  getRegions();
});

watch(() => form.region, onRegionChange);



const handleSubmit = async () => {
  if (!validateForm()) {
    console.error("Validation failed:", errors);
    return;
  }

  try {
    const payload = {
      ...form,
      phone_number: form.phone_number.replaceAll(" ", ""),
      sports: form.sports.map((item) => item.id),
      federation: form.federation.id,
      region: form.region.id,
      district: form.district.id
    };
    await api.post("https://api.7srating.uz/api/education/school/", payload);
    toast.success("Success to School", {
      autoClose: 3000,
    });
    router.push("/school-list");
  } catch (error) {
    console.error("Submission error:", error);
    ElMessage.error(err.response.data.message);
  } finally {
    isSubmitting.value = false;
  }
};
</script>


<style>
.custom-marker {
  padding: 1em;
  background-color: #fff;
  border-radius: 5px;
}
</style>
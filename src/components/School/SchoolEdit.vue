<template>
  <div class="mx-auto p-4 rounded-xl border">
    <h2 class="text-2xl font-bold mb-6">Обновлять Школы</h2>

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
        {{ isSubmitting ? "Сохранить..." : "Обновлять" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch} from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { ElMessage } from "element-plus";
import api from "../../utils/axios";
import router from "../../router";
import { useRoute } from "vue-router";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import { MapboxMap, MapboxMarker } from "@studiometa/vue-mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

const route = useRoute();
const errors = reactive({});
const isSubmitting = ref(false);
const data = ref([]);
const dataFederation = ref([]);
const regions = ref([]);
const filteredDistricts = ref([]);
const center = ref([69.279737, 41.311151]);

const form = reactive({
  name: "",
  phone_number: "",
  director: "",
  region: "",
  district: "",
  address: "",
  type: "",
  sports: [],
  federation: "",
  latitude: 41.311151,
  longitude: 69.279737,
});

const map = ref(null);
const onMapClick = (mapboxInstance) => {
  map.value = mapboxInstance;
  map.value.on("click", (event) => {
    const { lngLat } = event;
    form.latitude = lngLat.lat.toFixed(4);
    form.longitude = lngLat.lng.toFixed(4);
  });
};


const getDataFederation = async () => {
  try {
    const res = await api.get("https://api.7srating.uz/api/federation/?page_size=500");
    dataFederation.value = res.data.data.data;
  } catch (e) {
    console.log(e);
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

const getDataa = async () => {
  try {
    const res = await api.get(`https://api.7srating.uz/api/education/school/${route.params.id}/`);
    const dataRes = res.data.data;

    form.name = dataRes.name;
    form.phone_number = dataRes.phone_number;
    form.director = dataRes.director;
    form.type = dataRes.type;
    form.region = dataRes.region;
    form.district = dataRes.district;
    form.address = dataRes.address;
    form.sports = dataRes.sports;
    form.federation = dataRes.federation;
    form.latitude = dataRes.latitude;
    form.longitude = dataRes.longitude;
    center.value = [dataRes.longitude, dataRes.latitude];
  } catch (e) {
    console.log(e);
  }
};

const handleSubmit = async () => {

  try {
    const payload = {
      ...form,
      phone_number: form.phone_number.replaceAll(" ", ""),
      sports: form.sports.map((item) => item.id),
      federation: form.federation.id,
      region: form.region.id,
      district: form.district.id,
    };

    await api.put(`https://api.7srating.uz/api/education/school/${route.params.id}/`, payload);
    toast.success("School updated successfully", { autoClose: 3000 });
    router.push("/school-list");
  } catch (error) {
    console.error("Update error:", error);
    ElMessage.error(error.response?.data?.message || "Ошибка при обновлении");
  } finally {
    isSubmitting.value = false;
  }
};

watch(() => form.region, onRegionChange);

onMounted(() => {
  getDataFederation();
  getRegions();
  getRegions();
  getDataa();
});
</script>


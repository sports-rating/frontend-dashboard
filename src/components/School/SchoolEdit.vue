<template>
  <div class="mx-auto p-4 rounded-xl border">
    <h2 class="text-2xl font-bold mb-6">Обновлять Школы</h2>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <section>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label class="block text-sm font-medium text-gray-700">Область</label>
            <input
              v-model="form.region"
              type="text"
              placeholder="Выберите область"
              class="mt-1 bg-white block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.region">{{
              errors.region
            }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Район</label>
            <input
              v-model="form.district"
              placeholder="Выберите район"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.district">{{
              errors.district
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
            <label class="block text-sm font-medium text-gray-700">Введите sport</label>

            <multiselect
              v-model="form.sport_ids"
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
import { reactive, ref, onMounted } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import api from "../../utils/axios";
import router from "../../router";
import { useRoute, useRouter } from "vue-router";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";

const route = useRoute();

const errors = reactive({});
const isSubmitting = ref(false);
const isUploading = ref(false);
const data = ref([]);

const form = reactive({
  name: "",
  address: "",
  phone_number: "",
  district: "",
  type: "",
  region: "",
  director: "",
  sport_ids: [],
});

const getData = async () => {
  try {
    const res = await api.get("https://api.7srating.uz/api/dashboard/sport/");

    data.value = res.data.data;
  } catch (e) {
    console.log(e);
  }
};

getData();

const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach((key) => delete errors[key]);

  if (!form.name) errors.name = "Наименования школы обязательно.";
  if (!form.district) errors.district = "Район обязательно.";
  if (!form.region) errors.region = "Область обязательно.";
  if (!form.director) errors.director = "ФИО обязательно.";
  if (!form.sport_ids) errors.sport_id = "Тип спорта обязателен.";
  if (!form.type) errors.type = "Тип обязательно.";
  // Validate address
  if (!form.address) errors.address = "Улицу и дом обязательно.";
  else if (form.address.length < 3) errors.address = "Адрес слишком короткий.";

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

const getDataa = async () => {
  try {
    const res = await api.get(
      `https://api.7srating.uz/api/dashboard/school/${route.params.id}/`
    );

    form.name = res.data.data.name;
    form.address = res.data.data.address.address;
    form.district = res.data.data.address.district;
    form.phone_number = res.data.data.phone_number;
    form.region = res.data.data.address.region;
    form.director = res.data.data.director;
    form.type = res.data.data.type;
    form.sport_ids = res.data.data.sports;
  } catch (e) {
    console.log(e);
  }
};

const handleSubmit = async () => {
  if (!validateForm()) {
    console.error("Validation failed:", errors);
    return;
  }

  try {
    const payload = {
      ...form,
      phone_number: form.phone_number.replaceAll(" ", ""),
      address: {
        region: form.region,
        district: form.district,
        address: form.address,
      },
      sport_ids: form.sport_ids.map((item) => item.id),
    };
    await api.put(
      `https://api.7srating.uz/api/dashboard/school/${route.params.id}/`,
      payload
    );
    toast.success("Success to School", {
      autoClose: 3000,
    });
    router.push("/school-list");
  } catch (error) {
    console.error("Submission error:", error);
    toast.error(error.response?.data?.message || "An error occurred", {
      autoClose: 3000,
    });
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  getDataa();
});
</script>

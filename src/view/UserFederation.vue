<template>
  <div class="  text-white rounded-lg">
    <h2 class="text-xl font-semibold mb-4 text-black">Добавить административную федерацию</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-3 gap-4">
        <input v-model="form.first_name" type="text" placeholder="Имя" class="input" />
        <input v-model="form.last_name" type="text" placeholder="Фамилия" class="input" />
        <input v-model="form.middle_name" type="text" placeholder="Имя его отца" class="input" />
        <select v-model="form.gender" class="input">
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
        </select>
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
              class="!bg-gray-200 text-black mt-1 p-[2px] w-full rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200"
            ></vue-tel-input>
        <input v-model="form.email" type="email" placeholder="Электронная почта" class="input" />
        <input v-model="form.birth_date" type="date" class="input" />
        <select v-model="form.user_role" class="input" >
        <option value="">Выберите роль пользователя</option>

          <option value="federation">Федерация</option>
          <option value="admin">Админ</option>
        </select>
        <Multiselect
            v-if="form.user_role === 'federation'"
              v-model="form.federation"
              :options="dataFederation"
              label="name"
              track-by="id"
              value-prop="id"
              placeholder="Выберите Федерация"
              :clear-on-select="false"
              :close-on-select="true"
              :show-labels="false"
              :allow-empty="true"
              :clearable="true"
            />
      </div>

      <div class="justify-end flex items-end ">
      
      <button
        type="submit"
        :disabled="loading"
        class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg w-fit "
      >
        <span v-if="!loading">Добавлять</span>
        <Loading v-else />
      </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import Loading from "../components/Loading.vue";
import api from "../utils/axios";
import router from "../router";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";


const loading = ref(false);
const dataFederation = ref([]);

const form = reactive({
  first_name: "",
  last_name: "",
  middle_name: "",
  gender: "male",
  phone_number: "",
  email: "",
  birth_date: "",
  user_role: "",
  federation: "",
});

const getDataFederation = async () => {
  try {
    const res = await api.get("/federation/?page_size=500");
    dataFederation.value = res.data.data.data;
  } catch (e) {
    console.log(e);
  }
};

getDataFederation()

const handleSubmit = async () => {
  try {
    loading.value = true;
      const res = await api.post("/dashboard/add-user/", {
          ...form,
        federation: form.federation.id,
        phone_number: form.phone_number.replaceAll(" ", ""),
    });

    toast.success("Пользователь успешно добавлен!");

        router.push("/");
  }catch (err: any) {

    if (err.response?.data) {
      const errors = err.response.data;
      Object.keys(errors).forEach((field) => {
        errors[field].forEach((msg: string) => {
          toast.error(` ${msg}`);
        });
      });
    } else {
      toast.error("Произошла неизвестная ошибка.");
    }
  } finally {
      loading.value = false;
    
  }
};
</script>

<style scoped>
.input {
  @apply  text-black px-3 py-2 rounded-md w-full;
  border: 1px solid #e8e8e8
}
</style>

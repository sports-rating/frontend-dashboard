<template>
<div>     
    <form @submit.prevent="handleSubmit" class="space-y-8" >
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
            <span class="text-red-500 mt-1" v-if="errors.first_name">{{ errors.first_name }}</span>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Фамилия</label>
            <input
              v-model="form.last_name"
              type="text"
              placeholder="Введите фамилию"
              class="mt-1  block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />

            <span class="text-red-500 mt-1" v-if="errors.last_name">{{ errors.last_name }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Отчество</label>
            <input
              v-model="form.middle_name"
              type="text"
              placeholder="Введите oтчество"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.middle_name">{{ errors.middle_name }}</span>
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
            <label class="block text-sm font-medium text-gray-700">Тип тренера</label>
            <select
              v-model="form.trainer_profile.sport_type"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Выберите тип тренера</option>
              <option v-for="type in athleteTypes" :key="type" :value="type">{{ type }}</option>
            </select>

            <span class="text-red-500 mt-1" v-if="errors.sport_type">{{ errors.sport_type }}</span>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Спортивное направление</label>
            <multiselect
              v-model="selectedSport"
              :options="data"
              label="name"
              track-by="id"
              value-prop="id"
              placeholder="Выберите спортивное направление"
              class="mt-1 "
            />
            <span class="text-red-500 mt-1" v-if="errors.sport_direction">{{ errors.sport_direction }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Девизион тренера</label>
            

            <input
              v-model="form.trainer_profile.motto"
              type="text"
              placeholder="Выберите девизион"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />

            <span class="text-red-500 mt-1" v-if="errors.motto">{{ errors.motto }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Дата рождения</label>
            

            <input v-model="form.birth_date" type="date"  min="2000-01-01" max="2026-01-01" class="!h-10 !w-full !mt-1 !border !rounded-md ">

            <span class="text-red-500 mt-1" v-if="errors.birth_date">{{ errors.birth_date }}</span>
          </div>

          <div class="w-full flex gap-4">
          
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700">Рост (см)</label>
            <input
              v-model="form.trainer_profile.height"
              type="text"
              placeholder="Введите рост"
              class="mt-1  block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />

            <span class="text-red-500 mt-1" v-if="errors.height">{{ errors.height }}</span>
          </div>

          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700">Вес (кг)</label>
            <input
              v-model="form.trainer_profile.weight"
              type="text"
              placeholder="Введите вес"
              class="mt-1  block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />

            <span class="text-red-500 mt-1" v-if="errors.weight">{{ errors.weight }}</span>
          </div>
          </div>

          

          <div>
            <label class="block text-sm font-medium text-gray-700">Пол</label>
            <div class="mt-1 w-full flex gap-4">
              <label class="inline-flex items-center w-[49%]   px-4 py-2 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-50">
                <input
                  v-model="form.trainer_profile.gender"
                  type="radio"
                  value="male"
                  class="form-radio text-blue-500"
                />
                <span class="ml-2">Мужчина</span>
              </label>
              <label class="inline-flex items-center w-[49%]   px-4 py-2 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-50">
                <input
                  v-model="form.trainer_profile.gender"
                  type="radio"
                  value="female"
                  class="form-radio text-blue-500"
                />
                <span class="ml-2">Женщина</span>
              </label>

            </div>
              <span class="text-red-500 mt-1" v-if="errors.gender">{{ errors.gender }}</span>
          </div>

          <div >
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
            >
            <label
              for="upload"
              class="mt-1 w-full flex items-center px-4 py-2 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-50"
            >
              <span class="text-sm text-gray-600">{{ form.photoName || 'Выберите файл' }}</span>
            </label>
            </div>
            <span class="text-red-500 mt-1" v-if="errors.photo">{{ errors.photo }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Обо мне</label>
            

            <textarea
              v-model="form.trainer_profile.about_me"
              type="textarea"

              placeholder="Выберите Обо мне"
              class="mt-1 block w-full rounded-md border-gray-300 border -p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.about_me">{{ errors.about_me }}</span>
          </div>

        </div>
      </section>

      <!-- Address Section -->
      <section>
        <h3 class="text-lg font-semibold mb-4 text-gray-900">Фактический адрес</h3>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label class="block text-sm font-medium text-gray-700">Область</label>
            

            <input
              v-model="form.trainer_profile.region"
              type="text"
              placeholder="Выберите название области"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.region">{{ errors.region }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Город</label>
            <!-- <select
              v-model="form.trainer_profile.city"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Выберите название города</option>
              <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
            </select> -->

            <input
              v-model="form.trainer_profile.city"
              type="text"
              placeholder="Выберите название города"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.city">{{ errors.city }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Улица</label>
            <input
              v-model="form.trainer_profile.street"
              type="text"
              placeholder="Введите название улицы"
              class="mt-1  block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.street">{{ errors.street }}</span>
          </div>

          <div class="flex flex-col">
            <label class="block text-sm font-medium text-gray-700">Дата переезда</label>

           <div class="flex gap-4">
            <div class="flex flex-col ">
              <el-date-picker
              v-model="form.trainer_profile.moving_date_year"
              type="year"
              placeholder="Год"
              format="YYYY"
              value-format="YYYY"
              class="!h-10 !w-full !mt-1 !border !rounded-md "
            />
              <span class="text-red-500 mt-1" v-if="errors.moving_date_year">{{ errors.moving_date_year }}</span>
            </div>

             <div class="flex flex-col ">
             
            <el-date-picker
              v-model="form.trainer_profile.moving_date_month"
              type="month"
              format="MM"
              value-format="MM"
              placeholder="Месяц"
              class="!h-10 !w-full !mt-1 !border !rounded-md "
            />

            <span class="text-red-500 mt-1" v-if="errors.moving_date_month">{{ errors.moving_date_month }}</span>
             </div>
           </div>

            
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
            <span class="text-red-500 mt-1" v-if="errors.phone_number">{{ errors.phone_number }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Место рождения</label>
            <!-- <select
              v-model="form.trainer_profile.place_of_birth"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="" disabled selected>Введите место рождения</option>
              <option v-for="place in countries" :key="place" :value="place">
                {{ place }}
              </option>
            </select> -->

            <input
              v-model="form.trainer_profile.place_of_birth"
              type="text"
              placeholder="Введите место рождения"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />

            <span class="text-red-500 mt-1" v-if="errors.place_of_birth">{{ errors.place_of_birth }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Гражданство</label>
            <!-- <select
              v-model="form.trainer_profile.citizenship"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Выберите гражданство</option>
              <option v-for="country in countries" :key="country" :value="country">{{ country }}</option>
            </select> -->


            <input
              v-model="form.trainer_profile.citizenship"
              type="text"
              placeholder="Выберите гражданство"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.citizenship">{{ errors.citizenship }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Телеграм</label>
            <input
              v-model="form.trainer_profile.telegram"
              type="text"
              placeholder="Введите линк в телеграм"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.telegram">{{ errors.telegram }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Инстаграм</label>
            <input
              v-model="form.trainer_profile.instagram"
              type="text"
              placeholder="Введите  линк в инстаграм"
              class="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="text-red-500 mt-1" v-if="errors.instagram">{{ errors.instagram }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Электронный адрес</label>
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
import Multiselect from 'vue-multiselect'
import { VueTelInput } from 'vue-tel-input'
import { ref, computed, watch, onMounted } from 'vue'
import api from "../../utils/axios"


const props = defineProps({
  form: Object,
  athleteTypes: Array,
  sportsDirections: Array,
  sportsDivisions: Array,
  regions: Array,
  cities: Array,
  countries: Array,
  handleFileUpload: {
    type: Function,
    required: true,
  },
  errors:Array,
});


const data = ref([])
const selectedSport = ref(null)

const getData = async() => {
  try {
    const res = await api.get(
      'https://api.7srating.uz/api/dashboard/sport/');

    data.value = res.data.data
      
  } catch (e) {
    console.log(e);
    
  }
}

getData()

watch(selectedSport, (newVal) => {
  props.form.trainer_profile.sport_id = newVal ? newVal.id : null;
  localStorage.setItem("selectedSport", JSON.stringify(newVal));
});

watch(() => props.form.trainer_profile.sport_id, (newSportId) => {
  // Find the sport in the data array
  if (newSportId && data.value.length > 0) {
    selectedSport.value = data.value.find(sport => sport.id === newSportId);
  } else {
    selectedSport.value = null;
  }
}, { immediate: true });


onMounted(() => {
  getData();
  const savedSport = localStorage.getItem('selectedSport');

  if (savedSport && savedSport !== 'undefined' && savedSport !== 'null') {
    selectedSport.value = JSON.parse(savedSport);
  }

});
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
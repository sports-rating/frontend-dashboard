<template>
  <div class="min-h-screen bg-[#1E1E2D] flex items-center justify-center p-4">
    <div class="w-full max-w-[360px] bg-white rounded-2xl p-6">
      <div class="flex justify-center mb-4">
        <img src="../assets/img/logo.svg" alt="Sport Rating" class="h-8" />
      </div>

      <h1 class="text-center text-sm text-gray-600 mb-6">
        Главный рейтинг спортсменов в одном месте!
      </h1>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm mb-1.5">Номер телефона</label>

              <vue-tel-input
              v-model="formData.phone_number"
              :autoFormat="true"
              :inputOptions="{
                showDialCode: true,
                maxlength: 17,
                valid: false,
                required: true,
                type: 'tel',
                autocomplete: 'on',
                autofocus: true,
              }"
              :dropdownOptions="{
                showFlags: true,
              }"
              :onlyCountries="['UZ']"
              :defaultCountry="'UZ'"
              class="!bg-gray-200 w-full rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200"
            ></vue-tel-input>
              <!-- :onlyCountries="['UZ', 'RU', 'KZ', 'TJ', 'KG', 'TM']" -->
          <p v-if="errors.phone_number" class="mt-1  text-xs text-red-500">{{ errors.phone_number }}</p>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
        >
          {{ isLoading ? 'Вход...' : 'Войти' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { ref, reactive } from 'vue';
import { VueTelInput } from 'vue-tel-input'

const isLoading = ref(false);
const router = useRouter();
const authStore = useAuthStore();

const formData = reactive({
  phone_number: '',
  action: 'login',
});

const errors = reactive({
  phone_number: '',
});



const validateForm = () => {
  let isValid = true;

  errors.phone_number = '';

  formData.phone_number = formData.phone_number.replaceAll(' ', '');

  if (!formData.phone_number.trim() || formData.phone_number.length !== 13) {
    errors.phone_number = 'Пожалуйста, введите корректный номер телефона';
    isValid = false;
  }
  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;
  try {
    isLoading.value = true;
    await authStore.login(formData);
    router.push('/password');
  } catch (error) {
    console.error('Login failed:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
::v-deep(.vue-tel-input input) {
  background-color: #e6e6e9; 
  border: 2px solid transparent;
  transition: all 0.2s ease-in-out;
  padding: 0.2rem 0px !important;
  outline: none !important; 
  box-shadow: none !important; 
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
</style>

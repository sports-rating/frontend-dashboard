<script setup>
import { ref, watch, onMounted } from 'vue';
import OtpInput from '../components/OtpInput.vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const isLoading = ref(false);
const errorMessage = ref('');
const router = useRouter();
const authStore = useAuthStore();
const data = ref('');
const timer = ref(60);
const resendAvailable = ref(false);

watch(data, (newVal) => {
  if (newVal.length < 6) {
    errorMessage.value = 'Введите все 6 кодов.';
  } else {
    errorMessage.value = '';
  }
});

const handleOtp = async () => {
  if (data.value.length < 6) {
    errorMessage.value = 'Код неправильный или неполный!';
  }

  const formattedOtp = String(data.value).padStart(6, '0'); // Ensure data.value is a string
  try {
    isLoading.value = true;
    await authStore.verify({ code: formattedOtp });
    toast.success("Проверено успешно!", { autoClose: 3000 });
    router.push('/');
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Проверка не удалась.';
    toast.error(errorMessage.value, { autoClose: 3000 });
  } finally {
    isLoading.value = false;
    resetOtp();
  }
};

const resetOtp = () => {
  data.value = '';
  errorMessage.value = '';
};

const startTimer = () => {
  timer.value = 60;
  resendAvailable.value = false;
  const countdown = setInterval(() => {
    timer.value--;
    if (timer.value <= 0) {
      clearInterval(countdown);
      resendAvailable.value = true;
    }
  }, 1000);
};

const handleResend = async () => {
  try {
    resetOtp();
    startTimer();
    await authStore.resetVerify();
    toast.info('Был отправлен новый код.', { autoClose: 3000 });
  } catch (error) {
    toast.error('Произошла ошибка при отправке кода.', { autoClose: 3000 });
  }
};

onMounted(() => {
  startTimer();
});
</script>


<template>
  <div class="min-h-screen bg-[#1E1E2D] flex items-center justify-center p-4">
    <div class="w-full max-w-[360px] bg-white rounded-2xl p-6">
      <div class="flex justify-center mb-4">
        <img src="../assets/img/logo.svg" alt="Sport Rating" class="h-8" />
      </div>

      <h1 class="text-center text-sm text-gray-600 mb-6">
        Введите код, отправленный вам по SMS. Если вы не получили код, дождитесь истечения таймера и повторите запрос.
      </h1>
      
      <div class="w-[300px] mx-auto bg-white rounded-xl ">
        <OtpInput v-model="data" :fields="6" />
        <p v-if="errorMessage" class="text-red-500 text-xs mt-2">
          {{ errorMessage }}
        </p>
      </div>

      <div class="w-full flex justify-end items-center my-2">
        <button
          v-if="resendAvailable"
          @click="handleResend"
          class="text-blue-500 hover:underline"
        >
          Отправить снова
        </button>
        <span class="text-gray-500">{{ timer > 0 ? `0:${timer.toString().padStart(2, '0')}` : '' }}</span>
      </div>

      <button
        @click="handleOtp"
        type="submit"
        :disabled="isLoading || data.length < 6"
        class="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
      >
        {{ isLoading ? 'Вход...' : 'Отправить' }}
      </button>
    </div>
  </div>
</template>


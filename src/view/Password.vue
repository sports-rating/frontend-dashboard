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
  data.value = String(newVal).padStart(6, "0"); 
  if (data.value.length < 6) {
    errorMessage.value = 'Please enter the complete OTP.';
  } else {
    errorMessage.value = '';
  }
});

const handleOtp = async () => {
  if (data.value.length < 6) {
    errorMessage.value = 'OTP is invalid or incomplete!';
  } else {
    const formattedOtp = String(data.value).padStart(6, "0"); 
    try {
      isLoading.value = true;
      await authStore.verify({ code: formattedOtp }); 
      router.push('/');
    } catch (error) {
      toast.error(error.response.data.message, {
      autoClose: 3000,
    })
      errorMessage.value = 'Verification failed. Please try again.';
    } finally {
      isLoading.value = false;
      resetOtp();
    }
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
    if (timer.value > 0) {
      timer.value--;
    } else {
      resendAvailable.value = true;
      clearInterval(countdown);
    }
  }, 1000);
};

const handleResend = () => {
  resetOtp();
  startTimer();
  authStore.resetVerify(); 
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
        :disabled="isLoading"
        class="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
      >
        {{ isLoading ? 'Вход...' : 'Отправить' }}
      </button>
    </div>
  </div>
</template>

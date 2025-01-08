<template>
  <div v-if="isLoading" class="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
    <svg class="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
    </svg>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// You can pass `isLoading` prop from the parent component to control the visibility of the loader
const props = defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },
});
</script>

<style scoped>
/* You can add additional styles here for positioning and size */
</style>
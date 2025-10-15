<template>
  <div class="group bg-white p-5 rounded-2xl border border-gray-200  transition-all duration-300 ease-in-out  flex flex-col justify-between h-full">
    <div class="flex justify-between items-start mb-3">
      <h3 class="text-gray-500 text-sm font-medium">{{ title }}</h3>
      <span class="text-xl text-gray-400">
        <font-awesome-icon :icon="icon" />
      </span>
    </div>

    <div class="mb-3">
      <p class="text-3xl font-bold text-gray-900">{{ value }}</p>
    </div>

    <div v-if="footerText" class="flex items-center text-sm">
      <span v-if="changePercentage" :class="['flex items-center font-semibold mr-3', isPositive ? 'text-green-500' : 'text-red-500']">
        <svg 
          v-if="isPositive"
          xmlns="http://www.w3.org/2000/svg" 
          class="h-4 w-4 mr-1" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
        {{ changePercentage }}
      </span>
      <span class="text-gray-400">
        {{ footerText }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  title: String,
  value: [String, Number],
  icon: Array, // ['fas', 'icon-name']
  changePercentage: { type: String, default: null },
  footerText: { type: String, default: null },
  isPositive: { type: Boolean, default: true },
});
</script>
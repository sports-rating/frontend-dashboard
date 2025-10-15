<template>
  <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-full transition-all cursor-pointer">
    <div class="flex justify-between items-start mb-3">
      <h3 class="text-gray-700 font-medium">{{ title }}</h3>
      <span class="text-xl text-gray-400">
        <font-awesome-icon :icon="icon" />
      </span>
    </div>

    <div class="mb-2">
      <p class="text-3xl font-bold text-gray-900">{{ totalCount }}</p>
    </div>

    <div class="text-sm">
      <span class="text-yellow-600 mr-2">{{ pendingCount }} в ожидании,</span>
      <span class="text-green-600">{{ approvedCount }} одобренный</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  title: String,
  totalCount: [String, Number],
  pendingCount: [String, Number],
  approvedCount: [String, Number],
  icon: Array, 
});
</script>
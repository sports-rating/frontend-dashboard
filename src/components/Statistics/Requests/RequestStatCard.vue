<template>
  <div
    class="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex flex-col justify-between h-full transition-transform  cursor-pointer"
  >
    <!-- Header: Title + Icon -->
    <div class="flex justify-between items-start mb-4">
      <h3 class="text-gray-800 font-semibold text-lg">{{ title }}</h3>
      <span class="text-2xl text-gray-400">
        <font-awesome-icon :icon="icon" />
      </span>
    </div>

    <!-- Total Count -->
    <div class="mb-4">
      <p class="text-4xl font-bold text-gray-900">{{ totalCount }}</p>
    </div>

    <!-- Statuses -->
    <div class="flex flex-col space-y-1 text-sm">
      <div class="flex items-center space-x-2">
        <span class="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
        <span class="text-gray-700">{{ pendingCount }} в ожидании</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
        <span class="text-gray-700">{{ approvedCount }} одобренный</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
        <span class="text-gray-700">{{ rejectedCount }} отклонено</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="w-3 h-3 rounded-full bg-gray-400 inline-block"></span>
        <span class="text-gray-700">{{ cancelledCount }} отменено</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  title: String,
  totalCount: [String, Number],
  pendingCount: [String, Number],
  approvedCount: [String, Number],
  rejectedCount: [String, Number],
  cancelledCount: [String, Number],
  icon: Array,
});
</script>

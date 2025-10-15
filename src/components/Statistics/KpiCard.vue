<template>
  <div
  class="group bg-white p-5 rounded-2xl border border-gray-200  transition-all duration-300 ease-in-out flex flex-col justify-between h-full"
>
  <!-- Title & Icon -->
  <div class="flex justify-between items-center mb-4">
    <h3 class="text-gray-500 text-sm font-medium tracking-wide group-hover:text-gray-700 transition-colors">
      {{ title }}
    </h3>
    <div
      :class="[
        'w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300',
        iconBackgroundColor || 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-inner group-hover:scale-110'
      ]"
    >
      <font-awesome-icon
        :icon="icon"
        :class="[
          'text-xl transition-transform duration-300',
          iconColorClass || 'text-white group-hover:rotate-12'
        ]"
      />
    </div>
  </div>

  <!-- Value -->
  <div>
    <p class="text-2xl font-bold text-gray-900 tracking-tight leading-tight">
      {{ value }}
    </p>
    <p class="text-sm text-gray-400 mt-1">{{ subtitle || '' }}</p>
  </div>
</div>

</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  title: String,
  value: [String, Number],
  icon: Array,
  iconColorClass: {
    type: String,
    default: 'text-gray-500',
  },
  iconBackgroundColor: {
    type: String,
    default: 'bg-gray-100',
  },
  
});
</script>
<template>
  <div class="relative inline-block text-left">
    <button 
      @click="isOpen = !isOpen"
      type="button"
      :class="[
        'inline-flex justify-center items-center w-full rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50',
        hasIcon ? 'space-x-2' : ''
      ]"
    >
      <font-awesome-icon v-if="hasIcon" :icon="['fas', 'filter']" class="text-gray-500" />
      <span>{{ selectedItem.name || placeholder }}</span>
      <font-awesome-icon :icon="['fas', 'chevron-down']" class="h-4 w-4 ml-2 -mr-1 text-gray-400" />
    </button>

    <div 
      v-if="isOpen"
      class="absolute right-0 z-10 mt-2 w-68 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    >
      <div class="py-1">
        <button 
          v-for="item in items" 
          :key="item.value"
          @click="selectItem(item)"
          :class="[
            'flex justify-between items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100',
            selectedItem.value === item.value ? 'bg-gray-50 font-semibold' : ''
          ]"
        >
          <span>{{ item.name }}</span>
          <font-awesome-icon v-if="selectedItem.value === item.value" :icon="['fas', 'check']" class="text-green-500" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  items: Array, // [{ name: 'All Status', value: 'all' }, ...]
  placeholder: String,
  initialSelection: Object,
  hasIcon: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const selectedItem = ref(props.initialSelection || props.items[0]);

const selectItem = (item) => {
  selectedItem.value = item;
  isOpen.value = false;
  emit('update:modelValue', item.value);
};
</script>
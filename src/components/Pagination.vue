<template>
  <div class="pagination">
    <button @click="prevPage" :disabled="currentPage === 1">«</button>

    <button
      v-for="page in totalPages"
      :key="page"
      @click="setPage(page)"
      :class="{ active: currentPage === page }"
    >
      {{ page }}
    </button>

    <button @click="nextPage" :disabled="currentPage === totalPages">»</button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  totalItems: Number,
  itemsPerPage: Number,
  modelValue: Number,
});
const emit = defineEmits(["update:modelValue"]);

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage));

const currentPage = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const setPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 8px;
  background: #e6f5e6;
  width: max-content;
  padding: 10px;
  border-radius: 12px;
}
button {
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  background: white;
  border-radius: 6px;
  font-size: 16px;
}
button.active {
  background: #f52105;
  color: white;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

<template>
  <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-[20rem] overflow-y-auto no-scrollbar">
    <h3 class="text-lg font-semibold text-gray-900">Способы оплаты</h3>
    <p class="text-sm text-gray-500 mb-6">Популярность методов оплаты</p>

    <div class="space-y-4 mb-8" v-if="methods">
      <div v-for="(method, key) in methods" :key="key">
        <div class="flex justify-between items-center text-sm mb-1">
          <span class="text-gray-700 capitalize">{{ key }}</span>
          <span class="font-semibold">{{ method.percentage }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-orange-500 h-2 rounded-full"
            :style="{ width: `${method.percentage}%` }"
          ></div>
        </div>
      </div>
    </div>

    <div v-else class="text-gray-400 text-sm">Загрузка данных...</div>
  </div>
</template>

<script setup>
defineProps({
  methods: Object,
});
</script>


<style>
.no-scrollbar::-webkit-scrollbar-thumb {
  background-color: #f7cece;
  border: 7px solid transparent;
  border-radius: 8px;
  background-clip: padding-box;
}

.no-scrollbar::-webkit-scrollbar {
  width: 12px;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scroll-margin-block-start: 0;
}
</style>
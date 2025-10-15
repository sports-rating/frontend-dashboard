<template>
  <div class="bg-white p-6 px-4 rounded-2xl shadow-sm border border-gray-100 h-[20rem] overflow-y-auto no-scrollbar">
    <h3 class="text-lg font-semibold text-gray-900">Доходы по федерациям</h3>
    <p class="text-sm text-gray-500 mb-6">Распределение платежей по категориям</p>

    <div v-if="Object.keys(federationData || {}).length" class="space-y-5">
      <div
        v-for="(item, key) in sortedFederations"
        :key="key"
        class="flex flex-col gap-2 group hover:bg-gray-50 rounded-xl p-3 transition-all duration-300"
      >
        <div class="flex flex-col justify-between items-start">
          <span class="text-sm font-medium text-gray-800 truncate group-hover:text-orange-600 transition-colors">
            {{ key }}
          </span>
          <span class="text-xs text-gray-400">
            {{ item.transactions }} транзакций
          </span>
        </div>

        <!-- Progress bar -->
        <div class="flex items-center gap-4">
          <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden ">
            <div
              class="h-3 rounded-full transition-all duration-700 ease-out"
              :class="barColor(key)"
              :style="{ width: `${(item.revenue / maxValue) * 100}%` }"
            ></div>
          </div>

          <span class="text-sm font-semibold text-gray-700 w-20 text-right whitespace-nowrap tabular-nums">
            {{ formatNumber(item.revenue) }} cум
          </span>
        </div>
      </div>
    </div>

    <div v-else class="text-gray-400 text-sm text-center py-8">Загрузка данных...</div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  federationData: Object,
});

const maxValue = computed(() => {
  if (!props.federationData) return 1;
  return Math.max(...Object.values(props.federationData).map(f => f.revenue || 0), 1);
});

const sortedFederations = computed(() => {
  if (!props.federationData) return {};
  return Object.fromEntries(
    Object.entries(props.federationData)
      .filter(([_, val]) => val.revenue >= 0)
      .sort((a, b) => b[1].revenue - a[1].revenue)
  );
});

const barColor = (key) => {
  const colors = [
    "bg-gradient-to-r from-orange-500 to-yellow-400",
    "bg-gradient-to-r from-blue-500 to-cyan-400",
    "bg-gradient-to-r from-green-500 to-lime-400",
    "bg-gradient-to-r from-purple-500 to-pink-400",
    "bg-gradient-to-r from-rose-500 to-orange-400",
    "bg-gradient-to-r from-amber-500 to-yellow-300",
  ];
  const index = Math.abs(hashString(key)) % colors.length;
  return colors[index];
};

const hashString = (str) =>
  str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

const formatNumber = (num) => num.toLocaleString("en-US");
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
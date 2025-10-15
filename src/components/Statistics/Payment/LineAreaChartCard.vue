<template>
  <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-96">
    <h3 class="text-lg font-semibold text-gray-900">Динамика доходов</h3>
    <p class="text-sm text-gray-500 mb-4">
      Доходы за последние месяцы
    </p>

    <div class="h-3/4  rounded-lg flex items-center justify-center">
      <canvas ref="chartRef" class="w-full h-full"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import Chart from "chart.js/auto";

const props = defineProps({
  yearlyRevenue: {
    type: Array,
    default: () => [],
  },
});

const chartRef = ref(null);
let chartInstance = null;

const renderChart = () => {
  if (!chartRef.value) return;

  const ctx = chartRef.value.getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  const labels = props.yearlyRevenue.map((item) => item.month);
  const dataValues = props.yearlyRevenue.map((item) => item.total_revenue);

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Доход (cум)",
          data: dataValues,
          fill: true,
          backgroundColor: "rgba(249, 115, 22, 0.2)", 
          borderColor: "rgb(249, 115, 22)",
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: "rgb(249, 115, 22)",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "#4B5563", 
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: "rgba(229, 231, 235, 0.5)", 
          },
          ticks: {
            color: "#6B7280",
          },
        },
        y: {
          grid: {
            color: "rgba(229, 231, 235, 0.5)",
          },
          ticks: {
            color: "#6B7280",
            beginAtZero: true,
          },
        },
      },
    },
  });
};

watch(
  () => props.yearlyRevenue,
  (newVal) => {
    if (newVal?.length) renderChart();
  },
  { immediate: true }
);

onMounted(() => {
  if (props.yearlyRevenue?.length) renderChart();
});

onBeforeUnmount(() => {
  if (chartInstance) chartInstance.destroy();
});
</script>

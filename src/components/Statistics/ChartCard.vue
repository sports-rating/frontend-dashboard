<template>
  <div
    class="relative bg-white rounded-2xl border border-gray-200  transition-all duration-300 ease-in-out  p-6 flex flex-col justify-between h-96 overflow-hidden"
  >
    <!-- Background gradient accent -->
    <div
      class="absolute inset-0  opacity-60 pointer-events-none"
    ></div>

    <!-- Header -->
    <div class="relative z-10 mb-3">
      <h3 class="text-lg font-semibold text-gray-900 tracking-tight">
        {{ title }}
      </h3>
      <p class="text-sm text-gray-500">{{ subtitle }}</p>
    </div>

    <!-- Chart -->
    <div class="relative z-10 flex-1">
      <canvas ref="chartRef" class="w-full h-full"></canvas>
    </div>

    
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import Chart from "chart.js/auto";

const props = defineProps({
  title: String,
  subtitle: String,
  chartData: {
    type: Array,
    default: () => [],
  },
  chartLabelKey: String,
  chartValueKey: String,
});

const chartRef = ref(null);
let chartInstance = null;

const renderChart = () => {
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(chartRef.value, {
    type: "line",
    data: {
      labels: props.chartData.map((d) => d[props.chartLabelKey]) ,
      datasets: [
        {
          label: props.title,
          data: props.chartData.map((d) => d[props.chartValueKey]),
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.15)",
          fill: true,
          tension: 0.4,
          borderWidth: 2.5,
          pointBackgroundColor: "#2563eb",
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#6b7280", font: { size: 12 } },
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(209, 213, 219, 0.3)" },
          ticks: { color: "#6b7280", font: { size: 12 } },
        },
      },
    },
  });
};

watch(() => props.chartData, renderChart, { deep: true });
onMounted(renderChart);
</script>

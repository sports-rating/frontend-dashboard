<template>
  <div class="p-6 px-0 min-h-screen">
    <!-- KPI Cards -->
    <section class="mb-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <PaymentKpiCard
          v-for="card in paymentKpis"
          :key="card.title"
          :title="card.title"
          :value="card.value"
          :icon="card.icon"
          :footer-text="card.footerText"
          :is-positive="card.isPositive"
        />
      </div>
    </section>

    <!-- Charts -->
    <section class="mb-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        <BarChartCard :federationData="data?.by_federation" />
        <PaymentMethodCard :methods="data?.by_payment_method" />
      </div>
    </section>

    <!-- Line Chart -->
    <section>
      <LineAreaChartCard :yearlyRevenue="data?.yearly_revenue" />
    </section>

      <div class="bg-white/80 backdrop-blur-xl rounded-2xl  border border-gray-100 p-6 lg:col-span-2 mt-8">
        <h3 class="text-xl font-semibold mb-5 text-gray-800 flex items-center gap-2">
          💰 Ежедневный доход
        </h3>
        <apexchart
          type="area"
          height="350"
          :options="modernRevenueChartOptions"
          :series="modernRevenueSeries"
        />
      </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import PaymentKpiCard from "./PaymentKpiCard.vue";
import BarChartCard from "./BarChartCard.vue";
import PaymentMethodCard from "./PaymentMethodCard.vue";
import LineAreaChartCard from "./LineAreaChartCard.vue";
import api from "../../../utils/axios";

const data = ref(null);

const getData = async () => {
  try {
    const res = await api.get("/dashboard/stats/payments/");
    data.value = res.data.data;
  } catch (e) {
    console.error(e);
  }
};

onMounted(() => getData());

const paymentKpis = computed(() => [
  {
    title: "Общий доход",
    value: data.value ? `${data.value.total_revenue.toLocaleString()} cум` : "---",
    icon: ["fas", "dollar-sign"],
    footerText: "Всего доходов",
    isPositive: true,
  },
  {
    title: "Всего транзакций",
    value: data.value ? data.value.total_transactions : "---",
    icon: ["fas", "file-invoice"],
    footerText: "Общее количество транзакций",
    isPositive: true,
  },
  {
    title: "Доход за месяц",
    value: data.value ? `${data.value.total_revenue_month.toLocaleString()} cум` : "---",
    icon: ["fas", "chart-line"],
    footerText: "Доход в этом месяце",
    isPositive: true,
  },
  {
    title: "Транзакции за месяц",
    value: data.value ? data.value.total_transactions_month : "---",
    icon: ["fas", "receipt"],
    footerText: "Транзакции в этом месяце",
    isPositive: true,
  },
]);


// SCRIPT SETUP qismida


// SCRIPT SETUP

const modernRevenueSeries = computed(() => [
  {
    name: "Доход",
    type: "area",
    data: data.value?.daily_revenue_last_30_days.map((i) => i.total_revenue) || [],
  },
  {
    name: "Транзакции",
    type: "line",
    data: data.value?.daily_revenue_last_30_days.map((i) => i.total_transactions) || [],
    // Default hidden
    show: false,
  },
]);

const modernRevenueChartOptions = computed(() => ({
  chart: {
    toolbar: { show: false },
    stacked: false,
    zoom: { enabled: false },
  },
  stroke: { width: [3, 2], curve: "smooth" },
  fill: {
    type: "gradient",
    gradient: {
      shade: "light",
      type: "vertical",
      shadeIntensity: 0.3,
      opacityFrom: 0.7,
      opacityTo: 0.05,
      stops: [0, 100],
    },
  },
  markers: {
    size: 4,
    colors: ["#0ea5e9"],
    strokeColors: "#fff",
    strokeWidth: 2,
    shape: "circle",
  },
  xaxis: {
    categories: data.value?.daily_revenue_last_30_days.map((i) => i.day) || [],
    labels: {
      rotate: -45,       
      hideOverlappingLabels: true, 
      style: { fontSize: "12px", colors: "#555" }
    }
  },
  yaxis: [
    {
      labels: { formatter: (val) => val.toLocaleString() },
    },
    {
      opposite: true,
    },
  ],
  tooltip: {
    shared: true,
    y: [
      { formatter: (val) => `${val.toLocaleString()} сум` },
      { formatter: (val) => `${val} та` },
    ],
  },
  colors: ["#10b981", "#0ea5e9"],
  grid: { borderColor: "#eee", strokeDashArray: 4 },
  legend: {
    show: true,
    onItemClick: { toggleDataSeries: true },
  },
}));



</script>

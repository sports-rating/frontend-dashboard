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
    value: data.value ? `${data.value.total_revenue_month} cум` : "---",
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
</script>

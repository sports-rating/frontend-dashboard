<template>
  <div class="p-6 px-0 min-h-screen">
    <!-- KPI Cards -->
    <section class="mb-10">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          v-for="card in kpiCards"
          :key="card.title"
          :title="card.title"
          :value="card.value"
          :icon="card.icon"
          :icon-color-class="card.iconColorClass"
          :icon-background-color="card.iconBackgroundColor"
        />
      </div>
    </section>

    <!-- Charts -->
    <section>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Рост пользователей"
          subtitle="Общее количество пользователей за последние 6 месяцев"
          :chart-data="userGrowthData"
          chart-label-key="month"
          chart-value-key="total_users"
        />
        <ChartCard
          title="Тенденция доходов"
          subtitle="Ежемесячный доход за последние 6 месяцев"
          :chart-data="revenueData"
          chart-label-key="month"
          chart-value-key="total_revenue"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import KpiCard from './KpiCard.vue';
import ChartCard from './ChartCard.vue';
import api from "../../utils/axios";

const data = ref({ general_counts: {}, user_growth_stats: [], revenue_stats: [] });

const getData = async () => {
  try {
    const res = await api.get("/dashboard/stats/main/");
    data.value = res.data.data;
  } catch (e) {
    console.error(e);
  }
};

onMounted(() => getData());

const kpiCards = computed(() => [
  {
    title: 'Всего пользователей',
    value: data.value.general_counts.users?.total_users ?? 0,
    icon: ['fas', 'users'],
    iconColorClass: 'text-blue-500',
    iconBackgroundColor: 'bg-blue-100',
  },
  {
    title: 'Активные федерации',
    value: data.value.general_counts?.total_federations ?? 0,
    icon: ['fas', 'trophy'],
    iconColorClass: 'text-yellow-600',
    iconBackgroundColor: 'bg-yellow-100',
  },
  {
    title: 'Спортивные учреждения',
    value: data.value.general_counts?.total_sport_institutions ?? 0,
    icon: ['fas', 'building'],
    iconColorClass: 'text-purple-500',
    iconBackgroundColor: 'bg-purple-100',
  },
  {
    title: 'Ежемесячный доход',
    value: `${data.value.general_counts?.total_monthly_revenue?.toLocaleString() ?? 0} cум`,
    icon: ['fas', 'dollar-sign'],
    iconColorClass: 'text-green-500',
    iconBackgroundColor: 'bg-green-100',
  },
  {
    title: 'Ожидающие запросы',
    value: data.value.general_counts?.total_pending_requests ?? 0,
    icon: ['fas', 'clock'],
    iconColorClass: 'text-red-500',
    iconBackgroundColor: 'bg-red-100',
  },
  {
    title: 'Спортсмены',
    value: data.value.general_counts?.users?.total_sportsmen ?? 0,
    icon: ['fas', 'user-alt'],
    iconColorClass: 'text-pink-500',
    iconBackgroundColor: 'bg-pink-100',
  },
  {
    title: 'Тренеры',
    value: data.value.general_counts?.users?.total_trainers ?? 0,
    icon: ['fas', 'user-tie'],
    iconColorClass: 'text-indigo-500',
    iconBackgroundColor: 'bg-indigo-100',
  },
  {
    title: 'Тотальный спорт',
    value: data.value.general_counts?.total_sports ?? 0,
    icon: ['fas', 'medal'],
    iconColorClass: 'text-orange-500',
    iconBackgroundColor: 'bg-orange-100',
  },
]);



const userGrowthData = computed(() => data.value.user_growth_stats ?? []);
const revenueData = computed(() => data.value.revenue_stats ?? []);
</script>

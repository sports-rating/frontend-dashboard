<template>
  <div class=" py-8 to-white min-h-screen">
    <!-- HEADER -->
    

    <!-- TOP STATS CARDS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div
        v-for="(item, index) in topCards"
        :key="index"
        class="bg-white/70 backdrop-blur-xl rounded-2xl  border border-gray-200 p-6 transition-all hover:-translate-y-1 hover:shadow-2xl"
      >
        <p class="text-gray-500 text-sm">{{ item.title }}</p>
        <h2 class="text-4xl font-extrabold mt-3 text-gray-800">
          {{ item.value }}
        </h2>
      </div>
    </div>

    <!-- USERS BY ROLE -->
    <div class="bg-white/80 backdrop-blur-xl rounded-2xl  border border-gray-200 p-6 mb-10">
      <h3 class="text-xl font-semibold mb-5 text-gray-800 flex items-center gap-2">
        👥 По категориям пользователей
      </h3>
      <div v-for="(val, key) in userRoles" :key="key" class="mb-4">
        <div class="flex justify-between text-sm text-gray-600">
          <span>{{ roleNames[key] || key }}</span>
          <span class="font-medium">{{ val }} та</span>
        </div>
        <div class="w-full bg-gray-200 h-2 rounded-full mt-1 overflow-hidden">
          <div
            class="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
            :style="{ width: (val / data?.users?.total_users) * 100 + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- CHARTS GRID -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- GROWTH -->
      <div class="bg-white/80 backdrop-blur-xl rounded-2xl  border border-gray-200 p-6">
        <h3 class="text-xl font-semibold mb-5 text-gray-800 flex items-center gap-2">
          📅 Рост за последние 6 месяцев
        </h3>
        <apexchart
          type="area"
          height="300"
          :options="growthChartOptions"
          :series="growthSeries"
        />
      </div>

      <!-- DAILY USERS -->
      <div class="bg-white/80 backdrop-blur-xl rounded-2xl  border border-gray-200 p-6">
        <h3 class="text-xl font-semibold mb-5 text-gray-800 flex items-center gap-2">
          📈 Ежедневная активность пользователей
        </h3>
        <apexchart
          type="line"
          height="300"
          :options="dailyChartOptions"
          :series="dailySeries"
        />
      </div>

      <!-- REGISTRATIONS -->
      <div class="bg-white/80 backdrop-blur-xl rounded-2xl  border border-gray-200 p-6 lg:col-span-2">
        <h3 class="text-xl font-semibold mb-5 text-gray-800 flex items-center gap-2">
          🧾 Ежедневные регистрации
        </h3>
        <apexchart
          type="bar"
          height="300"
          :options="registrationChartOptions"
          :series="registrationSeries"
        />
      </div>

      <!-- YEARLY GROWTH -->
      <div class="bg-[#1E1E2D] rounded-2xl shadow-2xl border border-gray-800 p-6 lg:col-span-2">
        <h2 class="text-white text-xl font-semibold mb-5 flex items-center gap-2">
          🌱 Ежегодный рост
        </h2>
        <apexchart
          type="bar"
          height="350"
          :options="chartOptions"
          :series="series"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../../../utils/axios";

const data = ref(null);

const getData = async () => {
  try {
    const res = await api.get("/dashboard/stats/users/");
    data.value = res.data.data;
  } catch (e) {
    console.error(e);
  }
};

onMounted(() => getData());

const topCards = computed(() => [
  { title: "Обычные пользователи", value: data.value?.users?.total_users || 0 },
  { title: "Активные пользователи сегодня", value: data.value?.today_users || 0 },
  { title: "Среднее количество пользователей в день", value: data.value?.average_daily_users || 0 },
  { title: "Среднее количество регистраций в день", value: data.value?.average_daily_registration || 0 },
]);

const userRoles = computed(() => ({
  total_trainers: data.value?.users?.total_trainers || 0,
  total_sportsmen: data.value?.users?.total_sportsmen || 0,
  total_sport_institution_admins: data.value?.users?.total_sport_institution_admins || 0,
  total_federation_admins: data.value?.users?.total_federation_admins || 0,
  total_admins: data.value?.users?.total_admins || 0,
}));

const roleNames = {
  total_trainers: "Тренеры",
  total_sportsmen: "Спортсмены",
  total_sport_institution_admins: "Администраторы спортивных сооружений",
  total_federation_admins: "Администраторы федерации",
  total_admins: "Суперадмины",
};

// Charts setup
const growthSeries = computed(() => [
  {
    name: "Количество пользователей",
    data: data.value?.last_6_months_growth.map((i) => i.total_users) || [],
  },
]);
const growthChartOptions = computed(() => ({
  chart: { toolbar: { show: false } },
  xaxis: {
    categories: data.value?.last_6_months_growth.map((i) => i.month) || [],
  },
  fill: {
    type: "gradient",
    gradient: { shadeIntensity: 1, opacityFrom: 0.6, opacityTo: 0.1 },
  },
  stroke: { curve: "smooth" },
  colors: ["#f97316"],
}));

const dailySeries = computed(() => [
  {
    name: "Обычные пользователи",
    data: data.value?.daily_users_last_month.map((i) => i.total_users) || [],
  },
  {
    name: "Авторизованный",
    data: data.value?.daily_users_last_month.map((i) => i.total_authenticated_users) || [],
  },
]);
const dailyChartOptions = computed(() => ({
  chart: { toolbar: { show: false } },
  stroke: { curve: "smooth" },
  xaxis: { categories: data.value?.daily_users_last_month.map((i) => i.day) || [] },
  colors: ["#0ea5e9", "#f97316"],
}));

const registrationSeries = computed(() => [
  {
    name: "Зарегистрирован",
    data: data.value?.daily_registrations.map((i) => i.total_users) || [],
  },
]);
const registrationChartOptions = computed(() => ({
  chart: { toolbar: { show: false } },
  xaxis: { categories: data.value?.daily_registrations.map((i) => i.day) || [] },
  colors: ["#0ea5e9"],
}));

const series = computed(() => [
  { name: "Количество пользователей", data: data.value?.yearly_growth.map((item) => item.total_users) },
]);
const chartOptions = computed(() => ({
  chart: { id: "yearly-growth-bar", toolbar: { show: false }, foreColor: "#fff" },
  xaxis: {
    categories: data.value?.yearly_growth.map((item) => item.month),
    labels: { style: { colors: "#fff" } },
  },
  yaxis: { labels: { style: { colors: "#fff" } } },
  colors: ["#00E396"],
  plotOptions: { bar: { borderRadius: 6, horizontal: false, columnWidth: "40%" } },
  dataLabels: { enabled: false },
  grid: { borderColor: "#333" },
}));
</script>

<style scoped>
/* Smooth transitions */
* {
  transition: all 0.25s ease;
}
</style>

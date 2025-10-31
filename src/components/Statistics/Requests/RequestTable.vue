<template>
  <div class="p-6 px-0 min-h-screen">
    <!-- Statistik kartalar -->
    <section class="mb-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <RequestStatCard
          v-for="stat in requestStats"
          :key="stat.title"
          :title="stat.title"
          :total-count="stat.totalCount"
          :pending-count="stat.pendingCount"
          :approved-count="stat.approvedCount"
          :rejected-count="stat.rejectedCount"
          :cancelled-count="stat.cancelledCount"
          :icon="stat.icon"
        />
      </div>
    </section>

    <!-- Jadval bo‘limi -->
    <section class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-xl font-semibold text-gray-900">Управление запросами</h1>
          <p class="text-sm text-gray-500">Просмотр и управление всеми запросами на проверку</p>
        </div>
      </div>

      <!-- Filtr va qidiruv -->
      <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center mb-6">
        <div class="relative flex-grow w-full md:w-auto">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <font-awesome-icon :icon="['fas', 'search']" class="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Поисковые запросы..."
            class="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500"
            v-model="searchQuery"
            @input="fetchRequests"
          />
        </div>

        <div class="flex space-x-4">
          <DropdownFilter
            :items="categoryItems"
            placeholder="Все категории"
            :has-icon="true"
            @update:modelValue="handleCategoryChange"
          />
          <DropdownFilter
            :items="statusItems"
            placeholder="Все Статусы"
            @update:modelValue="handleStatusChange"
          />
        </div>
      </div>

      <!-- Jadval -->
      <div class="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                v-for="header in tableHeaders"
                :key="header"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr
              v-for="(row, index) in requestList"
              :key="row.id"
              class="hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4 whitespace-nowrap  text-sm ">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              
              <!-- Sportsman → Trainer -->
              <template v-if="selectedCategory === 'sportsman_trainer'">
                <td class="px-6 py-4 whitespace-nowrap  text-sm ">{{ row.sender?.full_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap  text-sm ">{{ row.receiver?.full_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap  text-sm ">{{ row.new_data?.sport?.name }}</td>
              </template>

              <!-- Trainer → Federation -->
              <template v-else-if="selectedCategory === 'trainer_federation'">
                <td class="px-6 py-4 whitespace-nowrap  text-sm ">{{ row.sender?.full_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap  text-sm ">{{ row.receiver?.federation?.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap  text-sm ">{{ row.new_data?.sport?.name }}</td>
              </template>

              <!-- Sportsman Result Verification -->
              <template v-else-if="selectedCategory === 'sportsman_result'">
                <td class="px-6 py-4 whitespace-nowrap  text-sm ">{{ row.sender?.full_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap  text-sm ">{{ row.new_data?.tournament?.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap  text-sm ">{{ row.new_data?.score }}</td>
              </template>

              <!-- Trainer Workplace Verification -->
              <template v-else-if="selectedCategory === 'trainer_workplace'">
                <td class="px-6 py-4 whitespace-nowrap  text-sm ">{{ row.sender?.full_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap  text-sm ">{{ row.new_data?.sport_institution?.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap  text-sm ">{{ row.new_data?.sport?.name }}</td>
              </template>

              <!-- Default (All) -->
              <template v-else>
                <td class="px-6 py-4 whitespace-nowrap  text-sm ">{{ row.sender?.full_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap  text-sm ">{{ row.receiver?.full_name || row.receiver?.federation?.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap  text-sm ">{{ row.new_data?.sport?.name }}</td>
              </template>
              <td v-if="selectedCategory === 'all'" class="px-6 py-4 whitespace-nowrap  text-sm  ">
              {{ requestTypeMap[row.request_type] || row.request_type }}
            </td>

              

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap  text-sm ">
                <span
                  :class="[
                    'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                    statusClasses[row.status]
                  ]"
                >
                  {{ statusTranslations[row.status] || row.status }}
                </span>
              </td>
              <!-- Created Time -->
              <td class="px-6 py-4 whitespace-nowrap  text-sm   text-gray-500">
                {{ formatDate(row.created_time) }}
              </td>

              
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-6">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalCount"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handlePageChange"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import RequestStatCard from "./RequestStatCard.vue";
import DropdownFilter from "./DropdownFilter.vue";
import api from "../../../utils/axios";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";

const searchQuery = ref("");
const selectedCategory = ref("all");
const selectedStatus = ref("all");
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const data = ref(null);
const requestList = ref([]);

const formatDate = (date) => (date ? dayjs(date).format("YYYY-MM-DD HH:mm") : "-");

const getStats = async () => {
  try {
    const res = await api.get("/dashboard/stats/requests/");
    data.value = res.data.data;
  } catch {
    ElMessage.error("Ошибка при получении статистики!");
  }
};

const fetchRequests = async () => {
  try {
    const params = {
      page: currentPage.value,
      page_size: pageSize.value,
      search: searchQuery.value || "",
    };
    if (selectedCategory.value !== "all") params.request_type = selectedCategory.value;
    if (selectedStatus.value !== "all") params.status = selectedStatus.value;

    const res = await api.get("/dashboard/requests/", { params });
    requestList.value = res.data.data.data;
    totalCount.value = res.data.data.count;
  } catch {
    ElMessage.error("Ошибка при загрузке запросов!");
  }
};

onMounted(() => {
  getStats();
  fetchRequests();
});

const requestStats = computed(() => {
  if (!data.value) return [];
  return [
    {
      title: "Спортсмены → Тренер",
      totalCount: data.value.sportsman_trainer_request?.total ?? 0,
      pendingCount: data.value.sportsman_trainer_request?.pending ?? 0,
      approvedCount: data.value.sportsman_trainer_request?.approved ?? 0,
      rejectedCount: data.value.sportsman_trainer_request?.rejected ?? 0,
      cancelledCount: data.value.sportsman_trainer_request?.cancelled ?? 0,
      icon: ["fas", "file-alt"],
    },
    {
      title: "Тренер → Федерация",
      totalCount: data.value.trainer_federation_request?.total ?? 0,
      pendingCount: data.value.trainer_federation_request?.pending ?? 0,
      approvedCount: data.value.trainer_federation_request?.approved ?? 0,
      rejectedCount: data.value.trainer_federation_request?.rejected ?? 0,
      cancelledCount: data.value.trainer_federation_request?.cancelled ?? 0,
      icon: ["fas", "envelope"],
    },
    {
      title: "Подтверждение результатов",
      totalCount: data.value.result_verification_request?.total ?? 0,
      pendingCount: data.value.result_verification_request?.pending ?? 0,
      approvedCount: data.value.result_verification_request?.approved ?? 0,
      rejectedCount: data.value.result_verification_request?.rejected ?? 0,
      cancelledCount: data.value.result_verification_request?.cancelled ?? 0,
      icon: ["fas", "trophy"],
    },
    {
      title: "Подтверждение рабочего места",
      totalCount: data.value.workplace_verification_request?.total ?? 0,
      pendingCount: data.value.workplace_verification_request?.pending ?? 0,
      approvedCount: data.value.workplace_verification_request?.approved ?? 0,
      rejectedCount: data.value.workplace_verification_request?.rejected ?? 0,
      cancelledCount: data.value.workplace_verification_request?.cancelled ?? 0,
      icon: ["fas", "building"],
    },
  ];
});

const categoryItems = [
  { name: "Все категории", value: "all" },
  { name: "Спортсмены → Тренер", value: "sportsman_trainer" },
  { name: "Тренер → Федерация", value: "trainer_federation" },
  { name: "Подтверждение результатов", value: "sportsman_result" },
  { name: "Подтверждение рабочего места", value: "trainer_workplace" },
];

const requestTypeMap = {
  sportsman_trainer_request: "Спортсмены → Тренер",
  trainer_federation_request: "Тренер → Федерация",
  sportsman_result_verification_request: "Подтверждение результатов",
  trainer_workplace_verification_request: "Подтверждение рабочего места",
};

const statusItems = [
  { name: "Все Статусы", value: "all" },
  { name: "В ожидании", value: "pending" },
  { name: "Принято", value: "accepted" },
  { name: "Отклонено", value: "rejected" },
  { name: "Отменено", value: "cancelled" },
];

const tableHeaders = computed(() => {
  switch (selectedCategory.value) {
    case "sportsman_trainer":
      return ["#","Спортсмен", "Тренер", "Спорт", "Дата", "Статус"];
    case "trainer_federation":
      return ["#","Тренер", "Федерация", "Спорт", "Дата", "Статус"];
    case "sportsman_result":
      return ["#","Спортсмен", "Событие", "Результат", "Дата", "Статус"];
    case "trainer_workplace":
      return ["#","Тренер", "Учреждение", "Спорт", "Дата", "Статус"];
    default:
      return ["#","Отправитель", "Получатель", "Спорт", "Категория", "Статус", "Дата"];
  }
});

const statusClasses = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-200 text-gray-700",
};

const statusTranslations = {
  pending: "В ожидании",
  accepted: "Принято",
  approved: "Одобрено",
  rejected: "Отклонено",
  cancelled: "Отменено",
};

const handlePageChange = (p) => {
  currentPage.value = p;
  fetchRequests();
};
const handleCategoryChange = (v) => {
  selectedCategory.value = v;
  currentPage.value = 1;
  fetchRequests();
};
const handleStatusChange = (v) => {
  selectedStatus.value = v;
  currentPage.value = 1;
  fetchRequests();
};
</script>

<style>
.el-pagination.is-background .el-pager li.is-active {
  background-color: red !important;
  color: white !important;
}
</style>

<template>
  <div class=" rounded-lg ">
    <h2 class="text-xl sm:text-2xl font-bold text-[#2C2C4A] mb-4 sm:mb-6">
      Список Запросы
    </h2>

    <div class="flex items-center gap-4 mb-4">
      <input
        type="text"
        v-model="search"
        placeholder="Поиск игрока"
        class="bg-white !border border-[#4A4A6A] w-full rounded-md p-3 text-[#4A4A6A] focus:outline-none focus:ring-2 focus:ring-[#E91E63]"
      />

      <select
        v-model="selectedStatus"
        class="bg-white !border !h-9.5 border-[#4A4A6A] rounded-md p-3 w-full text-[#4A4A6A] focus:outline-none focus:ring-2 focus:ring-[#E91E63]"
      >
        <option value="">Все статусы</option>
        <option value="pending">В обработке</option>
        <option value="accepted">Принято</option>
        <option value="rejected">Отклонено</option>
        <option value="cancelled">Отменено</option>
      </select>

      <el-input
        type="date"
        v-model="selectedDate"
        class="!bg-white !border !border-white !rounded-md text-[#4A4A6A] !w-full !h-[50px] focus:outline-none focus:ring-2 focus:ring-[#E91E63]"
      />

      <button
        class="px-3 py-1 rounded bg-[#919090] hover:bg-[#555] disabled:opacity-50 w-full md:w-[15rem] !h-12 text-white"
        @click="reset"
      >
        Reset
      </button>
    </div>

    <div class="bg-white rounded-lg shadow w-full">
    
    <div class="overflow-x-auto no-scrollbar">
      <table class="min-w-full divide-y divide-gray-200">
        <thead  class="bg-gray-50">
          <tr >
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">№</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ФИО игрока</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Номер телефона</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Дата подачи заявки</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Статус заявки</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Действие</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y text-center divide-gray-200 !w-full">
          <tr
            v-for="(item, index) in requests"
            :key="item.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.sender.full_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.sender.phone_number }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.created_time }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span
                class="px-2 py-1 rounded text-xs font-medium"
                :class="{
                  'bg-blue-500 text-white': item.status === 'pending',
                  'bg-green-500 text-white': item.status === 'accepted',
                  'bg-red-500 text-white': item.status === 'rejected',
                  'bg-gray-500 text-white': item.status === 'cancelled',
                }"
              >
                {{
                  item.status === "pending"
                    ? "В обработке"
                    : item.status === "accepted"
                    ? "Принято"
                    : item.status === "rejected"
                    ? "Отклонено"
                    : item.status === "cancelled"
                    ? "Отменено"
                    : "Неизвестно"
                }}
              </span>
            </td>
            <td
              class=" flex justify-center px-6 py-4 whitespace-nowrap text-sm text-gray-900 md:space-x-2 "
            >
              <button
                class="text-white bg-[#2E2F3E] p-2 rounded hover:bg-[#5A5A7A] flex items-center justify-center"
                @click="viewRequest(item.id)"
              >
                <img src="/Eye.svg" alt="eyes" class="w-4" />
              </button>
              <button
                v-if="item.status === 'pending'"
                class="bg-[#7CBF0F] p-2 rounded hover:bg-green-700 flex items-center justify-center"
                @click="approveRequest(item.id)"
              >
                <img src="/done.png" alt="done" class="w-4" />
              </button>
              <button
                v-if="item.status === 'pending'"
                class="bg-[#E7273D] p-2 rounded hover:bg-red-700 flex items-center justify-center"
                @click="deleteRequest(item.id)"
              >
                <img src="/x.svg" alt="x" class="w-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>

    <div class="flex flex-row justify-center items-center mt-6 gap-3 text-black font-bold text-sm">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-1 rounded bg-[#f2f1f1] hover:bg-[#d0d0d0] disabled:opacity-50"
      >
        ◀
      </button>

      <span>Страница {{ currentPage }} из {{ totalPages }}</span>

      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 rounded bg-[#f2f1f1] hover:bg-[#d0d0d0] disabled:opacity-50"
      >
        ▶
      </button>
    </div>

    <el-dialog
  v-model="dialogVisible"
  title="Детали заявки"
  :before-close="() => (dialogVisible = false)"
  class="!bg-white !text-black rounded-xl sm:max-w-lg md:max-w-xl !w-[90%]"
>
  <div
    v-if="selectedRequest"
    class="text-black space-y-4 max-h-[70vh] overflow-y-auto px-2 sm:px-4 text-sm md:text-base py-4"
  >
    <!-- ID & Date -->
    <div class="grid grid-cols-1 gap-1.5 md:gap-2.5">
      <p>
        <span class="text-gray-600">📅 Дата подачи:</span>
        {{ selectedRequest.created_time }}
      </p>
    </div>

    <!-- Sender -->
    <div class="pt-2 border-t border-gray-200">
      <h3 class="font-semibold text-blue-600 text-base mb-1">📤 Отправитель</h3>
      <p>
        <span class="text-gray-600">👤 ФИО:</span>
        {{ selectedRequest.sender.full_name }}
      </p>
      <p>
        <span class="text-gray-600">📞 Телефон:</span>
        {{ selectedRequest.sender.phone_number }}
      </p>
      <p>
        <span class="text-gray-600">🎯 Роль:</span>
        {{ selectedRequest.sender.user_role }}
      </p>
    </div>

    <!-- Receiver -->
    <div class="pt-2 border-t border-gray-200">
      <h3 class="font-semibold text-green-600 text-base mb-1">📥 Получатель</h3>
      <p>
        <span class="text-gray-600">👤 ФИО:</span>
        {{ selectedRequest.receiver.full_name }}
      </p>
      <p>
        <span class="text-gray-600">📞 Телефон:</span>
        {{ selectedRequest.receiver.phone_number }}
      </p>
      <p>
        <span class="text-gray-600">🎯 Роль:</span>
        {{ selectedRequest.receiver.user_role }}
      </p>
    </div>

    <p>
      <span class="text-gray-600">📍 Статус:</span>
      <span
        class="inline-block px-3 py-1 rounded-full shadow text-xs md:text-sm font-semibold ml-2 text-white"
        :class="{
          'bg-blue-500': selectedRequest.status === 'pending',
          'bg-green-500': selectedRequest.status === 'accepted',
          'bg-red-500': selectedRequest.status === 'rejected',
          'bg-gray-400': selectedRequest.status === 'cancelled',
        }"
      >
        {{
          selectedRequest.status === "pending"
            ? "В обработке"
            : selectedRequest.status === "accepted"
            ? "Принято"
            : selectedRequest.status === "rejected"
            ? "Отклонено"
            : selectedRequest.status === "cancelled"
            ? "Отменено"
            : "Неизвестно"
        }}
      </span>
    </p>
  </div>

  <!-- Loading -->
  <div v-else class="text-center py-8 text-gray-500 text-sm">⏳ Загрузка...</div>
</el-dialog>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import api from "../../utils/axios";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();


const search = ref("");
const selectedStatus = ref("");
const selectedDate = ref("");
const requests = ref([]);
const totalCount = ref(0);
const loading = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalPages = computed(() => Math.ceil(totalCount.value / itemsPerPage.value));

const fetchRequests = async () => {
  try {
    loading.value = true;
    const params = {
      page: currentPage.value,
      page_size: itemsPerPage.value,
      search: search.value || undefined,
      status: selectedStatus.value || undefined,
      date: selectedDate.value || undefined,
    };

    const res = await api.get(`/federation/${route.params.id }/requests/`, { params });
    requests.value = res.data.data.data;
    totalCount.value = res.data.data.count;
  } catch (err) {
    console.error("Ошибка при получении заявок:", err);
  } finally {
    loading.value = false;
  }
};
const reset = () => {
  ElMessage.success("Страница обновлена ✅");
  fetchRequests();

  search = "";
  selectedStatus = "";
  selectedDate = "";
};

watch([currentPage, search, selectedStatus, selectedDate], fetchRequests);

onMounted(fetchRequests);

const dialogVisible = ref(false);
const selectedRequest = ref(null);

const viewRequest = async (id) => {
  try {
    dialogVisible.value = true;
    selectedRequest.value = null;
    const res = await api.get(`user/requests/${id}/`);
    selectedRequest.value = res.data.data;
  } catch (err) {
    console.error("Ошибка при просмотре:", err);
  }
};

const approveRequest = async (id) => {
  try {
    await ElMessageBox.confirm(
      "Вы уверены, что хотите подтвердить эту заявку?",
      "Подтверждение",
      {
        confirmButtonText: "Подтвердить",
        cancelButtonText: "Отмена",
        type: "success",
      }
    );

    await api.patch(`user/requests/${id}/`, {
      status: "accepted",
    });

    ElMessage.success("Заявка успешно подтверждена ✅");
    await fetchRequests();
  } catch (err) {
    if (err === "cancel") {
      ElMessage.info("Подтверждение отменено");
    } else {
      console.error("Ошибка при подтверждении:", err);
      ElMessage.error("Ошибка при подтверждении заявки ❌");
    }
  }
};

const deleteRequest = async (id) => {
  try {
    await ElMessageBox.confirm(
      "Вы уверены, что хотите Отменить эту заявку?",
      "Подтверждение Отменить",
      {
        confirmButtonText: "Отменить",
        cancelButtonText: "Отмена",
        type: "warning",
      }
    );

     await api.patch(`user/requests/${id}/`, {
      status: "rejected",
    });
    ElMessage.success("Заявка успешно Отменить 🗑️");
    await fetchRequests();
  } catch (err) {
    if (err === "cancel") {
      ElMessage.info(" Oтменено");
    } else {
      console.error("Ошибка при Отменить:", err);
      ElMessage.error("Ошибка при Отменить заявки ❌");
    }
  }
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo(0, 0);
  }
};
</script>

<style>
.el-dialog__title {
  color: black !important;
}
.el-input__inner{
    border:none !important
}
</style>

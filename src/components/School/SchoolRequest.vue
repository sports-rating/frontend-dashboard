<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Заявки от спортивных учреждений</h1>

    <!-- Search & Filter -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <el-input
        v-model="search"
        placeholder="Поиск по названию учреждения или менеджеру"
        clearable
        class="sm:w-1/3"
        @clear="fetchRequests"
        @keyup.enter="fetchRequests"
      >
        <template #append>
          <el-button @click="fetchRequests">Поиск</el-button>
        </template>
      </el-input>

      <el-select
        v-model="statusFilter"
        placeholder="Фильтр по статусу"
        clearable
        class="sm:w-1/4"
        @change="fetchRequests"
      >
        <el-option label="Все" value="" />
        <el-option label="В ожидании" value="pending" />
        <el-option label="Одобрено" value="approved" />
        <el-option label="Отклонено" value="rejected" />
      </el-select>
    </div>

    <!-- Table -->
    <el-table
      v-loading="loading"
      :data="requests"
      class="w-full cursor-pointer rounded-lg border"
      @row-click="openDetail"
      :header-cell-style="{
        background: '#f5f7fa',
        color: '#333',
        fontWeight: '600',
      }"
    >
      <el-table-column prop="manager_first_name" label="Имя" />
      <el-table-column prop="manager_last_name" label="Фамилия" />
      <el-table-column prop="manager_phone_number" label="Телефон" />
      <el-table-column prop="school_name" label="Название учреждения" />
      <el-table-column prop="status" label="Статус">
        <template #default="scope">
          <el-tag
            :type="
              scope.row.status === 'approved'
                ? 'success'
                : scope.row.status === 'rejected'
                ? 'danger'
                : 'warning'
            "
          >
            {{
              scope.row.status === 'approved'
                ? 'Одобрено'
                : scope.row.status === 'rejected'
                ? 'Отклонено'
                : 'В ожидании'
            }}
          </el-tag>
        </template>
      </el-table-column>


     
    </el-table>

    <!-- Pagination -->
    <div class="flex justify-end mt-6">
      <el-pagination
        background
        layout="sizes, total, prev, pager, next"
        :total="total"
        :current-page="page"
        :page-size="pageSize"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>

    <!-- Dialog -->
    <el-dialog
      v-model="dialogVisible"
      title="Детали учреждений"
      width="700px"
      class="rounded-xl"
    >
      <div v-if="selectedRequest">
        <el-descriptions
          border
          :column="1"
          size="small"
          label-class-name="font-semibold text-gray-700"
          content-class-name="text-gray-900"
        >
          <el-descriptions-item label="Менеджер">
            {{ selectedRequest.manager_first_name }}
            {{ selectedRequest.manager_last_name }}
          </el-descriptions-item>

          <el-descriptions-item label="Телефон">
            <el-tag type="info">
              {{ selectedRequest.manager_phone_number }}
            </el-tag>
          </el-descriptions-item>

          <el-descriptions-item label="Название учреждения">
            {{ selectedRequest.school_name }}
          </el-descriptions-item>

          <el-descriptions-item label="Директор">
            {{ selectedRequest.school_director }}
          </el-descriptions-item>

          <el-descriptions-item label="Тип учреждения">
          <el-tag type="warning">
            {{ schoolTypeMap[selectedRequest.school_type] || selectedRequest.school_type }}
          </el-tag>
        </el-descriptions-item>

          <el-descriptions-item label="Телефон учреждения">
            {{ selectedRequest.school_phone_number }}
          </el-descriptions-item>

          <el-descriptions-item label="Адрес">
            {{ selectedRequest.school_address }}
          </el-descriptions-item>

          <el-descriptions-item label="Территория">
            {{ selectedRequest.school_region.name }} /
            {{ selectedRequest.school_district.name }}
          </el-descriptions-item>

          <el-descriptions-item label="Спорт">
            <el-tag
              v-for="item in selectedRequest.school_sports"
              :key="item.id"
              type="success"
              class="mr-1 mb-1"
            >
              {{ item.name }}
            </el-tag>
          </el-descriptions-item>

          <el-descriptions-item label="Время обработки">
            <span class="italic text-gray-600">
              {{ selectedRequest.processed_time || "—" }}
            </span>
          </el-descriptions-item>

          <el-descriptions-item label="Статус">
            <el-tag
              :type="
                selectedRequest.status === 'approved'
                  ? 'success'
                  : selectedRequest.status === 'rejected'
                  ? 'danger'
                  : 'info'
              "
            >
              {{
              selectedRequest.status === 'approved'
                ? 'Одобрено'
                : selectedRequest.status === 'rejected'
                ? 'Отклонено'
                : 'В ожидании'
            }}
            </el-tag>
          </el-descriptions-item>

          <el-descriptions-item label="Создано">
            {{ selectedRequest.created_time }}
          </el-descriptions-item>

           <el-descriptions-item label="Адрес карты">
            <MapboxMap
              access-token="pk.eyJ1IjoibXVraGFtbWFkaXJtYXRvdiIsImEiOiJjbHoxNHhmZnkyaXRoMmlxc2ExbWJpYTc1In0.CE43UNvdFFRSiDbgPDNoZQ"
              style="height: 150px"
              map-style="mapbox://styles/mapbox/streets-v11"
              :center="[selectedRequest.school_longitude, selectedRequest.school_latitude]" 
              :zoom="10"
            >
              <MapboxMarker :lng-lat="[selectedRequest.school_longitude, selectedRequest.school_latitude]" />
            </MapboxMap>
          </el-descriptions-item>

        </el-descriptions>
      </div>

      <template #footer>
        <div
          v-if="selectedRequest?.status === 'pending'"
          class="w-full flex justify-center items-center gap-3"
        >
          <el-button
            type="success"
            size="large"
            class="rounded-lg px-6 !w-32"
            @click="updateStatus(selectedRequest.id, 'approved')"
          >
            Подтвердить
          </el-button>
          <el-button
            type="danger"
            size="large"
            class="rounded-lg px-6 !w-32"
            @click="updateStatus(selectedRequest.id, 'rejected')"
          >
            Отказать
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import api from "../../utils/axios";
import { MapboxMap, MapboxMarker } from "@studiometa/vue-mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';


const requests = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);
const loading = ref(false);
const search = ref("");
const statusFilter = ref("");

const dialogVisible = ref(false);
const selectedRequest = ref(null);

const schoolTypeMap = ref({
  sport_school: "Спортивная школа",
  sport_club: "Спортивный клуб",
  sport_complex: "Спорткомплекс",
});

const fetchRequests = async () => {
  try {
    loading.value = true;
    const res = await api.get("/sport/sport-institution-request/", {
      params: {
        page: page.value,
        page_size: pageSize.value,
        search: search.value || undefined,
        status: statusFilter.value || undefined,
      },
    });
    requests.value = res.data.data.data;
    total.value = res.data.data.count;
  } catch (err) {
    ElMessage.error("Произошла ошибка.");
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (newPage) => {
  page.value = newPage;
  fetchRequests();
};

const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  fetchRequests();
};

const openDetail = async (row) => {
  try {
    const res = await api.get(`/sport/sport-institution-request/${row.id}/`);
    selectedRequest.value = res.data.data;
    dialogVisible.value = true;
  } catch (err) {
    ElMessage.error("Ошибка загрузки сведений.");
  }
};

const updateStatus = async (id, status) => {
  try {
    await api.patch(`/sport/sport-institution-request/${id}/`, { status });
    ElMessage.success("Статус обновлен");
    fetchRequests();
    dialogVisible.value = false;
  } catch (err) {
    ElMessage.error("Ошибка обновления статуса.");
  }
};

onMounted(() => {
  fetchRequests();
});
</script>

<style scoped>
:deep(.el-dialog) {
  margin-top: 3rem !important;
}
</style>


<style>
.el-pagination.is-background .el-pager li.is-active{
  background-color: red !important;
}
</style>
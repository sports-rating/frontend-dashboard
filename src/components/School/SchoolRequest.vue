<template>
  <div >
    <h1 class="text-2xl font-bold mb-4">Заявки от спортивных учреждений</h1>

    <el-table
      v-loading="loading"
      :data="requests"
      border
      class="w-full cursor-pointer"
      @row-click="openDetail"
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
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Действия" width="220">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click.stop="openDetail(scope.row)" 
          >
            Более
          </el-button>
          
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="flex justify-end mt-6">
      <el-pagination
        background
        layout="sizes, total, prev, pager, next,"
        :total="total"
        :current-page="page"
        :page-size="pageSize"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>

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
          {{ selectedRequest.manager_first_name }} {{ selectedRequest.manager_last_name }}
        </el-descriptions-item>

        <el-descriptions-item label="Менеджер телефон">
          <el-tag type="info">{{ selectedRequest.manager_phone_number }}</el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="Название учреждения">
          {{ selectedRequest.school_name }}
        </el-descriptions-item>

        <el-descriptions-item label="Директор">
          {{ selectedRequest.school_director }}
        </el-descriptions-item>

        <el-descriptions-item label="Тип">
          <el-tag type="warning">{{ selectedRequest.school_type }}</el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="Школьный телефон">
          {{ selectedRequest.school_phone_number }}
        </el-descriptions-item>

        <el-descriptions-item label="Адрес">
          {{ selectedRequest.school_address }}
        </el-descriptions-item>

        <el-descriptions-item label="Территория">
          {{ selectedRequest.school_region }} / {{ selectedRequest.school_district }}
        </el-descriptions-item>

        <el-descriptions-item label="Спорт">
          <el-tag type="success">{{ selectedRequest.school_sports }}</el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="Дополнительная информация">
          <span class="italic text-gray-600">{{ selectedRequest.additional_info || "—" }}</span>
        </el-descriptions-item>

        <el-descriptions-item label="Статус">
          <el-tag
            :type="selectedRequest.status === 'approved' ? 'success' : selectedRequest.status === 'rejected' ? 'danger' : 'info'"
          >
            {{ selectedRequest.status }}
          </el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="Созданный">
          {{ selectedRequest.created_time }}
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
      Подтверждение
    </el-button>
    <el-button
      type="danger"
      size="large"
      class="rounded-lg px-6 !w-32"
      @click="updateStatus(selectedRequest.id, 'rejected')"
    >
      Отказ
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

const requests = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);
const loading = ref(false);

const dialogVisible = ref(false);
const selectedRequest = ref(null);

const fetchRequests = async () => {
  try {
    loading.value = true;
    const res = await api.get("/sport/sport-institution-request/", {
      params: { page: page.value, page_size: pageSize.value },
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
    dialogVisible.value = false
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
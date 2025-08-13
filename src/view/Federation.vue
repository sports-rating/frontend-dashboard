<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="flex justify-between items-center mb-10">
      <div>
        <h1 class="text-4xl font-bold text-gray-900">Федерации</h1>
      </div>
      <el-button
        type="primary"
        size="large"
        class="px-4 py-2 !bg-red-500 !text-white !rounded-lg hover:!bg-red-600 !border-none"
        @click="navigate('/federation/create')"
      >
        <template #icon><Plus /></template>
        Добавить федерацию
      </el-button>
    </div>

    <!-- Federation Table Card -->
    <el-card shadow="never" class="rounded-xl border border-gray-200">
      <el-table
        :data="federations"
        class="rounded-lg"
        style="width: 100%"
        stripe
        highlight-current-row
      >
        <el-table-column label="Федерация" min-width="200">
          <template #default="scope">
            <div class="flex items-center space-x-4">
              <div>
                <p class="font-semibold text-gray-800">{{ scope.row.name }}</p>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Тип" width="130">
          <template #default="scope">
            <el-tag :type="scope.row.is_national ? 'primary' : 'success'" effect="light">
              {{ scope.row.is_national ? "National" : "Regional" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Спорт" width="180">
          <template #default="scope">
            <div class="text-sm text-gray-700">
              {{ scope.row.sports.map((s) => s.name).join(", ") || "No sports" }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Пользователи" width="120">
          <template #default="scope">
            <div class="text-sm text-gray-700">{{ scope.row.users.length }} users</div>
          </template>
        </el-table-column>

        <el-table-column label="Электронная почта" width="250">
          <template #default="scope">
            <div class="text-sm leading-5">
              <div>{{ scope.row.email || "-" }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Контакт" width="250">
          <template #default="scope">
            <div class="text-sm leading-5">
              <div class="text-gray-500">{{ scope.row.phone_number || "-" }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Действия" width="160" fixed="right">
          <template #default="scope">
            <div class="flex gap-2">
              <el-tooltip content="Edit" placement="top">
                <el-button
                  size="small"
                  type="primary"
                  circle
                  @click="navigate(`/federation/edit/${scope.row.id}`)"
                >
                  <el-icon><Edit /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="Delete" placement="top">
                <el-button
                  size="small"
                  type="danger"
                  circle
                  @click="showDeleteModal(scope.row)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="flex justify-end mt-6">
        <el-pagination
          class="red-pagination"
          background
          layout="prev, pager, next"
          :total="totalCount"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handlePageChange"
        />
      </div>

      <!-- Empty State -->
      <div v-if="federations.length === 0" class="py-16 text-center">
        <el-empty description="No federations found">
          <el-button type="primary" @click="navigate('/federation/create')"
            >Create Now</el-button
          >
        </el-empty>
      </div>
    </el-card>

    <!-- Delete Modal -->
    <DeleteModal
      v-model:visible="showDeleteDialog"
      :federation="federationToDelete"
      @confirmed="handleFederationDeleted"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Plus, Edit, Delete } from "@element-plus/icons-vue";
import DeleteModal from "../components/Federation/DeleteModal.vue";
import api from "../utils/axios";

const federations = ref([]);
const totalCount = ref(0);

const showDeleteDialog = ref(false);
const federationToDelete = ref(null);

const currentPage = ref(1);
const pageSize = ref(10);

const router = useRouter();
const navigate = (path) => router.push(path);

async function fetchFederations(page = 1) {
  try {
    const res = await api.get("/federation/", {
      params: {
        page,
        page_size: pageSize.value,
      },
    });
    totalCount.value = res.data.data.count;
    federations.value = res.data.data.data;
  } catch (error) {
    console.error(error);
  }
}

watch(currentPage, (newPage) => {
  fetchFederations(newPage);
});

const handlePageChange = (page) => {
  currentPage.value = page;
};

const showDeleteModal = (federation) => {
  federationToDelete.value = federation;
  showDeleteDialog.value = true;
};

const handleFederationDeleted = async () => {
  try {
    await api.delete(`/federation/${federationToDelete.value.id}/`);
    showDeleteDialog.value = false;
    federationToDelete.value = null;
    fetchFederations(currentPage.value);
  } catch (error) {
    console.error("Failed to delete federation:", error);
  }
};

onMounted(() => {
  fetchFederations(currentPage.value);
});
</script>

<style scoped></style>

<style>
.red-pagination .el-pager li.is-active {
  background-color: #dc2626 !important;
  color: white !important;
  border-color: #dc2626 !important;
}

.red-pagination .el-pager li:hover {
  color: #dc2626 !important;
}

.red-pagination .btn-prev,
.red-pagination .btn-next {
  color: #dc2626 !important;
}

.red-pagination .btn-prev:hover,
.red-pagination .btn-next:hover {
  background-color: #fee2e2 !important;
}
</style>

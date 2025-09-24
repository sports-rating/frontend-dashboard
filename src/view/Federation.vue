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
        class="rounded-lg cursor-pointer"
        style="width: 100%"
        stripe
        highlight-current-row
        @row-click="(row) => showUsersDialog(row.id)"
      >
        <el-table-column label="Федерация" min-width="400">
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
            <el-tooltip content="Request" placement="top">
                <el-button
                  size="small"
                  type="success"
                  circle
                  @click="navigate(`/federation/request/${scope.row.id}`)"
                >
                  <el-icon><Document /></el-icon>
                </el-button>
              </el-tooltip>

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

    <el-dialog
  v-model="userDialogVisible"
  width="80%"
  :title="selectedFederationUsers?.name"
>
  <div v-if="selectedFederationUsers">
    <div class="flex gap-6 items-center mb-6">
      <img
        v-if="selectedFederationUsers.logo"
        :src="selectedFederationUsers.logo"
        class="w-24 h-24 rounded-lg object-cover border"
        alt="Logo"
      />
      <div>
        <p><strong>Телефон:</strong> {{ selectedFederationUsers.phone_number }}</p>
        <p><strong>Электронная почта:</strong> {{ selectedFederationUsers.email }}</p>
        <p><strong>Адрес:</strong> {{ selectedFederationUsers.address }}</p>
        <p><strong>Спорт:</strong> <el-tag
        v-for="sport in selectedFederationUsers.sports"
        :key="sport.id"
        type="success"
        class="mr-2 mb-2"
      >
        {{ sport.name }}
      </el-tag></p>
      </div>
    </div>


    <!-- Yosh guruhlari -->
    <el-card class="mb-4">
      <h3 class="font-semibold mb-2">Возрастные группы</h3>
      <el-table
        :data="selectedFederationUsers.age_groups"
        border
        class="no-scrollbar"
        style="width: 100%; max-height: 15rem; overflow-y: scroll;"
      >
        <el-table-column prop="name" label="Полное имя" />
        <el-table-column prop="gender" label="Пол" />
        <el-table-column prop="min_age" label="Младший возраст" />
        <el-table-column prop="max_age" label="Старший возраст" />
        <el-table-column label="Весовые категории">
          <template #default="scope">
            <el-tag
              v-for="w in scope.row.weights"
              :key="w"
              size="small"
              class="mr-1 mb-1"
            >
              {{ w }} кг
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Hujjatlar -->
    <el-card class="mb-4" v-if="selectedFederationUsers.documents?.length">
      <h3 class="font-semibold mb-2">Документы</h3>
      <el-table
        :data="selectedFederationUsers.documents"
        border
        style="width: 100%"
      >
        <el-table-column prop="media_type" label="Тип" width="100" />
        <el-table-column prop="size" label="Размер" width="120" />
        <el-table-column label="Файл">
          <template #default="scope">
            <a
              :href="scope.row.file"
              target="_blank"
              class="text-blue-500 underline"
            >
              {{ scope.row.file.split('/').pop() }}
            </a>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card>
      <h3 class="font-semibold mb-2">Пользователи</h3>
      <el-table
        :data="selectedFederationUsers.users"
        border
        style="width: 100%"
      >
        <el-table-column prop="first_name" label="Имя" />
        <el-table-column prop="last_name" label="Фамилия" />
        <el-table-column prop="phone_number" label="Телефон" />
        <el-table-column prop="email" label="Электронная почта" />
        <el-table-column prop="user_role" label="Pоль" />
      </el-table>
    </el-card>
  </div>
    </el-dialog>



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
import { Plus, Edit, Delete, Document } from "@element-plus/icons-vue";
import DeleteModal from "../components/Federation/DeleteModal.vue";
import api from "../utils/axios";
import { ElMessage } from "element-plus";

const federations = ref([]);
const totalCount = ref(0);
const selectedFederationUsers = ref([]);
const userDialogVisible = ref(false)

const showDeleteDialog = ref(false);
const federationToDelete = ref(null);

const currentPage = ref(1);
const pageSize = ref(10);

const router = useRouter();
const navigate = (path) => router.push(path);

const showUsersDialog = async (federationId) => {
  try {
    const res = await api.get(`/federation/${federationId}/`);
    // Agar API {count, data: []} qaytarsa:
    selectedFederationUsers.value = Array.isArray(res.data.data)
      ? res.data.data
      : res.data.data || [];

    userDialogVisible.value = true;
  } catch (error) {
    console.error(error);
    ElMessage.error("Не удалось загрузить пользователей");
  }
};

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
  background-color: #f7cece !important;
}

.no-scrollbar::-webkit-scrollbar-thumb {
  background-color: #f7cece;
  border: 7px solid transparent;
  border-radius: 8px;
  background-clip: padding-box;
}

.no-scrollbar::-webkit-scrollbar {
  width: 12px;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scroll-margin-block-start: 0;
}
</style>

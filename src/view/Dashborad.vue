<template>
  <div class="">
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Подтверждение удаления</h3>
        <p class="text-sm text-gray-600 mb-6">
          Вы уверены, что хотите удалить этот Пользователи? Это действие необратимо.
        </p>
        <div class="flex justify-end gap-4">
          <button
            @click="isModalOpen = false"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Отмена
          </button>
          <button
            @click="deleteTournament"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col mb-6">
      <h1 class="text-3xl font-medium dark:text-white text-[#1E1E2D]">Пользователи</h1>
    </div>

    <div class="bg-white dark:bg-[#1E1E2D] rounded-lg border mb-6 w-full">
      <div class="p-4">
        <div class="flex flex-wrap gap-4 w-full">
          <div class="flex-1">
            <input
              v-model="search"
              type="search"
              placeholder="Поиск..."
              class="2xl:w-[15rem] w-[10rem] px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div>
            <el-date-picker
              style="width: 20rem !important"
              v-model="dateRange"
              type="daterange"
              start-placeholder="Весь период"
              end-placeholder="Весь период"
            />
          </div>
          <select
            v-model="userType"
            class="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="">Все типы пользователей</option>
            <option value="trainer">Тренер</option>
            <option value="sportsman">Спортсмен</option>
          </select>
          <button
            @click="showExportModal = true"
            class="flex gap-2 items-center px-4 py-2 text-sm text-white bg-green-500 rounded-lg hover:bg-green-600"
          >
            <img src="../assets/img/up.svg" alt="up" />
            Экспорт
          </button>

          <div class="relative">
            <button
              @click="isCreateToggle"
              class="h-full flex gap-2 items-center px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              <img src="/plus.svg" alt="up" />
              Добавить
            </button>

            <div
              v-if="isCreate"
              class="absolute w-[120px] top-12 -right-3 bg-white dark:bg-[#1E1E2D] rounded-xl border p-2"
            >
              <div class="flex flex-col divide-y divide-[#EFF0F3] gap-2 m-0">
                <p
                  @click="navigate('/create-user-athletes')"
                  class="text-base m-0 cursor-pointer hover:text-[#1E1E2D] hover:font-bold"
                >
                  Спортсмены
                </p>
                <p
                  @click="navigate('/create-user-trener')"
                  class="text-base m-0 cursor-pointer hover:text-[#1E1E2D] hover:font-bold"
                >
                  Тренеры
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow w-full">
      <div class="overflow-x-scroll no-scrollbar">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                v-for="header in headers"
                :key="header"
                scope="col"
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y text-center divide-gray-200 !w-full">
            <tr
              v-for="(user, index) in filteredUsers"
              :key="user.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{
                  user.first_name || user.last_name
                    ? user.first_name + " " + user.last_name
                    : "-"
                }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.phone_number ? user.phone_number : "-" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.email ? user.email : "-" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.user_role ? user.user_role : "-" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.created_time ? user.created_time : "-" }}
              </td>

              <td
                class="px-6 py-4 gap-2 flex whitespace-nowrap justify-center text-sm text-gray-500"
              >
                <button class="hover:text-gray-900 border p-2 rounded-lg bg-[#EFF0F3]">
                  <router-link
                    v-if="user.user_role !== 'trainer'"
                    :to="`/sportsman-view/${user.id}`"
                  >
                    Действие
                  </router-link>

                  <router-link
                    v-if="user.user_role === 'trainer'"
                    :to="`/trainer-view/${user.id}`"
                  >
                    Действие
                  </router-link>
                </button>

                <button class="hover:text-gray-900 border p-2 rounded-lg bg-[#EFF0F3]">
                  <router-link
                    v-if="user.user_role !== 'trainer'"
                    :to="`/user-athletes/edit/${user.id}`"
                  >
                    <!-- <span>
                    <img src="/edit.svg" alt="">
                  </span> -->
                    Обновить
                  </router-link>
                  <router-link
                    v-if="user.user_role === 'trainer'"
                    :to="`/user-trainer/edit/${user.id}`"
                  >
                    <!-- <span>
                    <img src="/edit.svg" alt="">
                  </span> -->
                    Обновить
                  </router-link>
                </button>

                <button
                  @click="confirmDelete(user.id, user.user_role)"
                  class="hover:text-gray-300 text-white border p-2 rounded-lg bg-red-500"
                >
                  Удалить
                  <!-- <span>
                    <img src="/delete.svg" alt="">
                  </span> -->
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ExportModal
      :is-open="showExportModal"
      @close="showExportModal = false"
      @export="handleExport"
      :data="dataSport"
    />
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted } from "vue";
import ExportModal from "../components/ExportModal.vue";
import { useRoute, useRouter } from "vue-router";
import api from "../utils/axios";

const route = useRoute();
const router = useRouter();
const search = ref("");
const userStatus = ref("");
const userType = ref("");
const dateRange = ref(null);
const showExportModal = ref(false);
const isCreate = ref(false);
const data = ref([]);
const dataSport = ref([]);
const isModalOpen = ref(false);
const sportToDelete = ref(null);
const toRole = ref(null);

const confirmDelete = (id, role) => {
  sportToDelete.value = id;
  toRole.value = role;
  isModalOpen.value = true;
};

const deleteTournament = async () => {
  try {
    if (toRole.value === "sportsman") {
      await api.delete(
        `https://api.7srating.uz/api/user/profile/sportsman/${sportToDelete.value}/`
      );
      data.value = data.value.filter((user) => user.id !== sportToDelete.value);
      isModalOpen.value = false;
    } else if (toRole.value === "trainer") {
      await api.delete(
        `https://api.7srating.uz/api/user/profile/trainer/${sportToDelete.value}/`
      );
      data.value = data.value.filter((user) => user.id !== sportToDelete.value);
      isModalOpen.value = false;
    }
  } catch (e) {
    console.error("Failed to delete tournament:", e);
  }
};

const getSport = async () => {
  try {
    const res = await api.get("https://api.7srating.uz/api/dashboard/sport/");

    dataSport.value = res.data.data;
  } catch (e) {
    console.log(e);
  }
};

getSport();

const getData = async () => {
  try {
    const res = await api.get("https://api.7srating.uz/api/dashboard/users/");

    data.value = res.data.data;
  } catch (e) {
    console.log(e);
  }
};
onMounted(() => {
  getData();
  localStorage.removeItem("schools");
  localStorage.removeItem("results");
  localStorage.removeItem("media_ids");
  localStorage.removeItem("photos");
  localStorage.removeItem("pdfs");
  localStorage.removeItem("videos");
  localStorage.removeItem("selectedSport");
  localStorage.removeItem("selectedTrainer");
});

const headers = ref([
  "#",
  "Имя",
  "Номер телефона",
  "Электронная почта",
  "Тип пользователя",
  "Дата",
  "Действия",
]);

const filteredUsers = computed(() => {
  return data.value.filter((user) => {
    const matchesSearch =
      user.first_name?.toLowerCase().includes(search.value?.toLowerCase()) ||
      user.phone_number?.toLowerCase().includes(search.value?.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.value?.toLowerCase());

    // const matchesStatus = userStatus.value ? user.status === userStatus.value : true;
    const matchesUserType = userType.value ? user.user_role === userType.value : true;
    const matchesDateRange = dateRange.value
      ? new Date(user.created_time) >= new Date(dateRange.value[0]) &&
        new Date(user.created_time) <= new Date(dateRange.value[1])
      : true;

    // matchesStatus
    return matchesSearch && matchesUserType && matchesDateRange;
  });
});

const handleAction = (project) => {
  // console.log('Action clicked for project:', project.id)
  router.push(project);
};

const handleExport = (data) => {
  console.log("Export data:", data);
};

const isCreateToggle = () => {
  isCreate.value = !isCreate.value;
};

const handleClickOutside = (event) => {
  if (!event.target.closest(".relative")) {
    isCreate.value = false;
  }
};

const navigate = (path) => {
  router.push(path);
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const getStatusClass = (status) => {
  return status === "Оплачено"
    ? "bg-[#E2FFEF] text-[#27A950]"
    : "bg-[#FEECEC] text-[#E7273D]";
};
</script>

<style>
.no-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e1e1e1;
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

.el-date-editor.el-range-editor {
  border: 1px solid #e1e1e1;
  background-color: #fafafb;
  border-radius: 5px;
  padding: 5px;
  transition: border-color 0.3s ease;
  height: 2.5rem;
  cursor: pointer;
}

input[type="date"] {
  display: block !important;
  position: relative;
  padding: 1rem 3.5rem 1rem 0.75rem;
  font-size: 1rem;
  font-family: monospace;
  border: 1px solid #8292a2;
  border-radius: 0.25rem;
  background: white
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='22' viewBox='0 0 20 22'%3E%3Cg fill='none' fill-rule='evenodd' stroke='%23688EBB' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' transform='translate(1 1)'%3E%3Crect width='18' height='18' y='2' rx='2'/%3E%3Cpath d='M13 0L13 4M5 0L5 4M0 8L18 8'/%3E%3C/g%3E%3C/svg%3E")
    right 1rem center no-repeat;
  cursor: pointer;
}

::-webkit-calendar-picker-indicator {
  position: absolute;
  width: 2.5rem;
  height: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  opacity: 0 !important;
  cursor: pointer;
}

input[type="date"]:hover::-webkit-calendar-picker-indicator {
  opacity: 0 !important;
}
input[type="date"]:hover::-webkit-calendar-picker-indicator:hover {
  opacity: 0 !important;
}
</style>

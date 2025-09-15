<template>
  <div class="">
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Подтверждение удаления</h3>
        <p class="text-sm text-gray-600 mb-6">
          Вы уверены, что хотите удалить этот Школы? Это действие необратимо.
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
      <h1 class="text-3xl font-medium dark:text-white text-[#1E1E2D]">Школы</h1>
    </div>

    <div class="bg-white dark:bg-[#1E1E2D] rounded-lg border mb-6 w-full">
      <div class="p-4">
        <div class="flex gap-4 w-full justify-between">
          <div class="flex gap-4">
            <input
              v-model="search"
              type="search"
              placeholder="Поиск..."
              class="2xl:w-[15rem] w-[10rem] px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
            />

            <Multiselect
              v-model="federation"
              :options="dataFederation"
              label="name"
              track-by="id"
              value-prop="id"
              placeholder="Выберите Федерация"
              :clear-on-select="false"
              :close-on-select="true"
              :show-labels="false"
              :allow-empty="true"
              :clearable="true"
            />
          </div>
          <div class="flex gap-6">
            <div class="relative">
              <button
                @click="navigate('/school/create')"
                class="h-full flex gap-2 items-center px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                <img src="/plus.svg" alt="up" />
                Добавить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow w-full">
      <div class="overflow-x-scroll no-scrollbar">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                v-for="header in headers"
                :key="header"
                scope="col"
                class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y text-center divide-gray-200 !w-full">
            <tr
              v-for="(user, index) in paginatedUsers"
              :key="user.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ (currentPage - 1) * perPage + index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.name ? user.name : "-" }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.phone_number ? user.phone_number : "-" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.federation ? user.federation.name : "-" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.region ? user.region.name : "-" }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.district ? user.district.name : "-" }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.address ? user.address : "-" }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.director ? user.director : " - " }}
              </td>
              <td
                class="px-6 py-4 gap-2 flex justify-center whitespace-nowrap text-sm text-gray-500"
              >
                <button class="hover:text-gray-900 border p-2 rounded-lg bg-[#EFF0F3]">
                  <router-link :to="`/school/edit/${user.id}`">
                    <!-- <img class="w-6 h-6" src="/edit.svg" alt=""> -->
                    Обновить
                  </router-link>
                </button>
                <button
                  @click="confirmDelete(user.id)"
                  class="hover:text-gray-300 text-white border p-2 rounded-lg bg-red-500"
                >
                  Удалить
                  <!-- <img class="w-6 h-6"  src="/delete.svg" alt=""> -->
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="totalPages !== 1 && data.length"
      class="flex items-center space-x-2 my-5 justify-end"
    >
      <button @click="previousPage" :disabled="currentPage === 1" class="pagination-btn">
        &lt;
      </button>

      <button
        v-for="page in totalPages"
        :key="page"
        @click="setPage(page)"
        :class="{
          'pagination-btn active': currentPage === page,
          'pagination-btn': currentPage !== page,
        }"
      >
        {{ page }}
      </button>

      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="pagination-btn"
      >
        &gt;
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import api from "../utils/axios";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";

const headers = ref([
  "#",
  "Название школы",
  "Номер телефона",
  "Федерация",
  "Область",
  "Район",
  "Адрес",
  "Руководитель школы",
  "Действия",
]);
const router = useRouter();
const search = ref("");
const dateRange = ref(null);
const isCreate = ref(false);
const data = ref([]);
const dataTrainer = ref([]);
const isModalOpen = ref(false);
const schoolDelete = ref(null);
const currentPage = ref(1);
const perPage = ref(10);
const federation = ref("")
const dataFederation = ref([]);

const getDataFederation = async () => {
  try {
    const res = await api.get("https://api.7srating.uz/api/federation/?page_size=500");

    dataFederation.value = res.data.data.data;
  } catch (e) {
    console.log(e);
  }
};

getDataFederation()

const getData = async () => {
  try {
    const params = {};
    if (search.value) params.search = search.value; 
    if (federation.value) params.federation = federation.value.id;

    const res = await api.get("https://api.7srating.uz/api/education/school/", {
      params,
    });

    data.value = res.data.data.data;
  } catch (e) {
    console.log(e);
  }
};
const getTrainer = async () => {
  try {
    const res = await api.get("https://api.7srating.uz/api/user/profile/trainer/");
    dataTrainer.value = res.data.data;
  } catch (e) {
    console.error(e);
  }
};

const deleteTournament = async () => {
  try {
    await api.delete(
      `https://api.7srating.uz/api/education/school/${schoolDelete.value}/`
    );
    data.value = data.value.filter((user) => user.id !== schoolDelete.value);
    await getData();

    isModalOpen.value = false;

    if (paginatedUsers.value.length === 0 && currentPage.value > 1) {
      currentPage.value -= 1;
    }
  } catch (e) {
    console.error("Failed to delete tournament:", e);
  }
};



const totalPages = computed(() => Math.ceil(data.value.length / perPage.value));

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return data.value.slice(start, start + perPage.value);
});
watch([search, federation], () => {
  getData();
});

const setPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const previousPage = () => {
  setPage(currentPage.value - 1);
};

const nextPage = () => {
  setPage(currentPage.value + 1);
};

const confirmDelete = (id) => {
  schoolDelete.value = id;
  isModalOpen.value = true;
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
  getData();
  getTrainer();
  localStorage.removeItem("schools");
  localStorage.removeItem("results");
  localStorage.removeItem("media_ids");
  localStorage.removeItem("photos");
  localStorage.removeItem("videos");
  localStorage.removeItem("pdfs");
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
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

.pagination-btn {
  @apply w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 bg-white hover:bg-gray-200;
}

.active {
  @apply bg-red-500 text-white border-red-500;
}

.pagination-btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}
</style>

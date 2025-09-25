<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-2xl w-full max-w-md p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-xl font-medium text-gray-900">Экспорт</h2>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>

      <!-- Form -->
      <div class="space-y-4">
        <!-- Date Input -->
        <div>
          <div class="relative gap-2 flex flex-col w-full">
            <label>Время начала</label>
            <!-- <el-date-picker
              v-model="start"
              type="date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              placeholder="Введите дату"
              class="custom-date-picker"
            /> -->

            <input
              v-model="start"
              type="date"
              min="1900-01-01"
              max="2026-01-01"
              class="!h-10 !w-full !mt-1 !border !rounded-md p-2"
            />
          </div>
        </div>

        <div>
          <div class="relative gap-2 flex flex-col w-full">
            <label>Конец Времени</label>
            <!-- <el-date-picker
              v-model="end"
              type="date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              placeholder="Введите дату"
              class="custom-date-picker"
            /> -->

            <input
              v-model="end"
              type="date"
              min="1900-01-01"
              max="2026-01-01"
              class="!h-10 !w-full !mt-1 !border !rounded-md px-2"
            />
          </div>
        </div>

        <div>
          <div class="relative gap-2 flex flex-col">
            <label>Тип пользователя</label>
            <select
              v-model="user"
              class="w-full px-4 py-2.5 text-gray-500 border border-gray-200 rounded-lg appearance-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
            >
              <option value="" disabled selected>Выберите тип пользователя</option>
              <option value="sportsman">Спортсмен</option>
              <option value="trainer">Тренер</option>
            </select>
            <ChevronDownIcon
              class="absolute right-3 top-2/3 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        <!-- Sport Type Dropdown -->
        <div>
          <div class="relative gap-2 flex flex-col">
            <label>Тип спорта</label>

            <Multiselect
              v-model="sport"
              :options="props.data"
              label="name"
              track-by="id"
              value-prop="id"
              placeholder="Выберите тип спорта"
              class="mt-1"
            />
          </div>
        </div>

        <!-- Export Type -->
        <!-- <div class="space-y-3 ">
            <label >Тип экспорта</label>
          <div class="flex items-center space-x-4 w-full ">
            <label class="flex items-center cursor-pointer bg-[#EFF0F3] w-[50%] p-2 rounded-lg justify-between">
              <input
                type="radio"
                name="exportType"
                value="excel"
                class="hidden"
                v-model="exportType"
              />
              <div 
                class="w-4 h-4 rounded-full border flex items-center justify-center"
                :class="exportType === 'excel' ? 'border-red-500' : 'border-gray-300'"
              >
                <div 
                  class="w-2 h-2 rounded-full bg-red-500"
                  v-show="exportType === 'excel'"
                ></div>
              </div>
              <div class="ml-2 gap-4 flex items-center">
                <span class="text-gray-900">Excel</span>
                <img src="../assets/img/exel.svg" alt="">
              </div>
            </label>

            <label class="flex items-center cursor-pointer bg-[#EFF0F3] w-[50%] p-2 rounded-lg justify-between">
              <input
                type="radio"
                name="exportType"
                value="pdf"
                class="hidden"
                v-model="exportType"
              />
              <div 
                class="w-4 h-4 rounded-full border flex items-center justify-center"
                :class="exportType === 'pdf' ? 'border-red-500' : 'border-gray-300'"
              >
                <div 
                  class="w-2 h-2 rounded-full bg-red-500"
                  v-show="exportType === 'pdf'"
                ></div>
              </div>
              <div class="ml-2 gap-4 flex items-center">
                <span class="text-gray-900">PDF</span>
              <img src="../assets/img/pdf.svg" alt="">
              </div>
            </label>
          </div>
        </div> -->
      </div>

      <div class="flex w-full">
        <button
          @click="handleExport"
          class="w-[50%] mx-auto mt-6 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Готово
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import { ref } from "vue";
import api from "../utils/axios";
import { XMarkIcon, ChevronDownIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array,
    default: true,
  },
});

const emit = defineEmits(["close", "export"]);
const start = ref("");
const end = ref("");
const user = ref("");
const sport = ref("");

const exportType = ref("excel");

const closeModal = () => {
  emit("close");
  exportType.value = "";
  start.value = "";
  end.value = "";
  user.value = "";
  sport.value = "";
};

const handleExport = async () => {
  try {
    const params = {};

    // Dinamik ravishda qiymatlarni qo'shish
    if (start.value) params.start_time = start.value;
    if (end.value) params.end_time = end.value;
    if (sport.value?.id) params.sport = sport.value.name;
    if (user.value) params.user_role = user.value;

    const query = new URLSearchParams(params).toString();

    const res = await api.get(
      `/dashboard/export-excel/?${query}`,
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = downloadUrl;

    const contentDisposition = res.headers["content-disposition"];
    const filename = contentDisposition
      ? contentDisposition.split("filename=")[1]
      : "export.xlsx";
    link.download = filename.replace(/["']/g, "");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(downloadUrl);
  } catch (e) {
    console.error(e);
  }

  closeModal();
};
</script>

<style>
select {
  background-image: none;
}

/* .el-input__wrapper {
  box-shadow: none !important;
} */

.custom-date-picker {
  width: 100% !important;
  border: 1px solid #eff0f3;
  border-radius: 4px !important;
  height: 45px !important;
  box-shadow: none !important;
}

.custom-date-picker .el-input {
  border: 2px solid #eff0f3;
  border-radius: 8px;
  font-size: 16px;
  padding: 10px;
  box-shadow: none !important;
}

.custom-date-picker .el-input__inner {
  color: #64748b;
  font-weight: bold;
  box-shadow: none !important;
}

.custom-date-picker .el-input:hover {
  border-color: #eff0f3;
}

.custom-date-picker .el-input__icon {
  color: #42b983;
}
</style>

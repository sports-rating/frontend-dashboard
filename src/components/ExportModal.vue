<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl w-full max-w-md p-6 ">
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
        <div >
          <div class="relative gap-2 flex flex-col w-full" >
            <label >Дата</label>
            <el-date-picker
              v-model="date"
              type="date"
              format="YYYY/MM/DD"
        value-format="YYYY-MM-DD"
              placeholder="Введите дату"
              class="custom-date-picker"
            />
              <!-- class="w-full cursor-pointer px-4 p/y-2.5 text-gray-900 border border-gray-200 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500" -->
            <!-- <CalendarIcon class="absolute right-3 top-2/3 -translate-y-1/2 h-5 w-5 text-gray-400" /> -->
          </div>
        </div>

        <!-- User Type Dropdown -->
        <div>
          <div class="relative gap-2 flex flex-col">
          <label >Тип пользователя</label>
            <select
              v-model="user"
              class="w-full px-4 py-2.5 text-gray-500 border border-gray-200 rounded-lg appearance-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
            >
              <option value="" disabled selected>Выберите тип пользователя</option>
              <option value="athlete">Спортсмен</option>
              <option value="coach">Тренер</option>
              <option value="admin">Администратор</option>
            </select>
            <ChevronDownIcon class="absolute right-3 top-2/3 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <!-- Sport Type Dropdown -->
        <div>
          <div class="relative gap-2 flex flex-col">
          <label >Тип спорта</label>
            <select
              v-model="sport"
              class="w-full px-4 py-2.5 text-gray-500 border border-gray-200 rounded-lg appearance-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
            >
              <option value="" disabled selected>Выберите тип спорта</option>
              <option value="football">Футбол</option>
              <option value="basketball">Баскетбол</option>
              <option value="volleyball">Волейбол</option>
            </select>
            <ChevronDownIcon class="absolute right-3 top-2/3 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <!-- Export Type -->
        <div class="space-y-3 ">
            <label >Тип экспорта</label>
          <div class="flex items-center space-x-4 w-full ">
            <!-- Excel Option -->
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

            <!-- PDF Option -->
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
        </div>
      </div>

      <div class="flex w-full">
      
      <button
        @click="handleExport"
        class="w-[50%] mx-auto  mt-6 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Готово
      </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  XMarkIcon,
  CalendarIcon,
  ChevronDownIcon,
  DocumentIcon,
  // TableIcon
  TableCellsIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'export'])
const date = ref('')
const user = ref('')
const sport = ref('')

const exportType = ref('excel')

const closeModal = () => {
  emit('close')
  exportType.value = ''
  date.value = ''
  user.value = ''
  sport.value = ''
}

const handleExport = () => {
  emit('export', {
    type: exportType.value,
    date: date.value,
    user: user.value,
    sport: sport.value
  })
  closeModal()
}
</script>

<style>
select {
  background-image: none;
}

.el-input__wrapper{
  box-shadow: none !important;
}


.custom-date-picker {
  width: 100% !important;
  border: 1px solid #EFF0F3 ; 
  border-radius:4px !important;
  height: 45px !important;
  box-shadow: none !important
}

.custom-date-picker .el-input {
  border: 2px solid #EFF0F3 ; 
  border-radius: 8px; 
  font-size: 16px; 
  padding: 10px ; 
box-shadow: none !important
}

.custom-date-picker .el-input__inner {
  color: #64748B ; 
  font-weight: bold; 
  box-shadow: none !important
}

.custom-date-picker .el-input:hover {
  border-color: #EFF0F3 ; 
}

.custom-date-picker .el-input__icon {
  color: #42b983; 
}
</style>
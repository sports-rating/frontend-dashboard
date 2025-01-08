<template>
  <div class="bg-white rounded-lg border p-6">
    <h2 class="text-lg font-semibold mb-4">Выбор периода</h2>
    
    <div class="grid grid-cols-2 gap-8">
      <!-- First Month -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <button class="p-1 hover:bg-gray-100 rounded-full" @click="previousMonth(0)">
            <ChevronLeftIcon class="w-5 h-5 text-gray-500" />
          </button>
          <span class="font-medium">{{ formatMonth(calendars[0].year, calendars[0].month) }}</span>
          <button class="p-1 hover:bg-gray-100 rounded-full" @click="nextMonth(0)">
            <ChevronRightIcon class="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div class="grid grid-cols-7 gap-1">
          <div v-for="day in weekDays" :key="day" class="text-center text-sm text-gray-500 py-1">
            {{ day }}
          </div>
          <template v-for="{ date, type } in calendars[0].days" :key="date">
            <button
              class="h-8 w-8 flex items-center justify-center text-sm rounded-full relative"
              :class="getDayClasses(date, type)"
              @click="selectDate(date)"
              :disabled="type === 'disabled'"
            >
              {{ new Date(date).getDate() }}
            </button>
          </template>
        </div>
      </div>

      <!-- Second Month -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <button class="p-1 hover:bg-gray-100 rounded-full" @click="previousMonth(1)">
            <ChevronLeftIcon class="w-5 h-5 text-gray-500" />
          </button>
          <span class="font-medium">{{ formatMonth(calendars[1].year, calendars[1].month) }}</span>
          <button class="p-1 hover:bg-gray-100 rounded-full" @click="nextMonth(1)">
            <ChevronRightIcon class="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div class="grid grid-cols-7 gap-1">
          <div v-for="day in weekDays" :key="day" class="text-center text-sm text-gray-500 py-1">
            {{ day }}
          </div>
          <template v-for="{ date, type } in calendars[1].days" :key="date">
            <button
              class="h-8 w-8 flex items-center justify-center text-sm rounded-full relative"
              :class="getDayClasses(date, type)"
              @click="selectDate(date)"
              :disabled="type === 'disabled'"
            >
              {{ new Date(date).getDate() }}
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Date Range Display -->
    <div class="mt-6 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="bg-gray-50 px-3 py-2 rounded-lg flex items-center space-x-2">
          <CalendarIcon class="w-5 h-5 text-gray-400" />
          <span>{{ formatDate(startDate) }}</span>
        </div>
        <span class="text-gray-400">—</span>
        <div class="bg-gray-50 px-3 py-2 rounded-lg flex items-center space-x-2">
          <CalendarIcon class="w-5 h-5 text-gray-400" />
          <span>{{ formatDate(endDate) }}</span>
        </div>
      </div>
      
      <button 
        class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        @click="applyDateRange"
      >
        Применить
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '@heroicons/vue/24/outline'
import { useRangeDate } from '../stores/rangeDate';

const rangeDateStore = useRangeDate()

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const months = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
]

const startDate = ref(new Date('2022-01-28'))
const endDate = ref(new Date('2022-02-03'))
const calendars = ref([
  { year: 2022, month: 0, days: [] }, // January
  { year: 2022, month: 1, days: [] }  // February
])

// Generate calendar days
const generateCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days = []
  
  // Add previous month's days
  const firstDayOfWeek = firstDay.getDay() || 7
  for (let i = 1; i < firstDayOfWeek; i++) {
    const date = new Date(year, month, 1 - (firstDayOfWeek - i))
    days.push({ date: date.toISOString(), type: 'disabled' })
  }
  
  // Add current month's days
  for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
    days.push({ date: new Date(date).toISOString(), type: 'current' })
  }
  
  // Add next month's days
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    days.push({ date: date.toISOString(), type: 'disabled' })
  }
  
  return days
}

// Initialize calendars
const initializeCalendars = () => {
  calendars.value = calendars.value.map((cal, index) => ({
    ...cal,
    days: generateCalendarDays(cal.year, cal.month)
  }))
}

initializeCalendars()

// Format functions
const formatMonth = (year, month) => `${months[month]} ${year}`
const formatDate = (date) => {
  if (!date) return ''
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Navigation functions
const previousMonth = (calendarIndex) => {
  const cal = calendars.value[calendarIndex]
  if (cal.month === 0) {
    cal.year--
    cal.month = 11
  } else {
    cal.month--
  }
  cal.days = generateCalendarDays(cal.year, cal.month)
}

const nextMonth = (calendarIndex) => {
  const cal = calendars.value[calendarIndex]
  if (cal.month === 11) {
    cal.year++
    cal.month = 0
  } else {
    cal.month++
  }
  cal.days = generateCalendarDays(cal.year, cal.month)
}

// Date selection
const selectDate = (dateString) => {
  const date = new Date(dateString)
  if (!startDate.value || (startDate.value && endDate.value)) {
    startDate.value = date
    endDate.value = null
  } else {
    if (date < startDate.value) {
      endDate.value = startDate.value
      startDate.value = date
    } else {
      endDate.value = date
    }
  }
}

// Day classes
const getDayClasses = (dateString, type) => {
  const date = new Date(dateString)
  const isSelected = startDate.value?.toDateString() === date.toDateString() ||
                    endDate.value?.toDateString() === date.toDateString()
  const isInRange = startDate.value && endDate.value &&
                   date > startDate.value && date < endDate.value

  return {
    'text-gray-400': type === 'disabled',
    'hover:bg-gray-100': type === 'current' && !isSelected,
    'bg-red-500 text-white': isSelected,
    'bg-red-50': isInRange
  }
}

// Apply date range
const applyDateRange = async () => {
  if (startDate.value && endDate.value) {
    await rangeDateStore.range(
      {
      start: formatDate(startDate.value),
      end: formatDate(endDate.value)
    }
    )
  }
}
</script>
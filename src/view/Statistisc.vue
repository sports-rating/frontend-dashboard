<template>
    <div>
    
        <div class="bg-white px-3 py-3 rounded-2xl border shadow-sm flex space-x-3 overflow-x-auto scrollbar-hide no-scrollbar">
                <button
                    v-for="item in navItems"
                    :key="item.name"
                    @click="setActiveItem(item.name)"
                    :class="[
                    'flex items-center space-x-2 px-5 py-2.5 rounded-xl transition-all duration-200 ease-in-out min-w-max',
                    activeItem === item.name
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md scale-[1.02]'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600',
                    ]"
                >
                    <font-awesome-icon
                    :icon="item.iconClass"
                    class="text-sm"
                    :class="activeItem === item.name ? 'text-white' : 'text-blue-500'"
                    />
                    <span class="font-medium whitespace-nowrap text-sm">{{ item.key }}</span>
                </button>
        </div>

        <Dashboard v-if="activeItem === 'Dashboard'"/>
        <PaymentStats v-else-if="activeItem === 'Payments'"/>
        <Request  v-else-if="activeItem === 'Requests'" />
        <UsersStats  v-else-if="activeItem === 'Users'" />
          <el-empty v-else :image-size="200" class="mt-36" />


    </div>
</template>

<script setup>
import Dashboard from "../components/Statistics/Dashboard.vue"
import PaymentStats from "../components/Statistics/Payment/PaymentStats.vue";
import Request from "../components/Statistics/Requests/RequestTable.vue";
import UsersStats from "../components/Statistics/Users/UsersStats.vue";
import { ref } from 'vue';

const navItems = [
    { name: 'Dashboard', iconClass: 'fas fa-home', key:'Панель управления'},
    { name: 'Payments', iconClass: 'fas fa-money-bill-wave', key:'Платежи' },
     { name: 'Requests', iconClass: 'fas fa-paper-plane', key:'Запросы' },
  { name: 'Users', iconClass: 'fas fa-users', key:'Пользователи' },
//   { name: 'Federations', iconClass: 'fas fa-flag' , key:'Федерации'},
//   { name: 'Institutions', iconClass: 'fas fa-building' , key:'Institutions'},
//   { name: 'Sports', iconClass: 'fas fa-dumbbell', key:'Спорт' },
//   { name: 'Regional', iconClass: 'fas fa-map-marker-alt', key:'Региональный' },
];

const activeItem = ref('Dashboard');

const setActiveItem = (itemName) => {
    activeItem.value = itemName;
};
</script>

<style>
.no-scrollbar::-webkit-scrollbar-thumb {
  background-color: #f6f4f4;
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
<template>
  <el-container class="layout-container-demo !h-screen">
    <el-aside width="256px" class="!bg-[#1E1E2D] !text-white !h-full">
      <el-scrollbar>
        <div class="p-4">
          <img src="/saber-logos.svg" alt="Sport Rating" class="h-8" />
        </div>

        <nav class="mt-6">
          <div v-for="item in menuItems" :key="item.path">
            <div
              @click="item.children ? toggleSubmenu(item) : navigate(item.path)"
              class="flex items-center px-6 py-3 text-sm hover:bg-red-500 transition-colors cursor-pointer"
              :class="{
                'bg-red-500':
                  currentPath === item.path ||
                  (item.children &&
                    item.children.some((child) => child.path === currentPath)),
              }"
            >
              <component :is="item.icon" class="h-5 w-5 mr-3" />
              {{ item.name }}
              <ChevronDownIcon
                v-if="item.children"
                class="h-4 w-4 ml-auto transition-transform duration-200"
                :class="{ 'rotate-180': openSubmenu === item.name }"
              />
            </div>
            <div v-if="item.children && openSubmenu === item.name" class="ml-6 mt-2">
              <div
                v-for="child in item.children"
                :key="child.path"
                @click="navigate(child.path)"
                class="flex items-center px-6 py-2 gap-1 text-sm hover:bg-red-500 transition-colors cursor-pointer"
                :class="{ 'bg-red-500': currentPath === child.path }"
              >
                <component :is="child.icon" class="h-4 w-4 mr-3" />
                {{ child.name }}
              </div>
            </div>
          </div>
        </nav>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header
        class="!bg-white dark:!bg-[#1E1E2D] !shadow-sm !z-10 dark:!border-l dark:!border-b dark:!border-[#8B8992]"
      >
        <div class="flex items-center justify-end py-3">
          <!-- <div class="flex-1 ">
            <div class="relative">
              <input
                type="search"
                placeholder="Поиск пользователей"
                class="w-[50%] pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div> -->

          <div class="flex items-center">
            <button
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-white dark:hover:text-red-500"
            >
              <BellIcon class="h-5 w-5" />
            </button>
            <button
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-white dark:hover:text-red-500"
            >
              <EnvelopeIcon class="h-5 w-5" />
            </button>
            <!-- @click="toggleDarkMode" -->
            <button
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-white dark:hover:text-red-500"
            >
              <component :is="isDarkMode ? MoonIcon : SunIcon" class="h-5 w-5" />
            </button>
            <div class="relative flex items-center cursor-pointer">
              <div @click="profileToggle" class="flex items-center cursor-pointer">
                <img
                  :src="data?.profile_photo ||'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
                  alt="Profile"
                  class="h-8 w-8 rounded-full"
                />
                <div class="flex flex-col">
                  <span class="ml-2 text-sm font-medium dark:text-white text-[#1E1E2D]"
                    >{{ data?.first_name }} {{ data?.last_name }}</span
                  >
                  <span
                    class="ml-2 text-xs font-medium dark:text-[#EFF0F3] text-[#1E1E2D]"
                    >{{ data?.user_role }}</span
                  >
                </div>
              </div>

              <div
                v-if="isProfile"
                class="absolute w-[280px] top-14 right-0 bg-white dark:bg-[#1E1E2D] rounded-xl shadow-lg p-4"
              >
                <div class="flex items-center space-x-3 mb-6">
                  <img
                    :src="data?.profile_photo ||'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
                    alt="Profile Avatar"
                    class="w-14 h-14 rounded-full"
                  />
                  <div>
                    <h3 class="font-medium dark:text-[#EFF0F3] text-[#1E1E2D]">
                      {{ data?.first_name }} {{ data?.last_name }}
                    </h3>
                    <span class="text-sm dark:text-[#8B8992] text-[#1E1E2D]">{{ data?.user_role }}</span>
                    <p class="text-sm dark:text-[#8B8992] text-[#1E1E2D]">
                      {{ data?.email }}
                    </p>
                  </div>
                </div>

                <nav class="space-y-1 mb-4">
                  <a
                    v-for="item in menuItemss"
                    :key="item.name"
                    href="#"
                    class="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-red-500 hover:text-white dark:text-[#EFF0F3] text-[#1E1E2D] dark:hover:text-white transition-colors"
                  >
                    {{ item.name }}
                  </a>
                </nav>

                <button
                  @click="handleLogout"
                  class="w-full flex items-center justify-center px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <ArrowRightOnRectangleIcon class="w-4 h-4 mr-2" />
                  Выйти с аккаунта
                </button>
              </div>
            </div>
          </div>
        </div>
      </el-header>

      <el-main
        class="!p-6 dark:!border-l dark:!border-[#8B8992] !bg-white dark:!bg-[#1E1E2D]"
      >
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDarkMode } from "../composables/useDarkMode";

import {
  UsersIcon,
  ClipboardDocumentListIcon,
  BuildingLibraryIcon,
  ChartBarIcon,
  BellIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
  CpuChipIcon,
  TrophyIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ClockIcon,
  PresentationChartBarIcon,
  HomeIcon
} from "@heroicons/vue/24/outline";
import { useAuthStore } from "../stores/auth";
import api from "../utils/axios";

const authStore = useAuthStore();

const route = useRoute();
const router = useRouter();
const currentPath = computed(() => route.path);
const isProfile = ref(false);
const openSubmenu = ref(null);
const { isDarkMode, toggleDarkMode } = useDarkMode();
const data = ref()
const menuItemss = [
  { name: "Мой профиль" },
  { name: "Настройки" },
  { name: "Уведомления" },
];

const getData = async () => {
  try {
    const res = await api.get("/user/profile/");
    data.value = res.data.data;
  } catch (e) {
    console.error(e);
  }
};

onMounted(() => getData());

const handleLogout = () => {
  authStore.logout();
};

const profileToggle = () => {
  isProfile.value = !isProfile.value;
};

const handleClickOutside = (event) => {
  if (!event.target.closest(".relative")) {
    isProfile.value = false;
  }
};
const toggleSubmenu = (item) => {
  openSubmenu.value = openSubmenu.value === item.name ? null : item.name;
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const navigate = (path) => {
  router.push(path);
};

const menuItems = [
  {
    name: "Панель управления",
    path: "/",
    icon: HomeIcon,
  },
  {
    name: "Пользователи",
    path: "/users",
    icon: UsersIcon,
  },
  {
    name: "Турнир",
    path: "/tournament-list",
    icon: TrophyIcon,
  },
  {
    name: "Спорт",
    path: "/sport-list",
    icon: GlobeAltIcon,
  },
  {
    name: "Школы",
    path: "/school-list",
    icon: AcademicCapIcon,
  },
  {
    name: "Политика",
    path: "/privacy-policy",
    icon: ShieldCheckIcon,
    children: [
      {
        name: "Политика ",
        path: "/privacy-policy-list",
        icon: ShieldCheckIcon,
      },
      {
        name: "Условия",
        path: "/user-terms-list",
        icon: ClockIcon,
      },
    ],
  },
  {
    name: "Федерация",
    path: "/federation-list",
    icon: CpuChipIcon,
  },
  // {
  //   name: 'Заявки на регистрацию',
  //   path: '/applications-for-registration',
  //   icon: ClipboardDocumentListIcon
  // },
  // {
  //   name: 'Фонд "Бирлик"',
  //   path: '/foundation',
  //   icon: BuildingLibraryIcon
  // },
  // {
  //   name: 'Спортивные комплексы',
  //   path: '/complexes',
  //   icon: CpuChipIcon
  // },
];
</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>

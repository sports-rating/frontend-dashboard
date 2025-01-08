<template>
  <div>
      <Sidebar v-if="shouldShowSidebar"/>
    <router-view v-if="!shouldShowSidebar"></router-view>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './layouts/Sidebar.vue'

const route = useRoute()

const shouldShowSidebar = computed(() => {
  return route.path !== '/login' && route.path !== '/password'
})


</script>

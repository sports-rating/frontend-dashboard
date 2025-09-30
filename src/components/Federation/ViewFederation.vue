<script setup lang="ts">
import { ref, computed } from "vue";
import { ElSelect, ElOption, ElCard, ElTable, ElTableColumn } from "element-plus";
 // agar chart kerak bo‘lsa (yoki ApexCharts ishlatishingiz mumkin)

// Fake data (API dan kelishi mumkin)
const federations = ref([
  { id: 1, name: "Futbol federatsiyasi" },
  { id: 2, name: "Basketbol federatsiyasi" },
  { id: 3, name: "Kurash federatsiyasi" },
]);

const selectedFederation = ref(1);

const stats = ref([
  { federationId: 1, sport: "Futbol", players: 120, coaches: 20 },
  { federationId: 2, sport: "Basketbol", players: 80, coaches: 10 },
  { federationId: 3, sport: "Kurash", players: 150, coaches: 25 },
]);

// Tanlangan federatsiya bo‘yicha filter
const filteredStats = computed(() =>
  stats.value.filter((s) => s.federationId === selectedFederation.value)
);
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <h1 class="text-2xl font-bold text-gray-800">Federatsiya Statistikasi</h1>

    <!-- Filter -->
    <ElCard class="p-4">
      <div class="flex items-center space-x-4">
        <span class="text-gray-700 font-medium">Federatsiya tanlang:</span>
        <ElSelect v-model="selectedFederation" placeholder="Tanlang" class="w-64">
          <ElOption
            v-for="f in federations"
            :key="f.id"
            :label="f.name"
            :value="f.id"
          />
        </ElSelect>
      </div>
    </ElCard>

    <!-- Statistik jadval -->
    <ElCard>
      <ElTable :data="filteredStats" stripe border class="w-full">
        <ElTableColumn prop="sport" label="Sport turi" />
        <ElTableColumn prop="players" label="O‘yinchilar soni" />
        <ElTableColumn prop="coaches" label="Murabbiylar soni" />
      </ElTable>
    </ElCard>

    
  </div>
</template>

<script setup lang="ts">
import ClassroomGrid from '../components/ClassroomGrid.vue'
import RecentInspections from '../components/RecentInspections.vue'
import StatsCards from '../components/StatsCards.vue'
import TeachingSupervision from '../components/TeachingSupervision.vue'
</script>

<template>
  <div class="main-content">
    <ClassroomGrid />
    <div class="middle-row">
      <RecentInspections />
      <TeachingSupervision />
    </div>
    <StatsCards />
  </div>
</template>

<style scoped>
.main-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.middle-row {
  display: flex;
  gap: 20px;
  height: 216px;
}
</style>

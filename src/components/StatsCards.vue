<script setup lang="ts">
const stats = [
  {
    label: '巡课次数',
    value: 139,
    gradient: 'linear-gradient(165deg, #D1DCFD 0%, #E5ECFF 50%, #D1DCFD 100%)',
    icon: 'svg_e7754e51.svg',
  },
  {
    label: '评价次数',
    value: 95,
    gradient: 'linear-gradient(165deg, #D5F1FA 0%, #E8F9FF 50%, #D5F1FA 100%)',
    icon: 'svg_d5662ff6.svg',
  },
  {
    label: '评价教员数量',
    value: 36,
    gradient: 'linear-gradient(165deg, #DFDBFE 0%, #F1EFFF 50%, #DFDBFE 100%)',
    icon: 'svg_d7752f17.svg',
  },
]
</script>

<template>
  <div class="stats-cards">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="stat-card"
      :style="{ background: stat.gradient }"
    >
      <div class="stat-content">
        <span class="stat-label">{{ stat.label }}</span>
        <span class="stat-value">{{ stat.value }}</span>
      </div>
      <img :src="`/icons/${stat.icon}`" alt="" class="stat-icon" />
    </div>
  </div>
</template>

<style scoped>
.stats-cards {
  display: flex;
  gap: 20px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 18px;
  padding: 30px;
  height: 200px;
}

.stat-card {
  flex: 1;
  height: 140px;
  border-radius: 12px;
  box-shadow: 0 4px 10px 0 rgba(0, 49, 185, 0.04);
  position: relative;
  overflow: hidden;
  padding: 28px 40px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 49, 185, 0.1);
}

.stat-card:active {
  transform: translateY(0);
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  font-size: 16px;
  color: #373737;
  line-height: 22px;
}

.stat-value {
  font-size: 34px;
  font-weight: 600;
  color: #000000;
  line-height: 48px;
}

.stat-icon {
  position: absolute;
  right: 0;
  top: 0;
  width: 160px;
  height: 140px;
  object-fit: contain;
  opacity: 0.8;
}
</style>

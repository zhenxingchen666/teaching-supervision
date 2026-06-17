<script setup lang="ts">
const items = [
  { label: '今日课表', icon: 'svg_068ebbb0.svg', bg: '/today-schedule-card-bg.png' },
  { label: '上课中课表', icon: 'svg_069fb333.svg', bg: '/in-class-schedule-card-bg.png' },
]
</script>

<template>
  <div class="teaching-supervision">
    <h2 class="section-title">教学督导</h2>
    <div class="list">
      <div
        v-for="item in items"
        :key="item.label"
        class="list-item"
        :style="{ backgroundImage: `url(${item.bg})` }"
      >
        <img :src="`/icons/${item.icon}`" alt="" class="item-icon" />
        <span class="item-label">{{ item.label }}</span>
        <img src="../assets/icons/svg_a399f9f1.svg" alt="" class="arrow-icon" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.teaching-supervision {
  flex: 1;
  min-width: 0;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 18px;
  padding: 24px 30px;
  height: 216px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #191c1e;
  line-height: 32px;
  margin-bottom: 16px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.list-item {
  position: relative;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.list-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(190, 198, 223, 0.4);
}

.list-item:active {
  transform: translateX(2px);
}

.item-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.item-label {
  font-size: 16px;
  color: #000000;
  line-height: 22px;
}

.arrow-icon {
  position: absolute;
  right: 20px;
  width: 16px;
  height: 16px;
  transform: rotate(180deg);
}
</style>

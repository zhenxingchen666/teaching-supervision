<script setup lang="ts">
import { ref } from 'vue'

const classrooms = [
  { name: 'A-101' },
  { name: '102-207' },
  { name: '信息大楼' },
  { name: '工程实训楼' },
  { name: '103-306' },
  { name: '第一教学楼' },
  { name: '101-203' },
  { name: '101-301' },
  { name: '101-201' },
  { name: '101-201' },
  { name: '101-201' },
  { name: '101-201' },
  { name: '101-201' },
  { name: '101-201' },
  { name: '101-201' },
]

const selectedIndex = ref<number | null>(null)
</script>

<template>
  <div class="classroom-grid">
    <h2 class="section-title">教室巡课</h2>
    <div class="grid-scroll">
      <div class="grid">
        <div
          v-for="(room, index) in classrooms"
          :key="index"
          :class="['room-card', { selected: selectedIndex === index }]"
          @click="selectedIndex = index"
        >
          <div class="card-decor">
            <img src="../assets/icons/svg_051d15f8.svg" alt="" class="decor-1" />
            <img src="../assets/icons/svg_5d69fbe2.svg" alt="" class="decor-2" />
          </div>
          <span class="room-name">{{ room.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.classroom-grid {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 18px;
  padding: 24px 30px;
  height: 420px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #191c1e;
  line-height: 32px;
  margin-bottom: 16px;
}

.grid-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 4px 4px 16px;
  margin: -4px -4px 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

.room-card {
  position: relative;
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  padding-left: 24px;
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  background: url('/classroom-card-bg.png') center / cover no-repeat;
}

.room-card:hover {
  border-color: #1947ff;
  box-shadow: 0 10px 20px 0 rgba(190, 198, 223, 0.5);
  transform: translateY(-2px);
}

.room-card:active {
  transform: translateY(0);
  box-shadow: none;
}

.room-card.selected {
  border-color: #1947ff;
  box-shadow: 0 10px 20px 0 rgba(190, 198, 223, 0.5);
  transform: translateY(-2px);
}

.card-decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.decor-1 {
  position: absolute;
  left: -20%;
  top: -67%;
  opacity: 0.6;
}

.decor-2 {
  position: absolute;
  left: 39%;
  top: -35%;
  opacity: 0.4;
}

.room-name {
  position: relative;
  font-size: 18px;
  font-weight: 600;
  color: #191c1e;
  line-height: 24px;
  z-index: 1;
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PatrolDetail from './PatrolDetail.vue'
import { buildings, rooms, type Room } from '../mock/data'

const showDetail = ref(false)
const selectedRoom = ref<Room | null>(null)
const selectedBuilding = ref('2')

const filteredRooms = computed(() => {
  return rooms.filter(r => r.buildingId === selectedBuilding.value)
})

const currentBuilding = computed(() => buildings.find(b => b.id === selectedBuilding.value))

function enterClassroom(room: Room) {
  selectedRoom.value = room
  showDetail.value = true
}

function backToList() {
  showDetail.value = false
  selectedRoom.value = null
}
</script>

<template>
  <PatrolDetail v-if="showDetail" :initial-room="selectedRoom?.id" @back="backToList" />
  <div v-else class="patrol-page">
    <!-- Building selector panel -->
    <aside class="building-panel">
      <h3 class="panel-title">教学楼</h3>
      <ul class="building-list">
        <li
          v-for="b in buildings"
          :key="b.id"
          :class="['building-item', { active: selectedBuilding === b.id }]"
          @click="selectedBuilding = b.id"
        >
          {{ b.name }}
        </li>
      </ul>
    </aside>

    <!-- Classroom content -->
    <main class="classroom-content">
      <div class="content-header">
        <h2 class="content-title">{{ currentBuilding?.name }}</h2>
        <span class="current-time">当前时间：2026-06-17 星期二 09:23 (第2节课）</span>
      </div>

      <div class="classroom-grid">
        <div
          v-for="room in filteredRooms"
          :key="room.id"
          :class="['classroom-card', room.status]"
        >
          <div class="card-body">
            <div class="card-header">
              <span class="room-number">{{ room.name }}</span>
              <span v-if="room.status === 'active'" class="status-tag active">
                <span class="wave-icon" aria-hidden="true">
                  <span class="bar"></span>
                  <span class="bar"></span>
                  <span class="bar"></span>
                  <span class="bar"></span>
                </span>
                上课中
              </span>
              <span v-else class="status-tag idle">
                暂未上课
              </span>
            </div>

            <template v-if="room.status === 'active'">
              <div class="card-info">
                <div class="info-row">
                  <img src="../assets/icons/svg_7c58164a.svg" alt="" class="info-icon" />
                  <span class="info-label">课程：</span>
                  <span class="info-value">{{ room.course }}</span>
                </div>
                <div class="info-row">
                  <img src="../assets/icons/svg_7c53fb62.svg" alt="" class="info-icon" />
                  <span class="info-label">教员：</span>
                  <span class="info-value">{{ room.teacher }}</span>
                </div>
                <div class="info-row">
                  <img src="../assets/icons/svg_7c546cc3.svg" alt="" class="info-icon" />
                  <span class="info-label">时间：</span>
                  <span class="info-value">{{ room.timeSlot }}</span>
                </div>
              </div>
              <button class="enter-btn" @click="enterClassroom(room)">
                <img src="../assets/icons/svg_7c520ba2.svg" alt="" class="btn-icon" />
                进入教室
              </button>
            </template>

            <div v-else class="empty-state">
              <div class="empty-content">
                <img src="../assets/icons/svg_0b86ee78.svg" alt="" class="empty-icon" />
                <span class="empty-text">当前暂无课程安排</span>
              </div>
              <button class="enter-btn" @click="enterClassroom(room)">
                <img src="../assets/icons/svg_7c520ba2.svg" alt="" class="btn-icon" />
                进入教室
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.patrol-page {
  display: flex;
  gap: 20px;
  height: 100%;
}

/* Building panel */
.building-panel {
  width: 220px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 18px;
  padding: 20px;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #191c1e;
  line-height: 24px;
  margin-bottom: 12px;
}

.building-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.building-item {
  position: relative;
  height: 48px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-radius: 8px;
  font-size: 15px;
  color: #000000;
  line-height: 24px;
  cursor: pointer;
  transition: all 0.2s;
}

.building-item:hover {
  background: rgba(255, 255, 255, 0.6);
  color: #0047ff;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(190, 198, 223, 0.2);
}

.building-item.active {
  background: #0047ff;
  color: #ffffff;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 71, 255, 0.3);
}

.building-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 24px;
  background: #0047ff;
  border-radius: 0 100px 100px 0;
}

/* Classroom content */
.classroom-content {
  flex: 1;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 18px;
  padding: 24px 30px;
  overflow: auto;
}

.content-header {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 24px;
}

.content-title {
  font-size: 24px;
  font-weight: 600;
  color: #191c1e;
  line-height: 32px;
}

.current-time {
  font-size: 14px;
  color: #64748b;
  line-height: 24px;
}

/* Classroom grid */
.classroom-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

/* Classroom card */
.classroom-card {
  position: relative;
  height: 276px;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  border: 2px solid transparent;
  background: url('/classroom-patrol-bg.png') center / cover no-repeat;
}

.classroom-card.idle {
  background: rgba(255, 255, 255, 0.6);
}

.classroom-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 71, 255, 0.15);
  border-color: #1947ff;
}

/* Card body */
.card-body {
  position: relative;
  z-index: 1;
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.room-number {
  font-size: 22px;
  font-weight: 600;
  color: #191c1e;
  line-height: 24px;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 20px;
}

.status-tag.active {
  background: #e1ecff;
  color: #1947ff;
}

.status-tag.idle {
  background: #f1f5f9;
  color: #64748b;
  font-size: 12px;
}

/* Wave animation icon */
.wave-icon {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: flex-end;
  justify-content: center;
  gap: 2px;
  padding-bottom: 2px;
}

.wave-icon .bar {
  display: block;
  width: 1.5px;
  height: 14px;
  background: #1947ff;
  border-radius: 1px;
  transform-origin: 50% 100%;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

.wave-icon .bar:nth-child(1) {
  animation-name: bar-wave-1;
  animation-duration: 1.1s;
}
.wave-icon .bar:nth-child(2) {
  animation-name: bar-wave-2;
  animation-duration: 1.3s;
}
.wave-icon .bar:nth-child(3) {
  animation-name: bar-wave-3;
  animation-duration: 0.9s;
}
.wave-icon .bar:nth-child(4) {
  animation-name: bar-wave-4;
  animation-duration: 1.5s;
}

@keyframes bar-wave-1 {
  0% { transform: scaleY(0.3); }
  25% { transform: scaleY(0.9); }
  50% { transform: scaleY(0.5); }
  75% { transform: scaleY(1); }
  100% { transform: scaleY(0.3); }
}

@keyframes bar-wave-2 {
  0% { transform: scaleY(0.55); }
  30% { transform: scaleY(0.3); }
  60% { transform: scaleY(1); }
  80% { transform: scaleY(0.6); }
  100% { transform: scaleY(0.55); }
}

@keyframes bar-wave-3 {
  0% { transform: scaleY(0.8); }
  20% { transform: scaleY(0.4); }
  50% { transform: scaleY(0.7); }
  70% { transform: scaleY(1); }
  100% { transform: scaleY(0.8); }
}

@keyframes bar-wave-4 {
  0% { transform: scaleY(0.4); }
  35% { transform: scaleY(1); }
  55% { transform: scaleY(0.3); }
  85% { transform: scaleY(0.8); }
  100% { transform: scaleY(0.4); }
}

@media (prefers-reduced-motion: reduce) {
  .wave-icon .bar {
    animation: none;
    transform: scaleY(0.65);
  }
}

/* Info rows */
.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 28px;
}

.info-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.info-label {
  font-size: 14px;
  color: #64748b;
  line-height: 24px;
  white-space: nowrap;
}

.info-value {
  font-size: 14px;
  font-weight: 500;
  color: #191c1e;
  line-height: 24px;
}

/* Enter button */
.enter-btn {
  width: 100%;
  height: 36px;
  background: #0047ff;
  border: none;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 71, 255, 0.3);
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: auto;
  transition: opacity 0.2s;
  font-family: inherit;
}

.enter-btn:hover {
  opacity: 0.9;
}

.btn-icon {
  width: 16px;
  height: 16px;
}

/* Empty state */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.empty-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.empty-icon {
  width: 40px;
  height: 40px;
}

.empty-text {
  font-size: 12px;
  font-weight: 500;
  color: #C6CDD9;
  line-height: 17px;
}
</style>

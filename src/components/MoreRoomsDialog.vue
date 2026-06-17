<script setup lang="ts">
import { ref, computed } from 'vue'

interface Building {
  id: string
  name: string
}

interface Room {
  id: string
  name: string
  buildingId: string
}

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'select', buildingId: string, roomId: string): void
}>()

const buildings: Building[] = [
  { id: '1', name: '第一教学楼' },
  { id: '2', name: '第二教学楼' },
  { id: '3', name: '101教学楼' },
  { id: '4', name: '102教学楼' },
  { id: '5', name: '103教学楼' },
  { id: '6', name: '实验实训大楼' },
  { id: '7', name: '信息综合大楼' },
]

const rooms: Room[] = [
  { id: '101', name: '101教室', buildingId: '1' },
  { id: '102', name: '102教室', buildingId: '1' },
  { id: '201', name: '201教室', buildingId: '1' },
  { id: '202', name: '202教室', buildingId: '1' },
  { id: '103', name: '103教室', buildingId: '1' },
  { id: '301', name: '301教室', buildingId: '1' },
  { id: '302', name: '302教室', buildingId: '1' },
  { id: '303', name: '303教室', buildingId: '1' },
  { id: '304', name: '304教室', buildingId: '1' },
  { id: '305', name: '305教室', buildingId: '1' },
  { id: '306', name: '306教室', buildingId: '1' },
  { id: '307', name: '307教室', buildingId: '1' },
]

const activeBuilding = ref('1')
const selectedRoom = ref('202')

const filteredRooms = computed(() => {
  return rooms.filter(r => r.buildingId === activeBuilding.value)
})

function close() {
  emit('update:visible', false)
}

function selectRoom(room: Room) {
  selectedRoom.value = room.id
  emit('select', activeBuilding.value, room.id)
  close()
}
</script>

<template>
  <Transition name="dialog">
    <div v-if="visible" class="dialog-overlay" @click="close">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <div class="building-tabs">
            <button
              v-for="b in buildings"
              :key="b.id"
              :class="['building-tab', { active: activeBuilding === b.id }]"
              @click="activeBuilding = b.id"
            >
              {{ b.name }}
            </button>
          </div>
        </div>
        <div class="room-grid">
          <button
            v-for="room in filteredRooms"
            :key="room.id"
            class="room-btn"
            @click="selectRoom(room)"
          >
            {{ room.name }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  width: 1550px;
  max-height: 90vh;
  background: #f8f9fc;
  border-radius: 18px;
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  overflow: hidden;
}

.dialog-header {
  flex-shrink: 0;
}

.building-tabs {
  display: flex;
  align-items: center;
  gap: 50px;
  padding-bottom: 16px;
  border-bottom: 1px solid #dfe9f0;
}

.building-tab {
  position: relative;
  padding: 0 4px 8px;
  background: transparent;
  border: none;
  font-size: 14px;
  color: #191c1e;
  line-height: 20px;
  cursor: pointer;
  transition: color 0.2s;
  font-family: inherit;
}

.building-tab:hover:not(.active) {
  color: #1947ff;
}

.building-tab.active {
  color: #1947ff;
  font-weight: 500;
}

.building-tab.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 32px;
  height: 4px;
  background: #1947ff;
  border-radius: 2px;
}

.room-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 20px;
  overflow-y: auto;
  padding-bottom: 10px;
}

.room-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 10px;
  background: #f5f6fa;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 14px;
  color: #000000;
  line-height: 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.room-btn:hover {
  background: #ffffff;
}

.room-btn.active {
  background: #f5f6fa;
  border-color: #1947ff;
  color: #1947ff;
  font-weight: 500;
}

.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.3s;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-active .dialog-content,
.dialog-leave-active .dialog-content {
  transition: transform 0.3s;
}

.dialog-enter-from .dialog-content,
.dialog-leave-to .dialog-content {
  transform: scale(0.95);
}
</style>
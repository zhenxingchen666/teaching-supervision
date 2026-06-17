<script setup lang="ts">
import { nextTick, ref } from 'vue'

interface Inspection {
  course: string
  teacher: string
  room: string
}

const inspections: Inspection[] = [
  { course: '高等数学', teacher: '刘教授', room: '101-101教室' },
  { course: '大学英语', teacher: '王教授', room: '102-207教室' },
  { course: '计算机基础', teacher: '张教授', room: '实验实训大楼' },
  { course: '高等数学', teacher: '刘教授', room: '101-101教室' },
  { course: '概率论与数理统计', teacher: '教员名称', room: '教室名称' },
  { course: '人工智能大数据基础', teacher: '教员名称', room: '教室名称' },
]

const selectedIndex = ref(3)
const cardsRowRef = ref<HTMLElement | null>(null)

function selectCard(index: number) {
  selectedIndex.value = index
  nextTick(() => {
    const row = cardsRowRef.value
    if (!row) return
    const card = row.children[index] as HTMLElement | undefined
    if (!card) return
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
  })
}
</script>

<template>
  <div class="recent-inspections">
    <h2 class="section-title">最近巡课</h2>
    <div ref="cardsRowRef" class="cards-row">
      <div
        v-for="(item, index) in inspections"
        :key="index"
        :class="['inspection-card', { selected: selectedIndex === index }]"
        @click="selectCard(index)"
      >
        <p class="course-name">{{ item.course }}</p>
        <p class="detail">{{ item.teacher }}</p>
        <p class="detail">{{ item.room }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recent-inspections {
  width: 1280px;
  flex: none;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 18px;
  padding: 16px 30px 18px;
  height: 216px;
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #191c1e;
  line-height: 32px;
  margin-bottom: 8px;
}

.cards-row {
  display: flex;
  gap: 20px;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 4px 0 18px;
}

.cards-row::-webkit-scrollbar {
  display: none;
}

.inspection-card {
  flex: 0 0 220px;
  height: 120px;
  background: linear-gradient(0deg, #eff5fd 0%, #ebf0fd 100%);
  border-radius: 12px;
  border: 1px solid #e3e9f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.inspection-card:hover:not(.selected) {
  border-color: rgba(25, 71, 255, 0.4);
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(190, 198, 223, 0.4);
}

.inspection-card:active {
  transform: translateY(0);
}

.inspection-card.selected {
  border-color: #1947ff;
  box-shadow: 0 10px 20px 0 rgba(190, 198, 223, 0.5);
  transform: translateY(-2px);
}

.course-name {
  font-size: 18px;
  font-weight: 500;
  color: #000000;
  text-align: center;
  line-height: 25px;
}

.detail {
  font-size: 14px;
  color: #373737;
  text-align: center;
  line-height: 20px;
}
</style>

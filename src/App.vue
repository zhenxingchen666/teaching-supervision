<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import Dashboard from './views/Dashboard.vue'
import TeachingSupervisionList from './views/TeachingSupervisionList.vue'
import ClassroomPatrol from './views/ClassroomPatrol.vue'

const activeNav = ref('教学督导')

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const MIN_USER_SCALE = 0.3
const MAX_USER_SCALE = 3

const fitScale = ref(1)
const userScale = ref(1)
const finalScale = computed(() => fitScale.value * userScale.value)

function updateFitScale() {
  const sx = window.innerWidth / DESIGN_WIDTH
  const sy = window.innerHeight / DESIGN_HEIGHT
  fitScale.value = Math.min(sx, sy)
}

let rafId = 0
function onResize() {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(updateFitScale)
}

function onWheel(event: WheelEvent) {
  if (!event.ctrlKey && !event.metaKey) return
  event.preventDefault()
  const next = userScale.value * (1 - event.deltaY * 0.0015)
  userScale.value = Math.min(MAX_USER_SCALE, Math.max(MIN_USER_SCALE, next))
}

function resetUserScale() {
  userScale.value = 1
}

onMounted(() => {
  updateFitScale()
  window.addEventListener('resize', onResize)
  window.addEventListener('wheel', onWheel, { passive: false })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('wheel', onWheel)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div class="viewport-frame" @dblclick.self="resetUserScale">
    <div
      class="scaler"
      :style="{
        width: `${DESIGN_WIDTH * finalScale}px`,
        height: `${DESIGN_HEIGHT * finalScale}px`,
      }"
    >
      <div
        class="design-canvas"
        :style="{ transform: `scale(${finalScale})` }"
      >
        <el-container class="canvas-inner">
          <el-header height="66px">
            <Header />
          </el-header>
          <el-container>
            <el-aside width="220px">
              <Sidebar v-model="activeNav" />
            </el-aside>
            <el-main>
              <TeachingSupervisionList v-if="activeNav === '教学督导'" />
              <ClassroomPatrol v-else-if="activeNav === '教室巡课'" />
              <Dashboard v-else-if="activeNav === '首页'" />
              <Dashboard v-else />
            </el-main>
          </el-container>
        </el-container>
      </div>
    </div>
  </div>
  <div
    class="zoom-indicator"
    title="点击重置缩放"
    @click="resetUserScale"
  >
    {{ Math.round(finalScale * 100) }}%
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #app {
  width: 100%;
  height: 100%;
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

body {
  background: url('/bg.png') center / cover no-repeat #0a1628;
}
</style>

<style scoped>
.viewport-frame {
  position: fixed;
  inset: 0;
  display: flex;
  overflow: auto;
}

.scaler {
  flex: 0 0 auto;
  margin: auto;
}

.design-canvas {
  width: 1920px;
  height: 1080px;
  flex: 0 0 auto;
  transform-origin: top left;
  will-change: transform;
}

.canvas-inner {
  width: 100%;
  height: 100%;
}

.design-canvas :deep(.el-container) {
  background: transparent;
}

.design-canvas :deep(.el-header) {
  background: transparent;
  padding: 0;
  display: flex;
  align-items: center;
}

.design-canvas :deep(.el-aside) {
  background: transparent;
  overflow: visible;
}

.design-canvas :deep(.el-main) {
  background: transparent;
  padding: 13px 20px 20px;
  overflow-y: auto;
  overflow-x: hidden;
}

.zoom-indicator {
  position: fixed;
  right: 12px;
  bottom: 12px;
  padding: 2px 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(10, 22, 40, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  font-family: monospace;
  cursor: pointer;
  user-select: none;
  z-index: 9999;
}

.zoom-indicator:hover {
  color: #fff;
  background: rgba(10, 22, 40, 0.85);
}
</style>

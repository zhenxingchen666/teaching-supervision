<script setup lang="ts">
import { Close } from '@element-plus/icons-vue'

defineProps<{
  visible: boolean
  title: string
  date: string
  content: string
}>()

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'view'): void
}>()

function close() {
  emit('update:visible', false)
}

function onView() {
  emit('view')
  close()
}
</script>

<template>
  <Teleport to=".design-canvas" defer>
    <div v-if="visible" class="detail-mask" @click.self="close">
      <div class="detail-dialog">
        <!-- banner -->
        <div class="dialog-banner">
          <h3 class="dialog-title">消息详情</h3>
          <button class="close-btn" @click="close">
            <el-icon><Close /></el-icon>
          </button>
        </div>

        <!-- white card 480×426 -->
        <div class="dialog-card">
          <div class="card-header">
            <span class="msg-title">{{ title }}</span>
            <span class="msg-date">{{ date }}</span>
          </div>
          <div class="card-body" v-html="content"></div>
        </div>

        <!-- footer -->
        <div class="dialog-footer">
          <el-button type="primary" class="btn-view" @click="onView">查看</el-button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.detail-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2100;
  animation: fade-in 0.2s ease;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.detail-dialog {
  position: relative;
  width: 520px;
  height: 560px;
  background: #e7f2ff;
  border-radius: 18px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: pop-in 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes pop-in {
  from { transform: scale(0.92); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.dialog-banner {
  position: absolute;
  inset: 0 0 auto 0;
  height: 300px;
  background: url('/feedback-dialog-bg.png') center / cover no-repeat;
  border-radius: 18px 18px 0 0;
  z-index: 1;
}

.dialog-title {
  position: absolute;
  top: 21px;
  left: 0;
  right: 0;
  margin: 0;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  line-height: 25px;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 4px rgba(0, 30, 80, 0.25);
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  color: #191c1e;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: background 0.15s, transform 0.15s;
}

.close-btn:hover {
  background: #ffffff;
  transform: scale(1.05);
}

.close-btn .el-icon {
  font-size: 14px;
}

/* white card: 480×426 at (20, 66) */
.dialog-card {
  position: absolute;
  top: 66px;
  left: 20px;
  width: 480px;
  height: 426px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(20, 56, 140, 0.08);
  z-index: 2;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  margin-bottom: 16px;
}

.msg-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  line-height: 22px;
}

.msg-date {
  font-size: 12px;
  color: #8c8c8c;
  line-height: 16px;
  flex-shrink: 0;
}

.card-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  font-size: 14px;
  color: #000000;
  line-height: 24px;
  padding-right: 6px;
}

.card-body :deep(p) {
  margin: 0 0 12px;
}

.card-body :deep(b),
.card-body :deep(strong) {
  font-weight: 500;
}

/* footer */
.dialog-footer {
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 3;
}

.dialog-footer .btn-view {
  width: 60px;
  height: 36px;
  border-radius: 8px;
  font-size: 14px;
  padding: 0;
  margin: 0;
  background: #1947ff;
  border-color: #1947ff;
}

.dialog-footer .btn-view:hover {
  background: #3a63ff;
  border-color: #3a63ff;
}
</style>

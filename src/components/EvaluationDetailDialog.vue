<script setup lang="ts">
import { Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface IndicatorItem {
  label: string
  selected: '优' | '良' | '中'
}

interface IndicatorGroup {
  title: string
  items: IndicatorItem[]
}

export interface EvaluationDetail {
  course: string
  evaluatee: string
  evaluator: string
  evaluateTime: string
  excellent: number
  good: number
  medium: number
  total: number
  groups: IndicatorGroup[]
}

defineProps<{
  visible: boolean
  detail: EvaluationDetail | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
}>()

function close() {
  emit('update:visible', false)
}

function handleExportDetail() {
  ElMessage.success('导出功能开发中')
}

const OPTIONS: Array<'优' | '良' | '中'> = ['优', '良', '中']
const OPTION_LABEL: Record<'优' | '良' | '中', string> = {
  优: '很好',
  良: '好',
  中: '中',
}
</script>

<template>
  <Teleport to=".design-canvas" defer>
    <div v-if="visible" class="detail-mask" @click.self="close">
      <div class="detail-dialog">
        <div class="dialog-banner">
          <h3 class="dialog-title">评价结果</h3>
          <button class="close-btn" @click="close">
            <el-icon><Close /></el-icon>
          </button>
        </div>

        <div v-if="detail" class="dialog-content">
          <div class="detail-header">
            <div class="header-info">
              <div class="info-item">
                <span class="info-label">评价人：</span>
                <span class="info-value">{{ detail.evaluator }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">评价时间：</span>
                <span class="info-value">{{ detail.evaluateTime }}</span>
              </div>
            </div>
            <el-button class="btn-export-detail" @click="handleExportDetail">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="12" x2="19" y2="12"/><polyline points="16 9 19 12 16 15"/></svg>
              导出
            </el-button>
          </div>

          <div class="summary-table">
            <div class="summary-col">
              <div class="summary-head">被评人</div>
              <div class="summary-body">{{ detail.evaluatee }}</div>
            </div>
            <div class="summary-col">
              <div class="summary-head">优</div>
              <div class="summary-body">{{ detail.excellent }}项</div>
            </div>
            <div class="summary-col">
              <div class="summary-head">良</div>
              <div class="summary-body">{{ detail.good }}项</div>
            </div>
            <div class="summary-col">
              <div class="summary-head">中</div>
              <div class="summary-body">{{ detail.medium }}项</div>
            </div>
            <div class="summary-col summary-col--last">
              <div class="summary-head">总分</div>
              <div class="summary-body">{{ detail.total }}</div>
            </div>
          </div>

          <div
            v-for="group in detail.groups"
            :key="group.title"
            class="group-card"
          >
            <div class="group-title">
              <span class="group-title-bar"></span>
              {{ group.title }}
            </div>
            <div
              v-for="(item, idx) in group.items"
              :key="idx"
              class="indicator-row"
            >
              <div class="indicator-label">
                <span class="required-star">*</span>
                {{ item.label }}
              </div>
              <div class="indicator-options">
                <span
                  v-for="opt in OPTIONS"
                  :key="opt"
                  :class="['indicator-chip', item.selected === opt && 'indicator-chip--active']"
                >
                  <span class="chip-dot">
                    <span v-if="item.selected === opt" class="chip-dot-inner"></span>
                  </span>
                  {{ OPTION_LABEL[opt] }}
                </span>
              </div>
            </div>
          </div>
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
  z-index: 2000;
  animation: fade-in 0.2s ease;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pop-in {
  from { transform: scale(0.92); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.detail-dialog {
  position: relative;
  width: 620px;
  background: #e7f2ff;
  border-radius: 18px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: pop-in 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
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
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: background 0.15s, transform 0.15s;
  padding: 0;
  z-index: 4;
}

.close-btn:hover {
  background: #ffffff;
  transform: scale(1.05);
}

.close-btn .el-icon {
  font-size: 14px;
}

.dialog-content {
  position: relative;
  margin: 50px 20px 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(20, 56, 140, 0.08);
  padding: 20px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 36px;
}

.info-item {
  font-size: 14px;
  line-height: 20px;
}

.info-label {
  color: #262626;
}

.info-value {
  color: #262626;
  font-weight: 500;
}

.btn-export-detail {
  height: 36px;
  padding: 0 14px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #191c1e;
  font-size: 14px;
  font-weight: 500;
}

.btn-export-detail:hover {
  border-color: #1947ff;
  color: #1947ff;
}

.summary-table {
  display: flex;
  border-radius: 8px;
}

.summary-col {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.summary-head {
  background: #f5f6fa;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.88);
  font-weight: 500;
}

.summary-col:first-child .summary-head {
  border-top-left-radius: 8px;
}

.summary-col--last .summary-head {
  border-top-right-radius: 8px;
}

.summary-body {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.88);
  background: rgba(255, 255, 255, 0.01);
  box-shadow: inset 0 -1px 0 0 #e5e7eb;
}

.group-card {
  position: relative;
  background: #f5f6fa;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.group-title {
  position: relative;
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  line-height: 20px;
  padding-left: 12px;
}

.group-title-bar {
  position: absolute;
  left: 0;
  top: 3px;
  width: 3px;
  height: 14px;
  background: #1947ff;
  border-radius: 8px;
}

.indicator-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.indicator-label {
  font-size: 14px;
  color: #262626;
  line-height: 20px;
}

.required-star {
  color: #f52f3e;
  margin-right: 2px;
}

.indicator-options {
  display: flex;
  align-items: center;
  gap: 24px;
}

.indicator-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #000000;
  line-height: 20px;
  opacity: 0.5;
}

.indicator-chip--active {
  opacity: 1;
}

.chip-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid #d9d9d9;
  background: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.indicator-chip--active .chip-dot {
  border-color: #1947ff;
}

.chip-dot-inner {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #1947ff;
}
</style>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Close } from '@element-plus/icons-vue'

export interface RankingRow {
  rank: number
  name: string
  score: number
}

const props = defineProps<{
  visible: boolean
  type: 'teacher' | 'course'
  data: RankingRow[]
}>()

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
}>()

const keyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const jumpInput = ref<number | string>(1)

const config = computed(() =>
  props.type === 'teacher'
    ? {
        title: '教员综合成绩平均分排名',
        fieldLabel: '教员',
        fieldPlaceholder: '请输入教员姓名',
        nameColLabel: '姓名',
      }
    : {
        title: '课程成绩平均分排名',
        fieldLabel: '课程',
        fieldPlaceholder: '请输入课程名称',
        nameColLabel: '课程',
      },
)

const filtered = computed(() => {
  const k = keyword.value.trim()
  if (!k) return props.data
  return props.data.filter((r) => r.name.includes(k))
})

const total = computed(() => filtered.value.length)
const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / pageSize.value)),
)

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

const visiblePages = computed<(number | '...')[]>(() => {
  const c = currentPage.value
  const n = totalPages.value
  if (n <= 8) {
    return Array.from({ length: n }, (_, i) => i + 1)
  }
  if (c <= 5) {
    return [1, 2, 3, 4, 5, 6, '...', n]
  }
  if (c >= n - 4) {
    return [1, '...', n - 5, n - 4, n - 3, n - 2, n - 1, n]
  }
  return [1, '...', c - 1, c, c + 1, c + 2, '...', n]
})

watch(
  () => props.visible,
  (v) => {
    if (v) {
      keyword.value = ''
      currentPage.value = 1
      pageSize.value = 10
      jumpInput.value = 1
    }
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('ranking-dialog-open', v)
    }
  },
)

watch(pageSize, () => {
  currentPage.value = 1
})

function close() {
  emit('update:visible', false)
}

function handleSearch() {
  currentPage.value = 1
}

function handleReset() {
  keyword.value = ''
  currentPage.value = 1
}

function selectPage(cell: number | string) {
  if (typeof cell === 'number' && cell !== currentPage.value) {
    currentPage.value = cell
  }
}

function goPrev() {
  if (currentPage.value > 1) currentPage.value -= 1
}

function goNext() {
  if (currentPage.value < totalPages.value) currentPage.value += 1
}

function goJump() {
  const raw = Number(jumpInput.value)
  if (!Number.isFinite(raw) || raw <= 0) {
    jumpInput.value = currentPage.value
    return
  }
  const num = Math.max(1, Math.min(totalPages.value, Math.floor(raw)))
  currentPage.value = num
  jumpInput.value = num
}

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.body.classList.remove('ranking-dialog-open')
  }
})
</script>

<template>
  <Teleport to=".design-canvas" defer>
    <div v-if="visible" class="ranking-mask" @click.self="close">
      <div class="ranking-dialog">
        <div class="dialog-banner">
          <h3 class="dialog-title">{{ config.title }}</h3>
          <button class="close-btn" @click="close">
            <el-icon><Close /></el-icon>
          </button>
        </div>

        <div class="dialog-content">
          <div class="search-row">
            <label class="search-label">{{ config.fieldLabel }}</label>
            <el-input
              v-model="keyword"
              :placeholder="config.fieldPlaceholder"
              class="search-input"
              clearable
            />
            <el-button
              type="primary"
              class="btn-search"
              @click="handleSearch"
            >
              <img src="/icons/search-white.svg" alt="" class="btn-search-icon" />
              搜索
            </el-button>
            <el-button class="btn-reset" @click="handleReset">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px"><path d="M3 12a9 9 0 1 0 2.83-6.36L3 8"/><path d="M3 3v5h5"/></svg>
              重置
            </el-button>
          </div>

          <div class="rank-table-wrap">
            <el-table
              :data="pagedData"
              style="width: 100%"
              :scrollbar-always-on="false"
              :header-cell-style="{
                background: '#F5F6FA',
                color: 'rgba(0, 0, 0, 0.88)',
                fontSize: '14px',
                fontWeight: '500',
                height: '36px',
                padding: '0',
              }"
              :row-style="{ height: '44px' }"
              :cell-style="{ padding: '0' }"
            >
              <el-table-column
                prop="rank"
                label="排名"
                width="100"
                align="center"
              />
              <el-table-column
                prop="name"
                :label="config.nameColLabel"
                min-width="416"
              >
                <template #default="{ row }">
                  <span class="cell-name">{{ row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="score"
                label="平均分"
                width="214"
                align="center"
              />
            </el-table>
          </div>

          <div class="pagination-wrap">
            <div class="pg-total">共 {{ total }} 条</div>
            <div class="pg-sizes">
              <select
                v-model.number="pageSize"
                class="pg-select"
              >
                <option :value="10">10 条/页</option>
                <option :value="20">20 条/页</option>
                <option :value="50">50 条/页</option>
              </select>
            </div>
            <button
              type="button"
              class="pg-arrow"
              :disabled="currentPage <= 1"
              @click="goPrev"
            >
              <svg viewBox="0 0 16 16" width="12" height="12"><path d="M10 4l-4 4 4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </button>
            <div class="pg-pager">
              <template v-for="(cell, i) in visiblePages" :key="`p-${i}-${cell}`">
                <span
                  v-if="cell === '...'"
                  class="pg-ellipsis"
                >…</span>
                <button
                  v-else
                  type="button"
                  class="pg-num"
                  :class="{ 'is-active': cell === currentPage }"
                  @click="selectPage(cell)"
                >{{ cell }}</button>
              </template>
            </div>
            <button
              type="button"
              class="pg-arrow"
              :disabled="currentPage >= totalPages"
              @click="goNext"
            >
              <svg viewBox="0 0 16 16" width="12" height="12"><path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </button>
            <div class="pg-jump">
              前往
              <input
                v-model="jumpInput"
                type="number"
                min="1"
                :max="totalPages"
                class="pg-jump-input"
                @keyup.enter="goJump"
                @blur="goJump"
              />
              页
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.ranking-mask {
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

.ranking-dialog {
  position: relative;
  width: 800px;
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

.search-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-label {
  font-size: 14px;
  color: #191c1e;
  line-height: 20px;
  flex: 0 0 auto;
}

.search-input {
  width: 180px;
}

.search-input :deep(.el-input__wrapper) {
  height: 36px;
  border-radius: 8px;
  box-shadow: 0 0 0 1px #e5e7eb inset;
  background: #ffffff;
  padding: 0 12px;
}

.search-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #1947ff inset;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #1947ff inset !important;
}

.search-input :deep(.el-input__inner) {
  font-size: 14px;
  color: #262626;
}

.search-input :deep(.el-input__inner::placeholder) {
  color: #99a0ac;
  font-size: 14px;
}

.btn-search,
.btn-reset {
  height: 36px;
  width: 82px;
  padding: 0;
  font-size: 14px;
  border-radius: 8px;
}

.btn-search {
  background: #1947ff;
  border-color: #1947ff;
  color: #ffffff;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.btn-search-icon {
  width: 14px;
  height: 14px;
  display: block;
}

.btn-search:hover {
  background: #3a63ff;
  border-color: #3a63ff;
}

.btn-reset {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #000000;
}

.btn-reset:hover {
  border-color: #1947ff;
  color: #1947ff;
}

.rank-table-wrap {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px 0 rgba(190, 198, 223, 0.4);
}

.rank-table-wrap :deep(.el-table__inner-wrapper::before) {
  display: none;
}

.rank-table-wrap :deep(.el-scrollbar__bar.is-horizontal) {
  display: none !important;
}

.rank-table-wrap :deep(.el-table) {
  font-size: 14px;
  background: #ffffff;
}

.rank-table-wrap :deep(.el-table th.el-table__cell) {
  background: #f5f6fa;
  border-bottom: none;
}

.rank-table-wrap :deep(.el-table td.el-table__cell) {
  border-bottom: 1px solid #e5e7eb;
  color: rgba(0, 0, 0, 0.88);
}

.rank-table-wrap :deep(.el-table tr:hover > td) {
  background: #fafbff !important;
}

.cell-name {
  display: inline-block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

.pagination-wrap {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  font-size: 14px;
  color: #606266;
  padding: 4px 0 0;
  white-space: nowrap;
  box-sizing: border-box;
}

.pg-total {
  flex: 0 0 auto;
  margin-right: 16px;
}

.pg-sizes {
  flex: 0 0 auto;
  margin-right: 16px;
}

.pg-select {
  width: 110px;
  height: 28px;
  padding: 0 8px;
  border: 1px solid #e5e7eb;
  border-radius: 3px;
  background: #fff;
  color: #606266;
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 16 16'><path d='M4 6l4 4 4-4' fill='none' stroke='%23a8abb2' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 24px;
}

.pg-select:hover {
  border-color: #1947ff;
}

.pg-arrow {
  flex: 0 0 auto;
  width: 28px;
  height: 28px;
  margin-right: 8px;
  padding: 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 3px;
  color: #606266;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.pg-arrow:hover:not(:disabled) {
  color: #1947ff;
  border-color: #1947ff;
}

.pg-arrow:disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}

.pg-pager {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  margin-right: 8px;
}

.pg-num,
.pg-ellipsis {
  min-width: 28px;
  height: 28px;
  line-height: 28px;
  margin: 0 2px;
  padding: 0 4px;
  font-size: 14px;
  color: #606266;
  background: transparent;
  border: none;
  border-radius: 3px;
  text-align: center;
  cursor: pointer;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.pg-num:hover {
  color: #1947ff;
}

.pg-num.is-active {
  color: #1947ff;
  font-weight: 500;
  cursor: default;
}

.pg-ellipsis {
  cursor: default;
  color: #606266;
}

.pg-jump {
  flex: 0 0 auto;
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #606266;
}

.pg-jump-input {
  width: 48px;
  height: 28px;
  padding: 0;
  border: 1px solid #e5e7eb;
  border-radius: 3px;
  background: #fff;
  color: #606266;
  font-size: 14px;
  font-family: inherit;
  text-align: center;
  outline: none;
  -moz-appearance: textfield;
}

.pg-jump-input::-webkit-outer-spin-button,
.pg-jump-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.pg-jump-input:focus {
  border-color: #1947ff;
}
</style>

<script setup lang="ts">
import { computed, h, ref, reactive, watchEffect } from 'vue'
import { ElMessage } from 'element-plus'

const DatePickerIcon = () =>
  h('img', {
    src: '/icons/date-picker.svg',
    alt: '',
    style: 'width:16px;height:16px;display:block',
  })

type DateRange = 'week' | 'month' | 'custom'
type TabKey = 'inspector' | 'course'

interface InspectorRow {
  id: number
  name: string
  patrolCount: number
  courseCount: number
  duration: string
  evaluationCount: number
}

interface CourseRow {
  id: number
  course: string
  patrolCount: number
  inspectorCount: number
  duration: string
  evaluationCount: number
}

const dateRange = ref<DateRange>('week')
const activeTab = ref<TabKey>('inspector')
const customDateRange = ref<[string, string] | null>(null)

const searchForm = reactive({
  inspector: '',
  course: '',
  teacher: '',
})

const mockInspectorNames = ['巡课人1', '巡课人2', '巡课人3', '巡课人4', '巡课人5', '巡课人6', '巡课人7', '巡课人8', '巡课人9', '巡课人10']
const mockCourseNames = ['大气探测学', '高等数学', '线性代数', '概率论与数理统计', '大学物理', '程序设计基础', '数据结构', '计算机网络', '人工智能基础', '机器学习', '数据库原理', '操作系统', '软件工程']

const generateInspectorData = (count: number): InspectorRow[] => {
  const data: InspectorRow[] = []
  for (let i = 1; i <= count; i++) {
    data.push({
      id: i,
      name: mockInspectorNames[Math.floor(Math.random() * mockInspectorNames.length)] || `巡课人${i}`,
      patrolCount: Math.floor(Math.random() * 15) + 5,
      courseCount: Math.floor(Math.random() * 10) + 2,
      duration: `${Math.floor(Math.random() * 3)}小时${Math.floor(Math.random() * 60)}分钟`,
      evaluationCount: Math.floor(Math.random() * 8) + 2
    })
  }
  return data
}

const generateCourseData = (count: number): CourseRow[] => {
  const data: CourseRow[] = []
  for (let i = 1; i <= count; i++) {
    data.push({
      id: i,
      course: mockCourseNames[Math.floor(Math.random() * mockCourseNames.length)] || `课程${i}`,
      patrolCount: Math.floor(Math.random() * 12) + 3,
      inspectorCount: Math.floor(Math.random() * 6) + 2,
      duration: `${Math.floor(Math.random() * 2)}小时${Math.floor(Math.random() * 60)}分钟`,
      evaluationCount: Math.floor(Math.random() * 6) + 1
    })
  }
  return data
}

const allInspectorData = ref<InspectorRow[]>(generateInspectorData(80))
const allCourseData = ref<CourseRow[]>(generateCourseData(90))

const inspectorData = ref<InspectorRow[]>(allInspectorData.value.slice(0, 8))
const courseData = ref<CourseRow[]>(allCourseData.value.slice(0, 8))

const stats = computed(() => [
  { label: '巡课人数', value: '21', icon: '/icons/stats/patrol-people.png' },
  { label: '巡课课程数量', value: '126', icon: '/icons/stats/patrol-course.png' },
  { label: '巡课总时长', value: '15小时28分钟', icon: '/icons/stats/patrol-time.png' },
])

const hasData = computed(() => {
  if (dateRange.value !== 'custom') return true
  const range = customDateRange.value
  if (!range || !range[0] || !range[1]) return true
  return range[0] <= '2026-06-30' && range[1] >= '2026-06-01'
})

const currentPage = ref(1)
const pageSize = ref(8)
const total = computed(() => activeTab.value === 'inspector' ? allInspectorData.value.length : allCourseData.value.length)

const filteredInspectorData = computed(() => {
  let filtered = allInspectorData.value
  if (searchForm.inspector) {
    filtered = filtered.filter(item => item.name.includes(searchForm.inspector))
  }
  return filtered
})

const filteredCourseData = computed(() => {
  let filtered = allCourseData.value
  if (searchForm.course) {
    filtered = filtered.filter(item => item.course.includes(searchForm.course))
  }
  if (searchForm.teacher) {
    // 课程数据中没有教员字段，这里保持筛选逻辑一致性
    filtered = filtered.filter(() => true)
  }
  return filtered
})

const paginatedInspectorData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredInspectorData.value.slice(start, end)
})

const paginatedCourseData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCourseData.value.slice(start, end)
})

watchEffect(() => {
  if (activeTab.value === 'inspector') {
    inspectorData.value = paginatedInspectorData.value
  } else {
    courseData.value = paginatedCourseData.value
  }
})

const handleSearch = () => {
  currentPage.value = 1
  console.log('搜索', searchForm, activeTab.value)
}

const handleReset = () => {
  searchForm.inspector = ''
  searchForm.course = ''
  searchForm.teacher = ''
  currentPage.value = 1
}

const handleExport = () => {
  ElMessage.success('导出功能开发中')
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
}

const setTab = (tab: TabKey) => {
  activeTab.value = tab
  searchForm.inspector = ''
  searchForm.course = ''
  searchForm.teacher = ''
  currentPage.value = 1
}

const setDateRange = (range: DateRange) => {
  dateRange.value = range
}
</script>

<template>
  <div class="patrol-data">
    <div class="content-card">
      <div class="page-header">
        <h1 class="page-title">巡视数据</h1>
        <div class="date-tabs">
          <button
            v-for="opt in [
              { key: 'week' as DateRange, label: '本周' },
              { key: 'month' as DateRange, label: '本月' },
              { key: 'custom' as DateRange, label: '自定义' },
            ]"
            :key="opt.key"
            :class="['date-tab', { active: dateRange === opt.key }]"
            @click="setDateRange(opt.key)"
          >
            {{ opt.label }}
          </button>
        </div>
        <div class="date-filter">
          <span class="date-filter-label">日期</span>
          <el-date-picker
            v-model="customDateRange"
            type="daterange"
            value-format="YYYY-MM-DD"
            range-separator="～"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="default"
            :prefix-icon="DatePickerIcon"
            class="custom-date-picker"
          />
        </div>
      </div>

      <!-- 顶部统计卡片 -->
      <div class="stats-row">
        <div v-for="card in stats" :key="card.label" class="stat-card">
          <img :src="card.icon" alt="" class="stat-icon-img" />
          <div class="stat-text">
            <div class="stat-value">{{ hasData ? card.value : '--' }}</div>
            <div class="stat-label">{{ card.label }}</div>
          </div>
        </div>
      </div>

      <!-- 标签页切换 -->
      <div class="tab-bar">
        <button
          :class="['tab-btn', { active: activeTab === 'inspector' }]"
          @click="setTab('inspector')"
        >
          巡课人数据
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'course' }]"
          @click="setTab('course')"
        >
          课程数据
        </button>
      </div>

      <!-- 搜索区域 -->
      <div class="search-section">
        <div class="search-form">
          <div v-if="activeTab === 'inspector'" class="form-item">
            <label class="form-label">巡课人</label>
            <el-input
              v-model="searchForm.inspector"
              placeholder="请输入巡课人姓名"
              style="width: 200px"
              size="default"
              clearable
            />
          </div>
          <div v-else class="form-item">
            <label class="form-label">课程</label>
            <el-input
              v-model="searchForm.course"
              placeholder="请输入课程名称"
              style="width: 240px"
              size="default"
              clearable
            />
          </div>
          <div v-if="activeTab === 'course'" class="form-item">
            <label class="form-label">教员</label>
            <el-input
              v-model="searchForm.teacher"
              placeholder="请输入教员姓名"
              style="width: 200px"
              size="default"
              clearable
            />
          </div>

          <el-button type="primary" @click="handleSearch" size="default" class="btn-search">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            搜索
          </el-button>
          <el-button @click="handleReset" size="default" class="btn-reset">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            重置
          </el-button>
          <el-button @click="handleExport" size="default" class="btn-export">
            <img src="/icons/export.svg" alt="" class="btn-export-icon" />
            导出
          </el-button>
        </div>
      </div>

      <!-- 表格区域 -->
      <div class="table-section">
        <template v-if="hasData">
        <el-table
          v-if="activeTab === 'inspector'"
          :data="inspectorData"
          style="width: 100%"
          :header-cell-style="{
            background: 'rgba(255, 255, 255, 0.6)',
            color: 'rgba(0, 0, 0, 0.88)',
            fontSize: '14px',
            fontWeight: '500',
            height: '48px'
          }"
          :row-style="{ height: '64px' }"
        >
          <el-table-column prop="id" label="序号" width="110" />
          <el-table-column prop="name" label="巡课人" min-width="220" />
          <el-table-column prop="patrolCount" label="巡课次数" sortable min-width="180" />
          <el-table-column prop="courseCount" label="巡课课程数" sortable min-width="200" />
          <el-table-column prop="duration" label="巡课总时长" sortable min-width="220" />
          <el-table-column prop="evaluationCount" label="评价次数" sortable min-width="180" />
        </el-table>

        <el-table
          v-else
          :data="courseData"
          style="width: 100%"
          :header-cell-style="{
            background: 'rgba(255, 255, 255, 0.6)',
            color: 'rgba(0, 0, 0, 0.88)',
            fontSize: '14px',
            fontWeight: '500',
            height: '48px'
          }"
          :row-style="{ height: '64px' }"
        >
          <el-table-column prop="id" label="序号" width="110" />
          <el-table-column prop="course" label="课程" min-width="240" />
          <el-table-column prop="patrolCount" label="巡课次数" sortable min-width="180" />
          <el-table-column prop="inspectorCount" label="巡课人数" sortable min-width="180" />
          <el-table-column prop="duration" label="巡课总时长" sortable min-width="220" />
          <el-table-column prop="evaluationCount" label="评价次数" sortable min-width="180" />
        </el-table>
        </template>
        <div v-else class="empty-state">
          <img src="/empty-data.png" alt="" class="empty-icon" />
          <p class="empty-text">暂无数据</p>
        </div>
      </div>

      <!-- 分页区域 -->
      <div v-if="hasData" class="pagination-section">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[8, 16, 24, 40]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.patrol-data {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(190, 198, 223, 0.4);
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px 20px;
  margin-bottom: 20px;
}

.page-title {
  margin-right: 30px;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-filter-label {
  font-size: 14px;
  color: #191c1e;
  white-space: nowrap;
}

.custom-date-picker {
  width: 240px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #191c1e;
  line-height: 22px;
}

.date-tabs {
  display: flex;
  align-items: center;
  background: #ECF3FB;
  border-radius: 6px;
  padding: 4px;
  gap: 4px;
}

.date-tab {
  border: none;
  background: transparent;
  height: 28px;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 13px;
  color: #191c1e;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.date-tab:hover:not(.active) {
  color: #1947ff;
}

.date-tab.active {
  background: #ffffff;
  color: #1947ff;
  font-weight: 500;
  box-shadow: 0 1px 3px 0 rgba(0, 81, 233, 0.16);
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px 0 rgba(0, 49, 185, 0.04);
  height: 100px;
  padding: 20px 30px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon-img {
  width: 60px;
  height: 60px;
  flex: none;
  object-fit: contain;
  display: block;
}

.stat-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-value {
  font-size: 18px;
  font-weight: 500;
  color: #000000;
  line-height: 25px;
}

.stat-label {
  font-size: 12px;
  color: #000000;
  line-height: 17px;
}

.tab-bar {
  display: flex;
  align-items: center;
  gap: 50px;
  margin-bottom: 20px;
  padding-top: 4px;
}

.tab-btn {
  position: relative;
  border: none;
  background: transparent;
  padding: 0 0 12px;
  font-size: 16px;
  font-weight: 400;
  color: #191c1e;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.2s;
}

.tab-btn:hover:not(.active) {
  color: #1947ff;
}

.tab-btn.active {
  font-weight: 600;
  color: #000000;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 48px;
  height: 4px;
  background: #1947ff;
  border-radius: 2px;
  transform: translateX(-50%);
}

.search-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;
}

.search-form {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  flex: 1;
}

.form-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-label {
  font-size: 14px;
  color: #191c1e;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
}

.btn-export {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #191c1e;
  flex-shrink: 0;
}

.btn-export:hover {
  border-color: #1947ff;
  color: #1947ff;
}

.btn-search {
  flex-shrink: 0;
}

.btn-reset {
  flex-shrink: 0;
}

:deep(.btn-search) svg {
  color: #ffffff;
}

:deep(.btn-reset) svg,
:deep(.btn-export) svg {
  color: currentColor;
}

.btn-export-icon {
  width: 14px;
  height: 14px;
  margin-right: 6px;
  display: block;
}

:deep(.el-date-editor.custom-date-picker.el-range-editor) {
  width: 240px !important;
  height: 36px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: none;
  padding: 0 12px;
  box-sizing: border-box;
}

:deep(.el-date-editor.custom-date-picker.el-range-editor:hover) {
  border-color: #1947ff;
}

:deep(.el-date-editor.custom-date-picker.el-range-editor.is-active),
:deep(.el-date-editor.custom-date-picker.el-range-editor:focus-within) {
  border-color: #1947ff;
  box-shadow: 0 0 0 2px rgba(25, 71, 255, 0.1);
}

:deep(.custom-date-picker .el-range-input) {
  font-size: 14px;
  color: #000000;
  background: transparent;
}

:deep(.custom-date-picker .el-range-separator) {
  color: #000000;
  font-size: 14px;
  line-height: 34px;
  padding: 0 4px;
}

:deep(.custom-date-picker .el-input__prefix) {
  display: inline-flex;
  align-items: center;
  margin-right: 4px;
}

.table-section {
  flex: 1;
  overflow: hidden;
  border-radius: 8px;
}

.empty-state {
  min-height: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 60px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  display: block;
}

.empty-text {
  font-size: 14px;
  color: #191c1e;
  line-height: 20px;
  margin: 0;
}

.pagination-section {
  display: flex;
  justify-content: flex-end;
  padding: 20px 0;
}

:deep(.el-table) {
  background: transparent;
  font-size: 14px;
}

:deep(.el-table tr) {
  background: rgba(255, 255, 255, 0.01);
}

:deep(.el-table__body tr:hover > td) {
  background: rgba(255, 255, 255, 0.6) !important;
}

:deep(.el-table td) {
  border-bottom: 1px solid #e5e7eb;
  color: rgba(0, 0, 0, 0.88);
  font-weight: 500;
}

:deep(.el-table th) {
  border-bottom: 1px solid #e5e7eb;
}

:deep(.el-table .cell) {
  font-weight: 500;
}

:deep(.el-input__wrapper) {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: none;
  height: 40px;
}

:deep(.el-input__wrapper:hover) {
  border-color: #1947ff;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #1947ff;
  box-shadow: 0 0 0 2px rgba(25, 71, 255, 0.1);
}

:deep(.el-button) {
  height: 40px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 500;
}

:deep(.el-button--primary) {
  background: #1947ff;
  border-color: #1947ff;
  border-radius: 8px;
}

:deep(.el-button--primary:hover) {
  background: #0038e6;
  border-color: #0038e6;
}

:deep(.el-button:not(.el-button--primary)) {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #000000;
}

:deep(.el-button:not(.el-button--primary):hover) {
  border-color: #1947ff;
  color: #1947ff;
}

:deep(.el-pagination) {
  font-size: 14px;
  color: #606266;
}

:deep(.el-pagination .el-pager li.is-active) {
  color: #1947ff;
}

:deep(.el-pagination button:hover) {
  color: #1947ff;
}
</style>

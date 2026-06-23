<script setup lang="ts">
import { h, ref, reactive, computed, watchEffect } from 'vue'
import { ElMessage } from 'element-plus'

const DatePickerIcon = () =>
  h('img', {
    src: '/icons/date-picker.svg',
    alt: '',
    style: 'width:16px;height:16px;display:block',
  })

interface ReplayRow {
  id: number
  classroom: string
  course: string
  teachDate: string
  teacher: string
  device: string
}

const searchForm = reactive({
  teachDate: '',
  classroom: '',
  course: '',
})

const classroomOptions = [
  { label: '101-101', value: '101-101' },
  { label: '101-102', value: '101-102' },
  { label: '103-104', value: '103-104' },
  { label: '103-106', value: '103-106' },
  { label: '103-201', value: '103-201' },
  { label: '203-201', value: '203-201' },
  { label: 'A-101', value: 'A-101' },
  { label: 'B-305', value: 'B-305' },
]

const mockCourses = ['高等数学', '线性代数', '概率论与数理统计', '大学物理', '程序设计基础', '数据结构', '计算机网络', '人工智能基础', '机器学习', '数据库原理', '操作系统', '软件工程', '大学英语', '思想道德与法制']
const mockTeachers = ['刘教授', '张老师', '李教授', '王副教授', '陈教授', '赵老师', '何老师', '汪教授', '欧阳老师', '朱教授', '周老师', '吴教授']
const mockDevices = ['球机', '半球机', '枪机']

const generateMockData = (count: number): ReplayRow[] => {
  const data: ReplayRow[] = []
  for (let i = 1; i <= count; i++) {
    const day = Math.floor(Math.random() * 30) + 1

    data.push({
      id: i,
      classroom: `${classroomOptions[Math.floor(Math.random() * classroomOptions.length)].value}教室`,
      course: mockCourses[Math.floor(Math.random() * mockCourses.length)],
      teachDate: `2026-06-${String(day).padStart(2, '0')}`,
      teacher: mockTeachers[Math.floor(Math.random() * mockTeachers.length)],
      device: mockDevices[Math.floor(Math.random() * mockDevices.length)]
    })
  }
  return data.sort((a, b) => b.teachDate.localeCompare(a.teachDate))
}

const allTableData = ref<ReplayRow[]>(generateMockData(160))
const tableData = ref<ReplayRow[]>(allTableData.value.slice(0, 10))

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(160)

const hasData = computed(() => {
  const d = searchForm.teachDate
  if (!d) return true
  return d >= '2026-06-01' && d <= '2026-06-30'
})

const filteredData = computed(() => {
  let filtered = allTableData.value
  if (searchForm.teachDate) {
    filtered = filtered.filter(item => item.teachDate === searchForm.teachDate)
  }
  if (searchForm.classroom) {
    filtered = filtered.filter(item => item.classroom.includes(searchForm.classroom))
  }
  if (searchForm.course) {
    filtered = filtered.filter(item => item.course.includes(searchForm.course))
  }
  return filtered
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

watchEffect(() => {
  tableData.value = paginatedData.value
  total.value = filteredData.value.length
})

const handleSearch = () => {
  currentPage.value = 1
  console.log('搜索', searchForm)
}

const handleReset = () => {
  searchForm.teachDate = ''
  searchForm.classroom = ''
  searchForm.course = ''
  currentPage.value = 1
}

const handleReplay = (row: ReplayRow) => {
  emit('navigate-video', row)
}

const emit = defineEmits<{
  'navigate-video': [row: ReplayRow]
}>()

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
}
</script>

<template>
  <div class="teaching-replay">
    <div class="content-card">
      <h1 class="page-title">教学回看</h1>

      <!-- 搜索区域 -->
      <div class="search-section">
        <div class="search-form">
          <div class="form-item">
            <label class="form-label">授课日期</label>
            <el-date-picker
              v-model="searchForm.teachDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择"
              size="default"
              :prefix-icon="DatePickerIcon"
              class="custom-date-picker"
            />
          </div>

          <div class="form-item">
            <label class="form-label">教室</label>
            <el-select
              v-model="searchForm.classroom"
              placeholder="请选择"
              style="width: 240px"
              size="default"
              clearable
            >
              <el-option
                v-for="item in classroomOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

          <div class="form-item">
            <label class="form-label">课程名称</label>
            <el-input
              v-model="searchForm.course"
              placeholder="请输入课程名称"
              style="width: 240px"
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
        </div>
      </div>

      <!-- 表格区域 -->
      <div class="table-section">
        <el-table
          v-if="hasData"
          :data="tableData"
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
          <el-table-column prop="classroom" label="教室" width="220" />
          <el-table-column prop="course" label="课程" min-width="380" show-overflow-tooltip />
          <el-table-column prop="teachDate" label="授课日期" width="180" />
          <el-table-column prop="teacher" label="教员" width="180" />
          <el-table-column prop="device" label="设备" width="160" />
          <el-table-column label="操作" width="140" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link class="action-link" @click="handleReplay(row)">
                回看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
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
          :page-sizes="[10, 20, 50, 100]"
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
.teaching-replay {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #191c1e;
  line-height: 22px;
  margin-bottom: 20px;
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

.btn-search {
  flex-shrink: 0;
}

.btn-reset {
  flex-shrink: 0;
}

:deep(.btn-search) svg {
  color: #ffffff;
}

:deep(.btn-reset) svg {
  color: currentColor;
}

.action-link {
  font-size: 14px;
  color: #1947ff;
  padding: 0;
  height: auto;
}

.action-link:hover {
  color: #0038e6;
}

:deep(.el-date-editor.custom-date-picker.el-input) {
  width: 240px !important;
  height: 36px;
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

:deep(.el-button:not(.el-button--primary):not(.action-link)) {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #000000;
}

:deep(.el-button:not(.el-button--primary):not(.action-link):hover) {
  border-color: #1947ff;
  color: #1947ff;
}

:deep(.el-button.action-link) {
  height: auto;
  padding: 0;
  background: transparent;
  border: none;
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

:deep(.el-select) {
  height: 40px;
}

:deep(.el-select__wrapper) {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: none;
  height: 40px;
}

:deep(.el-select__wrapper:hover) {
  border-color: #1947ff;
}

:deep(.el-select__wrapper.is-focused) {
  border-color: #1947ff;
  box-shadow: 0 0 0 2px rgba(25, 71, 255, 0.1);
}
</style>

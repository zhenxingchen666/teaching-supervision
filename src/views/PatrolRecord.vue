<script setup lang="ts">
import { ref, reactive, computed, watchEffect } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface PatrolRecord {
  id: number
  course: string
  classroom: string
  instructor: string
  inspector: string
  duration: string
  createTime: string
  evaluated: boolean
}

const searchForm = reactive({
  course: '',
  classroom: '',
  inspector: '',
})

const classroomOptions = [
  { label: '101-101', value: '101-101' },
  { label: '103-104', value: '103-104' },
  { label: '103-106', value: '103-106' },
  { label: '203-201', value: '203-201' },
]

const mockCourses = ['大气探测学', '高等数学', '线性代数', '概率论与数理统计', '大学物理', '程序设计基础', '数据结构', '计算机网络', '人工智能基础', '机器学习', '数据库原理', '操作系统', '软件工程', '大学英语', '思想道德与法制']
const mockClassrooms = ['101-101', '101-102', '103-104', '103-106', '103-201', '203-201', '203-205', 'A-101', 'A-201', 'B-305']
const mockInstructors = ['刘教授', '张老师', '李教授', '王副教授', '陈教授', '赵老师', '何教授', '汪老师', '欧阳教授', '朱老师']
const mockInspectors = ['王教授', '李督导', '张主任', '赵督导', '陈主任', '刘督导', '周教授', '吴督导']

const generateMockData = (count: number): PatrolRecord[] => {
  const data: PatrolRecord[] = []
  for (let i = 1; i <= count; i++) {
    const day = Math.floor(Math.random() * 30) + 1
    const hour = Math.floor(Math.random() * 10) + 8
    const minute = Math.floor(Math.random() * 60)
    const durationHour = Math.floor(Math.random() * 2)
    const durationMin = Math.floor(Math.random() * 60)
    const durationSec = Math.floor(Math.random() * 60)

    data.push({
      id: i,
      course: mockCourses[Math.floor(Math.random() * mockCourses.length)],
      classroom: mockClassrooms[Math.floor(Math.random() * mockClassrooms.length)],
      instructor: mockInstructors[Math.floor(Math.random() * mockInstructors.length)],
      inspector: mockInspectors[Math.floor(Math.random() * mockInspectors.length)],
      duration: `${durationHour}时${durationMin}分${durationSec}秒`,
      createTime: `2026-06-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      evaluated: Math.random() > 0.4,
    })
  }
  return data.sort((a, b) => b.createTime.localeCompare(a.createTime))
}

const allTableData = ref<PatrolRecord[]>(generateMockData(150))
const tableData = ref<PatrolRecord[]>(allTableData.value.slice(0, 10))

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(150)

const filteredData = computed(() => {
  let filtered = allTableData.value
  if (searchForm.course) {
    filtered = filtered.filter(item => item.course.includes(searchForm.course))
  }
  if (searchForm.classroom) {
    filtered = filtered.filter(item => item.classroom === searchForm.classroom)
  }
  if (searchForm.inspector) {
    filtered = filtered.filter(item => item.inspector.includes(searchForm.inspector))
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
  searchForm.course = ''
  searchForm.classroom = ''
  searchForm.inspector = ''
  currentPage.value = 1
}

const handleExport = () => {
  ElMessage.success('导出功能开发中')
}

const handleEvaluate = (row: PatrolRecord) => {
  ElMessage.info(`进入在线评价：${row.course}`)
}

const handleView = (row: PatrolRecord) => {
  ElMessage.info(`查看巡课记录：${row.course}`)
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
}
</script>

<template>
  <div class="patrol-record">
    <div class="content-card">
      <h1 class="page-title">巡课记录</h1>

      <!-- 搜索区域 -->
      <div class="search-section">
        <div class="search-form">
          <div class="form-item">
            <label class="form-label">课程</label>
            <el-input
              v-model="searchForm.course"
              placeholder="请输入课程名称"
              style="width: 240px"
              size="default"
              clearable
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
            <label class="form-label">巡课人</label>
            <el-input
              v-model="searchForm.inspector"
              placeholder="请输入巡课人姓名"
              style="width: 200px"
              size="default"
              clearable
            />
          </div>

          <el-button type="primary" :icon="Search" @click="handleSearch" size="default">
            搜索
          </el-button>
          <el-button @click="handleReset" size="default" :icon="Refresh">
            重置
          </el-button>
          <el-button @click="handleExport" size="default" class="btn-export">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="12" x2="19" y2="12"/><polyline points="16 9 19 12 16 15"/></svg>
            导出
          </el-button>
        </div>
      </div>

      <!-- 表格区域 -->
      <div class="table-section">
        <el-table
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
          <el-table-column prop="course" label="课程" min-width="220" />
          <el-table-column prop="classroom" label="教室" width="160" />
          <el-table-column prop="instructor" label="教员" width="140" />
          <el-table-column prop="inspector" label="巡课人" width="140" />
          <el-table-column prop="duration" label="巡课时长" width="180" />
          <el-table-column prop="createTime" label="创建时间" width="200" />
          <el-table-column label="评价状态" width="140">
            <template #default="{ row }">
              <div class="status-cell">
                <span :class="['status-text', row.evaluated ? 'evaluated' : 'pending']">
                  {{ row.evaluated ? '已评价' : '待评价' }}
                </span>
                <span v-if="row.evaluated" class="status-play-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill="#1947FF"
                      d="M14.9987,2.5C17.2999,2.5,19.1653,4.3655,19.1653,6.6667L19.1653,13.3333C19.1653,15.6345,17.2999,17.5,14.9987,17.5L4.9987,17.5C2.6975,17.5,0.832,15.6345,0.832,13.3333L0.832,6.6667C0.832,4.3655,2.6975,2.5,4.9987,2.5L14.9987,2.5ZM7.4987,7.5L7.4987,12.5C7.4989,12.8,7.6604,13.0768,7.9215,13.2246C8.1826,13.3723,8.5030,13.3684,8.7604,13.2142L12.9270,10.7142C13.4655,10.3903,13.4655,9.6097,12.9270,9.2858L8.7604,6.7858C8.5030,6.6316,8.1826,6.6277,7.9215,6.7754C7.6604,6.9232,7.4989,7.2,7.4987,7.5Z"
                    />
                  </svg>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <div class="action-cell">
                <el-button
                  v-if="!row.evaluated"
                  type="primary"
                  link
                  @click="handleEvaluate(row)"
                >
                  在线评价
                </el-button>
                <el-button
                  v-else
                  type="primary"
                  link
                  @click="handleView(row)"
                >
                  查看
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页区域 -->
      <div class="pagination-section">
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
.patrol-record {
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

.table-section {
  flex: 1;
  overflow: hidden;
  border-radius: 8px;
}

.status-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-text {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}

.status-text.pending {
  color: #191c1e;
}

.status-text.evaluated {
  color: rgba(0, 0, 0, 0.5);
}

.status-play-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.action-cell {
  display: flex;
  gap: 16px;
  align-items: center;
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

:deep(.el-button.is-link) {
  border: none;
  background: transparent;
  padding: 0;
  height: auto;
  font-weight: 500;
}

:deep(.el-button--primary.is-link) {
  color: #1947ff;
}

:deep(.el-button--primary.is-link:hover) {
  color: #0038e6;
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

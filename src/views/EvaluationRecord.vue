<script setup lang="ts">
import { ref, reactive, computed, watchEffect } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import EvaluationDetailDialog, { type EvaluationDetail } from '../components/EvaluationDetailDialog.vue'

interface Record {
  id: number
  course: string
  instructor: string
  classroom: string
  evaluator: string
  template: string
  category: string
  score: number
  duration: string
  createTime: string
}

interface IndicatorItem {
  label: string
  selected: '优' | '良' | '中'
}

interface IndicatorGroup {
  title: string
  items: IndicatorItem[]
}

// 搜索表单
const searchForm = reactive({
  template: '',
  classroom: ''
})

// 评价模板选项
const templateOptions = [
  { label: '本科课堂教学质量评估表', value: '本科课堂教学质量评估表' },
  { label: '实验课教学质量评估表', value: '实验课教学质量评估表' },
  { label: '研究生课堂教学质量评估表', value: '研究生课堂教学质量评估表' }
]

// 教室选项
const classroomOptions = [
  { label: '教学楼A101', value: '教学楼A101' },
  { label: '实验楼B205', value: '实验楼B205' },
  { label: '教学楼C302', value: '教学楼C302' }
]

const mockCourses = ['高等数学A', '线性代数', '概率论与数理统计', '大学物理', '程序设计基础', '数据结构', '计算机网络', '人工智能基础', '机器学习', '数据库原理', '操作系统', '软件工程', '大学英语', '思想道德与法制', '数字电路', '模拟电路']
const mockInstructors = ['张教授', '王老师', '刘教授', '李副教授', '陈教授', '赵老师', '何教授', '汪老师', '欧阳教授', '朱老师', '周副教授', '吴老师']
const mockClassrooms = ['教学楼A101', '教学楼A201', '实验楼B205', '实验楼B301', '教学楼C302', '教学楼C401', '智慧教室D101', '智慧教室D202']
const mockEvaluators = ['李督导', '赵主任', '陈督导', '王教授', '张主任', '刘督导', '周教授', '吴督导']
const mockTemplates = ['本科课堂教学质量评估表', '实验课教学质量评估表', '研究生课堂教学质量评估表']
const mockCategories = ['督导专家', '同行评议', '学生评教', '领导听课']

const generateMockData = (count: number): Record[] => {
  const data: Record[] = []
  for (let i = 1; i <= count; i++) {
    const day = Math.floor(Math.random() * 30) + 1
    const hour = Math.floor(Math.random() * 10) + 8
    const minute = Math.floor(Math.random() * 60)
    const durationMin = Math.floor(Math.random() * 45) + 30
    const durationSec = Math.floor(Math.random() * 60)

    data.push({
      id: i,
      course: mockCourses[Math.floor(Math.random() * mockCourses.length)],
      instructor: mockInstructors[Math.floor(Math.random() * mockInstructors.length)],
      classroom: mockClassrooms[Math.floor(Math.random() * mockClassrooms.length)],
      evaluator: mockEvaluators[Math.floor(Math.random() * mockEvaluators.length)],
      template: mockTemplates[Math.floor(Math.random() * mockTemplates.length)],
      category: mockCategories[Math.floor(Math.random() * mockCategories.length)],
      score: Math.floor(Math.random() * 20) + 80,
      duration: `${durationMin}:${String(durationSec).padStart(2, '0')}`,
      createTime: `2026-06-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    })
  }
  return data.sort((a, b) => b.createTime.localeCompare(a.createTime))
}

const allTableData = ref<Record[]>(generateMockData(200))
const tableData = ref<Record[]>(allTableData.value.slice(0, 10))

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(200)

const filteredData = computed(() => {
  let filtered = allTableData.value
  if (searchForm.template) {
    filtered = filtered.filter(item => item.template === searchForm.template)
  }
  if (searchForm.classroom) {
    filtered = filtered.filter(item => item.classroom === searchForm.classroom)
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

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  console.log('搜索', searchForm)
}

// 重置
const handleReset = () => {
  searchForm.template = ''
  searchForm.classroom = ''
  currentPage.value = 1
}

// 导出
const handleExport = () => {
  ElMessage.success('导出功能开发中')
}

// 查看
const detailVisible = ref(false)
const currentDetail = ref<EvaluationDetail | null>(null)

const defaultGroups: IndicatorGroup[] = [
  {
    title: '答疑及考核',
    items: [
      { label: '耐心示范答疑，注重对学员学习过程的考核：', selected: '优' },
    ],
  },
  {
    title: '教学内容及准备',
    items: [
      { label: '教学内容充实：', selected: '优' },
      { label: '教学内容与理论知识有机结合：', selected: '优' },
    ],
  },
]

const handleView = (row: Record) => {
  currentDetail.value = {
    course: row.course,
    evaluatee: row.instructor,
    evaluator: row.evaluator,
    evaluateTime: row.createTime,
    excellent: 3,
    good: 0,
    medium: 0,
    total: 91.25,
    groups: defaultGroups,
  }
  detailVisible.value = true
}

// 分页改变
const handlePageChange = (page: number) => {
  currentPage.value = page
  console.log('切换页码', page)
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  console.log('改变每页条数', size)
}
</script>

<template>
  <div class="evaluation-record">
    <div class="content-card">
      <h1 class="page-title">评价记录</h1>

      <!-- 搜索区域 -->
      <div class="search-section">
        <div class="search-form">
          <div class="form-item">
            <label class="form-label">评价模板</label>
            <el-select
              v-model="searchForm.template"
              placeholder="请选择"
              style="width: 240px"
              size="default"
              clearable
            >
              <el-option
                v-for="item in templateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

          <div class="form-item">
            <label class="form-label">教室</label>
            <el-select
              v-model="searchForm.classroom"
              placeholder="请选择"
              style="width: 200px"
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

          <el-button type="primary" :icon="Search" @click="handleSearch" size="default">
            搜索
          </el-button>
          <el-button @click="handleReset" size="default">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px"><path d="M3 12a9 9 0 1 0 2.83-6.36L3 8"/><path d="M3 3v5h5"/></svg>
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
          <el-table-column prop="course" label="课程" min-width="150" />
          <el-table-column prop="instructor" label="教员" width="120" />
          <el-table-column prop="classroom" label="教室" width="150" />
          <el-table-column prop="evaluator" label="评价人" width="120" />
          <el-table-column prop="template" label="评价模板" min-width="200" />
          <el-table-column prop="category" label="评价类型" width="120" />
          <el-table-column prop="score" label="评分" width="100">
            <template #default="{ row }">
              <span class="score-text">{{ row.score }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="duration" label="观看时长" width="120" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <div class="action-cell">
                <el-button
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

    <!-- 评价结果详情弹窗 -->
    <EvaluationDetailDialog
      v-model:visible="detailVisible"
      :detail="currentDetail"
    />
  </div>
</template>

<style scoped>
.evaluation-record {
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
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 16px;
}

.search-form {
  display: flex;
  align-items: center;
  gap: 16px;
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

.action-cell {
  display: flex;
  gap: 20px;
  align-items: center;
}

.score-text {
  font-size: 14px;
  font-weight: 600;
  color: #1947ff;
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
</style>

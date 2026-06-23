<script setup lang="ts">
import { ref, reactive, computed, watchEffect } from 'vue'
import { ElMessage } from 'element-plus'

interface MessageRow {
  id: number
  name: string
  unit: string
  classroom: string
  course: string
  teacher: string
  content: string
  createTime: string
}

const searchForm = reactive({
  name: '',
  classroom: '',
  course: '',
  teacher: '',
})

const classroomOptions = [
  { label: '101-101', value: '101-101' },
  { label: '103-104', value: '103-104' },
  { label: '103-106', value: '103-106' },
  { label: '203-201', value: '203-201' },
]

const mockNames = ['王教授', '李主任', '张老师', '赵教授', '陈督导', '刘老师', '周教授', '吴主任', '欧阳教授', '朱老师', '何教授', '汪老师']
const mockUnits = ['气象海洋学院', '计算机学院', '数学学院', '物理学院', '外语学院', '马克思学院', '化学学院', '生物学院', '经济学院', '管理学院']
const mockClassrooms = ['101-101', '101-102', '103-104', '103-106', '103-201', '203-201', '203-205', 'A-101', 'A-201', 'B-305']
const mockCourses = ['海洋天气学', '大气探测学', '高等数学', '线性代数', '概率论与数理统计', '大学物理', '程序设计基础', '数据结构', '计算机网络', '人工智能基础', '机器学习', '数据库原理', '操作系统', '大学英语', '思想道德与法制']
const mockTeachers = ['刘教授', '张老师', '李教授', '王副教授', '陈教授', '赵老师', '何老师', '汪教授', '欧阳老师', '朱教授']
const mockContents = [
  '教学内容充实，逻辑清晰，重点突出，深入浅出，很好地调动了学生的学习积极性。',
  '授课认真负责，教学方法灵活多样，能够理论联系实际，注重培养学生的创新思维能力。',
  '课堂气氛活跃，师生互动良好，教学效果显著，学生反映良好。',
  '教学准备充分，PPT制作精美，板书工整规范，讲解清晰明了。',
  '能够结合最新的科研成果和实际案例进行教学，拓宽了学生的视野。',
  '教学态度严谨，对学生要求严格，注重基础知识的讲解和能力的培养。',
  '讲课生动有趣，善于启发学生思考，培养学生分析问题和解决问题的能力。',
  '教学方法得当，能够根据学生的实际情况调整教学进度和难度。',
  '课堂组织有序，时间安排合理，教学环节设计科学，教学目标明确。',
  '注重理论与实践相结合，实验教学组织严密，指导学生认真细致。',
  '评价内容评价内容评价内容评价内容评价内容评价内容评价内容评价内容。',
  '评价内容评价内容，评价内容评价内容评价内容评价内容评价，内容评价内容评价内容评价内容评价内容，评价内容评价内容评价内容评价内容评价内容评价内容评价内容评价内容评价内容评价内容。'
]

const generateMockData = (count: number): MessageRow[] => {
  const data: MessageRow[] = []
  for (let i = 1; i <= count; i++) {
    const day = Math.floor(Math.random() * 30) + 1
    const hour = Math.floor(Math.random() * 10) + 8
    const minute = Math.floor(Math.random() * 60)

    data.push({
      id: i,
      name: mockNames[Math.floor(Math.random() * mockNames.length)],
      unit: mockUnits[Math.floor(Math.random() * mockUnits.length)],
      classroom: mockClassrooms[Math.floor(Math.random() * mockClassrooms.length)],
      course: mockCourses[Math.floor(Math.random() * mockCourses.length)],
      teacher: mockTeachers[Math.floor(Math.random() * mockTeachers.length)],
      content: mockContents[Math.floor(Math.random() * mockContents.length)],
      createTime: `2026-06-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    })
  }
  return data.sort((a, b) => b.createTime.localeCompare(a.createTime))
}

const allTableData = ref<MessageRow[]>(generateMockData(180))
const tableData = ref<MessageRow[]>(allTableData.value.slice(0, 10))

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(180)

const filteredData = computed(() => {
  let filtered = allTableData.value
  if (searchForm.name) {
    filtered = filtered.filter(item => item.name.includes(searchForm.name))
  }
  if (searchForm.classroom) {
    filtered = filtered.filter(item => item.classroom === searchForm.classroom)
  }
  if (searchForm.course) {
    filtered = filtered.filter(item => item.course.includes(searchForm.course))
  }
  if (searchForm.teacher) {
    filtered = filtered.filter(item => item.teacher.includes(searchForm.teacher))
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
  searchForm.name = ''
  searchForm.classroom = ''
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
</script>

<template>
  <div class="message-record">
    <div class="content-card">
      <h1 class="page-title">留言记录</h1>

      <!-- 搜索区域 -->
      <div class="search-section">
        <div class="search-form">
          <div class="form-item">
            <label class="form-label">留言人</label>
            <el-input
              v-model="searchForm.name"
              placeholder="请输入留言人姓名"
              style="width: 140px"
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
            <label class="form-label">留言课程</label>
            <el-input
              v-model="searchForm.course"
              placeholder="请输入课程名称"
              style="width: 240px"
              size="default"
              clearable
            />
          </div>

          <div class="form-item">
            <label class="form-label">教员</label>
            <el-input
              v-model="searchForm.teacher"
              placeholder="请输入教员姓名"
              style="width: 140px"
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
          <el-table-column prop="name" label="留言人" width="130" />
          <el-table-column prop="unit" label="单位" width="200" />
          <el-table-column prop="classroom" label="教室" width="150" />
          <el-table-column prop="course" label="留言课程" width="200" />
          <el-table-column prop="teacher" label="教员" width="130" />
          <el-table-column
            prop="content"
            label="内容"
            min-width="380"
            show-overflow-tooltip
          />
          <el-table-column prop="createTime" label="留言时间" width="180" />
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
.message-record {
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

.table-section {
  flex: 1;
  overflow: hidden;
  border-radius: 8px;
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

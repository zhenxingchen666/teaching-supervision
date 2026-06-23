<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import TemplateAdd from './TemplateAdd.vue'

interface Template {
  id: number
  name: string
  category: string
  createTime: string
  updateTime: string
  status: 'enabled' | 'disabled'
}

// 当前视图：list-列表页, add-新增页
const currentView = ref<'list' | 'add'>('list')

// 搜索表单
const searchForm = reactive({
  category: '',
  name: ''
})

// 分类选项
const categoryOptions = [
  { label: '督导专家', value: '督导专家' },
  { label: '学生评教', value: '学生评教' },
  { label: '同行评议', value: '同行评议' }
]

// 表格数据
const tableData = ref<Template[]>([
  {
    id: 1,
    name: '研究生课堂教学质量评估（军体野外教学）',
    category: '督导专家',
    createTime: '2026-04-14 17:05',
    updateTime: '--',
    status: 'enabled'
  },
  {
    id: 2,
    name: '研究生课堂教学质量评估（高等数学）',
    category: '督导专家',
    createTime: '2026-04-14 15:05',
    updateTime: '2026-04-14 17:05',
    status: 'enabled'
  },
  {
    id: 3,
    name: '研究生课堂教学质量评估（高等数学）',
    category: '督导专家',
    createTime: '2026-04-14 13:05',
    updateTime: '2026-04-14 17:05',
    status: 'disabled'
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(800)

// 搜索
const handleSearch = () => {
  console.log('搜索', searchForm)
  ElMessage.success('搜索功能开发中')
}

// 重置
const handleReset = () => {
  searchForm.category = ''
  searchForm.name = ''
  ElMessage.info('已重置搜索条件')
}

// 新增
const handleAdd = () => {
  currentView.value = 'add'
}

// 返回列表
const handleBackToList = () => {
  currentView.value = 'list'
}

// 查看
const handleView = (row: Template) => {
  console.log('查看', row)
  ElMessage.info(`查看模板: ${row.name}`)
}

// 启用/禁用
const handleToggleStatus = (row: Template) => {
  const action = row.status === 'enabled' ? '禁用' : '启用'
  ElMessageBox.confirm(
    `确定要${action}该模板吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    row.status = row.status === 'enabled' ? 'disabled' : 'enabled'
    ElMessage.success(`${action}成功`)
  }).catch(() => {
    ElMessage.info(`已取消${action}`)
  })
}

// 删除
const handleDelete = (row: Template) => {
  ElMessageBox.confirm(
    '确定要删除该模板吗？删除后不可恢复',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
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
  <div class="template-management">
    <!-- 列表页 -->
    <div v-if="currentView === 'list'" class="content-card">
      <h1 class="page-title">模板管理</h1>

      <!-- 搜索区域 -->
      <div class="search-section">
        <el-button type="primary" :icon="Plus" @click="handleAdd" size="default">
          新增
        </el-button>

        <div class="search-form">
          <div class="form-item">
            <label class="form-label">所属分类</label>
            <el-select
              v-model="searchForm.category"
              placeholder="请选择"
              style="width: 200px"
              size="default"
              clearable
            >
              <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

          <el-input
            v-model="searchForm.name"
            placeholder="请输入模板名称"
            style="width: 280px"
            size="default"
            clearable
          />

          <el-button type="primary" :icon="Search" @click="handleSearch" size="default">
            搜索
          </el-button>
          <el-button :icon="Refresh" @click="handleReset" size="default">
            重置
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
        <el-table-column prop="name" label="模板名称" width="590" />
        <el-table-column prop="category" label="所属分类" width="240" />
        <el-table-column prop="createTime" label="创建时间" width="200" />
        <el-table-column prop="updateTime" label="修改时间" width="200" />
        <el-table-column label="状态" width="190">
          <template #default="{ row }">
            <div class="status-cell">
              <span :class="['status-dot', row.status]"></span>
              <span :class="['status-text', row.status]">
                {{ row.status === 'enabled' ? '已启用' : '已禁用' }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190">
          <template #default="{ row }">
            <div class="action-cell">
              <el-button
                type="primary"
                link
                @click="handleView(row)"
              >
                查看
              </el-button>
              <el-button
                type="warning"
                link
                @click="handleToggleStatus(row)"
              >
                {{ row.status === 'enabled' ? '禁用' : '启用' }}
              </el-button>
              <el-button
                type="danger"
                link
                @click="handleDelete(row)"
              >
                删除
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

    <!-- 新增页 -->
    <TemplateAdd v-else-if="currentView === 'add'" @back="handleBackToList" />
  </div>
</template>

<style scoped>
.template-management {
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

.table-section {
  flex: 1;
  overflow: hidden;
  border-radius: 8px;
}

.status-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.enabled {
  background: #369d00;
}

.status-dot.disabled {
  background: rgba(0, 0, 0, 0.3);
}

.status-text {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}

.status-text.enabled {
  color: #369d00;
}

.status-text.disabled {
  color: rgba(0, 0, 0, 0.5);
}

.action-cell {
  display: flex;
  gap: 20px;
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

:deep(.el-button--warning.is-link) {
  color: #ff9c00;
}

:deep(.el-button--warning.is-link:hover) {
  color: #e68a00;
}

:deep(.el-button--danger.is-link) {
  color: #f52f3e;
}

:deep(.el-button--danger.is-link:hover) {
  color: #dc2835;
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

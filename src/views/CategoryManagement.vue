<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import CategoryAddDialog from '../components/CategoryAddDialog.vue'

interface Category {
  id: number
  name: string
  userGroup: string
  createTime: string
  updateTime: string
  status: 'enabled' | 'disabled'
}

// 搜索表单
const searchForm = reactive({
  name: ''
})

// 表格数据
const tableData = ref<Category[]>([
  {
    id: 1,
    name: '督导专家',
    userGroup: '管理员',
    createTime: '2026-04-14 17:05',
    updateTime: '--',
    status: 'enabled'
  },
  {
    id: 2,
    name: '学生评教',
    userGroup: '学生',
    createTime: '2026-04-14 15:05',
    updateTime: '2026-04-14 17:05',
    status: 'enabled'
  },
  {
    id: 3,
    name: '同行评议',
    userGroup: '教师',
    createTime: '2026-04-14 13:05',
    updateTime: '2026-04-14 17:05',
    status: 'disabled'
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(800)

// 新增对话框
const addDialogVisible = ref(false)

// 查看对话框
const viewDialogVisible = ref(false)
const dialogTitle = ref('查看分类')
const viewData = ref<Category | null>(null)

// 搜索
const handleSearch = () => {
  console.log('搜索', searchForm)
  ElMessage.success('搜索功能开发中')
}

// 重置
const handleReset = () => {
  searchForm.name = ''
  ElMessage.info('已重置搜索条件')
}

// 新增
const handleAdd = () => {
  addDialogVisible.value = true
}

// 新增提交
const handleAddSubmit = (payload: { name: string; userGroup: string; status: string }) => {
  const newCategory: Category = {
    id: Date.now(),
    name: payload.name,
    userGroup: payload.userGroup,
    createTime: new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\//g, '-'),
    updateTime: '--',
    status: payload.status as 'enabled' | 'disabled'
  }
  tableData.value.unshift(newCategory)
  ElMessage.success('新增成功')
}

// 查看
const handleView = (row: Category) => {
  dialogTitle.value = '查看分类'
  viewData.value = row
  viewDialogVisible.value = true
}

// 启用/禁用
const handleToggleStatus = (row: Category) => {
  const action = row.status === 'enabled' ? '禁用' : '启用'
  ElMessageBox.confirm(
    `确定要${action}该分类吗？`,
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
const handleDelete = (row: Category) => {
  ElMessageBox.confirm(
    '确定要删除该分类吗？删除后不可恢复',
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
  <div class="category-management">
    <div class="content-card">
      <h1 class="page-title">分类管理</h1>

      <!-- 搜索区域 -->
      <div class="search-section">
        <el-button type="primary" :icon="Plus" @click="handleAdd" size="default">
          新增
        </el-button>

        <div class="search-form">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入类型名称"
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
          <el-table-column prop="name" label="类型名称" width="590" />
          <el-table-column prop="userGroup" label="用户组" width="240" />
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
                  :type="row.status === 'enabled' ? 'warning' : 'primary'"
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

    <!-- 新增对话框 -->
    <CategoryAddDialog
      v-model:visible="addDialogVisible"
      @submit="handleAddSubmit"
    />

    <!-- 查看对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form v-if="viewData" label-width="100px">
        <el-form-item label="类型名称">
          <span>{{ viewData.name }}</span>
        </el-form-item>
        <el-form-item label="用户组">
          <span>{{ viewData.userGroup }}</span>
        </el-form-item>
        <el-form-item label="创建时间">
          <span>{{ viewData.createTime }}</span>
        </el-form-item>
        <el-form-item label="修改时间">
          <span>{{ viewData.updateTime }}</span>
        </el-form-item>
        <el-form-item label="状态">
          <div class="status-cell">
            <span :class="['status-dot', viewData.status]"></span>
            <span :class="['status-text', viewData.status]">
              {{ viewData.status === 'enabled' ? '已启用' : '已禁用' }}
            </span>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="viewDialogVisible = false" size="default">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.category-management {
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

:deep(.el-dialog) {
  border-radius: 8px;
}

:deep(.el-dialog__header) {
  padding: 20px 20px 10px;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #191c1e;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-dialog__footer) {
  padding: 10px 20px 20px;
}

:deep(.el-form-item__label) {
  font-size: 14px;
  font-weight: 500;
  color: #191c1e;
}

:deep(.el-textarea__inner) {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-family: inherit;
}

:deep(.el-textarea__inner:hover) {
  border-color: #1947ff;
}

:deep(.el-textarea__inner:focus) {
  border-color: #1947ff;
  box-shadow: 0 0 0 2px rgba(25, 71, 255, 0.1);
}
</style>

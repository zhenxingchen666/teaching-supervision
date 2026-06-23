<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ArrowLeft, Plus, Promotion, Delete, CirclePlus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits<{
  (e: 'back'): void
}>()

// 表单数据
const formData = reactive({
  name: '',
  category: '',
  optionTable: '',
  status: 'enabled',
  indicators: [] as IndicatorItem[]
})

interface IndicatorItem {
  id: number
  items: EvaluationItem[]
}

interface EvaluationItem {
  id: number
  indicator: string
  content: string
  weight: string
  weightUnit: '值' | '百分比'
}

// 分类选项
const categoryOptions = [
  { label: '督导专家', value: '督导专家' },
  { label: '学生评教', value: '学生评教' },
  { label: '同行评议', value: '同行评议' }
]

// 选项表选项
const optionTableOptions = [
  { label: '选项表1', value: '选项表1' },
  { label: '选项表2', value: '选项表2' }
]

// 评价指标选项
const indicatorOptions = [
  { label: '教学态度', value: '教学态度' },
  { label: '教学内容', value: '教学内容' },
  { label: '教学方法', value: '教学方法' },
  { label: '教学效果', value: '教学效果' }
]

let indicatorIdCounter = 1
let itemIdCounter = 1

// 添加评价指标（添加一个新的白色卡片）
const addIndicator = () => {
  formData.indicators.push({
    id: indicatorIdCounter++,
    items: [
      {
        id: itemIdCounter++,
        indicator: '',
        content: '',
        weight: '',
        weightUnit: '值'
      }
    ]
  })
}

// 删除评价指标（删除整个白色卡片）
const removeIndicator = (index: number) => {
  formData.indicators.splice(index, 1)
}

// 添加评价项目（在白色卡片内添加新的灰色组）
const addEvaluationItem = (indicator: IndicatorItem) => {
  indicator.items.push({
    id: itemIdCounter++,
    indicator: '',
    content: '',
    weight: '',
    weightUnit: '值'
  })
}

// 返回
const handleBack = () => {
  emit('back')
}

// 发布
const handlePublish = () => {
  // 验证必填项
  if (!formData.name) {
    ElMessage.error('请输入模板名称')
    return
  }
  if (!formData.category) {
    ElMessage.error('请选择所属分类')
    return
  }
  if (!formData.optionTable) {
    ElMessage.error('请选择关联选项表')
    return
  }
  if (formData.indicators.length === 0) {
    ElMessage.error('请至少添加一个评价指标')
    return
  }

  // 验证每个指标
  for (const indicator of formData.indicators) {
    if (indicator.items.length === 0) {
      ElMessage.error('每个评价指标至少需要一个评价项目')
      return
    }
    for (const item of indicator.items) {
      if (!item.indicator) {
        ElMessage.error('请选择评价指标')
        return
      }
      if (!item.content) {
        ElMessage.error('请输入评价项目内容')
        return
      }
      if (!item.weight) {
        ElMessage.error('请输入权重')
        return
      }
    }
  }

  console.log('发布模板', formData)
  ElMessage.success('发布成功')
  handleBack()
}
</script>

<template>
  <div class="template-add">
    <div class="content-wrapper">
      <div class="content-card">
        <!-- 页面头部 -->
        <div class="page-header">
          <div class="back-button" @click="handleBack">
            <el-icon><ArrowLeft /></el-icon>
            <span>返回</span>
          </div>
          <span class="divider">｜</span>
          <span class="page-title">新增模板</span>
        </div>

        <!-- 表单区域 -->
        <div class="form-section">
          <!-- 模板名称 -->
          <div class="form-row">
            <label class="form-label required">模板名称</label>
            <el-input
              v-model="formData.name"
              placeholder="请输入"
              class="form-input"
            />
          </div>

          <!-- 所属分类 -->
          <div class="form-row">
            <label class="form-label required">所属分类</label>
            <el-select
              v-model="formData.category"
              placeholder="请选择"
              class="form-input"
            >
              <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

          <!-- 关联选项表 -->
          <div class="form-row">
            <label class="form-label required">关联选项表</label>
            <el-select
              v-model="formData.optionTable"
              placeholder="请选择"
              class="form-input"
            >
              <el-option
                v-for="item in optionTableOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

          <!-- 评价指标与项目 -->
          <div class="form-row indicators-row">
            <label class="form-label required">评价指标与项目</label>
            <div class="indicators-list">
              <!-- 每个评价指标是一个白色卡片 -->
              <div
                v-for="(indicator, index) in formData.indicators"
                :key="indicator.id"
                class="indicator-card"
              >
                <!-- 白色卡片标题 -->
                <div class="card-header">
                  <span class="card-title">评价指标{{ index + 1 }}</span>
                  <!-- 删除按钮 -->
                  <div
                    class="delete-indicator-btn"
                    @click="removeIndicator(index)"
                  >
                    <el-icon><Delete /></el-icon>
                  </div>
                </div>

                <!-- 白色卡片内的灰色组列表 -->
                <div
                  v-for="(item, itemIndex) in indicator.items"
                  :key="item.id"
                  class="indicator-group-wrapper"
                >
                  <!-- 指标标题行 -->
                  <div class="indicator-group-header">
                    <div class="blue-bar"></div>
                    <span class="group-title">评价指标</span>
                  </div>

                  <!-- 灰色卡片 -->
                  <div class="indicator-group">
                    <!-- 评价指标 -->
                    <div class="indicator-field">
                      <label class="field-label required">评价指标</label>
                      <el-select
                        v-model="item.indicator"
                        placeholder="请选择"
                        class="field-input"
                      >
                        <el-option
                          v-for="opt in indicatorOptions"
                          :key="opt.value"
                          :label="opt.label"
                          :value="opt.value"
                        />
                      </el-select>
                    </div>

                    <!-- 评价项目 -->
                    <div class="indicator-field">
                      <label class="field-label required">评价项目</label>
                      <el-input
                        v-model="item.content"
                        placeholder="请输入"
                        type="textarea"
                        :rows="3"
                        class="field-input"
                      />
                    </div>

                    <!-- 权重 -->
                    <div class="indicator-field weight-field">
                      <label class="field-label required">权重</label>
                      <div class="weight-inputs">
                        <el-input
                          v-model="item.weight"
                          placeholder="请输入"
                          style="width: 120px"
                        />
                        <el-select
                          v-model="item.weightUnit"
                          style="width: 100px"
                        >
                          <el-option label="值" value="值" />
                          <el-option label="百分比" value="百分比" />
                        </el-select>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 添加项目按钮（在白色卡片内） -->
                <el-button
                  class="add-item-btn"
                  @click="addEvaluationItem(indicator)"
                >
                  <el-icon><Plus /></el-icon>
                  添加项目
                </el-button>
              </div>

              <!-- 添加评价指标按钮 -->
              <el-button
                class="add-indicator-btn"
                @click="addIndicator"
              >
                <el-icon><CirclePlus /></el-icon>
                添加评价指标
              </el-button>
            </div>
          </div>

          <!-- 模板状态 -->
          <div class="form-row">
            <label class="form-label required">模板状态</label>
            <el-radio-group v-model="formData.status">
              <el-radio value="enabled">开启</el-radio>
              <el-radio value="disabled">禁用</el-radio>
            </el-radio-group>
          </div>
        </div>

        <!-- 底部操作 -->
        <div class="form-actions">
          <el-button type="primary" size="large" @click="handlePublish">
            <el-icon><Promotion /></el-icon>
            发布
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.template-add {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
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
  padding: 30px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 30px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 16px;
  color: #191c1e;
  line-height: 24px;
  transition: color 0.2s;
}

.back-button:hover {
  color: #1947ff;
}

.divider {
  color: #191c1e;
  font-size: 16px;
  line-height: 24px;
}

.page-title {
  font-size: 16px;
  font-weight: 400;
  color: #191c1e;
  line-height: 24px;
}

.form-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 460px;
}

.form-label {
  font-size: 14px;
  color: #191c1e;
  font-weight: 500;
  line-height: 20px;
}

.form-label.required::before {
  content: '*';
  color: #f52f3e;
  margin-right: 4px;
}

.form-input {
  width: 100%;
}

/* 评价指标与项目区域 */
.indicators-row {
  flex: 1;
  width: 100%;
  max-width: 460px;
}

.indicators-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 每个评价指标的白色卡片 */
.indicator-card {
  width: 100%;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
}

/* 白色卡片标题 */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  color: #191c1e;
  line-height: 24px;
}

/* 指标组包装器 */
.indicator-group-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 指标标题行（蓝色条 + 文字 + 删除按钮） */
.indicator-group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  min-height: 24px;
}

/* 蓝色条 */
.blue-bar {
  width: 4px;
  height: 16px;
  background: #1947ff;
  border-radius: 2px;
  flex-shrink: 0;
}

/* 指标标题文字 */
.group-title {
  font-size: 14px;
  font-weight: 500;
  color: #191c1e;
  line-height: 20px;
}

/* 删除评价指标按钮（在白色卡片标题右侧） */
.delete-indicator-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #f52f3e;
  opacity: 0;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.indicator-card:hover .delete-indicator-btn {
  opacity: 1;
}

.delete-indicator-btn:hover {
  background: rgba(245, 47, 62, 0.1);
  border-radius: 4px;
}

.delete-indicator-btn .el-icon {
  font-size: 20px;
}

/* 灰色组（评价指标 + 评价项目 + 权重） */
.indicator-group {
  background: #f5f6fa;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.indicator-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 14px;
  color: #262626;
  line-height: 20px;
}

.field-label.required::before {
  content: '*';
  color: #f52f3e;
  margin-right: 4px;
}

.field-input {
  width: 100%;
}

.weight-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.weight-inputs {
  display: flex;
  align-items: center;
  gap: 12px;
}

.add-item-btn {
  width: 100%;
  height: 40px;
  background: #ffffff;
  border: 1px dashed rgba(1, 1, 1, 0.2);
  border-radius: 8px;
  color: #000000;
}

.add-item-btn:hover {
  border-color: #1947ff;
  color: #1947ff;
}

.add-indicator-btn {
  width: 100%;
  height: 40px;
  background: #e1ecff !important;
  border: 1px dashed #1947ff !important;
  border-radius: 8px;
  color: #1947ff !important;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.add-indicator-btn:hover {
  background: #d0e1ff !important;
  border-color: #1947ff !important;
}

.add-indicator-btn .el-icon {
  font-size: 16px;
  color: #1947ff !important;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

:deep(.el-input__wrapper) {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: none;
}

:deep(.el-input__wrapper:hover) {
  border-color: #1947ff;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #1947ff;
  box-shadow: 0 0 0 2px rgba(25, 71, 255, 0.1);
}

:deep(.el-select__wrapper) {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: none;
}

:deep(.el-select__wrapper:hover) {
  border-color: #1947ff;
}

:deep(.el-select__wrapper.is-focused) {
  border-color: #1947ff;
  box-shadow: 0 0 0 2px rgba(25, 71, 255, 0.1);
}

:deep(.el-textarea__inner) {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

:deep(.el-textarea__inner:hover) {
  border-color: #1947ff;
}

:deep(.el-textarea__inner:focus) {
  border-color: #1947ff;
  box-shadow: 0 0 0 2px rgba(25, 71, 255, 0.1);
}

:deep(.el-radio-group) {
  display: flex;
  gap: 32px;
}

:deep(.el-radio) {
  margin-right: 0;
}
</style>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Close } from '@element-plus/icons-vue'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'submit', payload: { name: string; userGroup: string; status: string }): void
}>()

const categoryName = ref('')
const userGroup = ref('')
const status = ref('enabled')

const userGroupOptions = [
  { value: '管理员', label: '管理员' },
  { value: '学生', label: '学生' },
  { value: '教师', label: '教师' },
  { value: '督导专家', label: '督导专家' },
]

watch(
  () => props.visible,
  (v) => {
    if (v) {
      categoryName.value = ''
      userGroup.value = ''
      status.value = 'enabled'
    }
  },
)

function close() {
  emit('update:visible', false)
}

function onSubmit() {
  if (!categoryName.value) {
    return
  }
  emit('submit', {
    name: categoryName.value,
    userGroup: userGroup.value,
    status: status.value,
  })
  close()
}
</script>

<template>
  <Teleport to=".design-canvas" defer>
    <div v-if="visible" class="category-mask" @click.self="close">
      <div class="category-dialog">
        <!-- banner -->
        <div class="dialog-banner">
          <h3 class="dialog-title">新增分类</h3>
          <button class="close-btn" @click="close">
            <el-icon><Close /></el-icon>
          </button>
        </div>

        <!-- white content card -->
        <div class="dialog-content">
          <!-- 类型名称 -->
          <div class="form-field">
            <label class="field-label">
              <span class="label-icon">*</span>
              类型名称
            </label>
            <el-input
              v-model="categoryName"
              placeholder="请输入类型名称"
              class="field-input"
              maxlength="50"
            />
          </div>

          <!-- 用户组 -->
          <div class="form-field">
            <label class="field-label">
              <span class="label-icon">*</span>
              用户组
            </label>
            <el-select
              v-model="userGroup"
              placeholder="请选择"
              class="field-select"
              popper-class="category-select-popper"
            >
              <el-option
                v-for="opt in userGroupOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </div>

          <!-- 类型状态 -->
          <div class="form-field">
            <label class="field-label">
              <span class="label-icon">*</span>
              类型状态
            </label>
            <el-radio-group v-model="status" class="status-radio-group">
              <el-radio value="enabled">启用</el-radio>
              <el-radio value="disabled">禁用</el-radio>
            </el-radio-group>
          </div>
        </div>

        <!-- footer buttons -->
        <div class="dialog-footer">
          <el-button class="btn-cancel" @click="close">取消</el-button>
          <el-button type="primary" class="btn-submit" @click="onSubmit">确定</el-button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.category-mask {
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

.category-dialog {
  position: relative;
  width: 520px;
  height: 440px;
  background: #e7f2ff;
  border-radius: 18px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: pop-in 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes pop-in {
  from { transform: scale(0.92); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
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
}

.close-btn:hover {
  background: #ffffff;
  transform: scale(1.05);
}

.close-btn .el-icon {
  font-size: 14px;
}

.dialog-content {
  position: absolute;
  top: 66px;
  left: 20px;
  width: 480px;
  height: 306px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(20, 56, 140, 0.08);
  padding: 24px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field-label {
  font-size: 14px;
  color: #262626;
  line-height: 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.label-icon {
  color: #ff4d4f;
  font-size: 14px;
  line-height: 1;
  font-weight: bold;
}

.field-input {
  width: 440px;
}

.field-input :deep(.el-input__wrapper) {
  min-height: 36px;
  height: 36px;
  border-radius: 6px;
  background: #ffffff;
  box-shadow: 0 0 0 1px #e7e7e9 inset;
  padding: 0 12px;
}

.field-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #1947ff inset;
}

.field-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #1947ff inset !important;
}

.field-input :deep(.el-input__inner) {
  font-size: 13px;
  color: #262626;
}

.field-input :deep(.el-input__inner::placeholder) {
  color: #bfbfbf;
  font-size: 13px;
}

.field-select {
  width: 440px;
}

.field-select :deep(.el-select__wrapper) {
  min-height: 36px;
  height: 36px;
  border-radius: 6px;
  background: #ffffff;
  box-shadow: 0 0 0 1px #e7e7e9 inset;
  padding: 0 12px;
}

.field-select :deep(.el-select__wrapper:hover) {
  box-shadow: 0 0 0 1px #1947ff inset;
}

.field-select :deep(.el-select__wrapper.is-focused) {
  box-shadow: 0 0 0 1px #1947ff inset !important;
}

.field-select :deep(.el-select__placeholder) {
  font-size: 13px;
  color: #bfbfbf;
}

.field-select :deep(.el-select__selected-item) {
  font-size: 13px;
  color: #262626;
  font-weight: 400;
}

.field-select :deep(.el-select__suffix) {
  font-size: 12px;
}

.status-radio-group {
  display: inline-flex;
  align-items: center;
  gap: 24px;
}

.status-radio-group :deep(.el-radio) {
  margin-right: 0;
  height: 20px;
  --el-radio-input-border-color-hover: #1947ff;
  --el-radio-text-color: #000000;
  --el-radio-input-border-color: #e5e5e5;
}

.status-radio-group :deep(.el-radio__label) {
  font-size: 13px;
  padding-left: 8px;
  color: #000000;
  font-weight: 400;
}

.status-radio-group :deep(.el-radio__inner) {
  width: 16px;
  height: 16px;
  border: 1px solid #e5e5e5;
}

.status-radio-group :deep(.el-radio__input.is-checked .el-radio__inner) {
  background: #1947ff;
  border-color: #1947ff;
}

.status-radio-group :deep(.el-radio__input.is-checked .el-radio__inner::after) {
  background-color: #ffffff;
  width: 6px;
  height: 6px;
}

.status-radio-group :deep(.el-radio__input.is-checked + .el-radio__label) {
  color: #000000;
}

.dialog-footer {
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  z-index: 3;
}

.dialog-footer .el-button {
  width: 60px;
  height: 36px;
  border-radius: 8px;
  font-size: 14px;
  margin: 0;
  padding: 0;
}

.dialog-footer .btn-cancel {
  background: #ffffff;
  border: 1px solid #d9d9d9;
  color: #262626;
}

.dialog-footer .btn-cancel:hover {
  background: #ffffff;
  border-color: #1947ff;
  color: #1947ff;
}

.dialog-footer .btn-submit {
  background: #1947ff;
  border: 1px solid #1947ff;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(25, 71, 255, 0.25);
}

.dialog-footer .btn-submit:hover {
  background: #3a63ff;
  border-color: #3a63ff;
}
</style>

<style>
.category-select-popper .el-select-dropdown__item {
  font-size: 13px;
  padding: 0 12px;
  height: 34px;
  line-height: 34px;
}

.category-select-popper .el-select-dropdown__item.is-selected {
  color: #1947ff;
  font-weight: 500;
}

.category-select-popper .el-select-dropdown__item:hover {
  background-color: #f5f8ff;
}
</style>

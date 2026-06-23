<script setup lang="ts">
import { ref, watch } from 'vue'
import { Close, Plus, Delete } from '@element-plus/icons-vue'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'submit', payload: { name: string; options: Array<{ text: string; score: number }>; status: string }): void
}>()

const optionName = ref('')
const status = ref('enabled')
const options = ref<Array<{ text: string; score: number | string }>>([
  { text: '', score: '' }
])

watch(
  () => props.visible,
  (v) => {
    if (v) {
      optionName.value = ''
      status.value = 'enabled'
      options.value = [{ text: '', score: '' }]
    }
  },
)

function addOption() {
  options.value.push({ text: '', score: '' })
}

function removeOption(index: number) {
  if (options.value.length > 1) {
    options.value.splice(index, 1)
  }
}

function close() {
  emit('update:visible', false)
}

function onSubmit() {
  if (!optionName.value) {
    return
  }

  const validOptions = options.value
    .filter(opt => opt.text && opt.score !== '')
    .map(opt => ({
      text: opt.text,
      score: Number(opt.score)
    }))

  if (validOptions.length === 0) {
    return
  }

  emit('submit', {
    name: optionName.value,
    options: validOptions,
    status: status.value,
  })
  close()
}
</script>

<template>
  <Teleport to=".design-canvas" defer>
    <div v-if="visible" class="option-mask" @click.self="close">
      <div class="option-dialog">
        <!-- banner -->
        <div class="dialog-banner">
          <h3 class="dialog-title">新增选项</h3>
          <button class="close-btn" @click="close">
            <el-icon><Close /></el-icon>
          </button>
        </div>

        <!-- white content card -->
        <div class="dialog-content">
          <!-- 选项表名称 -->
          <div class="form-field">
            <label class="field-label">
              <span class="label-icon">*</span>
              选项表名称
            </label>
            <el-input
              v-model="optionName"
              placeholder="请输入选项表名称"
              class="field-input"
              maxlength="50"
            />
          </div>

          <!-- 选项设置 -->
          <div class="form-field options-field">
            <label class="field-label">
              <span class="label-icon">*</span>
              选项设置
            </label>
            <div class="options-container">
              <div class="options-header">
                <span class="header-text">选项文本</span>
                <span class="header-score">分值</span>
                <span class="header-delete-spacer"></span>
              </div>
              <div class="options-list">
                <div v-for="(option, index) in options" :key="index" class="option-row">
                  <el-input
                    v-model="option.text"
                    placeholder="请输入"
                    class="option-text-input"
                    maxlength="50"
                  />
                  <el-input
                    v-model="option.score"
                    placeholder="请输入"
                    class="option-score-input"
                    type="number"
                  />
                  <el-button
                    v-if="options.length > 1"
                    class="btn-delete"
                    :icon="Delete"
                    link
                    @click="removeOption(index)"
                  />
                  <span v-else class="btn-delete-spacer"></span>
                </div>
              </div>
              <el-button
                class="btn-add-option"
                :icon="Plus"
                @click="addOption"
              >
                新增选项
              </el-button>
            </div>
          </div>

          <!-- 指标状态 -->
          <div class="form-field">
            <label class="field-label">
              <span class="label-icon">*</span>
              指标状态
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
.option-mask {
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

.option-dialog {
  position: relative;
  width: 520px;
  min-height: 560px;
  max-height: 85vh;
  background: #e7f2ff;
  border-radius: 18px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  overflow: visible;
  animation: pop-in 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
}

@keyframes pop-in {
  from { transform: scale(0.92); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.dialog-banner {
  position: absolute;
  inset: 0 0 auto 0;
  height: 250px;
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
  top: 50px;
  left: 20px;
  right: 20px;
  bottom: 76px;
  width: 480px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(20, 56, 140, 0.08);
  padding: 20px 24px 20px 24px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  width: 432px;
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

.field-textarea {
  width: 432px;
}

.field-textarea :deep(.el-textarea__inner) {
  min-height: 100px;
  border: 1px solid #e7e7e9;
  border-radius: 6px;
  box-shadow: none;
  resize: none;
  padding: 8px 12px;
  font-size: 13px;
  color: #262626;
  background: #ffffff;
  font-family: inherit;
  line-height: 22px;
  transition: border-color 0.15s;
}

.field-textarea :deep(.el-textarea__inner::placeholder) {
  color: #bfbfbf;
}

.field-textarea :deep(.el-textarea__inner:hover) {
  border-color: #1947ff;
}

.field-textarea :deep(.el-textarea__inner:focus) {
  border-color: #1947ff;
  box-shadow: 0 0 0 1px rgba(25, 71, 255, 0.12);
}

.options-field {
  flex: 0 0 auto;
  min-height: 0;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.options-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-text {
  width: 390px;
  font-size: 14px;
  color: #595959;
  font-weight: 400;
  background: #fafafa;
  border-radius: 8px;
  padding: 0 16px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.header-score {
  width: 270px;
  font-size: 14px;
  color: #595959;
  font-weight: 400;
  background: #fafafa;
  border-radius: 8px;
  padding: 0 16px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.options-header-spacer {
  width: 0;
  flex-shrink: 0;
}

.header-delete-spacer {
  width: 32px;
  flex-shrink: 0;
}

.btn-delete-placeholder {
  width: 0;
  flex-shrink: 0;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 0 0 auto;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.option-text-input {
  width: 390px;
}

.option-text-input :deep(.el-input__wrapper) {
  min-height: 48px;
  height: 48px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 0 0 1px #d9d9d9 inset;
  padding: 0 16px;
}

.option-text-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #1947ff inset;
}

.option-text-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #1947ff inset !important;
}

.option-text-input :deep(.el-input__inner) {
  font-size: 14px;
  color: #262626;
  text-align: center;
}

.option-text-input :deep(.el-input__inner::placeholder) {
  color: #bfbfbf;
  font-size: 14px;
}

.option-score-input {
  width: 270px;
}

.option-score-input :deep(.el-input__wrapper) {
  min-height: 48px;
  height: 48px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 0 0 1px #d9d9d9 inset;
  padding: 0 16px;
}

.option-score-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #1947ff inset;
}

.option-score-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #1947ff inset !important;
}

.option-score-input :deep(.el-input__inner) {
  font-size: 14px;
  color: #262626;
  text-align: center;
}

.option-score-input :deep(.el-input__inner::placeholder) {
  color: #bfbfbf;
  font-size: 14px;
}

.option-score-input :deep(.el-input__inner) {
  font-size: 13px;
  color: #262626;
}

.option-score-input :deep(.el-input__inner::placeholder) {
  color: #bfbfbf;
  font-size: 13px;
}

.option-score-input :deep(.el-input__inner) {
  font-size: 13px;
  color: #262626;
  text-align: center;
}

.option-score-input :deep(.el-input__inner::placeholder) {
  color: #bfbfbf;
  font-size: 13px;
}

.btn-delete {
  width: 32px;
  height: 32px;
  min-width: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  flex-shrink: 0;
}

.btn-delete:hover {
  background: transparent;
}

.btn-delete:hover :deep(.el-icon) {
  color: #dc2835;
}

.btn-delete :deep(.el-icon) {
  font-size: 20px;
  color: #ff4d4f;
}

.btn-delete-spacer {
  width: 32px;
  flex-shrink: 0;
}

.btn-add-option {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  font-size: 14px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px dashed #d9d9d9;
  color: #595959;
  font-weight: 400;
}

.btn-add-option:hover {
  border-color: #1947ff;
  background: #ffffff;
  color: #1947ff;
}

.btn-add-option :deep(.el-icon) {
  font-size: 14px;
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
  bottom: 20px;
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

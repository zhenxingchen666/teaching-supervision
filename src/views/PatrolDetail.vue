<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import {
  ZoomIn,
  ZoomOut,
  Camera,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { buildings, rooms, courseDetails, type Room } from '../mock/data'

const props = defineProps<{
  initialRoom?: string
}>()

const emit = defineEmits<{
  (e: 'back'): void
}>()

const initialRoomData = props.initialRoom
  ? rooms.find(r => r.id === props.initialRoom)
  : null

const activeBuilding = ref(initialRoomData?.buildingId ?? '1')
const selectedRoom = ref(initialRoomData?.id ?? '1-202')

interface DataRow {
  key: string
  title: string
  iconBg: string
  iconColor: string
  stats: { label: string; value: string }[]
}

const cameraMode = ref<'ball' | 'half' | 'auto'>('auto')
const activeTab = ref<'data' | 'message'>('data')
const showMoreRooms = ref(false)

const currentDetail = computed(() => courseDetails[selectedRoom.value])

const currentCourse = computed(() => currentDetail.value?.courseName ?? '概率论与数理统计')
const currentTeacher = computed(() => currentDetail.value?.teacher ?? '李老师')
const currentClass = computed(() => currentDetail.value?.className ?? '大一20班')
const currentRoomLabel = computed(() => currentDetail.value?.roomLabel ?? '103-201')
const currentViewers = computed(() => currentDetail.value?.viewers ?? 0)

const dataRows = computed<DataRow[]>(() => {
  const d = currentDetail.value
  if (!d) return []
  return [
    {
      key: 'interaction',
      title: '互动',
      iconBg: '#E1ECFF',
      iconColor: '#1947FF',
      stats: [
        { label: '课堂互动次数', value: String(d.interaction.count) },
        { label: '课件发布次数', value: String(d.interaction.publish) },
        { label: '出勤率', value: d.interaction.attendance },
      ],
    },
    {
      key: 'rapid',
      title: '抢答',
      iconBg: '#FFF1E1',
      iconColor: '#FF8B19',
      stats: [
        { label: '累计发布抢答条数', value: String(d.rapid.total) },
        { label: '参与抢答人次', value: String(d.rapid.participants) },
        { label: '抢答平均参与率', value: d.rapid.rate },
      ],
    },
    {
      key: 'question',
      title: '提问',
      iconBg: '#E8F5E9',
      iconColor: '#36A33A',
      stats: [
        { label: '累计发布提问次数', value: String(d.question.publish) },
        { label: '累计随机提问次数', value: String(d.question.random) },
        { label: '累计点名提问次数', value: String(d.question.named) },
      ],
    },
    {
      key: 'quiz',
      title: '互动答题',
      iconBg: '#F2E8FF',
      iconColor: '#7E3FFF',
      stats: [
        { label: '累计发布个数', value: String(d.quiz.publish) },
        { label: '答题总数', value: String(d.quiz.total) },
        { label: '平均参与率', value: d.quiz.participateRate },
        { label: '平均正确率', value: d.quiz.correctRate },
      ],
    },
  ]
})

function onScreenshot() {
  console.log('Screenshot clicked')
}

function onZoom(mode: 'in' | 'out') {
  console.log('Zoom:', mode)
}

function onDirection(dir: 'up' | 'down' | 'left' | 'right' | 'center') {
  console.log('Direction:', dir)
}

const cameraModes = [
  { key: 'ball', label: '球机' },
  { key: 'half', label: '半球机' },
  { key: 'auto', label: '常态化录播' },
] as const

const filteredRooms = computed(() => {
  return rooms.filter(r => r.buildingId === activeBuilding.value)
})

const groupedRooms = computed(() => {
  const groups: Record<string, Room[]> = {}
  const order: string[] = []
  for (const room of filteredRooms.value) {
    const key = room.name.charAt(0)
    if (!groups[key]) {
      groups[key] = []
      order.push(key)
    }
    groups[key].push(room)
  }
  return order.map(k => groups[k])
})

const isOffline = computed(() => {
  const room = rooms.find(r => r.id === selectedRoom.value)
  return room?.status === 'idle'
})

function onBack() {
  emit('back')
}

function onMoreRooms() {
  showMoreRooms.value = !showMoreRooms.value
}

function selectRoom(room: Room) {
  selectedRoom.value = room.id
  activeBuilding.value = room.buildingId
  showMoreRooms.value = false
}

const ratingVisible = ref(false)

const ratingTemplates = [
  { value: 'student', label: '学员评教评价量表' },
  { value: 'peer', label: '同行评议量表' },
  { value: 'expert', label: '督导专家量表' },
]

const ratingOptions = [
  { value: 'excellent', label: '很好' },
  { value: 'good', label: '好' },
  { value: 'fair', label: '中' },
]

const ratingForm = reactive({
  template: 'student',
  qaReview: 'excellent',
  contentRich: 'excellent',
  theoryFit: 'excellent',
  contentNote: '',
  classNote: '',
})

function openRating() {
  Object.assign(ratingForm, {
    template: 'student',
    qaReview: 'excellent',
    contentRich: 'excellent',
    theoryFit: 'excellent',
    contentNote: '',
    classNote: '',
  })
  ratingVisible.value = true
}

function submitRating() {
  ElMessage.success('评价已提交')
  ratingVisible.value = false
}
</script>

<template>
  <div class="patrol-detail">
    <!-- top: full-width video card with info inside -->
    <div class="video-card">
      <!-- top row: back button + more rooms button -->
      <div class="card-top-row">
        <div class="card-top-left">
          <button class="back-btn" @click="onBack">
            <img src="/icon-back-arrow.svg" alt="" class="back-arrow" />
            返回
          </button>
          <button class="more-rooms-btn" @click="onMoreRooms">
            <img src="/icon-more-rooms.png" alt="" class="more-rooms-icon" />
            更多教室
          </button>
        </div>
      </div>

      <div class="card-info-row">
        <h2 class="card-course-title">{{ currentCourse }}</h2>
        <div class="card-info-item">
          <span class="card-info-icon orange">
            <img src="/icon-teacher.png" alt="" />
          </span>
          <span class="card-info-label">教员：</span>
          <span class="card-info-value">{{ currentTeacher }}</span>
        </div>
        <div class="card-info-item">
          <span class="card-info-icon purple">
            <img src="/icon-class.png" alt="" />
          </span>
          <span class="card-info-label">班级：</span>
          <span class="card-info-value">{{ currentClass }}</span>
        </div>
        <div class="card-info-item">
          <span class="card-info-icon blue">
            <img src="/icon-room.png" alt="" />
          </span>
          <span class="card-info-label">教室：</span>
          <span class="card-info-value">{{ currentRoomLabel }}</span>
        </div>
        <p class="viewer-count">实时巡课人数：{{ currentViewers }}</p>
      </div>

      <div v-if="showMoreRooms" class="more-rooms-card">
        <div class="building-tabs-bar">
          <button
            v-for="b in buildings"
            :key="b.id"
            :class="['building-tab', { active: activeBuilding === b.id }]"
            @click="activeBuilding = b.id"
          >
            {{ b.name }}
          </button>
        </div>
        <div class="room-groups">
          <div
            v-for="(group, idx) in groupedRooms"
            :key="idx"
            class="room-row"
          >
            <button
              v-for="room in group"
              :key="room.id"
              :class="['room-btn', { active: selectedRoom === room.id }]"
              @click="selectRoom(room)"
            >
              {{ room.name }}
            </button>
          </div>
        </div>
      </div>

      <div class="video-row" v-if="cameraMode !== 'half' && !isOffline">
        <div class="video-frame">
          <img src="/classroom-live-left.png" alt="教室全景" class="video-img" />
        </div>
        <div class="video-frame">
          <img src="/classroom-live-right.png" alt="课件画面" class="video-img" />
        </div>
      </div>
      <div class="video-row-single" v-else-if="cameraMode === 'half' && !isOffline">
        <div class="video-frame">
          <img src="/classroom-live-left.png" alt="教室全景" class="video-img" />
        </div>
      </div>
      <div v-else class="video-offline">
        <div class="offline-placeholder">
          <img src="/icon-device-broken.png" alt="" class="offline-icon" />
          <p class="offline-text">未配置摄像设备无法查看教室画面</p>
        </div>
      </div>
    </div>

    <!-- bottom row: control card (left, short) + data panel (right, tall) -->
    <div class="bottom-row">
      <!-- left: controls (camera mode + hint + control panels) -->
      <div class="control-card-wrap">
        <div class="camera-row">
          <button class="rate-btn" @click="openRating">在线评价</button>
          <div v-if="!isOffline" class="camera-modes">
            <button
              v-for="m in cameraModes"
              :key="m.key"
              :class="['mode-btn', { active: cameraMode === m.key }]"
              @click="cameraMode = m.key as typeof cameraMode"
            >
              {{ m.label }}
            </button>
          </div>
        </div>

        <div v-if="isOffline" class="inner-card-offline">
          <div class="offline-control-hint">
            <img src="/half-mode-icon.png" alt="" class="offline-control-icon" />
            <span class="offline-control-text">未配置摄像设备</span>
          </div>
        </div>

        <div class="inner-card" v-else-if="cameraMode !== 'half'">
          <!-- direction pad on the left -->
          <div class="d-pad">
            <button class="d-btn d-arrow-btn d-up" @click="onDirection('up')">
              <svg class="d-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 4.5L7 9.5L12 4.5" stroke="#191C1E" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <button class="d-btn d-arrow-btn d-left" @click="onDirection('left')">
              <svg class="d-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 4.5L7 9.5L12 4.5" stroke="#191C1E" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <img src="/d-pad-refresh.png" alt="" class="d-icon d-center" @click="onDirection('center')" />
            <button class="d-btn d-arrow-btn d-right" @click="onDirection('right')">
              <svg class="d-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 4.5L7 9.5L12 4.5" stroke="#191C1E" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <button class="d-btn d-arrow-btn d-down" @click="onDirection('down')">
              <svg class="d-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 4.5L7 9.5L12 4.5" stroke="#191C1E" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          <!-- right column: zoom row + screenshot -->
          <div class="action-buttons">
            <div class="zoom-row">
              <button class="action-btn" @click="onZoom('in')">
                <el-icon><ZoomIn /></el-icon>
                <span>拉近</span>
              </button>
              <button class="action-btn" @click="onZoom('out')">
                <el-icon><ZoomOut /></el-icon>
                <span>拉远</span>
              </button>
            </div>
            <button class="action-btn screenshot-btn" @click="onScreenshot">
              <el-icon><Camera /></el-icon>
              <span>截图</span>
            </button>
          </div>
        </div>

        <div class="inner-card-half" v-else>
          <div class="half-mode-content">
            <img src="/half-mode-icon.png" alt="" class="half-mode-icon" />
            <span class="half-mode-hint">仅球机画面支持远程控制</span>
          </div>
        </div>

        <p class="hint-text">
          教学督导请选择常态录播按钮，如果异常，请选挥轻录播按钮。教室巡视、设备巡检，考试巡查请选择轻录播球机/半球机按钮。
        </p>
      </div>

      <!-- right: data / message panel (taller, extends below the controls card) -->
      <aside class="data-panel" :class="{ 'panel-message-mode': activeTab === 'message' }">
        <div class="panel-tabs">
          <button
            :class="['panel-tab', { active: activeTab === 'data' }]"
            @click="activeTab = 'data'"
          >
            课堂数据
          </button>
          <button
            :class="['panel-tab', { active: activeTab === 'message' }]"
            @click="activeTab = 'message'"
          >
            留言
          </button>
        </div>

        <div v-if="activeTab === 'data'" class="data-rows">
          <div
            v-for="row in dataRows"
            :key="row.key"
            class="data-card"
          >
            <div
              class="data-icon"
              :style="{ background: row.iconBg, color: row.iconColor }"
            >
              {{ row.title }}
            </div>
            <div class="data-stats">
              <div
                v-for="s in row.stats"
                :key="s.label"
                class="data-stat"
              >
                <div class="stat-value">{{ s.value }}</div>
                <div class="stat-label">{{ s.label }}</div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="message-panel-content">
          <div class="message-list-fixed">
            <div class="message-item">
              <div class="message-header">
                <div class="message-user">
                  <img src="/avatar.png" alt="" class="message-avatar" />
                  <span class="message-username">黄凯文</span>
                </div>
                <span class="message-time">2026-4-8 12:03</span>
              </div>
              <div class="message-content">
                板书内容很丰富！
              </div>
            </div>
            <div class="message-item">
              <div class="message-header">
                <div class="message-user">
                  <img src="/avatar.png" alt="" class="message-avatar" />
                  <span class="message-username">张玮</span>
                </div>
                <span class="message-time">2026-4-8 12:03</span>
              </div>
              <div class="message-content">
                逻辑清晰，重点明确，受益匪浅～
              </div>
            </div>
            <div class="message-item">
              <div class="message-header">
                <div class="message-user">
                  <img src="/avatar.png" alt="" class="message-avatar" />
                  <span class="message-username">李涵</span>
                </div>
                <span class="message-time">2026-4-8 12:03</span>
              </div>
              <div class="message-content">
                课堂内容充实，讲解细致，能把复杂知识点讲得通俗易懂。
              </div>
            </div>
            <div class="message-item">
              <div class="message-header">
                <div class="message-user">
                  <img src="/avatar.png" alt="" class="message-avatar" />
                  <span class="message-username">刘佳佳</span>
                </div>
                <span class="message-time">2026-4-8 12:03</span>
              </div>
            <div class="message-content">
              理论结合实际，实用性很强，非常值得一听。
            </div>
          </div>
          <div class="message-item">
            <div class="message-header">
              <div class="message-user">
                <img src="/avatar.png" alt="" class="message-avatar" />
                <span class="message-username">徐梦丽</span>
              </div>
              <span class="message-time">2026-4-8 12:03</span>
            </div>
            <div class="message-content">
              老师讲的很好～
            </div>
          </div>
        </div>
        <div class="more-comments-btn">
          <span class="more-comments-text">查看更多评论</span>
          <img src="/icon-chevron-down.svg" alt="" class="more-comments-icon" />
        </div>
      </div>
      </aside>
    </div>

    <el-dialog
      v-model="ratingVisible"
      :show-close="false"
      :close-on-click-modal="false"
      append-to=".design-canvas"
      width="520px"
      align-center
      class="rating-dialog"
    >
      <template #header="{ close }">
        <div class="rating-banner">
          <h3 class="rating-title">在线评价</h3>
          <button class="rating-close" @click="close" aria-label="关闭">×</button>
        </div>
      </template>

      <div class="rating-body">
        <div class="rating-field">
          <label class="rating-label">评价模板</label>
          <el-select
            v-model="ratingForm.template"
            class="template-select"
            popper-class="rating-select-popper"
          >
            <el-option
              v-for="opt in ratingTemplates"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </div>

        <section class="rating-section">
          <h4 class="section-title">答疑及考核</h4>
          <div class="rating-item">
            <div class="item-label"><span class="required">*</span>耐心示范答疑，注重对学员学习过程的考核：</div>
            <el-radio-group v-model="ratingForm.qaReview" class="rating-radio-group">
              <el-radio v-for="o in ratingOptions" :key="o.value" :value="o.value">{{ o.label }}</el-radio>
            </el-radio-group>
          </div>
        </section>

        <section class="rating-section">
          <h4 class="section-title">教学内容及准备</h4>
          <div class="rating-item">
            <div class="item-label"><span class="required">*</span>教学内容充实：</div>
            <el-radio-group v-model="ratingForm.contentRich" class="rating-radio-group">
              <el-radio v-for="o in ratingOptions" :key="o.value" :value="o.value">{{ o.label }}</el-radio>
            </el-radio-group>
          </div>
          <div class="rating-item">
            <div class="item-label"><span class="required">*</span>教学内容与理论知识有机结合：</div>
            <el-radio-group v-model="ratingForm.theoryFit" class="rating-radio-group">
              <el-radio v-for="o in ratingOptions" :key="o.value" :value="o.value">{{ o.label }}</el-radio>
            </el-radio-group>
          </div>
          <div class="rating-item">
            <div class="item-label"><span class="required">*</span>授课内容</div>
            <el-input
              v-model="ratingForm.contentNote"
              type="textarea"
              :rows="3"
              placeholder="请输入"
              resize="none"
            />
          </div>
          <div class="rating-item">
            <div class="item-label"><span class="required">*</span>课堂评价</div>
            <el-input
              v-model="ratingForm.classNote"
              type="textarea"
              :rows="3"
              placeholder="点击输入文字状态"
              resize="none"
            />
          </div>
        </section>
      </div>

      <template #footer>
        <div class="rating-footer">
          <el-button class="btn-cancel" @click="ratingVisible = false">取消</el-button>
          <el-button type="primary" class="btn-submit" @click="submitRating">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.patrol-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  min-height: 0;
}

/* Header */
.detail-header {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
}

/* Top video card (full width, info inside) */
.video-card {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 18px;
  padding: 20px 30px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}


.card-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-top-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  padding: 0;
  background: transparent;
  border: none;
  font-size: 14px;
  color: #191c1e;
  cursor: pointer;
  transition: color 0.2s;
  font-family: inherit;
  line-height: 24px;
}

.back-btn:hover {
  color: #1947ff;
}

.back-arrow {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.more-rooms-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(105, 123, 169, 0.1);
  border-radius: 8px;
  font-size: 14px;
  color: #191c1e;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.more-rooms-btn:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(105, 123, 169, 0.2);
}

.more-rooms-btn svg {
  flex-shrink: 0;
}

.more-rooms-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  object-fit: contain;
}

.viewer-count {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #191c1e;
  line-height: 20px;
}

.viewer-icon {
  width: 18px;
  height: 18px;
}

.card-info-row {
  display: flex;
  align-items: center;
  gap: 32px;
}

.card-course-title {
  font-size: 20px;
  font-weight: 600;
  color: #022170;
  line-height: 24px;
  margin: 0;
  margin-right: 16px;
}

.card-info-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 24px;
}

.card-info-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-info-icon.orange {
  background: #fff1df;
}

.card-info-icon.purple {
  background: #efecff;
}

.card-info-icon.blue {
  background: #e9efff;
}

.card-info-icon img {
  width: 26px;
  height: 26px;
}

.card-info-label {
  color: #64748b;
  font-weight: 400;
}

.card-info-value {
  color: #191c1e;
  font-weight: 500;
}

.video-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* More rooms card — shown when "更多教室" is clicked, replaces video area */
.more-rooms-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 20px 30px 30px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0px 10px 30px 0px rgba(190, 198, 223, 0.4);
  border: 2px solid #ffffff;
}

.building-tabs-bar {
  display: flex;
  align-items: center;
  gap: 50px;
  padding-bottom: 16px;
  border-bottom: 1px solid #dfe9f0;
  flex-wrap: wrap;
}

.building-tab {
  position: relative;
  padding: 0 4px 8px;
  background: transparent;
  border: none;
  font-size: 14px;
  color: #191c1e;
  line-height: 20px;
  cursor: pointer;
  transition: color 0.2s;
  font-family: inherit;
}

.building-tab:hover:not(.active) {
  color: #1947ff;
}

.building-tab.active {
  color: #1947ff;
  font-weight: 500;
}

.building-tab.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -10px;
  width: 32px;
  height: 4px;
  background: #1947ff;
  border-radius: 2px;
}

.room-groups {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.room-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.room-btn {
  width: 100px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f6fa;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 14px;
  color: #000000;
  line-height: 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  box-sizing: border-box;
  flex-shrink: 0;
}

.room-btn:hover {
  background: #ffffff;
}

.room-btn.active {
  background: #f5f6fa;
  border-color: #1947ff;
  color: #1947ff;
  font-weight: 500;
}

.video-row-single {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ecf3fb;
  border-radius: 12px;
  padding: 40px 30px;
}

.video-row-single .video-frame {
  width: 50%;
  max-width: 825px;
}

/* Bottom row: control card (330h) left, data panel (430h) right, equal width 825 each */
.bottom-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
  flex: 1;
  min-height: 0;
}

.control-card-wrap {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 18px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 0;
  overflow: hidden;
  /* design 825×330, aspect ratio = 2.5:1 */
  max-height: 330px;
}

.video-frame {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 10px;
  overflow: hidden;
  background: #000;
  box-shadow: 0 4px 14px rgba(190, 198, 223, 0.3);
}

.viewer-count {
  margin-left: auto;
  color: #64748b;
  font-size: 14px;
  font-family: PingFang SC, sans-serif;
  line-height: 24px;
  white-space: nowrap;
}

.video-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Offline video placeholder */
.video-offline {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.offline-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.offline-icon {
  width: 80px;
  height: 80px;
  object-fit: contain;
  opacity: 0.6;
}

.offline-text {
  font-size: 14px;
  color: #64748b;
  line-height: 20px;
  margin: 0;
}

/* Camera row */
.camera-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.rate-btn {
  height: 32px;
  padding: 0 16px;
  background: #1947ff;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(25, 71, 255, 0.25);
  transition: background 0.2s;
  flex-shrink: 0;
}

.rate-btn:hover {
  background: #3a63ff;
}

.camera-modes {
  display: inline-flex;
  gap: 8px;
  background: #ecf3fb;
  padding: 4px;
  border-radius: 8px;
}

.mode-btn {
  height: 32px;
  padding: 0 18px;
  border: none;
  background: transparent;
  border-radius: 6px;
  color: #191c1e;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.mode-btn:hover:not(.active) {
  color: #1947ff;
}

.mode-btn.active {
  background: #ffffff;
  color: #1947ff;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(155, 168, 181, 0.4);
}

/* Inner card: 785×170 per design 0:3315, holds d-pad + action buttons */
.inner-card {
  flex: 1;
  min-height: 0;
  background: #ecf3fb url('/control-card-bg.png') center / cover no-repeat;
  border-radius: 6px;
  padding: 30px 0;
  display: flex;
  align-items: center;
  gap: 0;
  justify-content: space-between;
}

.inner-card-half {
  flex: 1;
  min-height: 0;
  background: #ecf3fb;
  border-radius: 6px;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Offline control card */
.inner-card-offline {
  flex: 1;
  min-height: 0;
  background: #ecf3fb;
  border-radius: 6px;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.offline-control-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.offline-control-icon {
  width: 80px;
  height: 80px;
  object-fit: contain;
  opacity: 0.6;
}

.offline-control-text {
  color: #191c1e;
  font-size: 14px;
  line-height: 20px;
}

.half-mode-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.half-mode-icon {
  width: 79px;
  height: 80px;
  object-fit: contain;
  flex-shrink: 0;
}

.half-mode-hint {
  color: #191c1e;
  font-size: 14px;
  font-family: PingFang SC, sans-serif;
  line-height: 20px;
  white-space: nowrap;
}

/* Hint */
.hint-text {
  font-size: 13px;
  color: #64748b;
  line-height: 22px;
  margin: 0;
  flex-shrink: 0;
}

/* Direction pad — 110×110 at (80, 30) inside inner card 0:3315 */
.d-pad {
  position: relative;
  width: 110px;
  height: 110px;
  flex-shrink: 0;
  margin-left: 80px;
}

/* Direction pad - buttons for arrows, direct icon for center */
.d-btn {
  position: absolute;
  width: 30px;
  height: 30px;
  border: none;
  background: #ffffff;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  box-shadow: 0 2px 6px rgba(214, 220, 225, 0.73);
  transition: background 0.15s, border-color 0.15s;
  padding: 0;
  border: 1px solid transparent;
}

.d-btn:hover {
  background: #ffffff;
  border-color: #1947ff;
}

.d-arrow-btn {
  width: 30px;
  height: 30px;
  background: #ffffff;
  border-radius: 4px;
}

.d-chevron {
  width: 14px;
  height: 14px;
  display: block;
}

.d-up {
  top: 0;
  left: 40px;
}

.d-up .d-chevron {
  transform: rotate(180deg);
}

.d-down {
  bottom: 0;
  left: 40px;
}

.d-down .d-chevron {
  transform: rotate(0deg);
}

.d-left {
  top: 40px;
  left: 0;
}

.d-left .d-chevron {
  transform: rotate(90deg);
}

.d-right {
  top: 40px;
  right: 0;
}

.d-right .d-chevron {
  transform: rotate(-90deg);
}

/* Center icon - displayed directly, not in a button */
.d-icon {
  position: absolute;
  width: 30px;
  height: 30px;
  cursor: pointer;
  object-fit: contain;
}

.d-center {
  top: 40px;
  left: 40px;
}

/* Right column: 374 wide, 80px from right edge of inner card */
.action-buttons {
  width: 374px;
  flex-shrink: 0;
  margin-left: auto;
  margin-right: 80px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.zoom-row {
  display: flex;
  gap: 14px;
}

/* zoom buttons 180×48, screenshot 374×48 (per design) */
.action-btn {
  flex: 1;
  height: 48px;
  background: #ffffff;
  border: 1px solid transparent;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  color: #191c1e;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.action-btn:hover {
  border-color: #1947ff;
  box-shadow: 0 2px 6px rgba(155, 168, 181, 0.73);
}

.action-btn .el-icon {
  font-size: 16px;
  color: #191c1e;
}

.screenshot-btn {
  width: 100%;
  flex: none;
}

/* Data panel (right side — 825×430 for data, 825×682 for message) */
.data-panel {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 18px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  overflow: hidden;
  max-height: 430px;
}

.data-panel.panel-message-mode {
  max-height: 682px;
}

.panel-tabs {
  display: flex;
  gap: 24px;
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  padding-bottom: 8px;
}

.panel-tab {
  position: relative;
  padding: 4px 4px 8px;
  background: transparent;
  border: none;
  font-size: 16px;
  color: #64748b;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.2s;
}

.panel-tab.active {
  color: #191c1e;
  font-weight: 600;
}

.panel-tab.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -9px;
  width: 32px;
  height: 4px;
  background: #1947ff;
  border-radius: 2px;
}

.data-rows {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
}

.data-card {
  display: flex;
  align-items: stretch;
  height: 76px;
  flex-shrink: 0;
  background: #ffffff;
  border: 1px solid rgba(214, 220, 225, 0.7);
  border-radius: 10px;
  padding: 10px;
  gap: 10px;
  box-shadow: 0 4px 10px rgba(214, 220, 225, 0.2);
}

.data-icon {
  width: 70px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
}

.data-stats {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 8px;
}

.data-stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  position: relative;
}

.data-stat:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 8px;
  bottom: 8px;
  width: 1px;
  background: rgba(229, 231, 235, 0.8);
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #191c1e;
  line-height: 24px;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  line-height: 16px;
  white-space: nowrap;
}

.message-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #94a3b8;
}

.message-panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.message-list-fixed {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 4px;
}

.message-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding-right: 4px;
}

.more-comments-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: auto;
  padding-top: 16px;
  cursor: pointer;
}

.more-comments-text {
  color: #1947ff;
  font-size: 14px;
  font-family: PingFang SC, sans-serif;
  text-align: center;
  line-height: 20px;
}

.more-comments-icon {
  width: 16px;
  height: 16px;
}

.message-item {
  background: #ffffff;
  border: 1px solid rgba(214, 220, 225, 0.7);
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(214, 220, 225, 0.15);
}

.message-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.message-user {
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.message-username {
  font-size: 14px;
  font-weight: 500;
  color: #191c1e;
  line-height: 20px;
}

.message-time {
  font-size: 12px;
  color: #94a3b8;
  line-height: 16px;
}

.message-content {
  font-size: 14px;
  color: #64748b;
  line-height: 22px;
}

/* ====== Online rating dialog ====== */
.rating-banner {
  position: relative;
  height: 80px;
  margin: -20px -20px 0;
  border-radius: 18px 18px 0 0;
  background: url('/feedback-dialog-bg.png') center top / cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rating-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 4px rgba(0, 30, 80, 0.25);
}

.rating-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.85);
  color: #191c1e;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, transform 0.15s;
}

.rating-close:hover {
  background: #ffffff;
  transform: scale(1.05);
}

.rating-body {
  padding: 4px 4px 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.rating-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-label {
  font-size: 14px;
  color: #262626;
  line-height: 20px;
  padding-left: 8px;
}

.template-select {
  width: 260px;
}

.rating-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.section-title {
  margin: 0;
  padding-left: 10px;
  font-size: 15px;
  font-weight: 600;
  color: #191c1e;
  line-height: 20px;
  border-left: 3px solid #1947ff;
}

.rating-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 8px;
}

.item-label {
  font-size: 14px;
  color: #262626;
  line-height: 20px;
}

.required {
  color: #f56c6c;
  margin-right: 2px;
}

.rating-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.rating-footer .el-button {
  width: 60px;
  height: 36px;
  border-radius: 8px;
  font-size: 14px;
  margin: 0;
  padding: 0;
}

.rating-footer .btn-cancel {
  background: #ffffff;
  border: 1px solid #d9d9d9;
  color: #262626;
}

.rating-footer .btn-cancel:hover {
  border-color: #1947ff;
  color: #1947ff;
}

.rating-footer .btn-submit {
  background: #1947ff;
  border: 1px solid #1947ff;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(25, 71, 255, 0.25);
}

.rating-footer .btn-submit:hover {
  background: #3a63ff;
  border-color: #3a63ff;
}
</style>

<style>
.rating-dialog {
  border-radius: 18px;
  overflow: hidden;
  background: #e7f2ff;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}

.rating-dialog .el-dialog__header {
  margin: 0;
  padding: 0;
}

.rating-dialog .el-dialog__body {
  padding: 16px 20px 8px;
  background: #ffffff;
  margin: 0 16px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(20, 56, 140, 0.08);
  position: relative;
  z-index: 1;
  overflow: visible;
}

.rating-dialog .el-dialog__footer {
  padding: 16px 20px 20px;
  background: transparent;
}

.rating-dialog .el-radio {
  margin-right: 0;
  height: 20px;
  --el-radio-input-border-color: #e5e5e5;
  --el-radio-input-border-color-hover: #1947ff;
}

.rating-dialog .el-radio__label {
  font-size: 14px;
  color: #262626;
  padding-left: 6px;
}

.rating-dialog .el-radio__inner {
  width: 16px;
  height: 16px;
}

.rating-dialog .el-radio__input.is-checked .el-radio__inner {
  background: #1947ff;
  border-color: #1947ff;
}

.rating-dialog .el-radio__input.is-checked .el-radio__inner::after {
  background: #ffffff;
  width: 6px;
  height: 6px;
}

.rating-dialog .el-radio__input.is-checked + .el-radio__label {
  color: #262626;
}

.rating-dialog .rating-radio-group {
  display: inline-flex;
  gap: 36px;
}

.rating-dialog .el-textarea__inner {
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  color: #262626;
  border: 1px solid #e7e7e9;
  box-shadow: none;
  padding: 8px 12px;
}

.rating-dialog .el-textarea__inner:focus,
.rating-dialog .el-textarea__inner:hover {
  border-color: #1947ff;
}

.rating-dialog .el-textarea__inner::placeholder {
  color: #bfbfbf;
}

.rating-dialog .template-select .el-select__wrapper {
  min-height: 36px;
  height: 36px;
  border-radius: 6px;
  background: #ffffff;
  box-shadow: 0 0 0 1px #e7e7e9 inset;
  padding: 0 12px;
}

.rating-dialog .template-select .el-select__wrapper:hover,
.rating-dialog .template-select .el-select__wrapper.is-focused {
  box-shadow: 0 0 0 1px #1947ff inset !important;
}

.rating-select-popper .el-select-dropdown__item.is-selected {
  color: #1947ff;
  font-weight: 500;
}

.rating-select-popper .el-select-dropdown__item:hover {
  background-color: #f5f8ff;
}
</style>

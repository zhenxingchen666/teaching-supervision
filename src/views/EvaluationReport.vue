<script setup lang="ts">
import { computed, h, ref } from 'vue'
import RankingDialog, { type RankingRow } from '../components/RankingDialog.vue'

const DatePickerIcon = () =>
  h('img', {
    src: '/icons/date-picker.svg',
    alt: '',
    style: 'width:16px;height:16px;display:block',
  })

interface PodiumItem {
  rank: 1 | 2 | 3
  name: string
  score: number
  color: string
  bg: string
  badgeBorder: string
}

interface ListItem {
  rank: number
  name: string
  score: number
}

interface DeptBar {
  name: string
  cyan: number
  blue: number
}

const dateRange = ref<[string, string]>(['2026-04-16', '2026-05-16'])

const hasData = computed(() => {
  const [start, end] = dateRange.value
  if (!start || !end) return false
  return start <= '2026-06-30' && end >= '2026-06-01'
})

const GOLD = {
  color: '#9A6804',
  bg: 'linear-gradient(180deg, #FFFBED 0%, #FFF7DA 7%, #FFFFFF 100%)',
  badgeBorder: '#FFCD5E',
}
const COPPER = {
  color: '#A45A42',
  bg: 'linear-gradient(180deg, #FFF4ED 0%, #FFE8DA 7%, #FFFFFF 100%)',
  badgeBorder: '#ECD0BD',
}
const SILVER = {
  color: '#626E8A',
  bg: 'linear-gradient(180deg, #EFF4FF 0%, #E4E8EE 7%, #FFFFFF 100%)',
  badgeBorder: '#D3D5D9',
}

const teacherPodium: PodiumItem[] = [
  { rank: 2, name: '吴姓名', score: 92.4, ...SILVER },
  { rank: 1, name: '李姓名', score: 94.5, ...GOLD },
  { rank: 3, name: '刘姓名', score: 91.5, ...COPPER },
]
const coursePodium: PodiumItem[] = [
  { rank: 2, name: '高等数学', score: 91.4, ...SILVER },
  { rank: 1, name: '线性代数', score: 93.5, ...GOLD },
  { rank: 3, name: '概率论与数理统计', score: 90.5, ...COPPER },
]
const teacherList: ListItem[] = [
  { rank: 4, name: '张姓名', score: 90.5 },
  { rank: 5, name: '欧阳姓名', score: 90.2 },
  { rank: 6, name: '李姓名', score: 89.5 },
  { rank: 7, name: '齐姓名', score: 89.2 },
  { rank: 8, name: '朱姓名', score: 88.3 },
  { rank: 9, name: '刘姓名', score: 88.1 },
  { rank: 10, name: '张姓名', score: 87.5 },
]

const teacherDialogExtra: ListItem[] = Array.from({ length: 220 }, (_, i) => ({
  rank: 11 + i,
  name: `教员${11 + i}`,
  score: Number((87 - i * 0.05).toFixed(1)),
}))

const courseList: ListItem[] = [
  { rank: 4, name: '人工智能基础课程名称', score: 90.2 },
  { rank: 5, name: '课程名称', score: 89.5 },
  { rank: 6, name: '课程名称课程名称', score: 88.5 },
  { rank: 7, name: '课程名称课程名称课程名称课程名称', score: 88.3 },
  { rank: 8, name: '课程名称课程名称课程名称', score: 88.1 },
  { rank: 9, name: '课程名称', score: 87.5 },
  { rank: 10, name: '课程名称课程名称', score: 87.4 },
]

const courseDialogExtra: ListItem[] = Array.from({ length: 220 }, (_, i) => ({
  rank: 11 + i,
  name: `课程名称${11 + i}`,
  score: Number((87 - i * 0.05).toFixed(1)),
}))

const stats = [
  { label: '评价总次数', value: '1211', icon: '/icons/stats/records.png' },
  { label: '评价课程总数', value: '521', icon: '/icons/stats/course.png' },
  { label: '被评教员总数', value: '690', icon: '/icons/stats/teacher.png' },
  { label: '被评教员总占比', value: '51%', icon: '/icons/stats/pie-teacher.png' },
  { label: '被评课程占比', value: '61%', icon: '/icons/stats/pie-course.png' },
]

// y axis max 250 -> 1px = 250/280
const CHART_MAX = 250
const CHART_AXIS_HEIGHT = 280
const yTicks = [250, 200, 150, 100, 50, 0]
const departments: DeptBar[] = [
  { name: '学院A', cyan: 67, blue: 50 },
  { name: '学院B', cyan: 89, blue: 64 },
  { name: '学院C', cyan: 94, blue: 30 },
  { name: '学院D', cyan: 67, blue: 133 },
  { name: '学院E', cyan: 67, blue: 69 },
  { name: '学院F', cyan: 30, blue: 87 },
  { name: '学院G', cyan: 127, blue: 98 },
  { name: '学院H', cyan: 67, blue: 50 },
  { name: '学院I', cyan: 76, blue: 127 },
  { name: '学院J', cyan: 99, blue: 69 },
]

const tooltipTarget = ref<DeptBar | null>(departments[6])
const totalOf = (d: DeptBar) => d.cyan + d.blue

function barHeight(value: number) {
  return (value / CHART_MAX) * CHART_AXIS_HEIGHT
}

function showTooltip(d: DeptBar) {
  tooltipTarget.value = d
}

const teacherRankingDialog = ref(false)
const courseRankingDialog = ref(false)

const teacherRankingData = computed<RankingRow[]>(() =>
  [
    ...teacherPodium.map((p) => ({ rank: p.rank, name: p.name, score: p.score })),
    ...teacherList.map((p) => ({ rank: p.rank, name: p.name, score: p.score })),
    ...teacherDialogExtra.map((p) => ({ rank: p.rank, name: p.name, score: p.score })),
  ].sort((a, b) => a.rank - b.rank),
)
const courseRankingData = computed<RankingRow[]>(() =>
  [
    ...coursePodium.map((p) => ({ rank: p.rank, name: p.name, score: p.score })),
    ...courseList.map((p) => ({ rank: p.rank, name: p.name, score: p.score })),
    ...courseDialogExtra.map((p) => ({ rank: p.rank, name: p.name, score: p.score })),
  ].sort((a, b) => a.rank - b.rank),
)
</script>
<template>
  <div class="evaluation-report">
    <div class="content-card">
      <!-- 顶部:页面标题 + 查询日期 -->
      <h1 class="page-title">选项管理</h1>
      <div class="date-filter">
        <span class="date-label">查询日期</span>
        <div class="date-picker-wrap">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            value-format="YYYY-MM-DD"
            range-separator="—"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="default"
            :prefix-icon="DatePickerIcon"
            class="date-picker"
          />
        </div>
      </div>

      <!-- 排名:左右两个面板 -->
    <div class="rank-row" :class="{ 'rank-row--empty': !hasData }">
      <!-- 教员综合成绩平均分排名 -->
      <section class="rank-panel rank-panel--teacher" :class="{ 'rank-panel--empty': !hasData }">
        <div class="rank-head">
          <div class="rank-head-deco">
            <svg viewBox="0 0 20 14" class="head-leaf">
              <path d="M0 0h16v6H0z" fill="#FFCD5E" opacity=".55" />
              <path d="M4 8h16v6H4z" fill="#FFCD5E" opacity=".75" />
            </svg>
            <span class="rank-title">教员综合成绩平均分排名</span>
            <svg viewBox="0 0 20 14" class="head-leaf head-leaf--right">
              <path d="M0 0h16v6H0z" fill="#FFCD5E" opacity=".55" />
              <path d="M4 8h16v6H4z" fill="#FFCD5E" opacity=".75" />
            </svg>
          </div>
          <a class="more-link" @click="hasData && (teacherRankingDialog = true)">
            更多
            <svg viewBox="0 0 16 16" class="more-arrow"><path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </a>
        </div>

        <!-- 前三名 -->
        <div class="podium">
          <div
            v-for="item in teacherPodium"
            :key="`t-${item.rank}`"
            :class="['podium-item', `podium-rank-${item.rank}`]"
          >
            <img
              class="podium-avatar"
              :src="hasData ? '/data-avatar.png' : '/empty-avatar.png'"
              alt=""
            />
            <div
              class="podium-card"
              :style="{ backgroundImage: `url(/podium-${item.rank}.png)` }"
            >
              <div class="podium-name" :style="{ color: item.color }">{{ hasData ? item.name : '--' }}</div>
              <div class="podium-score" :style="{ color: item.color }">
                <template v-if="hasData">
                  <span class="podium-score-num">{{ item.score }}</span>
                  <span class="podium-score-unit">分</span>
                </template>
                <span v-else class="podium-score-num">--</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 列表 4-10 -->
        <ul v-if="hasData" class="rank-list">
          <li v-for="row in teacherList" :key="`tl-${row.rank}`" class="rank-row-item">
            <span class="rank-num">{{ row.rank }}</span>
            <div class="rank-avatar"></div>
            <span class="rank-name">{{ row.name }}</span>
            <span class="rank-score">{{ row.score }}分</span>
          </li>
        </ul>
      </section>

      <!-- 课程成绩平均分排名 -->
      <section class="rank-panel rank-panel--course" :class="{ 'rank-panel--empty': !hasData }">
        <div class="rank-head">
          <div class="rank-head-deco">
            <svg viewBox="0 0 20 14" class="head-leaf">
              <path d="M0 0h16v6H0z" fill="#FFCD5E" opacity=".55" />
              <path d="M4 8h16v6H4z" fill="#FFCD5E" opacity=".75" />
            </svg>
            <span class="rank-title">课程成绩平均分排名</span>
            <svg viewBox="0 0 20 14" class="head-leaf head-leaf--right">
              <path d="M0 0h16v6H0z" fill="#FFCD5E" opacity=".55" />
              <path d="M4 8h16v6H4z" fill="#FFCD5E" opacity=".75" />
            </svg>
          </div>
          <a class="more-link" @click="hasData && (courseRankingDialog = true)">
            更多
            <svg viewBox="0 0 16 16" class="more-arrow"><path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </a>
        </div>

        <div class="podium">
          <div
            v-for="item in coursePodium"
            :key="`c-${item.rank}`"
            :class="['podium-item', `podium-rank-${item.rank}`]"
          >
            <div
              class="podium-card"
              :style="{ backgroundImage: `url(/podium-${item.rank}.png)` }"
            >
              <div class="podium-name" :style="{ color: item.color }">{{ hasData ? item.name : '--' }}</div>
              <div class="podium-score" :style="{ color: item.color }">
                <template v-if="hasData">
                  <span class="podium-score-num">{{ item.score }}</span>
                  <span class="podium-score-unit">分</span>
                </template>
                <span v-else class="podium-score-num">--</span>
              </div>
            </div>
          </div>
        </div>

        <ul v-if="hasData" class="rank-list">
          <li v-for="row in courseList" :key="`cl-${row.rank}`" class="rank-row-item rank-row-item--course">
            <span class="rank-num">{{ row.rank }}</span>
            <span class="rank-name rank-name--course">{{ row.name }}</span>
            <span class="rank-score">{{ row.score }}分</span>
          </li>
        </ul>
      </section>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <div v-for="card in stats" :key="card.label" class="stat-card">
        <img :src="card.icon" alt="" class="stat-icon-img" />
        <div class="stat-text">
          <div class="stat-value">{{ hasData ? card.value : '--' }}</div>
          <div class="stat-label">{{ card.label }}</div>
        </div>
      </div>
    </div>

    <!-- 学院评价情况(柱状图) -->
    <div class="chart-card" :class="{ 'chart-card--empty': !hasData }">
      <template v-if="hasData">
      <div class="chart-legend">
        <span class="legend-item">
          <img src="/icons/stats/legend-blue.png" alt="" class="legend-img" />
          被评总次数
        </span>
        <span class="legend-item">
          <img src="/icons/stats/legend-deepblue.png" alt="" class="legend-img" />
          被评课程总数
        </span>
        <span class="legend-item">
          <img src="/icons/stats/legend-cyan.png" alt="" class="legend-img" />
          被评教员总数
        </span>
      </div>

      <div class="chart-body">
        <div class="chart-y-axis">
          <div
            v-for="t in yTicks"
            :key="`yt-${t}`"
            class="chart-y-tick"
          >{{ t }}</div>
        </div>

        <div class="chart-plot">
          <div
            v-for="t in yTicks"
            :key="`gr-${t}`"
            class="chart-grid-line"
            :style="{ bottom: `${(t / CHART_MAX) * CHART_AXIS_HEIGHT}px` }"
          ></div>

          <div class="chart-bars">
            <div
              v-for="d in departments"
              :key="d.name"
              class="bar-col"
              @mouseenter="showTooltip(d)"
            >
              <div class="bar-stack">
                <div
                  class="bar-segment bar-segment--cyan"
                  :style="{ height: `${barHeight(d.cyan)}px` }"
                ></div>
                <div
                  class="bar-segment bar-segment--blue"
                  :style="{ height: `${barHeight(d.blue)}px` }"
                ></div>
              </div>
              <div class="bar-label">{{ d.name }}</div>

              <!-- 顶部箭头 + 提示框,仅命中目标显示 -->
              <template v-if="tooltipTarget && tooltipTarget.name === d.name">
                <div class="bar-tooltip-arrow"></div>
                <div class="bar-tooltip">
                  <div class="tip-row">
                    <span class="tip-dot tip-dot--blue"></span>
                    <span class="tip-key">被评总次数:</span>
                    <span class="tip-value">{{ totalOf(d) }}</span>
                  </div>
                  <div class="tip-row">
                    <span class="tip-dot tip-dot--blue"></span>
                    <span class="tip-key">被评课程总数:</span>
                    <span class="tip-value">{{ d.blue }}</span>
                  </div>
                  <div class="tip-row">
                    <span class="tip-dot tip-dot--cyan"></span>
                    <span class="tip-key">被评教员总数:</span>
                    <span class="tip-value">{{ d.cyan }}</span>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      </template>
      <div v-else class="chart-empty">
        <h3 class="chart-empty-title">各学院评价数据汇总</h3>
        <div class="chart-empty-body">
          <img src="/empty-data.png" alt="" class="chart-empty-icon" />
          <p class="chart-empty-text">暂无数据</p>
        </div>
      </div>
    </div>
  </div>

    <RankingDialog
      v-model:visible="teacherRankingDialog"
      type="teacher"
      :data="teacherRankingData"
    />
    <RankingDialog
      v-model:visible="courseRankingDialog"
      type="course"
      :data="courseRankingData"
    />
  </div>
</template>

<style scoped>
.evaluation-report {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
}

.content-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(190, 198, 223, 0.4);
  padding: 20px;
  display: flex;
  flex-direction: column;
}

/* ===== 顶部:标题 + 日期 ===== */
.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #191c1e;
  line-height: 22px;
  margin-bottom: 20px;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.date-label {
  font-size: 14px;
  color: #191c1e;
  white-space: nowrap;
}

.date-picker-wrap {
  width: 240px;
  flex: 0 0 240px;
}

.date-picker-wrap :deep(.el-date-editor.el-input__wrapper),
.date-picker-wrap :deep(.el-date-editor.el-range-editor) {
  width: 240px !important;
  min-width: 0 !important;
  max-width: 240px !important;
  height: 36px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  box-shadow: none;
  padding: 0 12px;
  box-sizing: border-box;
}

.date-picker-wrap :deep(.el-range-input) {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 14px;
  color: #000000;
  background: transparent;
  padding: 0;
}

.date-picker-wrap :deep(.el-range-separator) {
  flex: 0 0 auto;
  padding: 0 2px;
  line-height: 36px;
  color: #000000;
  font-size: 14px;
}

.date-picker-wrap :deep(.el-input__icon),
.date-picker-wrap :deep(.el-input__prefix) {
  display: inline-flex;
  align-items: center;
  margin-right: 4px;
}

.date-picker-wrap :deep(.el-input__icon img) {
  width: 16px;
  height: 16px;
  display: block;
}
/* ===== 排名:整体布局 ===== */
.rank-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 20px;
}

.rank-panel {
  position: relative;
  background: linear-gradient(180deg, #FFFBEF 0%, #FFFFFF 100%);
  border-radius: 8px;
  box-shadow: 0px 4px 10px 0px rgba(0, 49, 185, 0.04);
  padding: 24px 30px 20px;
  min-height: 805px;
}

.rank-panel--empty {
  min-height: 360px;
}

.rank-head {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}

.rank-head-deco {
  display: flex;
  align-items: center;
  gap: 12px;
}

.head-leaf {
  width: 20px;
  height: 14px;
  flex: none;
}

.head-leaf--right {
  transform: rotate(180deg);
}

.rank-title {
  font-family: 'YouSheBiaoTiHei', 'PingFang SC', sans-serif;
  font-size: 22px;
  line-height: 22px;
  color: #9A6804;
  letter-spacing: 1px;
  font-weight: 400;
}

.more-link {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #9A6804;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}

.rank-panel--empty .more-link {
  color: #c0c4cc;
  cursor: not-allowed;
}

.more-arrow {
  width: 12px;
  height: 12px;
  flex: none;
}

/* ===== 前三名 ===== */
.podium {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 0;
  height: 280px;
  margin-bottom: 18px;
}

.podium-item {
  width: 190px;
  height: 280px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

.podium-rank-1 { order: 2; }
.podium-rank-2 { order: 1; }
.podium-rank-3 { order: 3; }

.podium-card {
  width: 190px;
  position: relative;
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 100% 100%;
}

.podium-rank-1 .podium-card {
  height: 240px;
}

.podium-rank-2 .podium-card,
.podium-rank-3 .podium-card {
  height: 200px;
}

/* 教员侧:奖牌座整体压低 50px,腾出顶部头像位 */
.rank-panel--teacher .podium-rank-1 .podium-card {
  height: 190px;
}

.rank-panel--teacher .podium-rank-2 .podium-card,
.rank-panel--teacher .podium-rank-3 .podium-card {
  height: 150px;
}

/* 教员头像 50x50,在 flex 列里位于奖牌座正上方,三名头像顶部对齐课程 1 名奖牌座顶部 */
.podium-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  z-index: 2;
  pointer-events: none;
  background: #ffffff;
  flex: none;
}

/* 1 名:课程奖牌座 240px,教员=头像 50 + 0 间距 + 牌座 190 = 240,顶部对齐 */
.rank-panel--teacher .podium-rank-1 .podium-avatar {
  margin-bottom: 0;
}

/* 2/3 名:课程奖牌座 200px,教员=头像 50 + 0 间距 + 牌座 150 = 200,顶部对齐 */
.rank-panel--teacher .podium-rank-2 .podium-avatar,
.rank-panel--teacher .podium-rank-3 .podium-avatar {
  margin-bottom: 0;
}

.podium-name {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 56px;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
}

.podium-score {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 24px;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
}

/* 教员侧奖牌座高度更小,文字位置整体上移 */
.rank-panel--teacher .podium-name {
  bottom: 46px;
}

.rank-panel--teacher .podium-score {
  bottom: 16px;
}

.podium-score-num {
  font-size: 18px;
  font-weight: 500;
  line-height: 25px;
}

.podium-score-unit {
  font-size: 14px;
  font-weight: 500;
}
/* ===== 排名列表 ===== */
.rank-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rank-row-item {
  display: grid;
  grid-template-columns: 30px 34px 1fr auto;
  align-items: center;
  gap: 16px;
  height: 52px;
  padding: 0 30px;
  background: #F6F7FB;
  border-radius: 8px;
}

.rank-row-item--course {
  grid-template-columns: 30px 1fr auto;
}

.rank-num {
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  line-height: 20px;
}

.rank-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: url('/avatar.png') center / cover no-repeat #d5deeb;
  border: 2px solid #fff;
  box-sizing: border-box;
}

.rank-name {
  font-size: 14px;
  color: #000000;
  line-height: 20px;
}

.rank-name--course {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.rank-score {
  font-size: 14px;
  color: #000000;
  line-height: 20px;
  text-align: right;
}

/* ===== 统计卡片 ===== */
.stats-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0px 4px 10px 0px rgba(0, 49, 185, 0.04);
  height: 100px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon-img {
  width: 60px;
  height: 60px;
  flex: none;
  object-fit: contain;
  display: block;
}

.stat-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 500;
  color: #000000;
  line-height: 25px;
}

.stat-label {
  font-size: 12px;
  color: #000000;
  line-height: 17px;
}
/* ===== 学院评价情况柱状图 ===== */
.chart-card {
  position: relative;
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0px 4px 10px 0px rgba(0, 49, 185, 0.04);
  padding: 30px 60px 30px;
  height: 440px;
  overflow: visible;
}

.chart-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  margin-bottom: 20px;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #454545;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  display: inline-block;
}

.legend-img {
  width: 14px;
  height: 14px;
  display: block;
  flex: none;
  object-fit: contain;
}

.legend-dot--ring {
  background: transparent;
  border: 2px solid #34DAFF;
  width: 10px;
  height: 10px;
  border-radius: 4px;
}

.chart-body {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 320px;
  position: relative;
}

.chart-y-axis {
  width: 30px;
  height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 20px; /* leave room for x labels alignment */
  text-align: right;
}

.chart-y-tick {
  font-size: 14px;
  color: #454545;
  line-height: 1;
  text-align: right;
  transform: translateY(50%);
}

.chart-y-tick:first-child {
  transform: translateY(0);
}

.chart-y-tick:last-child {
  transform: translateY(-100%);
}

.chart-plot {
  flex: 1;
  position: relative;
  height: 280px;
  border-bottom: 1px solid #E5E7EB;
}

.chart-grid-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: #E5E7EB;
  pointer-events: none;
}

.chart-bars {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding: 0 16px;
}

.bar-col {
  position: relative;
  width: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bar-stack {
  width: 30px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-end;
}

.bar-segment {
  width: 30px;
}

.bar-segment--blue {
  background: #1947FF;
}

.bar-segment--cyan {
  background: #34DAFF;
}

.bar-label {
  position: absolute;
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  color: #454545;
  white-space: nowrap;
}

/* 图表 tooltip */
.bar-tooltip-arrow {
  position: absolute;
  bottom: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #FFFFFF;
  filter: drop-shadow(0px 3px 4px rgba(59, 74, 116, 0.14));
  width: 0;
  height: 0;
}

.bar-tooltip {
  position: absolute;
  bottom: calc(100% + 16px);
  left: 50%;
  transform: translateX(-50%);
  width: 158px;
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0px 3px 29px 0px rgba(59, 74, 116, 0.14);
  padding: 12px 14px;
  z-index: 5;
}

.tip-row {
  display: grid;
  grid-template-columns: 8px 1fr auto;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #000000;
  line-height: 20px;
  padding: 3px 0;
}

.tip-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}

.tip-dot--blue { background: #1947FF; }
.tip-dot--cyan { background: #34DAFF; }

.tip-key {
  font-weight: 400;
}

.tip-value {
  font-weight: 500;
  text-align: right;
}

/* ===== 空状态 ===== */
.chart-card--empty {
  position: relative;
  display: block;
}

.chart-empty {
  position: absolute;
  inset: 0;
  padding: 30px 60px;
  display: flex;
  flex-direction: column;
}

.chart-empty-title {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #191c1e;
  line-height: 22px;
  margin: 0 0 20px;
}

.chart-empty-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.chart-empty-icon {
  width: 80px;
  height: 80px;
  display: block;
}

.chart-empty-text {
  font-size: 14px;
  color: #191c1e;
  line-height: 20px;
  margin: 0;
}

</style>



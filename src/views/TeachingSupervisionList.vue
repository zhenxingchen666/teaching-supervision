<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { ArrowLeft, ArrowRight, Calendar, RefreshLeft, Search, Tickets } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'

type TabKey = 'in-class' | 'today' | 'all'
type ViewMode = 'list' | 'schedule'
type StatusKey = 'in-class' | 'ended' | 'not-started'

interface Row {
  course: string
  classroom: string
  classroomType: string
  college: string
  teacher: string
  time: string
  date: string
  status: StatusKey
}

const activeTab = ref<TabKey>('in-class')
const tabs: { key: TabKey; label: string }[] = [
  { key: 'in-class', label: '上课中' },
  { key: 'today', label: '今日' },
  { key: 'all', label: '全部' },
]

const viewMode = ref<ViewMode>('list')
const viewOptions = [
  {
    label: '列表视图',
    value: 'list' as ViewMode,
    icon: () => h(ElIcon, null, () => h(Tickets)),
  },
  {
    label: '课表视图',
    value: 'schedule' as ViewMode,
    icon: () => h(ElIcon, null, () => h(Calendar)),
  },
]

const courseTime = ref('')
const courseType = ref('')
const courseDate = ref<[Date, Date] | null>(null)
const keyword = ref('')

const scheduleViewType = ref<'classroom' | 'class' | 'teacher'>('classroom')
const selectedScheduleItem = ref('101-101教室')
const selectedClassName = ref('2026研一5班')
const classSearchKeyword = ref('')
const teacherSearchKeyword = ref('')
const currentWeekStart = ref(new Date('2026-06-15'))

const scheduleViewTypeOptions = [
  { value: 'classroom', label: '教室' },
  { value: 'class', label: '班级' },
  { value: 'teacher', label: '教员' },
]

const classroomOptions = [
  { value: '101-101教室', label: '101-101教室' },
  { value: '103-201教室', label: '103-201教室' },
  { value: 'A-101教室', label: 'A-101教室' },
]

const scheduleTitle = computed(() => {
  if (scheduleViewType.value === 'classroom') return selectedScheduleItem.value
  if (scheduleViewType.value === 'class') return selectedClassName.value
  return selectedTeacherName.value
})

const selectedTeacherName = ref('李老师(教授)')

function onScheduleSearch() {
  if (scheduleViewType.value === 'class') {
    selectedClassName.value = classSearchKeyword.value || '2026研一5班'
  } else if (scheduleViewType.value === 'teacher') {
    selectedTeacherName.value = teacherSearchKeyword.value || '李老师(教授)'
  }
}

function onScheduleReset() {
  classSearchKeyword.value = ''
  teacherSearchKeyword.value = ''
}

const courseTimeOptions = [
  { value: '1', label: '第一节' },
  { value: '2', label: '第二节' },
  { value: '3', label: '第三节' },
  { value: '4', label: '第四节' },
  { value: '5', label: '第五节' },
]

interface ScheduleCourse {
  id: string
  name: string
  className: string
  teacher: string
  classroom: string
  dayOfWeek: number
  startTime: string
  endTime: string
  colorScheme: 'orange' | 'purple' | 'blue' | 'yellow' | 'green'
  status?: 'in-class'
}

const scheduleByClassroom: Record<string, ScheduleCourse[]> = {
  '101-101教室': [
    { id: 'c1-1', name: '高等数学', className: '2026研一5班', teacher: '李老师(教授)', classroom: '101-101教室', dayOfWeek: 1, startTime: '08:00', endTime: '08:45', colorScheme: 'orange' },
    { id: 'c1-2', name: '数学建模', className: '2026研一5班', teacher: '李老师(教授)', classroom: '101-101教室', dayOfWeek: 1, startTime: '16:20', endTime: '17:05', colorScheme: 'orange' },
    { id: 'c1-3', name: '高等数学', className: '2026研一5班', teacher: '李老师(教授)', classroom: '101-101教室', dayOfWeek: 2, startTime: '11:15', endTime: '12:00', colorScheme: 'orange' },
    { id: 'c1-4', name: '概率论与数理统计', className: '2026研一5班', teacher: '刘老师(教授)', classroom: '101-101教室', dayOfWeek: 2, startTime: '14:30', endTime: '17:05', colorScheme: 'blue' },
    { id: 'c1-5', name: '思想道德与法制', className: '2025研二3班', teacher: '刘老师(教授)', classroom: '101-101教室', dayOfWeek: 3, startTime: '08:00', endTime: '08:45', colorScheme: 'yellow' },
    { id: 'c1-6', name: '专业研讨', className: '2026研一5班', teacher: '何老师(教授)', classroom: '101-101教室', dayOfWeek: 4, startTime: '08:00', endTime: '10:20', colorScheme: 'blue' },
    { id: 'c1-7', name: '高等数学', className: '2025研二3班', teacher: '刘老师(副教授)', classroom: '101-101教室', dayOfWeek: 4, startTime: '11:15', endTime: '12:00', colorScheme: 'orange' },
    { id: 'c1-8', name: '形势与政策', className: '2026研一2班', teacher: '汪老师(教授)', classroom: '101-101教室', dayOfWeek: 5, startTime: '11:15', endTime: '12:00', colorScheme: 'blue', status: 'in-class' },
    { id: 'c1-9', name: '人工智能基础', className: '2025研二3班', teacher: '刘老师(教授)', classroom: '101-101教室', dayOfWeek: 5, startTime: '14:30', endTime: '15:15', colorScheme: 'orange' },
    { id: 'c1-10', name: '思想道德与法制', className: '2025研二3班', teacher: '刘老师(教授)', classroom: '101-101教室', dayOfWeek: 6, startTime: '08:00', endTime: '08:45', colorScheme: 'yellow' },
  ],
  '103-201教室': [
    { id: 'c2-1', name: '概率论与数理统计', className: '2026研一2班', teacher: '李老师(教授)', classroom: '103-201教室', dayOfWeek: 1, startTime: '08:00', endTime: '09:40', colorScheme: 'blue' },
    { id: 'c2-2', name: '线性代数', className: '2025研二1班', teacher: '王副主任(副教授)', classroom: '103-201教室', dayOfWeek: 1, startTime: '10:20', endTime: '11:05', colorScheme: 'purple' },
    { id: 'c2-3', name: '高等数学', className: '2026研一3班', teacher: '张老师(讲师)', classroom: '103-201教室', dayOfWeek: 2, startTime: '08:00', endTime: '08:45', colorScheme: 'orange' },
    { id: 'c2-4', name: '大学物理', className: '2026研一2班', teacher: '陈教授(教授)', classroom: '103-201教室', dayOfWeek: 3, startTime: '10:20', endTime: '12:00', colorScheme: 'green' },
    { id: 'c2-5', name: '数值分析', className: '2025研二1班', teacher: '王副主任(副教授)', classroom: '103-201教室', dayOfWeek: 3, startTime: '14:30', endTime: '15:15', colorScheme: 'purple' },
    { id: 'c2-6', name: '概率论与数理统计', className: '2026研一2班', teacher: '李老师(教授)', classroom: '103-201教室', dayOfWeek: 4, startTime: '14:30', endTime: '16:10', colorScheme: 'blue', status: 'in-class' },
    { id: 'c2-7', name: '运筹学', className: '2025研二1班', teacher: '何老师(教授)', classroom: '103-201教室', dayOfWeek: 5, startTime: '08:00', endTime: '09:40', colorScheme: 'yellow' },
    { id: 'c2-8', name: '离散数学', className: '2026研一3班', teacher: '张老师(讲师)', classroom: '103-201教室', dayOfWeek: 5, startTime: '16:20', endTime: '17:05', colorScheme: 'green' },
  ],
  'A-101教室': [
    { id: 'c3-1', name: '人工智能基础', className: '2025研二3班', teacher: '李老师(教授)', classroom: 'A-101教室', dayOfWeek: 1, startTime: '10:20', endTime: '12:00', colorScheme: 'blue' },
    { id: 'c3-2', name: '机器学习', className: '2026研一1班', teacher: '赵老师(副教授)', classroom: 'A-101教室', dayOfWeek: 2, startTime: '08:00', endTime: '09:40', colorScheme: 'green' },
    { id: 'c3-3', name: '深度学习', className: '2025研二3班', teacher: '李老师(教授)', classroom: 'A-101教室', dayOfWeek: 2, startTime: '14:30', endTime: '16:10', colorScheme: 'purple' },
    { id: 'c3-4', name: '数据结构', className: '2026研一1班', teacher: '王副主任(副教授)', classroom: 'A-101教室', dayOfWeek: 3, startTime: '08:00', endTime: '08:45', colorScheme: 'orange' },
    { id: 'c3-5', name: '计算机网络', className: '2026研一1班', teacher: '赵老师(副教授)', classroom: 'A-101教室', dayOfWeek: 4, startTime: '10:20', endTime: '12:00', colorScheme: 'yellow' },
    { id: 'c3-6', name: '人工智能基础', className: '2025研二3班', teacher: '李老师(教授)', classroom: 'A-101教室', dayOfWeek: 5, startTime: '14:30', endTime: '16:10', colorScheme: 'blue', status: 'in-class' },
    { id: 'c3-7', name: '算法设计', className: '2026研一1班', teacher: '王副主任(副教授)', classroom: 'A-101教室', dayOfWeek: 6, startTime: '08:00', endTime: '09:40', colorScheme: 'orange' },
  ],
}

const scheduleByClass: Record<string, ScheduleCourse[]> = {
  '2026研一5班': [
    { id: 'cl1-1', name: '高等数学', className: '2026研一5班', teacher: '李老师(教授)', classroom: '101-101教室', dayOfWeek: 1, startTime: '08:00', endTime: '08:45', colorScheme: 'orange' },
    { id: 'cl1-2', name: '大学英语', className: '2026研一5班', teacher: '赵老师(讲师)', classroom: '102-205教室', dayOfWeek: 1, startTime: '14:30', endTime: '15:15', colorScheme: 'purple' },
    { id: 'cl1-3', name: '数学建模', className: '2026研一5班', teacher: '李老师(教授)', classroom: '101-101教室', dayOfWeek: 1, startTime: '16:20', endTime: '17:05', colorScheme: 'orange' },
    { id: 'cl1-4', name: '高等数学', className: '2026研一5班', teacher: '李老师(教授)', classroom: '101-101教室', dayOfWeek: 2, startTime: '11:15', endTime: '12:00', colorScheme: 'orange' },
    { id: 'cl1-5', name: '概率论与数理统计', className: '2026研一5班', teacher: '刘老师(教授)', classroom: '101-101教室', dayOfWeek: 2, startTime: '14:30', endTime: '17:05', colorScheme: 'blue' },
    { id: 'cl1-6', name: '思想道德与法制', className: '2026研一5班', teacher: '刘老师(教授)', classroom: '103-201教室', dayOfWeek: 3, startTime: '08:00', endTime: '08:45', colorScheme: 'yellow' },
    { id: 'cl1-7', name: '专业研讨', className: '2026研一5班', teacher: '何老师(教授)', classroom: '101-101教室', dayOfWeek: 4, startTime: '08:00', endTime: '10:20', colorScheme: 'blue' },
    { id: 'cl1-8', name: '大学物理', className: '2026研一5班', teacher: '陈教授(教授)', classroom: '103-301教室', dayOfWeek: 5, startTime: '08:00', endTime: '09:40', colorScheme: 'green', status: 'in-class' },
  ],
  '2025研二3班': [
    { id: 'cl2-1', name: '人工智能基础', className: '2025研二3班', teacher: '李老师(教授)', classroom: 'A-101教室', dayOfWeek: 1, startTime: '10:20', endTime: '12:00', colorScheme: 'blue' },
    { id: 'cl2-2', name: '思想道德与法制', className: '2025研二3班', teacher: '刘老师(教授)', classroom: '101-101教室', dayOfWeek: 2, startTime: '08:00', endTime: '08:45', colorScheme: 'yellow' },
    { id: 'cl2-3', name: '深度学习', className: '2025研二3班', teacher: '李老师(教授)', classroom: 'A-101教室', dayOfWeek: 2, startTime: '14:30', endTime: '16:10', colorScheme: 'purple' },
    { id: 'cl2-4', name: '大学英语', className: '2025研二3班', teacher: '赵老师(讲师)', classroom: '102-205教室', dayOfWeek: 3, startTime: '15:25', endTime: '16:10', colorScheme: 'purple' },
    { id: 'cl2-5', name: '高等数学', className: '2025研二3班', teacher: '刘老师(副教授)', classroom: '101-101教室', dayOfWeek: 4, startTime: '11:15', endTime: '12:00', colorScheme: 'orange' },
    { id: 'cl2-6', name: '人工智能基础', className: '2025研二3班', teacher: '李老师(教授)', classroom: 'A-101教室', dayOfWeek: 5, startTime: '14:30', endTime: '16:10', colorScheme: 'blue', status: 'in-class' },
    { id: 'cl2-7', name: '思想道德与法制', className: '2025研二3班', teacher: '刘老师(教授)', classroom: '101-101教室', dayOfWeek: 6, startTime: '08:00', endTime: '08:45', colorScheme: 'yellow' },
  ],
}

const scheduleByTeacher: Record<string, ScheduleCourse[]> = {
  '李老师(教授)': [
    { id: 't1-1', name: '高等数学', className: '2026研一5班', teacher: '李老师(教授)', classroom: '101-101教室', dayOfWeek: 1, startTime: '08:00', endTime: '08:45', colorScheme: 'orange' },
    { id: 't1-2', name: '数学建模', className: '2026研一5班', teacher: '李老师(教授)', classroom: '101-101教室', dayOfWeek: 1, startTime: '16:20', endTime: '17:05', colorScheme: 'orange' },
    { id: 't1-3', name: '概率论与数理统计', className: '2026研一2班', teacher: '李老师(教授)', classroom: '103-201教室', dayOfWeek: 2, startTime: '08:00', endTime: '09:40', colorScheme: 'blue' },
    { id: 't1-4', name: '人工智能基础', className: '2025研二3班', teacher: '李老师(教授)', classroom: 'A-101教室', dayOfWeek: 2, startTime: '14:30', endTime: '16:10', colorScheme: 'purple' },
    { id: 't1-5', name: '高等数学', className: '2026研一5班', teacher: '李老师(教授)', classroom: '101-101教室', dayOfWeek: 3, startTime: '11:15', endTime: '12:00', colorScheme: 'orange' },
    { id: 't1-6', name: '概率论与数理统计', className: '2026研一2班', teacher: '李老师(教授)', classroom: '103-201教室', dayOfWeek: 4, startTime: '14:30', endTime: '16:10', colorScheme: 'blue' },
    { id: 't1-7', name: '人工智能基础', className: '2025研二3班', teacher: '李老师(教授)', classroom: 'A-101教室', dayOfWeek: 5, startTime: '14:30', endTime: '16:10', colorScheme: 'purple', status: 'in-class' },
  ],
  '刘老师(教授)': [
    { id: 't2-1', name: '概率论与数理统计', className: '2026研一5班', teacher: '刘老师(教授)', classroom: '101-101教室', dayOfWeek: 1, startTime: '14:30', endTime: '17:05', colorScheme: 'blue' },
    { id: 't2-2', name: '思想道德与法制', className: '2025研二3班', teacher: '刘老师(教授)', classroom: '101-101教室', dayOfWeek: 2, startTime: '08:00', endTime: '08:45', colorScheme: 'yellow' },
    { id: 't2-3', name: '思想道德与法制', className: '2026研一5班', teacher: '刘老师(教授)', classroom: '103-201教室', dayOfWeek: 3, startTime: '08:00', endTime: '08:45', colorScheme: 'yellow' },
    { id: 't2-4', name: '大学英语', className: '2025研二3班', teacher: '刘老师(教授)', classroom: '102-205教室', dayOfWeek: 3, startTime: '15:25', endTime: '16:10', colorScheme: 'purple' },
    { id: 't2-5', name: '人工智能基础', className: '2025研二3班', teacher: '刘老师(教授)', classroom: '101-101教室', dayOfWeek: 5, startTime: '14:30', endTime: '15:15', colorScheme: 'orange' },
    { id: 't2-6', name: '思想道德与法制', className: '2025研二3班', teacher: '刘老师(教授)', classroom: '101-101教室', dayOfWeek: 6, startTime: '08:00', endTime: '08:45', colorScheme: 'yellow' },
  ],
}

const scheduleCourses = computed<ScheduleCourse[]>(() => {
  if (scheduleViewType.value === 'classroom') {
    return scheduleByClassroom[selectedScheduleItem.value] ?? []
  }
  if (scheduleViewType.value === 'class') {
    return scheduleByClass[selectedClassName.value] ?? []
  }
  return scheduleByTeacher[selectedTeacherName.value] ?? []
})

const timeSlots = [
  { label: '08:00-08:45', start: '08:00', end: '08:45' },
  { label: '08:55-09:40', start: '08:55', end: '09:40' },
  { label: '10:20-11:05', start: '10:20', end: '11:05' },
  { label: '11:15-12:00', start: '11:15', end: '12:00' },
  { label: '14:30-15:15', start: '14:30', end: '15:15' },
  { label: '15:25-16:10', start: '15:25', end: '16:10' },
  { label: '16:20-17:05', start: '16:20', end: '17:05' },
]

const weekDays = computed(() => {
  const days = []
  const start = new Date(currentWeekStart.value)
  for (let i = 0; i < 7; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    days.push({
      dayOfWeek: i + 1,
      label: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'][i],
      date: `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`,
    })
  }
  return days
})

function getCourseStyle(course: ScheduleCourse) {
  const dayIndex = course.dayOfWeek - 1
  const timeIndex = timeSlots.findIndex(slot => slot.start === course.startTime)

  const endTimeIndex = timeSlots.findIndex(slot => slot.end === course.endTime)
  const spanSlots = endTimeIndex - timeIndex + 1

  const colors = {
    orange: { bg: '#FCF2EC', text: '#FF6100', border: 'rgba(255,97,0,0.1)' },
    purple: { bg: '#F2F5FF', text: '#4D19FF', border: 'rgba(77,25,255,0.1)' },
    blue: { bg: '#ECF8FD', text: '#0058E0', border: 'rgba(25,71,255,0.1)' },
    yellow: { bg: '#FBF4E8', text: '#FF9A00', border: 'rgba(255,154,0,0.1)' },
    green: { bg: '#EBFAEA', text: '#369D00', border: 'rgba(0,178,64,0.1)' },
  }

  const scheme = colors[course.colorScheme]
  return {
    gridColumn: dayIndex + 2,
    gridRow: `${timeIndex + 2} / span ${spanSlots}`,
    background: scheme.bg,
    color: scheme.text,
    border: `1px solid ${course.status === 'in-class' ? '#1947FF' : scheme.border}`,
    boxShadow: course.status === 'in-class' ? '0px 10px 20px 0px rgba(190,198,223,0.3)' : 'none',
  }
}

function goPrevWeek() {
  const newDate = new Date(currentWeekStart.value)
  newDate.setDate(newDate.getDate() - 7)
  currentWeekStart.value = newDate
}

function goNextWeek() {
  const newDate = new Date(currentWeekStart.value)
  newDate.setDate(newDate.getDate() + 7)
  currentWeekStart.value = newDate
}

const courseTypeOptions = [
  { value: 'lecture', label: '理论课' },
  { value: 'lab', label: '实验课' },
  { value: 'practice', label: '实训课' },
]

const inClassData: Row[] = [
  { course: '概率论与数理统计', classroom: '103-201教室', classroomType: '智慧教室', college: '理学院', teacher: '李老师（教授）', time: '08:00-09:40', date: '2026-06-17', status: 'in-class' },
  { course: '线性代数', classroom: '103-201教室', classroomType: '智慧教室', college: '理学院', teacher: '王副主任（副教授）', time: '10:20-11:05', date: '2026-06-17', status: 'in-class' },
  { course: '人工智能基础', classroom: 'A-101教室', classroomType: '智慧教室', college: '计算机学院', teacher: '李老师（教授）', time: '10:20-12:00', date: '2026-06-17', status: 'in-class' },
  { course: '机器学习', classroom: 'A-101教室', classroomType: '智慧教室', college: '计算机学院', teacher: '赵老师（副教授）', time: '08:00-09:40', date: '2026-06-17', status: 'in-class' },
  { course: '高等数学', classroom: '101-101教室', classroomType: '多媒体教室', college: '理学院', teacher: '李老师（教授）', time: '08:00-08:45', date: '2026-06-17', status: 'in-class' },
  { course: '思想道德与法制', classroom: '101-101教室', classroomType: '多媒体教室', college: '马克思学院', teacher: '刘老师（教授）', time: '08:00-08:45', date: '2026-06-17', status: 'in-class' },
  { course: '大学英语', classroom: '102-205教室', classroomType: '语音教室', college: '外语学院', teacher: '赵老师（讲师）', time: '10:20-11:05', date: '2026-06-17', status: 'in-class' },
  { course: '数据结构', classroom: 'A-101教室', classroomType: '智慧教室', college: '计算机学院', teacher: '王副主任（副教授）', time: '08:00-08:45', date: '2026-06-17', status: 'in-class' },
  { course: '大学物理', classroom: '103-301教室', classroomType: '实验教室', college: '物理学院', teacher: '陈教授（教授）', time: '08:00-09:40', date: '2026-06-17', status: 'in-class' },
  { course: '专业研讨', classroom: '101-101教室', classroomType: '智慧教室', college: '理学院', teacher: '何老师（教授）', time: '08:00-10:20', date: '2026-06-17', status: 'in-class' },
]

const todayData: Row[] = [
  { course: '概率论与数理统计', classroom: '103-201教室', classroomType: '智慧教室', college: '理学院', teacher: '李老师（教授）', time: '08:00-09:40', date: '2026-06-17', status: 'in-class' },
  { course: '高等数学', classroom: '101-101教室', classroomType: '多媒体教室', college: '理学院', teacher: '李老师（教授）', time: '08:00-08:45', date: '2026-06-17', status: 'in-class' },
  { course: '机器学习', classroom: 'A-101教室', classroomType: '智慧教室', college: '计算机学院', teacher: '赵老师（副教授）', time: '08:00-09:40', date: '2026-06-17', status: 'in-class' },
  { course: '思想道德与法制', classroom: '101-101教室', classroomType: '多媒体教室', college: '马克思学院', teacher: '刘老师（教授）', time: '08:00-08:45', date: '2026-06-17', status: 'ended' },
  { course: '大学物理', classroom: '103-301教室', classroomType: '实验教室', college: '物理学院', teacher: '陈教授（教授）', time: '14:30-16:10', date: '2026-06-17', status: 'not-started' },
  { course: '深度学习', classroom: 'A-101教室', classroomType: '智慧教室', college: '计算机学院', teacher: '李老师（教授）', time: '14:30-16:10', date: '2026-06-17', status: 'not-started' },
  { course: '数学建模', classroom: '101-101教室', classroomType: '智慧教室', college: '理学院', teacher: '李老师（教授）', time: '16:20-17:05', date: '2026-06-17', status: 'not-started' },
  { course: '计算机网络', classroom: 'A-101教室', classroomType: '智慧教室', college: '计算机学院', teacher: '赵老师（副教授）', time: '16:20-17:05', date: '2026-06-17', status: 'not-started' },
  { course: '大学英语', classroom: '102-205教室', classroomType: '语音教室', college: '外语学院', teacher: '赵老师（讲师）', time: '15:25-16:10', date: '2026-06-17', status: 'not-started' },
  { course: '形势与政策', classroom: '101-301教室', classroomType: '多媒体教室', college: '马克思学院', teacher: '汪老师（教授）', time: '11:15-12:00', date: '2026-06-17', status: 'not-started' },
]

const allData: Row[] = [
  { course: '概率论与数理统计', classroom: '103-201教室', classroomType: '智慧教室', college: '理学院', teacher: '李老师（教授）', time: '08:00-09:40', date: '2026-06-17', status: 'in-class' },
  { course: '机器学习', classroom: 'A-101教室', classroomType: '智慧教室', college: '计算机学院', teacher: '赵老师（副教授）', time: '08:00-09:40', date: '2026-06-17', status: 'in-class' },
  { course: '高等数学', classroom: '101-101教室', classroomType: '多媒体教室', college: '理学院', teacher: '李老师（教授）', time: '08:00-08:45', date: '2026-06-17', status: 'in-class' },
  { course: '大学物理', classroom: '103-301教室', classroomType: '实验教室', college: '物理学院', teacher: '陈教授（教授）', time: '08:00-09:40', date: '2026-06-16', status: 'ended' },
  { course: '深度学习', classroom: 'A-101教室', classroomType: '智慧教室', college: '计算机学院', teacher: '李老师（教授）', time: '14:30-16:10', date: '2026-06-16', status: 'ended' },
  { course: '数据结构', classroom: 'A-101教室', classroomType: '智慧教室', college: '计算机学院', teacher: '王副主任（副教授）', time: '08:00-08:45', date: '2026-06-16', status: 'ended' },
  { course: '概率论与数理统计', classroom: '101-101教室', classroomType: '多媒体教室', college: '理学院', teacher: '刘老师（教授）', time: '14:30-17:05', date: '2026-06-16', status: 'ended' },
  { course: '大学英语', classroom: '102-205教室', classroomType: '语音教室', college: '外语学院', teacher: '赵老师（讲师）', time: '15:25-16:10', date: '2026-06-15', status: 'ended' },
  { course: '运筹学', classroom: '103-201教室', classroomType: '智慧教室', college: '理学院', teacher: '何老师（教授）', time: '08:00-09:40', date: '2026-06-15', status: 'ended' },
  { course: '思想道德与法制', classroom: '101-101教室', classroomType: '多媒体教室', college: '马克思学院', teacher: '刘老师（教授）', time: '08:00-08:45', date: '2026-06-14', status: 'ended' },
  { course: '计算机网络', classroom: 'A-101教室', classroomType: '智慧教室', college: '计算机学院', teacher: '赵老师（副教授）', time: '10:20-12:00', date: '2026-06-14', status: 'ended' },
  { course: '专业研讨', classroom: '101-101教室', classroomType: '智慧教室', college: '理学院', teacher: '何老师（教授）', time: '08:00-10:20', date: '2026-06-13', status: 'ended' },
  { course: '线性代数', classroom: '103-201教室', classroomType: '智慧教室', college: '理学院', teacher: '王副主任（副教授）', time: '10:20-11:05', date: '2026-06-13', status: 'ended' },
  { course: '算法设计', classroom: 'A-101教室', classroomType: '智慧教室', college: '计算机学院', teacher: '王副主任（副教授）', time: '08:00-09:40', date: '2026-06-12', status: 'ended' },
  { course: '数值分析', classroom: '103-201教室', classroomType: '智慧教室', college: '理学院', teacher: '王副主任（副教授）', time: '14:30-15:15', date: '2026-06-12', status: 'ended' },
]

const tableData = computed<Row[]>(() => {
  if (activeTab.value === 'today') return todayData
  if (activeTab.value === 'all') return allData
  return inClassData
})

const hasData = computed(() => {
  if (activeTab.value !== 'all') return true
  const range = courseDate.value
  if (!range || !range[0] || !range[1]) return true
  const toStr = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }
  const start = toStr(range[0])
  const end = toStr(range[1])
  return start <= '2026-06-30' && end >= '2026-06-01'
})

const displayedData = computed<Row[]>(() => (hasData.value ? tableData.value : []))

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(156)

function onSearch() {
  currentPage.value = 1
}

function onReset() {
  courseTime.value = ''
  courseType.value = ''
  courseDate.value = null
  keyword.value = ''
  currentPage.value = 1
}
</script>

<template>
  <div class="teaching-supervision-list">
    <div class="card">
      <div class="tabs-row">
        <div v-if="viewMode === 'list'" class="tabs">
          <div
            v-for="tab in tabs"
            :key="tab.key"
            :class="['tab', { active: activeTab === tab.key }]"
            @click="activeTab = tab.key"
          >
            <span>{{ tab.label }}</span>
          </div>
        </div>

        <div v-else class="schedule-controls">
          <el-select v-model="scheduleViewType" style="width: 100px">
            <el-option
              v-for="item in scheduleViewTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-if="scheduleViewType === 'classroom'"
            v-model="selectedScheduleItem"
            style="width: 240px"
          >
            <el-option
              v-for="item in classroomOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-else-if="scheduleViewType === 'class'"
            v-model="classSearchKeyword"
            placeholder="请输入班级名称"
            clearable
            style="width: 240px"
          />
          <el-input
            v-else
            v-model="teacherSearchKeyword"
            placeholder="请输入教员名称"
            clearable
            style="width: 240px"
          />
          <template v-if="scheduleViewType !== 'classroom'">
            <el-button
              type="primary"
              :icon="Search"
              class="btn-search"
              @click="onScheduleSearch"
            >
              搜索
            </el-button>
            <el-button :icon="RefreshLeft" class="btn-reset" @click="onScheduleReset">
              重置
            </el-button>
          </template>
        </div>

        <el-segmented
          v-model="viewMode"
          :options="viewOptions"
          class="view-switcher"
        />
      </div>

      <div v-if="viewMode === 'list'" class="filter-bar">
        <div class="filter-item">
          <label class="filter-label">课程时间</label>
          <el-select
            v-model="courseTime"
            placeholder="请选择"
            clearable
            popper-class="filter-time-popper"
            style="width: 240px"
          >
            <el-option
              v-for="item in courseTimeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <label class="filter-label">课程类型</label>
          <el-select
            v-model="courseType"
            placeholder="请选择"
            clearable
            style="width: 240px"
          >
            <el-option
              v-for="item in courseTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div v-if="activeTab === 'all'" class="filter-item">
          <label class="filter-label">课程日期</label>
          <el-date-picker
            v-model="courseDate"
            type="daterange"
            single-panel
            start-placeholder="请选择"
            end-placeholder=""
            range-separator=""
            :prefix-icon="Calendar"
            popper-class="filter-date-popper"
            class="filter-date-input"
            style="width: 240px"
          />
        </div>
        <el-input
          v-model="keyword"
          placeholder="请输入课程、教室、学院、教员名称"
          style="width: 250px"
          clearable
        />
        <el-button
          type="primary"
          :icon="Search"
          class="btn-search"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="RefreshLeft" class="btn-reset" @click="onReset">
          重置
        </el-button>
      </div>

      <div v-if="viewMode === 'list'" class="table-wrapper">
        <el-table
          v-if="hasData"
          :data="displayedData"
          style="width: 100%"
          row-key="id"
          :header-cell-style="{ background: 'rgba(255,255,255,0.6)', color: 'rgba(0,0,0,0.88)', fontWeight: 500 }"
        >
          <el-table-column prop="course" label="课程" min-width="280" show-overflow-tooltip />
          <el-table-column prop="classroom" label="教室" min-width="160" />
          <el-table-column prop="classroomType" label="教室类型" min-width="120" />
          <el-table-column prop="college" label="学院" min-width="160" />
          <el-table-column prop="teacher" label="教员" min-width="160" />
          <el-table-column
            v-if="activeTab === 'all'"
            prop="date"
            label="课程日期"
            min-width="140"
          />
          <el-table-column prop="time" label="课程时间" min-width="140" />
          <el-table-column label="课程状态" min-width="120">
            <template #default="{ row }">
              <span
                v-if="row.status === 'in-class'"
                class="status-badge status-badge--blue"
              >
                <span class="status-icon" aria-hidden="true">
                  <span class="bar"></span>
                  <span class="bar"></span>
                  <span class="bar"></span>
                  <span class="bar"></span>
                </span>
                上课中
              </span>
              <span
                v-else-if="row.status === 'ended'"
                class="status-badge status-badge--blue"
              >
                <svg
                  class="status-svg-icon"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M10 1.667A8.333 8.333 0 1 1 10 18.333 8.333 8.333 0 0 1 10 1.667Zm-2.5 5.833v5c0 .3.162.577.422.725.26.148.58.144.838-.01l4.166-2.5a.842.842 0 0 0 0-1.43l-4.166-2.5a.844.844 0 0 0-.838-.01.844.844 0 0 0-.422.725Z"
                    fill="#1947FF"
                  />
                </svg>
                已结束
              </span>
              <span
                v-else
                class="status-badge status-badge--gray"
              >
                未开始
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div v-else class="empty-state">
          <img src="/empty-data.png" alt="" class="empty-icon" />
          <p class="empty-text">暂无数据</p>
        </div>
      </div>

      <div v-if="viewMode === 'schedule'" class="schedule-view">
        <div class="schedule-week-nav">
          <button class="week-nav-btn" @click="goPrevWeek">
            <el-icon><ArrowLeft /></el-icon>
            上一周
          </button>
          <h2 class="schedule-title">{{ scheduleTitle }}</h2>
          <button class="week-nav-btn" @click="goNextWeek">
            下一周
            <el-icon><ArrowRight /></el-icon>
          </button>
        </div>

        <div class="schedule-grid">
          <div class="schedule-time-header">上课时间</div>
          <div
            v-for="day in weekDays"
            :key="day.dayOfWeek"
            class="schedule-day-header"
          >
            <div class="day-label">{{ day.label }}</div>
            <div class="day-date">{{ day.date }}</div>
          </div>

          <template v-for="(slot, index) in timeSlots" :key="index">
            <div class="schedule-time-cell">{{ slot.label }}</div>
          </template>

          <div
            v-for="course in scheduleCourses"
            :key="course.id"
            class="schedule-course-card"
            :style="getCourseStyle(course)"
          >
            <div v-if="course.status === 'in-class'" class="course-status-badge">
              <span class="status-icon" aria-hidden="true">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
              </span>
              上课中
            </div>
            <div class="course-name">{{ course.name }}</div>
            <div class="course-class">
              {{ scheduleViewType === 'class' ? course.teacher : course.className }}
            </div>
            <div class="course-teacher">
              {{ scheduleViewType === 'classroom' ? course.teacher : course.classroom }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="viewMode === 'list' && hasData" class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          background
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.teaching-supervision-list {
  width: 100%;
}

.empty-state {
  flex: 1;
  min-height: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 60px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  display: block;
}

.empty-text {
  font-size: 14px;
  color: #191c1e;
  line-height: 20px;
  margin: 0;
}

.card {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 18px;
  padding: 30px;
  min-height: 942px;
  display: flex;
  flex-direction: column;
}

.tabs-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  margin-bottom: 24px;
}

.tabs {
  display: flex;
  gap: 32px;
}

.tab {
  position: relative;
  padding: 8px 4px 14px;
  font-size: 16px;
  color: #000000;
  cursor: pointer;
  user-select: none;
  transition: color 0.2s;
}

.tab:hover:not(.active) {
  color: #1947ff;
}

.tab.active {
  font-weight: 600;
}

.tab.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 48px;
  height: 4px;
  background: #1947ff;
  border-radius: 2px;
}

.view-switcher {
  align-self: center;
  margin-bottom: 8px;
  --el-segmented-bg-color: #ecf3fb;
  --el-segmented-color: #191c1e;
  --el-segmented-item-selected-bg-color: #ffffff;
  --el-segmented-item-selected-color: #1947ff;
  height: 36px;
  padding: 4px;
  border-radius: 6px;
  background: #ecf3fb;
}

.view-switcher :deep(.el-segmented__group) {
  gap: 4px;
}

.view-switcher :deep(.el-segmented__item) {
  width: 98px;
  height: 28px;
  line-height: 28px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 400;
  color: #191c1e;
  background: rgba(255, 255, 255, 0.6);
  transition: color 0.2s, background 0.2s;
}

.view-switcher :deep(.el-segmented__item.is-selected) {
  background: #ffffff;
  color: #1947ff;
  font-weight: 500;
}

.view-switcher :deep(.el-segmented__item-label) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.view-switcher :deep(.el-segmented__item-label .el-icon) {
  font-size: 16px;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.filter-bar :deep(.el-input__wrapper),
.filter-bar :deep(.el-select__wrapper),
.filter-bar :deep(.el-date-editor.el-input__wrapper) {
  border-radius: 8px;
}

.filter-bar :deep(.el-input),
.filter-bar :deep(.el-select),
.filter-bar :deep(.el-date-editor) {
  --el-input-border-radius: 8px;
  --el-border-radius-base: 8px;
}

.filter-date-input.el-date-editor--daterange {
  border-radius: 8px;
}

.filter-date-input :deep(.el-range-separator) {
  display: none;
}

.filter-date-input :deep(.el-range-input:last-of-type) {
  display: none;
}

.filter-date-input :deep(.el-range-input) {
  width: 100%;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  color: #191c1e;
  white-space: nowrap;
}

.btn-search {
  --el-button-bg-color: #1947ff;
  --el-button-border-color: #1947ff;
  --el-button-hover-bg-color: #3a63ff;
  --el-button-hover-border-color: #3a63ff;
  --el-button-active-bg-color: #0f37d9;
  --el-button-active-border-color: #0f37d9;
  --el-button-text-color: #ffffff;
  height: 36px;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 500;
}

.btn-reset {
  --el-button-bg-color: #ffffff;
  --el-button-border-color: #e5e7eb;
  --el-button-hover-bg-color: #f9f9f9;
  --el-button-hover-border-color: #e5e7eb;
  --el-button-hover-text-color: #000000;
  --el-button-active-bg-color: #f0f0f0;
  --el-button-active-border-color: #e5e7eb;
  --el-button-active-text-color: #000000;
  --el-button-text-color: #000000;
  height: 36px;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 400;
}

.table-wrapper {
  margin-bottom: 16px;
}

.table-wrapper :deep(.el-table) {
  background: transparent;
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-row-hover-bg-color: rgba(255, 255, 255, 0.6);
  --el-table-header-bg-color: rgba(255, 255, 255, 0.6);
  --el-table-border-color: #e5e7eb;
}

.table-wrapper :deep(.el-table__inner-wrapper::before) {
  display: none;
}

.table-wrapper :deep(.el-table tr) {
  background: transparent;
}

.table-wrapper :deep(.el-table th.el-table__cell),
.table-wrapper :deep(.el-table td.el-table__cell) {
  border-bottom: 1px solid #e5e7eb;
  padding: 18px 0;
}

.table-wrapper :deep(.el-table .cell) {
  padding-left: 30px;
  padding-right: 16px;
}

.table-wrapper :deep(.el-table thead th:first-child .cell) {
  padding-left: 30px;
}

.table-wrapper :deep(.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell) {
  background: rgba(255, 255, 255, 0.6);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 20px;
}

.status-badge--blue {
  background: #e1ecff;
  color: #1947ff;
}

.status-badge--gray {
  background: #f1f5f9;
  color: rgba(0, 0, 0, 0.88);
  padding: 0 12px;
  gap: 0;
}

.status-svg-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.status-icon {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: flex-end;
  justify-content: center;
  gap: 2px;
  padding-bottom: 3px;
}

.status-icon .bar {
  display: block;
  width: 1.5px;
  height: 14px;
  background: #1947ff;
  border-radius: 1px;
  transform-origin: 50% 100%;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

.status-icon .bar:nth-child(1) {
  animation-name: status-bar-wave-1;
  animation-duration: 1.1s;
}
.status-icon .bar:nth-child(2) {
  animation-name: status-bar-wave-2;
  animation-duration: 1.3s;
}
.status-icon .bar:nth-child(3) {
  animation-name: status-bar-wave-3;
  animation-duration: 0.9s;
}
.status-icon .bar:nth-child(4) {
  animation-name: status-bar-wave-4;
  animation-duration: 1.5s;
}

@keyframes status-bar-wave-1 {
  0% { transform: scaleY(0.3); }
  25% { transform: scaleY(0.9); }
  50% { transform: scaleY(0.5); }
  75% { transform: scaleY(1); }
  100% { transform: scaleY(0.3); }
}

@keyframes status-bar-wave-2 {
  0% { transform: scaleY(0.55); }
  30% { transform: scaleY(0.3); }
  60% { transform: scaleY(1); }
  80% { transform: scaleY(0.6); }
  100% { transform: scaleY(0.55); }
}

@keyframes status-bar-wave-3 {
  0% { transform: scaleY(0.8); }
  20% { transform: scaleY(0.4); }
  50% { transform: scaleY(0.7); }
  70% { transform: scaleY(1); }
  100% { transform: scaleY(0.8); }
}

@keyframes status-bar-wave-4 {
  0% { transform: scaleY(0.4); }
  35% { transform: scaleY(1); }
  55% { transform: scaleY(0.3); }
  85% { transform: scaleY(0.8); }
  100% { transform: scaleY(0.4); }
}

@media (prefers-reduced-motion: reduce) {
  .status-icon .bar {
    animation: none;
    transform: scaleY(0.65);
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 8px 0;
  margin-top: auto;
}

.pagination-wrapper :deep(.el-pagination) {
  --el-pagination-bg-color: transparent;
  --el-pagination-button-bg-color: transparent;
  --el-pagination-hover-color: #1947ff;
  font-weight: normal;
}

.pagination-wrapper :deep(.el-pagination.is-background .el-pager li) {
  background: transparent;
  border: 1px solid transparent;
}

.pagination-wrapper :deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background: transparent;
  color: #1947ff;
  font-weight: 600;
}

.pagination-wrapper :deep(.el-pagination.is-background .btn-prev),
.pagination-wrapper :deep(.el-pagination.is-background .btn-next) {
  background: transparent;
  border: 1px solid #e5e7eb;
}

.schedule-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.schedule-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.schedule-controls :deep(.el-select__wrapper),
.schedule-controls :deep(.el-input__wrapper) {
  border-radius: 8px;
}

.schedule-week-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.schedule-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
  font-weight: 600;
  line-height: 24px;
  color: #191c1e;
  margin: 0;
}

.week-nav-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #191c1e;
  font-size: 13px;
  font-family: PingFang SC;
  line-height: 18px;
  cursor: pointer;
  transition: background 0.2s;
}

.week-nav-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.week-nav-btn .el-icon {
  font-size: 16px;
}

.schedule-grid {
  display: grid;
  grid-template-columns: 110px repeat(7, 1fr);
  grid-template-rows: 48px repeat(7, 100px);
  gap: 10px;
  position: relative;
}

.schedule-time-header {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ecf3fb;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.88);
  padding: 14px 8px;
  white-space: nowrap;
}

.schedule-day-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ecf3fb;
  border-radius: 8px;
  padding: 5px 8px;
  gap: 2px;
}

.day-label {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.88);
  line-height: 20px;
  white-space: nowrap;
}

.day-date {
  font-size: 13px;
  color: rgba(100, 100, 100, 0.88);
  line-height: 18px;
  white-space: nowrap;
}

.schedule-time-cell {
  grid-column: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ecf3fb;
  border-radius: 8px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.88);
  padding: 22px 8px;
  white-space: nowrap;
}

.schedule-course-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
  padding: 20px 16px;
  position: relative;
}

.course-status-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 18px;
  padding: 0 4px;
  background: rgba(25, 71, 255, 0.1);
  border-radius: 4px;
  font-size: 12px;
  color: #1947ff;
  line-height: 18px;
}

.course-name {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
  word-break: break-word;
}

.course-class,
.course-teacher {
  font-size: 13px;
  color: rgba(50, 50, 50, 0.88);
  line-height: 18px;
  text-align: center;
}

</style>

<style>
.filter-time-popper .el-select-dropdown__item:hover,
.filter-time-popper .el-select-dropdown__item.hover {
  background-color: transparent;
  color: #1947ff;
}

.filter-time-popper .el-select-dropdown__item.is-selected {
  color: #1947ff;
}

.filter-date-popper .el-date-table td.start-date .el-date-table-cell__text,
.filter-date-popper .el-date-table td.end-date .el-date-table-cell__text {
  border-radius: 4px;
}

.filter-date-popper .el-date-table td.today .el-date-table-cell__text {
  border-radius: 4px;
}
</style>

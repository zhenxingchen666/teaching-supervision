export interface Building {
  id: string
  name: string
}

export interface Room {
  id: string
  name: string
  buildingId: string
  course?: string
  teacher?: string
  timeSlot?: string
  status: 'active' | 'idle'
  viewers?: number
}

export const buildings: Building[] = [
  { id: '1', name: '第一教学楼' },
  { id: '2', name: '第二教学楼' },
  { id: '3', name: '101教学楼' },
  { id: '4', name: '102教学楼' },
  { id: '5', name: '103教学楼' },
  { id: '6', name: '实验实训大楼' },
  { id: '7', name: '信息综合大楼' },
]

export const rooms: Room[] = [
  // 第一教学楼
  { id: '1-101', name: '101教室', buildingId: '1', course: '概率论与数理统计', teacher: '李老师', timeSlot: '08:00-09:40（1-2节）', status: 'active', viewers: 1 },
  { id: '1-102', name: '102教室', buildingId: '1', status: 'idle' },
  { id: '1-201', name: '201教室', buildingId: '1', course: '线性代数', teacher: '王副主任', timeSlot: '08:00-09:40（1-2节）', status: 'active', viewers: 2 },
  { id: '1-202', name: '202教室', buildingId: '1', course: '高等数学', teacher: '张老师', timeSlot: '10:00-11:40（3-4节）', status: 'active', viewers: 1 },
  { id: '1-103', name: '103教室', buildingId: '1', status: 'idle' },
  { id: '1-301', name: '301教室', buildingId: '1', course: '大学物理', teacher: '陈教授', timeSlot: '08:00-09:40（1-2节）', status: 'active', viewers: 3 },
  { id: '1-302', name: '302教室', buildingId: '1', status: 'idle' },
  { id: '1-303', name: '303教室', buildingId: '1', status: 'idle' },
  { id: '1-304', name: '304教室', buildingId: '1', status: 'idle' },
  { id: '1-305', name: '305教室', buildingId: '1', status: 'idle' },
  { id: '1-306', name: '306教室', buildingId: '1', status: 'idle' },
  { id: '1-307', name: '307教室', buildingId: '1', status: 'idle' },

  // 第二教学楼
  { id: '2-A101', name: 'A-101', buildingId: '2', course: '人工智能基础', teacher: '李老师', timeSlot: '08:00-09:40（1-2节）', status: 'active', viewers: 1 },
  { id: '2-A102', name: 'A-102', buildingId: '2', status: 'idle' },
  { id: '2-A103', name: 'A-103', buildingId: '2', course: '人工智能基础', teacher: '王副主任', timeSlot: '08:00-09:40（1-2节）', status: 'active', viewers: 2 },
  { id: '2-A104', name: 'A-104', buildingId: '2', status: 'idle' },
  { id: '2-A105', name: 'A-105', buildingId: '2', course: '人工智能基础', teacher: '陈教授', timeSlot: '08:00-09:40（1-2节）', status: 'active', viewers: 1 },
  { id: '2-A106', name: 'A-106', buildingId: '2', course: '人工智能基础', teacher: '刘老师', timeSlot: '08:00-09:40（1-2节）', status: 'active', viewers: 0 },
]

export interface CourseDetail {
  roomId: string
  courseName: string
  teacher: string
  className: string
  roomLabel: string
  viewers: number
  interaction: { count: number; publish: number; attendance: string }
  rapid: { total: number; participants: number; rate: string }
  question: { publish: number; random: number; named: number }
  quiz: { publish: number; total: number; participateRate: string; correctRate: string }
}

export const courseDetails: Record<string, CourseDetail> = {
  '1-101': {
    roomId: '1-101',
    courseName: '概率论与数理统计',
    teacher: '李老师',
    className: '大一20班',
    roomLabel: '103-201',
    viewers: 1,
    interaction: { count: 14, publish: 5, attendance: '100%' },
    rapid: { total: 27, participants: 4, rate: '99%' },
    question: { publish: 3, random: 7, named: 20 },
    quiz: { publish: 10, total: 12, participateRate: '45%', correctRate: '98%' },
  },
  '1-201': {
    roomId: '1-201',
    courseName: '线性代数',
    teacher: '王副主任',
    className: '大二10班',
    roomLabel: '103-101',
    viewers: 2,
    interaction: { count: 8, publish: 3, attendance: '95%' },
    rapid: { total: 15, participants: 6, rate: '87%' },
    question: { publish: 5, random: 3, named: 12 },
    quiz: { publish: 6, total: 8, participateRate: '60%', correctRate: '85%' },
  },
  '1-202': {
    roomId: '1-202',
    courseName: '高等数学',
    teacher: '张老师',
    className: '大一15班',
    roomLabel: '103-202',
    viewers: 1,
    interaction: { count: 20, publish: 8, attendance: '98%' },
    rapid: { total: 30, participants: 10, rate: '92%' },
    question: { publish: 7, random: 5, named: 18 },
    quiz: { publish: 12, total: 15, participateRate: '72%', correctRate: '90%' },
  },
  '1-301': {
    roomId: '1-301',
    courseName: '大学物理',
    teacher: '陈教授',
    className: '大一18班',
    roomLabel: '103-301',
    viewers: 3,
    interaction: { count: 11, publish: 4, attendance: '97%' },
    rapid: { total: 20, participants: 8, rate: '95%' },
    question: { publish: 4, random: 6, named: 15 },
    quiz: { publish: 8, total: 10, participateRate: '55%', correctRate: '92%' },
  },
  '2-A101': {
    roomId: '2-A101',
    courseName: '人工智能基础',
    teacher: '李老师',
    className: '大三5班',
    roomLabel: 'A-101',
    viewers: 1,
    interaction: { count: 16, publish: 6, attendance: '96%' },
    rapid: { total: 22, participants: 5, rate: '88%' },
    question: { publish: 6, random: 4, named: 10 },
    quiz: { publish: 9, total: 11, participateRate: '65%', correctRate: '91%' },
  },
}

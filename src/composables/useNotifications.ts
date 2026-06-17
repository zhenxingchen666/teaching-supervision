import { computed, ref } from 'vue'

export interface NotificationItem {
  id: string
  title: string
  date: string
  unread: boolean
  type: 'message' | 'todo' | 'done'
  content?: string
}

const items = ref<NotificationItem[]>([
  {
    id: '1',
    title: '李老师（103-201）概率论课堂互动异常',
    date: '6月17日',
    unread: true,
    type: 'message',
    content: `<p>尊敬的督导：</p><p>103-201教室李老师的《概率论与数理统计》课程在第2节课（08:55-09:40）期间，系统检测到课堂互动频率低于平均水平。</p><p><b>详情：</b></p><p>1. 当前互动次数：2次（同期平均：8次）</p><p>2. 学生应答率：35%（同期平均：75%）</p><p>请关注该课堂教学状况。</p>`,
  },
  {
    id: '2',
    title: '陈教授申请调课：大学物理（6月18日）',
    date: '6月16日',
    unread: true,
    type: 'message',
    content: '<p>尊敬的督导：</p><p>物理学院陈教授申请将6月18日（周三）103-301教室的《大学物理》课程调整至6月20日（周五）同一时段。原因：学术会议出差。请审批。</p>',
  },
  {
    id: '3',
    title: '本周巡课统计报告已生成',
    date: '6月15日',
    unread: false,
    type: 'message',
    content: '<p>本周巡课统计：</p><p>累计巡课 32 次，覆盖 18 个教室，发现问题 3 项（已反馈），优秀课堂 5 次。详细报告请前往"巡视数据"模块查看。</p>',
  },
  { id: '4', title: '待完成：A-103教室王副主任课堂评价', date: '6月17日', unread: true, type: 'todo', content: '<p>您于6月17日巡课A-103教室王副主任的《数据结构》课程，请在48小时内完成在线评价。</p>' },
  { id: '5', title: '已完成：103-202教室张老师课堂评价', date: '6月16日', unread: false, type: 'done', content: '<p>您已完成103-202教室张老师《高等数学》课堂评价，评价等级：优秀。</p>' },
])

const hasUnreadMessages = computed(() =>
  items.value.some((it) => it.type === 'message' && it.unread),
)

function markAsRead(id: string) {
  const item = items.value.find((it) => it.id === id)
  if (item) item.unread = false
}

function markAllReadInType(type: NotificationItem['type']) {
  items.value.forEach((it) => {
    if (it.type === type) it.unread = false
  })
}

export function useNotifications() {
  return {
    items,
    hasUnreadMessages,
    markAsRead,
    markAllReadInType,
  }
}

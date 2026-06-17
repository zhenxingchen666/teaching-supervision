<script setup lang="ts">
import { ref, computed } from 'vue'
import MessageDetailDialog from './MessageDetailDialog.vue'
import { useNotifications, type NotificationItem } from '../composables/useNotifications'

type TabKey = 'message' | 'todo' | 'done'

const activeTab = ref<TabKey>('message')

const tabs: { key: TabKey; label: string }[] = [
  { key: 'message', label: '消息' },
  { key: 'todo', label: '待办' },
  { key: 'done', label: '已办' },
]

const { items, markAsRead, markAllReadInType } = useNotifications()

const visibleItems = computed(() =>
  items.value.filter((it) => it.type === activeTab.value),
)

function markAllRead() {
  markAllReadInType(activeTab.value)
}

const showDetail = ref(false)
const detailItem = ref<NotificationItem | null>(null)

function openDetail(item: NotificationItem) {
  markAsRead(item.id)
  detailItem.value = item
  showDetail.value = true
}
</script>

<template>
  <div class="notification-panel">
    <!-- tabs -->
    <div class="panel-tabs">
      <div
        v-for="t in tabs"
        :key="t.key"
        :class="['tab-item', { active: activeTab === t.key }]"
        @click="activeTab = t.key"
      >
        {{ t.label }}
        <span v-if="activeTab === t.key" class="tab-indicator"></span>
      </div>
    </div>
    <div class="tabs-divider"></div>

    <!-- list -->
    <div class="panel-list">
      <div
        v-for="item in visibleItems"
        :key="item.id"
        :class="['list-item', { read: !item.unread }]"
        @click="openDetail(item)"
      >
        <div class="avatar">
          <svg viewBox="0 0 16 16" fill="none">
            <path
              d="M8 8.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 1c-2.5 0-5 1.3-5 3.5v0.5h10v-0.5c0-2.2-2.5-3.5-5-3.5Z"
              fill="#1947FF"
            />
          </svg>
          <span v-if="item.unread" class="red-dot"></span>
        </div>
        <span class="item-title">{{ item.title }}</span>
        <span class="item-date">{{ item.date }}</span>
      </div>

      <div v-if="!visibleItems.length" class="empty-state">
        暂无{{ tabs.find((t) => t.key === activeTab)?.label }}
      </div>
    </div>

    <!-- footer -->
    <div class="panel-divider"></div>
    <div class="panel-footer">
      <span class="read-all" @click="markAllRead">一键已读</span>
    </div>

    <!-- message detail dialog -->
    <MessageDetailDialog
      v-if="detailItem"
      v-model:visible="showDetail"
      :title="detailItem.title"
      :date="detailItem.date"
      :content="detailItem.content ?? ''"
    />
  </div>
</template>

<style scoped>
.notification-panel {
  width: 400px;
  height: 392px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(190, 198, 223, 0.4);
  display: flex;
  flex-direction: column;
  padding: 20px 24px;
  box-sizing: border-box;
  overflow: hidden;
}

.panel-tabs {
  display: flex;
  gap: 30px;
  padding-bottom: 12px;
  flex-shrink: 0;
}

.tab-item {
  position: relative;
  font-size: 14px;
  font-weight: 500;
  color: #191c1e;
  cursor: pointer;
  line-height: 20px;
  padding-bottom: 8px;
  transition: color 0.15s;
}

.tab-item:hover:not(.active) {
  color: #1947ff;
}

.tab-item.active {
  color: #1947ff;
}

.tab-indicator {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 28px;
  height: 4px;
  background: #1947ff;
  border-radius: 2px;
}

.tabs-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 0 -24px;
  flex-shrink: 0;
}

.panel-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 8px 0;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}

.list-item:hover {
  background: #f5f8ff;
}

.list-item.read {
  opacity: 0.6;
}

.avatar {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e9efff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar svg {
  width: 16px;
  height: 16px;
}

.red-dot {
  position: absolute;
  top: 0;
  right: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #e30000;
  border: 2px solid #ffffff;
  box-sizing: content-box;
  transform: translate(2px, -2px);
}

.item-title {
  flex: 1;
  font-size: 14px;
  color: #000000;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.item-date {
  font-size: 12px;
  color: #8c8c8c;
  line-height: 16px;
  flex-shrink: 0;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 13px;
  color: #b8c0cc;
}

.panel-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 0 -24px;
  flex-shrink: 0;
}

.panel-footer {
  padding-top: 10px;
  flex-shrink: 0;
}

.read-all {
  font-size: 12px;
  color: #8c8c8c;
  cursor: pointer;
  line-height: 17px;
  user-select: none;
  transition: color 0.15s;
}

.read-all:hover {
  color: #1947ff;
}
</style>

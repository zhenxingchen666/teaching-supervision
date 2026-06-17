<script setup lang="ts">
import { ref, watch } from 'vue'

interface NavItem {
  label: string
  icon?: string
  children?: NavItem[]
}

const props = defineProps<{ modelValue?: string }>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const navItems: NavItem[] = [
  { label: '首页', icon: '/nav-home.png' },
  { label: '教学督导', icon: '/nav-supervision.png' },
  { label: '教室巡课', icon: '/nav-patrol.png' },
  { label: '评价系统', icon: '/nav-rating.png', children: [
    { label: '模板管理' },
    { label: '分类管理' },
    { label: '指标管理' },
    { label: '选项管理' },
    { label: '评价报表' },
    { label: '评价记录' },
  ]},
  { label: '巡课记录', icon: '/nav-record.png' },
  { label: '巡视数据', icon: '/nav-data.png' },
  { label: '留言记录', icon: '/nav-message.png' },
  { label: '教学回看', icon: '/nav-replay.png' },
]

const activeItem = ref(props.modelValue ?? '首页')
const expandedItems = ref<Set<string>>(new Set())

watch(
  () => props.modelValue,
  v => {
    if (v && v !== activeItem.value) activeItem.value = v
  },
)

function setActive(label: string) {
  activeItem.value = label
  emit('update:modelValue', label)
}

function handleClick(item: NavItem) {
  if (item.children) {
    if (expandedItems.value.has(item.label)) {
      expandedItems.value.delete(item.label)
    } else {
      expandedItems.value.add(item.label)
    }
  } else {
    setActive(item.label)
  }
}

function handleChildClick(child: NavItem) {
  setActive(child.label)
}
</script>

<template>
  <nav class="sidebar">
    <div class="nav-list">
      <template v-for="item in navItems" :key="item.label">
        <div
          :class="['nav-item', { active: activeItem === item.label, expanded: expandedItems.has(item.label) }]"
          @click="handleClick(item)"
        >
          <div class="indicator" v-if="activeItem === item.label"></div>
          <img v-if="item.icon" :src="item.icon" alt="" class="nav-icon" />
          <span class="nav-label">{{ item.label }}</span>
          <img v-if="item.children" src="/icons/svg_005c4897.svg" alt="" :class="['expand-arrow', { rotated: expandedItems.has(item.label) }]" />
        </div>
        <transition name="slide">
          <div v-if="item.children && expandedItems.has(item.label)" class="sub-list">
            <div
              v-for="child in item.children"
              :key="child.label"
              :class="['nav-item', 'sub-item', { active: activeItem === child.label }]"
              @click="handleChildClick(child)"
            >
              <span class="nav-label">{{ child.label }}</span>
            </div>
          </div>
        </transition>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.sidebar {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 44px 0 10px;
  overflow-y: auto;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  position: relative;
  height: 48px;
  display: flex;
  align-items: center;
  padding: 0 16px 0 20px;
  margin: 0 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.nav-item:hover:not(.active) {
  background: rgba(0, 71, 255, 0.06);
}

.nav-item:active:not(.active) {
  background: rgba(0, 71, 255, 0.12);
  transform: scale(0.98);
}

.nav-item.active {
  background: #1947ff;
  box-shadow: 0 6px 16px 0 rgba(0, 71, 255, 0.3);
}

.nav-item.active .nav-label {
  color: #ffffff;
  font-weight: 500;
}

.nav-item.active .nav-icon {
  filter: brightness(0) invert(1);
}

.nav-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  flex-shrink: 0;
  transition: filter 0.2s;
}

.expand-arrow {
  position: absolute;
  right: 12px;
  width: 12px;
  height: 12px;
  transition: transform 0.3s ease;
}

.expand-arrow.rotated {
  transform: rotate(90deg);
}

.sub-list {
  overflow: hidden;
}

.nav-item.sub-item {
  padding-left: 44px;
  height: 44px;
}

.indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 24px;
  background: #ffffff;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
}

.nav-label {
  font-size: 16px;
  color: #000000;
  line-height: 22px;
  transition: color 0.2s;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>

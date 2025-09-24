<template>
  <div class="avatar-selector-widget">
    <div class="avatar-scroll-container" ref="avatarScrollContainer"
         @mousedown="handleMouseDown"
         @mouseup="handleMouseUp"
         @mousemove="handleMouseMove"
         @click.stop>
      <div class="avatar-list">
        <div 
          v-for="(avatar, index) in avatarOptions" 
          :key="index"
          class="avatar-option"
          :class="{ active: selectedAvatar === avatar }"
          @click="selectAvatar(avatar)"
        >
          <img :src="avatar" :alt="`头像${index + 1}`" class="avatar-thumb">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    default: () => [
      'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar1',
      'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar2',
      'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar3',
      'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar4',
      'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar5',
      'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar6',
      'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar7',
      'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar8',
      'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar9',
      'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar10'
    ]
  },
  currentUserAvatar: {
    type: String,
    default: ''
  },
  scrollSensitivity: {
    type: Number,
    default: 1.5
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'change'])

// 响应式数据
const selectedAvatar = ref(props.modelValue)
const avatarScrollContainer = ref(null)

// 鼠标拖动滚动相关状态
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

// 头像选项
const avatarOptions = ref([...props.options])

// 初始化头像选项，如果当前用户头像不在选项中，添加到中间位置
const initializeAvatarOptions = () => {
  if (props.currentUserAvatar && !avatarOptions.value.includes(props.currentUserAvatar)) {
    const middleIndex = Math.floor(avatarOptions.value.length / 2)
    avatarOptions.value.splice(middleIndex, 0, props.currentUserAvatar)
  }
}

// 选择头像
const selectAvatar = (avatar) => {
  selectedAvatar.value = avatar
  emit('update:modelValue', avatar)
  emit('change', avatar)
}

// 鼠标拖动滚动方法
const handleMouseDown = (e) => {
  if (!avatarScrollContainer.value) return
  
  isDragging.value = true
  startX.value = e.pageX - avatarScrollContainer.value.offsetLeft
  scrollLeft.value = avatarScrollContainer.value.scrollLeft
  avatarScrollContainer.value.style.cursor = 'grabbing'
  avatarScrollContainer.value.style.userSelect = 'none'
}

const handleMouseUp = () => {
  if (!avatarScrollContainer.value) return
  
  isDragging.value = false
  avatarScrollContainer.value.style.cursor = 'grab'
  avatarScrollContainer.value.style.userSelect = 'auto'
}

const handleMouseMove = (e) => {
  if (!isDragging.value || !avatarScrollContainer.value) return
  
  e.preventDefault()
  const x = e.pageX - avatarScrollContainer.value.offsetLeft
  const walk = (x - startX.value) * props.scrollSensitivity
  const newScrollLeft = scrollLeft.value - walk
  
  // 获取滚动边界
  const container = avatarScrollContainer.value
  const maxScrollLeft = container.scrollWidth - container.clientWidth
  
  // 限制滚动范围，但保持敏捷性
  const finalScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft))
  container.scrollLeft = finalScrollLeft
}

// 全局鼠标事件处理
const handleGlobalMouseUp = () => {
  if (isDragging.value) {
    isDragging.value = false
    if (avatarScrollContainer.value) {
      avatarScrollContainer.value.style.cursor = 'grab'
      avatarScrollContainer.value.style.userSelect = 'auto'
    }
  }
}

// 滚动到选中的头像
const scrollToSelectedAvatar = () => {
  if (!avatarScrollContainer.value || !selectedAvatar.value) return
  
  const container = avatarScrollContainer.value
  const selectedElement = container.querySelector('.avatar-option.active')
  
  if (selectedElement) {
    const containerRect = container.getBoundingClientRect()
    const elementRect = selectedElement.getBoundingClientRect()
    const listRect = container.querySelector('.avatar-list').getBoundingClientRect()
    
    const elementLeft = elementRect.left - listRect.left
    const containerWidth = containerRect.width
    const elementWidth = elementRect.width
    
    const scrollLeft = elementLeft - (containerWidth / 2) + (elementWidth / 2)
    
    container.scrollTo({
      left: Math.max(0, scrollLeft),
      behavior: 'smooth'
    })
  }
}

// 设置默认选中头像
const setDefaultAvatar = () => {
  if (props.currentUserAvatar && avatarOptions.value.includes(props.currentUserAvatar)) {
    // 如果当前用户头像存在且在选项中，则选中
    selectedAvatar.value = props.currentUserAvatar
    emit('update:modelValue', props.currentUserAvatar)
  } else if (props.modelValue && avatarOptions.value.includes(props.modelValue)) {
    // 如果 modelValue 存在且在选项中，则选中
    selectedAvatar.value = props.modelValue
  } else {
    // 如果都不存在，则不选中任何头像
    selectedAvatar.value = ''
    emit('update:modelValue', '')
  }
}

// 监听 props.modelValue 变化
watch(() => props.modelValue, (newValue) => {
  selectedAvatar.value = newValue
  if (newValue) {
    nextTick(() => {
      scrollToSelectedAvatar()
    })
  }
})

// 监听 props.options 变化
watch(() => props.options, (newOptions) => {
  avatarOptions.value = newOptions
}, { deep: true })

// 生命周期
onMounted(() => {
  // 添加全局鼠标事件监听器
  document.addEventListener('mouseup', handleGlobalMouseUp)
  
  // 初始化头像选项
  initializeAvatarOptions()
  
  // 设置默认选中头像
  setDefaultAvatar()
  
  // 只有在有选中头像时才滚动到居中位置
  if (selectedAvatar.value) {
    nextTick(() => {
      scrollToSelectedAvatar()
    })
  }
})

onUnmounted(() => {
  // 移除全局鼠标事件监听器
  document.removeEventListener('mouseup', handleGlobalMouseUp)
})
</script>

<style scoped>
.avatar-selector-widget {
  width: 100%;
}

.avatar-scroll-container {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: auto;
  padding: 8px 0;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  cursor: grab;
  user-select: none;
  position: relative;
  z-index: 10;
  /* 优化滚动性能 */
  will-change: scroll-position;
  transform: translateZ(0);
}

.avatar-scroll-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.avatar-scroll-container:active {
  cursor: grabbing;
}

.avatar-list {
  display: flex;
  gap: 12px;
  padding: 0 8px;
  min-width: max-content;
  width: max-content;
}

.avatar-option {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 50%;
  padding: 0;
  border: 2px solid transparent;
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-option:hover {
  transform: scale(1.1);
}

.avatar-option.active {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(191, 254, 1, 0.3);
  border-width: 3px;
  width: 50px;
  height: 50px;
}

.avatar-thumb {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
  pointer-events: none;
}

.avatar-option.active .avatar-thumb {
  width: 44px;
  height: 44px;
}

.avatar-option:hover .avatar-thumb {
  border-color: var(--color-primary);
}
</style>

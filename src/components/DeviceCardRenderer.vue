<template>
  <div class="device-card-renderer">
    <div v-if="device" class="device-card">
      <component 
        :is="deviceComponent" 
        v-bind="deviceProps"
        :device="device"
      />
    </div>
    <div v-else class="no-device">
      <p>未找到设备或设备不支持</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getDeviceComponent } from '../utils/deviceComponents'

const props = defineProps({
  device: {
    type: Object,
    required: true
  },
  additionalProps: {
    type: Object,
    default: () => ({})
  }
})

// 根据设备信息获取对应的组件
const deviceComponent = computed(() => {
  if (!props.device?.cardName) {
    return null
  }
  
  return getDeviceComponent(props.device.cardName)
})

// 合并设备属性和额外属性
const deviceProps = computed(() => {
  return {
    ...props.additionalProps,
    device: props.device
  }
})
</script>

<style scoped>
.device-card-renderer {
  width: 100%;
  height: 100%;
}

.device-card {
  width: 100%;
  height: 100%;
}

.no-device {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: #f5f5f5;
  border-radius: 8px;
  color: #666;
}
</style>

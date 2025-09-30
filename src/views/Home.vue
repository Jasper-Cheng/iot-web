<template>
  <div class="home-page">
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧内容区域（房间导航 + 空调控制） -->
      <div class="left-section">
        <!-- 房间导航栏 -->
        <div class="room-navigation">
          <button 
            v-for="room in rooms" 
            :key="room.id"
            :class="['room-btn', { active: room.id === activeRoom }]"
            @click="setActiveRoom(room.id)"
          >
            {{ room.name }}
          </button>
        </div>

        <div class="room-content">
          <!-- 动态渲染设备卡片 -->
          <div 
            v-for="device in filteredDevices" 
            :key="device.id"
            :class="['device-wrapper', { disabled: !canControlDevice(device.id) }]"
            :title="!canControlDevice(device.id) ? '您没有权限控制此设备' : ''"
          >
            <component 
              :is="getDeviceComponent(device.cardName)"
              :device="device"
            />
            <!-- 修改设备名称按钮 -->
            <button 
              v-if="canControlDevice(device.id)"
              class="edit-name-btn"
              @click="openEditNameModal(device)"
              :title="'修改设备名称'"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="right-section">
       <!-- 智能控制面板 -->
       <SmartControlPanel />
        <CheckinCalendar @checkin-success="handleCheckinSuccess" />
        <ColorControlPanel />
        <EnergyPanel />
        <DeviceStatsPanel :rooms="roomsWithDevices" />
      </div>
    </div>

    <!-- 修改设备名称弹窗 -->
    <div v-if="showEditNameModal" class="device-modal" @click="closeEditNameModal">
      <div class="delete-modal-content" @click.stop>
        <div class="delete-modal-header">
          <h3>修改设备名称</h3>
          <button class="delete-close-btn" @click="closeEditNameModal">X</button>
        </div>
        <div class="delete-modal-body">
          <input 
            class="input" 
            v-model="editingDeviceName" 
            placeholder="请输入新的设备名称" 
            @keyup.enter="confirmEditName" 
            :disabled="isEditingName"
          />
        </div>
        <div class="delete-modal-footer">
          <button class="cancel-btn" @click="closeEditNameModal" :disabled="isEditingName">取消</button>
          <button class="action-btn success" @click="confirmEditName" :disabled="isEditingName || !editingDeviceName.trim()">
            {{ isEditingName ? '修改中...' : '确认' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useGlobalStore } from '../stores/global'
import { getDeviceComponent } from '../utils/deviceComponents'
import { updateDeviceName } from '../api/devices'
import { useDeviceRealtime } from '../composables/useDeviceRealtime'
import WiFiCard from '../cards/WiFiCard.vue'
import TvCard from '../cards/TvCard.vue'
import MusicCard from '../cards/MusicCard.vue'
import SocketsCard from '../cards/SocketsCard.vue'
import CheckinCalendar from '../components/CheckinCalendar.vue'
import ColorControlPanel from '../components/ColorControlPanel.vue'
import EnergyPanel from '../components/EnergyPanel.vue'
import DeviceStatsPanel from '../components/DeviceStatsPanel.vue'
import SmartControlPanel from '../components/SmartControlPanel.vue'
import { ElMessage } from 'element-plus'

// 全局状态
const globalStore = useGlobalStore()

// 实时数据管理
const {
  connectionState,
  deviceData,
  deviceStatus,
  getDeviceData,
  getDeviceStatus,
  isDeviceOnline,
  getDeviceTemperature,
  getDeviceHumidity,
  getDevicePower,
  getDeviceFanSpeed,
  getDevicePowerState,
  subscribeMultipleDevices
} = useDeviceRealtime()

// 权限检查方法
const isOwner = computed(() => {
  return globalStore.user?.role === 'owner' || globalStore.user?.account?.role === 'owner'
})

const isMember = computed(() => {
  return globalStore.user?.role === 'member' || globalStore.user?.account?.role === 'member'
})

// 检查当前用户是否有权限控制指定设备
const canControlDevice = (deviceId) => {
  // Owner可以控制所有设备
  if (isOwner.value) {
    return true
  }
  
  // Member只能控制自己有权限的设备
  if (isMember.value) {
    const currentUser = globalStore.members?.find(member => 
      member.id === globalStore.user?.id || member.user_id === globalStore.user?.id
    )
    return currentUser?.deviceIds?.includes(deviceId) || false
  }
  
  return false
}

// =========================
// Room navigation data/state
// - rooms: includes an 'all' option for the navigation only
// - activeRoom: current nav selection (defaults to 'all')
// =========================
const rooms = computed(() => {
  const allRooms = globalStore.rooms || []
  return [
    { id: 'all', name: 'All' },
    ...allRooms.map(room => ({
      id: room.id,
      name: room.name
    }))
  ]
})

// 当前选中的房间
const activeRoom = ref('all')

// 修改设备名称相关状态
const showEditNameModal = ref(false)
const editingDevice = ref(null)
const editingDeviceName = ref('')

// 处理签到成功
const handleCheckinSuccess = (response) => {
  ElMessage.success('签到成功，获得积分:' + response.points_earned)
  // 如果需要刷新积分显示，可以触发父组件的积分更新
}
const isEditingName = ref(false)


// 过滤后的设备列表（包含实时数据）
const filteredDevices = computed(() => {
  const allDevices = globalStore.devices || []
  let devices = []
  
  if (activeRoom.value === 'all') {
    // 显示所有设备
    devices = allDevices.filter(device => device.cardName)
  } else {
    // 显示选中房间的设备
    const selectedRoom = globalStore.rooms?.find(room => room.id === activeRoom.value)
    
    if (!selectedRoom) {
      return []
    }
    
    const roomDeviceIds = selectedRoom.devices?.map(rd => rd.device_id) || []
    
    devices = allDevices.filter(device => 
      roomDeviceIds.includes(device.id) && device.cardName
    )
  }
  
  // 为每个设备添加实时数据
  return devices.map(device => {
    const realtimeData = getDeviceData(device.id)
    const realtimeStatus = getDeviceStatus(device.id)
    
    return {
      ...device,
      // 实时数据
      realtimeData,
      realtimeStatus,
      // 实时状态
      isOnline: isDeviceOnline(device.id),
      temperature: getDeviceTemperature(device.id),
      humidity: getDeviceHumidity(device.id),
      power: getDevicePower(device.id),
      fanSpeed: getDeviceFanSpeed(device.id),
      powerState: getDevicePowerState(device.id),
      // 连接状态
      connectionState: connectionState.value
    }
  })
})

// 监听设备列表变化，自动订阅设备事件
watch(filteredDevices, async (newDevices) => {
  if (newDevices.length > 0 && connectionState.value === 'connected') {
    try {
      await subscribeMultipleDevices(newDevices)
      console.log('已订阅设备事件:', newDevices.map(d => d.id))
    } catch (error) {
      console.error('订阅设备事件失败:', error)
    }
  }
}, { immediate: true })

// 监听连接状态变化
watch(connectionState, async (newState) => {
  if (newState === 'connected' && filteredDevices.value.length > 0) {
    try {
      await subscribeMultipleDevices(filteredDevices.value)
      console.log('连接恢复，重新订阅设备事件')
    } catch (error) {
      console.error('重新订阅设备事件失败:', error)
    }
  }
})

// 房间设备统计数据
const roomsWithDevices = computed(() => {
  const allRooms = globalStore.rooms || []
  return allRooms.map(room => {
    const roomDevices = room.devices || []
    const total = roomDevices.length
    const online = roomDevices.filter(device => device.status === 'online').length
    const offline = total - online
    
    return {
      id: room.id,
      name: room.name,
      devices: { total, online, offline },
      color: `var(--room-${room.id})`
    }
  })
})

// =========================
// Navigation / Mode handlers
// =========================
const setActiveRoom = (roomId) => {
  activeRoom.value = roomId
}

// =========================
// 修改设备名称相关方法
// =========================
const openEditNameModal = (device) => {
  editingDevice.value = device
  editingDeviceName.value = device.name
  showEditNameModal.value = true
}

const closeEditNameModal = () => {
  showEditNameModal.value = false
  editingDevice.value = null
  editingDeviceName.value = ''
  isEditingName.value = false
}

const confirmEditName = async () => {
  if (!editingDevice.value || !editingDeviceName.value.trim()) {
    return
  }

  isEditingName.value = true
  
  try {
    // 调用API更新设备名称
    const response = await updateDeviceName(editingDevice.value.id, editingDeviceName.value.trim())
    
    if (response && response.name) {
      // 更新本地设备状态
      const device = globalStore.devices.find(d => d.id === editingDevice.value.id)
      if (device) {
        device.name = response.name
      }
      
      // 显示成功消息
      console.log('设备名称修改成功:', response.name)
      
      closeEditNameModal()
    } else {
      throw new Error('修改设备名称失败')
    }
  } catch (error) {
    console.error('修改设备名称失败:', error)
    // 这里可以添加用户提示，比如使用 ElMessage
    alert('修改设备名称失败，请重试')
  } finally {
    isEditingName.value = false
  }
}

</script>

<style scoped>
@import '../styles/colors.css';

/* =========================
   Page layout
   ========================= */
.home-page {
  width: 100%;
  padding: 8px 24px;
  overflow: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.home-page::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

/* =========================
   Room navigation bar
   ========================= */
.room-navigation {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.room-btn {
  flex-direction: column;
  align-items: center;
  padding:10px 12px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--color-text-secondary);
  text-align: center;
  background-color: var(--color-nav-idle);
  border: 1px solid var(--color-border);
  font-size: 13px;
  font-weight: 600;
}

.room-btn:hover {
  background-color: var(--color-hover);
  color: var(--color-primary);
}

.room-btn.active {
  background-color: var(--color-active);
  color: var(--color-primary);
}

/* removed add-room button */

/* =========================
   Main content grid
   ========================= */
.main-content {
  display: grid;
  grid-template-columns: 5fr 2fr;
  gap: 16px;
  align-items: start;
}

@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .right-section {
    order: -1;
  }
}

/* =========================
   Left section container
   ========================= */
.left-section {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.left-section::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

/* =========================
   Right section container
   ========================= */
.right-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-self: start;
}


.cards-row {
  display: flex;
  gap: 12px;
  width: 100%;
}

.cards-row > * {
  flex: 1;
}

.music-row {
  display: flex;
  gap: 12px;
  width: 100%;
}

.music-row > * {
  flex: 1;
}

.calendar-row {
  display: flex;
  gap: 12px;
  width: 100%;
}

.calendar-row > * {
  flex: 1;
}


.room-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 两列 */
  gap: 16px;
}

/* 设备包装器样式 */
.device-wrapper {
  position: relative;
  transition: all 0.3s ease;
}

/* 修改设备名称按钮 */
.edit-name-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
  opacity: 0;
}

.device-wrapper:hover .edit-name-btn {
  opacity: 1;
}

.edit-name-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-primary-text);
}

.edit-name-btn svg {
  width: 12px;
  height: 12px;
  color: var(--color-text-secondary);
}

.edit-name-btn:hover svg {
  color: var(--color-primary-text);
}

/* 禁用设备样式 */
.device-wrapper.disabled {
  opacity: 0.6;
  filter: grayscale(80%);
  pointer-events: none;
  cursor: not-allowed;
}

.device-wrapper.disabled::after {
  content: '🔒';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  z-index: 2;
  color: var(--color-disabled-text);
  background: var(--color-bg-card);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* 修改设备名称弹窗样式 */
.device-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-member-modal-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.delete-modal-content {
  background: var(--color-bg-card);
  border-radius: 12px;
  padding: 24px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: var(--color-member-shadow-medium);
}

.delete-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.delete-modal-header h3 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 18px;
  font-weight: 600;
}

.delete-close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--color-text-secondary);
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.delete-close-btn:hover {
  background: var(--color-hover);
  color: var(--color-text-primary);
}

.delete-modal-body {
  margin-bottom: 20px;
}

.delete-modal-body .input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  font-size: 14px;
  transition: all 0.2s ease;
}

.delete-modal-body .input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(191, 254, 1, 0.2);
}

.delete-modal-body .input:disabled {
  background: var(--color-disabled-bg);
  color: var(--color-disabled-text);
  cursor: not-allowed;
}

.delete-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--color-border);
}

.cancel-btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover:not(:disabled) {
  background: var(--color-hover);
  color: var(--color-text-primary);
}

.cancel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn {
  padding: 10px 20px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.action-btn.success {
  background: var(--color-primary);
  color: var(--color-bg-primary);
  border-color: var(--color-primary);
}

.action-btn.success:hover:not(:disabled) {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}






/* =========================
   Devices list
   ========================= */
.devices-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
}


</style>

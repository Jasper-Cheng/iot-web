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
          <!-- 使用v-show避免重新创建组件 -->
          <div 
            v-for="device in allDevices" 
            :key="device.id"
            v-show="isDeviceVisible(device.id)"
            :class="['device-wrapper', { disabled: !canControlDevice(device.id) }]"
            :title="!canControlDevice(device.id) ? '您没有权限控制此设备' : ''"
          >
            <keep-alive>
              <component 
                :is="getDeviceComponent(device.cardName)"
                :device="device"
              />
            </keep-alive>
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
        <!-- <EnergyPanel /> -->
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
import { ref, computed } from 'vue'
import { useGlobalStore } from '../stores/global'
import { getDeviceComponent } from '../utils/deviceComponents'
import { updateDeviceName } from '../api/devices'
import { getPointsBalance } from '../api/points'
import CheckinCalendar from '../components/CheckinCalendar.vue'
import ColorControlPanel from '../components/ColorControlPanel.vue'
import EnergyPanel from '../components/EnergyPanel.vue'
import DeviceStatsPanel from '../components/DeviceStatsPanel.vue'
import SmartControlPanel from '../components/SmartControlPanel.vue'
import { ElMessage } from 'element-plus'

// 全局状态
const globalStore = useGlobalStore()

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
      member.id === globalStore.user?.id
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

// 积分相关方法
const loadUserPoints = async () => {
  try {
    const response = await getPointsBalance()
    // 更新全局状态中的积分
    globalStore.userPoints = response.available_balance || 0
  } catch (error) {
    console.error('加载积分余额失败:', error)
  }
}

// 处理签到成功
const handleCheckinSuccess = (response) => {
  ElMessage.success('签到成功，获得积分:' + response.points_earned)
  // 刷新积分显示
  loadUserPoints()
}
const isEditingName = ref(false)


// 所有设备列表（用于v-for渲染）
const allDevices = computed(() => {
  const devices = globalStore.devices || []
  const filteredDevices = devices.filter(device => device.cardName)
  
  if (activeRoom.value === 'all') {
    // All Devices 按设备ID排序
    return filteredDevices.sort((a, b) => a.id - b.id)
  } else {
    // 房间设备按 sort_order 排序
    const selectedRoom = globalStore.rooms?.find(room => room.id === activeRoom.value)
    if (!selectedRoom) {
      return filteredDevices.sort((a, b) => a.id - b.id)
    }
    
    const roomDevices = selectedRoom.devices || []
    
    // 根据房间中的 sort_order 排序（使用拷贝，避免修改全局状态）
    const sortedRoomDevices = [...roomDevices].sort((a, b) => {
      const sortOrderA = a.sort_order ?? 999999
      const sortOrderB = b.sort_order ?? 999999
      return sortOrderA - sortOrderB
    })
    
    // 按照房间设备的排序顺序重新排列设备
    const sortedDevices = []
    sortedRoomDevices.forEach(roomDevice => {
      const device = filteredDevices.find(d => d.id === roomDevice.device_id)
      if (device) {
        sortedDevices.push(device)
      }
    })
    
    // 添加不在房间中的设备（按设备ID排序）
    const roomDeviceIds = new Set(roomDevices.map(rd => rd.device_id))
    const remainingDevices = filteredDevices.filter(device => !roomDeviceIds.has(device.id))
      .sort((a, b) => a.id - b.id)
    
    return [...sortedDevices, ...remainingDevices]
  }
})

// 判断设备是否应该显示
const isDeviceVisible = (deviceId) => {
  if (activeRoom.value === 'all') {
    return true
  }
  
  const selectedRoom = globalStore.rooms?.find(room => room.id === activeRoom.value)
  if (!selectedRoom) {
    return false
  }
  
  const roomDevices = selectedRoom.devices || []
  return roomDevices.some(roomDevice => roomDevice.device_id === deviceId)
}

// 过滤后的设备列表（包含实时数据）- 保留用于兼容性
const filteredDevices = computed(() => {
  const allDevices = globalStore.devices || []
  let devices = []
  
  if (activeRoom.value === 'all') {
    // 显示所有设备，按设备ID排序
    devices = allDevices.filter(device => device.cardName)
    return devices.sort((a, b) => a.id - b.id)
  } else {
    // 显示选中房间的设备
    const selectedRoom = globalStore.rooms?.find(room => room.id === activeRoom.value)
    
    if (!selectedRoom) {
      return []
    }
    
    const roomDevices = selectedRoom.devices || []
    
    // 根据房间中的 sort_order 排序（使用拷贝，避免修改全局状态）
    const sortedRoomDevices = [...roomDevices].sort((a, b) => {
      const sortOrderA = a.sort_order ?? 999999
      const sortOrderB = b.sort_order ?? 999999
      return sortOrderA - sortOrderB
    })
    
    // 根据排序后的房间设备顺序，获取对应的设备信息
    devices = sortedRoomDevices.map(roomDevice => {
      return allDevices.find(device => 
        device.id === roomDevice.device_id && device.cardName
      )
    }).filter(Boolean) // 过滤掉未找到的设备
    
    return devices
  }
})


// 设备管理方法现在由 App.vue 提供，这里不再需要 provide

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
    await updateDeviceName(editingDevice.value.id, editingDeviceName.value.trim())
    
    closeEditNameModal()
  } catch (error) {
    console.error('修改设备名称失败:', error)
    // 这里可以添加用户提示，比如使用 ElMessage
    ElMessage.error('修改设备名称失败，请重试')
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
  top: 4px;
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

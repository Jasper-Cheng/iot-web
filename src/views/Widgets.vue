<template>
  <div class="widgets-page" ref="widgetsPage" @dragover.prevent="handlePageDragOver">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-actions">
        <button class="add-room-btn" @click="addRoom">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
          Add Room
        </button>
      </div>
    </div>

    <!-- 房间和设备管理 -->
    <div class="rooms-container">
      <!-- 左侧：未分配设备区域 -->
      <div class="all-devices-section" @drop="handleDrop($event, 'unassigned')" @dragover.prevent @dragenter.prevent>
        <div class="room-header">
          <h3 class="room-title">All Devices</h3>
          <span class="device-count">{{ unassignedDevices.length }} devices</span>
        </div>
        <div 
          class="devices-grid"
        >
          <div 
            v-for="device in unassignedDevices" 
            :key="device.id"
            class="device-card"
            :draggable="true"
            @dragstart="handleDragStart($event, device)"
            @dragend="handleDragEnd($event)"
            @dragenter.prevent="handleDragEnterCard($event, 'unassigned', device)"
            @click="selectDevice(device)"
          >
            <div class="device-preview">
              <img :src="getThumbnailByCardName(device.cardName)" :alt="device.name" class="device-thumbnail" draggable="false" />
            </div>
            <div class="device-info">
              <h4 class="device-name">{{ device.name }}</h4>
            </div>
            <div class="device-status" :class="device.status">
              <div class="status-dot"></div>
              <span>{{ device.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：房间区域 -->
      <div class="rooms-grid">
        <div 
          v-for="room in rooms" 
          :key="room.id"
          class="room-section"
          @drop="handleDrop($event, room.id)"
          @dragover.prevent
          @dragenter.prevent
        >
          <div class="room-header">
            <h3 class="room-title">{{ room.name }}</h3>
            <div class="room-actions">
              <span class="device-count">{{ getRoomDevices(room.id).length }} devices</span>
              <button class="delete-room-btn" title="Delete room" @click.stop="openDeleteConfirm(room)">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 7h12M9 7v12m6-12v12M10 4h4a1 1 0 0 1 1 1v2H9V5a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.5"/>
                </svg>
              </button>
            </div>
          </div>
          <div 
            class="devices-grid"
          >
            <div 
              v-for="device in getRoomDevices(room.id)" 
              :key="device.id"
              class="device-card"
              :draggable="true"
              @dragstart="handleDragStart($event, device)"
              @dragend="handleDragEnd($event)"
              @dragenter.prevent="handleDragEnterCard($event, room.id, device)"
              @click="selectDevice(device)"
            >
              <div class="device-preview">
                <img :src="getThumbnailByCardName(device.cardName)" :alt="device.name" class="device-thumbnail" draggable="false" />
              </div>
              <div class="device-info">
                <h4 class="device-name">{{ device.name }}</h4>
              </div>
              <div class="device-status" :class="device.status">
                <div class="status-dot"></div>
                <span>{{ device.status }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 设备详情模态框 -->
    <div v-if="selectedDevice" class="device-modal" @click="closeDeviceModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedDevice.name }}</h3>
          <button class="close-btn" @click="closeDeviceModal">×</button>
        </div>
        <div class="modal-body">
          <!-- 设备大图 -->
          <div class="device-large-preview">
            <img :src="getThumbnailByCardName(selectedDevice.cardName)" :alt="selectedDevice.name" class="device-large-thumbnail" />
          </div>
        </div>
        <div class="modal-footer">
          <div class="device-info-row">
            <div class="device-info-left">
              <span class="device-status-info" :class="selectedDevice.status">
                <span class="status-dot"></span>
                {{ selectedDevice.status }}
              </span>
              <span class="device-room-info">
                {{ getRoomName(selectedDevice.roomId) }}
              </span>
            </div>
            <button class="action-btn danger" @click="removeDevice(selectedDevice)">
              Remove Device
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 删除房间确认弹窗（独立样式） -->
  <div v-if="roomPendingDelete" class="device-modal" @click="closeDeleteConfirm">
    <div class="delete-modal-content" @click.stop>
      <div class="delete-modal-header">
        <h3>Delete Room</h3>
        <button class="delete-close-btn" @click="closeDeleteConfirm">X</button>
      </div>
      <div class="delete-modal-body">
        <p>Are you sure you want to delete "{{ roomPendingDelete.name }}"? Devices in this room will be moved to All Devices.</p>
      </div>
      <div class="delete-modal-footer">
        <button class="action-btn" @click="closeDeleteConfirm">Cancel</button>
        <button class="action-btn danger" @click="removeRoom">Delete</button>
      </div>
    </div>
  </div>

  <!-- 新增房间弹窗 -->
  <div v-if="addRoomModalOpen" class="device-modal" @click="cancelAddRoom">
    <div class="delete-modal-content" @click.stop>
      <div class="delete-modal-header">
        <h3>Add Room</h3>
        <button class="delete-close-btn" @click="cancelAddRoom">X</button>
      </div>
      <div class="delete-modal-body">
        <input class="input" v-model="newRoomName" placeholder="Enter room name" @keyup.enter="confirmAddRoom" />
      </div>
      <div class="delete-modal-footer">
        <button class="action-btn" @click="cancelAddRoom">Cancel</button>
        <button class="action-btn success" @click="confirmAddRoom" :disabled="!newRoomName.trim()">Add</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useGlobalStore } from '../stores/global'
import { getDeviceComponent } from '../utils/deviceComponents'
import { getThumbnailByCardName } from '../utils/deviceMapping'
import { unbindDeviceBySN } from '../api/devices'
import { createRoom, deleteRoom } from '../api/rooms'
// 导入实际的widget组件
import SmartLightCard from '../widgets/SmartLightCard.vue'
import SmartTvCard from '../widgets/SmartTvCard.vue'
import AirCoolerCard from '../widgets/AirCoolerCard.vue'
import SpeakerCard from '../widgets/SpeakerCard.vue'
import CameraCard from '../widgets/CameraCard.vue'
import WashingMachineCard from '../widgets/WashingMachineCard.vue'
import RefrigeratorCard from '../widgets/RefrigeratorCard.vue'
import VacuumCard from '../widgets/VacuumCard.vue'
import AirPurifierCard from '../widgets/AirPurifierCard.vue'
import FallDetectionCard from '../widgets/FallDetectionCard.vue'
import SmartSocketCard from '../widgets/SmartSocketCard.vue'

// 页面容器引用用于滚动
const widgetsPage = ref(null)

// 全局状态
const globalStore = useGlobalStore()

// 房间数据 - 使用真实数据
const rooms = computed(() => {
  const allRooms = globalStore.rooms || []
  return allRooms.map(room => ({
    id: room.id,
    name: room.name,
    color: `var(--room-${room.id})`,
    devices: room.devices || []
  }))
})

// 设备数据 - 使用真实数据
const devices = computed(() => {
  const allDevices = globalStore.devices || []
  return allDevices.map(device => {
    // 根据设备SN获取对应的组件
    const component = getDeviceComponent(device.cardName)
    
    // 确定设备所属房间
    let roomId = 'unassigned'
    const roomWithDevice = globalStore.rooms?.find(room => 
      room.devices?.some(rd => rd.device_id === device.id)
    )
    if (roomWithDevice) {
      roomId = roomWithDevice.id
    }
    
    return {
      id: device.id,
      device_id: device.id, // 添加 device_id 字段用于 API 调用
      name: device.name,
      status: device.status,
      roomId: roomId,
      component: component,
      sn: device.sn,
      cardName: device.cardName
    }
  })
})

// 本地设备状态，用于拖动过程中的排序
const localDevices = ref([])
// 是否正在拖动中
const isDragging = ref(false)

// 监听全局设备变化，同步到本地状态
watch(devices, (newDevices) => {
  // 只有在非拖动状态下才同步
  if (!isDragging.value) {
    localDevices.value = [...newDevices]
  }
}, { immediate: true })

// 选中的设备
const selectedDevice = ref(null)

// 拖拽中的设备
const draggedDevice = ref(null)
// 拖拽的目标房间
const dragTargetRoom = ref(null)
// 拖拽的原始房间ID
const dragOriginalRoom = ref(null)

// 计算属性：未分配的设备
const unassignedDevices = computed(() => {
  return localDevices.value.filter(device => device.roomId === 'unassigned')
})

// 获取指定房间的设备
const getRoomDevices = (roomId) => {
  if (roomId === 'unassigned') {
    // All Devices 使用 localDevices
    return localDevices.value.filter(device => device.roomId === 'unassigned')
  } else {
    // 房间设备始终从 globalStore.rooms 中获取，保持服务器返回的排序
    const room = globalStore.rooms?.find(r => r.id === roomId)
    if (!room || !room.devices) return []
    
    // 将房间设备数据转换为设备对象格式
    return room.devices.map(roomDevice => {
      // 从 globalStore.devices 中找到对应的设备信息
      const device = globalStore.devices?.find(d => d.id === roomDevice.device_id)
      if (!device) return null
      
      return {
        id: device.id,
        device_id: device.id,
        name: device.name,
        status: device.status,
        roomId: roomId,
        component: getDeviceComponent(device.cardName),
        sn: device.sn,
        cardName: device.cardName
      }
    }).filter(Boolean) // 过滤掉 null 值
  }
}

// 获取房间名称
const getRoomName = (roomId) => {
  if (roomId === 'unassigned') return 'Unassigned'
  const room = rooms.value.find(r => r.id === roomId)
  return room ? room.name : 'Unknown'
}

// 删除房间确认弹窗状态
const roomPendingDelete = ref(null)
const openDeleteConfirm = (room) => {
  roomPendingDelete.value = room
}
const closeDeleteConfirm = () => {
  roomPendingDelete.value = null
}

// 删除房间（将房间内设备移回 All Devices）
const removeRoom = async () => {
  const room = roomPendingDelete.value
  if (!room) return

  try {
    // 调用删除房间 API
    await deleteRoom(room.id)
    
    // 将该房间的设备移动到 unassigned - 更新 globalStore.devices
    globalStore.devices = globalStore.devices.map(d => (
      d.roomId === room.id ? { ...d, roomId: 'unassigned' } : d
    ))

    // 从 globalStore.rooms 中移除房间
    const idx = globalStore.rooms.findIndex(r => r.id === room.id)
    if (idx > -1) globalStore.rooms.splice(idx, 1)

    closeDeleteConfirm()
  } catch (error) {
    console.error('删除房间失败:', error)
    // 可以添加错误提示
  }
}

// 拖拽开始
const handleDragStart = (event, device) => {
  isDragging.value = true
  draggedDevice.value = device
  dragOriginalRoom.value = device.roomId // 记录拖动的原始房间
  dragTargetRoom.value = device.roomId // 记录拖动的目标房间
  event.dataTransfer.effectAllowed = 'move'
  event.target.style.opacity = '0.6'
  // 设置自定义拖拽预览为"当前设备"的缩略图
  try {
    const preview = document.createElement('div')
    preview.style.width = '80px'
    preview.style.height = '140px'
    preview.style.border = '1px solid var(--color-widgets-preview-border)'
    preview.style.borderRadius = '10px'
    preview.style.boxShadow = '0 6px 16px var(--color-widgets-preview-shadow)'
    preview.style.display = 'flex'
    preview.style.flexDirection = 'column'
    preview.style.alignItems = 'center'
    preview.style.justifyContent = 'center'
    preview.style.background = 'var(--color-bg-card)'
    preview.style.pointerEvents = 'none'
    preview.style.position = 'fixed'
    preview.style.left = '-9999px'

    const img = document.createElement('img')
    img.src = getThumbnailByCardName(device.cardName)
    img.alt = device.name
    img.style.width = '100%'
    img.style.height = '100%'
    img.style.objectFit = 'contain'
    img.style.borderRadius = '10px'

    preview.appendChild(img)
    document.body.appendChild(preview)

    event.dataTransfer.setDragImage(preview, preview.clientWidth / 2, preview.clientHeight / 2)

    // 清理预览节点（稍后移除，避免闪烁）
    setTimeout(() => {
      if (preview && preview.parentNode) preview.parentNode.removeChild(preview)
    }, 0)
  } catch (_) {
    // 忽略不支持 setDragImage 的环境
  }
}

// 拖拽结束
const handleDragEnd = async (event) => {
  event.target.style.opacity = '1'
  
  // 拖动结束时触发更新操作
  if (draggedDevice.value) {
    const originalRoomId = dragOriginalRoom.value // 使用记录的原始房间ID
    const targetRoomId = dragTargetRoom.value // 使用目标房间ID
    
    
    // 根据规则处理不同的拖动场景
    await handleDragScenarios(originalRoomId, targetRoomId)
  }
  
  draggedDevice.value = null
  dragTargetRoom.value = null
  dragOriginalRoom.value = null
  isDragging.value = false
}

// 处理拖拽放置
const handleDrop = (event, targetRoomId) => {
  event.preventDefault()
  
  if (draggedDevice.value) {
    // 总是设置目标房间
    dragTargetRoom.value = targetRoomId
    
    // 如果房间不同，更新设备的房间
    if (draggedDevice.value.roomId !== targetRoomId) {
      // 更新本地设备状态
      const deviceIndex = localDevices.value.findIndex(d => d.id === draggedDevice.value.id)
      if (deviceIndex !== -1) {
        localDevices.value[deviceIndex].roomId = targetRoomId
      }
      
      // 同时更新 globalStore.rooms，让拖动过程中能看到变化
      updateGlobalStoreRoomDevices(draggedDevice.value.id, draggedDevice.value.roomId, targetRoomId)
    }
  }
  
  // 不在这里调用API，在handleDragEnd中统一调用
}

// 更新 globalStore.rooms 中的设备房间
const updateGlobalStoreRoomDevices = (deviceId, fromRoomId, toRoomId) => {
  // 从原房间移除设备
  if (fromRoomId !== 'unassigned') {
    const fromRoom = globalStore.rooms.find(r => r.id === fromRoomId)
    if (fromRoom && fromRoom.devices) {
      fromRoom.devices = fromRoom.devices.filter(rd => rd.device_id !== deviceId)
    }
  }
  
  // 添加到目标房间
  if (toRoomId !== 'unassigned') {
    const toRoom = globalStore.rooms.find(r => r.id === toRoomId)
    if (toRoom) {
      if (!toRoom.devices) {
        toRoom.devices = []
      }
      // 添加到末尾，API调用时会重新排序
      toRoom.devices.push({
        room_id: toRoomId,
        device_id: deviceId,
        sort_order: toRoom.devices.length
      })
    }
  }
}

// 在同一房间内拖拽经过其他卡片时，进行排序
const handleDragEnterCard = (event, targetRoomId, targetDevice) => {
  if (!draggedDevice.value) return

  // 更新拖动的目标房间
  dragTargetRoom.value = targetRoomId

  // 只在同一房间内进行排序（不改变roomId）
  if (draggedDevice.value.roomId !== targetRoomId) return

  if (draggedDevice.value.id === targetDevice.id) return

  // 在 globalStore.rooms 中交换两项的位置
  const room = globalStore.rooms.find(r => r.id === targetRoomId)
  if (!room || !room.devices) return

  const fromIndex = room.devices.findIndex(rd => rd.device_id === draggedDevice.value.id)
  const toIndex = room.devices.findIndex(rd => rd.device_id === targetDevice.id)
  if (fromIndex === -1 || toIndex === -1) return

  // 交换位置
  const [moved] = room.devices.splice(fromIndex, 1)
  room.devices.splice(toIndex, 0, moved)
  
  // 拖动过程中不触发API调用，只在拖动结束时触发
}

// 处理不同的拖动场景
const handleDragScenarios = async (originalRoomId, targetRoomId) => {
  try {
    // 1. 设备从A到all,更新A中的设备数量及排序，重新计算all中的设备
    if (originalRoomId !== 'unassigned' && targetRoomId === 'unassigned') {
      await updateRoomDevicesSort(originalRoomId)
    }
    
    // 2. 设备从all到A，更新all中的设备数量及排序，重新计算all中的设备
    else if (originalRoomId === 'unassigned' && targetRoomId !== 'unassigned') {
      await updateRoomDevicesSort(targetRoomId)
    }
    
    // 3. 设备从A到B，更新A、B中的设备数量及排序
    else if (originalRoomId !== 'unassigned' && targetRoomId !== 'unassigned' && originalRoomId !== targetRoomId) {
      await updateRoomDevicesSort(originalRoomId)
      await updateRoomDevicesSort(targetRoomId)
    }
    
    // 4. 设备从A到A，更新A中设备的排序
    else if (originalRoomId !== 'unassigned' && originalRoomId === targetRoomId) {
      await updateRoomDevicesSort(originalRoomId)
    }
    
    // 5. All Devices 内部排序不需要API调用
    else if (originalRoomId === 'unassigned' && targetRoomId === 'unassigned') {
      // All Devices 内部排序，无需API调用
    }
    
  } catch (error) {
    console.error('拖动场景处理失败:', error)
  }
}

// 更新房间设备排序
const updateRoomDevicesSort = async (roomId) => {
  try {
    const roomDevices = getRoomDevices(roomId)
    
    // 即使房间没有设备，也需要调用 API 来清空房间的设备列表
    // 这样服务器端会正确更新房间的设备关联关系
    
    // 调用全局状态管理中的批量更新方法
    const response = await globalStore.updateRoomDevicesSort(roomId, roomDevices)
  } catch (error) {
    console.error('更新房间设备排序失败:', error)
  }
}

// 拖拽时自动滚动页面（向上/向下）
const handlePageDragOver = (event) => {
  const container = widgetsPage.value
  if (!container) return

  const rect = container.getBoundingClientRect()
  const threshold = 80 // 离顶部/底部阈值
  const scrollSpeed = 20 // 每次事件的滚动像素

  if (event.clientY < rect.top + threshold) {
    container.scrollTop -= scrollSpeed
  } else if (event.clientY > rect.bottom - threshold) {
    container.scrollTop += scrollSpeed
  }
}

// 选择设备
const selectDevice = (device) => {
  selectedDevice.value = device
}

// 关闭设备模态框
const closeDeviceModal = () => {
  selectedDevice.value = null
}

// 移除设备
const removeDevice = async (device) => {
  if (!device || !device.sn) return
  
  try {
    // 调用解绑设备 API，传入 SN
    await unbindDeviceBySN(device.sn)
    
    // 从 localDevices 中移除
    const localIndex = localDevices.value.findIndex(d => d.id === device.id)
    if (localIndex > -1) {
      localDevices.value.splice(localIndex, 1)
    }
    
    // 从 globalStore.rooms 中移除
    if (device.roomId !== 'unassigned') {
      const room = globalStore.rooms.find(r => r.id === device.roomId)
      if (room && room.devices) {
        room.devices = room.devices.filter(rd => rd.device_id !== device.id)
      }
    }
    
    // 从 globalStore.devices 中移除
    const globalIndex = globalStore.devices.findIndex(d => d.id === device.id)
    if (globalIndex > -1) {
      globalStore.devices.splice(globalIndex, 1)
    }
    
    closeDeviceModal()
  } catch (error) {
    console.error('解绑设备失败:', error)
    // 可以添加错误提示
  }
}


// 添加房间
// 新增房间：使用弹窗输入房间名
const addRoomModalOpen = ref(false)
const newRoomName = ref('')

const addRoom = () => {
  newRoomName.value = ''
  addRoomModalOpen.value = true
}

const confirmAddRoom = async () => {
  const roomName = newRoomName.value.trim()
  if (!roomName) {
    addRoomModalOpen.value = false
    return
  }
  
  try {
    // 调用创建房间 API
    const response = await createRoom({
      name: roomName,
      user_id: globalStore.user.user_id
    })
    
    // 创建新房间对象
    const newRoom = {
      id: response.id,
      name: response.name,
      devices: [],
      color: 'var(--room-default)'
    }
    
    // 添加到 globalStore.rooms 中
    globalStore.rooms.push(newRoom)
    
    // 重置表单
    newRoomName.value = ''
    addRoomModalOpen.value = false
  } catch (error) {
    console.error('创建房间失败:', error)
    // 可以添加错误提示
  }
}

const cancelAddRoom = () => {
  addRoomModalOpen.value = false
}

// 生命周期钩子
onMounted(() => {
  // 数据已经在 Index.vue 中加载，这里不需要重复加载
})

// 移除了图标组件定义，现在使用实际的widget组件
</script>

<style scoped>
@import '../styles/colors.css';

.widgets-page {
  width: 100%;
  padding: 8px 24px;
  overflow: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.widgets-page::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.header-content h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
}

.header-content p {
  font-size: 16px;
  color: var(--color-text-secondary);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.add-room-btn {
  background-color: var(--color-primary);
  color: var(--color-bg-primary);
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-room-btn:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
}

.add-room-btn svg {
  width: 20px;
  height: 20px;
}

.rooms-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
  align-items: start; /* 防止左右两列互相拉伸同高 */
}

.all-devices-section {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 16px 18px;
  min-height: 200px; /* 左侧仍保持基础高度，以便展示 */
}

.rooms-grid {
  display: grid;
  /* 每列不超过 600px，最小 300px，自动换行 */
  grid-template-columns: repeat(auto-fill, minmax(200px, 320px));
  gap: 20px;
  align-self: start; /* 按内容高度自适应，不随左侧高度拉伸 */
  justify-content: start; /* 左对齐，避免最后一行拉伸 */
}

.room-section {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 16px 18px;
  /* 让房间高度随内容而变，不设固定最小高度以免被左侧同步拉高 */
  width: 100%;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.room-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.delete-room-btn {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border-radius: 6px;
  cursor: pointer;
}

.delete-room-btn:hover {
  color: var(--color-danger);
  border-color: var(--color-danger);
}

.room-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.device-count {
  font-size: 14px;
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary);
  padding: 4px 12px;
  border-radius: 20px;
}

.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  min-height: 100px;
  padding: 8px;
  border: 2px dashed transparent;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.devices-grid:hover {
  border-color: var(--color-border-light);
}

.device-card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 8px;
  cursor: grab;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 6px;
  min-height: 140px;
  position: relative;
}

.device-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--color-widgets-card-shadow);
  border-color: var(--color-primary);
}

.device-card:active {
  cursor: grabbing;
}

.device-preview {
  width: 100%;
  height: 100px;
  background: var(--color-bg-primary);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.device-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
  background: var(--color-bg-secondary);
}

.device-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.device-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 6px 0;
}

.device-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.device-status.online {
  color: var(--color-success);
}

.device-status.offline {
  color: var(--color-danger);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.device-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-widgets-modal-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--color-bg-card);
  border-radius: 16px;
  padding: 24px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.device-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--color-bg-secondary);
  border-radius: 8px;
}

.detail-item label {
  font-weight: 600;
  color: var(--color-text-primary);
}

.detail-item span {
  color: var(--color-text-secondary);
}

.detail-item span.online {
  color: var(--color-success);
}

.detail-item span.offline {
  color: var(--color-danger);
}

.modal-footer {
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

/* 删除房间确认弹窗独立样式 */
.delete-modal-content {
  background: var(--color-bg-card);
  border-radius: 14px;
  padding: 20px;
  max-width: 420px;
  width: 90%;
  box-shadow: 0 12px 32px var(--color-widgets-modal-shadow);
}

.delete-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border);
}

.delete-modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.delete-close-btn {
  background: none;
  border: 1px solid var(--color-border);
  width: 28px;
  height: 28px;
  border-radius: 6px;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.delete-close-btn:hover {
  color: var(--color-text-primary);
}

.delete-modal-body {
  margin: 8px 0 16px;
}

.delete-modal-body p {
  margin: 0;
  line-height: 1.6;
  color: var(--color-text-secondary);
}

.delete-modal-body .input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  outline: none;
}

.delete-modal-body .input:focus {
  border-color: var(--color-primary);
}

.delete-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--color-border);
}

.action-btn {
  padding: 12px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.action-btn:hover {
  background: var(--color-primary);
  color: var(--color-primary-text);
  border-color: var(--color-primary);
}

.action-btn.danger {
  background: color-mix(in oklab, var(--color-danger) 10%, transparent);
  color: var(--color-danger);
  border-color: color-mix(in oklab, var(--color-danger) 30%, transparent);
}

.action-btn.danger:hover {
  background: var(--color-danger);
  color: var(--color-white);
  border-color: var(--color-danger);
}

/* 浅绿色成功按钮（Add） */
.action-btn.success {
  background: color-mix(in oklab, var(--color-success) 12%, transparent);
  color: var(--color-success);
  border-color: color-mix(in oklab, var(--color-success) 35%, transparent);
}

.action-btn.success:hover {
  background: var(--color-success);
  color: var(--color-white);
  border-color: var(--color-success);
}

/* 设备大图预览 */
.device-large-preview {
  width: 100%;
  height: 500px;
  padding: 10px;
  background: var(--color-bg-secondary);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.device-large-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
}

/* 设备信息行 */
.device-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
  padding: 0;
  background: transparent;
  font-size: 13px;
}

.device-info-left {
  display: flex;
  align-items: center;
  margin-left: 12px;
  gap: 20px;
}

.device-status-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 16px;
  color: var(--color-text-primary);
}

.device-status-info .status-dot {
  width: 10px;
  height: 10px;
}

.device-status-info.online .status-dot {
  background: var(--color-success);
}

.device-status-info.offline .status-dot {
  background: var(--color-danger);
}

.device-room-info {
  color: var(--color-text-secondary);
  font-size: 16px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .rooms-container {
    grid-template-columns: 1fr;
  }
  
  .rooms-grid {
    grid-template-columns: 1fr;
  }
  
  .devices-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .device-card {
    padding: 12px;
  }
}
</style>
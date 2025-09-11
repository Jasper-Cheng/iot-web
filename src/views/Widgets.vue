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
              <img :src="getDeviceThumbnail(device.name)" :alt="device.name" class="device-thumbnail" draggable="false" />
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
                <img :src="getDeviceThumbnail(device.name)" :alt="device.name" class="device-thumbnail" draggable="false" />
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
            <img :src="getDeviceThumbnail(selectedDevice.name)" :alt="selectedDevice.name" class="device-large-thumbnail" />
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
        <button class="action-btn success" @click="confirmAddRoom">Add</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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

// 房间数据
const rooms = ref([
  { id: 'living-room', name: 'Living Room', color: 'var(--room-living)' },
  { id: 'bedroom', name: 'Bedroom', color: 'var(--room-bedroom)' },
  { id: 'kitchen', name: 'Kitchen', color: 'var(--room-kitchen)' },
  { id: 'bathroom', name: 'Bathroom', color: 'var(--room-bathroom)' },
  { id: 'backyard', name: 'Backyard', color: 'var(--room-backyard)' }
])

// 设备数据
const devices = ref([
  {
    id: 'smart-light-1',
    name: 'Smart Light',
    status: 'online',
    roomId: 'unassigned',
    component: SmartLightCard
  },
  {
    id: 'smart-tv-1',
    name: 'Smart TV',
    status: 'online',
    roomId: 'living-room',
    component: SmartTvCard
  },
  {
    id: 'air-conditioner-1',
    name: 'Air Conditioner',
    status: 'offline',
    roomId: 'bedroom',
    component: AirCoolerCard
  },
  {
    id: 'smart-speaker-1',
    name: 'Smart Speaker',
    status: 'online',
    roomId: 'kitchen',
    component: SpeakerCard
  },
  {
    id: 'security-camera-1',
    name: 'Security Camera',
    status: 'online',
    roomId: 'unassigned',
    component: CameraCard
  },
  {
    id: 'washing-machine-1',
    name: 'Washing Machine',
    status: 'offline',
    roomId: 'bathroom',
    component: WashingMachineCard
  },
  {
    id: 'smart-fridge-1',
    name: 'Smart Refrigerator',
    status: 'online',
    roomId: 'kitchen',
    component: RefrigeratorCard
  },
  {
    id: 'vacuum-cleaner-1',
    name: 'Robot Vacuum',
    status: 'online',
    roomId: 'unassigned',
    component: VacuumCard
  },
  {
    id: 'air-purifier-1',
    name: 'Air Purifier',
    status: 'online',
    roomId: 'living-room',
    component: AirPurifierCard
  },
  {
    id: 'fall-detection-1',
    name: 'Fall Detection Sensor',
    status: 'online',
    roomId: 'bedroom',
    component: FallDetectionCard
  },
  {
    id: 'smart-socket-1',
    name: 'Smart Socket',
    status: 'online',
    roomId: 'unassigned',
    component: SmartSocketCard
  }
])

// 选中的设备
const selectedDevice = ref(null)

// 拖拽中的设备
const draggedDevice = ref(null)

// 计算属性：未分配的设备
const unassignedDevices = computed(() => {
  return devices.value.filter(device => device.roomId === 'unassigned')
})

// 获取指定房间的设备
const getRoomDevices = (roomId) => {
  return devices.value.filter(device => device.roomId === roomId)
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
const removeRoom = () => {
  const room = roomPendingDelete.value
  if (!room) return

  // 将该房间的设备移动到 unassigned
  devices.value = devices.value.map(d => (
    d.roomId === room.id ? { ...d, roomId: 'unassigned' } : d
  ))

  // 从房间列表移除
  const idx = rooms.value.findIndex(r => r.id === room.id)
  if (idx > -1) rooms.value.splice(idx, 1)

  closeDeleteConfirm()
}

// 拖拽开始
const handleDragStart = (event, device) => {
  draggedDevice.value = device
  event.dataTransfer.effectAllowed = 'move'
  event.target.style.opacity = '0.6'
  // 设置自定义拖拽预览为“当前设备”的缩略图
  try {
    const preview = document.createElement('div')
    preview.style.width = '180px'
    preview.style.height = '120px'
    preview.style.border = '1px solid rgba(0,0,0,0.12)'
    preview.style.borderRadius = '10px'
    preview.style.boxShadow = '0 6px 16px rgba(0,0,0,0.18)'
    preview.style.display = 'flex'
    preview.style.flexDirection = 'column'
    preview.style.alignItems = 'center'
    preview.style.justifyContent = 'center'
    preview.style.background = 'var(--color-bg-card)'
    preview.style.pointerEvents = 'none'
    preview.style.position = 'fixed'
    preview.style.left = '-9999px'

    const img = document.createElement('img')
    img.src = getDeviceThumbnail(device.name)
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
const handleDragEnd = (event) => {
  event.target.style.opacity = '1'
  draggedDevice.value = null
}

// 处理拖拽放置
const handleDrop = (event, targetRoomId) => {
  event.preventDefault()
  
  if (draggedDevice.value && draggedDevice.value.roomId !== targetRoomId) {
    // 更新设备的房间
    draggedDevice.value.roomId = targetRoomId
  }
  
  draggedDevice.value = null
}

// 在同一房间内拖拽经过其他卡片时，进行排序
const handleDragEnterCard = (event, targetRoomId, targetDevice) => {
  if (!draggedDevice.value) return

  // 只在同一房间内进行排序（不改变roomId）
  if (draggedDevice.value.roomId !== targetRoomId) return

  if (draggedDevice.value.id === targetDevice.id) return

  // 在数组中交换两项的位置
  const list = devices.value
  const fromIndex = list.findIndex(d => d.id === draggedDevice.value.id)
  const toIndex = list.findIndex(d => d.id === targetDevice.id)
  if (fromIndex === -1 || toIndex === -1) return

  // 仅当两者在同一房间时才排序
  if (list[fromIndex].roomId !== list[toIndex].roomId) return

  const [moved] = list.splice(fromIndex, 1)
  list.splice(toIndex, 0, moved)
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
const removeDevice = (device) => {
  const index = devices.value.findIndex(d => d.id === device.id)
  if (index > -1) {
    devices.value.splice(index, 1)
  }
  closeDeviceModal()
}

// 获取设备缩略图
const getDeviceThumbnail = (deviceName) => {
  const thumbnailMap = {
    'Smart Light': '/thumbnails/devices/smart_light.png',
    'Smart TV': '/thumbnails/devices/smart_tv.png',
    'Air Conditioner': '/thumbnails/devices/air_cooler.png',
    'Smart Speaker': '/thumbnails/devices/smart_speaker.png',
    'Security Camera': '/thumbnails/devices/camera.png',
    'Washing Machine': '/thumbnails/devices/washing_machine.png',
    'Smart Refrigerator': '/thumbnails/devices/refrigerator.png',
    'Robot Vacuum': '/thumbnails/devices/smart_vacuum.png',
    'Air Purifier': '/thumbnails/devices/air_purifier.png',
    'Fall Detection Sensor': '/thumbnails/devices/fall_detection.png',
    'Smart Socket': '/thumbnails/devices/smart_socket.png'
  }
  
  return thumbnailMap[deviceName] || '/thumbnails/devices/smart_light.png'
}

// 添加房间
// 新增房间：使用弹窗输入房间名
const addRoomModalOpen = ref(false)
const newRoomName = ref('')

const addRoom = () => {
  newRoomName.value = ''
  addRoomModalOpen.value = true
}

const confirmAddRoom = () => {
  const roomName = newRoomName.value.trim()
  if (!roomName) {
    addRoomModalOpen.value = false
    return
  }
  const newRoom = {
    id: roomName.toLowerCase().replace(/\s+/g, '-'),
    name: roomName,
    color: 'var(--room-default)'
  }
  rooms.value.push(newRoom)
  addRoomModalOpen.value = false
}

const cancelAddRoom = () => {
  addRoomModalOpen.value = false
}

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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  background: rgba(0, 0, 0, 0.5);
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
  box-shadow: 0 12px 32px rgba(0,0,0,0.25);
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
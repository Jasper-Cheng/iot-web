<template>
  <div class="widgets-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Device Management</h1>
        <p class="page-description">Organize your smart devices by room. Drag devices between rooms to manage your home.</p>
      </div>
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
      <!-- 未分配设备区域 -->
      <div class="room-section">
        <div class="room-header">
          <h3 class="room-title">All Devices</h3>
          <span class="device-count">{{ unassignedDevices.length }} devices</span>
        </div>
        <div 
          class="devices-grid"
          @drop="handleDrop($event, 'unassigned')"
          @dragover.prevent
          @dragenter.prevent
        >
          <div 
            v-for="device in unassignedDevices" 
            :key="device.id"
            class="device-card"
            :draggable="true"
            @dragstart="handleDragStart($event, device)"
            @click="selectDevice(device)"
          >
            <div class="device-preview">
              <img :src="getDeviceThumbnail(device.name)" :alt="device.name" class="device-thumbnail" />
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

      <!-- 各房间设备区域 -->
      <div 
        v-for="room in rooms" 
        :key="room.id"
        class="room-section"
      >
        <div class="room-header">
          <h3 class="room-title">{{ room.name }}</h3>
          <span class="device-count">{{ getRoomDevices(room.id).length }} devices</span>
        </div>
        <div 
          class="devices-grid"
          @drop="handleDrop($event, room.id)"
          @dragover.prevent
          @dragenter.prevent
        >
          <div 
            v-for="device in getRoomDevices(room.id)" 
            :key="device.id"
            class="device-card"
            :draggable="true"
            @dragstart="handleDragStart($event, device)"
            @click="selectDevice(device)"
          >
            <div class="device-preview">
              <img :src="getDeviceThumbnail(device.name)" :alt="device.name" class="device-thumbnail" />
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
            <button class="action-btn" @click="removeDevice(selectedDevice)">
              Remove Device
            </button>
          </div>
        </div>
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

// 房间数据
const rooms = ref([
  { id: 'living-room', name: 'Living Room', color: '#3b82f6' },
  { id: 'bedroom', name: 'Bedroom', color: '#10b981' },
  { id: 'kitchen', name: 'Kitchen', color: '#f59e0b' },
  { id: 'bathroom', name: 'Bathroom', color: '#ef4444' }
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

// 拖拽开始
const handleDragStart = (event, device) => {
  draggedDevice.value = device
  event.dataTransfer.effectAllowed = 'move'
  event.target.style.opacity = '0.5'
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
const addRoom = () => {
  const roomName = prompt('Enter room name:')
  if (roomName) {
    const newRoom = {
      id: roomName.toLowerCase().replace(/\s+/g, '-'),
      name: roomName,
      color: '#6b7280'
    }
    rooms.value.push(newRoom)
  }
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
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--color-primary);
  color: var(--color-primary-text);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.room-section {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 20px;
  min-height: 200px;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
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
  color: #10b981;
}

.device-status.offline {
  color: #ef4444;
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
  color: #10b981;
}

.detail-item span.offline {
  color: #ef4444;
}

.modal-footer {
  padding-top: 12px;
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

/* 设备大图预览 */
.device-large-preview {
  width: 100%;
  height: 200px;
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
  background: #10b981;
}

.device-status-info.offline .status-dot {
  background: #ef4444;
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
  
  .devices-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .device-card {
    padding: 12px;
  }
}
</style>
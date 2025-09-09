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
          <button class="add-room-btn">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            Add Room
          </button>
        </div>

        <div class="room-content">
          <!-- 空调控制卡片 -->
          <AirCoolerCard />

        <!-- 智能设备列表 -->
      <div class="devices-list">
        <div 
          v-for="device in devices" 
          :key="device.id"
          class="device-card"
        >
          <div class="device-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path v-if="device.type === 'light'" d="M12 2a7 7 0 0 0-7 7c0 3 2 5 4 6v3h6v-3c2-1 4-3 4-6a7 7 0 0 0-7-7z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>

              <path v-else-if="device.type === 'tv'" d="M3 7h18v10H3zM7 17v2M17 17v2" stroke="currentColor" stroke-width="2" fill="none"/>
              <path v-else-if="device.type === 'detection'" d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10c0-5.5-4.5-10-10-10z" stroke="currentColor" stroke-width="2" fill="none"/>
              <path v-else-if="device.type === 'socket'" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <div class="device-info">
            <h4>{{ device.name }}</h4>
            <p>{{ device.model }}</p>
          </div>
          <div class="device-switch">
            <span class="switch-label">{{ device.power ? 'On' : 'Off' }}</span>
            <div 
              :class="['switch-button', { active: device.power }]"
              @click="toggleDevice(device.id)"
            ></div>
          </div>
        </div>
      </div>
      
        <!-- 摄像头模块（移动到下方） -->
        <CameraCard :rooms="rooms" :activeRoom="activeRoom" />

        <!-- 扫地机器人控制面板 -->
        <VacuumCard @show-records="onShowVacuumRecords" />

        <!-- 洗衣机控制面板 -->
        <WashingMachineCard />
        
        <!-- 冰箱控制面板 -->
        <RefrigeratorCard />
         
        <!-- 音响控制面板 -->
        <SpeakerCard />
         
        <!-- 空气净化器模块 -->
        <AirPurifierCard />
         
       </div>
       </div>

     </div>
   </div>


  <!-- 扫地机器人记录对话框 -->
  <div v-if="showVacuumRecords" class="record-dialog-overlay" @click="closeRecordDialog">
    <div class="record-dialog" @click.stop>
      <div class="record-dialog-header">
        <h3>清洁记录</h3>
        <button class="close-btn" @click="closeRecordDialog">×</button>
      </div>
      <div class="record-dialog-content">
        <div class="record-list">
          <div v-for="record in vacuumRecords" :key="record.id" class="record-item">
            <div class="record-date">
              <span class="date">{{ record.date }}</span>
              <span class="time">{{ record.time }}</span>
            </div>
            <div class="record-details">
              <span class="mode">{{ record.mode }}</span>
              <span class="duration">{{ record.duration }}</span>
              <span class="status completed">{{ record.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<script setup>
import AirCoolerCard from '../widgets/AirCoolerCard.vue'
// =========================
// Imports
// =========================
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import CameraCard from '../widgets/CameraCard.vue'
import VacuumCard from '../widgets/VacuumCard.vue'
import WashingMachineCard from '../widgets/WashingMachineCard.vue'
import RefrigeratorCard from '../widgets/RefrigeratorCard.vue'
import SpeakerCard from '../widgets/SpeakerCard.vue'
import AirPurifierCard from '../widgets/AirPurifierCard.vue'

// =========================
// Room navigation data/state
// - rooms: includes an 'all' option for the navigation only
// - activeRoom: current nav selection (defaults to 'all')
// =========================
const rooms = ref([
  { id: 'all', name: 'All' },
  { id: 'living', name: 'Living Room' },
  { id: 'dining', name: 'Dining Room' },
  { id: 'bedroom', name: 'Bed Room' },
  { id: 'bathroom', name: 'Bath Room' },
  { id: 'backyard', name: 'Backyard' }
])

// 当前选中的房间
const activeRoom = ref('all')

// =========================
// 设备数据
const devices = ref([
  { id: 1, name: 'Smart Light', model: 'Bardi Smart Light', type: 'light', power: false },
  { id: 2, name: 'Smart TV', model: 'Samsung QBOC', type: 'tv', power: true },
  { id: 3, name: 'Fall Detection', model: 'KLAZ Vacuum', type: 'detection', power: false },
  { id: 4, name: 'Smart Socket', model: 'Tuya Zigbe', type: 'socket', power: false }
])

// =========================
// Navigation / Mode handlers
// =========================
const setActiveRoom = (roomId) => {
  activeRoom.value = roomId
}


// 示例：按房间提供不同演示视频地址（可接入真实流）
const cameraSources = {
  living: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  dining: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
  bedroom: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
  bathroom: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
  backyard: 'https://media.w3.org/2010/05/video/movie_300.mp4'
}

// =========================
// 切换设备开关
const toggleDevice = (deviceId) => {
  const device = devices.value.find(d => d.id === deviceId)
  if (device) {
    device.power = !device.power
  }
}
const showVacuumRecords = ref(false)


// =========================

// 子组件传上来的扫地记录，打开对话框
const vacuumRecords = ref([])
const onShowVacuumRecords = (records) => {
  vacuumRecords.value = Array.isArray(records) ? records : []
  showVacuumRecords.value = true
}

// 关闭记录对话框
const closeRecordDialog = () => {
  showVacuumRecords.value = false
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
  font-size: 12px;
  font-weight: 500;
}

.room-btn:hover {
  background-color: var(--color-hover);
  color: var(--color-primary);
}

.room-btn.active {
  background-color: var(--color-active);
  color: var(--color-primary);
}

.add-room-btn {
  margin-left: auto;
  padding: 0px 18px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-room-btn:hover {
  background: var(--color-bg-card);
}

.add-room-btn svg {
  width: 16px;
  height: 16px;
}

/* =========================
   Main content grid
   ========================= */
.main-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
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

.room-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 两列 */
  gap: 16px;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}









/* =========================
   Washing machine card
   ========================= */





.washing-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}


/* 洗衣机详细设置样式 */

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-group h5 {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.setting-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.setting-btn {
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 50px;
  text-align: center;
}

.setting-btn:hover:not(:disabled) {
  background: var(--color-hover);
  color: var(--color-text-primary);
}

.setting-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.setting-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.power-switch {
  display: flex;
  align-items: center;
  gap: 8px;
}

.switch-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.switch-button {
  width: 32px;
  height: 20px;
  background: var(--color-switch-indicator);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.switch-button.active {
  background: var(--color-primary);
}

.switch-button::after {
  content: '';
  position: absolute;
  top: 2px;
  width: 14px;
  height: 14px;
  background: var(--color-switch-indicator-active);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.switch-button.active::after {
  left: 16px;
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

.device-card {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 16px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 12px;
  transition: all 0.3s ease;
}

.device-card:hover {
  border: 1px solid var(--color-primary);
}

.device-icon {
  padding: 10px 10px;
  background: var(--color-button-dark);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.device-icon svg {
  width: 24px;
  height: 24px;
  color: var(--color-text-secondary);
}

.device-info h4 {
  margin: 0 0 6px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.device-info p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 13px;
}


.device-switch {
  display: flex;
  margin-left: auto;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

/* =========================
   Washing machine start button
   ========================= */

.start-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.start-btn:hover:not(:disabled) {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.start-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.start-btn:disabled,
.start-btn.disabled {
  background: var(--color-border);
  color: var(--color-text-secondary);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.start-btn svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}


/* =========================
   Record button styles
   ========================= */
.record-button {
  display: flex;
  align-items: center;
}

.record-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.record-btn:hover {
  background: var(--color-hover);
  color: var(--color-text-primary);
  border-color: var(--color-primary);
}

.record-btn svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

/* =========================
   Record dialog styles
   ========================= */
.record-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.record-dialog {
  background: var(--color-bg);
  border-radius: 16px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-border);
  overflow: hidden;
  opacity: 1;
  backdrop-filter: none;
}

.record-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
}

.record-dialog-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
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
  border-radius: 6px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--color-hover);
  color: var(--color-text-primary);
}

.record-dialog-content {
  padding: 0;
  max-height: 60vh;
  overflow-y: auto;
  background: var(--color-bg-secondary);
}

.record-list {
  padding: 0;
  background: var(--color-bg-secondary);
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border);
  transition: background 0.2s ease;
  background: var(--color-bg);
  opacity: 1;
}

.record-item:last-child {
  border-bottom: none;
}

.record-item:hover {
  background: var(--color-hover);
}

.record-date {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.record-date .date {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.record-date .time {
  font-size: 12px;
  color: var(--color-text-secondary);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.record-details {
  display: flex;
  align-items: center;
  gap: 12px;
}

.record-details .mode {
  padding: 4px 8px;
  background: var(--color-primary-light, rgba(191, 254, 1, 0.2));
  color: var(--color-primary);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-primary);
}

/* 白天主题下的模式标签优化 */
[data-theme="light"] .record-details .mode {
  background: rgba(191, 254, 1, 0.3);
  color: #1a1a1a;
  border: 1px solid #8b8b8b;
  font-weight: 700;
  text-shadow: none;
}

.record-details .duration {
  font-size: 12px;
  color: var(--color-text-primary);
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.record-details .status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.record-details .status.completed {
  background: #dcfce7;
  color: #16a34a;
  border: 1px solid #16a34a;
  font-weight: 700;
}

/* 白天主题下的状态标签优化 */
[data-theme="light"] .record-details .status.completed {
  background: #dcfce7;
  color: #15803d;
  border: 1px solid #15803d;
  font-weight: 700;
  text-shadow: none;
}


/* Generic mode styles (used by vacuum, washing machine, refrigerator) */
.mode-div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.mode-btn {
  border: none;
  border-radius: 10px;
  background: var(--color-button-dark);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 10px 24px;
}

.mode-btn:hover {
  background: var(--color-button-dark-hover);
  transform: translateY(-2px);
}

.mode-btn.active {
  border: 1px solid var(--color-primary);
  color: white;
}

.mode-btn:disabled,
.mode-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mode-btn svg {
  width: 28px;
  height: 28px;
  color: white;
  stroke: white;
}

.mode-btn.active svg {
  width: 28px;
  height: 28px;
  color: var(--color-primary);
}

.mode-btn span {
  font-size: 12px;
  font-weight: 500;
  color: white;
  text-align: center;
}

</style>

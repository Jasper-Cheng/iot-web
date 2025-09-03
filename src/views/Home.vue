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
        <div class="air-cooler-card">
          <div class="card-header">
            <div class="air-card-info">
              <h3>Air Cooler</h3>
              <p>GTA AC00L4</p>
            </div>
                         <div class="power-switch">
               <span class="switch-label">{{ acPower ? 'On' : 'Off' }}</span>
               <div 
                 :class="['switch-button', { active: acPower }]"
                 @click="toggleAC"
               ></div>
             </div>
          </div>
          
          <div class="temperature-section">
            <div class="ac-temp">
              <div class="temp-header">
                <h4>AC</h4>
                <h4>Temperature</h4>
              </div>
              <div class="temp-display">18°</div>
            </div>
            <div class="room-temp">
              <h4>Room Temperature</h4>
              <div class="room-image">
                <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop" alt="Living Room">
                <div class="temp-overlay">20°</div>
              </div>
            </div>
          </div>
          
          <div class="mode-controls">
          <div v-for="mode in acModes" class="mode-div">
            <button :key="mode.id"
              :class="['mode-btn', { active: mode.id === activeMode }]"
              @click="setActiveMode(mode.id)">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path v-if="mode.id === 'heat'" d="M12 4a8 8 0 1 0 0 16a8 8 0 1 0 0-16z M12 1v2 M12 21v2 M1 12h2 M21 12h2 M4.2 4.2l1.4 1.4 M18.4 18.4l1.4 1.4 M4.2 19.8l1.4-1.4 M18.4 5.6l1.4-1.4" stroke="currentColor" stroke-width="1.5" fill="none"/>
                 <path v-else-if="mode.id === 'dry'" d="M12 4 C5 12, 3 20, 12 23 C21 20, 19 12, 12 4 Z" stroke="currentColor" stroke-width="2" fill="none"/>
                 <path v-else-if="mode.id === 'cool'" d="M12 2 L12 22 M2 12 L22 12 M5 5 L19 19 M19 5 L5 19 M8 4 L12 8 L16 4 M8 20 L12 16 L16 20 M4 8 L8 12 L4 16 M20 8 L16 12 L20 16" stroke="currentColor" stroke-width="2" fill="none"/>
                 <path v-else-if="mode.id === 'auto'" d="M7 16 L12 5 L17 16 M9 12 L15 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>

               </svg>
            </button>
            <span>{{ mode.name }}</span>
          </div>
          </div>
        </div>

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
              <path v-else-if="device.type === 'vacuum'" d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10c0-5.5-4.5-10-10-10z" stroke="currentColor" stroke-width="2" fill="none"/>
              <path v-else-if="device.type === 'thermostat'" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="2" fill="none"/>
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
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 房间数据
const rooms = ref([
  { id: 'living', name: 'Living Room' },
  { id: 'dining', name: 'Dining Room' },
  { id: 'bedroom', name: 'Bed Room' },
  { id: 'bathroom', name: 'Bath Room' },
  { id: 'backyard', name: 'Backyard' }
])

// 当前选中的房间
const activeRoom = ref('living')

// 空调模式
const acModes = ref([
  { id: 'heat', name: 'Heat' },
  { id: 'dry', name: 'Dry' },
  { id: 'cool', name: 'Cool' },
  { id: 'auto', name: 'Auto' }
])

// 当前选中的空调模式
const activeMode = ref('cool')

// 空调电源状态
const acPower = ref(true)

// 设备数据
const devices = ref([
  { id: 1, name: 'Smart Light', model: 'Bardi Smart Light', type: 'light', power: false },
  { id: 2, name: 'Smart TV', model: 'Samsung QBOC', type: 'tv', power: true },
  { id: 3, name: 'Smart Vacuum', model: 'KLAZ Vacuum', type: 'vacuum', power: false },
  { id: 4, name: 'Thermostat', model: 'Tuya Zigbe', type: 'thermostat', power: false }
])

// 设置当前房间
const setActiveRoom = (roomId) => {
  activeRoom.value = roomId
}

// 设置空调模式
const setActiveMode = (modeId) => {
  activeMode.value = modeId
}

// 切换设备开关
const toggleDevice = (deviceId) => {
  const device = devices.value.find(d => d.id === deviceId)
  if (device) {
    device.power = !device.power
  }
}

// 切换空调电源
const toggleAC = () => {
  acPower.value = !acPower.value
}
</script>

<style scoped>
@import '../styles/colors.css';

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

/* 房间导航栏 */
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

/* 主要内容区域 */
.main-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
}

/* 左侧内容区域 */
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

/* 空调控制卡片 */
.air-cooler-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 24px 18px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.air-card-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.air-card-info p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 12px;
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

/* 温度区域 */
.temperature-section {
  display: flex;
  gap: 24px;
}

.ac-temp{
  text-align: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
}

.room-temp {
  text-align: center;
  flex-direction: column;
  flex: 3;
  align-items: center;
}

.temp-header h4 {
  margin: 0 0 6px 0;
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.room-temp h4 {
  margin: 0 0 18px 0;
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.temp-display {
  margin-top: 20px;
  font-size: 28px;
  font-weight: 400;
  color: white;
  background: linear-gradient(180deg, #171d22 0%, #3b82f6 100%);
  border-radius: 32px;
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.room-image {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.room-image img {
  width: 90%;
  object-fit: contain;
  border-radius: 12px;
}

.temp-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 28px;
  font-weight: 400;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  padding: 24px 20px;
  border-radius: 50%;
  backdrop-filter: blur(4px);
}

/* 模式控制按钮 */
.mode-controls {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

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
  background: #2a2a2a;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 10px 24px;
}

.mode-btn:hover {
  background: #3a3a3a;
  transform: translateY(-2px);
}

.mode-btn.active {
  border: 1px solid var(--color-primary);
  color: white;
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

/* 设备列表 */
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
  background: #2a2a2a;
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

</style>

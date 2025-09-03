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

        <!-- 空调控制卡片 -->
        <div class="air-cooler-card">
          <div class="card-header">
            <div class="device-info">
              <h3>Air Cooler</h3>
              <p>GTA AC00L4</p>
            </div>
            <div class="power-switch">
              <span class="switch-label">On</span>
              <div class="switch-button active"></div>
            </div>
          </div>
          
          <div class="temperature-section">
            <div class="ac-temp">
              <h4>AC Temperature</h4>
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
            <button 
              v-for="mode in acModes" 
              :key="mode.id"
              :class="['mode-btn', { active: mode.id === activeMode }]"
              @click="setActiveMode(mode.id)"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path v-if="mode.id === 'heat'" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="2" fill="none"/>
                <path v-else-if="mode.id === 'dry'" d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10c0-5.5-4.5-10-10-10z" stroke="currentColor" stroke-width="2" fill="none"/>
                <path v-else-if="mode.id === 'cool'" d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10c0-5.5-4.5-10-10-10z" stroke="currentColor" stroke-width="2" fill="none"/>
                <path v-else-if="mode.id === 'auto'" d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10c0-5.5-4.5-10-10-10z" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
              {{ mode.name }}
            </button>
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
              <path v-if="device.type === 'light'" d="M9 21h6M12 3a6 6 0 0 0-6 6v6a6 6 0 0 0 12 0V9a6 6 0 0 0-6-6z" stroke="currentColor" stroke-width="2" fill="none"/>
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
</script>

<style scoped>
@import '../styles/colors.css';

.home-page {
  width: 100%;
  padding: 8px 24px;
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
  border-color: var(--color-primary);
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
}

/* 空调控制卡片 */
.air-cooler-card {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.device-info h3 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.device-info p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.power-switch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.switch-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.switch-button {
  width: 40px;
  height: 20px;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.switch-button.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.switch-button::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  background: var(--color-text-primary);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.switch-button.active::after {
  left: 22px;
}

/* 温度区域 */
.temperature-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.ac-temp, .room-temp {
  text-align: center;
}

.ac-temp h4, .room-temp h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.temp-display {
  font-size: 48px;
  font-weight: 700;
  color: var(--color-primary);
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.room-image {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.room-image img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.temp-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 32px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 16px;
  border-radius: 8px;
  backdrop-filter: blur(4px);
}

/* 模式控制按钮 */
.mode-controls {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.mode-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border: none;
  border-radius: 50%;
  background: var(--color-bg-primary);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  width: 60px;
  height: 60px;
}

.mode-btn:hover {
  background: var(--color-hover);
}

.mode-btn.active {
  background: var(--color-primary);
  color: var(--color-bg-primary);
}

.mode-btn svg {
  width: 20px;
  height: 20px;
}

.mode-btn span {
  font-size: 10px;
  font-weight: 500;
}

/* 设备列表 */
.devices-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.device-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.device-card:hover {
  border-color: var(--color-primary);
}

.device-icon {
  width: 40px;
  height: 40px;
  background: var(--color-bg-primary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.device-icon svg {
  width: 20px;
  height: 20px;
  color: var(--color-text-secondary);
}

.device-info {
  flex: 1;
}

.device-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.device-info p {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.device-switch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .devices-list {
    order: -1;
  }
}

@media (max-width: 768px) {
  .home-page {
    padding: 16px;
  }
  
  .room-navigation {
    gap: 8px;
    margin-bottom: 24px;
  }
  
  .room-btn, .add-room-btn {
    padding: 10px 16px;
    font-size: 13px;
  }
  
  .temperature-section {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .mode-controls {
    gap: 8px;
  }
  
  .mode-btn {
    width: 50px;
    height: 50px;
    padding: 12px;
  }
}
</style>

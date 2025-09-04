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
              <div class="temp-display" :style="{ '--temp-end-color': tempEndColor }">{{ acTemp }}°</div>
            </div>
            <div class="room-temp">
              <h4>Room Temperature</h4>
              <div class="room-image" :style="{ '--room-tint': roomTint }">
                <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop" alt="Living Room">
                <div class="temp-overlay">20°</div>
              </div>
            </div>
          </div>
          
          <div class="mode-controls">
          <div v-for="mode in acModes" class="mode-div">
            <button :key="mode.id"
              :class="['mode-btn', { active: mode.id === activeMode, disabled: !acPower }]"
              :disabled="!acPower"
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
      
        <!-- 摄像头模块（移动到下方） -->
        <div class="camera-card">
          <div class="camera-header">
            <h3>Camera</h3>
            <div class="camera-controls">
              <button 
                class="mic-button"
                :class="{ listening: isListening }"
                @mousedown.prevent="startVoice"
                @mouseup.prevent="stopVoice"
                @mouseleave.prevent="stopVoice"
                @touchstart.prevent="startVoice"
                @touchend.prevent="stopVoice"
                :title="isListening ? 'Release to stop' : 'Hold to talk'"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 14a3 3 0 003-3V7a3 3 0 10-6 0v4a3 3 0 003 3z" stroke="currentColor" stroke-width="1.8"/>
                  <path d="M19 11a7 7 0 01-14 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                  <path d="M12 18v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </button>
              <div class="room-selector-wrapper">
                <button class="room-selector" @click="cameraMenuOpen = !cameraMenuOpen">
                  <span>{{ roomLabel }}</span>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <div v-if="cameraMenuOpen" class="room-selector-menu">
                  <button 
                    v-for="room in rooms.filter(r => r.id !== 'all')"
                    :key="room.id"
                    :class="['room-selector-item', { selected: room.id === selectedCameraRoom }]"
                    @click.stop="selectCameraRoom(room.id)"
                  >
                    {{ room.name }}
                  </button>
                </div>
              </div>
              <div class="camera-switch">
                <span class="switch-label">{{ cameraPower ? 'On' : 'Off' }}</span>
                <div 
                  :class="['switch-button', { active: cameraPower }]"
                  @click="toggleCamera"
                ></div>
              </div>
            </div>
          </div>
          <div class="camera-view">
            <video v-if="cameraPower" class="camera-video" :src="cameraVideoSrc" autoplay muted loop playsinline></video>
            <div v-else class="camera-placeholder">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" fill="none"/>
                <circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
              <p>Camera Off</p>
            </div>
            <button 
              v-if="cameraPower"
              class="fullscreen-button"
              @click="toggleFullscreen"
              :title="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path v-if="!isFullscreen" d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path v-else d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div class="voice-output">
            <span v-if="!speechSupported">Your browser does not support SpeechRecognition.</span>
            <span v-else>{{ transcript || (isListening ? 'Listening…' : 'Hold mic to speak') }}</span>
          </div>
        </div>

        <!-- 扫地机器人控制面板 -->
        <div class="vacuum-card">
          <div class="card-header">
            <div class="vacuum-card-info">
              <h3>Smart Vacuum</h3>
              <p>KLAZ Vacuum Pro</p>
            </div>
            <div class="power-switch">
              <span class="switch-label">{{ vacuumPower ? 'On' : 'Off' }}</span>
              <div 
                :class="['switch-button', { active: vacuumPower }]"
                @click="toggleVacuum"
              ></div>
            </div>
          </div>
          
          <div class="vacuum-status-section">
            <div class="vacuum-info">
              <div class="status-display">
                <div class="status-icon" :class="vacuumStatus">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10c0-5.5-4.5-10-10-10z" stroke="currentColor" stroke-width="2" fill="none"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                  </svg>
                </div>
                <div class="status-text">
                  <h4>{{ vacuumStatusText }}</h4>
                  <p>{{ vacuumBattery }}% Battery</p>
                </div>
              </div>
              <div class="cleaning-progress">
                <div class="progress-label">Cleaning Progress</div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: vacuumProgress + '%' }"></div>
                </div>
                <div class="progress-text">{{ vacuumProgress.toFixed(1) }}%</div>
              </div>
            </div>
          </div>
          
          <div class="vacuum-controls">
            <div v-for="mode in vacuumModes" class="mode-div">
              <button :key="mode.id"
                :class="['mode-btn', { active: mode.id === activeVacuumMode && vacuumPower, disabled: !vacuumPower }]"
                :disabled="!vacuumPower"
                @click="setVacuumMode(mode.id)">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path v-if="mode.id === 'auto'" d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10c0-5.5-4.5-10-10-10z M12 6v6l4 2" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path v-else-if="mode.id === 'spot'" d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10c0-5.5-4.5-10-10-10z M12 8v8 M8 12h8" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path v-else-if="mode.id === 'edge'" d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10c0-5.5-4.5-10-10-10z M8 8h8v8H8z" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path v-else-if="mode.id === 'mop'" d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10c0-5.5-4.5-10-10-10z M12 6v12 M6 12h12" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
              </button>
              <span>{{ mode.name }}</span>
            </div>
          </div>
        </div>

        <!-- 洗衣机控制面板 -->
        <div class="washing-machine-card">
          <div class="card-header">
            <div class="washing-machine-card-info">
              <h3>Washing Machine</h3>
              <p>Samsung Smart Washer</p>
            </div>
            <div class="power-switch">
              <span class="switch-label">{{ washingMachinePower ? 'On' : 'Off' }}</span>
              <div 
                :class="['switch-button', { active: washingMachinePower }]"
                @click="toggleWashingMachine"
              ></div>
            </div>
          </div>
          
          <div class="washing-machine-status-section">
            <div class="washing-machine-info">
              <div class="status-display">
                <div class="status-icon" :class="washingMachineStatus">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6h18v2H3V6zM3 10h18v8H3v-8z" stroke="currentColor" stroke-width="2" fill="none"/>
                    <circle cx="8" cy="14" r="1" fill="currentColor"/>
                    <circle cx="12" cy="14" r="1" fill="currentColor"/>
                    <circle cx="16" cy="14" r="1" fill="currentColor"/>
                  </svg>
                </div>
                <div class="status-text">
                  <h4>{{ washingMachineStatusText }}</h4>
                  <p>{{ washingMachineTime.toFixed(1) }} min remaining</p>
                </div>
              </div>
              <div class="washing-progress">
                <div class="progress-label">Washing Progress</div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: washingMachineProgress + '%' }"></div>
                </div>
                <div class="progress-text">{{ washingMachineProgress.toFixed(1) }}%</div>
              </div>
            </div>
          </div>
          
          <div class="washing-machine-controls">
            <div v-for="mode in washingMachineModes" class="mode-div">
              <button :key="mode.id"
                :class="['mode-btn', { active: mode.id === activeWashingMachineMode && washingMachinePower, disabled: !washingMachinePower }]"
                :disabled="!washingMachinePower"
                @click="setWashingMachineMode(mode.id)">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path v-if="mode.id === 'normal'" d="M3 6h18v2H3V6zM3 10h18v8H3v-8z M8 14h8" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path v-else-if="mode.id === 'quick'" d="M3 6h18v2H3V6zM3 10h18v8H3v-8z M8 12h8 M8 16h8" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path v-else-if="mode.id === 'delicate'" d="M3 6h18v2H3V6zM3 10h18v8H3v-8z M8 13h8" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path v-else-if="mode.id === 'heavy'" d="M3 6h18v2H3V6zM3 10h18v8H3v-8z M8 12h8 M8 14h8 M8 16h8" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
              </button>
              <span>{{ mode.name }}</span>
            </div>
          </div>
        </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
// =========================
// Imports
// =========================
import { ref, computed, watch } from 'vue'

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
// AC modes and state
// =========================
const acModes = ref([
  { id: 'heat', name: 'Heat' },
  { id: 'dry', name: 'Dry' },
  { id: 'cool', name: 'Cool' },
  { id: 'auto', name: 'Auto' }
])

// 当前选中的空调模式
const activeMode = ref('cool')
// 记住上一次的模式，用于断电后恢复
const lastActiveMode = ref(activeMode.value)

// 空调电源状态
const acPower = ref(true)

// 当前空调温度（示例）
const acTemp = ref(16)

// 根据温度选择渐变终点色（6个区间）
const tempEndColor = computed(() => {
  const t = acTemp.value
  if (t <= 10) return 'var(--temp-color-1)'
  if (t <= 16) return 'var(--temp-color-2)'
  if (t <= 22) return 'var(--temp-color-3)'
  if (t <= 26) return 'var(--temp-color-4)'
  if (t <= 30) return 'var(--temp-color-5)'
  return 'var(--temp-color-6)'
})

// 根据模式计算房间覆盖色（房间图片上色）
const roomTint = computed(() => {
  if (!acPower.value) return 'transparent'
  switch (activeMode.value) {
    case 'heat':
      return 'var(--mode-heat-overlay)'
    case 'dry':
      return 'var(--mode-dry-overlay)'
    case 'cool':
      return 'var(--mode-cool-overlay)'
    case 'auto':
      return 'transparent'
    default:
      return 'transparent'
  }
})

// 设备数据
const devices = ref([
  { id: 1, name: 'Smart Light', model: 'Bardi Smart Light', type: 'light', power: false },
  { id: 2, name: 'Smart TV', model: 'Samsung QBOC', type: 'tv', power: true },
  { id: 3, name: 'Smart Vacuum', model: 'KLAZ Vacuum', type: 'vacuum', power: false },
  { id: 4, name: 'Thermostat', model: 'Tuya Zigbe', type: 'thermostat', power: false }
])

// =========================
// Navigation / Mode handlers
// =========================
const setActiveRoom = (roomId) => {
  activeRoom.value = roomId
}

// =========================
// Camera module: independent room selector
// - roomLabel: label for the selector
// - selectedCameraRoom: local selection (independent from nav)
// - cameraMenuOpen: dropdown visibility
// =========================
const roomLabel = computed(() => {
  const map = {
    'living': 'Living Room',
    'dining': 'Dining Room',
    'bedroom': 'Bed Room',
    'bathroom': 'Bath Room',
    'backyard': 'Backyard'
  }
  // 当 activeRoom 为 all 时，默认显示 Living Room
  return map[selectedCameraRoom.value] || 'Living Room'
})

// Camera 独立选择的房间（不影响 room-navigation）
// 初始化选择器为第一个非 all 的房间
const selectedCameraRoom = ref('living')
const cameraMenuOpen = ref(false)

// room-navigation 改变时，自动同步 room-selector 的显示值
watch(activeRoom, (val) => {
  if (val === 'all') return
  selectedCameraRoom.value = val
})

// room-selector 改变时，只影响自身，不修改 activeRoom
const selectCameraRoom = (roomId) => {
  selectedCameraRoom.value = roomId
  cameraMenuOpen.value = false
}

// 示例：按房间提供不同演示视频地址（可接入真实流）
const cameraSources = {
  living: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  dining: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
  bedroom: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
  bathroom: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
  backyard: 'https://media.w3.org/2010/05/video/movie_300.mp4'
}

const cameraVideoSrc = computed(() => {
  return cameraSources[selectedCameraRoom.value] || cameraSources.living
})

// =========================
// Voice input (local speech recognition to text)
// =========================
const SpeechRecognition = (window.SpeechRecognition || window.webkitSpeechRecognition)
const speechSupported = !!SpeechRecognition
const isListening = ref(false)
const transcript = ref('')
let recognition = null

if (speechSupported) {
  recognition = new SpeechRecognition()
  recognition.lang = 'zh-CN'
  recognition.continuous = true
  recognition.interimResults = true
  recognition.onresult = (event) => {
    let text = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      text += event.results[i][0].transcript
    }
    transcript.value = text
  }
  recognition.onend = () => {
    isListening.value = false
  }
}

const startVoice = () => {
  if (!speechSupported || !recognition) return
  transcript.value = ''
  isListening.value = true
  try { recognition.start() } catch (e) { /* ignore double start */ }
}

const stopVoice = () => {
  if (!speechSupported || !recognition) return
  try { recognition.stop() } catch (e) { /* ignore */ }
}

// 设置空调模式
const setActiveMode = (modeId) => {
  if (!acPower.value) return
  activeMode.value = modeId
  lastActiveMode.value = modeId
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
  if (!acPower.value) {
    // 关闭电源时，清除当前模式的选中状态
    lastActiveMode.value = activeMode.value
    activeMode.value = null
  } else {
    // 打开电源时，恢复上一次模式
    activeMode.value = lastActiveMode.value || 'cool'
  }
}

// =========================
// Vacuum robot state and modes
// =========================
const vacuumModes = ref([
  { id: 'auto', name: 'Auto' },
  { id: 'spot', name: 'Spot' },
  { id: 'edge', name: 'Edge' },
  { id: 'mop', name: 'Mop' }
])

const vacuumPower = ref(false)
const activeVacuumMode = ref('auto')
// 记住上一次的模式，用于断电后恢复
const lastActiveVacuumMode = ref(activeVacuumMode.value)
const vacuumStatus = ref('idle') // idle, cleaning, charging, done, error
const vacuumBattery = ref(85)
const vacuumProgress = ref(0)

// 计算状态文本
const vacuumStatusText = computed(() => {
  if (!vacuumPower.value) return 'Offline'
  switch (vacuumStatus.value) {
    case 'idle': return 'Idle'
    case 'cleaning': return 'Cleaning'
    case 'charging': return 'Charging'
    case 'done': return 'Done'
    case 'error': return 'Error'
    default: return 'Unknown'
  }
})

// =========================
// Washing machine state and modes
// =========================
const washingMachineModes = ref([
  { id: 'normal', name: 'Normal' },
  { id: 'quick', name: 'Quick' },
  { id: 'delicate', name: 'Delicate' },
  { id: 'heavy', name: 'Heavy' }
])

const washingMachinePower = ref(false)
const activeWashingMachineMode = ref('normal')
// 记住上一次的模式，用于断电后恢复
const lastActiveWashingMachineMode = ref(activeWashingMachineMode.value)
const washingMachineStatus = ref('idle') // idle, washing, rinsing, spinning, done
const washingMachineTime = ref(0)
const washingMachineProgress = ref(0)

// 计算状态文本
const washingMachineStatusText = computed(() => {
  if (!washingMachinePower.value) return 'Offline'
  switch (washingMachineStatus.value) {
    case 'idle': return 'Idle'
    case 'washing': return 'Washing'
    case 'rinsing': return 'Rinsing'
    case 'spinning': return 'Spinning'
    case 'done': return 'Done'
    default: return 'Unknown'
  }
})

// =========================
// Camera power state
// =========================
const cameraPower = ref(true)

// 切换扫地机器人开关
const toggleVacuum = () => {
  vacuumPower.value = !vacuumPower.value
  if (!vacuumPower.value) {
    // 关闭电源时，清除当前模式的选中状态
    lastActiveVacuumMode.value = activeVacuumMode.value
    activeVacuumMode.value = null
    vacuumStatus.value = 'idle'
    vacuumProgress.value = 0
  } else {
    // 打开电源时，不默认选中任何模式
    activeVacuumMode.value = null
    vacuumStatus.value = 'idle'
    vacuumProgress.value = 0
  }
}

// 设置扫地机器人模式
const setVacuumMode = (modeId) => {
  if (!vacuumPower.value) return
  activeVacuumMode.value = modeId
  lastActiveVacuumMode.value = modeId
  
  // 模拟开始清洁
  if (modeId !== 'auto' || vacuumStatus.value === 'idle') {
    vacuumStatus.value = 'cleaning'
    startCleaningSimulation()
  }
}

// 模拟清洁进度
const startCleaningSimulation = () => {
  vacuumProgress.value = 0
  const interval = setInterval(() => {
    if (vacuumProgress.value < 100 && vacuumStatus.value === 'cleaning') {
      vacuumProgress.value += Math.random() * 5
      if (vacuumProgress.value >= 100) {
        vacuumProgress.value = 100
        vacuumStatus.value = 'done'
        clearInterval(interval)
        
        // 3秒后重置按钮和进度条
        setTimeout(() => {
          activeVacuumMode.value = null
          vacuumStatus.value = 'idle'
          vacuumProgress.value = 0
        }, 3000)
      }
    } else {
      clearInterval(interval)
    }
  }, 1000)
}

// 切换洗衣机开关
const toggleWashingMachine = () => {
  washingMachinePower.value = !washingMachinePower.value
  if (!washingMachinePower.value) {
    // 关闭电源时，清除当前模式的选中状态
    lastActiveWashingMachineMode.value = activeWashingMachineMode.value
    activeWashingMachineMode.value = null
    washingMachineStatus.value = 'idle'
    washingMachineProgress.value = 0
    washingMachineTime.value = 0
  } else {
    // 打开电源时，不默认选中任何模式
    activeWashingMachineMode.value = null
    washingMachineStatus.value = 'idle'
    washingMachineProgress.value = 0
    washingMachineTime.value = 0
  }
}

// 设置洗衣机模式
const setWashingMachineMode = (modeId) => {
  if (!washingMachinePower.value) return
  activeWashingMachineMode.value = modeId
  lastActiveWashingMachineMode.value = modeId
  
  // 模拟开始洗衣
  washingMachineStatus.value = 'washing'
  startWashingSimulation()
}

// 模拟洗衣进度
const startWashingSimulation = () => {
  washingMachineProgress.value = 0
  washingMachineTime.value = 45 // 默认45分钟
  
  const interval = setInterval(() => {
    if (washingMachineProgress.value < 100 && washingMachineStatus.value !== 'idle') {
      washingMachineProgress.value += Math.random() * 8
      washingMachineTime.value = Math.max(0, washingMachineTime.value - 1.2)
      
      // 模拟洗衣阶段
      if (washingMachineProgress.value >= 100) {
        washingMachineProgress.value = 100
        washingMachineStatus.value = 'done'
        washingMachineTime.value = 0
        clearInterval(interval)
        
        // 3秒后重置按钮和进度条
        setTimeout(() => {
          activeWashingMachineMode.value = null
          washingMachineStatus.value = 'idle'
          washingMachineProgress.value = 0
        }, 3000)
      } else if (washingMachineProgress.value >= 60 && washingMachineStatus.value === 'washing') {
        washingMachineStatus.value = 'spinning'
      } else if (washingMachineProgress.value >= 30 && washingMachineStatus.value === 'washing') {
        washingMachineStatus.value = 'rinsing'
      }
    } else {
      clearInterval(interval)
    }
  }, 1000)
}

// 切换摄像头开关
const toggleCamera = () => {
  cameraPower.value = !cameraPower.value
}

// =========================
// Fullscreen functionality
// =========================
const isFullscreen = ref(false)

const toggleFullscreen = () => {
  const cameraView = document.querySelector('.camera-view')
  if (!cameraView) return

  if (!isFullscreen.value) {
    // Enter fullscreen
    if (cameraView.requestFullscreen) {
      cameraView.requestFullscreen()
    } else if (cameraView.webkitRequestFullscreen) {
      cameraView.webkitRequestFullscreen()
    } else if (cameraView.msRequestFullscreen) {
      cameraView.msRequestFullscreen()
    }
  } else {
    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  }
}

// Listen for fullscreen changes
const handleFullscreenChange = () => {
  isFullscreen.value = !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  )
}

// Add event listeners for fullscreen changes
document.addEventListener('fullscreenchange', handleFullscreenChange)
document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
document.addEventListener('msfullscreenchange', handleFullscreenChange)
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

/* =========================
   Air cooler card
   ========================= */
.air-cooler-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 24px 18px;
}

/* =========================
   Vacuum robot card
   ========================= */
.vacuum-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 24px 18px;
}

.vacuum-card-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.vacuum-card-info p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.vacuum-status-section {
  margin-bottom: 24px;
}

.vacuum-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.status-display {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-button-dark);
  transition: all 0.3s ease;
}

.status-icon svg {
  width: 24px;
  height: 24px;
  color: var(--color-text-secondary);
}

.status-icon.idle {
  background: var(--color-button-dark);
}

.status-icon.cleaning {
  background: var(--color-primary);
  animation: pulse 2s infinite;
}

.status-icon.charging {
  background: var(--color-blue-500);
}

.status-icon.error {
  background: var(--color-red-500);
}

.status-icon.done {
  background: var(--color-green-500);
  animation: pulse 1s infinite;
}

/* 扫地机器人done状态样式 */
.vacuum-card .status-icon.done {
  background: #10b981;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.status-text h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.status-text p {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.cleaning-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--color-button-dark);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-blue-500) 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: var(--color-text-secondary);
  text-align: right;
}

.vacuum-controls {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

/* =========================
   Washing machine card
   ========================= */
.washing-machine-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 24px 18px;
}

.washing-machine-card-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.washing-machine-card-info p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.washing-machine-status-section {
  margin-bottom: 24px;
}

.washing-machine-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.washing-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.washing-machine-controls {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

/* 洗衣机状态图标样式 */
.washing-machine-card .status-icon.idle {
  background: var(--color-button-dark);
}

.washing-machine-card .status-icon.washing {
  background: var(--color-blue-500);
  animation: pulse 2s infinite;
}

.washing-machine-card .status-icon.rinsing {
  background: #60a5fa;
  animation: pulse 2s infinite;
}

.washing-machine-card .status-icon.spinning {
  background: var(--color-blue-600);
  animation: pulse 1.5s infinite;
}

.washing-machine-card .status-icon.done {
  background: #10b981;
  animation: pulse 1s infinite;
}

/* =========================
   Camera module
   ========================= */
.camera-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 16px;
}

.camera-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.camera-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.camera-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.room-selector {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-primary);
}

.room-selector svg {
  width: 14px;
  height: 14px;
}

.room-selector-wrapper {
  position: relative;
  display: inline-block;
}

.mic-button {
  margin-left: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-primary);
}

.mic-button svg {
  width: 18px;
  height: 18px;
}

.mic-button.listening {
  border-color: var(--color-primary);
  color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(191, 254, 1, 0.12);
}

.camera-view {
  position: relative;
  min-height: 340px;
  border-radius: 12px;
  background: var(--color-bg-card);
  border: 1px dashed var(--color-border);
  overflow: hidden;
}

.camera-view:hover .fullscreen-button {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
}

.room-selector-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 5;
  min-width: 160px;
  box-shadow: 0 8px 24px var(--shadow-soft);
}

.room-selector-item {
  padding: 6px 10px;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid transparent;
  text-align: left;
}

.room-selector-item.selected {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.camera-switch {
  display: flex;
  align-items: center;
  gap: 8px;
}

.camera-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  gap: 12px;
}

.camera-placeholder svg {
  width: 48px;
  height: 48px;
}

.camera-placeholder p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

.camera-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fullscreen-button {
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  transform: scale(0.8);
}

.camera-view:hover .fullscreen-button:hover {
  background: rgba(0, 0, 0, 0.8);
  border-color: var(--color-primary);
  transform: scale(1.05);
}

.fullscreen-button svg {
  width: 18px;
  height: 18px;
}

.voice-output {
  margin-top: 8px;
  font-size: 12px;
  color: var(--color-text-secondary);
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

/* =========================
   Temperature section
   ========================= */
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
  background: linear-gradient(180deg, var(--color-temp-gradient-start) 0%, var(--temp-end-color, var(--color-blue-500)) 100%);
  border-radius: 32px;
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px var(--shadow-soft);
}

.room-image {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.room-image img {
  width: 100%;
  object-fit: contain;
}

.room-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--room-tint, transparent);
  pointer-events: none;
}

.temp-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 28px;
  font-weight: 400;
  color: white;
  text-shadow: 0 2px 4px var(--color-border-light);
  padding: 24px 20px;
  border-radius: 50%;
  backdrop-filter: blur(6px);
}

/* =========================
   Mode control buttons
   ========================= */
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

</style>

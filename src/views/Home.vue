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
        <WashingMachineCard @show-records="onShowWashingMachineRecords" />
        
        <!-- 冰箱控制面板 -->
        <div class="refrigerator-card">
          <div class="card-header">
            <div class="refrigerator-card-info">
              <h3>Refrigerator</h3>
              <p>Haier Smart Fridge</p>
            </div>
            
            <!-- 冰箱模式选择 -->
            <div class="refrigerator-modes-header">
              <div class="mode-buttons">
                <button 
                  v-for="mode in [{ id: 'normal', name: '标准' }, { id: 'eco', name: '节能' }, { id: 'vacation', name: '度假' }]"
                  :key="mode.id"
                  :class="['mode-btn', { active: mode.id === refrigeratorMode && refrigeratorPower, disabled: !refrigeratorPower }]"
                  :disabled="!refrigeratorPower"
                  @click="setRefrigeratorMode(mode.id)">
                  {{ mode.name }}
                </button>
              </div>
            </div>
            
            <div class="power-switch">
              <span class="switch-label">{{ refrigeratorPower ? 'On' : 'Off' }}</span>
              <div 
                :class="['switch-button', { active: refrigeratorPower }]"
                @click="toggleRefrigerator"
              ></div>
            </div>
          </div>
          
          <div class="refrigerator-status-section">
            <div class="refrigerator-info">
              <div class="status-display">
                <div class="status-icon" :class="refrigeratorStatus">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4h16v16H4V4zM6 6v12h12V6H6zM8 8h8v2H8V8zM8 12h8v2H8v-2z" stroke="currentColor" stroke-width="2" fill="none"/>
                  </svg>
                </div>
                <div class="status-text">
                  <h4>{{ refrigeratorStatusText }}</h4>
                  <p>Smart Refrigeration System</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 冷藏室控制 -->
          <div class="refrigerator-controls">
            <div class="compartment-control cooling-compartment">
              <div class="compartment-header">
                <h4>冷藏室</h4>
                <div class="temperature-display">
                  {{ refrigeratorSettings.coolingTemperature }}°C
                </div>
              </div>
              
              <div class="temperature-control">
                <label>温度设置</label>
                <div class="temp-slider-container">
                  <input 
                    type="range" 
                    min="-2" 
                    max="20" 
                    step="1"
                    :value="refrigeratorSettings.coolingTemperature"
                    :disabled="!refrigeratorPower"
                    @input="setCoolingTemperature(parseInt($event.target.value))"
                    class="temp-slider">
                  <div class="temp-labels">
                    <span>-2°C</span>
                    <span>4°C</span>
                    <span>10°C</span>
                    <span>16°C</span>
                    <span>20°C</span>
                  </div>
                </div>
              </div>
              
              <div class="sterilization-control">
                <label>杀菌功能</label>
                <div 
                  :class="['sterilization-switch', { active: refrigeratorSettings.coolingSterilization && refrigeratorPower, disabled: !refrigeratorPower }]"
                  @click="toggleCoolingSterilization">
                  <div class="switch-indicator"></div>
                </div>
              </div>
            </div>
            
            <!-- 冷冻室控制 -->
            <div class="compartment-control freezer-compartment">
              <div class="compartment-header">
                <h4>冷冻室</h4>
                <div class="temperature-display">
                  {{ freezerSettings.freezerTemperature }}°C
                </div>
              </div>
              
              <div class="temperature-control">
                <label>温度设置</label>
                <div class="temp-slider-container">
                  <input 
                    type="range" 
                    min="-12" 
                    max="0" 
                    step="1"
                    :value="freezerSettings.freezerTemperature"
                    :disabled="!refrigeratorPower"
                    @input="setFreezerTemperature(parseInt($event.target.value))"
                    class="temp-slider">
                  <div class="temp-labels">
                    <span>-12°C</span>
                    <span>-9°C</span>
                    <span>-6°C</span>
                    <span>-3°C</span>
                    <span>0°C</span>
                  </div>
                </div>
              </div>
              
              <div class="sterilization-control">
                <label>杀菌功能</label>
                <div 
                  :class="['sterilization-switch', { active: freezerSettings.freezerSterilization && refrigeratorPower, disabled: !refrigeratorPower }]"
                  @click="toggleFreezerSterilization">
                  <div class="switch-indicator"></div>
                </div>
              </div>
            </div>
          </div>
         </div>
         
         <!-- 音响控制面板 -->
         <div class="speaker-card">
           <div class="card-header">
             <div class="speaker-card-info">
               <h3>Smart Speaker</h3>
               <p>Xiaomi AI Speaker</p>
             </div>
             
             <div class="power-switch">
               <span class="switch-label">{{ speakerPower ? 'On' : 'Off' }}</span>
               <div 
                 :class="['switch-button', { active: speakerPower }]"
                 @click="toggleSpeaker"
               ></div>
             </div>
           </div>
           
           
           <!-- 歌曲信息和歌词显示区域 -->
           <div class="song-lyrics-section">
             <div class="song-info">
               <div class="song-cover-section">
                 <div class="song-cover">
                   <img 
                     :src="currentSong.cover" 
                     :alt="currentSong.title"
                     @error="handleImageError"
                     :style="{ display: imageError ? 'none' : 'block' }"
                   />
                   <div v-if="imageError" class="default-cover">
                     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                     </svg>
                   </div>
                 </div>
                 <div class="song-details">
                   <div class="song-title-row">
                     <h4 class="song-title">{{ currentSong.title }}</h4>
                     <span class="song-artist">{{ currentSong.artist }}</span>
                   </div>
                   <p class="song-album">{{ currentSong.album }}</p>
                 </div>
               </div>
               <div class="lyrics-container">
                 <div class="lyrics-lines">
                   <div class="lyrics-line previous">
                     {{ lyrics[currentLyricIndex - 1] || '' }}
                   </div>
                   <div class="lyrics-line current" :class="{ 'active': speakerStatus === 'playing' }">
                     {{ lyrics[currentLyricIndex] || '暂无歌词' }}
                   </div>
                   <div class="lyrics-line next">
                     {{ lyrics[currentLyricIndex + 1] || '' }}
                   </div>
                 </div>
               </div>
             </div>
           </div>
           
           <!-- 播放控制 -->
           <div class="playback-controls">
             <div class="progress-section">
               <div class="time-display">
                 <span class="current-time">{{ formatTime(currentTime) }}</span>
                 <span class="total-time">{{ formatTime(songDuration) }}</span>
               </div>
               <div class="progress-bar" @click="handleProgressClick" ref="progressBar">
                 <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
                 <div 
                   class="progress-thumb" 
                   :style="{ left: progressPercentage + '%' }"
                   @mousedown="handleProgressMouseDown"
                 ></div>
               </div>
             </div>
             
             <div class="control-buttons">
               <button class="control-btn prev-btn" :disabled="!speakerPower" @click="previousSong">
                 <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M19 20L9 12l10-8v16zM5 19V5v14z" stroke="currentColor" stroke-width="2" fill="none"/>
                 </svg>
               </button>
               
               <button 
                 class="control-btn play-pause-btn" 
                 :disabled="!speakerPower" 
                 @click="togglePlayPause"
               >
                 <svg v-if="speakerStatus === 'playing'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M6 4h4v16H6V4zM14 4h4v16h-4V4z" stroke="currentColor" stroke-width="2" fill="none"/>
                 </svg>
                 <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M8 5v14l11-7z" stroke="currentColor" stroke-width="2" fill="none"/>
                 </svg>
               </button>
               
               <button class="control-btn next-btn" :disabled="!speakerPower" @click="nextSong">
                 <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M5 4l10 8-10 8V4zM19 4v16" stroke="currentColor" stroke-width="2" fill="none"/>
                 </svg>
               </button>
             </div>
           </div>
         </div>
         
        <!-- 空气净化器模块 -->
        <div class="air-card">
          <div class="card-header">
            <div class="air-card-info">
              <h3>Air Purifier</h3>
              <p>Indoor Air Quality</p>
            </div>
            <div class="power-switch">
              <span class="switch-label">{{ airPurifierPower ? 'On' : 'Off' }}</span>
              <div 
                :class="['switch-button', { active: airPurifierPower }]"
                @click="toggleAirPurifier"
              ></div>
            </div>
          </div>

          <div class="air-status-section">
            <div class="air-summary">
              <div class="aqi-circle" :class="airQualityLevel">
                <div class="aqi-value">{{ sensors.pm25 }}</div>
                <div class="aqi-label">PM2.5</div>
              </div>
              <div class="air-summary-text">
                <h4>{{ airQualityText }}</h4>
                <p>CO₂ {{ sensors.co2 }} ppm · VOC {{ sensors.voc }} ppb</p>
              </div>
            </div>

            <div class="air-sensors-grid">
              <div class="sensor-item"><div class="label">PM2.5</div><div class="value">{{ sensors.pm25 }} μg/m³</div></div>
              <div class="sensor-item"><div class="label">PM10</div><div class="value">{{ sensors.pm10 }} μg/m³</div></div>
              <div class="sensor-item"><div class="label">甲醛</div><div class="value">{{ sensors.hcho }} mg/m³</div></div>
              <div class="sensor-item"><div class="label">CO₂</div><div class="value">{{ sensors.co2 }} ppm</div></div>
              <div class="sensor-item"><div class="label">温度</div><div class="value">{{ sensors.temp.toFixed(1) }} °C</div></div>
              <div class="sensor-item"><div class="label">湿度</div><div class="value">{{ sensors.humidity.toFixed(1) }} %</div></div>
              <div class="sensor-item"><div class="label">VOC</div><div class="value">{{ sensors.voc }} ppb</div></div>
            </div>
          </div>

          <div class="air-controls">
            <div class="mode-row">
              <button 
                class="mode-btn"
                :class="{ active: autoMode, disabled: !airPurifierPower }"
                :disabled="!airPurifierPower"
                @click="toggleAutoMode"
              >自动模式</button>

              <div class="speed-control" :class="{ disabled: !airPurifierPower || autoMode }">
                <span class="speed-label">风速</span>
                <div class="speed-dots">
                  <button 
                    v-for="n in 5" :key="n"
                    class="dot"
                    :class="{ active: fanSpeed >= n }"
                    :disabled="!airPurifierPower || autoMode"
                    @click="setFanSpeed(n)"
                  ></button>
                </div>
              </div>
            </div>

            <div class="timer-row">
              <div class="timer-toggle">
                <label class="switch">
                  <input type="checkbox" v-model="timerEnabled" :disabled="!airPurifierPower" />
                  <span class="slider"></span>
                </label>
                <span class="timer-label">定时关机</span>
              </div>
              <div class="timer-options">
                <button 
                  v-for="h in [1,2,4,8]" :key="h"
                  class="timer-btn"
                  :class="{ active: timerEnabled && timerOffHours === h, disabled: !airPurifierPower || !timerEnabled }"
                  :disabled="!airPurifierPower || !timerEnabled"
                  @click="setTimerOff(h)"
                >{{ h }}h</button>
              </div>
            </div>
          </div>
        </div>
         
       </div>
       </div>

     </div>
   </div>

  <!-- 洗衣机关闭确认对话框 -->
  <div v-if="showWashConfirmDialog" class="confirm-dialog-overlay" @click="cancelTurnOffWashingMachine">
    <div class="confirm-dialog" @click.stop>
      <div class="confirm-dialog-header">
        <h3>确认关闭洗衣机</h3>
      </div>
      <div class="confirm-dialog-content">
        <p>洗衣机正在运行中，确定要关闭吗？</p>
        <p class="warning-text">关闭后洗衣进度将丢失，需要重新开始。</p>
      </div>
      <div class="confirm-dialog-actions">
        <button class="cancel-btn" @click="cancelTurnOffWashingMachine">取消</button>
        <button class="confirm-btn" @click="confirmTurnOffWashingMachine">确认关闭</button>
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

  <!-- 洗衣机记录对话框 -->
  <div v-if="showWashingMachineRecords" class="record-dialog-overlay" @click="closeRecordDialog">
    <div class="record-dialog" @click.stop>
      <div class="record-dialog-header">
        <h3>洗衣记录</h3>
        <button class="close-btn" @click="closeRecordDialog">×</button>
      </div>
      <div class="record-dialog-content">
        <div class="record-list">
          <div v-for="record in washingMachineRecords" :key="record.id" class="record-item">
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
// AC extracted to widget

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

// Camera moved to widget

// 示例：按房间提供不同演示视频地址（可接入真实流）
const cameraSources = {
  living: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  dining: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
  bedroom: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
  bathroom: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
  backyard: 'https://media.w3.org/2010/05/video/movie_300.mp4'
}

// Camera moved to widget

// =========================
// Voice input (local speech recognition to text)
// =========================
// Camera moved to widget

// AC methods moved to widget

// 切换设备开关
const toggleDevice = (deviceId) => {
  const device = devices.value.find(d => d.id === deviceId)
  if (device) {
    device.power = !device.power
  }
}

// AC methods moved to widget

// Vacuum moved to widget

// Washing machine moved to widget; keep record dialog states only
const showVacuumRecords = ref(false)
const showWashingMachineRecords = ref(false)

// Washing machine records stored in child; receive via event when needed
const washingMachineRecords = ref([])

// =========================
// Speaker state and modes
// =========================
const speakerPower = ref(false)
const speakerStatus = ref('idle') // idle, playing, paused
const currentSong = ref({
  title: '夜曲',
  artist: '周杰伦',
  album: '十一月的萧邦',
  cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop'
})

const currentTime = ref(0)
const songDuration = ref(210) // 3分30秒
const currentLyricIndex = ref(0)

// 歌词数据
const lyrics = ref([
  '一群嗜血的蚂蚁 被腐肉所吸引',
  '我面无表情 看孤独的风景',
  '失去你 爱哭的声音',
  '我的爱 像断线风筝',
  '飞向天空 飞向自由',
  '失去你 爱哭的声音',
  '我的爱 像断线风筝',
  '飞向天空 飞向自由',
  '失去你 爱哭的声音',
  '我的爱 像断线风筝'
])

// 播放列表
const playlist = ref([
  {
    title: '夜曲',
    artist: '周杰伦',
    album: '十一月的萧邦',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
    duration: 210
  },
  {
    title: '青花瓷',
    artist: '周杰伦',
    album: '我很忙',
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f198198788?w=200&h=200&fit=crop',
    duration: 240
  },
  {
    title: '稻香',
    artist: '周杰伦',
    album: '魔杰座',
    cover: 'https://images.unsplash.com/photo-1506905925346-14b8e4c1b4c0?w=200&h=200&fit=crop',
    duration: 220
  }
])

const currentSongIndex = ref(0)
const imageError = ref(false)
const progressBar = ref(null)
const isDragging = ref(false)

// =========================
// Refrigerator state and modes
// =========================
const refrigeratorPower = ref(false)
const refrigeratorStatus = ref('idle') // idle, cooling, defrosting, error
const refrigeratorMode = ref('normal') // normal, eco, vacation

// 冷藏室设置
const refrigeratorSettings = ref({
  coolingTemperature: 4, // 冷藏温度
  coolingSterilization: false, // 冷藏杀菌
  coolingStatus: 'idle' // 冷藏状态
})

// 冷冻室设置
const freezerSettings = ref({
  freezerTemperature: -6, // 冷冻温度
  freezerSterilization: false, // 冷冻杀菌
  freezerStatus: 'idle' // 冷冻状态
})


// Washing machine moved to widget

// Washing machine moved to widget

// Washing machine moved to widget

// 音响状态文本
const speakerStatusText = computed(() => {
  if (!speakerPower.value) return 'Offline'
  switch (speakerStatus.value) {
    case 'idle': return 'Idle'
    case 'playing': return 'Playing'
    case 'paused': return 'Paused'
    default: return 'Unknown'
  }
})

// 播放进度百分比
const progressPercentage = computed(() => {
  if (songDuration.value === 0) return 0
  return (currentTime.value / songDuration.value) * 100
})

// =========================
// Camera power state
// =========================
// Camera moved to widget

// Vacuum moved to widget

// Washing machine moved to widget

// Washing machine moved to widget

// 取消关闭洗衣机
const cancelTurnOffWashingMachine = () => {
  showWashConfirmDialog.value = false
}

// 子组件传上来的扫地记录，打开对话框
const vacuumRecords = ref([])
const onShowVacuumRecords = (records) => {
  vacuumRecords.value = Array.isArray(records) ? records : []
  showVacuumRecords.value = true
}

// 子组件传上来的洗衣记录，打开对话框
const onShowWashingMachineRecords = (records) => {
  washingMachineRecords.value = Array.isArray(records) ? records : []
  showWashingMachineRecords.value = true
}

// 关闭记录对话框
const closeRecordDialog = () => {
  showVacuumRecords.value = false
  showWashingMachineRecords.value = false
}

// 冰箱状态文本
const refrigeratorStatusText = computed(() => {
  if (!refrigeratorPower.value) return 'Offline'
  switch (refrigeratorStatus.value) {
    case 'idle': return 'Idle'
    case 'cooling': return 'Cooling'
    case 'defrosting': return 'Defrosting'
    case 'error': return 'Error'
    default: return 'Unknown'
  }
})

// 切换冰箱开关
const toggleRefrigerator = () => {
  refrigeratorPower.value = !refrigeratorPower.value
  if (!refrigeratorPower.value) {
    // 关闭电源时，重置所有状态
    refrigeratorStatus.value = 'idle'
    refrigeratorSettings.value.coolingStatus = 'idle'
    freezerSettings.value.freezerStatus = 'idle'
  } else {
    // 打开电源时，开始制冷
    refrigeratorStatus.value = 'cooling'
    refrigeratorSettings.value.coolingStatus = 'cooling'
    freezerSettings.value.freezerStatus = 'cooling'
  }
}

// 设置冰箱模式
const setRefrigeratorMode = (mode) => {
  if (!refrigeratorPower.value) return
  refrigeratorMode.value = mode
}

// 设置冷藏温度
const setCoolingTemperature = (temp) => {
  if (!refrigeratorPower.value) return
  refrigeratorSettings.value.coolingTemperature = temp
}

// 设置冷冻温度
const setFreezerTemperature = (temp) => {
  if (!refrigeratorPower.value) return
  freezerSettings.value.freezerTemperature = temp
}

// 切换冷藏杀菌
const toggleCoolingSterilization = () => {
  if (!refrigeratorPower.value) return
  refrigeratorSettings.value.coolingSterilization = !refrigeratorSettings.value.coolingSterilization
}

// 切换冷冻杀菌
const toggleFreezerSterilization = () => {
  if (!refrigeratorPower.value) return
  freezerSettings.value.freezerSterilization = !freezerSettings.value.freezerSterilization
}

// =========================
// Speaker control functions
// =========================
// 切换音响开关
const toggleSpeaker = () => {
  speakerPower.value = !speakerPower.value
  if (!speakerPower.value) {
    speakerStatus.value = 'idle'
    currentTime.value = 0
    currentLyricIndex.value = 0
  } else {
    speakerStatus.value = 'paused'
  }
}

// 切换播放/暂停
const togglePlayPause = () => {
  if (!speakerPower.value) return
  
  if (speakerStatus.value === 'playing') {
    speakerStatus.value = 'paused'
  } else if (speakerStatus.value === 'paused') {
    speakerStatus.value = 'playing'
    startPlaybackSimulation()
  } else {
    speakerStatus.value = 'playing'
    startPlaybackSimulation()
  }
}

// 上一曲
const previousSong = () => {
  if (!speakerPower.value) return
  
  currentSongIndex.value = currentSongIndex.value > 0 ? currentSongIndex.value - 1 : playlist.value.length - 1
  loadSong(currentSongIndex.value)
}

// 下一曲
const nextSong = () => {
  if (!speakerPower.value) return
  
  currentSongIndex.value = currentSongIndex.value < playlist.value.length - 1 ? currentSongIndex.value + 1 : 0
  loadSong(currentSongIndex.value)
}

// 加载歌曲
const loadSong = (index) => {
  const song = playlist.value[index]
  currentSong.value = song
  songDuration.value = song.duration
  currentTime.value = 0
  currentLyricIndex.value = 0
  speakerStatus.value = 'paused'
  imageError.value = false // 重置图片错误状态
}

// 格式化时间
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 处理图片加载错误
const handleImageError = () => {
  imageError.value = true
}

// 处理进度条点击
const handleProgressClick = (event) => {
  if (!speakerPower.value || !progressBar.value) return
  
  const rect = progressBar.value.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  const newTime = Math.floor(percentage * songDuration.value)
  
  currentTime.value = Math.max(0, Math.min(newTime, songDuration.value))
}

// 处理进度条拖拽
const handleProgressMouseDown = (event) => {
  if (!speakerPower.value) return
  isDragging.value = true
  
  const handleMouseMove = (e) => {
    if (!isDragging.value || !progressBar.value) return
    
    const rect = progressBar.value.getBoundingClientRect()
    const moveX = e.clientX - rect.left
    const percentage = moveX / rect.width
    const newTime = Math.floor(percentage * songDuration.value)
    
    currentTime.value = Math.max(0, Math.min(newTime, songDuration.value))
  }
  
  const handleMouseUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

// 播放模拟
let playbackInterval = null

const startPlaybackSimulation = () => {
  if (playbackInterval) {
    clearInterval(playbackInterval)
  }
  
  playbackInterval = setInterval(() => {
    if (speakerStatus.value === 'playing' && currentTime.value < songDuration.value) {
      currentTime.value += 1
      
      // 更新歌词索引（每10秒换一行）
      const newLyricIndex = Math.floor(currentTime.value / 10)
      if (newLyricIndex < lyrics.value.length) {
        currentLyricIndex.value = newLyricIndex
      }
    } else if (currentTime.value >= songDuration.value) {
      // 歌曲播放完毕，自动下一曲
      nextSong()
      if (speakerStatus.value === 'playing') {
        speakerStatus.value = 'playing'
        startPlaybackSimulation()
      }
    }
  }, 1000)
}

// 停止播放模拟
const stopPlaybackSimulation = () => {
  if (playbackInterval) {
    clearInterval(playbackInterval)
    playbackInterval = null
  }
}


// Washing machine moved to widget

// Washing machine moved to widget

// Washing machine moved to widget

// Washing machine moved to widget

// Camera moved to widget

// =========================
// Camera moved to widget

// =========================
// Air Purifier state and modes
// =========================
const airPurifierPower = ref(false)
const autoMode = ref(true)
const fanSpeed = ref(3)
const timerEnabled = ref(false)
const timerOffHours = ref(2)
let airTimerId = null

// 传感器数据（模拟）
const sensors = ref({
  pm25: 35, pm10: 50, hcho: 0.05, co2: 680, temp: 24.0, humidity: 48.0, voc: 180
})

const airQualityLevel = computed(() => {
  const v = sensors.value.pm25
  if (v <= 35) return 'good'
  if (v <= 75) return 'moderate'
  if (v <= 115) return 'unhealthy'
  return 'very-bad'
})

const airQualityText = computed(() => {
  const v = sensors.value.pm25
  if (v <= 35) return '空气优'
  if (v <= 75) return '良 · 建议通风'
  if (v <= 115) return '轻度污染 · 建议净化'
  return '重度污染 · 建议强力净化'
})

const toggleAirPurifier = () => {
  airPurifierPower.value = !airPurifierPower.value
  if (!airPurifierPower.value) stopAirSimulation()
  else startAirSimulation()
}

const toggleAutoMode = () => {
  if (!airPurifierPower.value) return
  autoMode.value = !autoMode.value
}

const setFanSpeed = (n) => {
  if (!airPurifierPower.value || autoMode.value) return
  fanSpeed.value = n
}

const setTimerOff = (h) => {
  if (!airPurifierPower.value || !timerEnabled.value) return
  timerOffHours.value = h
}

let sensorsInterval = null
const startAirSimulation = () => {
  if (sensorsInterval) clearInterval(sensorsInterval)
  sensorsInterval = setInterval(() => {
    const drift = (v, d, min, max) => Math.min(max, Math.max(min, v + (Math.random() * d * 2 - d)))
    const powerFactor = airPurifierPower.value ? (autoMode.value ? 1.0 : (1.2 - fanSpeed.value * 0.04)) : 1.0
    sensors.value.pm25 = Math.max(5, Math.round(drift(sensors.value.pm25 * powerFactor, 2, 3, 180)))
    sensors.value.pm10 = Math.max(8, Math.round(drift(sensors.value.pm10 * powerFactor, 2.5, 5, 200)))
    sensors.value.hcho = Number(drift(sensors.value.hcho * powerFactor, 0.005, 0.01, 0.3).toFixed(3))
    sensors.value.co2 = Math.round(drift(sensors.value.co2 * powerFactor, 5, 380, 2000))
    sensors.value.temp = Number(drift(sensors.value.temp, 0.05, 16, 32).toFixed(1))
    sensors.value.humidity = Number(drift(sensors.value.humidity, 0.2, 20, 80).toFixed(1))
    sensors.value.voc = Math.max(50, Math.round(drift(sensors.value.voc * powerFactor, 4, 50, 800)))
  }, 1000)

  if (airTimerId) clearTimeout(airTimerId)
  if (timerEnabled.value) {
    airTimerId = setTimeout(() => {
      airPurifierPower.value = false
      stopAirSimulation()
    }, timerOffHours.value * 60 * 60 * 1000)
  }
}

const stopAirSimulation = () => {
  if (sensorsInterval) { clearInterval(sensorsInterval); sensorsInterval = null }
  if (airTimerId) { clearTimeout(airTimerId); airTimerId = null }
}

onBeforeUnmount(() => stopAirSimulation())

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
/* Air cooler card styles moved to widget */

/* =========================
   Vacuum robot card
   ========================= */
/* Vacuum styles moved to widget */

/* Vacuum styles moved to widget */

/* Vacuum styles moved to widget */

/* Vacuum styles moved to widget */

/* Vacuum styles moved to widget */

/* Vacuum styles moved to widget */

/* Vacuum styles moved to widget */

/* Vacuum styles moved to widget */

/* Vacuum styles moved to widget */

/* Vacuum styles moved to widget */

/* Vacuum styles moved to widget */

/* Vacuum styles moved to widget */

/* Vacuum styles moved to widget */

/* Vacuum styles moved to widget */

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Vacuum styles moved to widget */

/* Vacuum styles moved to widget */

/* Vacuum styles moved to widget */

/* Vacuum styles moved to widget */

/* Vacuum styles moved to widget */

/* Vacuum styles moved to widget */

/* Vacuum styles moved to widget */

/* Vacuum styles moved to widget */

/* =========================
   Washing machine card
   ========================= */
/* Washing machine styles moved to widget */

/* Washing machine styles moved to widget */

/* Washing machine styles moved to widget */

/* Washing machine styles moved to widget */

/* Washing machine styles moved to widget */

.washing-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Washing machine styles moved to widget */

/* 洗衣机详细设置样式 */
/* Washing machine styles moved to widget */

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

/* 洗衣机状态图标样式 */
/* Washing machine styles moved to widget */

/* Washing machine styles moved to widget */

/* Washing machine styles moved to widget */

/* Washing machine styles moved to widget */

/* Washing machine styles moved to widget */

/* Camera styles moved to widget */

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
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

/* Air cooler temperature section styles moved to widget */

/* Air cooler mode control styles moved to widget */

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
/* Washing machine styles moved to widget */

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
   Confirm dialog styles
   ========================= */
.confirm-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.confirm-dialog {
  background: var(--color-bg);
  border-radius: 16px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-border);
}

.confirm-dialog-header {
  margin-bottom: 16px;
}

.confirm-dialog-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.confirm-dialog-content {
  margin-bottom: 24px;
}

.confirm-dialog-content p {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.warning-text {
  color: #f59e0b !important;
  font-weight: 500;
}

.confirm-dialog-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-btn, .confirm-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.cancel-btn {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.cancel-btn:hover {
  background: var(--color-hover);
  color: var(--color-text-primary);
}

.confirm-btn {
  background: #ef4444;
  color: white;
}

.confirm-btn:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
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

/* =========================
   Refrigerator card styles
   ========================= */
.refrigerator-card {
  background: var(--color-bg-card);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid var(--color-border);
  margin-bottom: 24px;
}

.refrigerator-card-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.refrigerator-card-info p {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.refrigerator-status-section {
  margin-bottom: 24px;
}

.refrigerator-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-display {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-button-dark);
  color: var(--color-text-secondary);
  transition: all 0.3s ease;
}

.status-icon.cooling {
  background: var(--color-blue-500);
  color: white;
  animation: pulse 2s infinite;
}

.status-icon.defrosting {
  background: #f59e0b;
  color: white;
  animation: pulse 2s infinite;
}

.status-icon.error {
  background: #ef4444;
  color: white;
  animation: pulse 2s infinite;
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

.refrigerator-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.compartment-control {
  background: var(--color-bg-secondary);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid var(--color-border);
}

.compartment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.compartment-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.temperature-display {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
}

.temperature-control,
.sterilization-control {
  margin-bottom: 16px;
}

.temperature-control:last-child,
.sterilization-control:last-child {
  margin-bottom: 0;
}

.temperature-control label,
.sterilization-control label {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.temp-slider-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.temp-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--color-border);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.temp-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.temp-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.temp-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.temp-slider::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.temp-slider:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.temp-slider:disabled::-webkit-slider-thumb {
  cursor: not-allowed;
}

.temp-slider:disabled::-moz-range-thumb {
  cursor: not-allowed;
}

.temp-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.sterilization-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sterilization-switch {
  width: 40px;
  height: 20px;
  background: var(--color-border);
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sterilization-switch.active {
  background: var(--color-primary);
}

.sterilization-switch.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.switch-indicator {
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: all 0.3s ease;
}

.sterilization-switch.active .switch-indicator {
  transform: translateX(20px);
}

.refrigerator-modes-header {
  display: flex;
  align-items: center;
}

.refrigerator-modes-header .mode-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.refrigerator-modes-header .mode-btn {
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

.refrigerator-modes-header .mode-btn:hover:not(:disabled) {
  background: var(--color-hover);
  color: var(--color-text-primary);
}

.refrigerator-modes-header .mode-btn.active {
  background: var(--color-primary);
  color: #1a1a1a;
  border-color: var(--color-primary);
  font-weight: 600;
}

.refrigerator-modes-header .mode-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* =========================
   Speaker card styles
   ========================= */
.speaker-card {
  background: var(--color-bg-card);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid var(--color-border);
  margin-bottom: 24px;
}

.speaker-card-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.speaker-card-info p {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

/* speaker status section removed */

/* 歌曲信息和歌词区域 */
.song-lyrics-section {
  margin-bottom: 24px;
  padding: 20px;
  background: var(--color-bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.song-info {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.song-cover-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  flex: 0 0 auto;
}

.song-cover {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.song-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-cover {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-tertiary);
  color: var(--color-text-muted);
}

.default-cover svg {
  width: 40px;
  height: 40px;
}

.song-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
  width: 100%;
}

.song-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.song-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.song-artist {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.song-album {
  margin: 0;
  font-size: 10px;
  color: var(--color-text-muted);
  font-weight: 400;
}

.lyrics-container {
  flex: 1;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding-top: 20px;
  padding-left: 10px;
}

.lyrics-lines {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 8px;
}

.lyrics-line {
  font-size: 17px;
  color: var(--color-text-secondary);
  text-align: left;
  padding: 4px 0;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.lyrics-line.current {
  font-size: 19px;
  font-weight: 600;
  color: var(--color-text-primary);
  opacity: 1;
}

.lyrics-line.current.active {
  color: var(--color-primary);
  animation: pulse 2s infinite;
}

.lyrics-line.previous,
.lyrics-line.next {
  font-size: 12px;
  opacity: 0.4;
}

/* 播放控制区域 */
.playback-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.time-display {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: var(--color-border);
  border-radius: 3px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-blue-500) 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: var(--color-primary);
  border-radius: 50%;
  cursor: grab;
  opacity: 0;
  transition: opacity 0.2s ease;
  border: 2px solid var(--color-bg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.progress-bar:hover .progress-thumb {
  opacity: 1;
}

.progress-thumb:active {
  cursor: grabbing;
}

.control-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
}

.control-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover:not(:disabled) {
  background: var(--color-hover);
  border-color: var(--color-primary);
  transform: scale(1.05);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.play-pause-btn {
  width: 56px;
  height: 56px;
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.play-pause-btn:hover:not(:disabled) {
  background: var(--color-primary-dark);
  transform: scale(1.1);
}

.control-btn svg {
  width: 20px;
  height: 20px;
}

.play-pause-btn svg {
  width: 24px;
  height: 24px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .refrigerator-controls {
    gap: 16px;
  }
  
  .song-info {
    flex-direction: column;
    gap: 16px;
  }
  
  .song-cover-section {
    align-items: center;
  }
  
  .lyrics-container {
    min-width: auto;
  }
  
  .control-buttons {
    gap: 16px;
  }
  
  .control-btn {
    width: 40px;
    height: 40px;
  }
  
  .play-pause-btn {
    width: 48px;
    height: 48px;
  }
}

.air-card {
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.air-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.air-card-info h3 { margin: 0; font-size: 16px; font-weight: 700; color: var(--color-text-primary); }
.air-card-info p { margin: 0; font-size: 12px; color: var(--color-text-secondary); }

.air-status-section { display: flex; flex-direction: column; gap: 16px; }
.air-summary { display: flex; align-items: center; gap: 16px; }

.aqi-circle {
  width: 64px; height: 64px; border-radius: 50%;
  background: var(--color-button-dark); color: var(--color-text-secondary);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.aqi-circle.good { background: var(--color-green-500); color: #fff; }
.aqi-circle.moderate { background: var(--color-yellow-500); color: #222; }
.aqi-circle.unhealthy { background: var(--color-orange-500); color: #222; }
.aqi-circle.very-bad { background: var(--color-red-500); color: #fff; }
.aqi-value { font-weight: 700; font-size: 18px; line-height: 1; }
.aqi-label { font-size: 10px; opacity: 0.9; }

.air-summary-text h4 { margin: 0 0 6px 0; font-size: 14px; color: var(--color-text-primary); }
.air-summary-text p { margin: 0; font-size: 12px; color: var(--color-text-secondary); }

.air-sensors-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.sensor-item {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 10px;
  display: flex; justify-content: space-between;
}
.sensor-item .label { font-size: 12px; color: var(--color-text-secondary); }
.sensor-item .value { font-size: 12px; color: var(--color-text-primary); font-weight: 600; }

.air-controls { display: flex; flex-direction: column; gap: 12px; }
.mode-row { display: flex; gap: 12px; align-items: center; }
.mode-row .mode-btn {
  height: 32px; padding: 0 12px; border-radius: 8px;
  border: 1px solid var(--color-border); background: var(--color-bg);
  color: var(--color-text-primary);
}
.mode-row .mode-btn.active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
.mode-row .mode-btn.disabled { opacity: 0.5; cursor: not-allowed; }

.speed-control { display: flex; align-items: center; gap: 10px; }
.speed-control.disabled { opacity: 0.6; pointer-events: none; }
.speed-label { font-size: 12px; color: var(--color-text-secondary); }
.speed-dots { display: flex; gap: 8px; }
.speed-dots .dot {
  width: 10px; height: 10px; border-radius: 50%;
  border: 1px solid var(--color-border); background: var(--color-bg);
}
.speed-dots .dot.active { background: var(--color-primary); border-color: var(--color-primary); }

.timer-row { display: flex; align-items: center; justify-content: space-between; }
.timer-toggle { display: flex; align-items: center; gap: 8px; }
.timer-label { font-size: 12px; color: var(--color-text-secondary); }
.timer-options { display: flex; gap: 8px; }
.timer-btn {
  height: 28px; padding: 0 10px; border-radius: 6px;
  border: 1px solid var(--color-border); background: var(--color-bg);
  color: var(--color-text-primary); font-size: 12px;
}
.timer-btn.active { background: var(--color-primary); border-color: var(--color-primary); color: #fff; }
.timer-btn.disabled { opacity: 0.5; cursor: not-allowed; }

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

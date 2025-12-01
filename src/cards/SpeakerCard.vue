<template>
  <div class="speaker-card">
    <div class="card-header">
        <div class="speaker-card-info">
          <h3>{{ device.name || 'Smart Speaker' }}</h3>
        <div class="connection-status">
          <div 
            :class="['status-indicator', { 
              'connected': wsConnected && deviceOnline,
              'disconnected': !wsConnected || !deviceOnline 
            }]"
          ></div>
          <span class="status-text">
            {{ wsConnected && deviceOnline ? '在线' : '离线' }}
          </span>
          <span v-if="device.sn" class="device-sn">{{ device.sn }}</span>
        </div>
      </div>
      
       <div class="power-switch">
         <span class="switch-label">{{ effectiveSpeakerPower ? 'On' : 'Off' }}</span>
         <div 
           :class="['switch-button', { 
             active: effectiveSpeakerPower,
             disabled: !wsConnected || !deviceOnline 
           }]"
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
        <!-- 音量控制按钮 -->
        <div class="volume-control-wrapper">
          <button 
            class="control-btn volume-btn" 
            :disabled="!effectiveSpeakerPower || !wsConnected || !deviceOnline" 
            @click="toggleVolumePanel"
          >
            <svg v-if="mute" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/>
              <path d="M2 2l20 20" stroke="currentColor" stroke-width="2"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9v6h4l5 5V4L7 9H3zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/>
            </svg>
          </button>
          <!-- 音量调节面板 -->
          <div v-if="showVolumePanel" class="volume-panel">
            <div class="volume-slider-vertical">
              <input 
                type="range" 
                class="volume-slider-vertical-input" 
                :disabled="!effectiveSpeakerPower || !wsConnected || !deviceOnline"
                :value="displayVolume" 
                @input="updateVolumeDisplay"
                @change="updateVolume"
                min="0" 
                max="100"
                orient="vertical"
              />
              <div class="volume-value">{{ displayVolume }}%</div>
            </div>
          </div>
        </div>

        <button 
          class="control-btn prev-btn" 
          :disabled="!effectiveSpeakerPower || !wsConnected || !deviceOnline" 
          @click="previousSong"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 20L9 12l10-8v16zM5 19V5v14z" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
        </button>
         
        <button 
          class="control-btn play-pause-btn" 
          :disabled="!effectiveSpeakerPower || !wsConnected || !deviceOnline" 
          @click="togglePlayPause"
        >
          <svg v-if="speakerStatus === 'playing'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4h4v16H6V4zM14 4h4v16h-4V4z" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5v14l11-7z" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
        </button>
         
        <button 
          class="control-btn next-btn" 
          :disabled="!effectiveSpeakerPower || !wsConnected || !deviceOnline" 
          @click="nextSong"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 4l10 8-10 8V4zM19 4v16" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
        </button>

        <!-- 均衡器控制按钮 -->
        <div class="equalizer-control-wrapper">
          <button 
            class="control-btn equalizer-btn" 
            :disabled="!effectiveSpeakerPower || !wsConnected || !deviceOnline" 
            @click="toggleEqualizerPanel"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 14h2v-4H3v4zM7 18h2V6H7v12zM11 16h2V8h-2v8zM15 20h2V4h-2v16zM19 12h2v-2h-2v2z" fill="currentColor"/>
            </svg>
          </button>
          <!-- 音效设置面板 -->
          <div v-if="showEqualizerPanel" class="equalizer-panel">
            <div class="equalizer-content">
              <!-- 均衡器模式 -->
              <div class="equalizer-mode">
                <div class="control-label">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                  </svg>
                  <span>均衡器</span>
                </div>
                <select 
                  class="equalizer-select" 
                  :disabled="!effectiveSpeakerPower || !wsConnected || !deviceOnline"
                  :value="equalizer" 
                  @change="updateEqualizer"
                >
                  <option value="normal">标准</option>
                  <option value="pop">流行</option>
                  <option value="rock">摇滚</option>
                  <option value="jazz">爵士</option>
                  <option value="classical">古典</option>
                </select>
              </div>
              
              <!-- 低音和高音调节 -->
              <div class="tone-controls">
                <div class="tone-control">
                  <div class="control-label">
                    <span>低音</span>
                  </div>
                  <div class="tone-slider-container">
                    <input 
                      type="range" 
                      class="tone-slider" 
                      :disabled="!effectiveSpeakerPower || !wsConnected || !deviceOnline"
                      :value="displayBass" 
                      @input="updateBassDisplay"
                      @change="updateBass"
                      min="-10" 
                      max="10"
                    />
                    <span class="tone-value">{{ displayBass }}</span>
                  </div>
                </div>
                
                <div class="tone-control">
                  <div class="control-label">
                    <span>高音</span>
                  </div>
                  <div class="tone-slider-container">
                    <input 
                      type="range" 
                      class="tone-slider" 
                      :disabled="!effectiveSpeakerPower || !wsConnected || !deviceOnline"
                      :value="displayTreble" 
                      @input="updateTrebleDisplay"
                      @change="updateTreble"
                      min="-10" 
                      max="10"
                    />
                    <span class="tone-value">{{ displayTreble }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { useWebSocketManager } from '../composables/useWebSocketManager'

// 定义 props
const props = defineProps({
  device: {
    type: Object,
    default: () => ({})
  }
})

// 使用设备管理器
const { deviceManager } = useWebSocketManager()

// 设备序列号 - 从props中获取
const deviceSn = computed(() => props.device?.sn || 'speaker_001')


// 设备在线状态 - 基于传入的device中的status判断
// 设备状态：unconfigured/configured/unbound/bound/online/offline/fault
const deviceOnline = computed(() => {
  return props.device?.status === 'online'
})

// WebSocket连接状态
const wsConnected = computed(() => deviceManager.connectionState.value === 'connected')

// =========================
// 设备属性统一管理
// =========================
const deviceProperties = ref({
  // 基础控制属性
  power: false,           // 电源开关状态 (true/false)
  volume: 50,             // 音量 (0-100)
  mute: false,            // 静音状态 (true/false)
  
  // 音源和播放控制
  source: 'bluetooth',    // 音源类型 (bluetooth/wifi/aux/usb)
  playing: false,         // 播放状态 (true/false)
  track: '夜曲',          // 当前曲目名称
  artist: '周杰伦',       // 艺术家名称
  album: '十一月的萧邦',  // 专辑名称
  duration: 210,          // 歌曲时长 (秒)
  position: 0,            // 播放位置 (秒)
  
  // 播放模式设置
  repeat: 'none',         // 重复模式 (none/one/all)
  shuffle: false,         // 随机播放 (true/false)
  
  // 音效设置
  equalizer: 'normal',    // 均衡器模式 (normal/pop/rock/jazz/classical)
  bass: 0,                // 低音调节 (-10 到 10)
  treble: 0,              // 高音调节 (-10 到 10)
  
  // 设备状态信息
  battery: 85,            // 电池电量 (0-100)
  wifiSignal: -35,        // WiFi信号强度 (dBm)
  bluetoothConnected: true, // 蓝牙连接状态 (true/false)
  bluetoothDevice: 'iPhone 15', // 连接的蓝牙设备名称
  firmwareVersion: '2.1.3' // 固件版本号
})

// 兼容性：保持原有的计算属性
const speakerPower = computed(() => deviceProperties.value.power)
const speakerStatus = computed(() => deviceProperties.value.playing ? 'playing' : 'paused')
const volume = computed(() => deviceProperties.value.volume)
const mute = computed(() => deviceProperties.value.mute)
const equalizer = computed(() => deviceProperties.value.equalizer)
const bass = computed(() => deviceProperties.value.bass)
const treble = computed(() => deviceProperties.value.treble)

// 拖动时的临时值，用于实时显示
const tempVolume = ref(50)
const tempBass = ref(0)
const tempTreble = ref(0)

// 显示用的值，优先使用临时值（拖动时），否则使用本地状态的值
const displayVolume = computed(() => {
  return tempVolume.value !== null ? tempVolume.value : volume.value
})

const displayBass = computed(() => {
  return tempBass.value !== null ? tempBass.value : bass.value
})

const displayTreble = computed(() => {
  return tempTreble.value !== null ? tempTreble.value : treble.value
})

// 面板显示状态
const showVolumePanel = ref(false) // 音量面板显示状态
const showEqualizerPanel = ref(false) // 均衡器面板显示状态

// 从设备属性中获取播放信息
const currentSong = computed(() => ({
  title: deviceProperties.value.track,
  artist: deviceProperties.value.artist,
  album: deviceProperties.value.album,
  cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop'
}))

const currentTime = computed(() => deviceProperties.value.position)
const songDuration = computed(() => deviceProperties.value.duration)
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

// 确保离线时开关始终为Off
const effectiveSpeakerPower = computed(() => {
  // 如果设备离线或WebSocket未连接，强制为Off
  if (!deviceOnline.value || !wsConnected.value) {
    return false
  }
  return speakerPower.value
})


// 监听设备事件通知
const handleDeviceEventNotification = (data) => {
  const { deviceSn: updatedDeviceSn, eventType, eventData, occurredAt } = data
  
  // 只处理当前设备的事件通知
  if (updatedDeviceSn !== deviceSn.value) {
    return
  }
  
  
  // 处理属性更新事件
  if (eventType === 'propertyUpdate') {
    if (eventData) {
      
      // 统一更新设备属性
      Object.keys(eventData).forEach(key => {
        if (eventData[key] !== undefined) {
          deviceProperties.value[key] = eventData[key]
        }
      })
      
      // 同步临时值，确保显示一致性
      if (tempVolume.value === null && eventData.volume !== undefined) {
        tempVolume.value = eventData.volume
      }
      if (tempBass.value === null && eventData.bass !== undefined) {
        tempBass.value = eventData.bass
      }
      if (tempTreble.value === null && eventData.treble !== undefined) {
        tempTreble.value = eventData.treble
      }
    }
  } else {
  }
}

// 监听设备在线状态
watch(deviceOnline, async (isOnline) => {
  if (isOnline) {
    // 只有在WebSocket连接时才能获取属性和订阅
    if (wsConnected.value) {
      await fetchDeviceProperties()
      await subscribeToDeviceProperties()
    }
  } else {
    // 设备离线时，取消订阅并重置状态
    await unsubscribeFromDeviceProperties()
    deviceProperties.value.power = false
    deviceProperties.value.playing = false
  }
})

watch(wsConnected, async (isConnected) => {
  if (isConnected) {
    // 只有在设备在线时才获取属性和订阅
    if (deviceOnline.value) {
      await fetchDeviceProperties()
      await subscribeToDeviceProperties()
    }
  } else {
    // WebSocket断开时，重置状态（不需要取消订阅，因为连接已断开）
    deviceProperties.value.power = false
    deviceProperties.value.playing = false
  }
})

// 播放进度百分比
const progressPercentage = computed(() => {
  if (songDuration.value === 0) return 0
  return (currentTime.value / songDuration.value) * 100
})

// =========================
// Speaker control functions
// =========================
// 切换音响开关
const toggleSpeaker = async () => {
  // 设备不在线或WebSocket未连接时不允许操作
  if (!deviceOnline.value || !wsConnected.value) {
    console.warn('设备离线或WebSocket未连接，无法控制设备')
    return
  }
  
  try {
    const newPowerState = !deviceProperties.value.power
    await deviceManager.invokeDeviceService(deviceSn.value, 'setPower', { power: newPowerState })
    
    // 本地更新状态
    deviceProperties.value.power = newPowerState
    if (!deviceProperties.value.power) {
      deviceProperties.value.playing = false
      deviceProperties.value.position = 0
      currentLyricIndex.value = 0
    } else {
      deviceProperties.value.playing = false
    }
  } catch (error) {
    console.error('控制音响开关失败:', error)
  }
}

// 切换播放/暂停
const togglePlayPause = async () => {
  if (!deviceProperties.value.power || !deviceOnline.value || !wsConnected.value) return
  
  try {
    const newStatus = deviceProperties.value.playing ? 'paused' : 'playing'
    await deviceManager.invokeDeviceService(deviceSn.value, 'setPlayStatus', { status: newStatus })
    
    // 本地更新状态
    deviceProperties.value.playing = newStatus === 'playing'
    if (deviceProperties.value.playing) {
      startPlaybackSimulation()
    } else {
      stopPlaybackSimulation()
    }
  } catch (error) {
    console.error('控制播放状态失败:', error)
  }
}

// 上一曲
const previousSong = async () => {
  if (!deviceProperties.value.power || !deviceOnline.value || !wsConnected.value) return
  
  try {
    await deviceManager.invokeDeviceService(deviceSn.value, 'previousSong', {})
    
    // 本地更新状态
    currentSongIndex.value = currentSongIndex.value > 0 ? currentSongIndex.value - 1 : playlist.value.length - 1
    loadSong(currentSongIndex.value)
  } catch (error) {
    console.error('切换上一曲失败:', error)
  }
}

// 下一曲
const nextSong = async () => {
  if (!deviceProperties.value.power || !deviceOnline.value || !wsConnected.value) return
  
  try {
    await deviceManager.invokeDeviceService(deviceSn.value, 'nextSong', {})
    
    // 本地更新状态
    currentSongIndex.value = currentSongIndex.value < playlist.value.length - 1 ? currentSongIndex.value + 1 : 0
    loadSong(currentSongIndex.value)
  } catch (error) {
    console.error('切换下一曲失败:', error)
  }
}

// 加载歌曲
const loadSong = (index) => {
  const song = playlist.value[index]
  // 更新设备属性中的歌曲信息
  deviceProperties.value.track = song.title
  deviceProperties.value.artist = song.artist
  deviceProperties.value.album = song.album
  deviceProperties.value.duration = song.duration
  deviceProperties.value.position = 0
  deviceProperties.value.playing = false
  currentLyricIndex.value = 0
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
  if (!deviceProperties.value.power || !progressBar.value) return
  
  const rect = progressBar.value.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  const newTime = Math.floor(percentage * deviceProperties.value.duration)
  
  deviceProperties.value.position = Math.max(0, Math.min(newTime, deviceProperties.value.duration))
}

// 处理进度条拖拽
const handleProgressMouseDown = (event) => {
  if (!deviceProperties.value.power) return
  isDragging.value = true
  
  const handleMouseMove = (e) => {
    if (!isDragging.value || !progressBar.value) return
    
    const rect = progressBar.value.getBoundingClientRect()
    const moveX = e.clientX - rect.left
    const percentage = moveX / rect.width
    const newTime = Math.floor(percentage * deviceProperties.value.duration)
    
    deviceProperties.value.position = Math.max(0, Math.min(newTime, deviceProperties.value.duration))
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
    if (deviceProperties.value.playing && deviceProperties.value.position < deviceProperties.value.duration) {
      deviceProperties.value.position += 1
      
      // 更新歌词索引（每10秒换一行）
      const newLyricIndex = Math.floor(deviceProperties.value.position / 10)
      if (newLyricIndex < lyrics.value.length) {
        currentLyricIndex.value = newLyricIndex
      }
    } else if (deviceProperties.value.position >= deviceProperties.value.duration) {
      // 歌曲播放完毕，自动下一曲
      nextSong()
      if (deviceProperties.value.playing) {
        deviceProperties.value.playing = true
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

// 获取设备属性的函数
const fetchDeviceProperties = async () => {
  // 检查设备是否在线，只有在线时才获取属性
  if (!deviceOnline.value) {
    return
  }
  
  try {
    // 使用 deviceProperties 中的属性名作为参数传入
    const requestedProperties = Object.keys(deviceProperties.value)
    
    const properties = await deviceManager.getDeviceProperties(deviceSn.value, requestedProperties)
    
    // 统一更新设备属性
    if (properties) {
      Object.keys(properties).forEach(key => {
        if (properties[key] !== undefined) {
          deviceProperties.value[key] = properties[key]
        }
      })
    }
  } catch (error) {
    console.error('获取设备属性失败:', error)
    console.error('错误详情:', error.message)
  }
}

// 订阅设备属性更新
const subscribeToDeviceProperties = async () => {
  if (!deviceOnline.value || !wsConnected.value) {
    return
  }
  
  try {
    // 订阅设备属性更新和通知事件，订阅了propertyUpdate则devicePropertyUpdate会接受到通知，不订阅则属性改变接受不到通知，订阅了eventNotification则deviceEventNotification会接受到通知，不订阅则事件改变接受不到通知
    await deviceManager.subscribeDeviceEvents(deviceSn.value, ['propertyUpdate'])
    
    // 设置事件通知处理器
    deviceManager.setEventNotificationHandler(deviceSn.value, handleDeviceEventNotification)
  } catch (error) {
    console.error('订阅设备属性更新失败:', error)
  }
}

// 取消订阅设备属性更新
const unsubscribeFromDeviceProperties = async () => {
  // 如果WebSocket未连接，直接返回，避免发送消息到已关闭的连接
  if (!wsConnected.value) {
    return
  }
  
  try {
    // 取消订阅设备属性更新和通知事件
    await deviceManager.unsubscribeDeviceEvents(deviceSn.value, ['propertyUpdate'])
    
    // 清理事件通知处理器
    deviceManager.clearEventNotificationHandler(deviceSn.value)
  } catch (error) {
    // 如果是连接关闭错误，只记录警告而不是错误
    if (error.message === 'Connection closed') {
      console.warn(`WebSocket连接已关闭，跳过取消订阅设备 ${deviceSn.value}`)
    } else {
      console.error('取消订阅设备属性更新失败:', error)
    }
  }
}

// =========================
// 音量和音效控制方法
// =========================

// 切换音量面板显示
const toggleVolumePanel = () => {
  showVolumePanel.value = !showVolumePanel.value
  // 关闭均衡器面板
  if (showVolumePanel.value) {
    showEqualizerPanel.value = false
  }
}

// 切换均衡器面板显示
const toggleEqualizerPanel = () => {
  showEqualizerPanel.value = !showEqualizerPanel.value
  // 关闭音量面板
  if (showEqualizerPanel.value) {
    showVolumePanel.value = false
  }
}

// 关闭所有面板
const closeAllPanels = () => {
  showVolumePanel.value = false
  showEqualizerPanel.value = false
}

// 处理全局点击事件
const handleGlobalClick = (event) => {
  // 只有当有面板打开时才进行检测
  if (!showVolumePanel.value && !showEqualizerPanel.value) {
    return
  }

  // 检查点击是否在 SpeakerCard 组件内部
  const speakerCard = document.querySelector('.speaker-card')
  if (!speakerCard?.contains(event.target)) {
    closeAllPanels()
    return
  }

  // 检查点击是否在面板或按钮内部
  const volumePanel = document.querySelector('.volume-panel')
  const equalizerPanel = document.querySelector('.equalizer-panel')
  const volumeBtn = document.querySelector('.volume-btn')
  const equalizerBtn = document.querySelector('.equalizer-btn')

  // 如果点击的不是面板或按钮，则关闭所有面板
  if (!volumePanel?.contains(event.target) &&
      !equalizerPanel?.contains(event.target) &&
      !volumeBtn?.contains(event.target) &&
      !equalizerBtn?.contains(event.target)) {
    closeAllPanels()
  }
}

// 更新音量显示（拖动过程中）
const updateVolumeDisplay = (event) => {
  const newVolume = parseInt(event.target.value)
  // 更新临时值，用于实时显示
  tempVolume.value = newVolume
}

// 更新音量（手指抬起时）
const updateVolume = (event) => {
  const newVolume = parseInt(event.target.value)
  // 清除临时值，使用本地状态的值
  tempVolume.value = null
  // 更新设备属性
  deviceProperties.value.volume = newVolume
  // 调用设备服务更新音量
  deviceManager.invokeDeviceService(deviceSn.value, 'setVolume', { volume: newVolume })
}

// 更新均衡器模式
const updateEqualizer = (event) => {
  const newEqualizer = event.target.value
  // 更新设备属性
  deviceProperties.value.equalizer = newEqualizer
  // 调用设备服务更新均衡器
  deviceManager.invokeDeviceService(deviceSn.value, 'setEqualizer', { mode: newEqualizer })
}

// 更新低音显示（拖动过程中）
const updateBassDisplay = (event) => {
  const newBass = parseInt(event.target.value)
  // 更新临时值，用于实时显示
  tempBass.value = newBass
}

// 更新低音（手指抬起时）
const updateBass = (event) => {
  const newBass = parseInt(event.target.value)
  // 清除临时值，使用本地状态的值
  tempBass.value = null
  // 更新设备属性
  deviceProperties.value.bass = newBass
  // 调用设备服务更新低音
  deviceManager.invokeDeviceService(deviceSn.value, 'setBass', { level: newBass })
}

// 更新高音显示（拖动过程中）
const updateTrebleDisplay = (event) => {
  const newTreble = parseInt(event.target.value)
  // 更新临时值，用于实时显示
  tempTreble.value = newTreble
}

// 更新高音（手指抬起时）
const updateTreble = (event) => {
  const newTreble = parseInt(event.target.value)
  // 清除临时值，使用本地状态的值
  tempTreble.value = null
  // 更新设备属性
  deviceProperties.value.treble = newTreble
  // 调用设备服务更新高音
  deviceManager.invokeDeviceService(deviceSn.value, 'setTreble', { level: newTreble })
}

// 添加全局点击事件监听器
onMounted(() => {
  fetchDeviceProperties()
  subscribeToDeviceProperties()
  // 使用 capture 模式确保能捕获到所有点击事件
  document.addEventListener('click', handleGlobalClick, true)
})

onBeforeUnmount(() => {
  // 清理事件监听器
  document.removeEventListener('click', handleGlobalClick, true)
  stopPlaybackSimulation()
  
  // 注意：设备订阅的取消现在由 useWebSocketManager 在断开连接时自动处理
})
</script>

<style scoped>
@import '../styles/colors.css';

.speaker-card {
  background: var(--color-bg-card);
  border-radius: 16px;
  padding: 16px 18px;
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

.connection-status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.status-indicator.connected {
  background: var(--color-success);
  box-shadow: 0 0 6px var(--color-blue-shadow);
}

.status-indicator.disconnected {
  background: var(--color-danger);
  box-shadow: 0 0 6px var(--color-blue-shadow);
}

.status-text {
  font-size: 10px;
  color: var(--color-text-muted);
  font-weight: 500;
}

.device-sn {
  font-size: 9px;
  color: var(--color-text-muted);
  font-weight: 400;
  opacity: 0.7;
  margin-left: 8px;
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

.switch-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.switch-button.disabled:hover {
  transform: none;
}

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
  box-shadow: 0 2px 4px var(--color-shadow-light);
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

.volume-control-wrapper {
  position: relative;
  margin-right: 12px;
}

.equalizer-control-wrapper {
  position: relative;
  margin-left: 12px;
}

/* 音量面板样式 */
.volume-panel {
  position: absolute;
  bottom: 100%;
  left: -50%;
  margin-bottom: 12px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 4px 12px var(--color-shadow-medium);
  z-index: 1000;
  animation: fadeInUp 0.3s ease;
}

.volume-slider-vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.volume-slider-vertical-input {
  width: 6px;
  height: 120px;
  background: var(--color-bg-tertiary);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
  writing-mode: vertical-lr;
  direction: rtl;
}

.volume-slider-vertical-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: grab;
  border: 2px solid var(--color-bg);
  box-shadow: 0 2px 4px var(--color-shadow-light);
  transition: all 0.3s ease;
}

.volume-slider-vertical-input::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px var(--color-shadow-light);
}

.volume-slider-vertical-input::-webkit-slider-thumb:active {
  cursor: grabbing;
  transform: scale(1.05);
}

.volume-slider-vertical-input::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: grab;
  border: 2px solid var(--color-bg);
  box-shadow: 0 2px 4px var(--color-shadow-light);
  transition: all 0.3s ease;
}

.volume-slider-vertical-input::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px var(--color-shadow-light);
}

.volume-slider-vertical-input::-moz-range-thumb:active {
  cursor: grabbing;
  transform: scale(1.05);
}

/* 均衡器面板样式 */
.equalizer-panel {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 12px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px var(--color-shadow-medium);
  z-index: 1000;
  min-width: 280px;
  animation: fadeInUp 0.3s ease;
}

.equalizer-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.equalizer-mode {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  color: var(--color-primary-text);
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

/* 音量和音效控制样式 */
.audio-controls-section {
  margin-top: 24px;
  padding: 20px;
  background: var(--color-bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.volume-control {
  margin-bottom: 20px;
}

.control-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.control-label svg {
  width: 16px;
  height: 16px;
  color: var(--color-text-muted);
}

.volume-slider-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.volume-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.volume-btn:hover:not(:disabled) {
  background: var(--color-hover);
  border-color: var(--color-primary);
  transform: scale(1.05);
}

.volume-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.volume-btn svg {
  width: 16px;
  height: 16px;
}

.equalizer-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.equalizer-btn:hover:not(:disabled) {
  background: var(--color-hover);
  border-color: var(--color-primary);
  transform: scale(1.05);
}

.equalizer-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.equalizer-btn svg {
  width: 16px;
  height: 16px;
}

.volume-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: var(--color-bg-tertiary);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: grab;
  border: 2px solid var(--color-bg);
  box-shadow: 0 2px 4px var(--color-shadow-light);
  transition: all 0.3s ease;
}

.volume-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px var(--color-shadow-light);
}

.volume-slider::-webkit-slider-thumb:active {
  cursor: grabbing;
  transform: scale(1.05);
}

.volume-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: grab;
  border: 2px solid var(--color-bg);
  box-shadow: 0 2px 4px var(--color-shadow-light);
  transition: all 0.3s ease;
}

.volume-slider::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px var(--color-shadow-light);
}

.volume-slider::-moz-range-thumb:active {
  cursor: grabbing;
  transform: scale(1.05);
}

.volume-slider:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.volume-value {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-muted);
  min-width: 35px;
  text-align: right;
}

/* 音效控制样式 */
.audio-effects {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.equalizer-control {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.equalizer-select {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  padding-right: 32px;
  min-height: 36px;
}

.equalizer-select:hover:not(:disabled) {
  border-color: var(--color-primary);
  background-color: var(--color-hover);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px var(--color-shadow-light);
}

.equalizer-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-hover);
  background-color: var(--color-bg-card);
}

.equalizer-select:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 2px var(--color-shadow-light);
}

.equalizer-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.equalizer-select option {
  padding: 8px 12px;
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  font-size: 12px;
  font-weight: 500;
}

.equalizer-select option:hover {
  background: var(--color-hover);
}

.equalizer-select option:checked {
  background: var(--color-primary);
  color: var(--color-primary-text);
}

.tone-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.tone-control {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tone-slider-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tone-slider {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: var(--color-bg-tertiary);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tone-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: grab;
  border: 2px solid var(--color-bg);
  box-shadow: 0 2px 4px var(--color-shadow-light);
  transition: all 0.3s ease;
}

.tone-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px var(--color-shadow-light);
}

.tone-slider::-webkit-slider-thumb:active {
  cursor: grabbing;
  transform: scale(1.05);
}

.tone-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: grab;
  border: 2px solid var(--color-bg);
  box-shadow: 0 2px 4px var(--color-shadow-light);
  transition: all 0.3s ease;
}

.tone-slider::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px var(--color-shadow-light);
}

.tone-slider::-moz-range-thumb:active {
  cursor: grabbing;
  transform: scale(1.05);
}

.tone-slider:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tone-value {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-muted);
  min-width: 25px;
  text-align: center;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* 响应式设计 */
@media (max-width: 768px) {
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
  
  .audio-controls-section {
    padding: 16px;
  }
  
  .tone-controls {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .volume-slider-container {
    gap: 8px;
  }
  
  .volume-btn {
    width: 28px;
    height: 28px;
  }
  
  .volume-btn svg {
    width: 14px;
    height: 14px;
  }
  
  .equalizer-btn {
    width: 28px;
    height: 28px;
  }
  
  .equalizer-btn svg {
    width: 14px;
    height: 14px;
  }
  
  .equalizer-select {
    min-height: 32px;
    font-size: 11px;
  }
  
  .control-label {
    font-size: 11px;
  }
  
  .control-label svg {
    width: 14px;
    height: 14px;
  }
}
</style>

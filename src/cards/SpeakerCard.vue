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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { useDeviceRealtime } from '../composables/useDeviceRealtime'

// 定义 props
const props = defineProps({
  device: {
    type: Object,
    default: () => ({})
  }
})

// 使用设备实时数据管理
const {
  connectionState,
  getDeviceData,
  isDeviceOnline,
  invokeDeviceService,
  subscribeDeviceEvents,
  getDeviceProperties
} = useDeviceRealtime()

// 设备ID - 从props中获取
const deviceId = computed(() => props.device?.id || 'speaker_001')

// =========================
// Speaker state and modes
// =========================
const speakerPower = ref(false)
const speakerStatus = ref('idle') // idle, playing, paused

// WebSocket连接状态
const wsConnected = computed(() => connectionState.value === 'connected')

// 设备在线状态
const deviceOnline = computed(() => isDeviceOnline(deviceId.value))

// 实时设备数据
const deviceData = computed(() => getDeviceData(deviceId.value))

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

// 音响状态文本
const speakerStatusText = computed(() => {
  return speakerPower.value ? 'On' : 'Off'
})

// 确保离线时开关始终为Off
const effectiveSpeakerPower = computed(() => {
  // 如果设备离线或WebSocket未连接，强制为Off
  if (!deviceOnline.value || !wsConnected.value) {
    return false
  }
  return speakerPower.value
})

// 监听设备数据变化，更新音响状态
watch(deviceData, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    // 更新音响开关状态
    if (newData.power_state !== undefined) {
      speakerPower.value = newData.power_state
    }
    
    // 更新播放状态
    if (newData.play_status !== undefined) {
      speakerStatus.value = newData.play_status
    }
    
    // 更新当前歌曲信息
    if (newData.current_song) {
      currentSong.value = {
        title: newData.current_song.title || currentSong.value.title,
        artist: newData.current_song.artist || currentSong.value.artist,
        album: newData.current_song.album || currentSong.value.album,
        cover: newData.current_song.cover || currentSong.value.cover
      }
    }
    
    // 更新播放进度
    if (newData.current_time !== undefined) {
      currentTime.value = newData.current_time
    }
    
    if (newData.song_duration !== undefined) {
      songDuration.value = newData.song_duration
    }
    
    // 更新歌词索引
    if (newData.lyric_index !== undefined) {
      currentLyricIndex.value = newData.lyric_index
    }
  }
}, { deep: true })

// 监听设备在线状态
watch(deviceOnline, (isOnline) => {
  if (!isOnline) {
    speakerPower.value = false
    speakerStatus.value = 'idle'
  }
})

// 监听WebSocket连接状态
watch(wsConnected, (isConnected) => {
  if (!isConnected) {
    speakerPower.value = false
    speakerStatus.value = 'idle'
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
    const newPowerState = !speakerPower.value
    await invokeDeviceService(deviceId.value, 'setPower', { power: newPowerState })
    
    // 本地更新状态
    speakerPower.value = newPowerState
    if (!speakerPower.value) {
      speakerStatus.value = 'idle'
      currentTime.value = 0
      currentLyricIndex.value = 0
    } else {
      speakerStatus.value = 'paused'
    }
  } catch (error) {
    console.error('控制音响开关失败:', error)
  }
}

// 切换播放/暂停
const togglePlayPause = async () => {
  if (!speakerPower.value || !deviceOnline.value || !wsConnected.value) return
  
  try {
    const newStatus = speakerStatus.value === 'playing' ? 'paused' : 'playing'
    await invokeDeviceService(deviceId.value, 'setPlayStatus', { status: newStatus })
    
    // 本地更新状态
    speakerStatus.value = newStatus
    if (speakerStatus.value === 'playing') {
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
  if (!speakerPower.value || !deviceOnline.value || !wsConnected.value) return
  
  try {
    await invokeDeviceService(deviceId.value, 'previousSong', {})
    
    // 本地更新状态
    currentSongIndex.value = currentSongIndex.value > 0 ? currentSongIndex.value - 1 : playlist.value.length - 1
    loadSong(currentSongIndex.value)
  } catch (error) {
    console.error('切换上一曲失败:', error)
  }
}

// 下一曲
const nextSong = async () => {
  if (!speakerPower.value || !deviceOnline.value || !wsConnected.value) return
  
  try {
    await invokeDeviceService(deviceId.value, 'nextSong', {})
    
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

// 组件挂载时订阅设备事件
onMounted(async () => {
  try {
    // 订阅音响设备事件
    await subscribeDeviceEvents(deviceId.value, [
      'sensorAlert', 
      'statusChange', 
      'propertyUpdate',
      'playStatusChange',
      'songChange',
      'volumeChange'
    ])
    
    // 只有在设备在线时才获取设备属性
    if (deviceOnline.value && wsConnected.value) {
      const properties = await getDeviceProperties(deviceId.value, [
        'power_state',
        'play_status', 
        'current_song',
        'current_time',
        'song_duration',
        'volume',
        'lyric_index'
      ])
      
      // 更新本地状态
      if (properties) {
        if (properties.power_state !== undefined) {
          speakerPower.value = properties.power_state
        }
        if (properties.play_status !== undefined) {
          speakerStatus.value = properties.play_status
        }
        if (properties.current_song) {
          currentSong.value = properties.current_song
        }
        if (properties.current_time !== undefined) {
          currentTime.value = properties.current_time
        }
        if (properties.song_duration !== undefined) {
          songDuration.value = properties.song_duration
        }
        if (properties.lyric_index !== undefined) {
          currentLyricIndex.value = properties.lyric_index
        }
      }
    } else {
      // 设备离线时，确保开关为Off状态
      speakerPower.value = false
      speakerStatus.value = 'idle'
    }
  } catch (error) {
    console.error('初始化音响设备失败:', error)
    // 出错时也确保开关为Off状态
    speakerPower.value = false
    speakerStatus.value = 'idle'
  }
})

onBeforeUnmount(() => {
  stopPlaybackSimulation()
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
  background: #10b981;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.4);
}

.status-indicator.disconnected {
  background: #ef4444;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.4);
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
}
</style>

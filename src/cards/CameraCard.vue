<template>
  <div class="camera-card">
    <div class="camera-header">
      <div class="camera-card-info">
        <h3>{{ device.name || 'Camera' }}</h3>
        <div class="connection-status">
          <div 
            :class="['status-indicator', { 
              'connected': deviceOnline,
              'disconnected': !deviceOnline 
            }]"
          ></div>
          <span class="status-text">
            {{ deviceOnline ? '在线' : '离线' }}
          </span>
          <span v-if="device.sn" class="device-sn">{{ device.sn }}</span>
        </div>
      </div>
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
        <div class="camera-switch">
          <span class="switch-label">{{ effectiveCameraPower ? 'On' : 'Off' }}</span>
          <div 
            :class="['switch-button', { 
              active: effectiveCameraPower,
              disabled: !deviceOnline 
            }]"
            @click="toggleCamera"
          ></div>
        </div>
      </div>
    </div>
    <div class="camera-view" ref="cameraViewRef">
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
  
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  device: {
    type: Object,
    default: () => ({})
  }
})

// 设备在线状态
const deviceOnline = computed(() => {
  return props.device?.status === 'online'
})

// Camera power state
const cameraPower = ref(false)

// 确保离线时开关始终为Off
const effectiveCameraPower = computed(() => {
  // 如果设备离线，强制为Off
  if (!deviceOnline.value) {
    return false
  }
  return cameraPower.value
})

// Demo camera source
const cameraVideoSrc = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

// Speech recognition
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
  try { recognition.start() } catch (e) {}
}

const stopVoice = () => {
  if (!speechSupported || !recognition) return
  try { recognition.stop() } catch (e) {}
}

// Camera power and fullscreen
const toggleCamera = () => {
  // 设备不在线时不允许操作
  if (!deviceOnline.value) {
    console.warn('设备离线，无法控制设备')
    return
  }
  cameraPower.value = !cameraPower.value
}

const cameraViewRef = ref(null)
const isFullscreen = ref(false)

const toggleFullscreen = () => {
  const el = cameraViewRef.value
  if (!el) return
  if (!isFullscreen.value) {
    if (el.requestFullscreen) el.requestFullscreen()
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
    else if (el.msRequestFullscreen) el.msRequestFullscreen()
  } else {
    if (document.exitFullscreen) document.exitFullscreen()
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
    else if (document.msExitFullscreen) document.msExitFullscreen()
  }
}

const handleFullscreenChange = () => {
  isFullscreen.value = !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  )
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('msfullscreenchange', handleFullscreenChange)
})

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('msfullscreenchange', handleFullscreenChange)
})

</script>

<style scoped>
@import '../styles/colors.css';

.camera-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 16px 18px;
}

.camera-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.camera-card-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
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

.camera-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mic-button {
  margin-left: 20px;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text-primary);
  border-radius: 8px;
  width: 36px; height: 36px;
  display: inline-flex; align-items: center; justify-content: center;
}
.mic-button svg { width: 18px; height: 18px; }
.mic-button.listening { border-color: var(--color-primary); color: var(--color-primary); }

.camera-view { position: relative; margin-top: 12px; height: 280px; background: var(--color-button-dark); border-radius: 12px; overflow: hidden; }
.camera-view:hover .fullscreen-button { opacity: 1; }


.camera-switch { display: flex; align-items: center; gap: 8px; }
.camera-placeholder { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: var(--color-text-secondary); }
.camera-placeholder svg { width: 48px; height: 48px; color: var(--color-text-secondary); }
.camera-placeholder p { margin: 0; }
.camera-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }

.fullscreen-button { position: absolute; right: 10px; bottom: 10px; width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--color-border); background: var(--color-shadow-dark); color: var(--color-white); display: inline-flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s ease; }
.camera-view:hover .fullscreen-button:hover { background: var(--color-shadow-darker); }
.fullscreen-button svg { width: 18px; height: 18px; }

.voice-output { margin-top: 8px; font-size: 12px; color: var(--color-text-secondary); }

/* Switch styles (scoped) */
.switch-label { font-size: 12px; color: var(--color-text-secondary); }
.switch-button { width: 32px; height: 20px; background: var(--color-switch-indicator); border: 1px solid var(--color-border); border-radius: 10px; position: relative; cursor: pointer; transition: all 0.3s ease; }
.switch-button.active { background: var(--color-primary); }
.switch-button::after { content: ''; position: absolute; top: 2px; width: 14px; height: 14px; background: var(--color-switch-indicator-active); border-radius: 50%; transition: all 0.3s ease; }
.switch-button.active::after { left: 16px; }

.switch-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.switch-button.disabled:hover {
  transform: none;
}

</style>



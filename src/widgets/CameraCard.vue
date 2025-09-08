<template>
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
  rooms: { type: Array, required: true },
  activeRoom: { type: String, required: true }
})

// Independent room selector label
const roomLabel = computed(() => {
  const map = {
    'living': 'Living Room',
    'dining': 'Dining Room',
    'bedroom': 'Bed Room',
    'bathroom': 'Bath Room',
    'backyard': 'Backyard'
  }
  return map[selectedCameraRoom.value] || 'Living Room'
})

// Local selection, sync with prop activeRoom
const selectedCameraRoom = ref('living')
const cameraMenuOpen = ref(false)

watch(() => props.activeRoom, (val) => {
  if (val === 'all') return
  selectedCameraRoom.value = val
})

const selectCameraRoom = (roomId) => {
  selectedCameraRoom.value = roomId
  cameraMenuOpen.value = false
}

// Demo camera sources
const cameraSources = {
  living: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  dining: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
  bedroom: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
  bathroom: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
  backyard: 'https://media.w3.org/2010/05/video/movie_300.mp4'
}

const cameraVideoSrc = computed(() => cameraSources[selectedCameraRoom.value] || cameraSources.living)

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
const cameraPower = ref(true)
const toggleCamera = () => { cameraPower.value = !cameraPower.value }

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
.camera-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 24px 18px;
}

.camera-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-bg);
  color: var(--color-text-primary);
}

.room-selector svg { width: 14px; height: 14px; }

.room-selector-wrapper { position: relative; }

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

.camera-view { position: relative; margin-top: 12px; height: 200px; background: var(--color-button-dark); border-radius: 12px; overflow: hidden; }
.camera-view:hover .fullscreen-button { opacity: 1; }

.room-selector-menu { position: absolute; right: 0; top: calc(100% + 6px); background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: 10px; box-shadow: 0 8px 24px var(--shadow-soft); z-index: 1000; padding: 6px; display: flex; flex-direction: column; gap: 4px; min-width: 160px; }
.room-selector-item { padding: 6px 10px; background: transparent; border: 1px solid transparent; color: var(--color-text-primary); width: 100%; text-align: left; border-radius: 8px; }
.room-selector-item:hover { background: var(--color-hover); }
.room-selector-item.selected { border-color: var(--color-primary); color: var(--color-primary); }

.camera-switch { display: flex; align-items: center; gap: 8px; }
.camera-placeholder { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: var(--color-text-secondary); }
.camera-placeholder svg { width: 48px; height: 48px; color: var(--color-text-secondary); }
.camera-placeholder p { margin: 0; }
.camera-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }

.fullscreen-button { position: absolute; right: 10px; bottom: 10px; width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--color-border); background: rgba(0, 0, 0, 0.6); color: #fff; display: inline-flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s ease; }
.camera-view:hover .fullscreen-button:hover { background: rgba(0, 0, 0, 0.8); }
.fullscreen-button svg { width: 18px; height: 18px; }

.voice-output { margin-top: 8px; font-size: 12px; color: var(--color-text-secondary); }

/* Switch styles (scoped) */
.switch-label { font-size: 12px; color: var(--color-text-secondary); }
.switch-button { width: 32px; height: 20px; background: var(--color-switch-indicator); border: 1px solid var(--color-border); border-radius: 10px; position: relative; cursor: pointer; transition: all 0.3s ease; }
.switch-button.active { background: var(--color-primary); }
.switch-button::after { content: ''; position: absolute; top: 2px; width: 14px; height: 14px; background: var(--color-switch-indicator-active); border-radius: 50%; transition: all 0.3s ease; }
.switch-button.active::after { left: 16px; }

</style>



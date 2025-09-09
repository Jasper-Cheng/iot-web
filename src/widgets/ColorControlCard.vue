<template>
  <div class="color-control-card">
    <div class="card-header">
      <h3>Color Control</h3>
      <div class="power-switch">
        <span class="switch-label">{{ colorControlOn ? 'On' : 'Off' }}</span>
        <div 
          :class="['switch-button', { active: colorControlOn }]"
          @click="toggleColorControl"
        ></div>
      </div>
    </div>

    <div class="preset-buttons">
      <div class="segmented-control">
        <button 
          v-for="(preset, index) in colorPresets" 
          :key="preset.id"
          :class="['segmented-btn', { 
            active: activePreset === preset.id,
            'first': index === 0,
            'last': index === colorPresets.length - 1
          }]"
          @click="setActivePreset(preset.id)"
        >
          {{ preset.name }}
        </button>
      </div>
    </div>

    <div class="color-wheel-section">
      <div class="color-wheel-container">
        <div class="color-wheel" ref="colorWheel" @click="handleColorWheelClick">
          <div class="color-selector" :style="selectorStyle"></div>
        </div>
        <div class="intensity-display">
          <div class="intensity-value">{{ colorIntensity }}%</div>
          <div class="intensity-label">Color intensity</div>
        </div>
      </div>
    </div>

    <div class="brightness-slider">
      <div class="slider-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" fill="none"/>
          <path d="M12 1v2M12 21v2M1 12h2M21 12h2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </div>
      <div class="slider-container">
        <input 
          type="range" 
          min="0" 
          max="100" 
          v-model="brightness" 
          class="slider"
          @input="updateBrightness"
        />
      </div>
      <div class="slider-value">{{ brightness }}%</div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'

export default {
  name: 'ColorControlCard',
  setup() {
    const colorControlOn = ref(true)
    const activePreset = ref('neon')
    const colorIntensity = ref(55)
    const brightness = ref(55)
    const selectedColor = ref({ hue: 0, saturation: 100 })
    const colorWheel = ref(null)

    const colorPresets = [
      { id: 'neon', name: 'Neon' },
      { id: 'warm', name: 'Warm' },
      { id: 'cool', name: 'Cool' }
    ]

    const selectorStyle = computed(() => {
      const hue = selectedColor.value.hue
      const saturation = selectedColor.value.saturation
      const x = 50 + (saturation / 100) * 40 * Math.cos((hue - 90) * Math.PI / 180)
      const y = 50 + (saturation / 100) * 40 * Math.sin((hue - 90) * Math.PI / 180)
      return {
        left: `${x}%`,
        top: `${y}%`,
        backgroundColor: `hsl(${hue}, ${saturation}%, 50%)`
      }
    })

    const toggleColorControl = () => {
      colorControlOn.value = !colorControlOn.value
    }

    const setActivePreset = (presetId) => {
      activePreset.value = presetId
      // Apply preset colors
      switch (presetId) {
        case 'neon':
          selectedColor.value = { hue: 0, saturation: 100 }
          colorIntensity.value = 80
          break
        case 'warm':
          selectedColor.value = { hue: 30, saturation: 80 }
          colorIntensity.value = 60
          break
        case 'cool':
          selectedColor.value = { hue: 200, saturation: 70 }
          colorIntensity.value = 50
          break
      }
    }

    const handleColorWheelClick = (event) => {
      if (!colorControlOn.value) return
      
      const rect = colorWheel.value.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const x = event.clientX - centerX
      const y = event.clientY - centerY
      
      const angle = Math.atan2(y, x) * 180 / Math.PI + 90
      const distance = Math.sqrt(x * x + y * y)
      const maxDistance = rect.width / 2
      
      const hue = (angle + 360) % 360
      const saturation = Math.min(100, (distance / maxDistance) * 100)
      
      selectedColor.value = { hue, saturation }
      colorIntensity.value = Math.round(saturation)
    }

    const updateBrightness = () => {
      // Update brightness logic here
      console.log('Brightness updated:', brightness.value)
    }

    onMounted(() => {
      // Initialize with neon preset
      setActivePreset('neon')
    })

    return {
      colorControlOn,
      activePreset,
      colorIntensity,
      brightness,
      selectedColor,
      colorWheel,
      colorPresets,
      selectorStyle,
      toggleColorControl,
      setActivePreset,
      handleColorWheelClick,
      updateBrightness
    }
  }
}
</script>

<style scoped>
.color-control-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 16px 18px;
  gap: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  color: var(--color-text-primary);
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.power-switch {
  display: flex;
  align-items: center;
  gap: 12px;
}

.switch-label {
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
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
  border-color: var(--color-primary);
}

.switch-button::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  background: var(--color-switch-indicator-active);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.switch-button.active::after {
  transform: translateX(12px);
}

.preset-buttons {
  display: flex;
  justify-content: center;
  padding: 0 8px;
}

.segmented-control {
  display: flex;
  background: var(--color-button-dark);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  width: 100%;
  max-width: 320px;
}

.segmented-btn {
  flex: 1;
  padding: 14px 24px;
  background: transparent;
  border: none;
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.segmented-btn.first {
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}

.segmented-btn.last {
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}

.segmented-btn.active {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
}

.segmented-btn:hover:not(.active) {
  background: rgba(255, 255, 255, 0.05);
}

.color-wheel-section {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.color-wheel-container {
  position: relative;
  width: 200px;
  height: 200px;
}

.color-wheel {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #ff0000 0deg,
    #ffff00 60deg,
    #00ff00 120deg,
    #00ffff 180deg,
    #0000ff 240deg,
    #ff00ff 300deg,
    #ff0000 360deg
  );
  position: relative;
  cursor: pointer;
  border: 2px solid var(--color-border);
}

.color-selector {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.intensity-display {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

.intensity-value {
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
}

.intensity-label {
  font-size: 12px;
  font-weight: 400;
  opacity: 0.9;
  margin-top: 4px;
}

.brightness-slider {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 8px;
}

.slider-icon {
  width: 24px;
  height: 24px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.slider-icon svg {
  width: 100%;
  height: 100%;
}

.slider-container {
  flex: 1;
  position: relative;
}

.slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--color-button-dark);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.slider-value {
  min-width: 40px;
  text-align: center;
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 500;
  background: var(--color-button-dark);
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
}
</style>

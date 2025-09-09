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

    <!-- ✅ 修改后的颜色环 -->
    <div class="color-wheel-section">
      <div class="color-wheel-container" ref="colorWheel" @mousedown="startDrag" @touchstart="startDrag">
        <div class="color-wheel"></div>
        <!-- 黑色内环 -->
        <div class="inner-circle"></div>
        <!-- 白色小球 -->
        <div class="color-selector" :style="selectorStyle"></div>
        <!-- 中间强度显示 -->
        <div class="intensity-display">
          <div class="intensity-value">{{ colorIntensity }}%</div>
          <div class="intensity-label">{{ selectedColorHex }}</div>
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
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'ColorControlCard',
  setup() {
    const colorControlOn = ref(true)
    const activePreset = ref('neon')
    const colorIntensity = ref(55)
    const brightness = ref(55)
    const selectedColor = ref({ hue: 0 })
    const colorWheel = ref(null)

    const colorPresets = [
      { id: 'neon', name: 'Neon' },
      { id: 'warm', name: 'Warm' },
      { id: 'cool', name: 'Cool' }
    ]

    // 半径配置：外环半径、内环半径
    const outerRadius = 100
const innerRadius = 70
const ballSize = outerRadius - innerRadius+10  // ✅ 小球大小 = 彩色环半径差


    const selectorStyle = computed(() => {
      const hue = selectedColor.value.hue
  const rad = (hue - 90) * Math.PI / 180
  const trackRadius = (outerRadius + innerRadius) / 2  // ✅ 轨道半径

  const x = 50 + (trackRadius / outerRadius) * 50 * Math.cos(rad)
  const y = 50 + (trackRadius / outerRadius) * 50 * Math.sin(rad)

  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${ballSize}px`,     // ✅ 动态宽度
    height: `${ballSize}px`,    // ✅ 动态高度
    backgroundColor: `hsl(${hue}, 100%, 50%)`
  }
    })

    // 将HSL转换为十六进制颜色
    const hslToHex = (h, s, l) => {
      l /= 100
      const a = s * Math.min(l, 1 - l) / 100
      const f = n => {
        const k = (n + h / 30) % 12
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
        return Math.round(255 * color).toString(16).padStart(2, '0')
      }
      return `#${f(0)}${f(8)}${f(4)}`
    }

    // 计算当前选中颜色的十六进制值
    const selectedColorHex = computed(() => {
      const hue = selectedColor.value.hue
      const saturation = 100
      const lightness = 50
      return hslToHex(hue, saturation, lightness)
    })

    const toggleColorControl = () => {
      colorControlOn.value = !colorControlOn.value
    }

    const setActivePreset = (presetId) => {
      activePreset.value = presetId
      switch (presetId) {
        case 'neon':
          selectedColor.value = { hue: 0 }
          // 预设只改变颜色，不改变透明度
          break
        case 'warm':
          selectedColor.value = { hue: 30 }
          break
        case 'cool':
          selectedColor.value = { hue: 200 }
          break
      }
    }

    const updateHueFromPosition = (clientX, clientY) => {
      const rect = colorWheel.value.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const x = clientX - centerX
      const y = clientY - centerY

      let angle = Math.atan2(y, x) * 180 / Math.PI + 90
      if (angle < 0) angle += 360

      // 小球只负责选择颜色，不改变透明度
      selectedColor.value.hue = angle
    }

    const startDrag = (event) => {
      if (!colorControlOn.value) return
      updateHueFromPosition(event.clientX || event.touches[0].clientX, event.clientY || event.touches[0].clientY)

      const onMove = (e) => {
        updateHueFromPosition(e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY)
      }

      const onUp = () => {
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
        window.removeEventListener('touchmove', onMove)
        window.removeEventListener('touchend', onUp)
      }

      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
      window.addEventListener('touchmove', onMove)
      window.addEventListener('touchend', onUp)
    }

    const updateBrightness = () => {
      // 滑块只负责调整透明度
      colorIntensity.value = brightness.value
      console.log('Transparency updated:', brightness.value)
    }

    onMounted(() => {
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
      selectedColorHex,
      toggleColorControl,
      setActivePreset,
      startDrag,
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
    #ff0000 0deg,      /* 红色 */
    #ff8000 30deg,     /* 橙红色 */
    #ffff00 60deg,     /* 黄色 */
    #80ff00 90deg,     /* 黄绿色 */
    #00ff00 120deg,    /* 绿色 */
    #00ff80 150deg,    /* 青绿色 */
    #00ffff 180deg,    /* 青色 */
    #0080ff 210deg,    /* 青蓝色 */
    #0000ff 240deg,    /* 蓝色 */
    #8000ff 270deg,    /* 蓝紫色 */
    #ff00ff 300deg,    /* 紫色 */
    #ff0080 330deg,    /* 紫红色 */
    #ff0000 360deg     /* 红色 */
  );
  position: absolute;
  top: 0;
  left: 0;
}

/* ✅ 黑色内环 */
.inner-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140px;  /* 内环直径，可以调节 */
  height: 140px;
  border-radius: 50%;
  background: #000;
  z-index: 1;
}

.color-selector {
  position: absolute;
  border-radius: 50%;
  border: 5px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 3;
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
  z-index: 2;
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

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
            'last': index === colorPresets.length - 1,
            disabled: !colorControlOn
          }]"
          :disabled="!colorControlOn"
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
          :disabled="!colorControlOn"
          @input="updateBrightness"
        />
      </div>
      <button class="reset-button" :disabled="!colorControlOn" @click="resetToDefault">恢复默认</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'ColorControlCard',
  setup() {
    const colorControlOn = ref(true)
    const activePreset = ref('primary')
    const colorIntensity = ref(55)
    const brightness = ref(55)
    const selectedColor = ref({ hue: 0 })
    const colorWheel = ref(null)
    const isBootstrapping = ref(true)
    const STORAGE_KEY = 'colorControlThemeV1'

    const colorPresets = [
      { id: 'primary', name: 'primary' },
      { id: 'bg-card', name: 'bg card' },
      { id: 'text', name: 'text' }
    ]

    // 记录主题初始默认值
    const defaultPrimary = ref('')
    const defaultBgCard = ref('')
    const defaultTextPrimary = ref('')

    // 半径配置：外环半径、内环半径
    const outerRadius = 100
const innerRadius = 70
const ballSize = outerRadius - innerRadius+10  // ✅ 小球大小 = 彩色环半径差

    // 与 .color-wheel 的 conic-gradient 一致的颜色停靠点（角度→颜色）
    const colorStops = [
      { angle: 0, color: '#ff0000' },
      { angle: 30, color: '#ff8000' },
      { angle: 60, color: '#ffff00' },
      { angle: 90, color: '#80ff00' },
      { angle: 120, color: '#00ff00' },
      { angle: 150, color: '#BFFE01' },
      { angle: 180, color: '#00ffff' },
      { angle: 210, color: '#0080ff' },
      { angle: 240, color: '#18181a' },
      { angle: 270, color: '#8000ff' },
      { angle: 300, color: '#FFFFFF' },
      { angle: 330, color: '#ff0080' },
      { angle: 360, color: '#ff0000' }
    ]

    const backgroundGradient = computed(() => {
      const stops = colorStops.map(s => `${s.color} ${s.angle}deg`).join(', ')
      return `conic-gradient(from 0deg, ${stops})`
    })

    const clampAngle = (deg) => {
      let a = deg % 360
      if (a < 0) a += 360
      return a
    }

    const lerp = (a, b, t) => Math.round(a + (b - a) * t)

    const hexToRgb = (hex) => {
      const { r, g, b } = hexToRgba(hex)
      return { r, g, b }
    }

    const rgbToHex = (r, g, b) => {
      const toHex = (v) => v.toString(16).padStart(2, '0')
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
    }

    const getInterpolatedColorAtAngle = (deg) => {
      const angle = clampAngle(deg)
      let left = colorStops[0]
      let right = colorStops[colorStops.length - 1]
      for (let i = 0; i < colorStops.length - 1; i++) {
        const a0 = colorStops[i].angle
        const a1 = colorStops[i + 1].angle
        if (angle >= a0 && angle <= a1) {
          left = colorStops[i]
          right = colorStops[i + 1]
          break
        }
      }
      const span = right.angle - left.angle || 1
      const t = Math.min(1, Math.max(0, (angle - left.angle) / span))
      const c0 = hexToRgb(left.color)
      const c1 = hexToRgb(right.color)
      const r = lerp(c0.r, c1.r, t)
      const g = lerp(c0.g, c1.g, t)
      const b = lerp(c0.b, c1.b, t)
      return { r, g, b }
    }

    const normalizeHex6 = (hex) => {
      let h = hex.trim()
      if (!h.startsWith('#')) return null
      h = h.replace('#', '')
      if (h.length === 3) h = h.split('').map(c => c + c).join('')
      if (h.length === 8) h = h.slice(2)
      if (h.length !== 6) return null
      return ('#' + h).toUpperCase()
    }

    const getHueFromCssValue = (value) => {
      if (!value) return 0
      const v = value.trim()
      let normalized = null
      if (v.startsWith('#')) {
        normalized = normalizeHex6(v)
      } else if (v.startsWith('rgb')) {
        const nums = v.replace(/rgba?\(|\)|\s/g, '').split(',').map(Number)
        const [r, g, b] = nums
        normalized = rgbToHex(r, g, b)
      }
      if (normalized) {
        const hit = colorStops.find(s => s.color.toUpperCase() === normalized)
        if (hit) return hit.angle
      }
      const { h } = parseCssColorToHsla(v)
      return h
    }


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
    backgroundColor: (() => { const { r, g, b } = getInterpolatedColorAtAngle(hue); return `rgb(${r}, ${g}, ${b})` })()
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

    // 计算当前选中颜色的十六进制值（包含透明度）
    const selectedColorHex = computed(() => {
      const hue = selectedColor.value.hue
      const { r, g, b } = getInterpolatedColorAtAngle(hue)
      const alpha = Math.round((brightness.value / 100) * 255)
      const hex = rgbToHex(r, g, b)
      const alphaHex = alpha.toString(16).padStart(2, '0').toUpperCase()
      return '#' + alphaHex + hex.substring(1)
    })

    // 计算白色小球选中的颜色（包含透明度，用于滑块小球）
    const selectedColorForSlider = computed(() => {
      const hue = selectedColor.value.hue
      const { r, g, b } = getInterpolatedColorAtAngle(hue)
      const alpha = brightness.value / 100
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    })

    const readThemeFromStorage = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return null
        return JSON.parse(raw)
      } catch (e) {
        return null
      }
    }

    const writeThemeToStorage = (data) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      } catch (e) {
        // ignore
      }
    }

    const getCurrentThemeObject = () => {
      const cs = getComputedStyle(document.documentElement)
      const base = readThemeFromStorage() || {}
      return {
        primary: cs.getPropertyValue('--color-primary').trim(),
        bgCard: cs.getPropertyValue('--color-bg-card').trim(),
        text: cs.getPropertyValue('--color-text-primary').trim(),
        primaryAngle: base.primaryAngle ?? null,
        bgCardAngle: base.bgCardAngle ?? null,
        textAngle: base.textAngle ?? null
      }
    }

    const readThemeDefaults = (themeName) => {
      const probe = document.createElement('div')
      probe.setAttribute('data-theme', themeName)
      probe.style.display = 'none'
      document.body.appendChild(probe)
      const cs = getComputedStyle(probe)
      const vals = {
        primary: (cs.getPropertyValue('--color-primary') || '').trim(),
        bgCard: (cs.getPropertyValue('--color-bg-card') || '').trim(),
        text: (cs.getPropertyValue('--color-text-primary') || '').trim()
      }
      document.body.removeChild(probe)
      return vals
    }

    const applyCurrentColorToTheme = () => {
      if (!colorControlOn.value) return
      if (isBootstrapping.value) return
      const root = document.documentElement
      const colorValue = selectedColorForSlider.value
      let varName = null
      if (activePreset.value === 'primary') varName = '--color-primary'
      else if (activePreset.value === 'bg-card') varName = '--color-bg-card'
      else if (activePreset.value === 'text') varName = '--color-text-primary'
      if (varName) root.style.setProperty(varName, colorValue)
      // persist theme variables and last angle for the active preset
      const theme = getCurrentThemeObject()
      const angle = clampAngle(selectedColor.value.hue || 0)
      if (activePreset.value === 'primary') theme.primaryAngle = angle
      if (activePreset.value === 'bg-card') theme.bgCardAngle = angle
      if (activePreset.value === 'text') theme.textAngle = angle
      writeThemeToStorage(theme)
    }

    // 将任意颜色字符串解析为 HSLA
    const hexToRgba = (hex) => {
      let h = hex.replace('#', '').trim()
      if (h.length === 3) {
        h = h.split('').map(c => c + c).join('')
      }
      let a = 255
      if (h.length === 8) {
        a = parseInt(h.slice(0, 2), 16)
        h = h.slice(2)
      }
      const r = parseInt(h.slice(0, 2), 16)
      const g = parseInt(h.slice(2, 4), 16)
      const b = parseInt(h.slice(4, 6), 16)
      return { r, g, b, a }
    }

    const rgbToHsl = (r, g, b) => {
      r /= 255; g /= 255; b /= 255
      const max = Math.max(r, g, b), min = Math.min(r, g, b)
      let h = 0, s = 0
      const l = (max + min) / 2
      if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 5); break
          case g: h = (b - r) / d + 1; break
          case b: h = (r - g) / d + 3; break
        }
        h *= 60
      }
      return { h: Math.round(h % 360), s: Math.round(s * 100), l: Math.round(l * 100) }
    }

    const parseCssColorToHsla = (value) => {
      if (!value) return { h: 0, s: 100, l: 50, a: 1 }
      const v = value.trim()
      if (v.startsWith('#')) {
        const { r, g, b, a } = hexToRgba(v)
        const { h, s, l } = rgbToHsl(r, g, b)
        return { h, s, l, a: a / 255 }
      }
      if (v.startsWith('rgb')) {
        // rgb or rgba
        const nums = v.replace(/rgba?\(|\)|\s/g, '').split(',').map(Number)
        const [r, g, b, a = 1] = nums
        const { h, s, l } = rgbToHsl(r, g, b)
        return { h, s, l, a }
      }
      if (v.startsWith('hsl')) {
        const nums = v.replace(/hsla?\(|\)|\s|%/g, '').split(',').map(Number)
        const [h, s, l, a = 1] = nums
        return { h, s, l, a }
      }
      // fallback
      return { h: 0, s: 100, l: 50, a: 1 }
    }

    const loadPresetColorFromTheme = (presetId) => {
      const cs = getComputedStyle(document.documentElement)
      let varName = '--color-primary'
      if (presetId === 'bg-card') varName = '--color-bg-card'
      else if (presetId === 'text') varName = '--color-text-primary'
      const raw = cs.getPropertyValue(varName)
      const { a } = parseCssColorToHsla(raw)
      // Prefer saved angle for the preset if present
      const saved = readThemeFromStorage()
      let savedAngle = null
      if (saved) {
        if (presetId === 'primary') savedAngle = saved.primaryAngle
        if (presetId === 'bg-card') savedAngle = saved.bgCardAngle
        if (presetId === 'text') savedAngle = saved.textAngle
      }
      const finalHue = (savedAngle != null) ? clampAngle(savedAngle) : getHueFromCssValue(raw)
      selectedColor.value = { hue: finalHue }
      const alphaPercent = Math.round((a ?? 1) * 100)
      brightness.value = alphaPercent
      colorIntensity.value = alphaPercent
    }

    const resetToDefault = () => {
      if (!colorControlOn.value) return
      const root = document.documentElement
      let defaultColor = ''
      if (activePreset.value === 'primary' && defaultPrimary.value) {
        root.style.setProperty('--color-primary', defaultPrimary.value)
        defaultColor = defaultPrimary.value
      } else if (activePreset.value === 'bg-card' && defaultBgCard.value) {
        root.style.setProperty('--color-bg-card', defaultBgCard.value)
        defaultColor = defaultBgCard.value
      } else if (activePreset.value === 'text' && defaultTextPrimary.value) {
        root.style.setProperty('--color-text-primary', defaultTextPrimary.value)
        defaultColor = defaultTextPrimary.value
      }

      // 同步更新色轮选中和滑块（根据默认颜色解析）
      if (defaultColor) {
        const hue = getHueFromCssValue(defaultColor)
        selectedColor.value = { hue }
        const { a } = parseCssColorToHsla(defaultColor)
        const alphaPercent = Math.round((a ?? 1) * 100)
        brightness.value = alphaPercent
        colorIntensity.value = alphaPercent
        // 直接持久化当前 CSS 变量（保持与默认值完全一致），避免被插值覆盖
        const theme = getCurrentThemeObject()
        const saved = readThemeFromStorage() || {}
        const angle = clampAngle(hue)
        if (activePreset.value === 'primary') saved.primaryAngle = angle
        if (activePreset.value === 'bg-card') saved.bgCardAngle = angle
        if (activePreset.value === 'text') saved.textAngle = angle
        writeThemeToStorage({
          ...theme,
          primaryAngle: saved.primaryAngle ?? null,
          bgCardAngle: saved.bgCardAngle ?? null,
          textAngle: saved.textAngle ?? null
        })
      }
    }

    const toggleColorControl = () => {
      colorControlOn.value = !colorControlOn.value
    }

    const setActivePreset = (presetId) => {
      // 只有在开关开启时才能切换预设
      if (!colorControlOn.value) return
      
      activePreset.value = presetId
      // 切换预设时，从当前主题变量读取颜色，初始化色相与透明度
      loadPresetColorFromTheme(presetId)
      applyCurrentColorToTheme()
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
      applyCurrentColorToTheme()
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
      // 只有在开关开启时才能调整透明度
      if (!colorControlOn.value) return
      colorIntensity.value = brightness.value
      console.log('Transparency updated:', brightness.value)
      applyCurrentColorToTheme()
    }

    onMounted(() => {
      // 从 dark 主题读取默认颜色（作为“恢复默认”的目标）
      const darkDefaults = readThemeDefaults('dark')
      defaultPrimary.value = darkDefaults.primary || '#BFFE01'
      defaultBgCard.value = darkDefaults.bgCard || '#18181a'
      defaultTextPrimary.value = darkDefaults.text || '#FFFFFF'
      console.log('[ColorControl] defaults from theme:', {
        primary: defaultPrimary.value,
        bgCard: defaultBgCard.value,
        text: defaultTextPrimary.value
      })

      // 优先从本地存储恢复（如存在），否则保留当前主题不改动
      const saved = readThemeFromStorage()
      const root = document.documentElement
      if (saved && saved.primary && saved.bgCard && saved.text) {
        root.style.setProperty('--color-primary', saved.primary)
        root.style.setProperty('--color-bg-card', saved.bgCard)
        root.style.setProperty('--color-text-primary', saved.text)
      }

      activePreset.value = 'primary'
      // 初始化小球角度与透明度：优先使用保存的角度与颜色，其次使用当前主题
      const initialPrimary = (saved && saved.primary) ? saved.primary : defaultPrimary.value
      const initHue = (saved && saved.primaryAngle != null) ? clampAngle(saved.primaryAngle) : getHueFromCssValue(initialPrimary)
      const { a: initA } = parseCssColorToHsla(initialPrimary)
      selectedColor.value = { hue: initHue }
      const initAlphaPercent = Math.round((initA ?? 1) * 100)
      brightness.value = initAlphaPercent
      colorIntensity.value = initAlphaPercent
      // 启动完成后才允许写回主题与持久化
      isBootstrapping.value = false
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
      selectedColorForSlider,
      backgroundGradient,
      toggleColorControl,
      setActivePreset,
      startDrag,
      updateBrightness,
      resetToDefault
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

.segmented-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.segmented-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
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
  background: v-bind(backgroundGradient);
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

.slider:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: v-bind(selectedColorForSlider);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: v-bind(selectedColorForSlider);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
.reset-button {
  min-width: 68px;
  height: 32px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-button-dark);
  color: var(--color-text-primary);
  cursor: pointer;
}
.reset-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

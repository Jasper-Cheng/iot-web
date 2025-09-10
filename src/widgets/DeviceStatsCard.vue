<template>
  <div class="device-stats-card">
    <!-- Header Section -->
    <div class="card-header">
      <div class="header-left">
        <div class="icon-container">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 19c-5 0-7-2-7-7V6c0-5 2-7 7-7h6c5 0 7 2 7 7v6c0 5-2 7-7 7H9z" stroke="currentColor" stroke-width="2" fill="none"/>
            <path d="M9 9h6M9 13h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <h3 class="card-title">Device Stats</h3>
      </div>
    </div>

    <!-- Stats Info Section -->
    <div class="stats-info">
      <div class="stats-item">
        <div class="stats-number">{{ totalDevices }}</div>
        <div class="stats-label">Total Devices</div>
      </div>
      <div class="stats-item">
        <div class="stats-number online-number">{{ totalOnline }}</div>
        <div class="stats-label">
          <div class="online-dot"></div>
          Online
        </div>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="chart-container">
      <div class="pie-chart">
        <svg viewBox="0 0 200 200" class="pie-svg">
          <!-- Background circle -->
          <circle 
            cx="100" 
            cy="100" 
            r="85" 
            fill="none" 
            stroke="var(--color-border-light)" 
            stroke-width="2"
            opacity="0.3"
          />
          
          <!-- Pie slices with gradients -->
          <defs>
            <radialGradient 
              v-for="(room, index) in roomStats" 
              :key="`gradient-${index}`"
              :id="`gradient-${index}`"
              cx="50%" 
              cy="50%" 
              r="50%"
            >
              <stop offset="0%" :stop-color="lightenColor(room.color, 20)" />
              <stop offset="100%" :stop-color="room.color" />
            </radialGradient>
          </defs>
          
          <g v-for="(slice, index) in pieSlices" :key="index">
            <path 
              :d="slice.path" 
              :fill="`url(#gradient-${index})`"
              :stroke="'var(--color-bg-primary)'"
              stroke-width="2"
              class="pie-slice"
              @mouseenter="hoverSlice(index)"
              @mouseleave="unhoverSlice()"
              @click="selectSlice(index)"
              :class="{ 'selected': selectedSlice === index }"
              :style="{ 
                transformOrigin: '100px 100px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }"
            />
            <!-- Room name label on slice -->
            <text 
              v-if="slice.percentage > 8"
              :x="slice.labelX" 
              :y="slice.labelY"
              class="slice-label"
              :fill="getContrastColor(roomStats[index].color)"
              text-anchor="middle"
              dominant-baseline="middle"
              font-size="10"
              font-weight="600"
            >
              {{ slice.roomName }}
            </text>
          </g>
        </svg>
      </div>

      <!-- Legend -->
      <div class="legend">
        <div 
          v-for="(room, index) in roomStats" 
          :key="room.id"
          class="legend-item"
          :class="{ 'selected': selectedSlice === index }"
          @click="selectSlice(index)"
        >
          <div class="legend-color" :style="{ backgroundColor: room.color }"></div>
          <div class="legend-info">
            <div class="legend-name">{{ room.name }}</div>
            <div class="legend-stats">
              <span class="online">{{ room.online }} online</span>
              <span class="offline">{{ room.offline }} offline</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tooltip -->
    <div 
      v-if="tooltip.visible" 
      class="tooltip"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      <div class="tooltip-content">
        <div class="tooltip-title">{{ tooltip.room }}</div>
        <div class="tooltip-stats">
          <div>Total: {{ tooltip.total }} devices</div>
          <div>Online: {{ tooltip.online }}</div>
          <div>Offline: {{ tooltip.offline }}</div>
          <div>Percentage: {{ tooltip.percentage }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// Props
const props = defineProps({
  rooms: {
    type: Array,
    default: () => []
  }
})

// Default color palette for rooms
const colorPalette = [
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Orange
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange-500
  '#ec4899', // Pink
  '#6366f1'  // Indigo
]

// Process room data with colors and device stats
const roomStats = computed(() => {
  return props.rooms.map((room, index) => ({
    id: room.id,
    name: room.name,
    total: room.devices?.total || 0,
    online: room.devices?.online || 0,
    offline: room.devices?.offline || 0,
    color: room.color || colorPalette[index % colorPalette.length]
  })).filter(room => room.total > 0) // Only show rooms with devices
})

// Selected slice state
const selectedSlice = ref(-1)

// Tooltip state
const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  room: '',
  total: 0,
  online: 0,
  offline: 0,
  percentage: 0
})

// Computed properties
const totalDevices = computed(() => {
  return roomStats.value.reduce((sum, room) => sum + room.total, 0)
})

const totalOnline = computed(() => {
  return roomStats.value.reduce((sum, room) => sum + room.online, 0)
})

// Color utility functions
const lightenColor = (color, percent) => {
  const num = parseInt(color.replace("#", ""), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
}

const getContrastColor = (color) => {
  const num = parseInt(color.replace("#", ""), 16)
  const R = num >> 16
  const G = num >> 8 & 0x00FF
  const B = num & 0x0000FF
  // Calculate luminance
  const luminance = (0.299 * R + 0.587 * G + 0.114 * B) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

const pieSlices = computed(() => {
  const radius = 80
  const labelRadius = 60 // Position for labels
  const centerX = 100
  const centerY = 100
  let currentAngle = -90 // Start from top
  
  return roomStats.value.map((room, index) => {
    const percentage = (room.total / totalDevices.value) * 100
    const angle = (percentage / 100) * 360
    
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    const midAngle = startAngle + angle / 2 // Middle angle for label
    
    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad = (endAngle * Math.PI) / 180
    const midAngleRad = (midAngle * Math.PI) / 180
    
    const x1 = centerX + radius * Math.cos(startAngleRad)
    const y1 = centerY + radius * Math.sin(startAngleRad)
    const x2 = centerX + radius * Math.cos(endAngleRad)
    const y2 = centerY + radius * Math.sin(endAngleRad)
    
    // Label position
    const labelX = centerX + labelRadius * Math.cos(midAngleRad)
    const labelY = centerY + labelRadius * Math.sin(midAngleRad)
    
    const largeArcFlag = angle > 180 ? 1 : 0
    
    const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
    
    currentAngle += angle
    
    return {
      path,
      color: room.color,
      percentage: Math.round(percentage),
      room: room.name,
      roomName: room.name.split(' ')[0], // Use first word for shorter label
      total: room.total,
      online: room.online,
      offline: room.offline,
      labelX,
      labelY
    }
  })
})

// Event handlers
const hoverSlice = (index) => {
  const slice = pieSlices.value[index]
  tooltip.value = {
    visible: true,
    x: 0, // Will be set by mouse event
    y: 0, // Will be set by mouse event
    room: slice.room,
    total: slice.total,
    online: slice.online,
    offline: slice.offline,
    percentage: slice.percentage
  }
}

const unhoverSlice = () => {
  tooltip.value.visible = false
}

const selectSlice = (index) => {
  selectedSlice.value = selectedSlice.value === index ? -1 : index
}

// Hide selected slice when clicking outside
const hideSelectedSlice = (event) => {
  // Only hide if clicking outside the chart and legend
  if (!event.target.closest('.pie-chart') && 
      !event.target.closest('.legend') &&
      !event.target.closest('.legend-item')) {
    selectedSlice.value = -1
  }
}

// Update tooltip position on mouse move
const updateTooltipPosition = (event) => {
  if (tooltip.value.visible) {
    tooltip.value.x = event.clientX + 10
    tooltip.value.y = event.clientY - 10
  }
}

onMounted(() => {
  document.addEventListener('mousemove', updateTooltipPosition)
  document.addEventListener('click', hideSelectedSlice)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', updateTooltipPosition)
  document.removeEventListener('click', hideSelectedSlice)
})
</script>

<style scoped>
.device-stats-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-container {
  width: 40px;
  height: 40px;
  background: var(--color-button-dark);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-primary);
}

.icon-container svg {
  width: 20px;
  height: 20px;
}

.card-title {
  color: var(--color-text-primary);
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.stats-info {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border-light);
}

.stats-item {
  text-align: center;
  flex: 1;
}

.stats-number {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1;
  margin-bottom: 2px;
}

.stats-number.online-number {
  color: #10b981;
}

.stats-label {
  font-size: 10px;
  color: var(--color-text-secondary);
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.chart-container {
  flex: 1;
  display: flex;
  gap: 20px;
  align-items: center;
}

.pie-chart {
  position: relative;
  width: 200px;
  height: 200px;
  flex-shrink: 0;
}

.pie-svg {
  width: 100%;
  height: 100%;
}

.pie-slice {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15));
  opacity: 0.9;
}

.pie-slice:hover {
  filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.25));
  transform: scale(1.05);
  opacity: 1;
}

.pie-slice.selected {
  filter: drop-shadow(0 6px 20px rgba(0, 0, 0, 0.35));
  transform: scale(1.08);
  opacity: 1;
}

.slice-label {
  pointer-events: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.online-dot {
  width: 4px;
  height: 4px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

.legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: space-between;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.legend-item:hover {
  background: var(--color-hover);
}

.legend-item.selected {
  background: var(--color-button-dark);
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-info {
  flex: 1;
  min-width: 0;
}

.legend-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.legend-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
}

.online {
  color: #10b981;
  font-weight: 500;
}

.offline {
  color: #ef4444;
  font-weight: 500;
}

.tooltip {
  position: fixed;
  z-index: 1000;
  pointer-events: none;
}

.tooltip-content {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 150px;
}

.tooltip-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.tooltip-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.tooltip-stats div {
  display: flex;
  justify-content: space-between;
}

</style>

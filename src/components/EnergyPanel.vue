<template>
  <div class="energy-card">
    <!-- Header Section -->
    <div class="card-header">
      <div class="header-left">
        <div class="icon-container">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" fill="currentColor"/>
          </svg>
        </div>
        <h3 class="card-title">Energy</h3>
      </div>
      <div class="time-selector" @click="toggleDropdown">
        <span class="time-label">{{ selectedPeriod }}</span>
        <svg class="chevron" :class="{ 'rotated': showDropdown }" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
        <div v-if="showDropdown" class="dropdown-menu">
          <div 
            v-for="period in timePeriods" 
            :key="period"
            class="dropdown-item"
            :class="{ 'active': selectedPeriod === period }"
            @click.stop="selectPeriod(period)"
          >
            {{ period }}
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="chart-container">
      <div class="y-axis">
        <div 
          v-for="(value, index) in yAxisValues" 
          :key="index"
          class="y-label"
        >
          {{ value }}
        </div>
      </div>
      <div class="chart-area">
        <div class="chart-bars">
          <div 
            v-for="(bar, index) in chartData" 
            :key="index"
            class="bar-container"
          >
            <div 
              class="chart-bar"
              :class="{ 'selected': selectedBar === index }"
              :style="{ height: `${bar.height}%` }"
              @click="selectBar(index)"
            ></div>
            <div 
              v-if="selectedBar === index"
              :style="{ bottom: `${bar.height}%` }"
              class="value-display"
            >
              {{ bar.value }} kWh
            </div>
          </div>
        </div>
        <div class="chart-grid">
          <div class="grid-line" v-for="i in 5" :key="i"></div>
        </div>
        <div class="chart-labels">
          <div 
            v-for="(label, index) in dayLabels" 
            :key="index"
            class="day-label"
          >
            {{ label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

// Time period selection
const selectedPeriod = ref('Week')
const showDropdown = ref(false)
const timePeriods = ['Week', 'Month', 'Year']

// Chart data for different time periods
const weekData = [
  { height: 24, value: 12 }, // Monday (12/50 * 100 = 24%)
  { height: 56, value: 28 }, // Tuesday (28/50 * 100 = 56%)
  { height: 14, value: 7 },  // Wednesday (7/50 * 100 = 14%)
  { height: 72, value: 36 }, // Thursday (36/50 * 100 = 72%)
  { height: 42, value: 21 }, // Friday (21/50 * 100 = 42%)
  { height: 84, value: 42 }, // Saturday (42/50 * 100 = 84%)
  { height: 32, value: 16 }  // Sunday (16/50 * 100 = 32%)
]

const monthData = [
  { height: 60, value: 150 }, // Week 1
  { height: 80, value: 200 }, // Week 2
  { height: 45, value: 112 }, // Week 3
  { height: 70, value: 175 }  // Week 4
]

const yearData = [
  { height: 35, value: 420 }, // Jan
  { height: 42, value: 500 }, // Feb
  { height: 38, value: 450 }, // Mar
  { height: 55, value: 660 }, // Apr
  { height: 48, value: 580 }, // May
  { height: 62, value: 740 }, // Jun
  { height: 70, value: 840 }, // Jul
  { height: 65, value: 780 }, // Aug
  { height: 45, value: 540 }, // Sep
  { height: 40, value: 480 }, // Oct
  { height: 35, value: 420 }, // Nov
  { height: 50, value: 600 }  // Dec
]

// Computed properties for dynamic data
const chartData = computed(() => {
  switch (selectedPeriod.value) {
    case 'Week':
      return weekData
    case 'Month':
      return monthData
    case 'Year':
      return yearData
    default:
      return weekData
  }
})

const dayLabels = computed(() => {
  switch (selectedPeriod.value) {
    case 'Week':
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    case 'Month':
      return ['W1', 'W2', 'W3', 'W4']
    case 'Year':
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    default:
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  }
})

const yAxisValues = computed(() => {
  switch (selectedPeriod.value) {
    case 'Week':
      return [50, 40, 30, 20, 10, 0]
    case 'Month':
      return [250, 200, 150, 100, 50, 0]
    case 'Year':
      return [1000, 800, 600, 400, 200, 0]
    default:
      return [50, 40, 30, 20, 10, 0]
  }
})

// Selected bar state
const selectedBar = ref(-1)

// Select bar function
const selectBar = (index) => {
  selectedBar.value = selectedBar.value === index ? -1 : index
}

// Dropdown functions
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const selectPeriod = (period) => {
  selectedPeriod.value = period
  showDropdown.value = false
  selectedBar.value = -1 // Reset selected bar when changing period
}

// Hide value display when clicking outside
const hideValueDisplay = (event) => {
  // Only hide if clicking outside the chart bars and dropdown
  if (!event.target.closest('.chart-bars') && !event.target.closest('.time-selector')) {
    selectedBar.value = -1
    showDropdown.value = false
  }
}

// Add event listener for clicking outside
onMounted(() => {
  document.addEventListener('click', hideValueDisplay)
})

onUnmounted(() => {
  document.removeEventListener('click', hideValueDisplay)
})
</script>

<style scoped>
.energy-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 280px;
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

.time-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-primary);
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  position: relative;
}

.time-selector:hover {
  background: var(--color-hover);
}

.time-label {
  font-size: 14px;
  font-weight: 500;
}

.chevron {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.chevron.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 100px;
  overflow: hidden;
  margin-top: 4px;
}

.dropdown-item {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background-color 0.2s ease;
  white-space: nowrap;
}

.dropdown-item:hover {
  background: var(--color-hover);
}

.dropdown-item.active {
  background: var(--color-button-dark);
  color: var(--color-text-primary);
}

.chart-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  display: flex;
  gap: 8px;
}

.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 0 30px 0;
  min-width: 20px;
}

.y-label {
  color: var(--color-text-secondary);
  font-size: 11px;
  font-weight: 500;
  text-align: right;
  line-height: 1;
}

.chart-area {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 180px;
  padding-bottom: 30px;
}

.chart-bars {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  height: calc(100% - 30px);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 8px;
  z-index: 2;
}

.bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  width: 24px;
  height: 100%;
}

.chart-bar {
  width: 24px;
  background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 4px 4px 0 0;
  min-height: 4px;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
  align-self: flex-end;
}

.chart-bar:hover {
  background: linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%);
  transform: scaleX(1.1);
}

.chart-bar.selected {
  background: linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%);
  transform: scaleX(1.1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.value-display {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--color-border);
  white-space: nowrap;
  z-index: 10;
  animation: fadeIn 0.2s ease;
}

.value-display::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: var(--color-bg-primary);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.chart-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.grid-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--color-border-light);
}

.grid-line:nth-child(1) { top: 0%; }
.grid-line:nth-child(2) { top: 25%; }
.grid-line:nth-child(3) { top: 50%; }
.grid-line:nth-child(4) { top: 75%; }
.grid-line:nth-child(5) { top: calc(100% - 30px); }

.chart-labels {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  z-index: 3;
}

.day-label {
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  width: 24px;
}
</style>

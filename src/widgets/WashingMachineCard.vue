<template>
  <div class="washing-machine-card">
    <div class="card-header">
      <div class="washing-machine-card-info">
        <h3>Washing Machine</h3>
        <p>Samsung Smart Washer</p>
      </div>

      <div class="record-button">
        <button 
          class="record-btn"
          @click="$emit('show-records', washingMachineRecords)"
          title="查看洗衣记录">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
          </svg>
          洗衣记录
        </button>
      </div>

      <div class="washing-machine-start">
        <button 
          :class="['start-btn', { disabled: !washingMachinePower || (!activeWashingMachineMode && washingMachineStatus === 'idle') || (washingMachineStatus !== 'idle' && washingMachineStatus !== 'done') }]"
          :disabled="!washingMachinePower || (!activeWashingMachineMode && washingMachineStatus === 'idle') || (washingMachineStatus !== 'idle' && washingMachineStatus !== 'done')"
          @click="startWashingMachine">
          <svg v-if="washingMachineStatus === 'idle'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <svg v-else-if="washingMachineStatus === 'done'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          {{ startButtonText }}
        </button>
      </div>

      <div class="power-switch">
        <span class="switch-label">{{ washingMachinePower ? 'On' : 'Off' }}</span>
        <div 
          :class="['switch-button', { active: washingMachinePower }]"
          @click="toggleWashingMachine"
        ></div>
      </div>
    </div>

    <div class="washing-machine-status-section">
      <div class="washing-machine-info">
        <div class="status-display">
          <div class="status-icon" :class="washingMachineStatus">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h18v2H3V6zM3 10h18v8H3v-8z" stroke="currentColor" stroke-width="2" fill="none"/>
              <circle cx="8" cy="14" r="1" fill="currentColor"/>
              <circle cx="12" cy="14" r="1" fill="currentColor"/>
              <circle cx="16" cy="14" r="1" fill="currentColor"/>
            </svg>
          </div>
          <div class="status-text">
            <h4>{{ washingMachineStatusText }}</h4>
            <p>{{ washingMachineTime.toFixed(1) }} min remaining</p>
          </div>
        </div>
        <div class="washing-progress">
          <div class="progress-label">Washing Progress</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: washingMachineProgress + '%' }"></div>
          </div>
          <div class="progress-text">{{ washingMachineProgress.toFixed(1) }}%</div>
        </div>
      </div>
    </div>

    <div class="washing-machine-controls">
      <div v-for="mode in washingMachineModes" class="mode-div">
        <button :key="mode.id"
          :class="['mode-btn', { active: mode.id === activeWashingMachineMode && washingMachinePower, disabled: !washingMachinePower || (washingMachineStatus !== 'idle' && washingMachineStatus !== 'done') }]"
          :disabled="!washingMachinePower || (washingMachineStatus !== 'idle' && washingMachineStatus !== 'done')"
          @click="setWashingMachineMode(mode.id)">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path v-if="mode.id === 'normal'" d="M3 6h18v2H3V6zM3 10h18v8H3v-8z M8 14h8" stroke="currentColor" stroke-width="2" fill="none"/>
            <path v-else-if="mode.id === 'quick'" d="M3 6h18v2H3V6zM3 10h18v8H3v-8z M8 12h8 M8 16h8" stroke="currentColor" stroke-width="2" fill="none"/>
            <path v-else-if="mode.id === 'delicate'" d="M3 6h18v2H3V6zM3 10h18v8H3v-8z M8 13h8" stroke="currentColor" stroke-width="2" fill="none"/>
            <path v-else-if="mode.id === 'heavy'" d="M3 6h18v2H3V6zM3 10h18v8H3v-8z M8 12h8 M8 14h8 M8 16h8" stroke="currentColor" stroke-width="2" fill="none"/>
            <path v-else-if="mode.id === 'wool'" d="M3 6h18v2H3V6zM3 10h18v8H3v-8z M8 12h8" stroke="currentColor" stroke-width="2" fill="none"/>
            <path v-else-if="mode.id === 'eco'" d="M3 6h18v2H3V6zM3 10h18v8H3v-8z M8 13h8" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
        </button>
        <span>{{ mode.name }}</span>
      </div>
    </div>

    <div class="washing-machine-settings">
      <div class="setting-group">
        <h5>温度</h5>
        <div class="setting-options">
          <button 
            v-for="option in temperatureOptions" 
            :key="option.id"
            :class="['setting-btn', { active: option.id === washingMachineSettings.temperature && washingMachinePower && activeWashingMachineMode, disabled: !washingMachinePower || !activeWashingMachineMode || (washingMachineStatus !== 'idle' && washingMachineStatus !== 'done') }]"
            :disabled="!washingMachinePower || !activeWashingMachineMode || (washingMachineStatus !== 'idle' && washingMachineStatus !== 'done')"
            @click="setWashingMachineSetting('temperature', option.id)">
            {{ option.name }}
          </button>
        </div>
      </div>

      <div class="setting-group">
        <h5>洗涤次数</h5>
        <div class="setting-options">
          <button 
            v-for="option in rinseCountOptions" 
            :key="option.id"
            :class="['setting-btn', { active: option.id === washingMachineSettings.rinseCount && washingMachinePower && activeWashingMachineMode, disabled: !washingMachinePower || !activeWashingMachineMode || (washingMachineStatus !== 'idle' && washingMachineStatus !== 'done') }]"
            :disabled="!washingMachinePower || !activeWashingMachineMode || (washingMachineStatus !== 'idle' && washingMachineStatus !== 'done')"
            @click="setWashingMachineSetting('rinseCount', option.id)">
            {{ option.name }}
          </button>
        </div>
      </div>

      <div class="setting-group">
        <h5>脱水转速</h5>
        <div class="setting-options">
          <button 
            v-for="option in spinSpeedOptions" 
            :key="option.id"
            :class="['setting-btn', { active: option.id === washingMachineSettings.spinSpeed && washingMachinePower && activeWashingMachineMode, disabled: !washingMachinePower || !activeWashingMachineMode || (washingMachineStatus !== 'idle' && washingMachineStatus !== 'done') }]"
            :disabled="!washingMachinePower || !activeWashingMachineMode || (washingMachineStatus !== 'idle' && washingMachineStatus !== 'done')"
            @click="setWashingMachineSetting('spinSpeed', option.id)">
            {{ option.name }}
          </button>
        </div>
      </div>

      <div class="setting-group">
        <h5>烘干时长</h5>
        <div class="setting-options">
          <button 
            v-for="option in dryTimeOptions" 
            :key="option.id"
            :class="['setting-btn', { active: option.id === washingMachineSettings.dryTime && washingMachinePower && activeWashingMachineMode, disabled: !washingMachinePower || !activeWashingMachineMode || (washingMachineStatus !== 'idle' && washingMachineStatus !== 'done') }]"
            :disabled="!washingMachinePower || !activeWashingMachineMode || (washingMachineStatus !== 'idle' && washingMachineStatus !== 'done')"
            @click="setWashingMachineSetting('dryTime', option.id)">
            {{ option.name }}
          </button>
        </div>
      </div>

      <!-- 确认关闭对话框 -->
      <div v-if="showConfirmDialog" class="confirm-dialog-overlay" @click="cancelTurnOff">
        <div class="confirm-dialog" @click.stop>
          <div class="confirm-dialog-header"><h3>确认关闭洗衣机</h3></div>
          <div class="confirm-dialog-content">
            <p>洗衣机正在运行中，确定要关闭吗？</p>
            <p class="warning-text">关闭后洗衣进度将丢失，需要重新开始。</p>
          </div>
          <div class="confirm-dialog-actions">
            <button class="cancel-btn" @click="cancelTurnOff">取消</button>
            <button class="confirm-btn" @click="confirmTurnOff">确认关闭</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'

const washingMachineModes = ref([
  { id: 'normal', name: 'Normal' },
  { id: 'quick', name: 'Quick' },
  { id: 'delicate', name: 'Delicate' },
  { id: 'heavy', name: 'Heavy' },
  { id: 'wool', name: 'Wool' },
  { id: 'eco', name: 'Eco' }
])

const temperatureOptions = ref([
  { id: 'cold', name: '常温', value: '常温' },
  { id: 'warm', name: '40°C', value: '40°C' }
])

const rinseCountOptions = ref([
  { id: 1, name: '1次' },
  { id: 2, name: '2次' },
  { id: 3, name: '3次' }
])

const spinSpeedOptions = ref([
  { id: 0, name: '无' },
  { id: 400, name: '400' },
  { id: 600, name: '600' },
  { id: 800, name: '800' },
  { id: 1000, name: '1000' },
  { id: 1200, name: '1200' }
])

const dryTimeOptions = ref([
  { id: 'none', name: '不烘干' },
  { id: 'smart', name: '智能烘干' },
  { id: '30', name: '30分钟' },
  { id: '60', name: '60分钟' },
  { id: '90', name: '90分钟' },
  { id: '120', name: '120分钟' },
  { id: '180', name: '180分钟' }
])

const washingMachinePower = ref(false)
const activeWashingMachineMode = ref('normal')
const lastActiveWashingMachineMode = ref(activeWashingMachineMode.value)
const washingMachineStatus = ref('idle') // idle, washing, rinsing, spinning, done
const washingMachineTime = ref(0)
const washingMachineProgress = ref(0)

// Demo records (moved into component)
const washingMachineRecords = ref([
  { id: 1, date: '2024-01-15', time: '16:20', duration: '45分钟', mode: 'Normal', status: '完成' },
  { id: 2, date: '2024-01-14', time: '10:30', duration: '30分钟', mode: 'Quick', status: '完成' },
  { id: 3, date: '2024-01-13', time: '19:15', duration: '60分钟', mode: 'Heavy', status: '完成' }
])

const washingMachineSettings = ref({
  temperature: 'cold',
  rinseCount: 2,
  spinSpeed: 800,
  dryTime: 'none'
})

const washingMachineStatusText = computed(() => {
  if (!washingMachinePower.value) return 'Offline'
  switch (washingMachineStatus.value) {
    case 'idle': return 'Idle'
    case 'washing': return 'Washing'
    case 'rinsing': return 'Rinsing'
    case 'spinning': return 'Spinning'
    case 'done': return 'Done'
    default: return 'Unknown'
  }
})

const startButtonText = computed(() => {
  if (!washingMachinePower.value) return '设备关闭'
  if (!activeWashingMachineMode.value) return '选择模式'
  switch (washingMachineStatus.value) {
    case 'idle': return '开始洗衣'
    case 'washing': return '洗衣中...'
    case 'rinsing': return '漂洗中...'
    case 'spinning': return '脱水中...'
    case 'done': return '已完成'
    default: return '开始洗衣'
  }
})

const showConfirmDialog = ref(false)

const toggleWashingMachine = () => {
  // 正在运行时，先弹窗确认
  if (
    washingMachinePower.value &&
    (washingMachineStatus.value === 'washing' || washingMachineStatus.value === 'rinsing' || washingMachineStatus.value === 'spinning')
  ) {
    showConfirmDialog.value = true
    return
  }

  washingMachinePower.value = !washingMachinePower.value
  if (!washingMachinePower.value) {
    lastActiveWashingMachineMode.value = activeWashingMachineMode.value
    activeWashingMachineMode.value = null
    washingMachineStatus.value = 'idle'
    washingMachineProgress.value = 0
    washingMachineTime.value = 0
  } else {
    activeWashingMachineMode.value = null
    washingMachineStatus.value = 'idle'
    washingMachineProgress.value = 0
    washingMachineTime.value = 0
  }
}

const confirmTurnOff = () => {
  washingMachinePower.value = false
  lastActiveWashingMachineMode.value = activeWashingMachineMode.value
  activeWashingMachineMode.value = null
  washingMachineStatus.value = 'idle'
  washingMachineProgress.value = 0
  washingMachineTime.value = 0
  showConfirmDialog.value = false
}

const cancelTurnOff = () => {
  showConfirmDialog.value = false
}

const setWashingMachineMode = (modeId) => {
  if (!washingMachinePower.value) return
  if (washingMachineStatus.value !== 'idle' && washingMachineStatus.value !== 'done') return
  activeWashingMachineMode.value = modeId
  lastActiveWashingMachineMode.value = modeId
}

const setWashingMachineSetting = (key, value) => {
  if (!washingMachinePower.value || !activeWashingMachineMode.value) return
  if (washingMachineStatus.value !== 'idle' && washingMachineStatus.value !== 'done') return
  washingMachineSettings.value[key] = value
}

let washingInterval = null

const startWashingMachine = () => {
  if (!washingMachinePower.value) return
  // 已完成则重置
  if (washingMachineStatus.value === 'done') {
    washingMachineStatus.value = 'idle'
    washingMachineProgress.value = 0
    washingMachineTime.value = 0
    return
  }
  if (!activeWashingMachineMode.value) return
  washingMachineStatus.value = 'washing'
  washingMachineProgress.value = 0
  washingMachineTime.value = 45

  if (washingInterval) clearInterval(washingInterval)
  washingInterval = setInterval(() => {
    if (!washingMachinePower.value || washingMachineStatus.value === 'idle') {
      clearInterval(washingInterval)
      washingInterval = null
      return
    }

    // 进度与倒计时
    if (washingMachineStatus.value !== 'done') {
      washingMachineProgress.value = Math.min(100, washingMachineProgress.value + Math.random() * 8)
      washingMachineTime.value = Math.max(0, washingMachineTime.value - 1.2)
    }

    // 阶段切换
    if (washingMachineProgress.value >= 60 && washingMachineStatus.value === 'washing') {
      washingMachineStatus.value = 'spinning'
    } else if (washingMachineProgress.value >= 30 && washingMachineStatus.value === 'washing') {
      washingMachineStatus.value = 'rinsing'
    }

    if (washingMachineProgress.value >= 100) {
      washingMachineProgress.value = 100
      washingMachineStatus.value = 'done'
      washingMachineTime.value = 0
      clearInterval(washingInterval)
      washingInterval = null
      setTimeout(() => {
        activeWashingMachineMode.value = null
        washingMachineStatus.value = 'idle'
        washingMachineProgress.value = 0
      }, 3000)
    }
  }, 1000)
}

onBeforeUnmount(() => { if (washingInterval) clearInterval(washingInterval) })
</script>

<style scoped>
.washing-machine-card { display: flex; flex-direction: column; flex: 1; border: 1px solid var(--color-border); border-radius: 16px; padding: 24px 18px; }
.washing-machine-card-info h3 { margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: var(--color-text-primary); }
.washing-machine-card-info p { margin: 0; color: var(--color-text-secondary); font-size: 12px; }
.washing-machine-status-section { margin-bottom: 24px; }
.washing-machine-info { display: flex; flex-direction: column; gap: 20px; }
.status-display { display: flex; align-items: center; gap: 16px; }
.status-icon { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--color-button-dark); transition: all 0.3s ease; }
.status-icon svg { width: 24px; height: 24px; color: var(--color-text-secondary); }
.status-text h4 { margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: var(--color-text-primary); }
.status-text p { margin: 0; font-size: 12px; color: var(--color-text-secondary); }
.washing-progress { display: flex; flex-direction: column; gap: 8px; }
.progress-label { font-size: 12px; color: var(--color-text-secondary); font-weight: 500; }
.washing-machine-status-section .progress-bar { width: 100%; height: 8px; background: var(--color-button-dark); border-radius: 4px; overflow: hidden; }
.washing-machine-status-section .progress-fill { height: 100%; background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-blue-500) 100%); border-radius: 4px; transition: width 0.3s ease; }
.progress-text { font-size: 12px; color: var(--color-text-secondary); text-align: right; }
.washing-machine-controls { display: flex; gap: 16px; margin-top: 24px; flex-wrap: wrap; }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.power-switch {display: flex;align-items: center;gap: 8px;}

/* Mode buttons used inside this widget */
.mode-div { display: flex; flex-direction: column; align-items: center; gap: 12px; flex: 1; }
.mode-btn { border: none; border-radius: 10px; background: var(--color-button-dark); color: #fff; cursor: pointer; transition: all 0.3s ease; padding: 10px 24px; }
.mode-btn:hover { background: var(--color-button-dark-hover); transform: translateY(-2px); }
.mode-btn.active { border: 1px solid var(--color-primary); color: #fff; }
.mode-btn:disabled, .mode-btn.disabled { opacity: 0.5; cursor: not-allowed; }
.mode-btn svg { width: 28px; height: 28px; color: #fff; stroke: #fff; }
.mode-btn.active svg { color: var(--color-primary); }
.mode-div span { font-size: 12px; font-weight: 500; color: var(--color-text-primary); text-align: center; }

/* Record button (aligned with header) */
.record-button { display: flex; align-items: center; }
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
.record-btn:hover { background: var(--color-hover); color: var(--color-text-primary); border-color: var(--color-primary); }
.record-btn svg { width: 16px; height: 16px; fill: currentColor; }

/* Start button */
.washing-machine-start .start-btn { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--color-border); background: var(--color-bg); color: var(--color-text-primary); cursor: pointer; }
.washing-machine-start .start-btn.disabled { opacity: 0.5; cursor: not-allowed; }

/* Switch */
.switch-label { font-size: 12px; color: var(--color-text-secondary); }
.switch-button { width: 32px; height: 20px; background: var(--color-switch-indicator); border: 1px solid var(--color-border); border-radius: 10px; position: relative; cursor: pointer; transition: all 0.3s ease; }
.switch-button.active { background: var(--color-primary); }
.switch-button::after { content: ''; position: absolute; top: 2px; width: 14px; height: 14px; background: var(--color-switch-indicator-active); border-radius: 50%; transition: all 0.3s ease; }
.switch-button.active::after { left: 16px; }

/* Settings */
.washing-machine-settings { margin-top: 24px; display: flex; flex-direction: column; gap: 20px; }
.setting-group h5 { margin: 0 0 8px 0; font-size: 12px; color: var(--color-text-secondary); }
.setting-options { display: flex; gap: 8px; flex-wrap: wrap; }
.setting-btn { height: 28px; padding: 0 10px; border-radius: 6px; border: 1px solid var(--color-border); background: var(--color-bg); color: var(--color-text-primary); font-size: 12px; }
.setting-btn.active { background: var(--color-primary); border-color: var(--color-primary); color: #fff; }
.setting-btn.disabled { opacity: 0.5; cursor: not-allowed; }

/* States */
.washing-machine-card .status-icon.idle { background: var(--color-button-dark); }
.washing-machine-card .status-icon.washing { background: var(--color-blue-500); animation: pulse 2s infinite; }
.washing-machine-card .status-icon.rinsing { background: #60a5fa; animation: pulse 2s infinite; }
.washing-machine-card .status-icon.spinning { background: var(--color-blue-600); animation: pulse 1.5s infinite; }
.washing-machine-card .status-icon.done { background: #10b981; animation: pulse 1s infinite; }

/* Confirm dialog styles (match Home.vue) */
.confirm-dialog-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; }
.confirm-dialog { background: var(--color-bg-secondary); border-radius: 16px; padding: 20px; width: 360px; box-shadow: 0 10px 30px var(--shadow-strong); border: 1px solid var(--color-border); }
.confirm-dialog-header { margin-bottom: 16px; }
.confirm-dialog-header h3 { margin: 0; font-size: 18px; color: var(--color-text-primary); font-weight: 700; }
.confirm-dialog-content { margin-bottom: 24px; }
.confirm-dialog-content p { margin: 0 0 8px 0; font-size: 14px; color: var(--color-text-secondary); }
.warning-text { color: var(--color-yellow-500); }
.confirm-dialog-actions { display: flex; gap: 12px; justify-content: flex-end; }
.cancel-btn, .confirm-btn { padding: 10px 20px; border-radius: 8px; border: 1px solid var(--color-border); background: var(--color-bg); color: var(--color-text-primary); cursor: pointer; transition: all 0.2s ease; }
.cancel-btn { background: var(--color-bg-secondary); color: var(--color-text-secondary); }
.cancel-btn:hover { background: var(--color-hover); color: var(--color-text-primary); }
.confirm-btn { background: #ef4444; color: #fff; }
.confirm-btn:hover { background: #dc2626; transform: translateY(-1px); }
</style>



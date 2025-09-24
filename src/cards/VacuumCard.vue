<template>
  <div class="vacuum-card">
    <div class="card-header">
      <div class="vacuum-card-info">
        <h3>Smart Vacuum</h3>
        <p>KLAZ Vacuum Pro</p>
      </div>

      <div class="record-button">
        <button 
          class="record-btn"
          @click="showVacuumRecords = true"
          title="查看扫地记录">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
          </svg>
          扫地记录
        </button>
      </div>

      <div class="power-switch">
        <span class="switch-label">{{ vacuumPower ? 'On' : 'Off' }}</span>
        <div 
          :class="['switch-button', { active: vacuumPower }]"
          @click="toggleVacuum"
        ></div>
      </div>
    </div>
    
    <div class="vacuum-status-section">
      <div class="vacuum-info">
        <div class="status-display">
          <div class="status-icon" :class="vacuumStatus">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10c0-5.5-4.5-10-10-10z" stroke="currentColor" stroke-width="2" fill="none"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <div class="status-text">
            <h4>{{ vacuumStatusText }}</h4>
            <p>{{ vacuumBattery }}% Battery</p>
          </div>
        </div>
        <div class="cleaning-progress">
          <div class="progress-label">Cleaning Progress</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: vacuumProgress + '%' }"></div>
          </div>
          <div class="progress-text">{{ vacuumProgress.toFixed(1) }}%</div>
        </div>
      </div>
    </div>
    
    <div class="vacuum-controls">
      <div v-for="mode in vacuumModes" class="mode-div">
        <button :key="mode.id"
          :class="['mode-btn', { active: mode.id === activeVacuumMode && vacuumPower, disabled: !vacuumPower }]"
          :disabled="!vacuumPower"
          @click="setVacuumMode(mode.id)">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path v-if="mode.id === 'auto'" d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10c0-5.5-4.5-10-10-10z M12 6v6l4 2" stroke="currentColor" stroke-width="2" fill="none"/>
            <path v-else-if="mode.id === 'spot'" d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10c0-5.5-4.5-10-10-10z M12 8v8 M8 12h8" stroke="currentColor" stroke-width="2" fill="none"/>
            <path v-else-if="mode.id === 'edge'" d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10c0-5.5-4.5-10-10-10z M8 8h8v8H8z" stroke="currentColor" stroke-width="2" fill="none"/>
            <path v-else-if="mode.id === 'mop'" d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10c0-5.5-4.5-10-10-10z M12 6v12 M6 12h12" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
        </button>
        <span>{{ mode.name }}</span>
      </div>
    </div>
  </div>

  <!-- 扫地记录对话框 -->
  <div v-if="showVacuumRecords" class="record-dialog-overlay" @click="closeRecordDialog">
    <div class="record-dialog" @click.stop>
      <div class="record-dialog-header">
        <h3>清洁记录</h3>
        <button class="close-btn" @click="closeRecordDialog">×</button>
      </div>
      <div class="record-list">
        <div v-for="record in vacuumRecords" :key="record.id" class="record-item">
          <div class="record-date">
            <span class="date">{{ record.date }}</span>
            <span class="time">{{ record.time }}</span>
          </div>
          <div class="record-details">
            <span class="mode">{{ record.mode }}</span>
            <span class="duration">{{ record.duration }}</span>
            <span class="status" :class="record.status">{{ record.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 定义 props
const props = defineProps({
  device: {
    type: Object,
    default: () => ({})
  }
})

// Record dialog state
const showVacuumRecords = ref(false)

const vacuumModes = ref([
  { id: 'auto', name: 'Auto' },
  { id: 'spot', name: 'Spot' },
  { id: 'edge', name: 'Edge' },
  { id: 'mop', name: 'Mop' }
])

const vacuumPower = ref(false)
const activeVacuumMode = ref('auto')
const lastActiveVacuumMode = ref(activeVacuumMode.value)
const vacuumStatus = ref('idle') // idle, cleaning, charging, done, error
const vacuumBattery = ref(85)
const vacuumProgress = ref(0)

// Demo vacuum records
const vacuumRecords = ref([
  { id: 1, date: '2024-01-15', time: '14:30', duration: '45分钟', mode: 'Auto', status: '完成' },
  { id: 2, date: '2024-01-14', time: '09:15', duration: '32分钟', mode: 'Spot', status: '完成' },
  { id: 3, date: '2024-01-13', time: '20:45', duration: '38分钟', mode: 'Edge', status: '完成' }
])
const vacuumStatusText = computed(() => {
  if (!vacuumPower.value) return 'Offline'
  switch (vacuumStatus.value) {
    case 'idle': return 'Idle'
    case 'cleaning': return 'Cleaning'
    case 'charging': return 'Charging'
    case 'done': return 'Done'
    case 'error': return 'Error'
    default: return 'Unknown'
  }
})

const toggleVacuum = () => {
  vacuumPower.value = !vacuumPower.value
  if (!vacuumPower.value) {
    lastActiveVacuumMode.value = activeVacuumMode.value
    activeVacuumMode.value = null
    vacuumStatus.value = 'idle'
    vacuumProgress.value = 0
  } else {
    activeVacuumMode.value = null
    vacuumStatus.value = 'idle'
    vacuumProgress.value = 0
  }
}

const setVacuumMode = (modeId) => {
  if (!vacuumPower.value) return
  activeVacuumMode.value = modeId
  lastActiveVacuumMode.value = modeId
  if (modeId !== 'auto' || vacuumStatus.value === 'idle') {
    vacuumStatus.value = 'cleaning'
    startCleaningSimulation()
  }
}

const startCleaningSimulation = () => {
  vacuumProgress.value = 0
  const interval = setInterval(() => {
    if (vacuumProgress.value < 100 && vacuumStatus.value === 'cleaning') {
      vacuumProgress.value += Math.random() * 5
      if (vacuumProgress.value >= 100) {
        vacuumProgress.value = 100
        vacuumStatus.value = 'done'
        clearInterval(interval)
        setTimeout(() => {
          activeVacuumMode.value = null
          vacuumStatus.value = 'idle'
          vacuumProgress.value = 0
        }, 3000)
      }
    } else {
      clearInterval(interval)
    }
  }, 1000)
}

// Close record dialog
const closeRecordDialog = () => {
  showVacuumRecords.value = false
}
</script>

<style scoped>
@import '../styles/colors.css';

.vacuum-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 16px 18px;
}

.card-header { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 24px;}

.vacuum-card-info h3 { margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: var(--color-text-primary); }
.vacuum-card-info p { margin: 0; color: var(--color-text-secondary); font-size: 12px; }

.vacuum-status-section { margin-bottom: 24px; }
.vacuum-info { display: flex; flex-direction: column; gap: 20px; }

.status-display { display: flex; align-items: center; gap: 16px; }
.status-icon { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--color-button-dark); transition: all 0.3s ease; }
.status-icon svg { width: 24px; height: 24px; color: var(--color-text-secondary); }
.status-icon.idle { background: var(--color-button-dark); }
.status-icon.cleaning { background: var(--color-primary); color: var(--color-primary-text); animation: pulse 2s infinite; }
.status-icon.charging { background: var(--color-blue-500); }
.status-icon.error { background: var(--color-red-500); }
.status-icon.done { background: var(--color-emerald-500); animation: pulse 1s infinite; }

@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }

.status-text h4 { margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: var(--color-text-primary); }
.status-text p { margin: 0; font-size: 12px; color: var(--color-text-secondary); }

.cleaning-progress { display: flex; flex-direction: column; gap: 8px; }
.progress-label { font-size: 12px; color: var(--color-text-secondary); font-weight: 500; }
.progress-bar { width: 100%; height: 8px; background: var(--color-button-dark); border-radius: 4px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-blue-500) 100%); border-radius: 4px; transition: width 0.3s ease; }
.progress-text { font-size: 12px; color: var(--color-text-secondary); text-align: right; }

.vacuum-controls { display: flex; gap: 16px; margin-top: 24px; }

/* Record button */
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

/* Power switch (scoped to widget) */
.switch-label { font-size: 12px; color: var(--color-text-secondary); }
.switch-button { width: 32px; height: 20px; background: var(--color-switch-indicator); border: 1px solid var(--color-border); border-radius: 10px; position: relative; cursor: pointer; transition: all 0.3s ease; }
.switch-button.active { background: var(--color-primary); }
.switch-button::after { content: ''; position: absolute; top: 2px; width: 14px; height: 14px; background: var(--color-switch-indicator-active); border-radius: 50%; transition: all 0.3s ease; }
.switch-button.active::after { left: 16px; }

.power-switch {display: flex;align-items: center;gap: 8px;}

/* Mode buttons used inside this widget */
.mode-div { display: flex; flex-direction: column; align-items: center; gap: 12px; flex: 1; }
.mode-btn { padding: 10px 10px; background: var(--color-button-dark); border-radius: 10px; display: flex; align-items: center; justify-content: center; border: none; color: var(--color-white); cursor: pointer; transition: all 0.3s ease; }
.mode-btn:hover { background: var(--color-button-dark-hover); transform: translateY(-2px); }
.mode-btn.active { border: 1px solid var(--color-primary); color: var(--color-white); }
.mode-btn:disabled, .mode-btn.disabled { opacity: 0.5; cursor: not-allowed; }
.mode-btn svg { width: 24px; height: 24px; color: var(--color-text-secondary); }
.mode-btn.active svg { color: var(--color-primary); }
.mode-div span { font-size: 12px; font-weight: 500; color: var(--color-text-primary); text-align: center; }

/* Record dialog styles */
.record-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-shadow-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.record-dialog {
  background: var(--color-bg-secondary);
  border-radius: 16px;
  padding: 20px;
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px var(--shadow-soft);
  border: 1px solid var(--color-border);
}

.record-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.record-dialog-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--color-text-primary);
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--color-hover);
  color: var(--color-text-primary);
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.record-item:hover {
  background: var(--color-hover);
}

.record-date {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.record-date .date {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.record-date .time {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.record-details {
  display: flex;
  align-items: center;
  gap: 12px;
}

.record-details .mode {
  font-size: 12px;
  color: var(--color-text-primary);
  font-weight: 500;
}

.record-details .duration {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.record-details .status {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.record-details .status.完成 {
  background: var(--color-emerald-500);
  color: var(--color-white);
}
</style>



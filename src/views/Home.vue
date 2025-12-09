<template>
  <div class="home-page">
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧内容区域（设备列表） -->
      <div class="left-section">
        <div class="devices-content">
          <!-- 设备列表 -->
          <div 
            v-for="device in devices" 
            :key="device.id"
            class="device-wrapper"
          >
            <keep-alive>
              <component 
                :is="getDeviceComponent(device.cardName)"
                :device="device"
              />
            </keep-alive>
            <!-- 设备操作按钮组 -->
            <div class="device-actions">
              <!-- 修改设备名称按钮 -->
              <button 
                class="edit-name-btn"
                @click="openEditNameModal(device)"
                :title="'修改设备名称'"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
              </button>
              <!-- 解绑设备按钮 -->
              <button 
                class="unbind-btn"
                :class="{ disabled: !canUnbindDevice(device) }"
                @click="openUnbindModal(device)"
                :title="canUnbindDevice(device) ? '解绑设备' : '只能解绑自己绑定的设备'"
                :disabled="!canUnbindDevice(device)"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="right-section">
       <!-- 智能控制面板 -->
       <SmartControlPanel />
        <CheckinCalendar @checkin-success="handleCheckinSuccess" />
        <ColorControlPanel />
        <!-- <EnergyPanel /> -->
      </div>
    </div>

    <!-- 修改设备名称弹窗 -->
    <div v-if="showEditNameModal" class="device-modal" @click="closeEditNameModal">
      <div class="delete-modal-content" @click.stop>
        <div class="delete-modal-header">
          <h3>修改设备名称</h3>
          <button class="delete-close-btn" @click="closeEditNameModal">X</button>
        </div>
        <div class="delete-modal-body">
          <input 
            class="input" 
            v-model="editingDeviceName" 
            placeholder="请输入新的设备名称" 
            @keyup.enter="confirmEditName" 
            :disabled="isEditingName"
          />
        </div>
        <div class="delete-modal-footer">
          <button class="cancel-btn" @click="closeEditNameModal" :disabled="isEditingName">取消</button>
          <button class="action-btn success" @click="confirmEditName" :disabled="isEditingName || !editingDeviceName.trim()">
            {{ isEditingName ? '修改中...' : '确认' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 解绑设备确认弹窗 -->
    <div v-if="showUnbindModal" class="device-modal" @click="closeUnbindModal">
      <div class="delete-modal-content" @click.stop>
        <div class="delete-modal-header">
          <h3>解绑设备</h3>
          <button class="delete-close-btn" @click="closeUnbindModal">X</button>
        </div>
        <div class="delete-modal-body">
          <!-- 设备缩略图 -->
          <div v-if="unbindingDevice?.cardName" class="device-thumbnail-container">
            <img 
              :src="getThumbnailByCardName(unbindingDevice.cardName)" 
              :alt="unbindingDevice.name" 
              class="device-thumbnail-preview"
            />
          </div>
          <p>确定要解绑设备 <strong>{{ unbindingDevice?.name }}</strong> 吗？</p>
          <p class="warning-text">解绑后，您将无法控制此设备，需要重新绑定才能使用。</p>
        </div>
        <div class="delete-modal-footer">
          <button class="cancel-btn" @click="closeUnbindModal" :disabled="isUnbinding">取消</button>
          <button class="action-btn danger" @click="confirmUnbind" :disabled="isUnbinding">
            {{ isUnbinding ? '解绑中...' : '确认解绑' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGlobalStore } from '../stores/global'
import { getDeviceComponent } from '../utils/deviceComponents'
import { updateDeviceName, unbindDeviceBySN } from '../api/devices'
import { getPointsBalance } from '../api/points'
import CheckinCalendar from '../components/CheckinCalendar.vue'
import ColorControlPanel from '../components/ColorControlPanel.vue'
import EnergyPanel from '../components/EnergyPanel.vue'
import SmartControlPanel from '../components/SmartControlPanel.vue'
import { ElMessage } from 'element-plus'
import { useWebSocketManager } from '../composables/useWebSocketManager'
import { getThumbnailByCardName } from '../utils/deviceMapping'

// 全局状态
const globalStore = useGlobalStore()

// WebSocket 管理器
const { deviceManager } = useWebSocketManager()


// 设备列表（从 globalStore 加载）
const devices = computed(() => {
  const allDevices = globalStore.devices || []
  // 只显示有 cardName 的设备，按设备ID排序
  return allDevices
    .filter(device => device.cardName)
    .sort((a, b) => a.id - b.id)
})

// 修改设备名称相关状态
const showEditNameModal = ref(false)
const editingDevice = ref(null)
const editingDeviceName = ref('')

// 解绑设备相关状态
const showUnbindModal = ref(false)
const unbindingDevice = ref(null)
const isUnbinding = ref(false)

// 检查是否可以解绑设备（只有设备绑定的 account_id 是当前用户 ID 时才能解绑）
const canUnbindDevice = (device) => {
  const currentUserId = globalStore.user?.account?.id
  if (!currentUserId) {
    return false
  }
  // 如果设备的 account_id 为 null，表示是个人设备，可以解绑
  // 如果设备的 account_id 等于当前用户 ID，可以解绑
  return device.account_id === null || device.account_id === currentUserId
}

// 积分相关方法
const loadUserPoints = async () => {
  try {
    const response = await getPointsBalance()
    // 更新全局状态中的积分
    globalStore.userPoints = response.available_balance || 0
  } catch (error) {
    console.error('获取积分余额失败:', error)
  }
}

// 处理签到成功
const handleCheckinSuccess = (response) => {
  ElMessage.success('签到成功，获得积分:' + response.points_earned)
  // 刷新积分显示
  loadUserPoints()
}
const isEditingName = ref(false)


// =========================
// 修改设备名称相关方法
// =========================
const openEditNameModal = (device) => {
  editingDevice.value = device
  editingDeviceName.value = device.name
  showEditNameModal.value = true
}

const closeEditNameModal = () => {
  showEditNameModal.value = false
  editingDevice.value = null
  editingDeviceName.value = ''
  isEditingName.value = false
}

const confirmEditName = async () => {
  if (!editingDevice.value || !editingDeviceName.value.trim()) {
    return
  }

  isEditingName.value = true
  
  try {
    const currentFamilyId = globalStore.user?.account?.current_family_id
    await updateDeviceName(editingDevice.value.id, editingDeviceName.value.trim(), currentFamilyId)
    closeEditNameModal()
  } catch (error) {
    console.error('修改设备名称失败:', error)
  } finally {
    isEditingName.value = false
  }
}

// =========================
// 解绑设备相关方法
// =========================
const openUnbindModal = (device) => {
  // 检查是否可以解绑
  if (!canUnbindDevice(device)) {
    ElMessage.warning('只能解绑自己绑定的设备')
    return
  }
  unbindingDevice.value = device
  showUnbindModal.value = true
}

const closeUnbindModal = () => {
  showUnbindModal.value = false
  unbindingDevice.value = null
  isUnbinding.value = false
}

const confirmUnbind = async () => {
  if (!unbindingDevice.value || !unbindingDevice.value.sn) {
    return
  }

  isUnbinding.value = true
  
  try {
    // 调用解绑设备 API
    await unbindDeviceBySN(unbindingDevice.value.sn)
    
    // 取消订阅设备事件
    if (deviceManager && unbindingDevice.value.sn) {
      try {
        await deviceManager.unsubscribeDeviceEvents(unbindingDevice.value.sn)
        console.log(`已取消订阅设备 ${unbindingDevice.value.sn} 的事件`)
      } catch (error) {
        console.warn(`取消订阅设备 ${unbindingDevice.value.sn} 事件失败:`, error)
        // 即使取消订阅失败，也继续执行解绑流程
      }
    }
    
    // 重新加载设备列表
    await globalStore.loadDevices()
    
    closeUnbindModal()
    ElMessage.success('设备解绑成功')
  } catch (error) {
    console.error('解绑设备失败:', error)
    ElMessage.error('解绑设备失败')
  } finally {
    isUnbinding.value = false
  }
}

</script>

<style scoped>
@import '../styles/colors.css';

/* =========================
   Page layout
   ========================= */
.home-page {
  width: 100%;
  padding: 8px 24px;
  overflow: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.home-page::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}


/* =========================
   Main content grid
   ========================= */
.main-content {
  display: grid;
  grid-template-columns: 5fr 2fr;
  gap: 16px;
  align-items: start;
}

@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .right-section {
    order: -1;
  }
}

/* =========================
   Left section container
   ========================= */
.left-section {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.left-section::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

/* =========================
   Right section container
   ========================= */
.right-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-self: start;
}


.cards-row {
  display: flex;
  gap: 12px;
  width: 100%;
}

.cards-row > * {
  flex: 1;
}

.music-row {
  display: flex;
  gap: 12px;
  width: 100%;
}

.music-row > * {
  flex: 1;
}

.calendar-row {
  display: flex;
  gap: 12px;
  width: 100%;
}

.calendar-row > * {
  flex: 1;
}


.devices-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 两列 */
  gap: 16px;
}

/* 设备包装器样式 */
.device-wrapper {
  position: relative;
  transition: all 0.3s ease;
}

/* 设备操作按钮组 */
.device-actions {
  position: absolute;
  top: 4px;
  right: 8px;
  display: flex;
  gap: 4px;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.device-wrapper:hover .device-actions {
  opacity: 1;
}

/* 修改设备名称按钮 */
.edit-name-btn {
  width: 24px;
  height: 24px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.edit-name-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-primary-text);
}

.edit-name-btn svg {
  width: 12px;
  height: 12px;
  color: var(--color-text-secondary);
}

.edit-name-btn:hover svg {
  color: var(--color-primary-text);
}

/* 解绑设备按钮 */
.unbind-btn {
  width: 24px;
  height: 24px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.unbind-btn:hover {
  background: var(--color-danger);
  border-color: var(--color-danger);
  color: white;
}

.unbind-btn svg {
  width: 12px;
  height: 12px;
  color: var(--color-text-secondary);
}

.unbind-btn:hover svg {
  color: white;
}

.unbind-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.unbind-btn.disabled:hover {
  background: var(--color-bg-card);
  border-color: var(--color-border);
  color: var(--color-text-secondary);
}

.unbind-btn.disabled:hover svg {
  color: var(--color-text-secondary);
}


/* 修改设备名称弹窗样式 */
.device-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-modal-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.delete-modal-content {
  background: var(--color-bg-card);
  border-radius: 12px;
  padding: 24px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: var(--color-modal-shadow);
}

.delete-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.delete-modal-header h3 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 18px;
  font-weight: 600;
}

.delete-close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--color-text-secondary);
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.delete-close-btn:hover {
  background: var(--color-hover);
  color: var(--color-text-primary);
}

.delete-modal-body {
  margin-bottom: 20px;
}

.delete-modal-body .input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  font-size: 14px;
  transition: all 0.2s ease;
}

.delete-modal-body .input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(191, 254, 1, 0.2);
}

.delete-modal-body .input:disabled {
  background: var(--color-disabled-bg);
  color: var(--color-disabled-text);
  cursor: not-allowed;
}

.delete-modal-body p {
  margin: 0 0 12px 0;
  color: var(--color-text-secondary);
  line-height: 1.6;
  font-size: 14px;
}

.delete-modal-body .warning-text {
  color: var(--color-danger) !important;
  font-weight: 500;
  font-size: 14px;
  margin-top: 12px;
}

/* 设备缩略图容器 */
.device-thumbnail-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: var(--color-bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.device-thumbnail-preview {
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  max-height: 520px;
}

.delete-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--color-border);
}

.cancel-btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover:not(:disabled) {
  background: var(--color-hover);
  color: var(--color-text-primary);
}

.cancel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn {
  padding: 10px 20px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.action-btn.success {
  background: var(--color-primary);
  color: var(--color-bg-primary);
  border-color: var(--color-primary);
}

.action-btn.success:hover:not(:disabled) {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.action-btn.danger {
  background: var(--color-danger);
  color: white;
  border-color: var(--color-danger);
}

.action-btn.danger:hover:not(:disabled) {
  background: var(--color-danger-dark);
  border-color: var(--color-danger-dark);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}






/* =========================
   Devices list
   ========================= */
.devices-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
}


</style>

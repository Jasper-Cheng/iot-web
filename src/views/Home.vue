<template>
  <div class="home-page">
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧内容区域（房间导航 + 空调控制） -->
      <div class="left-section">
        <!-- 房间导航栏 -->
        <div class="room-navigation">
          <button 
            v-for="room in rooms" 
            :key="room.id"
            :class="['room-btn', { active: room.id === activeRoom }]"
            @click="setActiveRoom(room.id)"
          >
            {{ room.name }}
          </button>
        </div>

        <div class="room-content">
          <!-- 动态渲染设备卡片 -->
          <component 
            v-for="device in filteredDevices" 
            :key="device.id"
            :is="getDeviceComponent(device.cardName)"
            :device="device"
          />
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="right-section">
        <!-- 固定组件 -->
        <div class="cards-row">
          <WiFiCard />
          <TvCard />
        </div>
        <div class="music-row">
          <MusicCard />
          <SocketsCard />
        </div>
        <!-- 智能控制面板 -->
        <SmartControlPanel />
        <ColorControlCard />
        <EnergyCard />
        <DeviceStatsCard :rooms="roomsWithDevices" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGlobalStore } from '../stores/global'
import { getDeviceComponent } from '../utils/deviceComponents'
import WiFiCard from '../cards/WiFiCard.vue'
import TvCard from '../cards/TvCard.vue'
import MusicCard from '../cards/MusicCard.vue'
import SocketsCard from '../cards/SocketsCard.vue'
import ColorControlCard from '../cards/ColorControlCard.vue'
import EnergyCard from '../cards/EnergyCard.vue'
import DeviceStatsCard from '../cards/DeviceStatsCard.vue'
import SmartControlPanel from '../components/SmartControlPanel.vue'

// 全局状态
const globalStore = useGlobalStore()

// =========================
// Room navigation data/state
// - rooms: includes an 'all' option for the navigation only
// - activeRoom: current nav selection (defaults to 'all')
// =========================
const rooms = computed(() => {
  const allRooms = globalStore.rooms || []
  return [
    { id: 'all', name: 'All' },
    ...allRooms.map(room => ({
      id: room.id,
      name: room.name
    }))
  ]
})

// 当前选中的房间
const activeRoom = ref('all')

// 过滤后的设备列表
const filteredDevices = computed(() => {
  const allDevices = globalStore.devices || []
  
  if (activeRoom.value === 'all') {
    // 显示所有设备
    return allDevices.filter(device => device.cardName)
  } else {
    // 显示选中房间的设备
    const selectedRoom = globalStore.rooms?.find(room => room.id === activeRoom.value)
    
    if (!selectedRoom) {
      return []
    }
    
    const roomDeviceIds = selectedRoom.devices?.map(rd => rd.device_id) || []
    
    return allDevices.filter(device => 
      roomDeviceIds.includes(device.id) && device.cardName
    )
  }
})

// 房间设备统计数据
const roomsWithDevices = computed(() => {
  const allRooms = globalStore.rooms || []
  return allRooms.map(room => {
    const roomDevices = room.devices || []
    const total = roomDevices.length
    const online = roomDevices.filter(device => device.status === 'online').length
    const offline = total - online
    
    return {
      id: room.id,
      name: room.name,
      devices: { total, online, offline },
      color: `var(--room-${room.id})`
    }
  })
})

// =========================
// Navigation / Mode handlers
// =========================
const setActiveRoom = (roomId) => {
  activeRoom.value = roomId
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
   Room navigation bar
   ========================= */
.room-navigation {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.room-btn {
  flex-direction: column;
  align-items: center;
  padding:10px 12px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--color-text-secondary);
  text-align: center;
  background-color: var(--color-nav-idle);
  border: 1px solid var(--color-border);
  font-size: 13px;
  font-weight: 600;
}

.room-btn:hover {
  background-color: var(--color-hover);
  color: var(--color-primary);
}

.room-btn.active {
  background-color: var(--color-active);
  color: var(--color-primary);
}

/* removed add-room button */

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


.room-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 两列 */
  gap: 16px;
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

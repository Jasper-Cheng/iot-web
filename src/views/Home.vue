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
          <!-- 空调控制卡片 -->
          <AirCoolerCard />

          <!-- 智能设备列表 -->
          <div class="devices-list">
            <SmartLightCard />
            <SmartTvCard />
            <FallDetectionCard />
            <SmartSocketCard />
          </div>
          
          <!-- 摄像头模块 -->
          <CameraCard :rooms="rooms" :activeRoom="activeRoom" />

          <!-- 扫地机器人控制面板 -->
          <VacuumCard />

          <!-- 洗衣机控制面板 -->
          <WashingMachineCard />
          
          <!-- 冰箱控制面板 -->
          <RefrigeratorCard />
           
          <!-- 音响控制面板 -->
          <SpeakerCard />
           
          <!-- 空气净化器模块 -->
          <AirPurifierCard />
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="right-section">
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
import AirCoolerCard from '../widgets/AirCoolerCard.vue'
import CameraCard from '../widgets/CameraCard.vue'
import VacuumCard from '../widgets/VacuumCard.vue'
import WashingMachineCard from '../widgets/WashingMachineCard.vue'
import RefrigeratorCard from '../widgets/RefrigeratorCard.vue'
import SpeakerCard from '../widgets/SpeakerCard.vue'
import AirPurifierCard from '../widgets/AirPurifierCard.vue'
import SmartLightCard from '../widgets/SmartLightCard.vue'
import SmartTvCard from '../widgets/SmartTvCard.vue'
import FallDetectionCard from '../widgets/FallDetectionCard.vue'
import SmartSocketCard from '../widgets/SmartSocketCard.vue'
import WiFiCard from '../widgets/WiFiCard.vue'
import TvCard from '../widgets/TvCard.vue'
import MusicCard from '../widgets/MusicCard.vue'
import SocketsCard from '../widgets/SocketsCard.vue'
import ColorControlCard from '../widgets/ColorControlCard.vue'
import EnergyCard from '../widgets/EnergyCard.vue'
import DeviceStatsCard from '../widgets/DeviceStatsCard.vue'
import SmartControlPanel from '../widgets/SmartControlPanel.vue'

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

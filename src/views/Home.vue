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
          <button class="add-room-btn">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            Add Room
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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

// =========================
// Room navigation data/state
// - rooms: includes an 'all' option for the navigation only
// - activeRoom: current nav selection (defaults to 'all')
// =========================
const rooms = ref([
  { id: 'all', name: 'All' },
  { id: 'living', name: 'Living Room' },
  { id: 'dining', name: 'Dining Room' },
  { id: 'bedroom', name: 'Bed Room' },
  { id: 'bathroom', name: 'Bath Room' },
  { id: 'backyard', name: 'Backyard' }
])

// 当前选中的房间
const activeRoom = ref('all')

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
  font-size: 12px;
  font-weight: 500;
}

.room-btn:hover {
  background-color: var(--color-hover);
  color: var(--color-primary);
}

.room-btn.active {
  background-color: var(--color-active);
  color: var(--color-primary);
}

.add-room-btn {
  margin-left: auto;
  padding: 0px 18px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-room-btn:hover {
  background: var(--color-bg-card);
}

.add-room-btn svg {
  width: 16px;
  height: 16px;
}

/* =========================
   Main content grid
   ========================= */
.main-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 16px;
  align-items: start;
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
  gap: 24px;
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

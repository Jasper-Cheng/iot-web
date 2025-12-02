// 设备卡片组件注册表
import AirCoolerCard from '../cards/AirCoolerCard.vue'
import AirPurifierCard from '../cards/AirPurifierCard.vue'
import CameraCard from '../cards/CameraCard.vue'
import ColorControlPanel from '../components/ColorControlPanel.vue'
import DeviceStatsPanel from '../components/DeviceStatsPanel.vue'
import EnergyPanel from '../components/EnergyPanel.vue'
import EnvironmentMonitorCard from '../cards/EnvironmentMonitorCard.vue'
import FallDetectionCard from '../cards/FallDetectionCard.vue'
import MusicCard from '../cards/MusicCard.vue'
import RefrigeratorCard from '../cards/RefrigeratorCard.vue'
import SmartControlPanel from '../components/SmartControlPanel.vue'
import SmartLightCard from '../cards/SmartLightCard.vue'
import SmartSocketCard from '../cards/SmartSocketCard.vue'
import SmartTvCard from '../cards/SmartTvCard.vue'
import SocketsCard from '../cards/SocketsCard.vue'
import SpeakerCard from '../cards/SpeakerCard.vue'
import TvCard from '../cards/TvCard.vue'
import VacuumCard from '../cards/VacuumCard.vue'
import WashingMachineCard from '../cards/WashingMachineCard.vue'
import WiFiCard from '../cards/WiFiCard.vue'

// 设备卡片组件映射表
export const DEVICE_COMPONENTS = {
  AirCoolerCard,
  AirPurifierCard,
  CameraCard,
  DeviceStatsPanel,
  EnergyPanel,
  EnvironmentMonitorCard,
  FallDetectionCard,
  MusicCard,
  RefrigeratorCard,
  SmartControlPanel,
  SmartLightCard,
  SmartSocketCard,
  SmartTvCard,
  SocketsCard,
  SpeakerCard,
  TvCard,
  VacuumCard,
  WashingMachineCard,
  WiFiCard
}

// 根据卡片名获取组件
export function getDeviceComponent(cardName) {
  return DEVICE_COMPONENTS[cardName] || null
}

// 获取所有可用的设备组件
export function getAllDeviceComponents() {
  return DEVICE_COMPONENTS
}

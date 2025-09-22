// 设备卡片组件注册表
import AirCoolerCard from '../widgets/AirCoolerCard.vue'
import AirPurifierCard from '../widgets/AirPurifierCard.vue'
import CameraCard from '../widgets/CameraCard.vue'
import ColorControlCard from '../widgets/ColorControlCard.vue'
import DeviceStatsCard from '../widgets/DeviceStatsCard.vue'
import EnergyCard from '../widgets/EnergyCard.vue'
import FallDetectionCard from '../widgets/FallDetectionCard.vue'
import MusicCard from '../widgets/MusicCard.vue'
import RefrigeratorCard from '../widgets/RefrigeratorCard.vue'
import SmartControlPanel from '../widgets/SmartControlPanel.vue'
import SmartLightCard from '../widgets/SmartLightCard.vue'
import SmartSocketCard from '../widgets/SmartSocketCard.vue'
import SmartTvCard from '../widgets/SmartTvCard.vue'
import SocketsCard from '../widgets/SocketsCard.vue'
import SpeakerCard from '../widgets/SpeakerCard.vue'
import TvCard from '../widgets/TvCard.vue'
import VacuumCard from '../widgets/VacuumCard.vue'
import WashingMachineCard from '../widgets/WashingMachineCard.vue'
import WiFiCard from '../widgets/WiFiCard.vue'

// 设备卡片组件映射表
export const DEVICE_COMPONENTS = {
  AirCoolerCard,
  AirPurifierCard,
  CameraCard,
  ColorControlCard,
  DeviceStatsCard,
  EnergyCard,
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

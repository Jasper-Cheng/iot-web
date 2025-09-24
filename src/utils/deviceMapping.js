// 设备SN映射表
// SN格式：AC001(模型code)-250922(生产日期)-000123(唯一流水号)
// 将模型code映射到对应的设备卡片组件

export const DEVICE_SN_MAPPING = {
  // 空调
  'AC001': 'AirCoolerCard',     // 空调
  'AC002': 'AirCoolerCard',     // 空调
  'AC003': 'AirCoolerCard',     // 空调
  
  // 摄像头
  'CAM001': 'CameraCard',       // 摄像头
  'CAM002': 'CameraCard',       // 摄像头
  'CAM003': 'CameraCard',       // 摄像头
  
  // 灯具
  'LIGHT001': 'SmartLightCard', // 灯泡
  'LIGHT002': 'SmartLightCard', // 灯带
  'LIGHT003': 'SmartLightCard', // 吸顶灯
  
  // 电视
  'TV001': 'SmartTvCard',       // 电视
  'TV002': 'SmartTvCard',       // 电视
  'TV003': 'SmartTvCard',       // 电视
  
  // 跌倒检测器
  'FALL001': 'FallDetectionCard', // 跌倒检测器
  'FALL002': 'FallDetectionCard', // 跌倒检测器
  'FALL003': 'FallDetectionCard', // 跌倒检测器
  
  // 路由器
  'WIFI001': 'WiFiCard',        // 路由器
  'WIFI002': 'WiFiCard',        // 路由器
  'WIFI003': 'WiFiCard',        // 路由器
  
  // 扫地机器人
  'ROBOT001': 'VacuumCard',     // 扫地机器人
  'ROBOT002': 'VacuumCard',     // 扫地机器人
  'ROBOT003': 'VacuumCard',     // 扫地机器人
  
  // 洗衣机
  'WASH001': 'WashingMachineCard', // 洗衣机
  'WASH002': 'WashingMachineCard', // 洗衣机
  'WASH003': 'WashingMachineCard', // 洗衣机
  
  // 冰箱
  'FRIDGE001': 'RefrigeratorCard', // 冰箱
  'FRIDGE002': 'RefrigeratorCard', // 冰箱
  'FRIDGE003': 'RefrigeratorCard', // 冰箱
  
  // 音箱
  'SPEAKER001': 'SpeakerCard',  // 音箱
  'SPEAKER002': 'SpeakerCard',  // 音箱
  'SPEAKER003': 'SpeakerCard',  // 音箱
  
  // 空气净化器
  'AIR001': 'AirPurifierCard',  // 空气净化器
  'AIR002': 'AirPurifierCard',  // 空气净化器
  'AIR003': 'AirPurifierCard',  // 空气净化器
  
  // 没有模型code的组件（设为null）
  'MusicCard': null,            // 音乐播放器
  'SmartSocketCard': null,      // 智能插座
  'SocketsCard': null,          // 插座组
  'TvCard': null,               // 电视
}

// 设备缩略图映射表
export const DEVICE_THUMBNAIL_MAPPING = {
  'AirCoolerCard': '/thumbnails/devices/air_cooler.png',
  'CameraCard': '/thumbnails/devices/camera.png',
  'SmartLightCard': '/thumbnails/devices/smart_light.png',
  'SmartTvCard': '/thumbnails/devices/smart_tv.png',
  'FallDetectionCard': '/thumbnails/devices/fall_detection.png',
  'WiFiCard': '/thumbnails/devices/smart_socket.png', // 使用智能插座图标
  'VacuumCard': '/thumbnails/devices/smart_vacuum.png',
  'WashingMachineCard': '/thumbnails/devices/washing_machine.png',
  'RefrigeratorCard': '/thumbnails/devices/refrigerator.png',
  'SpeakerCard': '/thumbnails/devices/smart_speaker.png',
  'AirPurifierCard': '/thumbnails/devices/air_purifier.png',
  'SmartSocketCard': '/thumbnails/devices/smart_socket.png',
}

// 根据SN获取设备卡片组件名
export function getDeviceCardBySN(sn) {
  if (!sn || typeof sn !== 'string') {
    return null
  }
  
  // 提取SN中的模型code（第一部分）
  const parts = sn.split('-')
  if (parts.length < 1) {
    return null
  }
  
  const modelCode = parts[0]
  return DEVICE_SN_MAPPING[modelCode] || null
}

// 获取所有支持的模型code
export function getSupportedModelCodes() {
  return Object.keys(DEVICE_SN_MAPPING).filter(key => DEVICE_SN_MAPPING[key] !== null)
}

// 获取所有可用的设备卡片组件名
export function getAllDeviceComponentNames() {
  return Object.keys(DEVICE_SN_MAPPING)
}

// 检查组件是否存在
export function isComponentAvailable(componentName) {
  return DEVICE_SN_MAPPING.hasOwnProperty(componentName)
}

// 根据卡片组件名获取缩略图
export function getThumbnailByCardName(cardName) {
  return DEVICE_THUMBNAIL_MAPPING[cardName] || '/thumbnails/devices/smart_light.png'
}

// 设备图标映射（cardName -> SVG 图标）
export const DEVICE_ICON_MAPPING = {
  'AirCoolerCard': `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2a7 7 0 0 0-7 7c0 3 2 5 4 6v3h6v-3c2-1 4-3 4-6a7 7 0 0 0-7-7z" stroke="#666" stroke-width="1" fill="none"/>
      <path d="M12 8v8" stroke="#666" stroke-width="1"/>
      <path d="M8 12h8" stroke="#666" stroke-width="1"/>
    </svg>
  `,
  'AirPurifierCard': `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="#666" stroke-width="1"/>
      <path d="M12 2a7 7 0 0 0-7 7c0 3 2 5 4 6v3h6v-3c2-1 4-3 4-6a7 7 0 0 0-7-7z" stroke="#666" stroke-width="1" fill="none"/>
    </svg>
  `,
  'CameraCard': `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="#666" stroke-width="1" fill="none"/>
      <circle cx="12" cy="13" r="4" stroke="#666" stroke-width="1" fill="none"/>
    </svg>
  `,
  'FallDetectionCard': `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#666" stroke-width="1" fill="none"/>
      <circle cx="12" cy="12" r="3" stroke="#666" stroke-width="1" fill="none"/>
    </svg>
  `,
  'RefrigeratorCard': `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" stroke="#666" stroke-width="1" fill="none"/>
      <line x1="4" y1="8" x2="20" y2="8" stroke="#666" stroke-width="1"/>
      <line x1="4" y1="14" x2="20" y2="14" stroke="#666" stroke-width="1"/>
    </svg>
  `,
  'SmartLightCard': `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1z" stroke="#666" stroke-width="1" fill="none"/>
      <path d="M12 2C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" stroke="#666" stroke-width="1" fill="none"/>
    </svg>
  `,
  'SmartSocketCard': `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="#666" stroke-width="1" fill="none"/>
      <circle cx="8" cy="10" r="2" stroke="#666" stroke-width="1" fill="none"/>
      <circle cx="16" cy="10" r="2" stroke="#666" stroke-width="1" fill="none"/>
    </svg>
  `,
  'SmartSpeakerCard': `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="#666" stroke-width="1" fill="none"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke="#666" stroke-width="1" fill="none"/>
    </svg>
  `,
  'SmartTvCard': `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="#666" stroke-width="1" fill="none"/>
      <line x1="8" y1="21" x2="16" y2="21" stroke="#666" stroke-width="1"/>
      <line x1="12" y1="17" x2="12" y2="21" stroke="#666" stroke-width="1"/>
    </svg>
  `,
  'SmartVacuumCard': `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" stroke="#666" stroke-width="1" fill="none"/>
      <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="#666" stroke-width="1" fill="none"/>
    </svg>
  `,
  'WashingMachineCard': `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" stroke="#666" stroke-width="1" fill="none"/>
      <circle cx="12" cy="12" r="4" stroke="#666" stroke-width="1" fill="none"/>
      <path d="M8 6h8" stroke="#666" stroke-width="1"/>
    </svg>
  `,
  'WiFiCard': `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" stroke="#666" stroke-width="1" fill="none"/>
      <path d="M1.42 9a16 16 0 0 1 21.16 0" stroke="#666" stroke-width="1" fill="none"/>
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" stroke="#666" stroke-width="1" fill="none"/>
      <circle cx="12" cy="20" r="1" fill="#666"/>
    </svg>
  `,
  'TvCard': `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="#666" stroke-width="1" fill="none"/>
      <line x1="8" y1="21" x2="16" y2="21" stroke="#666" stroke-width="1"/>
      <line x1="12" y1="17" x2="12" y2="21" stroke="#666" stroke-width="1"/>
    </svg>
  `,
  'SpeakerCard': `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="#666" stroke-width="1" fill="none"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke="#666" stroke-width="1" fill="none"/>
    </svg>
  `,
  'SocketsCard': `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="#666" stroke-width="1" fill="none"/>
      <circle cx="8" cy="10" r="2" stroke="#666" stroke-width="1" fill="none"/>
      <circle cx="16" cy="10" r="2" stroke="#666" stroke-width="1" fill="none"/>
    </svg>
  `,
  'MusicCard': `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18V5l12-2v13" stroke="#666" stroke-width="1" fill="none"/>
      <circle cx="6" cy="18" r="3" stroke="#666" stroke-width="1" fill="none"/>
      <circle cx="18" cy="16" r="3" stroke="#666" stroke-width="1" fill="none"/>
    </svg>
  `,
  'SmartControlPanel': `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="#666" stroke-width="1" fill="none"/>
      <circle cx="8.5" cy="8.5" r="1.5" stroke="#666" stroke-width="1" fill="none"/>
      <path d="M21 15l-5-5L5 21" stroke="#666" stroke-width="1" fill="none"/>
    </svg>
  `
}

// 根据 cardName 获取对应的 SVG 图标
export function getIconByCardName(cardName) {
  return DEVICE_ICON_MAPPING[cardName] || `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="#666" stroke-width="1" fill="none"/>
      <circle cx="8.5" cy="8.5" r="1.5" stroke="#666" stroke-width="1" fill="none"/>
      <path d="M21 15l-5-5L5 21" stroke="#666" stroke-width="1" fill="none"/>
    </svg>
  `
}

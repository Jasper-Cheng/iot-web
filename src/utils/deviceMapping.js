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

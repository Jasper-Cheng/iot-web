// 设备渲染工具
import { getDeviceCardBySN } from './deviceMapping'
import { getDeviceComponent } from './deviceComponents'

// 渲染设备卡片
export function renderDeviceCard(device, props = {}) {
  if (!device || !device.sn) {
    return null
  }
  
  const cardName = getDeviceCardBySN(device.sn)
  if (!cardName) {
    console.warn(`未找到设备SN ${device.sn} 对应的卡片组件`)
    return null
  }
  
  const component = getDeviceComponent(cardName)
  if (!component) {
    console.warn(`未找到卡片组件 ${cardName}`)
    return null
  }
  
  return {
    component,
    props: {
      device,
      ...props
    }
  }
}

// 批量渲染设备卡片
export function renderDeviceCards(devices, props = {}) {
  return devices
    .map(device => renderDeviceCard(device, props))
    .filter(Boolean) // 过滤掉null值
}

// 获取设备统计信息
export function getDeviceStats(devices) {
  const stats = {
    total: devices.length,
    byModelCode: {}
  }
  
  devices.forEach(device => {
    // 按模型code统计
    const modelCode = device.modelCode || 'unknown'
    stats.byModelCode[modelCode] = (stats.byModelCode[modelCode] || 0) + 1
  })
  
  return stats
}

// 过滤设备
export function filterDevices(devices, filters = {}) {
  return devices.filter(device => {
    // 按模型code过滤
    if (filters.modelCode && device.modelCode !== filters.modelCode) {
      return false
    }
    
    // 按状态过滤
    if (filters.status && device.status !== filters.status) {
      return false
    }
    
    return true
  })
}

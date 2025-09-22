import request from '../utils/request'

// 模拟设备数据，用于演示3D模型功能
const mockDevices = [
  {
    id: 1,
    device_id: 'fan_001',
    name: '智能风扇',
    device_type: 'electric_fan',
    status: 'online',
    fan_speed: 3,
    oscillation: true,
    temperature: 25,
    location: '客厅'
  }
]

export const fetchDeviceStatuses = (user_id) => {
  return request({
    url: '/devices/',
    method: 'get',
    params: {
      user_id: user_id.user_id
    }
  })
}

export const addDevice = (data) => request.post('/devices/', data)
export const updateDevice = (id, data) => request.put(`/devices/${id}`, data)
export const deleteDevice = (id) => request.delete(`/devices/${id}`)
export const getDeviceStatus = (id) => request.get(`/devices/${id}/status`)

// 新增：更新设备状态
export const updateDeviceStatus = (deviceId, statusData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const device = mockDevices.find(d => d.device_id === deviceId)
      if (device) {
        Object.assign(device, statusData)
        resolve({ success: true, data: device })
      } else {
        resolve({ success: false, message: '设备不存在' })
      }
    }, 300)
  })
}
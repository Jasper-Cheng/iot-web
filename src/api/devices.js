import request from '../utils/request'
export const getDevices = () => request.get('/v1/devices')
export const addDevice = (data) => request.post('/v1/devices', data)
export const updateDevice = (id, data) => request.put(`/v1/devices/${id}`, data)
export const deleteDevice = (id) => request.delete(`/v1/devices/${id}`)
export const getDeviceStatus = (id) => request.get(`/v1/devices/${id}/status`)
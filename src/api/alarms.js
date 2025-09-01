import request from '../utils/request'
export const getAlarms = () => request.get('/v1/alarms')
export const resolveAlarm = (id) => request.post(`/v1/alarms/${id}/resolve`)
export const addAlarm = (data) => request.post('/v1/alarms', data)
export const updateAlarm = (id, data) => request.put(`/v1/alarms/${id}`, data)
export const deleteAlarm = (id) => request.delete(`/v1/alarms/${id}`)
export const getAlarmHistory = (params) => request.get('/v1/alarms/history', { params })
export const getAlarmStats = () => request.get('/v1/alarms/stats')
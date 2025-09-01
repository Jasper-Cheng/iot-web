import request from '../utils/request'
export const getAlarms = () => request.get('/alarms')
export const resolveAlarm = (id) => request.post(`/alarms/${id}/resolve`)
export const addAlarm = (data) => request.post('/alarms', data)
export const updateAlarm = (id, data) => request.put(`/alarms/${id}`, data)
export const deleteAlarm = (id) => request.delete(`/alarms/${id}`)
export const getAlarmHistory = (params) => request.get('/alarms/history', { params })
export const getAlarmStats = () => request.get('/alarms/stats')
import request from '../utils/request'
export const getUsers = () => request.get('/users')
export const addUser = (data) => request.post('/users', data)
export const updateUser = (id, data) => request.put(`/users/${id}`, data)
export const deleteUser = (id) => request.delete(`/users/${id}`)
export const getUserProfile = (id) => request.get(`/users/${id}/profile`)
export const updateUserProfile = (id, data) => request.put(`/users/${id}/profile`, data)
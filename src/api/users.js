import request from '../utils/request'
export const getUsers = () => request.get('/v1/users')
export const addUser = (data) => request.post('/v1/users', data)
export const updateUser = (id, data) => request.put(`/v1/users/${id}`, data)
export const deleteUser = (id) => request.delete(`/v1/users/${id}`)
export const getUserProfile = (id) => request.get(`/v1/users/${id}/profile`)
export const updateUserProfile = (id, data) => request.put(`/v1/users/${id}/profile`, data)
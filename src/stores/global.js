import { defineStore } from 'pinia'
import { fetchDeviceStatuses } from '../api/devices'
import { getFamilyMembers, getUserProfile } from '../api/users'
import { getRooms, getRoomDevices } from '../api/rooms'

export const useGlobalStore = defineStore('global', {
	state: () => ({
		// 用户认证状态
		isAuthenticated: false,
		user: null,
		token: null,
		// 设备数据
		devices: [], // from devices API: detailed runtime status
		members: [],
		profile: null,
		rooms: [], // derived from device location for now
		loading: {
			devices: false,
			members: false,
			profile: false,
			rooms: false,
			auth: false
		},
		errors: {
			devices: null,
			members: null,
			profile: null,
			rooms: null,
			auth: null
		}
	}),
	actions: {
		async loadDevices(userId) {
			this.loading.devices = true
			this.errors.devices = null
			try {
				const res = await fetchDeviceStatuses({ user_id: userId })
				
				// API直接返回设备数组，request.js已经提取了response.data
				this.devices = Array.isArray(res) ? res : []
				console.log('设备列表加载成功:', this.devices)
			} catch (err) {
				this.errors.devices = err
				console.error('设备列表加载失败:', err)
			} finally {
				this.loading.devices = false
			}
		},
		async loadRooms(userId) {
			this.loading.rooms = true
			this.errors.rooms = null
			try {
				const res = await getRooms({ user_id: userId })
				
				// API直接返回房间数组，request.js已经提取了response.data
				const rooms = Array.isArray(res) ? res : []
				
				// 为每个房间加载设备
				const roomsWithDevices = await Promise.all(
					rooms.map(async (room) => {
						try {
							const roomDevicesRes = await getRoomDevices(room.id)
							const roomDevices = Array.isArray(roomDevicesRes) ? roomDevicesRes : []
							return {
								...room,
								devices: roomDevices
							}
						} catch (deviceErr) {
							console.error(`房间 ${room.id} 设备加载失败:`, deviceErr)
							return {
								...room,
								devices: []
							}
						}
					})
				)
				
				this.rooms = roomsWithDevices
				console.log('房间列表加载成功:', this.rooms)
			} catch (err) {
				this.errors.rooms = err
				console.error('房间列表加载失败:', err)
			} finally {
				this.loading.rooms = false
			}
		},
		async loadMembers() {
			this.loading.members = true
			this.errors.members = null
			try {
				const res = await getFamilyMembers()
				this.members = res?.data || []
			} catch (err) {
				this.errors.members = err
			} finally {
				this.loading.members = false
			}
		},
		async loadProfile(userId = 1) {
			this.loading.profile = true
			this.errors.profile = null
			try {
				const res = await getUserProfile(userId)
				this.profile = res?.data || null
			} catch (err) {
				this.errors.profile = err
			} finally {
				this.loading.profile = false
			}
		},
		async loadAll(userId = 1) {
			await Promise.all([
				this.loadDevices(userId),
				this.loadRooms(userId),
				this.loadMembers(),
				this.loadProfile(userId)
			])
		},
		// 认证相关方法
		setAuth(response) {
			this.isAuthenticated = true
			this.user = response.account || response
			this.token = response.access_token
			// 保存到localStorage
			localStorage.setItem('token', response.access_token)
			localStorage.setItem('user', JSON.stringify(response.account || response))
		},
		clearAuth() {
			this.isAuthenticated = false
			this.user = null
			this.token = null
			// 清除localStorage
			localStorage.removeItem('token')
			localStorage.removeItem('user')
		},
		// 从localStorage恢复认证状态
		restoreAuth() {
			const token = localStorage.getItem('token')
			const userStr = localStorage.getItem('user')
			
			if (token && userStr) {
				try {
					const user = JSON.parse(userStr)
					this.isAuthenticated = true
					this.user = user
					this.token = token
					return true
				} catch (error) {
					console.error('Failed to parse user data from localStorage:', error)
					this.clearAuth()
					return false
				}
			}
			return false
		}
	}
})



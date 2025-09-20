import { defineStore } from 'pinia'
import { getDevices as fetchDeviceStatuses } from '../api/devices'
import { getFamilyMembers, getUserProfile } from '../api/users'
import { getRooms } from '../api/rooms'

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
		async loadDevices() {
			this.loading.devices = true
			this.errors.devices = null
			try {
				const res = await fetchDeviceStatuses()
				this.devices = res?.data || []
			} catch (err) {
				this.errors.devices = err
			} finally {
				this.loading.devices = false
			}
		},
		async loadRooms() {
			this.loading.rooms = true
			this.errors.rooms = null
			try {
				const res = await getRooms()
				this.rooms = res?.data || []
			} catch (err) {
				this.errors.rooms = err
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
				this.loadDevices(),
				this.loadRooms(),
				this.loadMembers(),
				this.loadProfile(userId)
			])
		},
		// 认证相关方法
		setAuth(user, token) {
			this.isAuthenticated = true
			this.user = user
			this.token = token
			// 保存到localStorage
			localStorage.setItem('token', token)
			localStorage.setItem('user', JSON.stringify(user))
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



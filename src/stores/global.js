import { defineStore } from 'pinia'
import { fetchDeviceStatuses } from '../api/devices'
import { getFamilyMembers, getUserProfile } from '../api/users'
import { getRooms, getRoomDevices, batchUpdateRoomDevices } from '../api/rooms'
import { getDeviceCardBySN } from '../utils/deviceMapping'

export const useGlobalStore = defineStore('global', {
	state: () => ({
		// 用户认证状态
		isAuthenticated: false,
		user: null,
		token: null,
		
		// 设备数据
		// 设备列表数据结构：
		// [
		//   {
		//     name: "设备1",
		//     sn: "AC001-250922-000123",  // 设备序列号：模型code-生产日期-流水号
		//     status: "unconfigured",     // 设备状态：unconfigured/online/offline
		//     id: 11,                     // 设备ID
		//     user_id: 16,                // 所属用户ID
		//     model_id: 45,               // 模型ID
		//     created_at: "2025-09-20T08:41:45", // 创建时间
		//     cardName: "AirCoolerCard",  // 对应的设备卡片组件名
		//     modelCode: "AC001"          // 模型code（从SN提取）
		//   }
		// ]
		devices: [],
		
		// 成员数据
		members: [],
		
		// 用户资料
		profile: null,
		
		// 房间数据
		// 房间列表数据结构：
		// [
		//   {
		//     name: "卫生间1",
		//     id: 51,                     // 房间ID
		//     user_id: 16,                // 所属用户ID
		//     created_at: "2025-09-20T08:41:45", // 创建时间
		//     devices: [                  // 房间中的设备列表
		//       {
		//         room_id: 51,
		//         device_id: 12,          // 设备ID
		//         sort_order: 2,          // 排序顺序
		//         id: 2                   // 房间设备关联ID
		//       }
		//     ]
		//   }
		// ]
		rooms: [],
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
				const devices = Array.isArray(res) ? res : []
				
				// 为每个设备添加映射信息
				this.devices = devices.map(device => {
					const cardName = getDeviceCardBySN(device.sn)
					
					return {
						...device,
						cardName,           // 对应的卡片组件名
						modelCode: device.sn ? device.sn.split('-')[0] : null  // 模型code
					}
				})
				
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
							
							console.log(`房间 ${room.id} 原始设备数据:`, roomDevices)
							
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
		
		// 批量更新房间设备排序
		async updateRoomDevicesSort(roomId, devices) {
			try {
				const data = {
					room_id: roomId,
					devices: devices.map((device, index) => ({
						device_id: device.device_id,
						sort_order: index
					}))
				}
				
				const response = await batchUpdateRoomDevices(data)
				
				if (response.success && response.data) {
					// 更新对应房间的设备排序
					const room = this.rooms.find(r => r.id === roomId)
					if (room) {
						console.log(`更新房间 ${roomId} 的设备列表:`, response.data)
						room.devices = response.data
					}
				}
				
				return response
			} catch (error) {
				console.error('批量更新房间设备排序失败:', error)
				throw error
			}
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



import { defineStore } from 'pinia'
import { fetchDeviceStatuses } from '../api/devices'
import { getUserProfile, getMembers } from '../api/users'
import { getRooms, getRoomDevices, batchUpdateRoomDevices } from '../api/rooms'
import { getDeviceCardBySN } from '../utils/deviceMapping'

export const useGlobalStore = defineStore('global', {
	state: () => ({
		// 用户认证状态
		isAuthenticated: false,
		// 当前登录用户数据
		// 用户数据结构（登录API响应）：
		// {
		//   access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // JWT访问令牌
		//   token_type: "bearer",           // 令牌类型
		//   role: "member",                 // 用户角色：admin/member
		//   account: {                      // 账号详细信息
		//     account: "member10",          // 账号名
		//     name: "成员10",               // 显示名称
		//     gender: "other",              // 性别：male/female/other
		//     phone: "1390000009",          // 手机号
		//     email: "member10@example.com", // 邮箱
		//     avatar: null,                 // 头像URL
		//     role: "member",               // 角色：admin/member
		//     id: 28,                       // 账号ID
		//     created_at: "2025-09-22T05:10:39" // 账号创建时间
		//   },
		//   id: 10,                         // 统一的用户ID（admin/owner/member的真正ID）
		//   user_id: 1                      // 所属用户ID（家庭主账号ID）
		// }
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
		// 成员列表数据结构：
		// [
		//   {
		//     user_id: 1,                    // 所属用户ID（家庭主账号ID）
		//     account_id: 24,                // 成员账号ID
		//     id: 6,                         // 成员ID（家庭成员关联ID）
		//     created_at: "2025-09-22T05:10:39", // 成员创建时间
		//     account: {                     // 成员账号信息
		//       account: "member6",          // 账号名
		//       name: "成员6",               // 显示名称
		//       gender: "other",             // 性别：male/female/other
		//       phone: "13900000005",        // 手机号
		//       email: "member6@example.com", // 邮箱
		//       avatar: null,                // 头像URL
		//       role: "member",              // 角色：admin/member
		//       id: 24,                      // 账号ID
		//       created_at: "2025-09-22T05:10:39" // 账号创建时间
		//     }
		//   }
		// ]
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
		async loadMembers(userId) {
			this.loading.members = true
			this.errors.members = null
			try {
				const res = await getMembers({ user_id: userId })
				console.log('成员列表:', res)
				this.members = res || []
			} catch (err) {
				this.errors.members = err
				console.error('成员列表加载失败:', err)
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
				this.loadMembers(userId),
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



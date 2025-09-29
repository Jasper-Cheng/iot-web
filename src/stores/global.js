import { defineStore } from 'pinia'
import { fetchDeviceStatuses, getDeviceMessages } from '../api/devices'
import { getMembers, getUserDetail, getMemberDevicePermissions } from '../api/users'
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
		//   role: "member",                 // 用户角色：owner/member
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
		//     status: "unconfigured",     // 设备状态：unconfigured/configured/unbound/bound
		//     id: 11,                     // 设备ID
		//     user_id: 16,                // 所属用户ID
		//     model_id: 45,               // 模型ID
		//     created_at: "2025-09-20T08:41:45", // 创建时间
		//     cardName: "AirCoolerCard",  // 对应的设备卡片组件名
		//     modelCode: "AC001"          // 模型code（从SN提取）
		//   }
		// ]
		devices: [],
		
		// 成员数据（包含 Owner 和家庭成员）
		// 成员列表数据结构：
		// [
		//   // Owner（当前用户）- 第一位
		//   {
		//     account_id: 0,                 // 账号ID
		//     id: 0,                         // 用户ID
		//     created_at: "2025-09-23T02:30:12.887Z", // 用户创建时间
		//     account: {                     // 账号详细信息
		//       account: "string",           // 账号名
		//       name: "string",              // 显示名称
		//       gender: "other",             // 性别：male/female/other
		//       phone: "string",             // 手机号
		//       email: "string",             // 邮箱
		//       avatar: "string",            // 头像URL
		//       role: "member",              // 角色：admin/member
		//       id: 0,                       // 账号ID
		//       created_at: "2025-09-23T02:30:12.887Z" // 账号创建时间
		//     },
		//     isOwner: true                  // 标识为拥有者（owner拥有所有设备权限，无需deviceIds字段）
		//   },
		//   // 家庭成员 - 其他成员
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
		//     },
		//     isOwner: false,                // 标识为普通成员
		//     deviceIds: [58, 59]            // 设备ID数组，用于快速判断权限
		//   }
		// ]
		members: [],
		
		
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
		
		// 设备消息数据
		// 消息列表数据结构：
		// [
		//   {
		//     device_id: 41,                    // 设备ID
		//     level: "error",                   // 消息级别：normal/error/fatal
		//     message: "电量不足",               // 消息内容
		//     detail: {                         // 详细信息（可选）
		//       severity: "medium",             // 严重程度
		//       component: "CPU",               // 组件
		//       error_code: "ERR6506"           // 错误代码
		//     },
		//     id: 119,                          // 消息ID
		//     status: "read",                   // 消息状态：new/read
		//     created_at: "2025-09-26T02:17:08", // 创建时间
		//     updated_at: null                  // 更新时间
		//   }
		// ]
		// 注意：界面只显示设备名字，不显示detail中的字段
		messages: [],
		
		loading: {
			devices: false,
			members: false,
			rooms: false,
			messages: false,
			auth: false
		},
		errors: {
			devices: null,
			members: null,
			rooms: null,
			messages: null,
			auth: null
		}
	}),
	actions: {
		async loadDevices(userId) {
			this.loading.devices = true
			this.errors.devices = null
			try {
				const res = await fetchDeviceStatuses({ user_id: userId })
				console.log('devices', res)
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
				// 并行加载成员列表和当前用户信息
				const [membersRes, userRes] = await Promise.all([
					getMembers({ user_id: userId }),
					getUserDetail(userId)
				])
				
				// 将当前用户信息作为 Owner 添加到成员列表开头
				const members = membersRes || []
				const owner = userRes ? {
					...userRes,
					isOwner: true
				} : null
				
				// 合并所有成员（Owner + 其他成员）
				const allMembers = owner ? [owner, ...members] : members
				
				// 为每个成员加载设备权限（owner默认拥有所有权限）
				const membersWithPermissions = await Promise.all(
					allMembers.map(async (member, index) => {
						// 第一位是owner，默认拥有所有权限
						if (index === 0 && member.isOwner) {
							return {
								...member
								// owner拥有所有设备权限，不需要deviceIds字段
							}
						}
						
						try {
							// 获取成员的设备权限
							const permissions = await getMemberDevicePermissions(member.id || member.user_id)
							// 提取device_id组成数组
							const deviceIds = permissions ? permissions.map(p => p.device_id) : []
							return {
								...member,
								deviceIds: deviceIds // 设备ID数组，用于快速判断权限
							}
						} catch (error) {
							console.warn(`获取成员 ${member.id || member.user_id} 的设备权限失败:`, error)
							return {
								...member,
								deviceIds: [] // 权限加载失败时设为空数组
							}
						}
					})
				)
				
				this.members = membersWithPermissions
			} catch (err) {
				this.errors.members = err
				console.error('成员列表加载失败:', err)
			} finally {
				this.loading.members = false
			}
		},
		async loadMessages(userId) {
			this.loading.messages = true
			this.errors.messages = null
			try {
				const res = await getDeviceMessages({
					user_id: userId,
					status: 'new'
				})
				
				// API直接返回消息数组，request.js已经提取了response.data
				this.messages = Array.isArray(res) ? res : []
				
			} catch (err) {
				this.errors.messages = err
				console.error('未读消息加载失败:', err)
			} finally {
				this.loading.messages = false
			}
		},
		
		// 加载已读消息（支持分页）
		async loadReadMessages(userId, params = {}) {
			this.loading.messages = true
			this.errors.messages = null
			try {
				const res = await getDeviceMessages({
					user_id: userId,
					status: 'read',
					limit: params.limit || 20,
					skip: params.skip || 0
				})
				
				// 返回已读消息数组
				return Array.isArray(res) ? res : []
				
			} catch (err) {
				this.errors.messages = err
				console.error('已读消息加载失败:', err)
				return []
			} finally {
				this.loading.messages = false
			}
		},
		
		async loadAll() {
			// 检查认证状态和用户ID
			if (!this.isAuthenticated || !this.user?.user_id) {
				console.warn('用户未认证或用户ID无效，跳过数据加载')
				return
			}
			
			const userId = this.user.user_id
			
			await Promise.all([
				this.loadDevices(userId),
				this.loadRooms(userId),
				this.loadMembers(userId),
				this.loadMessages(userId)
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
			this.saveToLocalStorage()
		},
		clearAuth() {
			this.isAuthenticated = false
			this.user = null
			this.token = null
			// 清除localStorage
			this.clearLocalStorage()
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
		},
		
		// 保存当前状态到localStorage
		saveToLocalStorage() {
			try {
				if (this.token) {
					localStorage.setItem('token', this.token)
				}
				if (this.user) {
					localStorage.setItem('user', JSON.stringify(this.user))
				}
			} catch (error) {
				console.error('Failed to save to localStorage:', error)
			}
		},
		
		// 清除localStorage
		clearLocalStorage() {
			try {
				localStorage.removeItem('token')
				localStorage.removeItem('user')
			} catch (error) {
				console.error('Failed to clear localStorage:', error)
			}
		},
		
		// 更新用户信息（统一方法）
		updateUserInfo(updateData) {
			if (this.user?.account) {
				const updatedUser = { ...this.user }
				const updatedAccount = { ...this.user.account }
				
				// 只更新有值的字段
				if (updateData.account) updatedAccount.account = updateData.account
				if (updateData.name) updatedAccount.name = updateData.name
				if (updateData.gender) updatedAccount.gender = updateData.gender
				if (updateData.phone) updatedAccount.phone = updateData.phone
				if (updateData.email) updatedAccount.email = updateData.email
				if (updateData.avatar) updatedAccount.avatar = updateData.avatar
				
				// 更新状态
				updatedUser.account = updatedAccount
				this.user = updatedUser
				
				// 同步到localStorage
				this.saveToLocalStorage()
			}
		},
		
		// 更新成员信息（本地更新，不调用接口）
		updateMemberInfo(memberId, updateData) {
			const memberIndex = this.members.findIndex(member => member.id === memberId)
			if (memberIndex !== -1) {
				const updatedMember = { ...this.members[memberIndex] }
				
				// 确保account对象存在
				if (!updatedMember.account) {
					updatedMember.account = {}
				} else {
					updatedMember.account = { ...updatedMember.account }
				}
				
				// 只更新有值的字段到account对象中
				if (updateData.account) updatedMember.account.account = updateData.account
				if (updateData.name) updatedMember.account.name = updateData.name
				if (updateData.gender) updatedMember.account.gender = updateData.gender
				if (updateData.phone) updatedMember.account.phone = updateData.phone
				if (updateData.email) updatedMember.account.email = updateData.email
				if (updateData.avatar) updatedMember.account.avatar = updateData.avatar
				
				// 更新成员列表（创建新数组以触发响应式更新）
				this.members = [
					...this.members.slice(0, memberIndex),
					updatedMember,
					...this.members.slice(memberIndex + 1)
				]
				
				// 如果是当前用户，同时更新用户信息
				if (this.user?.id === memberId) {
					this.updateUserInfo(updateData)
				}
			}
		},
		
		// 删除成员（本地更新，不调用接口）
		removeMemberInfo(memberId) {
			const memberIndex = this.members.findIndex(member => member.id === memberId)
			if (memberIndex !== -1) {
				// 从成员列表中移除指定成员（创建新数组以触发响应式更新）
				this.members = [
					...this.members.slice(0, memberIndex),
					...this.members.slice(memberIndex + 1)
				]
			}
		}
	}
})



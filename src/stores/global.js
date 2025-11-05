import { defineStore } from 'pinia'
import { fetchDeviceStatuses, getDeviceMessages } from '../api/devices'
import { getMembers, getUserDetail, getMemberDevicePermissions } from '../api/users'
import { getRooms, getRoomDevices, batchUpdateRoomDevices } from '../api/rooms'
import { getSystemMessages } from '../api/systemMessages'
import { getDeviceCardBySN } from '../utils/deviceMapping'
import { getRSAPublicKey } from '../api/auth'
import forge from 'node-forge'

export const useGlobalStore = defineStore('global', {
	state: () => ({
		// 用户认证状态
		isAuthenticated: false,
		// 当前登录用户数据
		// 用户数据结构（登录API响应）：
		// {
		//   access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // JWT访问令牌
		//   token_type: "bearer",           // 令牌类型
		//   role: "owner",                  // 用户角色：owner/member
		//   account: {                      // 账号详细信息
		//     nickname: "用户1",             // 显示名称（昵称）
		//     gender: "female",            // 性别：male/female/other
		//     phone: "13800000000",         // 手机号
		//     email: "user1@example.com",    // 邮箱
		//     avatar: null,                 // 头像URL
		//     role: "owner",                 // 角色：owner/member
		//     id: 4,                        // 账号ID
		//     created_at: "2025-11-04T10:42:34" // 账号创建时间
		//   },
		//   id: 1,                          // 统一的用户ID（admin/owner/member的真正ID）
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
		//     status: "unconfigured",     // 设备状态：unconfigured/configured/unbound/bound/online/offline/fault
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
		//     id: 0,                         // 用户ID
		//     created_at: "2025-09-23T02:30:12.887Z", // 用户创建时间
		//     account: {                     // 账号详细信息
		//       nickname: "string",          // 显示名称（昵称）
		//       gender: "other",             // 性别：male/female/other
		//       phone: "string",             // 手机号
		//       email: "string",             // 邮箱
		//       avatar: "string",            // 头像URL
		//       role: "owner",                // 角色：owner/member
		//       id: 0,                       // 账号ID
		//       created_at: "2025-09-23T02:30:12.887Z" // 账号创建时间
		//     },
		//     isOwner: true                  // 标识为拥有者（owner拥有所有设备权限，无需deviceIds字段）
		//   },
		//   // 家庭成员 - 其他成员
		//   {
		//     user_id: 1,                    // 所属用户ID（家庭主账号ID）
		//     id: 6,                         // 成员ID（家庭成员关联ID）
		//     created_at: "2025-09-22T05:10:39", // 成员创建时间
		//     account: {                     // 成员账号信息
		//       nickname: "成员6",            // 显示名称（昵称）
		//       gender: "other",             // 性别：male/female/other
		//       phone: "13900000005",        // 手机号
		//       email: "member6@example.com", // 邮箱
		//       avatar: null,                // 头像URL
		//       role: "member",              // 角色：owner/member
		//       id: 24,                      // 账号ID
		//       created_at: "2025-09-22T05:10:39" // 账号创建时间
		//     },
		//     isOwner: false,                // 标识为普通成员
		//     deviceIds: [58, 59]            // 设备ID数组，用于快速判断权限
		//   }
		// ]
		members: [],
		
		// 成员在线状态映射（memberId -> status）
		// 格式: { [memberId]: 'active' | 'inactive', ... }
		memberStatuses: {},
		
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
		
		// 设备消息数据，已读消息
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
		
		// 系统消息数据
		// 系统消息列表数据结构：
		// [
		//   {
		//     id: 1,                              // 消息ID
		//     title: "系统维护通知",               // 消息标题
		//     content: "详细内容",                // 消息内容
		//     type: "maintenance",                // 消息类型：announcement/maintenance/update/alert/notification
		//     priority: "high",                   // 优先级：low/normal/high/urgent
		//     platforms: ["web"],                 // 支持的平台
		//     extra: {},                          // 额外信息
		//     created_at: "2025-09-26T02:17:08", // 创建时间
		//     updated_at: "2025-09-26T02:17:08"  // 更新时间
		//   }
		// ]
		systemMessages: [],
		
		loading: {
			devices: false,
			members: false,
			rooms: false,
			messages: false,
			systemMessages: false,
			auth: false
		},
		errors: {
			devices: null,
			members: null,
			rooms: null,
			messages: null,
			systemMessages: null,
			auth: null
		},
		// 用户积分
		userPoints: 0,
		// 是否有新的意见反馈
		hasNewFeedback: false
	}),
	actions: {
		async loadDevices() {
			this.loading.devices = true
			this.errors.devices = null
			
			try {
				const res = await fetchDeviceStatuses()
				
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
			} catch (error) {
				console.error('加载设备列表失败:', error)
				this.errors.devices = error
				this.devices = []
			} finally {
				this.loading.devices = false
			}
		},
		async loadRooms() {
			this.loading.rooms = true
			this.errors.rooms = null
			
			try {
				const res = await getRooms()
				
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
						} catch (error) {
							console.error(`加载房间 ${room.id} 的设备失败:`, error)
							// 如果加载失败，返回空数组
							return {
								...room,
								devices: []
							}
						}
					})
				)
				
				this.rooms = roomsWithDevices
			} catch (error) {
				console.error('加载房间列表失败:', error)
				this.errors.rooms = error
				this.rooms = []
			} finally {
				this.loading.rooms = false
			}
		},
		async loadMembers() {
			this.loading.members = true
			this.errors.members = null
			
			try {
				// 并行加载成员列表和当前用户信息
				const [membersRes, userRes] = await Promise.all([
					getMembers(),
					getUserDetail()
				])
			
			// 根据当前用户角色使用不同数据源更新
			const currentUserRole = this.user?.role || this.user?.account?.role
			
			if (currentUserRole === 'owner') {
				// Owner: 使用 userRes 更新 account 部分
				if (userRes && userRes.account) {
					this.user = {
						...this.user,
						account: {
							...this.user?.account,
							...userRes.account
						}
					}
				}
			} else if (currentUserRole === 'member') {
				// Member: 使用 membersRes 中的当前用户数据更新 account 部分
				if (membersRes && membersRes.length > 0) {
					// 从成员列表中找到当前用户
					const currentMember = membersRes.find(member => member.id === this.user?.id)
					
					if (currentMember && currentMember.account) {
						this.user = {
							...this.user,
							account: {
								...this.user?.account,
								...currentMember.account
							}
						}
					} else {
						console.warn('未在成员列表中找到当前用户或account数据')
					}
				}
			} else {
				// 其他角色或未知角色：使用 userRes 更新 account 部分
				if (userRes && userRes.account) {
					this.user = {
						...this.user,
						account: {
							...this.user?.account,
							...userRes.account
						}
					}
				}
			}
			
			// 同步到localStorage
			this.saveToLocalStorage()
			
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
						
						// 获取成员的设备权限
						try {
							const permissions = await getMemberDevicePermissions(member.id || member.user_id)
							// 提取device_id组成数组
							const deviceIds = permissions ? permissions.map(p => p.device_id) : []
							return {
								...member,
								deviceIds: deviceIds // 设备ID数组，用于快速判断权限
							}
						} catch (error) {
							console.error(`加载成员 ${member.id} 的设备权限失败:`, error)
							// 权限加载失败时返回空数组
							return {
								...member,
								deviceIds: []
							}
						}
					})
				)
				
				this.members = membersWithPermissions
			} catch (error) {
				console.error('加载成员列表失败:', error)
				this.errors.members = error
				this.members = []
			} finally {
				this.loading.members = false
			}
		},
		async loadMessages() {
			this.loading.messages = true
			this.errors.messages = null
			
			try {
				const res = await getDeviceMessages({
					status: 'new',
					level: ['normal', 'error', 'fatal']
				})
				
				// API直接返回消息数组，request.js已经提取了response.data
				this.messages = Array.isArray(res) ? res : []
			} catch (error) {
				console.error('加载消息列表失败:', error)
				this.errors.messages = error
				this.messages = []
			} finally {
				this.loading.messages = false
			}
		},
		
		// 加载已读消息（支持分页）
		async loadReadMessages(params = {}) {
			this.loading.messages = true
			this.errors.messages = null
			
			try {
				const res = await getDeviceMessages({
					status: 'read',
					limit: params.limit || 20,
					skip: params.skip || 0,
					level: ['normal', 'error', 'fatal']
				})
				
				// 返回已读消息数组
				return Array.isArray(res) ? res : []
			} catch (error) {
				console.error('加载已读消息失败:', error)
				this.errors.messages = error
				return []
			} finally {
				this.loading.messages = false
			}
		},
		
		// 加载系统消息（支持分页）
		async loadSystemMessages(userId, params = {}) {
			this.loading.systemMessages = true
			this.errors.systemMessages = null
			
			try {
				const res = await getSystemMessages({
					skip: params.skip || 0,
					limit: params.limit || 20
				})
				
				// 返回系统消息数组
				return Array.isArray(res) ? res : []
			} catch (error) {
				console.error('加载系统消息失败:', error)
				this.errors.systemMessages = error
				return []
			} finally {
				this.loading.systemMessages = false
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
				this.loadDevices(),
				this.loadRooms(),
				this.loadMembers(),
				this.loadMessages(),
				this.loadSystemMessages(userId)
			])
		},
				// 认证相关方法
		setAuth(response) {
			this.isAuthenticated = true
			// 保存完整的用户数据（包括 access_token, token_type, role, account, id, user_id）
			this.user = response
			this.token = response.access_token
			// 保存到localStorage
			this.saveToLocalStorage()
		},
		clearAuth() {
			this.isAuthenticated = false
			this.user = null
			this.token = null
			this.memberStatuses = {} // 清除成员状态
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
				if (updateData.nickname) updatedAccount.nickname = updateData.nickname
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
				if (updateData.nickname) updatedMember.account.nickname = updateData.nickname
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
		},
		
		// 更新成员在线状态
		updateMemberStatus(id, status) {
			// 更新独立的 status 存储
			this.memberStatuses = {
				...this.memberStatuses,
				[id]: status
			}
		},
		
		// 获取成员在线状态
		getMemberStatus(memberId) {
			return this.memberStatuses[memberId] || 'inactive'
		},
		
		// 更新成员设备权限
		updateMemberDevicePermissions(memberId, deviceIds) {
			const memberIndex = this.members.findIndex(member => member.id === memberId)
			if (memberIndex !== -1) {
				// 更新成员权限（创建新对象以触发响应式更新）
				// status 不再存储在 members 中，所以不需要保留
				this.members = [
					...this.members.slice(0, memberIndex),
					{
						...this.members[memberIndex],
						deviceIds: deviceIds || []
					},
					...this.members.slice(memberIndex + 1)
				]
			}
		},
		
		// 更新房间设备排序（用于接收 WebSocket 消息后的本地同步）
		// roomDevicesData 格式: [{ id, roomId, deviceId, sortOrder }, ...]
		// 可能是空数组，表示房间应该被清空（此时需要 roomId 参数）
		updateRoomDevicesSort(roomDevicesData, roomId = null) {
			if (!Array.isArray(roomDevicesData)) {
				return
			}
			
			// 如果 roomDevicesData 为空数组，且有 roomId 参数，清空该房间
			if (roomDevicesData.length === 0 && roomId) {
				const roomIndex = this.rooms.findIndex(room => room.id === roomId)
				if (roomIndex !== -1 && this.rooms[roomIndex].devices && this.rooms[roomIndex].devices.length > 0) {
					// 清空房间的设备列表（创建新对象以触发响应式更新）
					this.rooms = [
						...this.rooms.slice(0, roomIndex),
						{
							...this.rooms[roomIndex],
							devices: []
						},
						...this.rooms.slice(roomIndex + 1)
					]
				}
				return
			}
			
			// 如果 roomDevicesData 为空且没有 roomId，无法确定是哪个房间，直接返回
			if (roomDevicesData.length === 0) {
				return
			}
			
			// 按 roomId 分组
			const roomDevicesMap = new Map()
			roomDevicesData.forEach(item => {
				const { roomId: itemRoomId, id, deviceId, sortOrder } = item
				if (!itemRoomId) return
				
				if (!roomDevicesMap.has(itemRoomId)) {
					roomDevicesMap.set(itemRoomId, [])
				}
				
				// 转换为房间 devices 格式: { room_id, device_id, sort_order, id }
				roomDevicesMap.get(itemRoomId).push({
					id: id,
					room_id: itemRoomId,
					device_id: deviceId,
					sort_order: sortOrder
				})
			})
			
			// 更新每个房间的设备列表
			roomDevicesMap.forEach((devices, targetRoomId) => {
				const roomIndex = this.rooms.findIndex(room => room.id === targetRoomId)
				if (roomIndex !== -1) {
					// 按 sort_order 排序
					const sortedDevices = [...devices].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
					
					// 更新房间的设备列表（创建新对象以触发响应式更新）
					this.rooms = [
						...this.rooms.slice(0, roomIndex),
						{
							...this.rooms[roomIndex],
							devices: sortedDevices
						},
						...this.rooms.slice(roomIndex + 1)
					]
				}
			})
		},
		
		// 添加新房间（用于接收 WebSocket 消息后的本地同步）
		addRoom(roomData) {
			if (!roomData || !roomData.id) {
				console.warn('无效的房间数据:', roomData)
				return
			}
			
			// 检查房间是否已存在
			const existingRoomIndex = this.rooms.findIndex(room => room.id === roomData.id)
			if (existingRoomIndex !== -1) {
				// 如果已存在，更新房间信息
				this.rooms = [
					...this.rooms.slice(0, existingRoomIndex),
					{
						...this.rooms[existingRoomIndex],
						...roomData,
						devices: roomData.devices || []
					},
					...this.rooms.slice(existingRoomIndex + 1)
				]
			} else {
				// 如果不存在，添加到列表末尾（创建新数组以触发响应式更新）
				this.rooms = [
					...this.rooms,
					{
						...roomData,
						devices: roomData.devices || []
					}
				]
			}
		},
		
		// 删除房间（本地更新，不调用接口）
		removeRoom(roomId) {
			const roomIndex = this.rooms.findIndex(room => room.id === roomId)
			if (roomIndex !== -1) {
				// 将该房间的设备移动到 unassigned - 更新 globalStore.devices
				if (this.devices && Array.isArray(this.devices)) {
					this.devices = this.devices.map(device => 
						device.roomId === roomId ? { ...device, roomId: 'unassigned' } : device
					)
				}
				
				// 从房间列表中移除指定房间（创建新数组以触发响应式更新）
				this.rooms = [
					...this.rooms.slice(0, roomIndex),
					...this.rooms.slice(roomIndex + 1)
				]
			}
		},
		
		// 设置是否有新的意见反馈
		setHasNewFeedback(hasNew) {
			this.hasNewFeedback = hasNew
		},
		
		// 获取 RSA 公钥（每次请求最新）
		async getRSAPublicKey() {
			try {
				const response = await getRSAPublicKey()
				if (response.public_key) {
					return response.public_key
				}
				throw new Error('公钥格式错误')
			} catch (error) {
				console.error('获取 RSA 公钥失败:', error)
				throw error
			}
		},
		
		// 加密密码（使用 OAEP 填充）
		async encryptPassword(password) {
			if (!password) {
				return password
			}
			
			try {
				// 获取公钥
				const publicKeyPem = await this.getRSAPublicKey()
				
				// 使用 node-forge 解析 PEM 格式的公钥
				const publicKey = forge.pki.publicKeyFromPem(publicKeyPem)
				
				// 使用 OAEP 填充方式加密
				// OAEP 参数：SHA-256 作为哈希函数，MGF1 作为掩码生成函数
				const encrypted = publicKey.encrypt(password, 'RSA-OAEP', {
					md: forge.md.sha256.create(),
					mgf1: forge.mgf.mgf1.create(forge.md.sha256.create())
				})
				
				// 将加密后的数据转换为 Base64 字符串
				const encryptedBase64 = forge.util.encode64(encrypted)
				
				return encryptedBase64
			} catch (error) {
				console.error('加密密码失败:', error)
				throw error
			}
		}
	}
})



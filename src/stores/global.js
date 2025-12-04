import { defineStore } from 'pinia'
import { fetchDeviceStatuses, getDeviceMessages } from '../api/devices'
import { getFamilys } from '../api/users'
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
		//   role: "user",                   // 用户角色：user/admin
		//   account: {                      // 账号详细信息
		//     nickname: "用户1",             // 显示名称（昵称）
		//     gender: "male",               // 性别：male/female/other
		//     phone: "13800000000",         // 手机号
		//     email: "user1@example.com",   // 邮箱
		//     avatar: null,                 // 头像URL
		//     role: "user",                 // 账号角色：user/admin
		//     id: 4,                        // 账号ID
		//     created_at: "2025-12-04T13:29:41" // 账号创建时间
		//   }
		// }
		user: null,
		token: null,
		
		// 设备数据
		// 设备列表数据结构：
		// [
		//   {
		//     name: "设备1",
		//     sn: "CAM003-221226-000001", // 设备序列号：模型code-生产日期-流水号
		//     status: "unconfigured",    // 设备状态：unconfigured/configured/unbound/bound/online/offline/fault
		//     id: 11,                    // 设备ID
		//     account_id: 4,             // 绑定的账号ID（可为NULL，个人设备）
		//     model_id: 6,               // 模型ID
		//     created_at: "2025-12-04T13:29:41", // 创建时间
		//     cardName: "AirCoolerCard", // 对应的设备卡片组件名（前端根据SN映射）
		//     modelCode: "CAM003"        // 模型code（从SN提取，用于组件选择）
		//   }
		// ]
		devices: [],
		
		// 家庭数据
		// 家庭列表数据结构：
		// [
		//   {
		//     name: "string",              // 家庭名称
		//     avatar: "string",            // 家庭头像
		//     description: "string",        // 家庭描述
		//     id: 2,                       // 家庭ID
		//     invite_code: "YJ4FAZAZ",     // 邀请码
		//     created_at: "2025-12-04T13:43:50", // 创建时间
		//     updated_at: "2025-12-04T13:50:56"  // 更新时间
		//   }
		// ]
		familys: [],
		
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
		deviceMessages: [],
		
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
			familys: false,
			deviceMessages: false,
			systemMessages: false,
			auth: false
		},
		errors: {
			devices: null,
			familys: null,
			deviceMessages: null,
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
		async loadFamilys(params = {}) {
			this.loading.familys = true
			this.errors.familys = null
			
			try {
				const res = await getFamilys({
					skip: params.skip || 0,
					limit: params.limit || 100
				})
				
				// API直接返回家庭数组，request.js已经提取了response.data
				this.familys = Array.isArray(res) ? res : []
			} catch (error) {
				console.error('加载家庭列表失败:', error)
				this.errors.familys = error
				this.familys = []
			} finally {
				this.loading.familys = false
			}
		},
		async loadDeviceMessages() {
			this.loading.deviceMessages = true
			this.errors.deviceMessages = null
			
			try {
				const res = await getDeviceMessages({
					status: 'new'
				})
				
				// API直接返回消息数组，request.js已经提取了response.data
				this.deviceMessages = Array.isArray(res) ? res : []
			} catch (error) {
				console.error('加载设备消息列表失败:', error)
				this.errors.deviceMessages = error
				this.deviceMessages = []
			} finally {
				this.loading.deviceMessages = false
			}
		},
		
		// 加载已读设备消息（支持分页）
		async loadReadDeviceMessages(params = {}) {
			this.loading.deviceMessages = true
			this.errors.deviceMessages = null
			
			try {
				const res = await getDeviceMessages({
					limit: params.limit || 50,
					skip: params.skip || 0
				})
				// 返回已读消息数组
				return Array.isArray(res) ? res : []
			} catch (error) {
				console.error('加载已读设备消息失败:', error)
				this.errors.deviceMessages = error
				return []
			} finally {
				this.loading.deviceMessages = false
			}
		},
		
		// 加载系统消息（支持分页）
		async loadSystemMessages(params = {}) {
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
			// 检查认证状态
			if (!this.isAuthenticated || !this.user) {
				console.warn('用户未认证，跳过数据加载')
				return
			}
			
			await Promise.all([
				this.loadDevices(),
				this.loadFamilys(),
				this.loadDeviceMessages(),
				this.loadSystemMessages()
			])
		},
				// 认证相关方法
		setAuth(response) {
			this.isAuthenticated = true
			// 保存完整的用户数据（包括 access_token, token_type, role, account）
			this.user = response
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
		
		// 设置是否有新的意见反馈
		setHasNewFeedback(hasNew) {
			this.hasNewFeedback = hasNew
		},
		
		// 更新设备状态（用于接收 WebSocket 事件通知后的本地同步）
		updateDeviceStatus(deviceSn, status) {
			if (!deviceSn || !status) {
				console.warn('更新设备状态失败: deviceSn 或 status 为空')
				return
			}
			
			const deviceIndex = this.devices.findIndex(device => device.sn === deviceSn)
			if (deviceIndex !== -1) {
				// 更新设备状态（创建新对象以触发响应式更新）
				this.devices = [
					...this.devices.slice(0, deviceIndex),
					{
						...this.devices[deviceIndex],
						status: status
					},
					...this.devices.slice(deviceIndex + 1)
				]
			} else {
				console.warn(`未找到设备 ${deviceSn}，无法更新状态`)
			}
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



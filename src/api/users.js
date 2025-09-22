import request from '../utils/request'

// 模拟家庭成员数据（最多6位）
const mockFamilyMembers = [
  {
    id: 1,
    name: 'Bala Hatun',
    email: 'bala@example.com',
    avatar: 'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=bala',
    role: 'admin',
    status: 'active',
    joinDate: '2024-01-01',
    devicePermissions: {
      'fan_001': true,
      'light_001': true,
      'tv_001': true,
      'speaker_001': true,
      'vacuum_001': true
    }
  },
  {
    id: 2,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=alice',
    role: 'member',
    status: 'active',
    joinDate: '2024-01-15',
    devicePermissions: {
      'fan_001': true,
      'light_001': false,
      'tv_001': true,
      'speaker_001': false,
      'vacuum_001': false
    }
  },
  {
    id: 3,
    name: 'Bob Smith',
    email: 'bob@example.com',
    avatar: 'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=bob',
    role: 'guest',
    status: 'active',
    joinDate: '2024-02-01',
    devicePermissions: {
      'fan_001': false,
      'light_001': true,
      'tv_001': false,
      'speaker_001': false,
      'vacuum_001': false
    }
  },
  {
    id: 4,
    name: 'Carol Davis',
    email: 'carol@example.com',
    avatar: 'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=carol',
    role: 'member',
    status: 'active',
    joinDate: '2024-02-15',
    devicePermissions: {
      'fan_001': true,
      'light_001': true,
      'tv_001': false,
      'speaker_001': true,
      'vacuum_001': false
    }
  },
  {
    id: 5,
    name: 'David Wilson',
    email: 'david@example.com',
    avatar: 'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=david',
    role: 'member',
    status: 'active',
    joinDate: '2024-03-01',
    devicePermissions: {
      'fan_001': false,
      'light_001': false,
      'tv_001': true,
      'speaker_001': false,
      'vacuum_001': true
    }
  },
  {
    id: 6,
    name: 'Emma Brown',
    email: 'emma@example.com',
    avatar: 'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=emma',
    role: 'guest',
    status: 'active',
    joinDate: '2024-03-15',
    devicePermissions: {
      'fan_001': true,
      'light_001': false,
      'tv_001': false,
      'speaker_001': false,
      'vacuum_001': false
    }
  }
]

// 模拟设备数据
const mockDevices = [
  { id: 'fan_001', name: '智能风扇', type: 'fan', icon: 'fan' },
  { id: 'light_001', name: '智能灯', type: 'light', icon: 'light' },
  { id: 'tv_001', name: '智能电视', type: 'tv', icon: 'tv' },
  { id: 'speaker_001', name: '智能音响', type: 'speaker', icon: 'speaker' },
  { id: 'vacuum_001', name: '智能吸尘器', type: 'vacuum', icon: 'vacuum' }
]

// 基础用户API
export const getUsers = () => {
	return request({
		url: '/users',
		method: 'get'
	})
}

export const addUser = (data) => {
	return request({
		url: '/users',
		method: 'post',
		data: data
	})
}

export const updateUser = (id, data) => {
	return request({
		url: `/users/${id}`,
		method: 'put',
		data: data
	})
}

export const deleteUser = (id) => {
	return request({
		url: `/users/${id}`,
		method: 'delete'
	})
}

export const getUserProfile = (id) => {
	return request({
		url: `/users/${id}/profile`,
		method: 'get'
	})
}

export const updateUserProfile = (id, data) => {
	return request({
		url: `/users/${id}/profile`,
		method: 'put',
		data: data
	})
}

// 成员相关API
export const getMemberDetail = (memberId) => {
	return request({
		url: `/members/${memberId}`,
		method: 'get'
	})
}

// 用户详情API
export const getUserDetail = (userId) => {
	return request({
		url: `/users/${userId}`,
		method: 'get'
	})
}

// 家庭成员管理API
export const getFamilyMembers = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: mockFamilyMembers,
        total: mockFamilyMembers.length
      })
    }, 300)
  })
}

export const getDevices = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: mockDevices,
        total: mockDevices.length
      })
    }, 200)
  })
}

export const updateMemberDevicePermission = (memberId, deviceId, hasPermission) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const member = mockFamilyMembers.find(m => m.id === memberId)
      if (!member) {
        resolve({ success: false, message: '成员不存在' })
        return
      }
      
      // 检查是否为管理员
      if (member.role === 'admin') {
        resolve({ success: false, message: '管理员权限不可修改' })
        return
      }
      
      member.devicePermissions[deviceId] = hasPermission
      resolve({ success: true, data: member })
    }, 300)
  })
}

export const addFamilyMember = (memberData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 检查成员数量限制（最多6位）
      if (mockFamilyMembers.length >= 6) {
        resolve({ 
          success: false, 
          message: '家庭成员数量已达上限（最多6位）' 
        })
        return
      }
      
      const newMember = {
        id: Date.now(),
        ...memberData,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        devicePermissions: memberData.devicePermissions || {}
      }
      mockFamilyMembers.push(newMember)
      resolve({ success: true, data: newMember })
    }, 500)
  })
}

export const updateFamilyMember = (id, memberData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const member = mockFamilyMembers.find(m => m.id === id)
      if (!member) {
        resolve({ success: false, message: '成员不存在' })
        return
      }
      
      // 检查是否为管理员，如果是管理员则不允许更改角色
      if (member.role === 'admin' && memberData.role && memberData.role !== 'admin') {
        resolve({ success: false, message: '管理员角色不可更改' })
        return
      }
      
      // 更新成员信息
      Object.assign(member, memberData)
      
      resolve({ success: true, data: member })
    }, 300)
  })
}

export const deleteFamilyMember = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const member = mockFamilyMembers.find(m => m.id === id)
      if (!member) {
        resolve({ success: false, message: '成员不存在' })
        return
      }
      
      // 检查是否为管理员
      if (member.role === 'admin') {
        resolve({ success: false, message: '管理员不能被删除' })
        return
      }
      
      const index = mockFamilyMembers.findIndex(member => member.id === id)
      mockFamilyMembers.splice(index, 1)
      resolve({ success: true })
    }, 300)
  })
}
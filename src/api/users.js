import request from '../utils/request'

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


// 成员相关API
export const getMembers = (params) => {
	return request({
		url: '/members/',
		method: 'get',
		params: {
			user_id: params.user_id
		}
	})
}

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


export const updateMemberDevicePermission = (memberId, deviceId, hasPermission) => {
  return request({
    url: `/members/${memberId}/device-permissions/${deviceId}`,
    method: 'put',
    data: { hasPermission }
  })
}

export const addFamilyMember = (memberData) => {
  return request({
    url: '/members/',
    method: 'post',
    data: memberData
  })
}

export const updateFamilyMember = (id, memberData) => {
  return request({
    url: `/members/${id}`,
    method: 'put',
    data: memberData
  })
}

export const deleteFamilyMember = (id) => {
  return request({
    url: `/members/${id}`,
    method: 'delete'
  })
}

// 获取成员设备控制权限
export const getMemberDevicePermissions = (memberId) => {
  return request({
    url: '/member-device-permissions/',
    method: 'get',
    params: {
      member_id: memberId
    }
  })
}

// 批量更新成员设备权限
export const batchUpdateMemberDevicePermissions = (memberId, deviceIds) => {
  return request({
    url: `/member-device-permissions/member/${memberId}/batch-update`,
    method: 'put',
    data: {
      device_ids: deviceIds
    }
  })
}

// 一键已读所有消息
export const markAllMessagesAsRead = () => {
  return request({
    url: '/device-messages/mark-all-read',
    method: 'patch'
  })
}
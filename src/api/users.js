import request from '../utils/request'

// 基础用户API
export const updateUser = (data) => {
	return request({
		url: '/users/',
		method: 'put',
		data: data
	})
}

export const deleteUser = () => {
	return request({
		url: '/users/',
		method: 'delete'
	})
}


// 成员相关API
export const getMembers = () => {
	return request({
		url: '/members/',
		method: 'get'
	})
}

export const getMemberDetail = (memberId) => {
	return request({
		url: `/members/${memberId}`,
		method: 'get'
	})
}

// 用户详情API
export const getUserDetail = () => {
	return request({
		url: '/users/',
		method: 'get'
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
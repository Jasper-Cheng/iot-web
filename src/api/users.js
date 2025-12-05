import request from '../utils/request'

// 基础用户API
export const updateUser = (data) => {
	return request({
		url: '/auth/profile',
		method: 'patch',
		data: data
	})
}

export const deleteUser = () => {
	return request({
		url: '/auth/account',
		method: 'delete'
	})
}

// 一键已读所有消息
export const markAllMessagesAsRead = () => {
  return request({
    url: '/device-messages/mark-all-read',
    method: 'patch'
  })
}

// 家庭相关API
export const getFamilys = (params = {}) => {
  const requestParams = {}
  
  // 支持分页参数
  if (params.skip !== undefined) {
    requestParams.skip = params.skip
  }
  
  if (params.limit !== undefined) {
    requestParams.limit = params.limit
  }
  
  return request({
    url: '/families/',
    method: 'get',
    params: requestParams
  })
}

export const createFamily = (data) => {
  return request({
    url: '/families/',
    method: 'post',
    data: data
  })
}

export const deleteFamily = (familyId) => {
  return request({
    url: `/families/${familyId}`,
    method: 'delete'
  })
}

export const leaveFamily = (familyMemberId) => {
  return request({
    url: `/family-members/${familyMemberId}`,
    method: 'delete'
  })
}

export const getFamilyMembers = (familyId, params = {}) => {
  const requestParams = {}
  
  // 支持分页参数
  if (params.skip !== undefined) {
    requestParams.skip = params.skip
  }
  
  if (params.limit !== undefined) {
    requestParams.limit = params.limit
  }
  
  return request({
    url: `/family-members/family/${familyId}`,
    method: 'get',
    params: requestParams
  })
}

export const joinFamilyByInviteCode = (inviteCode) => {
  return request({
    url: '/family-members/join-by-invite-code',
    method: 'post',
    params: {
      invite_code: inviteCode
    }
  })
}

export const updateFamilyMemberNickname = (familyMemberId, nickname) => {
  return request({
    url: `/family-members/${familyMemberId}`,
    method: 'patch',
    data: {
      nickname: nickname
    }
  })
}

export const removeFamilyDevice = (familyId, deviceId) => {
  return request({
    url: `/families/${familyId}/devices/${deviceId}`,
    method: 'delete'
  })
}

export const addFamilyDevice = (familyId, deviceId) => {
  return request({
    url: `/families/${familyId}/devices/${deviceId}`,
    method: 'post'
  })
}
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
export const markAllMessagesAsRead = (familyId = null) => {
  const config = {
    url: '/device-messages/mark-all-read',
    method: 'patch'
  }
  
  // family_id 作为查询参数
  if (familyId !== null) {
    config.params = { family_id: familyId }
  }
  
  return request(config)
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

export const joinFamilyByInviteCode = (inviteCode, nickname) => {
  return request({
    url: '/family-members/join-by-invite-code',
    method: 'post',
    params: {
      invite_code: inviteCode
    },
    data: {
      nickname: nickname
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

// 切换当前家庭
export const updateCurrentFamily = (familyId) => {
  return request({
    url: '/auth/current-family',
    method: 'patch',
    params: {
      family_id: familyId
    }
  })
}
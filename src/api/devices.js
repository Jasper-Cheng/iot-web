import request from '../utils/request'

export const getMyDevices = () => {
  return request({
    url: '/devices/',
    method: 'get'
  })
}

export const unbindDeviceBySN = (sn) => {
  return request({
    url: `/devices/unbind-by-sn/${sn}`,
    method: 'delete'
  })
}

export const bindDeviceBySN = (sn, familyId = null) => {
  const config = {
    url: '/devices/bind-by-sn/',
    method: 'post',
    data: { sn: sn }
}

  // family_id 作为查询参数
  if (familyId !== null) {
    config.params = { family_id: familyId }
  }
  
  return request(config)
}

export const updateDeviceName = (id, name, familyId = null) => {
  const config = {
    url: `/devices/${id}/name`,
    method: 'patch',
    data: { name: name }
  }
  
  // family_id 作为查询参数
  if (familyId !== null) {
    config.params = { family_id: familyId }
  }

  console.log('updateDeviceName', config)
  
  return request(config)
}

// 获取设备消息
export const getDeviceMessages = (params) => {
  const requestParams = {}
  
  // 有就添加，没有就不添加
  if (params.limit !== undefined) {
    requestParams.limit = params.limit
  }
  
  if (params.status !== undefined) {
    requestParams.status = params.status
  }
  
  if (params.skip !== undefined) {
    requestParams.skip = params.skip
  }
  
  // family_id 作为查询参数
  if (params.family_id !== undefined && params.family_id !== null) {
    requestParams.family_id = params.family_id
  }
  
  // 支持 level 参数，可以是数组或单个值
  if (params.level !== undefined) {
    if (Array.isArray(params.level)) {
      // 如果是数组，为每个 level 添加一个参数
      params.level.forEach(level => {
        if (!requestParams.level) {
          requestParams.level = []
        }
        requestParams.level.push(level)
      })
    } else {
      requestParams.level = params.level
    }
  }
  
  // 处理多个 level 参数的特殊序列化
  const config = {
    url: '/device-messages/',
    method: 'get',
    params: requestParams
  }
  
  // 如果有多个 level 参数，需要特殊处理序列化
  if (Array.isArray(requestParams.level) && requestParams.level.length > 1) {
    const params = new URLSearchParams()
    Object.keys(requestParams).forEach(key => {
      if (key === 'level' && Array.isArray(requestParams[key])) {
        // 为每个 level 值添加一个 level 参数
        requestParams[key].forEach(level => {
          params.append('level', level)
        })
      } else {
        params.append(key, requestParams[key])
      }
    })
    config.paramsSerializer = () => params.toString()
  }
  
  return request(config)
}

// 标记消息已读
export const markMessageAsRead = (messageId) => {
  return request({
    url: `/device-messages/${messageId}/make-read`,
    method: 'patch'
  })
}

// 获取家庭设备
export const getFamilyDevices = (familyId, params = {}) => {
  const requestParams = {
    family_id: familyId
  }
  
  // 支持分页参数
  if (params.skip !== undefined) {
    requestParams.skip = params.skip
  }
  
  if (params.limit !== undefined) {
    requestParams.limit = params.limit
  }
  
  return request({
    url: '/devices/',
    method: 'get',
    params: requestParams
  })
}
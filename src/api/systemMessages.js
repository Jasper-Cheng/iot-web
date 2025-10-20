import request from '../utils/request'

// 获取系统消息列表
export const getSystemMessages = (params = {}) => {
  return request({
    url: '/system-messages/',
    method: 'get',
    params: {
      skip: params.skip || 0,
      limit: params.limit || 20,
      platform: 'web',
      ...params
    }
  })
}

// 获取单个系统消息详情
export const getSystemMessageDetail = (id) => {
  return request({
    url: `/system-messages/${id}`,
    method: 'get'
  })
}

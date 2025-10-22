import request from '../utils/request'

/**
 * 获取版本信息列表
 * @param {Object} params - 查询参数
 * @param {number} params.skip - 跳过条数，默认0
 * @param {number} params.limit - 限制条数，默认100
 * @param {string} params.platform - 平台类型，如'web'
 * @param {string} params.order_by - 排序字段，如'created_at'
 * @param {boolean} params.order_desc - 是否降序，默认true
 * @returns {Promise} 返回版本信息列表
 */
export const getVersionInfo = (params = {}) => {
  const defaultParams = {
    skip: 0,
    limit: 100,
    platform: 'web',
    order_by: 'created_at',
    order_desc: true
  }
  
  const queryParams = { ...defaultParams, ...params }
  
  return request({
    url: '/version-info/',
    method: 'GET',
    params: queryParams
  })
}

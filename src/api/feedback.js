import request from '../utils/request'

/**
 * 提交反馈
 * @param {Object} feedbackData - 反馈数据
 * @param {string} feedbackData.type - 反馈类型
 * @param {string} feedbackData.content - 反馈内容
 * @param {string} feedbackData.contact_info - 联系方式
 * @param {Object} feedbackData.extra - 额外信息
 * @returns {Promise} 返回提交结果
 */
export const submitFeedback = (feedbackData) => {
  
  return request({
    url: '/feedback/',
    method: 'POST',
    data: feedbackData
  })
}

/**
 * 获取反馈列表
 * @param {Object} params - 查询参数
 * @param {number} params.skip - 跳过条数，默认0
 * @param {number} params.limit - 限制条数，默认100
 * @param {string} params.order_by - 排序字段，如'created_at'
 * @param {boolean} params.order_desc - 是否降序，默认true
 * @returns {Promise} 返回反馈列表
 */
export const getFeedbackList = (params = {}) => {
  const defaultParams = {
    skip: 0,
    limit: 100,
    order_by: 'created_at',
    order_desc: true
  }
  
  const queryParams = { ...defaultParams, ...params }
  
  return request({
    url: '/feedback/',
    method: 'GET',
    params: queryParams
  })
}

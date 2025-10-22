import request from '../utils/request'

/**
 * 提交反馈
 * @param {Object} feedbackData - 反馈数据
 * @param {string} feedbackData.type - 反馈类型
 * @param {string} feedbackData.content - 反馈内容
 * @param {string} feedbackData.source - 反馈来源，默认'web'
 * @param {string} feedbackData.contact_info - 联系方式
 * @param {Object} feedbackData.extra - 额外信息
 * @returns {Promise} 返回提交结果
 */
export const submitFeedback = (feedbackData) => {
  const defaultData = {
    source: 'web',
    extra: {
      ip_address: '',
      user_agent: navigator.userAgent,
      device_info: {
        platform: 'Web',
        version: '1.0.0'
      }
    }
  }
  
  const submitData = { ...defaultData, ...feedbackData }
  
  return request({
    url: '/feedback/',
    method: 'POST',
    data: submitData
  })
}

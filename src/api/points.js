import request from '../utils/request'

// 获取积分余额
export const getPointsBalance = (accountId) => {
  return request({
    url: `/points/balance/${accountId}`,
    method: 'get'
  })
}

// 获取积分历史记录
export const getPointsHistory = (accountId, params = {}) => {
  return request({
    url: `/points/history/${accountId}`,
    method: 'get',
    params: {
      skip: params.skip || 0,
      limit: params.limit || 20,
      ...params
    }
  })
}

// 签到接口
export const checkIn = (extra = {}) => {
  return request({
    url: '/check-in/',
    method: 'post',
    data: {
      extra:extra
    }
  })
}

// 获取日历签到数据
export const getCheckinCalendar = (year, month) => {
  return request({
    url: '/check-in/calendar',
    method: 'get',
    params: {
      year: year,
      month: month
    }
  })
}

// 获取签到统计数据
export const getCheckinStats = () => {
  return request({
    url: '/check-in/stats',
    method: 'get'
  })
}

export const getCheckinHistory = (skip = 0, limit = 20) => {
  return request({
    url: '/check-in/history',
    method: 'get',
    params: {
      skip: skip,
      limit: limit
    }
  })
}

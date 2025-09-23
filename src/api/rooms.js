import request from '../utils/request'

// 模拟房间数据
const mockRooms = [
	{ id: 'living_room', name: '客厅' },
	{ id: 'bedroom_master', name: '主卧' },
	{ id: 'kitchen', name: '厨房' }
]

export const getRooms = (params) => {
	return request({
		url: '/rooms/',
		method: 'get',
		params: {
		  user_id: params.user_id
		}
	  })
}

// 获取房间中的设备
export const getRoomDevices = (roomId) => {
	return request({
		url: `/room-devices/by-room/${roomId}`,
		method: 'get'
	})
}

// 批量更新房间设备排序
export const batchUpdateRoomDevices = (data) => {
	return request({
		url: '/room-devices/batch-sort',
		method: 'put',
		data: data
	})
}

// 创建房间
export const createRoom = (data) => {
	return request({
		url: '/rooms/',
		method: 'post',
		data: data
	})
}



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



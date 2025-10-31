import request from '../utils/request'

export const getRooms = () => {
	return request({
		url: '/rooms/',
		method: 'get'
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

// 删除房间
export const deleteRoom = (roomId) => {
	return request({
		url: `/rooms/${roomId}`,
		method: 'delete'
	})
}



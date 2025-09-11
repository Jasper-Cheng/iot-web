// 模拟房间数据
const mockRooms = [
	{ id: 'living_room', name: '客厅' },
	{ id: 'bedroom_master', name: '主卧' },
	{ id: 'kitchen', name: '厨房' }
]

export const getRooms = () => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				data: mockRooms,
				total: mockRooms.length
			})
		}, 300)
	})
}



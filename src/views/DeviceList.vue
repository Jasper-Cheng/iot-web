<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">设备管理</h2>
    <el-button type="primary" class="mb-4" @click="addDevice">添加设备</el-button>
    <el-table :data="devices" stripe style="width: 100%">
      <el-table-column prop="id" label="设备ID" width="120" />
      <el-table-column prop="name" label="设备名称" />
      <el-table-column prop="status" label="状态" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="editDevice(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteDevice(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const devices = ref([
  { id: '001', name: '温湿度传感器', status: '在线' },
  { id: '002', name: '摄像头', status: '离线' }
])

const addDevice = () => {
  alert('TODO: 跳转到添加设备页面')
}

const editDevice = (device) => {
  alert(`编辑设备：${device.name}`)
}

const deleteDevice = (id) => {
  devices.value = devices.value.filter(d => d.id !== id)
}
</script>

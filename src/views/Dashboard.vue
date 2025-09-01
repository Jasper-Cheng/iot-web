<template>
  <div class="dashboard">
    <h1>IoT 管理平台</h1>
    
    <!-- 统计卡片 -->
    <div class="stats">
      <el-card>
        <h3>设备总数: {{ deviceStats.total }}</h3>
        <p>在线: {{ deviceStats.online }} | 离线: {{ deviceStats.offline }}</p>
      </el-card>
    </div>

    <!-- 设备列表 -->
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>我的设备</span>
          <el-button @click="refreshDevices">刷新</el-button>
        </div>
      </template>

      <div v-loading="loading">
        <div v-if="devices.length === 0" style="text-align: center; padding: 40px;">
          暂无设备数据
        </div>
        
        <div v-else class="device-list">
          <div v-for="device in devices" :key="device.id" class="device-item">
            <h4>{{ device.name || device.device_id }}</h4>
            <p>ID: {{ device.device_id }}</p>
            <p>状态: {{ device.status || '未知' }}</p>
            <p>类型: {{ device.device_type || '未知' }}</p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getDevices } from '../api/devices'

const loading = ref(false)
const devices = ref([])

const deviceStats = computed(() => {
  const total = devices.value.length
  const online = devices.value.filter(d => d.status === 'online').length
  const offline = total - online
  return { total, online, offline }
})

const fetchDevices = async () => {
  try {
    loading.value = true
    const params = { skip: 0, limit: 100 }
    console.log('获取设备列表:', params)
    console.log('getDevices函数:', getDevices)
    
    const response = await getDevices(params)
    console.log('设备列表响应:', response)
    
    if (response && response.data) {
      devices.value = response.data
    } else {
      devices.value = response || []
    }
  } catch (error) {
    console.error('获取设备列表失败:', error)
    ElMessage.error('获取设备列表失败')
    devices.value = []
  } finally {
    loading.value = false
  }
}

const refreshDevices = () => {
  fetchDevices()
}

onMounted(() => {
  fetchDevices()
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stats {
  margin-bottom: 20px;
}

.device-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.device-item {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  background: #f9f9f9;
}

.device-item h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.device-item p {
  margin: 5px 0;
  color: #666;
}
</style>

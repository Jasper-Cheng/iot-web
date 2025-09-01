<template>
  <div>
    <el-card>
      <h3>设备数据监控</h3>
      <LineChart :data="chartData" title="温度监控" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LineChart from '../components/LineChart.vue'
import request from '../utils/request'

const chartData = ref([])

onMounted(async () => {
  // 模拟定时从后端获取数据
  const interval = setInterval(async () => {
    try {
      const res = await request.get('/devices/123/data') // 假设 API 返回 {time, value}
      chartData.value.push(res)
      if (chartData.value.length > 20) {
        chartData.value.shift() // 保留 20 条
      }
    } catch (e) {
      console.error('获取数据失败', e)
    }
  }, 2000)

  // 组件卸载时清理定时器
  onUnmounted(() => clearInterval(interval))
})
</script>

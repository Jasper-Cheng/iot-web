<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">数据监控面板</h2>
    <el-card class="mb-4">
      <h3 class="mb-2">设备运行状态</h3>
      <el-progress :percentage="70" />
    </el-card>
    <el-card>
      <h3 class="mb-2">数据折线图</h3>
      <div class="h-64 bg-gray-50 flex items-center justify-center">
        <span>TODO: 引入 ECharts 渲染数据图表</span>
      </div>
    </el-card>
  </div>
</template>

<script setup>
// 这里后面可以集成 echarts
</script>

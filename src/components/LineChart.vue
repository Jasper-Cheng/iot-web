<template>
  <div ref="chartRef" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted, ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  data: { type: Array, default: () => [] },
  title: { type: String, default: '实时数据' }
})

const chartRef = ref(null)
let chartInstance = null

onMounted(() => {
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption({
    title: { text: props.title },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', boundaryGap: false, data: props.data.map(d => d.time) },
    yAxis: { type: 'value' },
    series: [{ name: props.title, type: 'line', smooth: true, data: props.data.map(d => d.value) }]
  })
})

watch(() => props.data, (newData) => {
  chartInstance?.setOption({
    xAxis: { data: newData.map(d => d.time) },
    series: [{ data: newData.map(d => d.value) }]
  })
}, { deep: true })

onBeforeUnmount(() => chartInstance?.dispose())
</script>
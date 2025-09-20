<template>
  <router-view></router-view>
</template>

<script setup>
import { onMounted } from 'vue'
import { useGlobalStore } from './stores/global'

const globalStore = useGlobalStore()

// 应用启动时恢复认证状态
onMounted(() => {
  globalStore.restoreAuth()
})
</script>
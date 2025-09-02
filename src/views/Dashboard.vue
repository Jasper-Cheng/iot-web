<template>
  <div class="dashboard">
    <!-- 3D场景容器 -->
    <div ref="threeContainer" class="three-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// 响应式数据
const threeContainer = ref(null)

// Three.js 相关变量
let scene, camera, renderer, controls
let animationId

// 初始化Three.js场景
const initThreeJS = () => {
  if (!threeContainer.value) return

  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff) // 白色背景

  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    threeContainer.value.clientWidth / threeContainer.value.clientHeight,
    0.1,
    1000
  )
  camera.position.set(5, 5, 5)

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight)
  threeContainer.value.appendChild(renderer.domElement)

  // 添加控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05

  // 添加光源
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(10, 10, 5)
  scene.add(directionalLight)

  // 创建坐标系
  createCoordinateSystem()

  // 开始渲染循环
  animate()
}

// 创建坐标系
const createCoordinateSystem = () => {
  // 创建坐标轴
  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)
  
  // 创建网格
  const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0x888888)
  scene.add(gridHelper)
}

// 渲染循环
const animate = () => {
  animationId = requestAnimationFrame(animate)
  
  controls.update()
  
  renderer.render(scene, camera)
}

// 窗口大小改变处理
const handleResize = () => {
  if (threeContainer.value && camera && renderer) {
    camera.aspect = threeContainer.value.clientWidth / threeContainer.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight)
  }
}

onMounted(async () => {
  await nextTick()
  initThreeJS()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.dashboard {
  position: relative;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #ffffff;
}

.three-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* 3D场景样式优化 */
.three-container canvas {
  display: block;
  cursor: grab;
}

.three-container canvas:active {
  cursor: grabbing;
}
</style>

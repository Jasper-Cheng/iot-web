<template>
  <div class="smart-control-panel">
    <div class="panel-header">
      <div class="panel-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2" fill="none"/>
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
      </div>
      <h3 class="panel-title">Smart Control</h3>
    </div>
    <div class="quick-actions">
      <button 
        class="action-btn away-btn"
        :class="{ 'executing': isExecuting && executingAction === 'away', 'disabled': isExecuting }"
        :disabled="isExecuting"
        @click="executeAction('away')"
      >
        <div class="btn-icon">
          <svg v-if="!(isExecuting && executingAction === 'away')" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" stroke="currentColor" stroke-width="2" fill="none"/>
            <line x1="12" y1="2" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
          </svg>
          <div v-else class="loading-spinner"></div>
        </div>
        <div class="btn-content">
          <div class="btn-title">{{ isExecuting && executingAction === 'away' ? '执行中...' : '离家断电' }}</div>
          <div class="btn-desc">{{ isExecuting && executingAction === 'away' ? '正在关闭设备' : '关闭所有设备' }}</div>
        </div>
      </button>
      <button 
        class="action-btn home-btn"
        :class="{ 'executing': isExecuting && executingAction === 'home', 'disabled': isExecuting }"
        :disabled="isExecuting"
        @click="executeAction('home')"
      >
        <div class="btn-icon">
          <svg v-if="!(isExecuting && executingAction === 'home')" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" fill="none"/>
            <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
          <div v-else class="loading-spinner"></div>
        </div>
        <div class="btn-content">
          <div class="btn-title">{{ isExecuting && executingAction === 'home' ? '执行中...' : '回家通电' }}</div>
          <div class="btn-desc">{{ isExecuting && executingAction === 'home' ? '正在开启设备' : '开启常用设备' }}</div>
        </div>
      </button>
      <button 
        class="action-btn all-on-btn"
        :class="{ 'executing': isExecuting && executingAction === 'allOn', 'disabled': isExecuting }"
        :disabled="isExecuting"
        @click="executeAction('allOn')"
      >
        <div class="btn-icon">
          <svg v-if="!(isExecuting && executingAction === 'allOn')" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
          <div v-else class="loading-spinner"></div>
        </div>
        <div class="btn-content">
          <div class="btn-title">{{ isExecuting && executingAction === 'allOn' ? '执行中...' : '全部打开' }}</div>
          <div class="btn-desc">{{ isExecuting && executingAction === 'allOn' ? '正在开启所有设备' : '开启所有设备' }}</div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 执行状态管理
const isExecuting = ref(false)
const executingAction = ref('')

// 快捷操作执行函数
const executeAction = async (action) => {
  if (isExecuting.value) return // 如果正在执行，直接返回
  
  isExecuting.value = true
  executingAction.value = action
  
  try {
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    switch (action) {
      case 'away':
        // 关闭所有设备
        // 可以添加具体的断电逻辑
        break
      case 'home':
        // 开启常用设备
        // 可以添加具体的通电逻辑
        break
      case 'allOn':
        // 开启所有设备
        // 可以添加具体的全开逻辑
        break
    }
  } catch (error) {
    console.error('操作执行失败:', error)
  } finally {
    // 重置执行状态
    isExecuting.value = false
    executingAction.value = ''
  }
}
</script>

<style scoped>
.smart-control-panel {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 8px;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.panel-icon {
  width: 32px;
  height: 32px;
  background: var(--color-button-dark);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-primary);
}

.panel-icon svg {
  width: 16px;
  height: 16px;
}

.panel-title {
  color: var(--color-text-primary);
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.quick-actions {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  flex: 1;
  min-width: 0;
}

.action-btn:hover {
  background: var(--color-hover);
  border-color: var(--color-primary);
  transform: translateY(-1px);
}

.action-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  width: 44px;
  height: 44px;
  background: var(--color-button-dark);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-primary);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.action-btn:hover .btn-icon {
  background: var(--color-primary);
  color: white;
  transform: scale(1.05);
}

.action-btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.action-btn.executing {
  background: var(--color-active);
  border-color: var(--color-primary);
}

.action-btn.executing .btn-icon {
  background: var(--color-primary);
  color: white;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn-icon svg {
  width: 24px;
  height: 24px;
}

.btn-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.btn-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.btn-desc {
  font-size: 10px;
  color: var(--color-text-secondary);
  font-weight: 500;
  line-height: 1.2;
}
</style>

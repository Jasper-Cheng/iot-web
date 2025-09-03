<template>
  <div class="home-page">
    <!-- Home 内容区域 -->
    <div class="home-content">
      <div class="content-grid">
        <!-- 设备状态卡片 -->
        <div class="status-card">
          <div class="card-header">
            <h3>设备状态</h3>
            <span class="status-indicator online"></span>
          </div>
          <div class="card-content">
            <div class="status-item">
              <span class="status-label">在线设备</span>
              <span class="status-value">12</span>
            </div>
            <div class="status-item">
              <span class="status-label">离线设备</span>
              <span class="status-value">3</span>
            </div>
          </div>
        </div>
        
        <!-- 快速操作卡片 -->
        <div class="action-card">
          <div class="card-header">
            <h3>快速操作</h3>
          </div>
          <div class="card-content">
            <button class="action-btn">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
              添加设备
            </button>
            <button class="action-btn">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
              检查更新
            </button>
          </div>
        </div>
        
        <!-- 最近活动卡片 -->
        <div class="activity-card">
          <div class="card-header">
            <h3>最近活动</h3>
          </div>
          <div class="card-content">
            <div class="activity-item">
              <div class="activity-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
              </div>
              <div class="activity-info">
                <span class="activity-title">客厅灯已开启</span>
                <span class="activity-time">2分钟前</span>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
              </div>
              <div class="activity-info">
                <span class="activity-title">空调已关闭</span>
                <span class="activity-time">15分钟前</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Home 页面的逻辑
</script>

<style scoped>
@import '../styles/colors.css';

/* Home 页面样式 */
.home-page {
  width: 100%;
}

/* Home 内容区域样式 */
.home-content {
  padding: 0 40px 40px;
  overflow-y: auto;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

/* 卡片通用样式 */
.status-card,
.action-card,
.activity-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.status-card:hover,
.action-card:hover,
.activity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-primary);
}

.status-indicator.online {
  background: #10B981;
}

/* 状态卡片内容 */
.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border-light);
}

.status-item:last-child {
  border-bottom: none;
}

.status-label {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.status-value {
  color: var(--color-text-primary);
  font-weight: 600;
  font-size: 16px;
}

/* 操作按钮 */
.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  margin-bottom: 12px;
  width: 100%;
}

.action-btn:hover {
  background: var(--color-primary);
  color: var(--color-bg-primary);
  border-color: var(--color-primary);
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

/* 活动项目 */
.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border-light);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 32px;
  height: 32px;
  background: var(--color-bg-primary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-icon svg {
  width: 18px;
  height: 18px;
  color: var(--color-text-secondary);
}

.activity-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.activity-title {
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 500;
}

.activity-time {
  color: var(--color-text-secondary);
  font-size: 12px;
}
</style>

<template>
  <div class="user-profile" v-if="globalStore.isAuthenticated">
    <div class="user-info">
      <div class="avatar">
        <img v-if="globalStore.user?.avatar" :src="globalStore.user.avatar" :alt="globalStore.user.name" />
        <div v-else class="avatar-placeholder">
          {{ globalStore.user?.name?.charAt(0) || 'U' }}
        </div>
      </div>
      <div class="user-details">
        <h3>{{ globalStore.user?.name || 'Unknown User' }}</h3>
        <p class="user-role">{{ globalStore.user?.role || 'member' }}</p>
        <p class="user-account">{{ globalStore.user?.account || 'N/A' }}</p>
      </div>
    </div>
    <button @click="handleLogout" class="logout-btn">退出登录</button>
  </div>
</template>

<script setup>
import { useGlobalStore } from '../stores/global'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const globalStore = useGlobalStore()
const router = useRouter()

const handleLogout = () => {
  globalStore.clearAuth()
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<style scoped>
.user-profile {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--color-card-bg, #fff);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--color-primary, #007bff);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  color: white;
  font-weight: bold;
  font-size: 18px;
}

.user-details h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary, #333);
}

.user-role {
  margin: 0 0 2px 0;
  font-size: 12px;
  color: var(--color-text-secondary, #666);
  text-transform: capitalize;
}

.user-account {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-muted, #999);
}

.logout-btn {
  padding: 8px 16px;
  background: var(--color-danger, #dc3545);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background: var(--color-danger-dark, #c82333);
}
</style>

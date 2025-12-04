<template>
  <div class="family-page">
    <div class="page-header">
      <h2>家庭管理</h2>
      <button 
        class="create-family-btn"
        @click="openCreateFamilyModal"
        :disabled="familys.length >= 6"
        :title="familys.length >= 6 ? '最多只能创建6个家庭' : '创建家庭'"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        创建家庭
      </button>
    </div>

    <div v-if="globalStore.loading.familys" class="loading-container">
      <div class="loading-text">加载中...</div>
    </div>

    <div v-else-if="familys.length === 0" class="empty-container">
      <div class="empty-text">暂无家庭数据</div>
    </div>

    <div v-else class="familys-container">
      <div 
        v-for="family in familys" 
        :key="family.id"
        class="family-card"
      >
        <!-- 家庭头部信息 -->
        <div class="family-header">
          <div class="family-avatar">
            <img 
              v-if="family.avatar" 
              :src="family.avatar" 
              :alt="family.name"
              @error="$event.target.src = DEFAULT_NO_AVATAR_URL"
            />
            <div v-else class="avatar-placeholder">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
            </div>
          </div>
          <div class="family-info">
            <h3 class="family-name">{{ family.name }}</h3>
            <p v-if="family.description" class="family-description">{{ family.description }}</p>
            <div class="family-meta">
              <span class="invite-code">邀请码: {{ family.invite_code }}</span>
              <span class="created-time">{{ formatDate(family.created_at) }}</span>
            </div>
          </div>
          <div class="family-actions">
            <button 
              v-if="isCreator(family)" 
              class="action-btn danger" 
              @click="openDeleteFamilyModal(family)"
              title="删除家庭"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              删除家庭
            </button>
            <button 
              class="action-btn" 
              @click="openLeaveFamilyModal(family)"
              title="退出家庭"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              退出家庭
            </button>
          </div>
        </div>

        <!-- 家庭成员 -->
        <div class="family-section">
          <div class="section-header">
            <h4>家庭成员</h4>
            <span class="member-count">{{ familyMembers(family.id).length }} 人</span>
          </div>
          <div v-if="familyMembers(family.id).length === 0" class="empty-members">
            暂无成员
          </div>
          <div v-else class="members-list">
            <div 
              v-for="member in familyMembers(family.id)" 
              :key="member.id"
              class="member-item"
            >
              <img 
                :src="member.account?.avatar || member.avatar || DEFAULT_NO_AVATAR_URL" 
                :alt="member.account?.nickname || member.nickname || '用户'"
                class="member-avatar"
                @error="$event.target.src = DEFAULT_NO_AVATAR_URL"
              />
              <div class="member-info">
                <div class="member-name">
                  {{ member.account?.nickname || member.nickname || `用户 ${member.account_id}` }}
                  <span v-if="member.role && member.role !== 'member'" class="member-role">
                    ({{ member.role === 'creator' ? '创建者' : member.role }})
                  </span>
                </div>
                <div class="member-email">
                  {{ member.account?.email || member.email || '未设置邮箱' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 家庭设备 -->
        <div class="family-section">
          <div class="section-header">
            <h4>家庭设备</h4>
            <span class="device-count">{{ familyDevices(family.id).length }} 台</span>
          </div>
          <div v-if="familyDevices(family.id).length === 0" class="empty-devices">
            暂无设备
          </div>
          <div v-else class="devices-list">
            <div 
              v-for="device in familyDevices(family.id)" 
              :key="device.id"
              class="device-item"
            >
              <div class="device-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
                  <circle cx="8" cy="8" r="1" fill="currentColor"/>
                  <circle cx="16" cy="8" r="1" fill="currentColor"/>
                  <path d="M8 14h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="device-info">
                <div class="device-name">{{ device.name }}</div>
                <div class="device-sn">{{ device.sn }}</div>
                <div class="device-status" :class="device.status">
                  <span class="status-dot"></span>
                  {{ getStatusText(device.status) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建家庭弹窗 -->
    <div v-if="showCreateFamilyModal" class="modal-overlay" @click="handleModalOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>创建家庭</h2>
          <button class="close-btn" @click="closeCreateFamilyModal">×</button>
        </div>
        <form @submit.prevent="createFamilyHandler" class="family-form">
          <div class="form-group">
            <label>家庭头像</label>
            <AvatarSelector 
              v-model="newFamily.avatar"
              :current-user-avatar="''"
            />
          </div>
          
          <div class="form-group">
            <label>家庭名称 *</label>
            <input 
              v-model="newFamily.name" 
              type="text" 
              required 
              placeholder="请输入家庭名称"
              :disabled="isCreating"
            />
          </div>
          
          <div class="form-group">
            <label>家庭描述</label>
            <textarea 
              v-model="newFamily.description" 
              placeholder="请输入家庭描述（可选）"
              rows="3"
              :disabled="isCreating"
            ></textarea>
          </div>
          
          <div v-if="createFamilyError" class="error-message">
            {{ createFamilyError }}
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeCreateFamilyModal" class="cancel-btn" :disabled="isCreating">取消</button>
            <button type="submit" class="submit-btn" :disabled="isCreating || !newFamily.name.trim()">
              {{ isCreating ? '创建中...' : '创建' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 删除家庭确认弹窗 -->
    <div v-if="showDeleteFamilyModal" class="modal-overlay" @click="closeDeleteFamilyModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>确认删除家庭</h2>
          <button class="close-btn" @click="closeDeleteFamilyModal">×</button>
        </div>
        <div class="confirm-content">
          <p class="warning-text">确定要删除家庭 "{{ deletingFamily?.name }}" 吗？此操作不可恢复。</p>
          <div class="form-actions">
            <button type="button" @click="closeDeleteFamilyModal" class="cancel-btn" :disabled="isDeletingFamily">取消</button>
            <button type="button" @click="confirmDeleteFamily" class="submit-btn danger" :disabled="isDeletingFamily">
              {{ isDeletingFamily ? '删除中...' : '确认删除' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 退出家庭确认弹窗 -->
    <div v-if="showLeaveFamilyModal" class="modal-overlay" @click="closeLeaveFamilyModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>确认退出家庭</h2>
          <button class="close-btn" @click="closeLeaveFamilyModal">×</button>
        </div>
        <div class="confirm-content">
          <p v-if="isCreator(leavingFamily)" class="warning-text">您是家庭创建者，退出家庭后家庭将被删除。确定要退出吗？</p>
          <p v-else class="warning-text">确定要退出家庭 "{{ leavingFamily?.name }}" 吗？</p>
          <div class="form-actions">
            <button type="button" @click="closeLeaveFamilyModal" class="cancel-btn" :disabled="isLeavingFamily">取消</button>
            <button type="button" @click="confirmLeaveFamily" class="submit-btn danger" :disabled="isLeavingFamily">
              {{ isLeavingFamily ? '退出中...' : '确认退出' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useGlobalStore } from '../stores/global'
import { DEFAULT_NO_AVATAR_URL } from '../utils/theme'
import { createFamily, deleteFamily, leaveFamily, getFamilyMembers } from '../api/users'
import { getFamilyDevices } from '../api/devices'
import { ElMessage } from 'element-plus'
import AvatarSelector from '../components/AvatarSelector.vue'

const globalStore = useGlobalStore()

// 家庭列表
const familys = computed(() => globalStore.familys || [])

// 创建家庭相关状态
const showCreateFamilyModal = ref(false)
const isCreating = ref(false)
const createFamilyError = ref('')
const newFamily = ref({
  name: '',
  avatar: '',
  description: ''
})

// 删除家庭相关状态
const showDeleteFamilyModal = ref(false)
const isDeletingFamily = ref(false)
const deletingFamily = ref(null)

// 退出家庭相关状态
const showLeaveFamilyModal = ref(false)
const isLeavingFamily = ref(false)
const leavingFamily = ref(null)

// 存储每个家庭的成员和设备数据
const familyMembersData = ref(new Map())
const familyDevicesData = ref(new Map())
const loadingMembers = ref(new Set())
const loadingDevices = ref(new Set())

// 加载家庭成员数据
const loadFamilyMembers = async (familyId) => {
  if (loadingMembers.value.has(familyId)) return
  if (familyMembersData.value.has(familyId)) return
  
  loadingMembers.value.add(familyId)
  try {
    const members = await getFamilyMembers(familyId, { skip: 0, limit: 100 })
    familyMembersData.value.set(familyId, Array.isArray(members) ? members : [])
  } catch (error) {
    console.error(`加载家庭成员失败 (familyId: ${familyId}):`, error)
    familyMembersData.value.set(familyId, [])
  } finally {
    loadingMembers.value.delete(familyId)
  }
}

// 加载家庭设备数据
const loadFamilyDevices = async (familyId) => {
  if (loadingDevices.value.has(familyId)) return
  if (familyDevicesData.value.has(familyId)) return
  
  loadingDevices.value.add(familyId)
  try {
    const devices = await getFamilyDevices(familyId, { skip: 0, limit: 100 })
    familyDevicesData.value.set(familyId, Array.isArray(devices) ? devices : [])
  } catch (error) {
    console.error(`加载家庭设备失败 (familyId: ${familyId}):`, error)
    familyDevicesData.value.set(familyId, [])
  } finally {
    loadingDevices.value.delete(familyId)
  }
}

// 获取家庭成员
const familyMembers = (familyId) => {
  return familyMembersData.value.get(familyId) || []
}

// 判断当前用户是否是家庭创建者
// 根据角色判断：role 不是 "member" 的可能是创建者
const isCreator = (family) => {
  if (!family || !globalStore.user?.account) return false
  
  const members = familyMembers(family.id)
  const currentUserMember = members.find(m => m.account_id === globalStore.user.account.id)
  
  // 如果当前用户是成员且 role 不是 "member"，则认为是创建者
  if (currentUserMember && currentUserMember.role !== 'member') {
    return true
  }
  
  // 如果没有找到成员信息，检查家庭数据中是否有 creator_id
  if (family.creator_id) {
    return family.creator_id === globalStore.user.account.id
  }
  
  return false
}

// 获取当前用户在指定家庭中的 family_member_id
const getCurrentUserFamilyMemberId = (familyId) => {
  const members = familyMembers(familyId)
  const currentUserMember = members.find(m => m.account_id === globalStore.user?.account?.id)
  // 返回的 id 就是 family_member_id
  return currentUserMember?.id || null
}

// 获取家庭设备
const familyDevices = (familyId) => {
  return familyDevicesData.value.get(familyId) || []
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 获取设备状态文本
const getStatusText = (status) => {
  const statusMap = {
    'unconfigured': '未配置',
    'configured': '已配置',
    'unbound': '未绑定',
    'bound': '已绑定',
    'online': '在线',
    'offline': '离线',
    'fault': '故障'
  }
  return statusMap[status] || status
}

// 打开创建家庭弹窗
const openCreateFamilyModal = () => {
  if (familys.value.length >= 6) {
    ElMessage.warning('最多只能创建6个家庭')
    return
  }
  newFamily.value = {
    name: '',
    avatar: '',
    description: ''
  }
  createFamilyError.value = ''
  showCreateFamilyModal.value = true
}

// 关闭创建家庭弹窗
const closeCreateFamilyModal = () => {
  showCreateFamilyModal.value = false
  createFamilyError.value = ''
  newFamily.value = {
    name: '',
    avatar: '',
    description: ''
  }
}

// 处理模态框背景点击
const handleModalOverlayClick = (e) => {
  if (e.target === e.currentTarget) {
    closeCreateFamilyModal()
  }
}

// 创建家庭
const createFamilyHandler = async () => {
  if (familys.value.length >= 6) {
    createFamilyError.value = '最多只能创建6个家庭'
    return
  }

  if (!newFamily.value.name.trim()) {
    createFamilyError.value = '请输入家庭名称'
    return
  }

  isCreating.value = true
  createFamilyError.value = ''

  try {
    const newFamilyData = await createFamily({
      name: newFamily.value.name.trim(),
      avatar: newFamily.value.avatar || null,
      description: newFamily.value.description.trim() || null
    })
    
    // 重新加载家庭列表
    await globalStore.loadFamilys()
    
    // 如果返回了新创建的家庭数据，立即加载其成员和设备数据
    if (newFamilyData?.id) {
      await Promise.all([
        loadFamilyMembers(newFamilyData.id),
        loadFamilyDevices(newFamilyData.id)
      ])
    }
    
    closeCreateFamilyModal()
    ElMessage.success('创建家庭成功')
  } catch (error) {
    console.error('创建家庭失败:', error)
    createFamilyError.value = error.response?.data?.detail || '创建家庭失败，请重试'
  } finally {
    isCreating.value = false
  }
}

// 打开删除家庭弹窗
const openDeleteFamilyModal = (family) => {
  deletingFamily.value = family
  showDeleteFamilyModal.value = true
}

// 关闭删除家庭弹窗
const closeDeleteFamilyModal = () => {
  showDeleteFamilyModal.value = false
  deletingFamily.value = null
}

// 确认删除家庭
const confirmDeleteFamily = async () => {
  if (!deletingFamily.value) return

  const familyId = deletingFamily.value.id
  isDeletingFamily.value = true
  try {
    await deleteFamily(familyId)
    // 清除缓存的数据
    familyMembersData.value.delete(familyId)
    familyDevicesData.value.delete(familyId)
    // 重新加载家庭列表
    await globalStore.loadFamilys()
    closeDeleteFamilyModal()
    ElMessage.success('删除家庭成功')
  } catch (error) {
    console.error('删除家庭失败:', error)
    ElMessage.error(error.response?.data?.detail || '删除家庭失败，请重试')
  } finally {
    isDeletingFamily.value = false
  }
}

// 打开退出家庭弹窗
const openLeaveFamilyModal = (family) => {
  leavingFamily.value = family
  showLeaveFamilyModal.value = true
}

// 关闭退出家庭弹窗
const closeLeaveFamilyModal = () => {
  showLeaveFamilyModal.value = false
  leavingFamily.value = null
}

// 确认退出家庭
const confirmLeaveFamily = async () => {
  if (!leavingFamily.value) return

  // 如果是创建者，提示
  if (isCreator(leavingFamily.value)) {
    ElMessage.warning('创建者退出家庭后，家庭将被删除')
  }

  const familyId = leavingFamily.value.id
  const familyMemberId = getCurrentUserFamilyMemberId(familyId)
  if (!familyMemberId) {
    ElMessage.error('无法获取家庭成员ID，请刷新页面后重试')
    return
  }

  isLeavingFamily.value = true
  try {
    await leaveFamily(familyMemberId)
    // 清除缓存的数据
    familyMembersData.value.delete(familyId)
    familyDevicesData.value.delete(familyId)
    // 重新加载家庭列表
    await globalStore.loadFamilys()
    closeLeaveFamilyModal()
    ElMessage.success('退出家庭成功')
  } catch (error) {
    console.error('退出家庭失败:', error)
    ElMessage.error(error.response?.data?.detail || '退出家庭失败，请重试')
  } finally {
    isLeavingFamily.value = false
  }
}

// 加载所有家庭的成员和设备数据
const loadAllFamilyData = async () => {
  if (familys.value.length === 0) {
    await globalStore.loadFamilys()
  }
  
  // 并行加载所有家庭的成员和设备数据
  const loadPromises = familys.value.map(family => {
    return Promise.all([
      loadFamilyMembers(family.id),
      loadFamilyDevices(family.id)
    ])
  })
  
  await Promise.all(loadPromises)
}

// 监听家庭列表变化，自动加载新家庭的成员和设备数据
watch(familys, (newFamilys) => {
  if (newFamilys && newFamilys.length > 0) {
    newFamilys.forEach(family => {
      loadFamilyMembers(family.id)
      loadFamilyDevices(family.id)
    })
  }
}, { immediate: true })

// 加载数据
onMounted(async () => {
  await loadAllFamilyData()
})
</script>

<style scoped>
@import '../styles/colors.css';

.family-page {
  width: 100%;
  padding: 10px 24px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.create-family-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--color-primary);
  color: var(--color-primary-text);
  border: 1px solid var(--color-primary);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.create-family-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.create-family-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.create-family-btn svg {
  width: 16px;
  height: 16px;
}

.loading-container,
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: var(--color-text-secondary);
}

.familys-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.familys-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.family-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.family-card:hover {
  box-shadow: 0 4px 12px var(--shadow-soft);
}

.family-header {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
  position: relative;
}

.family-actions {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin-left: auto;
}

.family-avatar {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--color-bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.family-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
}

.avatar-placeholder svg {
  width: 32px;
  height: 32px;
}

.family-info {
  flex: 1;
}

.family-name {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.family-description {
  margin: 0 0 12px 0;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.family-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.invite-code,
.created-time {
  font-size: 12px;
  color: var(--color-text-muted);
}

.family-section {
  margin-bottom: 24px;
}

.family-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.member-count,
.device-count {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.empty-members,
.empty-devices {
  padding: 24px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 14px;
}

.members-list,
.devices-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.member-item,
.device-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.member-item:hover,
.device-item:hover {
  background: var(--color-hover);
}

.member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.member-info {
  flex: 1;
  min-width: 0;
}

.member-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.member-role {
  font-size: 12px;
  color: var(--color-text-muted);
  font-weight: normal;
}

.member-email {
  font-size: 12px;
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.device-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.device-icon svg {
  width: 24px;
  height: 24px;
}

.device-info {
  flex: 1;
  min-width: 0;
}

.device-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.device-sn {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
  font-family: monospace;
}

.device-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-text-muted);
}

.device-status.online .status-dot {
  background: var(--color-success);
}

.device-status.offline .status-dot {
  background: var(--color-text-muted);
}

.device-status.fault .status-dot {
  background: var(--color-danger);
}

.device-status.bound .status-dot {
  background: var(--color-info);
}

/* 创建家庭弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-modal-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: var(--color-bg-secondary);
  border-radius: 16px;
  padding: 20px;
  width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px var(--shadow-soft);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

.modal-content::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

.modal-content {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: var(--color-text-primary);
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.family-form {
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 6px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  font-size: 14px;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-group input:disabled,
.form-group textarea:disabled {
  background: var(--color-disabled-bg);
  color: var(--color-disabled-text);
  cursor: not-allowed;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 16px;
  flex-shrink: 0;
}

.cancel-btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover:not(:disabled) {
  background: var(--color-hover);
  color: var(--color-text-primary);
}

.cancel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid var(--color-primary);
  background: var(--color-primary);
  color: var(--color-primary-text);
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  color: var(--color-danger);
  font-size: 14px;
  margin-top: 8px;
  padding: 8px 12px;
  background: var(--color-danger-light);
  border-radius: 6px;
  border: 1px solid var(--color-danger);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover:not(:disabled) {
  background: var(--color-hover);
  color: var(--color-text-primary);
  border-color: var(--color-border-hover);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.action-btn.danger {
  border-color: var(--color-danger);
  color: var(--color-danger);
  background: transparent;
}

.action-btn.danger:hover:not(:disabled) {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.confirm-content {
  padding: 20px 0;
}

.warning-text {
  color: var(--color-text-primary);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 24px;
}

.submit-btn.danger {
  background: var(--color-danger);
  border-color: var(--color-danger);
  color: white;
}

.submit-btn.danger:hover:not(:disabled) {
  background: var(--color-danger-hover);
  border-color: var(--color-danger-hover);
}
</style>


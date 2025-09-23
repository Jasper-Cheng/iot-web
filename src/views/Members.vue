<template>
  <div class="members-page">
    <div class="page-header">
      <div class="header-info">
        <button 
        class="add-member-btn" 
        @click="openAddMemberModal"
        :disabled="familyMembers.length >= 6"
        :class="{ disabled: familyMembers.length >= 6 }"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        {{ familyMembers.length >= 6 ? '已达上限' : '添加成员' }}
      </button>
        <div class="member-count">
          <span class="count-text">当前成员: {{ familyMembers.length }}/6</span>
          <div class="count-bar">
            <div class="count-progress" :style="{ width: (familyMembers.length / 6) * 100 + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 树状结构显示 -->
    <div class="members-tree">
       <div 
         v-for="(member, index) in familyMembers" 
         :key="member.id"
         class="member-node"
         :class="{ collapsed: !expandedMembers.includes(member.id) }"
         :data-member-index="index + 1"
       >
        <!-- 成员信息 -->
        <div class="member-header" @click="toggleMemberExpanded(member.id)">
          <div class="member-info">
            <div class="member-avatar">
              <img :src="member.avatar" :alt="member.name">
              <div class="status-indicator" :class="member.status"></div>
            </div>
            <div class="member-details">
              <h3>{{ member.name }}</h3>
              <p>{{ member.email }}</p>
              <span class="role-badge" :class="member.role">{{ getRoleText(member.role) }}</span>
            </div>
          </div>
          <div class="member-actions">
            <button class="action-btn" @click.stop="openEditModal(member)" title="编辑">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
            </button>
            <button 
              v-if="!member.isOwner" 
              class="action-btn danger" 
              @click.stop="openDeleteConfirm(member)" 
              title="删除"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
            </button>
            <div v-else class="admin-badge" title="拥有者不可删除">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
            </div>
            <div class="expand-icon" :class="{ expanded: expandedMembers.includes(member.id) }">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="6,9 12,15 18,9" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- 设备权限控制区域 -->
        <div v-if="expandedMembers.includes(member.id)" class="device-permissions">
          <div class="permissions-header">
            <h4>设备控制权限</h4>
            <div v-if="!member.isOwner" class="permission-actions">
              <button class="action-btn small" @click="selectAllDevices(member.id)">
                全选
              </button>
              <button class="action-btn small" @click="deselectAllDevices(member.id)">
                全不选
              </button>
            </div>
            <div v-else class="admin-permission-note">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
                <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>拥有者拥有所有设备权限</span>
            </div>
          </div>
          
          <div class="devices-grid">
            <div 
              v-for="device in devices" 
              :key="device.id"
              class="device-control-item"
            >
              <div class="device-info">
                <div class="device-icon">
                  <div v-html="getIconByCardName(device.cardName)"></div>
                </div>
                <span class="device-name">{{ device.name }}</span>
              </div>
              <div class="permission-toggle">
                <label class="toggle-switch" :class="{ disabled: member.isOwner }">
                  <input 
                    type="checkbox" 
                    :checked="(member.devicePermissions && member.devicePermissions[device.id]) || false"
                    :disabled="member.isOwner"
                    @change="updateDevicePermission(member.id, device.id, $event.target.checked)"
                  >
                  <span class="toggle-slider"></span>
                </label>
                <div v-if="member.isOwner" class="admin-lock" title="拥有者权限不可修改">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加成员模态框 -->
    <div v-if="showAddMemberModal" class="modal-overlay" @click="handleModalOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ editingMember ? '编辑信息' : '添加成员' }}</h2>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <form @submit.prevent="editingMember ? editMember() : addNewMember()" class="member-form">
          <!-- 头像选择区域 -->
          <div class="avatar-section">
            <AvatarSelector 
              v-model="newMember.avatar"
              :options="avatarOptions"
              :scroll-sensitivity="scrollSensitivity"
              @change="handleAvatarChange"
            />
          </div>
          
          <!-- 基本信息 -->
          <div class="form-row">
            <div class="form-group">
              <label>姓名 *</label>
              <input v-model="newMember.name" type="text" required placeholder="请输入姓名">
            </div>
            <div class="form-group">
              <label>性别 *</label>
              <select v-model="newMember.gender" required>
                <option value="">请选择性别</option>
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>邮件</label>
              <input v-model="newMember.email" type="email" placeholder="请输入邮箱地址">
            </div>
          </div>
          
          <div v-if="!editingMember" class="form-row">
            <div class="form-group">
              <label>角色 *</label>
              <select v-model="newMember.role" required>
                <option value="">请选择角色</option>
                <option value="member">成员</option>
                <option value="owner">拥有者</option>
              </select>
            </div>
            <div class="form-group">
              <!-- 占位，保持布局 -->
            </div>
          </div>
          
          <!-- 高级设置分割线（可点击） -->
          <div class="advanced-settings-divider" @click="toggleAdvancedSettings">
            <div class="divider-line"></div>
            <span class="divider-text">
              {{ showAdvancedSettings ? '收起高级设置' : '展开高级设置' }}
            </span>
            <svg class="toggle-icon" :class="{ expanded: showAdvancedSettings }" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="6,9 12,15 18,9" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            <div class="divider-line"></div>
          </div>
          
          <!-- 高级设置折叠区域 -->
          <div class="advanced-settings" :class="{ collapsed: !showAdvancedSettings }">
            <div class="form-row">
              <div class="form-group">
                <label>电话 *</label>
                <input v-model="newMember.phone" type="tel" required placeholder="请输入电话号码">
              </div>
              <div class="form-group">
                <label>账号 *</label>
                <input v-model="newMember.username" type="text" required placeholder="请输入账号">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>密码 *</label>
                <input v-model="newMember.password" type="password" required placeholder="请输入密码">
              </div>
              <div class="form-group">
                <label>确认密码 *</label>
                <input v-model="newMember.confirmPassword" type="password" required placeholder="请再次输入密码">
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="cancel-btn">取消</button>
            <button type="submit" class="submit-btn">{{ editingMember ? '更新' : '添加成员' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 删除成员确认弹窗 -->
    <div v-if="memberPendingDelete" class="device-modal" @click="closeDeleteConfirm">
      <div class="delete-modal-content" @click.stop>
        <div class="delete-modal-header">
          <h3>删除成员</h3>
          <button class="delete-close-btn" @click="closeDeleteConfirm">X</button>
        </div>
        <div class="delete-modal-body">
          <div class="member-delete-info">
            <div class="member-avatar">
              <img :src="memberPendingDelete.avatar" :alt="memberPendingDelete.name">
            </div>
            <div class="member-details">
              <h4>{{ memberPendingDelete.name }}</h4>
              <p>{{ memberPendingDelete.email }}</p>
              <span class="role-badge" :class="memberPendingDelete.role">{{ getRoleText(memberPendingDelete.role) }}</span>
            </div>
          </div>
          <p class="delete-warning">
            确定要删除成员 "{{ memberPendingDelete.name }}" 吗？此操作不可撤销。
          </p>
        </div>
        <div class="delete-modal-footer">
          <button class="action-btn" @click="closeDeleteConfirm">取消</button>
          <button class="action-btn danger" @click="confirmDeleteMember">删除</button>
        </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { 
  updateMemberDevicePermission,
  addFamilyMember,
  updateFamilyMember,
  deleteFamilyMember
} from '../api/users.js'
import { useGlobalStore } from '../stores/global'
import { getThumbnailByCardName, getIconByCardName } from '../utils/deviceMapping'
import AvatarSelector from '../widgets/AvatarSelector.vue'

// 全局状态
const globalStore = useGlobalStore()

// 响应式数据
const familyMembers = ref([])
const devices = ref([])
const expandedMembers = ref([])
const showAddMemberModal = ref(false)
const loading = ref(false)
const memberPendingDelete = ref(null)
const editingMember = ref(null)

// 新成员表单数据
const newMember = ref({
  name: '',
  gender: '',
  username: '',
  password: '',
  confirmPassword: '',
  phone: '',
  email: '',
  role: 'member',
  avatar: ''
})

// 高级设置展开状态
const showAdvancedSettings = ref(false)

// 头像选项和滚动状态
const avatarOptions = ref([
  'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar1',
  'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar2',
  'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar3',
  'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar4',
  'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar5',
  'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar6',
  'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar7',
  'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar8',
  'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar9',
  'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar10'
])

// 滚动敏感度
const scrollSensitivity = ref(1.5)

// 计算属性
const getRoleText = (role) => {
  const roleMap = {
    member: '成员',
    owner: '拥有者'
  }
  return roleMap[role] || role
}

// 方法
const loadData = async () => {
  loading.value = true
  try {
    // 使用 globalStore 中的数据，映射真实的数据结构
    const members = globalStore.members || []
    const mappedMembers = members.map(member => ({
      id: member.id,
      name: member.account?.name || '未知成员',
      email: member.account?.email || '',
      avatar: member.account?.avatar || `https://api.dicebear.com/7.x/adventurer/png?size=80&seed=${member.account?.name || 'default'}`,
      role: member.isOwner ? 'owner' : (member.account?.role || 'member'),
      status: 'active',
      joinDate: member.created_at ? new Date(member.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      devicePermissions: member.devicePermissions || {},
      // 添加编辑时需要的字段
      username: member.account?.account || '',
      phone: member.account?.phone || '',
      gender: member.account?.gender || '',
      // 保留原始数据字段
      user_id: member.user_id,
      account_id: member.account_id,
      created_at: member.created_at,
      account: member.account,
      // 使用 isOwner 字段（由 globalStore 设置）
      isOwner: member.isOwner || false
    }))
    
    // 直接使用映射后的成员列表，Owner 已经在 globalStore 中排在第一位
    familyMembers.value = mappedMembers
    const globalDevices = globalStore.devices || []
    devices.value = globalDevices
    
    // 默认展开所有成员的设备控制权限
    expandedMembers.value = familyMembers.value.map(member => member.id)
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

const toggleMemberExpanded = (memberId) => {
  const index = expandedMembers.value.indexOf(memberId)
  if (index > -1) {
    expandedMembers.value.splice(index, 1)
  } else {
    expandedMembers.value.push(memberId)
  }
}

const updateDevicePermission = async (memberId, deviceId, hasPermission) => {
  // 检查是否为拥有者
  const member = familyMembers.value.find(m => m.id === memberId)
  if (member && member.isOwner) {
    alert('拥有者权限不可修改')
    return
  }
  
  try {
    const response = await updateMemberDevicePermission(memberId, deviceId, hasPermission)
    if (response.success) {
      // 更新本地数据
      if (member) {
        member.devicePermissions[deviceId] = hasPermission
      }
    }
  } catch (error) {
    console.error('更新权限失败:', error)
  }
}

const selectAllDevices = (memberId) => {
  const member = familyMembers.value.find(m => m.id === memberId)
  if (member) {
    // 检查是否为拥有者
    if (member.isOwner) {
      alert('拥有者权限不可修改')
      return
    }
    
    devices.value.forEach(device => {
      member.devicePermissions[device.id] = true
      updateDevicePermission(memberId, device.id, true)
    })
  }
}

const deselectAllDevices = (memberId) => {
  const member = familyMembers.value.find(m => m.id === memberId)
  if (member) {
    // 检查是否为拥有者
    if (member.isOwner) {
      alert('拥有者权限不可修改')
      return
    }
    
    devices.value.forEach(device => {
      member.devicePermissions[device.id] = false
      updateDevicePermission(memberId, device.id, false)
    })
  }
}

const addNewMember = async () => {
  try {
    const memberData = {
      name: newMember.value.name,
      gender: newMember.value.gender,
      username: newMember.value.username,
      password: newMember.value.password,
      phone: newMember.value.phone,
      email: newMember.value.email,
      role: newMember.value.role,
      avatar: newMember.value.avatar || `https://api.dicebear.com/7.x/adventurer/png?size=80&seed=${newMember.value.name}`,
      devicePermissions: {}
    }
    
    const response = await addFamilyMember(memberData)
    if (response.success) {
      await loadData()
      closeModal()
      resetNewMemberForm()
    } else {
      // 显示错误提示
      alert(response.message || '添加成员失败')
    }
  } catch (error) {
    console.error('添加成员失败:', error)
    alert('添加成员失败，请重试')
  }
}

const editMember = async () => {
  try {
    // 构建更新数据，只包含有值的字段
    const memberData = {
      name: newMember.value.name,
      gender: newMember.value.gender,
      username: newMember.value.username,
      phone: newMember.value.phone,
      email: newMember.value.email,
      role: editingMember.value.isOwner ? 'owner' : newMember.value.role, // 拥有者角色不可更改
      avatar: newMember.value.avatar || `https://api.dicebear.com/7.x/adventurer/png?size=80&seed=${newMember.value.name}`
    }
    
    // 只有当密码不为空时才更新密码
    if (newMember.value.password && newMember.value.password.trim() !== '') {
      memberData.password = newMember.value.password
    }
    
    const response = await updateFamilyMember(editingMember.value.id, memberData)
    if (response.success) {
      await loadData()
      closeModal()
      resetNewMemberForm()
    } else {
      alert(response.message || '更新成员失败')
    }
  } catch (error) {
    console.error('更新成员失败:', error)
    alert('更新成员失败，请重试')
  }
}

// 打开添加成员模态框
const openAddMemberModal = () => {
  showAddMemberModal.value = true
  showAdvancedSettings.value = false
}

const openEditModal = (member) => {
  editingMember.value = member
  
  // 调试输出，确保数据正确
  console.log('编辑成员数据:', member)
  
  newMember.value = {
    name: member.name || '',
    gender: member.gender || '',
    username: member.username || '',
    password: '', // 编辑时不显示密码
    confirmPassword: '', // 编辑时不显示确认密码
    phone: member.phone || '',
    email: member.email || '',
    role: member.role || 'member',
    avatar: member.avatar || ''
  }
  
  // 如果当前头像不在预设选项中，添加到中间位置并选中
  if (member.avatar && !avatarOptions.value.includes(member.avatar)) {
    const middleIndex = Math.floor(avatarOptions.value.length / 2)
    avatarOptions.value.splice(middleIndex, 0, member.avatar)
  }
  
  // 调试输出，确保表单数据正确
  console.log('表单回填数据:', newMember.value)
  
  showAdvancedSettings.value = false // 编辑时默认收起高级设置
  showAddMemberModal.value = true
}

// 打开删除确认弹窗
const openDeleteConfirm = (member) => {
  // 检查是否为拥有者
  if (member.isOwner) {
    alert('拥有者不能被删除')
    return
  }
  memberPendingDelete.value = member
}

// 关闭删除确认弹窗
const closeDeleteConfirm = () => {
  memberPendingDelete.value = null
}

// 确认删除成员
const confirmDeleteMember = async () => {
  const member = memberPendingDelete.value
  if (!member) return
  
  try {
    const response = await deleteFamilyMember(member.id)
    if (response.success) {
      await loadData()
      closeDeleteConfirm()
    } else {
      alert(response.message || '删除成员失败')
    }
  } catch (error) {
    console.error('删除成员失败:', error)
    alert('删除成员失败，请重试')
  }
}

// 处理模态框背景点击
const handleModalOverlayClick = (e) => {
  // 检查点击的是否是模态框背景（而不是内容区域）
  if (e.target === e.currentTarget) {
    closeModal()
  }
}

const closeModal = () => {
  showAddMemberModal.value = false
  editingMember.value = null
  resetNewMemberForm()
  
  // 清理动态添加的头像选项，只保留预设的10个
  if (avatarOptions.value.length > 10) {
    // 找到第一个动态添加的头像（不在原始预设中的）
    const originalAvatars = [
      'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar1',
      'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar2',
      'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar3',
      'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar4',
      'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar5',
      'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar6',
      'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar7',
      'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar8',
      'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar9',
      'https://api.dicebear.com/7.x/adventurer/png?size=80&seed=avatar10'
    ]
    
    // 移除所有不在原始预设中的头像
    avatarOptions.value = avatarOptions.value.filter(avatar => originalAvatars.includes(avatar))
  }
}

const resetNewMemberForm = () => {
  // 选择中间位置的头像作为默认头像
  const middleIndex = Math.floor(avatarOptions.value.length / 2)
  newMember.value = {
    name: '',
    gender: '',
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    email: '',
    role: 'member',
    avatar: avatarOptions.value[middleIndex] || '' // 设置默认头像为中间位置的选项
  }
  showAdvancedSettings.value = false
}

// 切换高级设置展开状态
const toggleAdvancedSettings = () => {
  showAdvancedSettings.value = !showAdvancedSettings.value
}

// 处理头像变化
const handleAvatarChange = (avatar) => {
  newMember.value.avatar = avatar
}



// 生命周期
// 监听 globalStore.members 变化，当数据加载完成时自动更新
watch(() => globalStore.members, (newMembers) => {
  if (newMembers && newMembers.length > 0) {
    loadData()
  }
}, { immediate: true })

onMounted(() => {
  loadData()
})

onUnmounted(() => {
  // 清理工作
})
</script>

<style scoped>
.members-page {
  width: 100%;
  padding: 8px 24px;
  overflow: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.members-page::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 24px;
}

.header-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 24px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
}

.page-header p {
  font-size: 16px;
  color: var(--color-text-secondary);
  margin: 0 0 16px 0;
}

.member-count {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.count-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.count-bar {
  width: 200px;
  height: 6px;
  background-color: var(--color-bg-secondary);
  border-radius: 3px;
  overflow: hidden;
}

.count-progress {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-member-online));
  border-radius: 3px;
  transition: width 0.3s ease;
}

.add-member-btn {
  background-color: var(--color-primary);
  color: var(--color-bg-primary);
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-member-btn:hover:not(.disabled) {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
}

.add-member-btn.disabled {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  cursor: not-allowed;
  opacity: 0.6;
}

.add-member-btn svg {
  width: 16px;
  height: 16px;
}

/* 树状结构样式 */
.members-tree {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-start;
}

.member-node {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  height: auto;
  flex: 1;
  min-width: calc(33.333% - 14px);
  max-width: calc(33.333% - 14px);
}


.member-node.collapsed {
  height: auto;
  min-width: calc(16.666% - 10px);
  max-width: calc(16.666% - 10px);
  flex: 0 0 calc(16.666% - 10px);
}

.member-node:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px var(--color-member-shadow-light);
  transform: translateY(-2px);
}

/* 成员编号标识 */
.member-node::before {
  content: attr(data-member-index);
  position: absolute;
  top: 12px;
  left: 12px;
  width: 24px;
  height: 24px;
  background: var(--color-primary);
  color: var(--color-bg-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  z-index: 1;
}

.member-node.collapsed::before {
  top: 8px;
  left: 8px;
  width: 20px;
  height: 20px;
  font-size: 10px;
}

.member-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 20px 48px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.member-node.collapsed .member-header {
  padding: 12px 16px 12px 40px;
  flex-direction: row;
  align-items: center;
  text-align: left;
  gap: 12px;
}

.member-header:hover {
  background-color: var(--color-bg-secondary);
}

.member-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.member-node.collapsed .member-info {
  flex-direction: row;
  gap: 12px;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.member-avatar {
  position: relative;
}

.member-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.member-node.collapsed .member-avatar img {
  width: 32px;
  height: 32px;
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid var(--color-bg-card);
}

.status-indicator.active {
  background-color: var(--color-member-online);
}

.status-indicator.inactive {
  background-color: var(--color-member-offline);
}


.member-details h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 4px 0;
}


.member-details p {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0 0 8px 0;
}

.member-node.collapsed .member-details {
  min-width: 0;
  flex: 1;
}

.member-node.collapsed .member-details h3 {
  font-size: 14px;
  margin: 0 0 2px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.member-node.collapsed .member-details p {
  font-size: 12px;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.member-node.collapsed .role-badge {
  font-size: 10px;
  padding: 2px 6px;
}

.role-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.role-badge.member {
  background-color: var(--color-member-info-bg);
  color: var(--color-member-info-text);
}

.role-badge.owner  {
  background: var(--color-primary);
  color: var(--color-primary-text);
}

.member-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.member-node.collapsed .member-actions {
  flex-direction: row;
  gap: 6px;
  align-items: center;
  flex-shrink: 0;
}

.action-btn {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.member-node.collapsed .action-btn {
  width: 24px;
  height: 24px;
}

.action-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.action-btn.danger:hover {
  border-color: var(--color-member-border-danger);
  color: var(--color-member-border-danger);
}

.action-btn.small {
  width: auto;
  height: 28px;
  padding: 0 12px;
  font-size: 12px;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.member-node.collapsed .action-btn svg {
  width: 12px;
  height: 12px;
}

.admin-badge {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-member-text-warning);
  background: var(--color-member-bg-warning);
  border-radius: 6px;
  cursor: help;
}

.member-node.collapsed .admin-badge {
  width: 24px;
  height: 24px;
}

.admin-badge svg {
  width: 16px;
  height: 16px;
}

.member-node.collapsed .admin-badge svg {
  width: 12px;
  height: 12px;
}

.admin-permission-note {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-style: italic;
}

.admin-permission-note svg {
  width: 16px;
  height: 16px;
  color: var(--color-member-text-warning);
}

.permission-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-switch.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-switch.disabled .toggle-slider {
  cursor: not-allowed;
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.toggle-switch.disabled input:checked + .toggle-slider {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.admin-lock {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: var(--color-member-text-warning);
  cursor: help;
}

.admin-lock svg {
  width: 14px;
  height: 14px;
}

.expand-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: transform 0.3s ease;
}

.member-node.collapsed .expand-icon {
  width: 20px;
  height: 20px;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.expand-icon svg {
  width: 16px;
  height: 16px;
}

.member-node.collapsed .expand-icon svg {
  width: 12px;
  height: 12px;
}

/* 设备权限区域 */
.device-permissions {
  border-top: 1px solid var(--color-border);
  background-color: var(--color-bg-card);
  padding: 20px 24px;
}

.permissions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.permissions-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.permission-actions {
  display: flex;
  gap: 8px;
}

.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.device-control-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.device-control-item:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px var(--color-member-shadow-light);
}

.device-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.device-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-button-dark);
  position: relative;
  padding: 2px;
}

.device-icon svg {
  width: 14px;
  height: 14px;
  color: var(--color-text-secondary);
  display: block;
}

.device-icon > div {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.device-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

/* 切换开关样式 */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-switch-indicator);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: var(--color-switch-indicator-active);
  border-radius: 50%;
  transition: all 0.3s ease;
}

input:checked + .toggle-slider {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-shadow-overlay);
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

/* 隐藏滚动条但保持滚动功能 */
.modal-content::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

.modal-content {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
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

.member-form {
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 6px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  font-size: 14px;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-group select.disabled {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  cursor: not-allowed;
  opacity: 0.6;
}

.admin-role-note {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  color: var(--color-text-secondary);
  font-size: 12px;
  font-style: italic;
}

.admin-role-note svg {
  width: 14px;
  height: 14px;
  color: var(--color-member-text-warning);
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

.cancel-btn:hover {
  background: var(--color-hover);
  color: var(--color-text-primary);
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

.submit-btn:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

/* 高级设置分割线（可点击） */
.advanced-settings-divider {
  display: flex;
  align-items: center;
  margin: 24px 0 16px 0;
  gap: 12px;
  cursor: pointer;
  padding: 8px 0;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.advanced-settings-divider:hover {
  background: var(--color-hover);
}

.divider-line {
  flex: 1;
  height: 1px;
  background: var(--color-border);
  transition: background-color 0.3s ease;
}

.advanced-settings-divider:hover .divider-line {
  background: var(--color-primary);
}

.divider-text {
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.advanced-settings-divider:hover .divider-text {
  color: var(--color-primary);
}

/* 高级设置折叠区域 */
.advanced-settings {
  overflow: hidden;
  transition: all 0.3s ease;
  max-height: 200px;
  opacity: 1;
}

.advanced-settings.collapsed {
  max-height: 0;
  opacity: 0;
  margin: 0;
}

.toggle-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.toggle-icon.expanded {
  transform: rotate(180deg);
}

/* 头像选择器样式 */
.avatar-section {
  margin-bottom: 16px;
  padding: 4px 0 12px 0;
  border-bottom: 1px solid var(--color-border);
}


/* 删除成员确认弹窗样式 */
.device-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-member-modal-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.delete-modal-content {
  background: var(--color-bg-card);
  border-radius: 14px;
  padding: 20px;
  max-width: 420px;
  width: 90%;
  box-shadow: 0 12px 32px var(--color-member-shadow-medium);
}

.delete-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border);
}

.delete-modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.delete-close-btn {
  background: none;
  border: 1px solid var(--color-border);
  width: 28px;
  height: 28px;
  border-radius: 6px;
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.delete-close-btn:hover {
  color: var(--color-text-primary);
  border-color: var(--color-text-primary);
}

.delete-modal-body {
  margin: 8px 0 16px;
}

.member-delete-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  padding: 16px;
  background: var(--color-bg-secondary);
  border-radius: 8px;
}

.member-delete-info .member-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.member-delete-info .member-details h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 4px 0;
}

.member-delete-info .member-details p {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0 0 8px 0;
}

.delete-warning {
  margin: 0;
  line-height: 1.6;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.delete-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--color-border);
}

/* 删除弹窗中的按钮样式 - 参考删除房间弹窗 */
.delete-modal-footer .action-btn {
  padding: 16px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  min-width: 66px;
}

.delete-modal-footer .action-btn:hover {
  background: var(--color-primary);
  color: var(--color-primary-text);
  border-color: var(--color-primary);
}

.delete-modal-footer .action-btn.danger {
  background: color-mix(in oklab, var(--color-danger) 10%, transparent);
  color: var(--color-danger);
  border-color: color-mix(in oklab, var(--color-danger) 30%, transparent);
}

.delete-modal-footer .action-btn.danger:hover {
  background: var(--color-danger);
  color: var(--color-white);
  border-color: var(--color-danger);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .member-node {
    min-width: calc(50% - 10px);
    max-width: calc(50% - 10px);
  }
  
  .member-node.collapsed {
    min-width: calc(25% - 8px);
    max-width: calc(25% - 8px);
    flex: 0 0 calc(25% - 8px);
  }
}

@media (max-width: 768px) {
  .member-node {
    min-width: calc(100% - 0px);
    max-width: calc(100% - 0px);
  }
  
  .member-node.collapsed {
    min-width: calc(50% - 10px);
    max-width: calc(50% - 10px);
    flex: 0 0 calc(50% - 10px);
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .header-info {
    text-align: center;
  }
  
  .count-bar {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
  
  .devices-grid {
    grid-template-columns: 1fr;
  }
  
  .member-header {
    padding: 16px 16px 16px 40px;
  }
  
  .member-node::before {
    top: 8px;
    left: 8px;
    width: 20px;
    height: 20px;
    font-size: 10px;
  }
  
  .device-permissions {
    padding: 16px;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .members-page {
    padding: 8px 16px;
  }
  
  .member-header {
    padding: 12px 12px 12px 36px;
  }
  
  .member-avatar img {
    width: 40px;
    height: 40px;
  }
  
  .member-details h3 {
    font-size: 16px;
  }
  
  .member-details p {
    font-size: 12px;
  }
}
</style>

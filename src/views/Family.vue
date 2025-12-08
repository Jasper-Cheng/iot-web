<template>
  <div class="family-page">
    <div class="page-header">
      <h2>家庭管理</h2>
      <div class="header-actions">
        <button 
          class="switch-family-btn"
          @click="openSwitchFamilyModal"
          title="切换家庭"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" fill="none"/>
            <path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
          切换家庭
        </button>
        <span class="family-count">{{ familys.length }}/6</span>
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
    </div>

    <div v-if="globalStore.loading.familys" class="loading-container">
      <div class="loading-text">加载中...</div>
    </div>

    <div v-else-if="!currentFamily" class="empty-container">
      <div class="empty-content">
        <div class="empty-text">当前没有选择家庭</div>
        <div class="empty-actions">
          <button class="create-family-btn" @click="openCreateFamilyModal">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            创建家庭
          </button>
          <button 
            v-if="familys.length > 0"
            class="switch-family-btn" 
            @click="openSwitchFamilyModal"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            选择家庭
          </button>
        </div>
      </div>
    </div>

    <div v-else class="family-container">
      <div class="family-card">
        <!-- 家庭头部信息 -->
        <div class="family-header">
          <div class="family-avatar">
            <img 
              v-if="currentFamily.avatar" 
              :src="currentFamily.avatar" 
              :alt="currentFamily.name"
              @error="$event.target.src = DEFAULT_NO_AVATAR_URL"
            />
            <div v-else class="avatar-placeholder">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
            </div>
          </div>
          <div class="family-info">
            <h3 class="family-name">
              {{ currentFamily.name }}
              <span class="family-label">当前管理</span>
            </h3>
            <p v-if="currentFamily.description" class="family-description">{{ currentFamily.description }}</p>
            <div class="family-meta">
              <span class="invite-code">邀请码: {{ currentFamily.invite_code }}</span>
              <span class="created-time">{{ formatDate(currentFamily.created_at) }}</span>
            </div>
          </div>
          <div class="family-actions">
            <button 
              class="action-btn secondary" 
              @click="switchToPersonalDevices"
              title="切回个人设备管理"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M12 2v20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              切回个人设备管理
            </button>
            <button 
              v-if="isCreator(currentFamily)"
              class="action-btn danger" 
              @click="openDeleteFamilyModal(currentFamily)"
              title="删除家庭"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              删除家庭
            </button>
          </div>
        </div>

        <!-- 家庭成员 -->
        <div class="family-section">
          <div class="section-header">
            <h4>家庭成员</h4>
            <div class="section-header-actions">
              <span class="member-count">{{ familyMembers.length }} 人</span>
              <button 
                class="invite-member-btn"
                @click="generateInviteLink(currentFamily)"
                title="邀请成员"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                邀请成员
              </button>
            </div>
          </div>
          <div v-if="familyMembers.length === 0" class="empty-members">
            暂无成员
          </div>
          <div v-else class="members-list">
            <div 
              v-for="member in familyMembers" 
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
                  <span class="member-nickname">{{ member.nickname }}</span>
                  <button 
                    v-if="isCurrentUser(member) || isCreator(currentFamily)"
                    class="member-edit-btn-inline"
                    @click="openEditMemberNicknameModal(currentFamily, member)"
                    :title="isCurrentUser(member) ? '编辑我在家庭的昵称' : '编辑成员昵称'"
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <span v-if="member.role && member.role !== 'member'" class="member-role">
                    ({{ member.role === 'creator' ? '创建者' : member.role }})
                  </span>
                </div>
                <div class="member-details">
                  <div class="member-detail-item" v-if="member.account?.nickname">
                    <span class="detail-label">账户昵称：</span>
                    <span class="detail-value">{{ member.account.nickname }}</span>
                  </div>
                  <div class="member-detail-item" v-if="member.account?.gender">
                    <span class="detail-label">性别：</span>
                    <span class="detail-value">{{ getGenderText(member.account.gender) }}</span>
                  </div>
                  <div class="member-detail-item" v-if="member.account?.phone">
                    <span class="detail-label">手机：</span>
                    <span class="detail-value">{{ member.account.phone }}</span>
                  </div>
                  <div class="member-detail-item" v-if="member.account?.email">
                    <span class="detail-label">邮箱：</span>
                    <span class="detail-value">{{ member.account.email }}</span>
                  </div>
                </div>
              </div>
              <div class="member-actions">
                <button 
                  v-if="isCurrentUser(member) || isCreator(currentFamily)"
                  class="member-leave-btn"
                  @click="handleMemberLeave(currentFamily, member)"
                  :title="isCurrentUser(member) ? '退出家庭' : '移除成员'"
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 家庭设备 -->
        <div class="family-section">
          <div class="section-header">
            <h4>家庭设备</h4>
            <div class="section-header-actions">
              <span class="device-count">{{ familyDevices().length }} 台</span>
              <button 
                class="add-device-btn"
                @click="openAddDeviceToFamilyModal(currentFamily)"
                title="添加设备到家庭"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                添加设备
              </button>
            </div>
          </div>
          <div v-if="familyDevices().length === 0" class="empty-devices">
            暂无设备
          </div>
          <div v-else class="devices-list">
            <div 
              v-for="device in familyDevices()" 
              :key="device.id"
              class="device-item"
            >
              <div class="device-thumbnail">
                <img 
                  v-if="getDeviceThumbnail(device)"
                  :src="getDeviceThumbnail(device)" 
                  :alt="device.name"
                  class="device-thumbnail-img"
                  @error="$event.target.src = '/thumbnails/devices/smart_light.png'"
                />
                <div v-else class="device-thumbnail-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
                    <circle cx="8" cy="8" r="1" fill="currentColor"/>
                    <circle cx="16" cy="8" r="1" fill="currentColor"/>
                    <path d="M8 14h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
              </div>
              <div class="device-info">
                <div class="device-info-item">
                  <span class="device-label">名称：</span>
                  <span class="device-value">{{ device.name }}</span>
                  <button 
                    class="device-edit-btn-inline"
                    @click="openEditDeviceNameModal(currentFamily, device)"
                    title="编辑设备名称"
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div class="device-info-item">
                  <span class="device-label">序列号：</span>
                  <span class="device-value device-sn-value">{{ device.sn }}</span>
                </div>
                <div class="device-info-item" v-if="getDeviceOwner(device)">
                  <span class="device-label">来自：</span>
                  <span class="device-value">{{ getDeviceOwner(device) }}</span>
                </div>
                <div class="device-info-item">
                  <span class="device-label">状态：</span>
                  <div class="device-status" :class="device.status">
                    <span class="status-dot"></span>
                    <span class="device-value">{{ getStatusText(device.status) }}</span>
                  </div>
                </div>
              </div>
              <button 
                class="device-remove-btn"
                @click="openRemoveDeviceModal(currentFamily, device)"
                title="移除设备"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 切换家庭弹窗 -->
    <div v-if="showSwitchFamilyModal" class="modal-overlay" @click="closeSwitchFamilyModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>切换家庭</h2>
          <button class="close-btn" @click="closeSwitchFamilyModal">×</button>
        </div>
        <div class="modal-body">
          <div v-if="familys.length === 0" class="empty-text">暂无家庭，请先创建家庭</div>
          <div v-else class="family-select-list">
            <div 
              v-for="family in familys" 
              :key="family.id"
              class="family-select-item"
              :class="{ 'active': currentFamilyId === family.id }"
              @click="selectFamily(family)"
            >
              <div class="family-select-avatar">
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
              <div class="family-select-info">
                <div class="family-select-name">
                  {{ family.name }}
                  <span v-if="currentFamilyId === family.id" class="current-badge">当前</span>
                </div>
                <div v-if="family.description" class="family-select-description">{{ family.description }}</div>
                <div class="family-select-meta">
                  <span class="invite-code">邀请码: {{ family.invite_code }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="switch-family-actions">
            <button 
              v-if="currentFamilyId"
              class="switch-to-personal-btn"
              @click="switchToPersonalDevices"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M12 2v20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              切回个人设备管理
            </button>
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
          <h2>{{ isRemovingMember ? '确认移除成员' : '确认退出家庭' }}</h2>
          <button class="close-btn" @click="closeLeaveFamilyModal">×</button>
        </div>
        <div class="confirm-content">
          <p v-if="isRemovingMember" class="warning-text">
            确定要移除成员 "{{ leavingMember?.account?.nickname || leavingMember?.nickname || '用户' }}" 吗？
          </p>
          <p v-else-if="isCreator(leavingFamily)" class="warning-text">您是家庭创建者，退出家庭后家庭将被删除。确定要退出吗？</p>
          <p v-else class="warning-text">确定要退出家庭 "{{ leavingFamily?.name }}" 吗？</p>
          <div class="form-actions">
            <button type="button" @click="closeLeaveFamilyModal" class="cancel-btn" :disabled="isLeavingFamily">取消</button>
            <button type="button" @click="confirmLeaveFamily" class="submit-btn danger" :disabled="isLeavingFamily">
              {{ isLeavingFamily ? (isRemovingMember ? '移除中...' : '退出中...') : (isRemovingMember ? '确认移除' : '确认退出') }}
            </button>
          </div>
        </div>
      </div>
    </div>


    <!-- 编辑成员昵称弹窗 -->
    <div v-if="showEditNicknameModal" class="modal-overlay" @click="closeEditNicknameModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ isEditingOtherMember ? `编辑成员"${editingMember?.nickname || editingMember?.account?.nickname || '用户'}"在家庭"${editingFamily?.name}"的昵称` : `编辑我在家庭"${editingFamily?.name}"的昵称` }}</h2>
          <button class="close-btn" @click="closeEditNicknameModal">×</button>
        </div>
        <form @submit.prevent="confirmEditNickname" class="family-form">
          <div class="form-group">
            <label>昵称 *</label>
            <input 
              v-model="editingNickname" 
              type="text" 
              required 
              placeholder="请输入昵称"
              :disabled="isEditingNickname"
              maxlength="50"
            />
          </div>
          
          <div v-if="editNicknameError" class="error-message">
            {{ editNicknameError }}
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeEditNicknameModal" class="cancel-btn" :disabled="isEditingNickname">取消</button>
            <button type="submit" class="submit-btn" :disabled="isEditingNickname || !editingNickname.trim()">
              {{ isEditingNickname ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 编辑设备名称弹窗 -->
    <div v-if="showEditDeviceNameModal" class="modal-overlay" @click="closeEditDeviceNameModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>编辑设备名称</h2>
          <button class="close-btn" @click="closeEditDeviceNameModal">×</button>
        </div>
        <form @submit.prevent="confirmEditDeviceName" class="family-form">
          <div class="form-group">
            <label>设备名称 *</label>
            <input 
              v-model="editingDeviceName" 
              type="text" 
              required 
              placeholder="请输入设备名称"
              :disabled="isEditingDeviceName"
              maxlength="50"
            />
          </div>
          
          <div v-if="editDeviceNameError" class="error-message">
            {{ editDeviceNameError }}
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeEditDeviceNameModal" class="cancel-btn" :disabled="isEditingDeviceName">取消</button>
            <button type="submit" class="submit-btn" :disabled="isEditingDeviceName || !editingDeviceName.trim()">
              {{ isEditingDeviceName ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 移除设备确认弹窗 -->
    <div v-if="showRemoveDeviceModal" class="modal-overlay" @click="closeRemoveDeviceModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>确认移除设备</h2>
          <button class="close-btn" @click="closeRemoveDeviceModal">×</button>
        </div>
        <div class="confirm-content">
          <p class="warning-text">确定要从家庭中移除设备 "{{ removingDevice?.name }}" 吗？</p>
          <div class="form-actions">
            <button type="button" @click="closeRemoveDeviceModal" class="cancel-btn" :disabled="isRemovingDevice">取消</button>
            <button type="button" @click="confirmRemoveDevice" class="submit-btn danger" :disabled="isRemovingDevice">
              {{ isRemovingDevice ? '移除中...' : '确认移除' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加设备到家庭弹窗 -->
    <div v-if="showAddDeviceToFamilyModal" class="modal-overlay" @click="closeAddDeviceToFamilyModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>添加设备到家庭</h2>
          <button class="close-btn" @click="closeAddDeviceToFamilyModal">×</button>
        </div>
        <div class="modal-body">
          <div v-if="isLoadingUserDevices" class="loading-text">加载设备中...</div>
          <div v-else-if="availableDevices.length === 0" class="empty-text">没有可添加的设备</div>
          <div v-else class="device-select-list">
            <div 
              v-for="device in availableDevices" 
              :key="device.id"
              class="device-select-item"
              :class="{ 'disabled': isDeviceInFamily(device.id) }"
            >
              <label class="device-checkbox-label">
                <input 
                  type="checkbox" 
                  :checked="selectedDeviceIds.includes(device.id)"
                  :disabled="isDeviceInFamily(device.id)"
                  @change="handleDeviceSelect(device.id, $event)"
                />
                <div class="device-select-info">
                  <div class="device-select-thumbnail">
                    <img 
                      v-if="getDeviceThumbnail(device)"
                      :src="getDeviceThumbnail(device)" 
                      :alt="device.name"
                    />
                    <div v-else class="device-thumbnail-placeholder">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" stroke="currentColor" stroke-width="2" fill="none"/>
                      </svg>
                    </div>
                  </div>
                  <div class="device-select-details">
                    <div class="device-select-name">{{ device.name }}</div>
                    <div class="device-select-sn">{{ device.sn }}</div>
                  </div>
                </div>
                <span v-if="isDeviceInFamily(device.id)" class="device-in-family-badge">已在家庭中</span>
              </label>
            </div>
          </div>
          <div v-if="addDeviceError" class="error-message">
            {{ addDeviceError }}
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" @click="closeAddDeviceToFamilyModal" class="cancel-btn" :disabled="isAddingDevices">取消</button>
          <button type="button" @click="confirmAddDevicesToFamily" class="submit-btn" :disabled="isAddingDevices || selectedDeviceIds.length === 0">
            {{ isAddingDevices ? '添加中...' : `添加 ${selectedDeviceIds.length} 台设备` }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '../stores/global'
import { DEFAULT_NO_AVATAR_URL } from '../utils/theme'
import { createFamily, deleteFamily, leaveFamily, updateFamilyMemberNickname, removeFamilyDevice, addFamilyDevice, updateUser } from '../api/users'
import { updateDeviceName, getMyDevices } from '../api/devices'
import { ElMessage } from 'element-plus'
import AvatarSelector from '../components/AvatarSelector.vue'
import { getThumbnailByCardName, getDeviceCardBySN } from '../utils/deviceMapping'

const router = useRouter()
const globalStore = useGlobalStore()

// 获取当前家庭ID
const currentFamilyId = computed(() => {
  return globalStore.user?.account?.current_family_id || null
})

// 家庭列表
const familys = computed(() => {
  return globalStore.familys || []
})

// 当前家庭
const currentFamily = computed(() => {
  if (!currentFamilyId.value) return null
  return familys.value.find(f => f.id === currentFamilyId.value) || null
})

// 创建家庭相关状态
const showCreateFamilyModal = ref(false)
const isCreating = ref(false)
const createFamilyError = ref('')
const newFamily = ref({
  name: '',
  avatar: '',
  description: ''
})

// 切换家庭相关状态
const showSwitchFamilyModal = ref(false)

// 删除家庭相关状态
const showDeleteFamilyModal = ref(false)
const isDeletingFamily = ref(false)
const deletingFamily = ref(null)

// 退出家庭相关状态
const showLeaveFamilyModal = ref(false)
const isLeavingFamily = ref(false)
const leavingFamily = ref(null)
const leavingMember = ref(null) // 要退出的成员（当前用户自己或创建者要移除的成员）
const isRemovingMember = ref(false) // 是否是创建者移除其他成员


// 编辑昵称相关状态
const showEditNicknameModal = ref(false)
const isEditingNickname = ref(false)
const editNicknameError = ref('')
const editingMember = ref(null)
const editingFamily = ref(null)
const editingNickname = ref('')

// 判断是否是创建者编辑其他成员的昵称
const isEditingOtherMember = computed(() => {
  if (!editingMember.value || !editingFamily.value) return false
  return isCreator(editingFamily.value) && !isCurrentUser(editingMember.value)
})

// 编辑设备名称相关状态
const showEditDeviceNameModal = ref(false)
const isEditingDeviceName = ref(false)
const editDeviceNameError = ref('')
const editingDevice = ref(null)
const editingDeviceFamily = ref(null)
const editingDeviceName = ref('')

// 移除设备相关状态
const showRemoveDeviceModal = ref(false)
const isRemovingDevice = ref(false)
const removingDevice = ref(null)
const removingDeviceFamily = ref(null)

// 添加设备到家庭相关状态
const showAddDeviceToFamilyModal = ref(false)
const isAddingDevices = ref(false)
const addDeviceError = ref('')
const familyForAddDevice = ref(null)
const selectedDeviceIds = ref([])
const isLoadingUserDevices = ref(false)
const userDevices = ref([])

// 获取家庭成员（使用 globalStore 的数据，使用 computed 确保响应式更新）
const familyMembers = computed(() => {
  // 只返回当前家庭的成员
  if (currentFamilyId.value) {
    return globalStore.familyMembers || []
  }
  return []
})

// 判断当前用户是否是家庭创建者
// 根据角色判断：role 为 "creator" 的是创建者
const isCreator = (family) => {
  if (!family || !globalStore.user?.account) return false
  
  const members = familyMembers.value
  const currentUserMember = members.find(m => m.account?.id === globalStore.user.account.id)
  
  // 如果当前用户是成员且 role 是 "creator"，则认为是创建者
  if (currentUserMember && currentUserMember.role === 'creator') {
    return true
  }
  
  // 如果没有找到成员信息，检查家庭数据中是否有 creator_id
  if (family.creator_id) {
    return family.creator_id === globalStore.user.account.id
  }
  
  return false
}

// 获取当前用户在指定家庭中的 family_member_id
const getCurrentUserFamilyMemberId = () => {
  const members = familyMembers.value
  const currentUserMember = members.find(m => m.account?.id === globalStore.user?.account?.id)
  // 返回的 id 就是 family_member_id
  return currentUserMember?.id || null
}

// 判断某个成员是否是当前用户
const isCurrentUser = (member) => {
  return member.account?.id === globalStore.user?.account?.id
}

// 处理成员退出家庭（从成员列表中）
const handleMemberLeave = (family, member) => {
  // 如果是当前用户自己，打开退出家庭弹窗
  if (isCurrentUser(member)) {
    leavingMember.value = member
    isRemovingMember.value = false
    openLeaveFamilyModal(family)
  } else if (isCreator(family)) {
    // 如果是创建者移除其他成员，也打开弹窗确认
    leavingMember.value = member
    isRemovingMember.value = true
    openLeaveFamilyModal(family)
  }
}


// 获取家庭设备（使用 globalStore.devices，当有 current_family_id 时，devices 就是家庭设备）
const familyDevices = () => {
  // 如果有当前家庭ID，返回 devices（此时 devices 就是家庭设备）
  if (currentFamilyId.value) {
    return globalStore.devices || []
  }
  return []
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

// 获取设备缩略图
const getDeviceThumbnail = (device) => {
  if (!device) return null
  // 如果设备有 cardName，直接使用
  if (device.cardName) {
    return getThumbnailByCardName(device.cardName)
  }
  // 否则根据 SN 获取 cardName
  if (device.sn) {
    const cardName = getDeviceCardBySN(device.sn)
    if (cardName) {
      return getThumbnailByCardName(cardName)
    }
  }
  return null
}

// 获取设备所属成员
const getDeviceOwner = (device) => {
  if (!device.account_id) return null
  const members = familyMembers.value
  const owner = members.find(m => m.account?.id === device.account_id)
  return owner?.nickname || owner?.account?.nickname || null
}

// 获取性别文本
const getGenderText = (gender) => {
  const genderMap = {
    'male': '男',
    'female': '女',
    'other': '其他'
  }
  return genderMap[gender] || gender
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
    
    // 如果新创建的家庭被设置为当前家庭，loadAll 会自动加载成员和设备
    // 这里不需要手动加载，因为创建家庭后不会自动切换
    
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
    closeDeleteFamilyModal()
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
  leavingMember.value = null
  isRemovingMember.value = false
}

// 确认退出家庭或移除成员
const confirmLeaveFamily = async () => {
  if (!leavingFamily.value) return

  const familyId = leavingFamily.value.id
  let familyMemberId = null

  if (isRemovingMember.value) {
    // 创建者移除其他成员
    if (!leavingMember.value) {
      ElMessage.error('无法获取成员信息，请刷新页面后重试')
      return
    }
    familyMemberId = leavingMember.value.id
  } else {
    // 当前用户退出家庭
    // 如果是创建者，提示
    if (isCreator(leavingFamily.value)) {
      ElMessage.warning('创建者退出家庭后，家庭将被删除')
    }
    familyMemberId = getCurrentUserFamilyMemberId(familyId)
    if (!familyMemberId) {
      ElMessage.error('无法获取家庭成员ID，请刷新页面后重试')
      return
    }
  }

  isLeavingFamily.value = true
  try {
    await leaveFamily(familyMemberId)
    
    closeLeaveFamilyModal()
  } catch (error) {
    console.error(isRemovingMember.value ? '移除成员失败' : '退出家庭失败:', error)
    ElMessage.error(error.response?.data?.detail || (isRemovingMember.value ? '移除成员失败，请重试' : '退出家庭失败，请重试'))
  } finally {
    isLeavingFamily.value = false
  }
}

// 加载当前家庭的成员数据（设备通过 loadDevices 自动加载）
const loadCurrentFamilyData = async () => {
  if (currentFamilyId.value) {
    await globalStore.loadFamilyMembers(currentFamilyId.value)
  }
}

// 监听当前家庭ID变化，自动加载成员数据（设备通过 loadDevices 自动加载）
watch(() => currentFamilyId.value, (newFamilyId) => {
  if (newFamilyId) {
    globalStore.loadFamilyMembers(newFamilyId)
  } else {
    // 如果没有当前家庭，清空成员数据
    globalStore.familyMembers = []
  }
}, { immediate: true })

// 生成邀请链接
const generateInviteLink = async (family) => {
  if (!family.invite_code) {
    ElMessage.error('该家庭没有邀请码')
    return
  }

  // 生成邀请链接（使用当前页面的基础URL + 邀请码）
  const baseUrl = window.location.origin
  const inviteLink = `${baseUrl}/join-family?invite_code=${family.invite_code}`
  
  try {
    // 复制到剪贴板
    await navigator.clipboard.writeText(inviteLink)
    ElMessage.success('邀请链接已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    // 如果复制失败，显示链接让用户手动复制
    ElMessage({
      message: `邀请链接：${inviteLink}`,
      type: 'info',
      duration: 5000,
      showClose: true
    })
  }
}

// 打开编辑昵称弹窗
const openEditMemberNicknameModal = (family, member) => {
  editingFamily.value = family
  editingMember.value = member
  editingNickname.value = member.nickname || ''
  editNicknameError.value = ''
  showEditNicknameModal.value = true
}

// 关闭编辑昵称弹窗
const closeEditNicknameModal = () => {
  showEditNicknameModal.value = false
  editNicknameError.value = ''
  editingFamily.value = null
  editingMember.value = null
  editingNickname.value = ''
}

// 确认编辑昵称
const confirmEditNickname = async () => {
  if (!editingMember.value || !editingFamily.value) return

  if (!editingNickname.value.trim()) {
    editNicknameError.value = '请输入昵称'
    return
  }

  // 如果昵称没有变化，直接关闭
  if (editingNickname.value.trim() === editingMember.value.nickname) {
    closeEditNicknameModal()
    return
  }

  isEditingNickname.value = true
  editNicknameError.value = ''

  try {
    await updateFamilyMemberNickname(editingMember.value.id, editingNickname.value.trim())
    closeEditNicknameModal()
  } catch (error) {
    console.error('修改昵称失败:', error)
    editNicknameError.value = error.response?.data?.detail || '修改昵称失败，请重试'
  } finally {
    isEditingNickname.value = false
  }
}

// 打开编辑设备名称弹窗
const openEditDeviceNameModal = (family, device) => {
  editingDeviceFamily.value = family
  editingDevice.value = device
  editingDeviceName.value = device.name || ''
  editDeviceNameError.value = ''
  showEditDeviceNameModal.value = true
}

// 关闭编辑设备名称弹窗
const closeEditDeviceNameModal = () => {
  showEditDeviceNameModal.value = false
  editDeviceNameError.value = ''
  editingDeviceFamily.value = null
  editingDevice.value = null
  editingDeviceName.value = ''
}

// 确认编辑设备名称
const confirmEditDeviceName = async () => {
  if (!editingDevice.value || !editingDeviceFamily.value) return

  if (!editingDeviceName.value.trim()) {
    editDeviceNameError.value = '请输入设备名称'
    return
  }

  // 如果名称没有变化，直接关闭
  if (editingDeviceName.value.trim() === editingDevice.value.name) {
    closeEditDeviceNameModal()
    return
  }

  isEditingDeviceName.value = true
  editDeviceNameError.value = ''

  try {
    await updateDeviceName(editingDevice.value.id, editingDeviceName.value.trim(), editingDeviceFamily.value.id)
    // 更新 globalStore.devices 中的设备数据
    const deviceIndex = globalStore.devices.findIndex(d => d.id === editingDevice.value.id)
    if (deviceIndex > -1) {
      globalStore.devices[deviceIndex] = { ...globalStore.devices[deviceIndex], name: editingDeviceName.value.trim() }
    }
    closeEditDeviceNameModal()
  } catch (error) {
    console.error('修改设备名称失败:', error)
    editDeviceNameError.value = error.response?.data?.detail || '修改设备名称失败，请重试'
  } finally {
    isEditingDeviceName.value = false
  }
}

// 打开移除设备弹窗
const openRemoveDeviceModal = (family, device) => {
  removingDeviceFamily.value = family
  removingDevice.value = device
  showRemoveDeviceModal.value = true
}

// 关闭移除设备弹窗
const closeRemoveDeviceModal = () => {
  showRemoveDeviceModal.value = false
  removingDeviceFamily.value = null
  removingDevice.value = null
}

// 确认移除设备
const confirmRemoveDevice = async () => {
  if (!removingDevice.value || !removingDeviceFamily.value) return

  isRemovingDevice.value = true
  try {
    await removeFamilyDevice(removingDeviceFamily.value.id, removingDevice.value.id)
    
    // 如果当前正在查看该家庭，重新加载设备列表
    if (currentFamilyId.value === removingDeviceFamily.value.id) {
      await globalStore.loadDevices()
    }
    
    closeRemoveDeviceModal()
    ElMessage.success('移除设备成功')
  } catch (error) {
    console.error('移除设备失败:', error)
    ElMessage.error(error.response?.data?.detail || '移除设备失败，请重试')
  } finally {
    isRemovingDevice.value = false
  }
}

// 获取当前用户的所有绑定设备
const loadUserDevices = async () => {
  isLoadingUserDevices.value = true
  try {
    // 从 API 获取当前用户的绑定设备
    const devices = await getMyDevices()
    userDevices.value = Array.isArray(devices) ? devices.filter(device => device.account_id !== null && device.account_id !== undefined) : []
  } catch (error) {
    console.error('加载用户设备失败:', error)
    userDevices.value = []
  } finally {
    isLoadingUserDevices.value = false
  }
}

// 判断设备是否已在家庭中
const isDeviceInFamily = (deviceId) => {
  if (!familyForAddDevice.value || currentFamilyId.value !== familyForAddDevice.value.id) return false
  return globalStore.devices.some(device => device.id === deviceId)
}

// 获取可用的设备列表（已添加到家庭的不可选）
const availableDevices = computed(() => {
  return userDevices.value
})

// 处理设备选择
const handleDeviceSelect = (deviceId, event) => {
  if (isDeviceInFamily(deviceId)) return
  
  if (event.target.checked) {
    if (!selectedDeviceIds.value.includes(deviceId)) {
      selectedDeviceIds.value.push(deviceId)
    }
  } else {
    const index = selectedDeviceIds.value.indexOf(deviceId)
    if (index > -1) {
      selectedDeviceIds.value.splice(index, 1)
    }
  }
}

// 打开添加设备到家庭弹窗
const openAddDeviceToFamilyModal = async (family) => {
  familyForAddDevice.value = family
  selectedDeviceIds.value = []
  addDeviceError.value = ''
  
  // 如果还没有加载用户设备，先加载
  if (userDevices.value.length === 0) {
    await loadUserDevices()
  }
  
  showAddDeviceToFamilyModal.value = true
}

// 关闭添加设备到家庭弹窗
const closeAddDeviceToFamilyModal = () => {
  showAddDeviceToFamilyModal.value = false
  familyForAddDevice.value = null
  selectedDeviceIds.value = []
  addDeviceError.value = ''
}

// 确认添加设备到家庭
const confirmAddDevicesToFamily = async () => {
  if (!familyForAddDevice.value || selectedDeviceIds.value.length === 0) return

  isAddingDevices.value = true
  addDeviceError.value = ''
  
  try {
    // 批量添加设备
    const addPromises = selectedDeviceIds.value.map(deviceId => 
      addFamilyDevice(familyForAddDevice.value.id, deviceId)
    )
    
    await Promise.all(addPromises)
    
    // 如果当前正在查看该家庭，重新加载设备列表
    if (currentFamilyId.value === familyForAddDevice.value.id) {
      await globalStore.loadDevices()
    }
    
    closeAddDeviceToFamilyModal()
    ElMessage.success(`成功添加 ${selectedDeviceIds.value.length} 台设备到家庭`)
  } catch (error) {
    console.error('添加设备到家庭失败:', error)
    addDeviceError.value = error.response?.data?.detail || '添加设备失败，请重试'
  } finally {
    isAddingDevices.value = false
  }
}

// 打开切换家庭弹窗
const openSwitchFamilyModal = () => {
  showSwitchFamilyModal.value = true
}

// 关闭切换家庭弹窗
const closeSwitchFamilyModal = () => {
  showSwitchFamilyModal.value = false
}

// 选择家庭
const selectFamily = async (family) => {
  if (family.id === currentFamilyId.value) {
    closeSwitchFamilyModal()
    return
  }
  
  try {
    // 更新 account 中的 current_family_id
    await updateUser({ current_family_id: family.id })
    
    // 更新本地 user 数据
    globalStore.updateUserInfo({ current_family_id: family.id })
    
    // 调用 loadAll 重新加载所有数据（会自动加载当前家庭的成员和设备）
    await globalStore.loadAll()
    
    closeSwitchFamilyModal()
    ElMessage.success(`已切换到家庭"${family.name}"`)
  } catch (error) {
    console.error('切换家庭失败:', error)
    ElMessage.error('切换家庭失败，请重试')
  }
}

// 切换到此家庭设备管理
const switchToFamilyDevices = async (family) => {
  try {
    // 更新 account 中的 current_family_id
    await updateUser({ current_family_id: family.id })
    
    // 更新本地 user 数据
    globalStore.updateUserInfo({ current_family_id: family.id })
    
    // 调用 loadAll 重新加载所有数据（loadDevices 会根据 current_family_id 加载对应家庭的设备）
    await globalStore.loadAll()
    
    // 跳转到 Home 页面
    router.push('/home')
    
    ElMessage.success(`已切换到家庭"${family.name}"的设备管理`)
  } catch (error) {
    console.error('切换家庭设备失败:', error)
    ElMessage.error('切换家庭设备失败，请重试')
  }
}

// 切回个人设备管理
const switchToPersonalDevices = async () => {
  try {
    // 清除 account 中的 current_family_id
    await updateUser({ current_family_id: null })
    
    // 更新本地 user 数据
    globalStore.updateUserInfo({ current_family_id: null })
    
    // 调用 loadAll 重新加载所有数据（loadDevices 会加载所有设备）
    await globalStore.loadAll()
    
    // 跳转到 Home 页面
    router.push('/home')
    
    ElMessage.success('已切回个人设备管理')
  } catch (error) {
    console.error('切回个人设备管理失败:', error)
    ElMessage.error('切回个人设备管理失败，请重试')
  }
}

// 加载数据
onMounted(async () => {
  await loadCurrentFamilyData()
})

// 组件卸载时移除事件监听器
onUnmounted(() => {
  // 数据更新已在 index.vue 中直接更新 globalStore，无需事件监听
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.family-count {
  font-size: 14px;
  color: var(--color-text-secondary);
  font-weight: 500;
  padding: 8px 12px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
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

.switch-family-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.switch-family-btn:hover {
  background: var(--color-hover);
  border-color: var(--color-border-hover);
}

.switch-family-btn svg {
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

.family-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.family-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.family-select-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding: 4px;
}

.family-select-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-bg-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.family-select-item:hover {
  background: var(--color-hover);
  border-color: var(--color-border-hover);
}

.family-select-item.active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.family-select-avatar {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--color-bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.family-select-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.family-select-info {
  flex: 1;
  min-width: 0;
}

.family-select-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.current-badge {
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-primary-text);
  background: var(--color-primary);
  border-radius: 12px;
  white-space: nowrap;
}

.family-select-description {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.family-select-meta {
  font-size: 12px;
  color: var(--color-text-muted);
}

.switch-family-actions {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.switch-to-personal-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  justify-content: center;
}

.switch-to-personal-btn:hover {
  background: var(--color-hover);
  color: var(--color-text-primary);
  border-color: var(--color-border-hover);
}

.switch-to-personal-btn svg {
  width: 16px;
  height: 16px;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 48px;
}

.empty-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.family-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
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
  display: flex;
  align-items: center;
  gap: 12px;
}

.family-label {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-primary-text);
  background: var(--color-primary);
  border-radius: 12px;
  white-space: nowrap;
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

.section-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

.invite-member-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.invite-member-btn:hover {
  background: var(--color-hover);
  color: var(--color-text-primary);
  border-color: var(--color-border-hover);
}

.invite-member-btn svg {
  width: 14px;
  height: 14px;
}

.member-count,
.device-count {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.add-device-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--color-primary);
  background: transparent;
  color: var(--color-primary);
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-device-btn:hover {
  background: var(--color-hover);
  color: var(--color-primary);
}

.add-device-btn svg {
  width: 16px;
  height: 16px;
}

.device-select-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  max-height: none;
  overflow: visible;
}

.device-select-item {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 12px;
  transition: all 0.2s ease;
}

.device-select-item:hover:not(.disabled) {
  background: var(--color-hover);
  border-color: var(--color-border-hover);
}

.device-select-item.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.device-checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  width: 100%;
}

.device-checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  flex-shrink: 0;
}

.device-checkbox-label input[type="checkbox"]:disabled {
  cursor: not-allowed;
}

.device-select-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.device-select-thumbnail {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  overflow: hidden;
  background: var(--color-bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.device-select-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.device-thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}

.device-thumbnail-placeholder svg {
  width: 24px;
  height: 24px;
}

.device-select-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.device-select-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.device-select-sn {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-family: monospace;
}

.device-in-family-badge {
  padding: 4px 8px;
  background: var(--color-text-muted);
  color: var(--color-bg-primary);
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
}

.empty-members,
.empty-devices {
  padding: 24px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 14px;
}

.members-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 12px;
}

.devices-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
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
  border-radius: 12px;
  transition: all 0.2s ease;
  position: relative;
}

.member-item:hover,
.device-item:hover {
  background: var(--color-hover);
}

.member-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid var(--color-border);
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
  flex-wrap: wrap;
}

.member-nickname {
  font-weight: 600;
}

.member-edit-btn-inline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.6;
  margin-left: 4px;
}

.member-edit-btn-inline:hover {
  background: var(--color-hover);
  color: var(--color-text-primary);
  opacity: 1;
}

.member-edit-btn-inline svg {
  width: 14px;
  height: 14px;
}

.account-nickname {
  color: var(--color-text-secondary);
  font-weight: normal;
}

.member-role {
  font-size: 12px;
  color: var(--color-text-muted);
  font-weight: normal;
}

.member-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
}

.member-detail-item {
  font-size: 12px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.detail-label {
  color: var(--color-text-muted);
  font-weight: 500;
}

.detail-value {
  color: var(--color-text-secondary);
}

.member-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.member-leave-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.member-leave-btn:hover {
  background: var(--color-danger-light);
  border-color: var(--color-danger);
  color: var(--color-danger);
}

.member-leave-btn svg {
  width: 16px;
  height: 16px;
}

.device-thumbnail {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.device-thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.device-thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}

.device-thumbnail-placeholder svg {
  width: 32px;
  height: 32px;
}

.device-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.device-info-item {
  font-size: 12px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
}

.device-label {
  color: var(--color-text-muted);
  font-weight: 500;
  width: 50px;
  flex-shrink: 0;
}

.device-value {
  color: var(--color-text-secondary);
  flex: 1;
  text-align: left;
}

.device-edit-btn-inline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.6;
  margin-left: 4px;
}

.device-edit-btn-inline:hover {
  background: var(--color-hover);
  color: var(--color-text-primary);
  opacity: 1;
}

.device-edit-btn-inline svg {
  width: 14px;
  height: 14px;
}

.device-remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.device-remove-btn:hover {
  background: var(--color-danger-light);
  border-color: var(--color-danger);
  color: var(--color-danger);
}

.device-remove-btn svg {
  width: 16px;
  height: 16px;
}

.device-sn-value {
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
  padding: 24px;
  width: 900px;
  max-height: 85vh;
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

.modal-body {
  flex: 1;
  overflow: visible;
  min-height: 0;
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

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
}

.cancel-btn {
  padding: 12px;
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
  padding: 12px;
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

.action-btn.primary {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: transparent;
}

.action-btn.primary:hover:not(:disabled) {
  background: var(--color-hover);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.action-btn.secondary {
  border-color: var(--color-text-secondary);
  color: var(--color-text-secondary);
  background: transparent;
}

.action-btn.secondary:hover:not(:disabled) {
  background: var(--color-hover);
  color: var(--color-text-primary);
  border-color: var(--color-border);
}

.action-btn.active {
  border-color: var(--color-primary);
  color: var(--color-primary-text);
  background: var(--color-primary);
  font-weight: 600;
}

.action-btn.active:hover:not(:disabled) {
  background: var(--color-primary-hover);
  color: var(--color-primary-text);
  border-color: var(--color-primary);
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


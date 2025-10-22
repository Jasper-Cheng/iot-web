<template>
  <div class="home-page">
    <div class="main-content">
      <div class="about-container">
        <div class="about-content">
          <div class="about-section">
            <div class="about-item" @click="showVersionDialog">
              <div class="item-left">
                <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>版本信息</span>
              </div>
              <div class="item-right">
                <span>{{ appVersion }}</span>
                <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 18L15 12L9 6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <div class="about-item" @click="showFeedbackDialog">
              <div class="item-left">
                <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>意见反馈</span>
              </div>
              <div class="item-right">
                <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 18L15 12L9 6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <div class="about-item" @click="showContactDialog">
              <div class="item-left">
                <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77383 17.3147 6.72534 15.2662 5.19 12.85C3.49998 10.2412 2.44824 7.27099 2.12 4.18C2.09501 3.90347 2.12788 3.62476 2.2165 3.36162C2.30513 3.09849 2.44757 2.85669 2.63477 2.65162C2.82196 2.44655 3.04981 2.28271 3.30379 2.17052C3.55778 2.05833 3.83234 2.00026 4.11 2H7.11C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04208 3.23945 9.11 3.72C9.23662 4.68007 9.47145 5.62273 9.81 6.53C9.94455 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.36 8.64L8.09 9.91C9.51356 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9752 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0554 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>联系客服</span>
              </div>
              <div class="item-right">
                <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 18L15 12L9 6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <div class="about-item" @click="showAboutDialog">
              <div class="item-left">
                <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 16V12" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 8H12.01" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>关于我们</span>
              </div>
              <div class="item-right">
                <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 18L15 12L9 6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div class="about-footer">
          <div class="icp-info">ICP备案号: 京ICP备XXXXXXXX号-X</div>
          <div>© 2023 智能家居物联网系统 版权所有</div>
        </div>
      </div>
    </div>
  </div>
    
    <!-- 版本信息对话框 -->
    <div v-if="versionDialogVisible" class="device-modal" @click="closeVersionDialog">
      <div class="message-log-modal-content" @click.stop>
        <div class="message-log-header">
          <h3>版本信息</h3>
          <button class="delete-close-btn" @click="closeVersionDialog">×</button>
        </div>
        <div class="message-log-body">
          <div class="version-content">
            <div v-if="isVersionLoading" class="loading-state">
              <p>正在获取版本信息...</p>
            </div>
            <div v-else-if="versionList.length > 0" class="version-list">
              <div v-for="(version, index) in versionList" :key="version.id || index" class="version-item">
                <div class="version-header">
                  <h4>{{ version.title }}</h4>
                  <p class="version-code">{{ version.version_name }}</p>
                  <span class="version-date">{{ formatDate(version.created_at) }}</span>
                </div>
                <div class="version-details">
                  <p class="description">{{ version.description }}</p>
                  
                  <div v-if="version.extra && version.extra.release_notes" class="release-notes">
                    <h5>更新内容:</h5>
                    <ul>
                      <li v-for="note in version.extra.release_notes" :key="note">
                        {{ note }}
                      </li>
                    </ul>
                  </div>
                  
                  <div v-if="version.extra && version.extra.compatibility" class="compatibility">
                    <h5>兼容性要求:</h5>
                    <div class="compatibility-info">
                      <div v-for="(versionReq, platform) in version.extra.compatibility" :key="platform">
                        <span class="platform">{{ platform }}:</span>
                        <span class="version">{{ versionReq }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="index < versionList.length - 1" class="version-divider"></div>
              </div>
            </div>
            <div v-else class="no-version">
              <p>暂无版本信息</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 意见反馈对话框 -->
    <div v-if="feedbackDialogVisible" class="device-modal" @click="closeFeedbackDialog">
      <div class="message-log-modal-content" @click.stop>
        <div class="message-log-header">
          <h3>意见反馈</h3>
          <button class="delete-close-btn" @click="closeFeedbackDialog">×</button>
        </div>
        <div class="message-log-body">
          <div class="feedback-form">
            <form @submit.prevent="submitFeedback">
              <div class="form-group">
                <label>反馈类型 *</label>
                <select v-model="feedbackForm.type" required>
                  <option value="">请选择反馈类型</option>
                  <option value="bug">bug</option>
                  <option value="feature">功能建议</option>
                  <option value="improvement">改进建议</option>
                  <option value="complaint">投诉</option>
                  <option value="praise">表扬</option>
                  <option value="other">其他</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>反馈内容 *</label>
                <textarea 
                  v-model="feedbackForm.content" 
                  placeholder="请详细描述您的建议或遇到的问题"
                  rows="4"
                  required
                ></textarea>
              </div>
              
              <div class="form-group">
                <label>联系方式</label>
                <input 
                  v-model="feedbackForm.contact" 
                  type="text" 
                  placeholder="请留下您的联系方式，方便我们回复您"
                />
              </div>
              
              <div class="form-actions">
                <button type="button" @click="closeFeedbackDialog" class="cancel-btn">取消</button>
                <button type="submit" class="submit-btn">提交</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 联系客服对话框 -->
    <div v-if="contactDialogVisible" class="device-modal" @click="closeContactDialog">
      <div class="message-log-modal-content" @click.stop>
        <div class="message-log-header">
          <h3>联系客服</h3>
          <button class="delete-close-btn" @click="closeContactDialog">×</button>
        </div>
        <div class="message-log-body">
          <div class="contact-content">
            <div class="contact-info">
              <div class="contact-item">
                <div class="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77383 17.3147 6.72534 15.2662 5.19 12.85C3.49998 10.2412 2.44824 7.27099 2.12 4.18C2.09501 3.90347 2.12788 3.62476 2.2165 3.36162C2.30513 3.09849 2.44757 2.85669 2.63477 2.65162C2.82196 2.44655 3.04981 2.28271 3.30379 2.17052C3.55778 2.05833 3.83234 2.00026 4.11 2H7.11C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04208 3.23945 9.11 3.72C9.23662 4.68007 9.47145 5.62273 9.81 6.53C9.94455 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.36 8.64L8.09 9.91C9.51356 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9752 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0554 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="contact-details">
                  <h4>客服热线</h4>
                  <p class="phone-number">{{ customerServicePhone }}</p>
                  <p class="service-time">服务时间：周一至周日 9:00-21:00</p>
                </div>
              </div>
              
              <div class="contact-item">
                <div class="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="22,6 12,13 2,6" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="contact-details">
                  <h4>邮箱支持</h4>
                  <p class="email">support@iot-smart.com</p>
                  <p class="response-time">24小时内回复</p>
                </div>
              </div>
            </div>
            
            <div class="contact-actions">
              <button class="action-btn primary" @click="callCustomerService">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77383 17.3147 6.72534 15.2662 5.19 12.85C3.49998 10.2412 2.44824 7.27099 2.12 4.18C2.09501 3.90347 2.12788 3.62476 2.2165 3.36162C2.30513 3.09849 2.44757 2.85669 2.63477 2.65162C2.82196 2.44655 3.04981 2.28271 3.30379 2.17052C3.55778 2.05833 3.83234 2.00026 4.11 2H7.11C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04208 3.23945 9.11 3.72C9.23662 4.68007 9.47145 5.62273 9.81 6.53C9.94455 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.36 8.64L8.09 9.91C9.51356 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9752 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0554 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                立即拨打
              </button>
              <button class="action-btn secondary" @click="closeContactDialog">
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 关于我们对话框 -->
    <div v-if="aboutDialogVisible" class="device-modal" @click="closeAboutDialog">
      <div class="message-log-modal-content" @click.stop>
        <div class="message-log-header">
          <h3>关于我们</h3>
          <button class="delete-close-btn" @click="closeAboutDialog">×</button>
        </div>
        <div class="message-log-body">
          <div class="about-content">
            <div class="app-info">
              <div class="app-logo">
                <div class="logo-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
              <div class="app-details">
                <h3>智能家居物联网系统</h3>
                <p class="version">版本 {{ appVersion }}</p>
                <p class="description">我们致力于为用户提供智能、便捷、安全的家居物联网解决方案，让生活更加美好。</p>
              </div>
            </div>
            
            <div class="features">
              <h4>主要功能</h4>
              <div class="feature-list">
                <div class="feature-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 12L11 14L15 10" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>智能设备控制</span>
                </div>
                <div class="feature-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 12L11 14L15 10" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>实时监控</span>
                </div>
                <div class="feature-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 12L11 14L15 10" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>自动化场景</span>
                </div>
                <div class="feature-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 12L11 14L15 10" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>数据分析</span>
                </div>
              </div>
            </div>
            
            <div class="company-info">
              <h4>公司信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">公司名称</span>
                  <span class="value">智能科技有限公司</span>
                </div>
                <div class="info-item">
                  <span class="label">公司地址</span>
                  <span class="value">北京市海淀区科技园区</span>
                </div>
                <div class="info-item">
                  <span class="label">客服电话</span>
                  <span class="value">{{ customerServicePhone }}</span>
                </div>
                <div class="info-item">
                  <span class="label">技术支持</span>
                  <span class="value">support@iot-smart.com</span>
                </div>
              </div>
            </div>
            
            <div class="copyright">
              <p>© {{ currentYear }} 智能科技有限公司 版权所有</p>
              <p>京ICP备XXXXXXXX号-X</p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { getVersionInfo } from '../api/version'

export default {
  name: 'Settings',
  data() {
    return {
      appVersion: 'v1.0.0',
      currentYear: new Date().getFullYear(),
      versionDialogVisible: false,
      feedbackDialogVisible: false,
      contactDialogVisible: false,
      aboutDialogVisible: false,
      versionList: [],
      isVersionLoading: false,
      customerServicePhone: '400-888-8888',
      versionLogs: [
        {
          version: 'v1.0.0',
          date: '2023-12-01',
          description: '初始版本发布，包含基本的智能家居控制功能'
        },
        {
          version: 'v0.9.0',
          date: '2023-11-15',
          description: '测试版本，修复了多项已知问题'
        }
      ],
      feedbackForm: {
        type: '',
        content: '',
        contact: ''
      },
      feedbackRules: {
        type: [{ required: true, message: '请选择反馈类型', trigger: 'change' }],
        content: [{ required: true, message: '请输入反馈内容', trigger: 'blur' }]
      }
    };
  },
  methods: {
    async showVersionDialog() {
      this.isVersionLoading = true;
      try {
        // 请求版本信息
        const versionList = await getVersionInfo({
          platform: 'web',
          limit: 10
        });
        
        if (Array.isArray(versionList) && versionList.length > 0) {
          this.versionList = versionList;
        } else {
          this.versionList = [];
        }
      } catch (error) {
        console.error('获取版本信息失败:', error);
        this.versionList = [];
      } finally {
        this.isVersionLoading = false;
        this.versionDialogVisible = true;
      }
    },
    closeVersionDialog() {
      this.versionDialogVisible = false;
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    },
    showFeedbackDialog() {
      this.feedbackDialogVisible = true;
    },
    closeFeedbackDialog() {
      this.feedbackDialogVisible = false;
    },
    showContactDialog() {
      this.contactDialogVisible = true;
    },
    closeContactDialog() {
      this.contactDialogVisible = false;
    },
    callCustomerService() {
      window.location.href = `tel:${this.customerServicePhone}`;
    },
    showAboutDialog() {
      this.aboutDialogVisible = true;
    },
    closeAboutDialog() {
      this.aboutDialogVisible = false;
    },
    submitFeedback() {
      // 简单的表单验证
      if (!this.feedbackForm.type) {
        alert('请选择反馈类型');
        return;
      }
      if (!this.feedbackForm.content.trim()) {
        alert('请输入反馈内容');
        return;
      }
      
      // 这里可以添加提交反馈的API调用
      alert('感谢您的反馈，我们会尽快处理！');
      this.feedbackDialogVisible = false;
      
      // 重置表单
      this.feedbackForm = {
        type: '',
        content: '',
        contact: ''
      };
    }
  }
};
</script>

<style scoped>
.home-page {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.main-content {
  display: flex;
  flex: 1;
  padding: 20px;
}

.about-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
}

.about-header {
  margin-bottom: 20px;
}

.about-header h1 {
  font-size: 24px;
  color: var(--color-text-primary);
  margin: 0;
  font-weight: 600;
}

.about-content {
  flex: 1;
}

.about-section {
  background-color: var(--color-bg-card);
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 var(--color-shadow-light);
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.about-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 60px;
}


.about-item:hover {
  background-color: var(--color-hover);
  transform: translateY(-1px);
}

.about-item:last-child {
  border-bottom: none;
}

.about-item:active {
  transform: translateY(0);
  background-color: var(--color-active);
}

.item-left {
  display: flex;
  align-items: center;
}

.item-icon {
  width: 22px;
  height: 22px;
  margin-right: 16px;
  color: var(--color-primary);
  stroke-width: 2;
  flex-shrink: 0;
}

.item-left span {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.4;
}

.item-right {
  display: flex;
  align-items: center;
  color: var(--color-text-secondary);
  gap: 8px;
}

.item-right span {
  font-size: 14px;
  font-weight: 400;
  color: var(--color-text-secondary);
}

.arrow-icon {
  width: 18px;
  height: 18px;
  color: var(--color-text-secondary);
  stroke-width: 2;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.about-item:hover .arrow-icon {
  color: var(--color-text-primary);
}

.about-footer {
  text-align: center;
  margin-top: 20px;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.icp-info {
  margin-bottom: 5px;
}

/* 弹窗样式 - 匹配消息日志弹窗样式 */
.device-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-member-modal-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.message-log-modal-content {
  background: var(--color-shadow-overlay);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 0 10px 30px var(--shadow-soft);
  width: 80%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.message-log-header {
  background: var(--color-bg-secondary);
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  border-radius: 16px 16px 0 0;
}

.message-log-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.delete-close-btn {
  background: none;
  border: 1px solid var(--color-border);
  width: 28px;
  height: 28px;
  border-radius: 6px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  font-weight: bold;
}

.delete-close-btn:hover {
  color: var(--color-text-primary);
  border-color: var(--color-primary);
  background: var(--color-hover);
}

.message-log-body {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  background: var(--color-bg-secondary);
  min-height: 0;
  border-radius: 0 0 16px 16px;
  /* 隐藏滚动条但保持滚动功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.message-log-body::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.version-history {
  padding: 20px;
}

.version-history ul {
  padding-left: 20px;
  margin-top: 12px;
}

.version-history li {
  margin-bottom: 16px;
  line-height: 1.5;
}

.version-history strong {
  color: var(--color-primary);
}

.feedback-form {
  padding: 20px;
}

/* 意见反馈弹窗表单样式 - 参考Members.vue */
.feedback-form .form-group {
  margin-bottom: 20px;
}

.feedback-form .form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.feedback-form .form-group input,
.feedback-form .form-group select,
.feedback-form .form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  font-size: 14px;
  box-sizing: border-box;
}

.feedback-form .form-group input:focus,
.feedback-form .form-group select:focus,
.feedback-form .form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.feedback-form .form-group input::placeholder,
.feedback-form .form-group textarea::placeholder {
  color: var(--color-text-secondary) !important;
  font-size: 14px;
  font-weight: 600;
  opacity: 1;
}

.feedback-form .form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.feedback-form .form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 12px;
}

.feedback-form .cancel-btn,
.feedback-form .submit-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--color-border);
}

.feedback-form .cancel-btn {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.feedback-form .cancel-btn:hover {
  background: var(--color-hover);
  transform: translateY(-1px);
}

.feedback-form .submit-btn {
  background: var(--color-primary);
  color: var(--color-primary-text);
  border-color: var(--color-primary);
}

.feedback-form .submit-btn:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}


.dialog-footer {
  text-align: right;
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid var(--color-border);
}

.dialog-footer .el-button {
  padding: 8px 16px;
  font-size: 14px;
}

.about-dialog .about-content {
  text-align: center;
  line-height: 1.6;
  padding: 20px;
}

.about-dialog .about-content h3 {
  color: var(--color-primary);
  margin-bottom: 16px;
}

/* 联系客服弹窗样式 */
.contact-content {
  padding: 20px;
}

.contact-info {
  margin-bottom: 24px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-text);
  flex-shrink: 0;
}

.contact-icon svg {
  width: 24px;
  height: 24px;
}

.contact-details h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.phone-number {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 4px 0;
}

.email {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-primary);
  margin: 0 0 4px 0;
}

.service-time,
.response-time {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

.contact-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.action-btn {
  padding: 12px 24px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn.primary {
  background: var(--color-primary);
  color: var(--color-primary-text);
  border-color: var(--color-primary);
}

.action-btn.primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.action-btn.secondary {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.action-btn.secondary:hover {
  background: var(--color-hover);
  transform: translateY(-1px);
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

/* 关于我们弹窗样式 */
.about-content {
  padding: 20px;
}

.app-info {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
}

.app-logo {
  flex-shrink: 0;
}

.logo-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-text);
}

.logo-icon svg {
  width: 32px;
  height: 32px;
}

.app-details h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.version {
  font-size: 14px;
  color: var(--color-primary);
  font-weight: 500;
  margin: 0 0 12px 0;
}

.description {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
}

.features {
  margin-bottom: 24px;
}

.features h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.feature-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--color-bg-tertiary);
  border-radius: 8px;
  font-size: 14px;
  color: var(--color-text-primary);
}

.feature-item svg {
  width: 16px;
  height: 16px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.company-info {
  margin-bottom: 20px;
}

.company-info h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.info-grid {
  display: grid;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border-light);
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .label {
  font-size: 14px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.info-item .value {
  font-size: 14px;
  color: var(--color-text-primary);
  font-weight: 500;
}

.copyright {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.copyright p {
  margin: 4px 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

/* 版本信息对话框样式 */
.version-content {
  padding: 20px;
}

.loading-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--color-text-secondary);
}

.version-list {
  max-width: 100%;
}

.version-item {
  margin-bottom: 24px;
}

.version-item:last-child {
  margin-bottom: 0;
}

.version-header {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.version-header h4 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.version-code {
  font-size: 14px;
  color: var(--color-primary);
  font-weight: 500;
  margin: 0;
}

.version-date {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 400;
}

.version-details {
  margin-bottom: 20px;
}

.description {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.release-notes {
  margin-bottom: 20px;
}

.release-notes h5 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 12px 0;
}

.release-notes ul {
  margin: 0;
  padding-left: 20px;
}

.release-notes li {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 6px;
}

.compatibility {
  margin-bottom: 20px;
}

.compatibility h5 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 12px 0;
}

.compatibility-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.compatibility-info > div {
  display: flex;
  gap: 12px;
  font-size: 14px;
}

.compatibility-info .platform {
  font-weight: 500;
  color: var(--color-text-primary);
  min-width: 60px;
}

.compatibility-info .version {
  color: var(--color-text-secondary);
}

.version-divider {
  height: 1px;
  background: var(--color-border);
  margin: 20px 0;
}

.no-version {
  text-align: center;
  padding: 40px 20px;
  color: var(--color-text-secondary);
}
</style>
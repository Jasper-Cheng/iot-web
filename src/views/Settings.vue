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
    <el-dialog
      v-model="versionDialogVisible"
      title="版本信息"
      width="400px"
      class="about-dialog"
    >
      <div class="version-history">
        <p><strong>当前版本:</strong> {{ appVersion }}</p>
        <h3>更新日志:</h3>
        <ul>
          <li v-for="(log, index) in versionLogs" :key="index">
            <strong>{{ log.version }}</strong> - {{ log.date }}<br>
            {{ log.description }}
          </li>
        </ul>
      </div>
    </el-dialog>
    
    <!-- 意见反馈对话框 -->
    <el-dialog
      v-model="feedbackDialogVisible"
      title="意见反馈"
      width="500px"
      class="about-dialog"
    >
      <div class="feedback-form">
        <el-form :model="feedbackForm" label-width="80px">
          <el-form-item label="类型">
            <el-select v-model="feedbackForm.type" placeholder="请选择反馈类型" style="width: 100%">
              <el-option label="功能建议" value="feature" />
              <el-option label="问题反馈" value="bug" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>
          <el-form-item label="内容">
            <el-input
              v-model="feedbackForm.content"
              type="textarea"
              :rows="4"
              placeholder="请详细描述您的建议或遇到的问题"
            />
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input v-model="feedbackForm.contact" placeholder="请留下您的联系方式，方便我们回复您" />
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button @click="feedbackDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitFeedback">提交</el-button>
        </div>
      </div>
    </el-dialog>
    
    <!-- 关于我们对话框 -->
    <el-dialog
      v-model="aboutDialogVisible"
      title="关于我们"
      width="400px"
      class="about-dialog"
    >
      <div class="about-content">
        <h3>智能家居物联网系统</h3>
        <p>版本: {{ appVersion }}</p>
        <p>我们致力于为用户提供智能、便捷、安全的家居物联网解决方案，让生活更加美好。</p>
        
        <div class="company-info">
          <p>公司: 智能科技有限公司</p>
          <p>地址: 北京市海淀区科技园区</p>
          <p>电话: 400-123-4567</p>
          <p>邮箱: support@iot-smart.com</p>
        </div>
      </div>
    </el-dialog>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      appVersion: 'v1.0.0',
      currentYear: new Date().getFullYear(),
      versionDialogVisible: false,
      feedbackDialogVisible: false,
      aboutDialogVisible: false,
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
    showVersionDialog() {
      this.versionDialogVisible = true;
    },
    showFeedbackDialog() {
      this.feedbackDialogVisible = true;
    },
    showContactDialog() {
      // 可以根据实际需求实现，如拨打电话或跳转到客服聊天页面
      this.$confirm(`是否拨打客服电话 ${this.customerServicePhone}?`, '联系客服', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        window.location.href = `tel:${this.customerServicePhone}`;
      }).catch(() => {
        // 用户取消操作
      });
    },
    showAboutDialog() {
      this.aboutDialogVisible = true;
    },
    submitFeedback() {
      this.$refs.feedbackForm.validate((valid) => {
        if (valid) {
          // 这里可以添加提交反馈的API调用
          this.$message({
            type: 'success',
            message: '感谢您的反馈，我们会尽快处理！'
          });
          this.feedbackDialogVisible = false;
          // 重置表单
          this.$refs.feedbackForm.resetFields();
        } else {
          return false;
        }
      });
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
  background-color: var(--color-bg-secondary, #f5f7fa);
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
  color: var(--color-text-primary, #303133);
  margin: 0;
  font-weight: 600;
}

.about-content {
  flex: 1;
}

.about-section {
  background-color: var(--color-bg-primary, #fff);
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.about-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border, #ebeef5);
  cursor: pointer;
  transition: background-color 0.3s;
}

.about-item:hover {
  background-color: var(--color-bg-hover, #f5f7fa);
}

.about-item:last-child {
  border-bottom: none;
}

.item-left {
  display: flex;
  align-items: center;
}

.item-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  color: var(--color-primary, #409EFF);
  stroke-width: 2;
}

.item-left span {
  font-size: 16px;
  color: var(--color-text-primary, #303133);
}

.item-right {
  display: flex;
  align-items: center;
  color: var(--color-text-secondary, #909399);
}

.item-right span {
  margin-right: 10px;
  font-size: 14px;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  color: var(--color-text-secondary, #909399);
}

.about-footer {
  text-align: center;
  margin-top: 20px;
  color: var(--color-text-secondary, #909399);
  font-size: 12px;
}

.icp-info {
  margin-bottom: 5px;
}

/* 对话框样式 - 匹配消息日志弹窗样式 */
:deep(.el-dialog) {
  background: var(--color-shadow-overlay);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px var(--shadow-soft);
  margin: 0 auto;
}

:deep(.el-overlay) {
  background: var(--color-widgets-modal-overlay);
}

:deep(.el-dialog__header) {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  margin: 0;
  border-radius: 16px 16px 0 0;
}

:deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  flex: 1;
}

:deep(.el-dialog__body) {
  padding: 0;
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary);
}

:deep(.el-dialog__headerbtn) {
  top: 16px;
  right: 16px;
  background: none;
  border: 1px solid var(--color-border);
  width: 28px;
  height: 28px;
  border-radius: 6px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-dialog__headerbtn:hover) {
  color: var(--color-text-primary);
  border-color: var(--color-text-primary);
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: inherit;
  font-size: 16px;
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
  color: var(--color-primary, #409EFF);
}

.feedback-form {
  padding: 10px;
}

.dialog-footer {
  text-align: right;
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid var(--color-border, #ebeef5);
}

.dialog-footer .el-button {
  padding: 8px 16px;
  font-size: 14px;
}

.about-dialog .about-content {
  text-align: center;
  line-height: 1.6;
  padding: 10px 0;
}

.about-dialog .about-content h3 {
  color: var(--color-primary, #409EFF);
  margin-bottom: 16px;
}

.company-info {
  margin-top: 24px;
  text-align: left;
  border-top: 1px solid var(--color-border, #ebeef5);
  padding-top: 16px;
  color: var(--color-text-secondary, #909399);
}
</style>
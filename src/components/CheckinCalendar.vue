<template>
  <div class="checkin-calendar">
    <div class="calendar-header">
      <div class="calendar-left">
        <div class="calendar-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="calendar-info">
          <h4>打卡日历</h4>
          <div class="calendar-stats">
            <span class="checkin-count">已打卡{{ checkinCount }}天</span>
            <span class="checkin-streak">连击{{ currentStreak }}天</span>
            <span class="checkin-streak">最长{{ longestStreak }}天</span>
          </div>
        </div>
      </div>
      <div class="calendar-right">
        <button class="checkin-history-btn" @click="openCheckinHistoryModal" title="查看打卡记录">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
          <span>打卡记录</span>
        </button>
      </div>
    </div>
    
    <div class="calendar-controls">
      <button class="nav-btn" @click="previousMonth" :disabled="isLoading">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
      </button>
      <div class="month-year">
        {{ currentMonth }} {{ currentYear }}
      </div>
      <button class="nav-btn" @click="nextMonth" :disabled="isLoading">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
      </button>
    </div>

    <div class="calendar-grid">
      <div class="calendar-weekdays">
        <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
      </div>
      <div class="calendar-days">
        <div 
          v-for="day in calendarDays" 
          :key="`${day.date}-${day.month}`"
          :class="[
            'calendar-day',
            { 
              'other-month': day.otherMonth,
              'today': day.isToday,
              'checked-in': day.checkedIn,
              'can-checkin': day.canCheckIn
            }
          ]"
          @click="handleDayClick(day)"
        >
          <span class="day-number">{{ day.date }}</span>
          <div v-if="day.checkedIn" class="checkin-indicator">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="calendar-legend">
      <div class="legend-left">
        <div class="legend-item">
          <div class="legend-dot checked"></div>
          <span>已打卡</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot today"></div>
          <span>今天</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot available"></div>
          <span>可打卡</span>
        </div>
      </div>
      <div class="legend-right">
        <button class="reward-rules-btn" @click="openRewardRulesModal" title="查看奖励规则">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
          <span>奖励规则</span>
        </button>
      </div>
    </div>

    <!-- 奖励规则弹窗 -->
    <div v-if="showRewardRulesModal" class="device-modal" @click="closeRewardRulesModal">
      <div class="reward-rules-modal-content" @click.stop>
        <div class="reward-rules-header">
          <div class="header-left">
            <div class="header-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
            </div>
            <div class="header-title">
              <h3>奖励规则</h3>
              <p class="header-subtitle">签到获得积分奖励</p>
            </div>
          </div>
          <button class="delete-close-btn" @click="closeRewardRulesModal">X</button>
        </div>
        <div class="reward-rules-body">
          <div class="reward-rules-list">
            <div class="reward-rule-item">
              <div class="rule-icon normal">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
              </div>
              <div class="rule-content">
                <div class="rule-title">普通签到</div>
                <div class="rule-description">每日签到可获得</div>
                <div class="rule-points">5积分</div>
              </div>
            </div>
            
            <div class="reward-rule-item">
              <div class="rule-icon streak">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
              </div>
              <div class="rule-content">
                <div class="rule-title">连续签到 3-6天</div>
                <div class="rule-description">连续签到可获得额外奖励</div>
                <div class="rule-points">10积分</div>
              </div>
            </div>
            
            <div class="reward-rule-item">
              <div class="rule-icon super">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
              </div>
              <div class="rule-content">
                <div class="rule-title">连续签到 7天以上</div>
                <div class="rule-description">连续签到可获得超级奖励</div>
                <div class="rule-points">20积分</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 打卡记录弹窗 -->
    <div v-if="showCheckinHistoryModal" class="device-modal" @click="closeCheckinHistoryModal">
      <div class="checkin-history-modal-content" @click.stop>
        <div class="checkin-history-header">
          <div class="header-left">
            <div class="header-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="header-title">
              <h3>打卡记录</h3>
              <p class="header-subtitle">总签到: {{ checkinStats.total_check_ins }}天</p>
            </div>
          </div>
          <button class="delete-close-btn" @click="closeCheckinHistoryModal">X</button>
        </div>
        <div class="checkin-history-body">
          <div v-if="isLoadingCheckinHistory && checkinHistory.length === 0" class="loading-messages">
            加载中...
          </div>
          <div v-else-if="checkinHistory.length === 0" class="no-messages">
            暂无打卡记录
          </div>
          <div v-else class="checkin-history-list">
            <div 
              v-for="record in checkinHistory" 
              :key="record.id" 
              class="checkin-history-item"
            >
              <div class="checkin-content">
                <div class="checkin-main-row">
                  <div class="checkin-description">
                    {{ getCheckinTypeText(record.check_in_type) }}
                    <span class="checkin-amount positive">+{{ record.points_earned || 0 }}</span>
                  </div>
                  <div v-if="record.extra && record.extra.platform" class="checkin-platform">来源: {{ record.extra.platform }}</div>
                </div>
                <div class="checkin-details">
                  <span class="checkin-balance">连续: {{ record.continuous_days || 0 }}天</span>
                  <span class="checkin-time">{{ formatCheckinTime(record.check_in_time) }}</span>
                </div>
              </div>
            </div>
            
            <!-- 加载更多按钮或没有更多提示 -->
            <div class="load-more-container">
              <button 
                v-if="hasMoreCheckinHistory"
                class="load-more-btn" 
                @click="loadMoreCheckinHistory"
                :disabled="isLoadingCheckinHistory"
              >
                {{ isLoadingCheckinHistory ? '加载中...' : '加载更多' }}
              </button>
              <div v-else-if="checkinHistory.length > 0" class="no-more-messages">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
                <span>没有更多记录了</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { checkIn, getCheckinCalendar, getCheckinStats, getCheckinHistory } from '../api/points'
import { ElMessage } from 'element-plus'
import { useGlobalStore } from '../stores/global'

// 定义 props
const props = defineProps({
  device: {
    type: Object,
    default: () => ({})
  }
})

// 定义 emits
const emit = defineEmits(['checkin-success'])

// 全局状态
const globalStore = useGlobalStore()

// 响应式数据
const currentDate = ref(new Date())
const isLoading = ref(false)
const checkinData = ref(new Map()) // 存储打卡数据
const checkinStats = ref({
  total_check_ins: 0,
  continuous_days: 0,
  longest_continuous: 0
})

// 打卡记录弹窗相关数据
const showCheckinHistoryModal = ref(false)
const checkinHistory = ref([])
const isLoadingCheckinHistory = ref(false)
const checkinHistoryPage = ref(1)
const checkinHistoryLimit = ref(20)
const hasMoreCheckinHistory = ref(true)

// 奖励规则弹窗相关数据
const showRewardRulesModal = ref(false)

// 星期几的显示
const weekdays = ['日', '一', '二', '三', '四', '五', '六']

// 当前月份和年份
const currentMonth = computed(() => {
  return currentDate.value.toLocaleDateString('zh-CN', { month: 'long' })
})

const currentYear = computed(() => {
  return currentDate.value.getFullYear()
})

// 计算打卡统计
const checkinCount = computed(() => {
  return checkinStats.value.total_check_ins || 0
})

const currentStreak = computed(() => {
  return checkinStats.value.continuous_days || 0
})

const longestStreak = computed(() => {
  return checkinStats.value.longest_continuous || 0
})

// 格式化日期为 YYYY-MM-DD
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 获取今天的日期
const today = new Date()
const todayStr = formatDate(today)

// 生成日历数据
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // 获取当月第一天和最后一天
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  // 获取第一天是星期几（0-6，0是星期日）
  const firstDayWeek = firstDay.getDay()
  
  // 计算需要显示的总天数（包括上个月和下个月的天数）
  const totalDays = firstDayWeek + lastDay.getDate()
  const totalWeeks = Math.ceil(totalDays / 7)
  const totalCells = totalWeeks * 7
  
  const days = []
  
  // 添加上个月的日期
  const prevMonth = new Date(year, month - 1, 0)
  for (let i = firstDayWeek - 1; i >= 0; i--) {
    const date = prevMonth.getDate() - i
    days.push({
      date,
      month: month - 1,
      year,
      otherMonth: true,
      isToday: false,
      checkedIn: false,
      canCheckIn: false
    })
  }
  
  // 添加当月的日期
  for (let date = 1; date <= lastDay.getDate(); date++) {
    const dayDate = new Date(year, month, date)
    const dateStr = formatDate(dayDate)
    const isToday = dateStr === todayStr
    const checkedIn = checkinData.value.has(dateStr)
    const canCheckIn = !checkedIn && isToday
    
    days.push({
      date,
      month,
      year,
      otherMonth: false,
      isToday,
      checkedIn,
      canCheckIn,
      dateStr
    })
  }
  
  // 添加下个月的日期
  const remainingDays = totalCells - days.length
  for (let date = 1; date <= remainingDays; date++) {
    days.push({
      date,
      month: month + 1,
      year,
      otherMonth: true,
      isToday: false,
      checkedIn: false,
      canCheckIn: false
    })
  }
  
  return days
})

// 切换月份
const previousMonth = () => {
  isLoading.value = true
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  setTimeout(() => {
    isLoading.value = false
  }, 200)
}

const nextMonth = () => {
  isLoading.value = true
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  setTimeout(() => {
    isLoading.value = false
  }, 200)
}

// 获取签到统计数据
const loadCheckinStats = async () => {
  try {
    const response = await getCheckinStats()
    checkinStats.value = response
  } catch (error) {
    console.error('获取签到统计数据失败:', error)
    checkinStats.value = {
      total_check_ins: 0,
      continuous_days: 0,
      longest_continuous: 0
    }
  }
}

// 获取指定月份的签到数据
const loadCheckinData = async (year, month) => {
  try {
    const response = await getCheckinCalendar(year, month)

    // 清空当前月份的签到数据
    const currentMonthData = new Map()
    
    // 将服务器返回的签到日期添加到本地数据中
    if (response.check_in_dates && Array.isArray(response.check_in_dates)) {
      response.check_in_dates.forEach(dateStr => {
        currentMonthData.set(dateStr, {
          date: dateStr
        })
      })
    }
    
    // 更新签到数据
    checkinData.value = currentMonthData
  } catch (error) {
    console.error('获取签到日历数据失败:', error)
    checkinData.value = new Map()
  }
}

// 处理日期点击
const handleDayClick = async (day) => {
  if (!day.canCheckIn || isLoading.value) return
  
  const dateStr = day.dateStr
  if (checkinData.value.has(dateStr)) {
    // 已签到，不能取消
    return
  }
  
  // 执行签到
  isLoading.value = true
  
  try {
    const response = await checkIn({
      ip_address: '', // 可以后续添加IP获取逻辑
      platform: 'web'
    })
    
    // 签到成功，更新本地数据
    checkinData.value.set(dateStr, {
      date: dateStr
    })
    
    // 触发签到成功事件
    emit('checkin-success', response)
    
    // 重新加载统计数据和当前月份的签到数据
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth() + 1
    await Promise.all([
      loadCheckinStats(),
      loadCheckinData(year, month)
    ])
  } catch (error) {
    console.error('签到失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 监听当前日期变化，重新加载签到数据
watch(currentDate, (newDate) => {
  const year = newDate.getFullYear()
  const month = newDate.getMonth() + 1 // getMonth() 返回 0-11，需要 +1
  loadCheckinData(year, month)
}, { immediate: false })

// 奖励规则相关方法
const openRewardRulesModal = () => {
  showRewardRulesModal.value = true
}

const closeRewardRulesModal = () => {
  showRewardRulesModal.value = false
}

// 打卡记录相关方法
const openCheckinHistoryModal = () => {
  showCheckinHistoryModal.value = true
  checkinHistoryPage.value = 1
  hasMoreCheckinHistory.value = true
  loadCheckinHistory(false)
}

const closeCheckinHistoryModal = () => {
  showCheckinHistoryModal.value = false
  checkinHistory.value = []
}

const loadCheckinHistory = async (append = false) => {
  const skip = append ? checkinHistory.value.length : 0
  const limit = 20
  
  isLoadingCheckinHistory.value = true
  
  try {
    const response = await getCheckinHistory(skip, limit)
    
    if (append) {
      checkinHistory.value = [...checkinHistory.value, ...response]
    } else {
      checkinHistory.value = response
    }
    
    hasMoreCheckinHistory.value = response.length === limit
  } catch (error) {
    console.error('加载打卡记录失败:', error)
  } finally {
    isLoadingCheckinHistory.value = false
  }
}

const loadMoreCheckinHistory = () => {
  if (!isLoadingCheckinHistory.value && hasMoreCheckinHistory.value) {
    loadCheckinHistory(true)
  }
}

const formatCheckinTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const getCheckinTypeText = (type) => {
  const typeMap = {
    'normal': '正常',
    'bonus': '奖励',
    'makeup': '补签'
  }
  return typeMap[type] || '签到'
}

// 组件挂载时加载签到统计数据和当前月份的签到数据
onMounted(async () => {
  // 并行加载统计数据和日历数据
  await Promise.all([
    loadCheckinStats(),
    loadCheckinData(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)
  ])
})
</script>

<style scoped>
@import '../styles/colors.css';

.checkin-calendar {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 18px;
  min-height: 400px;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.calendar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.calendar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkin-history-btn {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.checkin-history-btn:hover {
  background: var(--color-hover);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.checkin-history-btn svg {
  width: 14px;
  height: 14px;
}

.reward-rules-btn {
  background: none;
  border: none;
  color: var(--color-text-primary);
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.reward-rules-btn:hover {
  color: var(--color-primary);
}

.reward-rules-btn svg {
  width: 14px;
  height: 14px;
}

.calendar-icon {
  border: none;
  border-radius: 10px;
  background: var(--color-button-dark);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 10px 12px;
}

.calendar-icon svg {
  width: 24px;
  height: 24px;
  color: var(--color-text-primary);
}

.calendar-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.calendar-info h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.calendar-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
}

.checkin-count {
  color: var(--color-primary);
  font-weight: 600;
}

.checkin-streak {
  color: var(--color-text-secondary);
}

.calendar-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.nav-btn {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover:not(:disabled) {
  background: var(--color-hover);
  border-color: var(--color-primary);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-btn svg {
  width: 16px;
  height: 16px;
  color: var(--color-text-primary);
}

.month-year {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.calendar-grid {
  margin-bottom: 16px;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  padding: 8px 4px;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  padding: 4px;
}

.calendar-day:hover {
  background: var(--color-hover);
}

.calendar-day.other-month {
  opacity: 0.3;
  cursor: default;
}

.calendar-day.other-month:hover {
  background: transparent;
}

.calendar-day.today {
  background: var(--color-primary);
  color: var(--color-primary-text);
  font-weight: 600;
}

.calendar-day.checked-in {
  background: var(--color-success);
  color: white;
}

.calendar-day.checked-in .day-number {
  color: white;
}

.calendar-day.can-checkin:not(.checked-in):not(.today) {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
}

.calendar-day.can-checkin:not(.checked-in):not(.today):hover {
  background: var(--color-primary);
  color: var(--color-primary-text);
  border-color: var(--color-primary);
}

.day-number {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.checkin-indicator {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkin-indicator svg {
  width: 8px;
  height: 8px;
  color: white;
}

.calendar-legend {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

.legend-left {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.legend-right {
  display: flex;
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-dot.checked {
  background: var(--color-success);
}

.legend-dot.today {
  background: var(--color-primary);
}

.legend-dot.available {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
}


/* 奖励规则弹窗样式 */
.reward-rules-modal-content {
  background: var(--color-shadow-overlay);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 0 10px 30px var(--shadow-soft);
  width: 80%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.reward-rules-header {
  background: var(--color-bg-secondary);
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  border-radius: 16px 16px 0 0;
}

.reward-rules-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: var(--color-bg-secondary);
  min-height: 0;
}

.reward-rules-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reward-rule-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.reward-rule-item:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.rule-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.rule-icon.normal {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
}

.rule-icon.streak {
  background: var(--color-success);
  color: white;
}

.rule-icon.super {
  background: var(--color-primary);
  color: var(--color-primary-text);
}

.rule-icon svg {
  width: 24px;
  height: 24px;
}

.rule-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rule-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.rule-description {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

.rule-points {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
}

/* 打卡记录弹窗样式 */
.device-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.checkin-history-modal-content {
  background: var(--color-shadow-overlay);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 0 10px 30px var(--shadow-soft);
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.checkin-history-header {
  background: var(--color-bg-secondary);
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  border-radius: 16px 16px 0 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-text);
  flex-shrink: 0;
}

.header-icon svg {
  width: 12px;
  height: 12px;
}

.header-title h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.header-subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.delete-close-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.delete-close-btn:hover {
  background: var(--color-hover);
  color: var(--color-text-primary);
}

.checkin-history-body {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  background: var(--color-bg-secondary);
  min-height: 0;
  /* 隐藏滚动条但保持滚动功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  border-radius: 0 0 16px 16px;
}

.checkin-history-body::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.checkin-history-list {
  padding: 0;
}

.checkin-history-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.checkin-history-item:hover {
  background-color: var(--color-hover);
}

.checkin-history-item:last-child {
  border-bottom: none;
}

.checkin-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.checkin-main-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.checkin-description {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.3;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkin-amount {
  font-weight: 600;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

.checkin-amount.positive {
  color: var(--color-success);
  background: var(--color-success);
  color: white;
}

.checkin-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.checkin-balance {
  color: var(--color-text-muted);
  font-weight: 500;
  font-size: 11px;
}

.checkin-platform {
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 500;
  text-align: right;
}

.checkin-time {
  font-size: 11px;
  color: var(--color-text-muted);
  margin: 0;
  font-weight: 500;
}

.load-more-container {
  padding: 20px;
  text-align: center;
  border-top: 1px solid var(--color-border);
}

.load-more-btn {
  padding: 10px 24px;
  background: var(--color-primary);
  color: var(--color-bg-primary);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.load-more-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.no-more-messages {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  color: var(--color-text-muted);
  font-size: 14px;
  font-weight: 500;
}

.no-more-messages svg {
  width: 16px;
  height: 16px;
  color: var(--color-text-muted);
}

.loading-messages,
.no-messages {
  text-align: center;
  padding: 40px 20px;
  color: var(--color-text-muted);
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .calendar-stats {
    flex-direction: column;
    gap: 4px;
  }
  
  .calendar-legend {
    flex-direction: column;
    gap: 8px;
  }
}
</style>

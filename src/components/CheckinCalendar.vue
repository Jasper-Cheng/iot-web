<template>
  <div class="checkin-calendar">
    <div class="calendar-header">
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
          <span class="checkin-count">{{ checkinCount }}天</span>
          <span class="checkin-streak">{{ currentStreak }}天连击</span>
        </div>
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { checkIn } from '../api/points'
import { ElMessage } from 'element-plus'

// 定义 props
const props = defineProps({
  device: {
    type: Object,
    default: () => ({})
  }
})

// 定义 emits
const emit = defineEmits(['checkin-success'])

// 响应式数据
const currentDate = ref(new Date())
const isLoading = ref(false)
const checkinData = ref(new Map()) // 存储打卡数据

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
  return checkinData.value.size
})

const currentStreak = computed(() => {
  const today = new Date()
  let streak = 0
  let checkDate = new Date(today)
  
  while (checkinData.value.has(formatDate(checkDate))) {
    streak++
    checkDate.setDate(checkDate.getDate() - 1)
  }
  
  return streak
})

// 格式化日期为 YYYY-MM-DD
const formatDate = (date) => {
  return date.toISOString().split('T')[0]
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
      date: dateStr,
      timestamp: new Date().getTime(),
      pointsEarned: response.points_earned || 0,
      continuousDays: response.continuous_days || 1,
      checkInTime: response.check_in_time
    })
    
    // 触发签到成功事件
    emit('checkin-success', response)
    console.log('签到成功:', response)
    
  } catch (error) {
    console.error('签到失败:', error)
    
    // 显示服务器返回的错误信息
    let errorMessage = '签到失败'
    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail
    } else if (error.message) {
      errorMessage = error.message
    }
    
    // 使用ElMessage显示错误信息
    ElMessage.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}
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
  gap: 12px;
  margin-bottom: 16px;
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
  justify-content: center;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
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

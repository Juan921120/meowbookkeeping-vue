<template>
  
    <!-- 固定顶部区域 -->
    <div class="fixed-header">
      <div class="return-btn">
        <button @click="router.back()">
          <span class="return-icon"><</span>
        </button>
      </div>
      <!-- 类型切换 -->
      <div class="type-header">
        <div class="type-tabs">
        <button 
          class="type-tab" 
          :class="{ active: record.type === 'expense' }"
          @click="record.type = 'expense'"
        >
          支出
        </button>
        <button 
          class="type-tab" 
          :class="{ active: record.type === 'income' }"
          @click="record.type = 'income'"
        >
          收入
        </button>
      </div>
    </div>

    <!-- 分类选择 - 可滚动区域 -->
    <div class="scrollable-content">
      <div class="category-section">
        <h3 class="section-title">选择分类</h3>
        <div class="categories-grid">
          <div 
            v-for="category in currentCategories" 
            :key="category.id"
            class="category-item"
            :class="{ active: record.category === category.id }"
            @click="record.category = category.id"
          >
            <div class="category-icon" :style="{ borderColor: category.color }">
              {{ category.icon }}
            </div>
            <span class="category-name">{{ category.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-section">
      <!-- 金额输入 -->
      <div class="amount-section">
        <div class="amount-display">
          <span class="currency">¥</span>
          <span class="amount">{{ displayAmount }}</span>
        </div>
        <div class="keyboard">
          <div class="keyboard-row">
            <button class="key" @click="addDigit('1')">1</button>
            <button class="key" @click="addDigit('2')">2</button>
            <button class="key" @click="addDigit('3')">3</button>
          </div>
          <div class="keyboard-row">
            <button class="key" @click="addDigit('4')">4</button>
            <button class="key" @click="addDigit('5')">5</button>
            <button class="key" @click="addDigit('6')">6</button>
          </div>
          <div class="keyboard-row">
            <button class="key" @click="addDigit('7')">7</button>
            <button class="key" @click="addDigit('8')">8</button>
            <button class="key" @click="addDigit('9')">9</button>
          </div>
          <div class="keyboard-row">
            <button class="key" @click="addDecimal">.</button>
            <button class="key" @click="addDigit('0')">0</button>
            <button class="key delete" @click="deleteDigit">←</button>
          </div>
        </div>
      </div>

      <!-- 备注输入 -->
      <div class="note-section">
        <input 
          v-model="record.note" 
          type="text" 
          placeholder="添加备注（可选）"
          class="note-input"
        >
      </div>

      <!-- 日期选择 -->
      <div class="date-section">
        <button class="date-button" @click="showCalendar = true">
          {{ displayDate }}
        </button>
      </div>

      <!-- 保存按钮 -->
      <div class="save-section">
        <button class="save-btn" @click="saveRecord">
          保存修改
        </button>
      </div>
    </div>

    <!-- 日历弹窗 -->
    <div v-if="showCalendar" class="calendar-overlay" @click="showCalendar = false">
      <div class="calendar-popup" @click.stop>
        <div class="calendar-header">
          <button class="calendar-nav" @click="previousMonth">‹</button>
          <span class="calendar-title">{{ calendarTitle }}</span>
          <button class="calendar-nav" @click="nextMonth">›</button>
        </div>
        <div class="calendar-grid">
          <div class="calendar-weekdays">
            <span v-for="day in weekdays" :key="day" class="weekday">{{ day }}</span>
          </div>
          <div class="calendar-days">
            <div 
              v-for="day in calendarDays" 
              :key="day.date"
              class="calendar-day"
              :class="{ 
                'other-month': !day.currentMonth,
                'selected': day.date === selectedDateString,
                'today': day.date === todayString
              }"
              @click="selectDate(day.date)"
            >
              {{ day.day }}
            </div>
          </div>
        </div>
        <div class="calendar-actions">
          <button class="calendar-btn" @click="selectToday">今天</button>
          <button class="calendar-btn" @click="showCalendar = false">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getRecordById, updateRecord } from '../utils/storage'
import { expenseCategories, incomeCategories } from '../utils/categories'

const route = useRoute()
const router = useRouter()

// 记录数据
const record = ref({
  type: 'expense',
  category: '',
  amount: 0,
  note: '',
  date: new Date().toISOString().split('T')[0]
})

// 日历相关
const showCalendar = ref(false)
const currentMonth = ref(new Date())
const selectedDate = ref(new Date())

// 金额输入
const amountString = ref('0')

// 计算属性
const currentCategories = computed(() => {
  return record.value.type === 'expense' ? expenseCategories : incomeCategories
})

const displayAmount = computed(() => {
  return amountString.value === '0' ? '0.00' : amountString.value
})

const displayDate = computed(() => {
  const date = new Date(record.value.date)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) {
    return '今天'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return '昨天'
  } else {
    const weekdays = ['日', '一', '二', '三', '四', '五', '六']
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekday = weekdays[date.getDay()]
    return `${month}.${day} 星期${weekday}`
  }
})

const calendarTitle = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth() + 1
  return `${year}年${month}月`
})

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days = []
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    days.push({
      date: date.toISOString().split('T')[0],
      day: date.getDate(),
      currentMonth: date.getMonth() === month
    })
  }
  return days
})

const selectedDateString = computed(() => {
  return record.value.date
})

const todayString = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

// 方法
const addDigit = (digit) => {
  if (amountString.value === '0' && digit !== '.') {
    amountString.value = digit
  } else {
    amountString.value += digit
  }
  updateAmount()
}

const addDecimal = () => {
  if (!amountString.value.includes('.')) {
    amountString.value += '.'
  }
  updateAmount()
}

const deleteDigit = () => {
  if (amountString.value.length > 1) {
    amountString.value = amountString.value.slice(0, -1)
  } else {
    amountString.value = '0'
  }
  updateAmount()
}

const updateAmount = () => {
  const amount = parseFloat(amountString.value) || 0
  record.value.amount = amount
}

const selectDate = (dateString) => {
  record.value.date = dateString
  selectedDate.value = new Date(dateString)
  showCalendar.value = false
}

const selectToday = () => {
  const today = new Date().toISOString().split('T')[0]
  selectDate(today)
}

const previousMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 1)
}



const saveRecord = () => {
  if (record.value.amount <= 0) {
    alert('请输入有效金额')
    return
  }
  
  if (!record.value.category) {
    alert('请选择分类')
    return
  }
  
  try {
    updateRecord(record.value.id, record.value)
    router.push('/')
  } catch (error) {
    alert('保存失败：' + error.message)
  }
}

// 初始化
onMounted(() => {
  const recordId = route.params.id
  if (recordId) {
    const existingRecord = getRecordById(recordId)
    if (existingRecord) {
      record.value = { ...existingRecord }
      amountString.value = existingRecord.amount.toString()
      selectedDate.value = new Date(existingRecord.date)
    } else {
      alert('记录不存在')
      router.push('/')
    }
  } else {
    router.push('/')
  }
})
</script>

<style scoped>


/* 固定顶部区域 */
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
 
}

.return-btn {
 margin-bottom: 10px;
 display: block;
}

.return-btn button {
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.return-btn button:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

.return-icon {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.type-header {
  padding: 60px 30px 20px 30px; /* 顶部留出返回按钮的空间 */
  background: transparent;
  width: 100%;
}

.back-btn {
  align-items: center;
  gap: 4px;
  border: none;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.back-btn:hover {
  color: #333;
}

.back-icon {
  font-size: 20px;
  font-weight: bold;
}

.type-tabs {
  display: flex;
  border-radius: 8px;
}

.type-tab {
  flex: 1;
  padding: 4px;
  border: none;
  background: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-tab.active {
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 可滚动内容区域 */
.scrollable-content {
  margin-top: 140px; /* 为固定顶部区域留出空间 */
  flex: 1;
  overflow-y: auto;
  padding-bottom: 300px; /* 为底部输入区域留出空间 */
}

.category-section {
  padding: 20px 0;
  background: rgba(255, 255, 255, 0.9);
  width: 100%;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-item:hover {
  background: #f8f9fa;
}

.category-item.active {
  background: #fff3cd;
}

.category-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: white;
}

.category-name {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.input-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 100;
}

.amount-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.amount-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.currency {
  font-size: 24px;
  color: #333;
  font-weight: 500;
}

.amount {
  font-size: 32px;
  color: #333;
  font-weight: bold;
}

.keyboard {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.keyboard-row {
  display: flex;
  gap: 8px;
}

.key {
  flex: 1;
  height: 60px;
  border: none;
  background: white;
  border-radius: 8px;
  font-size: 20px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.key:hover {
  background: #f8f9fa;
}

.key:active {
  transform: scale(0.95);
}

.key.delete {
  background: #ff6b6b;
  color: white;
}

.key.delete:hover {
  background: #ff5252;
}

.note-section {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.note-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  color: #333;
  background: transparent;
}

.note-input::placeholder {
  color: #999;
}

.date-section {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.date-button {
  width: 100%;
  padding: 12px;
  border: none;
  background: none;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  text-align: left;
}

.save-section {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.save-btn {
  width: 100%;
  padding: 16px;
  border: none;
  background: #ff6b6b;
  color: white;
  font-size: 18px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-btn:hover {
  background: #ff5252;
}

/* 日历弹窗 */
.calendar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.calendar-popup {
  background: white;
  border-radius: 12px;
  padding: 20px;
  width: 90%;
  max-width: 320px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.calendar-nav {
  width: 32px;
  height: 32px;
  border: none;
  background: #f0f0f0;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.calendar-nav:hover {
  background: #e0e0e0;
}

.calendar-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
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
  color: #999;
  padding: 8px 0;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.calendar-day:hover {
  background: #f0f0f0;
}

.calendar-day.other-month {
  color: #ccc;
}

.calendar-day.selected {
  background: #ff6b6b;
  color: white;
}

.calendar-day.today {
  background: #ffd93d;
  color: #333;
  font-weight: 600;
}

.calendar-actions {
  display: flex;
  gap: 8px;
}

.calendar-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.calendar-btn:first-child {
  background: #f0f0f0;
  color: #333;
}

.calendar-btn:last-child {
  background: #ff6b6b;
  color: white;
}

.calendar-btn:hover {
  opacity: 0.8;
}

@media (max-width: 480px) {
  .categories-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
  
  .category-icon {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .amount {
    font-size: 28px;
  }
  
  .key {
    height: 50px;
    font-size: 18px;
  }
}
</style> 
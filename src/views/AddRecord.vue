<template>
  <div class="add-record">
    <!-- 固定顶部区域 -->
    <div class="fixed-header">
      <div class="return-btn">
        <button @click="router.back()">
          <span class="return-icon"><</span>
        </button>
      </div>
      <!-- 头部类型选择 -->
      <header class="type-header">
        <div class="type-tabs">
          <button 
            class="type-tab" 
            :class="{ active: recordType === 'expense' }"
            @click="recordType = 'expense'"
          >
            支出
          </button>
          <button 
            class="type-tab" 
            :class="{ active: recordType === 'income' }"
            @click="recordType = 'income'"
          >
            收入
          </button>
        </div>
      </header>
    </div>

    <!-- 分类选择 - 可滚动区域 -->
    <div class="scrollable-content">
      <div class="category-section">
        <div class="category-grid">
          <button
            v-for="category in currentCategories"
            :key="category.id"
            class="category-item"
            :class="{ selected: selectedCategory === category.id }"
            @click="selectedCategory = category.id"
          >
            <div class="category-icon" :style="{ borderColor: 'rgb(255 199 178)' }">
              {{ category.icon }}
            </div>
            <span class="category-name">{{ category.name }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-section">
      <!-- 备注和金额显示 -->
      <div class="input-bar">
        <input
          v-model="note"
          type="text"
          class="note-input"
          placeholder="点击写备注..."
        />
        <div class="amount-display">
          ¥ {{ displayAmount }}
        </div>
      </div>

      <!-- 数字键盘 -->
      <div class="keypad">
        <div class="keypad-row">
          <button class="key-btn" @click="appendNumber('7')">7</button>
          <button class="key-btn" @click="appendNumber('8')">8</button>
          <button class="key-btn" @click="appendNumber('9')">9</button>
          <button class="key-btn function-btn" @click="showCalendar = true">
            <span class="calendar-icon">📅</span>
            {{ displayDate }}
          </button>
        </div>
        <div class="keypad-row">
          <button class="key-btn" @click="appendNumber('4')">4</button>
          <button class="key-btn" @click="appendNumber('5')">5</button>
          <button class="key-btn" @click="appendNumber('6')">6</button>
          <button class="key-btn function-btn" @click="appendOperator('+')">+</button>
        </div>
        <div class="keypad-row">
          <button class="key-btn" @click="appendNumber('1')">1</button>
          <button class="key-btn" @click="appendNumber('2')">2</button>
          <button class="key-btn" @click="appendNumber('3')">3</button>
          <button class="key-btn function-btn" @click="appendOperator('-')">-</button>
        </div>
        <div class="keypad-row">
          <button class="key-btn" @click="appendNumber('.')">.</button>
          <button class="key-btn" @click="appendNumber('0')">0</button>
          <button class="key-btn backspace-btn" @click="backspace">⌫</button>
          <button class="key-btn submit-btn" @click="saveRecord">完成</button>
        </div>
      </div>
    </div>

    <!-- 日历弹窗 -->
    <div v-if="showCalendar" class="calendar-overlay" @click="showCalendar = false">
      <div class="calendar-popup" @click.stop>
        <div class="calendar-header">
          <button class="calendar-nav" @click="previousMonth">‹</button>
          <div class="calendar-title">
            <span class="calendar-year">{{ currentYear }}年</span>
            <span class="calendar-month">{{ currentMonth }}月</span>
          </div>
          <button class="calendar-nav" @click="nextMonth">›</button>
        </div>
        
        <div class="calendar-weekdays">
          <span v-for="day in weekdays" :key="day" class="weekday" :class="{ weekend: day === '六' || day === '日' }">
            {{ day }}
          </span>
        </div>
        
        <div class="calendar-days">
          <button
            v-for="day in calendarDays"
            :key="day.key"
            class="calendar-day"
            :class="{
              'other-month': day.otherMonth,
              'selected': day.selected,
              'today': day.today
            }"
            @click="selectDate(day.date)"
          >
            {{ day.day }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { addRecord } from '../utils/storage'
import { expenseCategories, incomeCategories } from '../utils/categories'

const router = useRouter()

// 记录数据
const recordType = ref('expense')
const selectedCategory = ref('dining')
const amount = ref('0')
const note = ref('')
const selectedDate = ref(new Date())

// 日历相关
const showCalendar = ref(false)
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth() + 1)
const weekdays = ['一', '二', '三', '四', '五', '六', '日']

// 当前分类列表
const currentCategories = computed(() => {
  return recordType.value === 'expense' ? expenseCategories : incomeCategories
})

// 显示金额
const displayAmount = computed(() => {
  const num = parseFloat(amount.value) || 0
  return num.toFixed(2)
})

// 显示选中的日期
const displayDate = computed(() => {
  const today = new Date()
  const selected = selectedDate.value
  
  if (selected.toDateString() === today.toDateString()) {
    return '今天'
  } else {
    const month = selected.getMonth() + 1
    const day = selected.getDate()
    return `${month}.${day}`
  }
})

// 日历天数
const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay() + 1)
  
  const days = []
  const today = new Date()
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    const isOtherMonth = date.getMonth() !== month - 1
    const isSelected = date.toDateString() === selectedDate.value.toDateString()
    const isToday = date.toDateString() === today.toDateString()
    
    days.push({
      key: date.toISOString(),
      day: date.getDate(),
      date: date,
      otherMonth: isOtherMonth,
      selected: isSelected,
      today: isToday
    })
  }
  
  return days
})

// 添加数字
const appendNumber = (num) => {
  if (amount.value === '0' && num !== '.') {
    amount.value = num
  } else if (num === '.' && amount.value.includes('.')) {
    return
  } else {
    amount.value += num
  }
}

// 添加运算符
const appendOperator = (operator) => {
  if (amount.value !== '0') {
    amount.value += operator
  }
}

// 退格
const backspace = () => {
  if (amount.value.length > 1) {
    amount.value = amount.value.slice(0, -1)
  } else {
    amount.value = '0'
  }
}

// 选择日期
const selectDate = (date) => {
  selectedDate.value = date
  // 更新日历显示的月份
  currentYear.value = date.getFullYear()
  currentMonth.value = date.getMonth() + 1
  showCalendar.value = false
}

// 上个月
const previousMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

// 下个月
const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

// 保存记录
const saveRecord = async () => {
  const numAmount = parseFloat(amount.value) || 0
  if (numAmount <= 0) {
    alert('请输入有效金额')
    return
  }
  
  const record = {
    type: recordType.value,
    category: selectedCategory.value,
    amount: numAmount,
    note: note.value.trim(),
    date: selectedDate.value.toISOString().split('T')[0]
  }
  
  try {
    await addRecord(record)
    router.push('/')
  } catch (error) {
    alert('保存失败：' + error.message)
  }
}

// 监听类型变化，重置分类
const resetCategory = () => {
  const categories = currentCategories.value
  selectedCategory.value = categories[0]?.id || 'other'
}

// 监听记录类型变化
watch(recordType, resetCategory)

onMounted(() => {
  resetCategory()
})
</script>

<style scoped>
.add-record {
  min-height: 100vh;
  background: transparent;
  display: flex;
  flex-direction: column;
}

/* 固定顶部区域 */
.fixed-header {
  position: fixed;
  padding-bottom: 10px;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  background-image:
    url('/images/cat-paw.png'),
    url('/images/cat-paw.png');
  background-size: 80px 80px, 80px 80px;
  background-position: 0 0, 40px 40px;
  background-repeat: repeat, repeat;
  background-color: #ffe7d6;
}

.return-btn {
 margin: 10px;
}

.return-btn button {
  background: rgba(255, 255, 255, 0.9);
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
 margin: 0 auto;
  width: 70%;

}

.type-tabs {
  display: flex;
}

.type-tab {
  flex: 1;
  border: none;
  background: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  color: #999;
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-tab.active {
  color: #ff6b6b;
  background-image: url('/images/cat-paw.png');
}

/* 可滚动内容区域 */
.scrollable-content {
  margin-top: 100px; /* 为固定顶部区域留出空间 */
  flex: 1;
  overflow-y: auto;
  padding-bottom: 300px; /* 为底部输入区域留出空间 */
  padding-bottom: 300px; /* 为底部输入区域留出空间 */
}

.category-section {
  padding: 20px 0;
  width: 100%;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 12px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  /* 禁用双击缩放 */
  touch-action: manipulation;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.category-item:hover {
  background: #f8f9fa;
}

.category-item.selected {
  background: #fff5f5;
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
  transition: all 0.3s ease;
}

.category-item.selected .category-icon {
  background: #ff6b6b;
  color: white;
}

.category-name {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.category-item.selected .category-name {
  color: #ff6b6b;
  font-weight: 500;
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
  background-image:
    url('/images/cat-paw.png'),
    url('/images/cat-paw.png');
  background-size: 80px 80px, 80px 80px;
  background-position: 0 0, 40px 40px;
  background-repeat: repeat, repeat;
  background-color: #FFEEE2;
}

.input-bar {
  background: white;
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.note-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #333;
  background: none;
}

.note-input::placeholder {
  color: #999;
}

.amount-display {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-left: 16px;
}

.keypad {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.keypad-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 12px;
}

.key-btn {
  height: 56px;
  border: none;
  border-radius: 12px;
  background: white;
  font-size: 18px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* 禁用双击缩放 */
  touch-action: manipulation;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.key-btn:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
}

.key-btn:active {
  transform: translateY(0);
}

.function-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: 14px;
}

.calendar-icon {
  font-size: 16px;
}

.backspace-btn {
  font-size: 16px;
  color: #666;
}

.submit-btn {
  background: #ff6b6b;
  color: white;
  font-size: 16px;
  font-weight: bold;
  /* 禁用双击缩放 */
  touch-action: manipulation;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.submit-btn:hover {
  background: #ff5252;
}

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
  border-radius: 16px;
  padding: 20px;
  width: 90%;
  max-width: 320px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-nav {
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f5;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.calendar-year {
  font-size: 16px;
  color: #999;
}

.calendar-month {
  font-size: 18px;
  color: #ff6b6b;
  font-weight: bold;
  border-bottom: 2px dashed #ff6b6b;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 12px;
}

.weekday {
  text-align: center;
  font-size: 14px;
  color: #666;
  padding: 8px 0;
}

.weekday.weekend {
  color: #ff6b6b;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-day {
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.calendar-day.other-month {
  color: #ccc;
}

.calendar-day.today {
  background: #ffd93d;
  color: #333;
  font-weight: bold;
}

.calendar-day.selected {
  background: #ff6b6b;
  color: white;
  font-weight: bold;
}

.calendar-day:hover:not(.other-month) {
  background: #f0f0f0;
}

@media (max-width: 480px) {
  .category-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
  
  .keypad-row {
    gap: 8px;
  }
  
  .key-btn {
    height: 48px;
    font-size: 16px;
  }
}

@media (min-width: 768px) {
  .category-section {
    padding: 24px 0;
  }
  
  .category-grid {
    max-width: 600px;
    margin: 0 auto;
    grid-template-columns: repeat(6, 1fr);
  }
  
  .input-section {
    padding: 24px 0;
  }
  
  .keypad {
    max-width: 500px;
    margin: 0 auto;
  }
}
</style>
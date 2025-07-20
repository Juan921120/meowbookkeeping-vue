<template>
  <div class="content-container">
    <!-- 网络状态指示器 -->
    <div v-if="!isOnline" class="offline-indicator">
      <div class="offline-icon">📡</div>
      <span class="offline-text">离线模式 - 数据将保存到本地</span>
    </div>

    <!-- 统计卡片 -->
    <JaggedCard class="stats-card-wrapper" border-color="#ff6b6b" border-width="2px" background="white">
      <div class="stats-card">
        <div class="stats-header">
          <h2 class="stats-title">收支统计</h2>
          <div class="stats-tab-indicator">
            <div class="tab-line"></div>

          </div>
        </div>

        <!-- 本年结余 -->
        <div class="stats-row balance-row">
          <span class="stats-label">本年结余</span>
          <span class="stats-value balance-value" :class="{ 'negative': annualStats.balance < 0 }">
            {{ annualStats.balance < 0 ? '-' : '' }} {{ formatAmount(Math.abs(annualStats.balance)) }}
          </span>
        </div>

        <!-- 本年支出 -->
        <div class="stats-row">
          <span class="stats-label">本年支出</span>
          <div class="stats-bar-container">
            <div class="stats-bar expense-bar" :style="{ width: expenseBarWidth + '%' }"></div>
          </div>
          <span class="stats-value">{{ formatAmount(annualStats.expense) }}</span>
        </div>

        <!-- 本年收入 -->
        <div class="stats-row">
          <span class="stats-label">本年收入</span>
          <div class="stats-bar-container">
            <div class="stats-bar income-bar" :style="{ width: incomeBarWidth + '%' }"></div>
          </div>
          <span class="stats-value">{{ annualStats.income > 0 ? formatAmount(annualStats.income) : '暂无' }}</span>
        </div>
      </div>
    </JaggedCard>

    <header class="list-header">
      <h1 class="title">收支记录</h1>
      <button class="add-btn" @click="goToAdd">
        <span class="add-icon">+</span>
        新建
      </button>
    </header>

    <!-- 记录列表 -->
    <div class="records-container">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p class="loading-text">加载中...</p>
      </div>
      
      <!-- 空状态 -->
      <div v-else-if="recordGroups.length === 0" class="empty-state">
        <div class="empty-icon">
          <img src="/images/empty-state.png" alt="empty" class="empty-icon-img">
        </div>
        <p class="empty-text">还没有记录哦</p>
        <p class="empty-subtext">点击右上角"新建"开始记账</p>
      </div>

      <div v-else class="record-groups">
        <JaggedCard v-for="group in recordGroups" :key="group.date" class="record-group-card" border-color="#ff6b6b"
          border-width="2px" background="white">
          <div class="record-group">
            <!-- 日期和余额 -->
            <div class="date-header">
              <div class="date-info">
                <div class="date-line"></div>
                <span class="date-text">{{ formatDate(group.date) }}</span>
              </div>
              <div class="balance-info">
                <span class="balance-label">结余:</span>
                <span class="balance-amount" :class="{ 'negative': group.balance < 0 }">
                  {{ formatAmount(Math.abs(group.balance)) }}
                </span>
              </div>
            </div>

            <!-- 当日记录 -->
            <div class="records">
              <div v-for="record in group.records" :key="record.id" class="swipeable-record">
                <div class="record-content" :style="{ transform: `translateX(${record.swipeOffset || 0}px)` }"
                  @touchstart="handleTouchStart($event, record)" @touchmove="handleTouchMove($event, record)"
                  @touchend="handleTouchEnd($event, record)" @click="editRecord(record.id)">
                  <div class="record-left">
                    <div class="category-icon" :style="{ borderColor: getCategoryColor(record.type, record.category) }">
                      {{ getCategoryIcon(record.type, record.category) }}
                    </div>
                    <div class="record-info">
                      <div class="category-name">{{ getCategoryName(record.type, record.category) }}</div>
                      <div v-if="record.note" class="record-note">{{ record.note }}</div>
                    </div>
                  </div>
                  <div class="record-amount" :class="{ 'income': record.type === 'income' }">
                    {{ record.type === 'income' ? '+' : '–' }} {{ formatAmount(record.amount) }}
                  </div>
                </div>
                <div class="delete-button" @click="deleteRecord(record.id)">
                  删除
                </div>
              </div>
            </div>
          </div>
        </JaggedCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import JaggedCard from '../components/JaggedCard.vue'
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getRecords, groupRecordsByDate, formatDate, formatAmount, deleteRecord as deleteRecordFromStorage } from '../utils/storage'
import { expenseCategories, incomeCategories } from '../utils/categories'

const router = useRouter()
const records = ref([])
const loading = ref(false)
const isOnline = ref(navigator.onLine)

// 触摸相关状态
const touchStartX = ref(0)
const touchStartY = ref(0)
const isSwiping = ref(false)

// 监听网络状态变化
const handleOnline = () => {
  isOnline.value = true
  console.log('网络已连接')
}

const handleOffline = () => {
  isOnline.value = false
  console.log('网络已断开')
}

// 获取记录数据
const loadRecords = async () => {
  loading.value = true
  try {
    records.value = await getRecords()
  } catch (error) {
    console.error('加载记录失败:', error)
    // 如果API失败，可以回退到本地存储
    records.value = []
  } finally {
    loading.value = false
  }
}

// 按日期分组的记录
const recordGroups = computed(() => {
  return groupRecordsByDate(records.value)
})

// 计算本年统计数据
const annualStats = computed(() => {
  const currentYear = new Date().getFullYear()
  let totalIncome = 0
  let totalExpense = 0

  records.value.forEach(record => {
    const recordYear = new Date(record.date).getFullYear()
    if (recordYear === currentYear) {
      const amount = parseFloat(record.amount) || 0
      if (record.type === 'income') {
        totalIncome += amount
      } else {
        totalExpense += amount
      }
    }
  })

  return {
    income: totalIncome,
    expense: totalExpense,
    balance: totalIncome - totalExpense
  }
})

// 计算支出条宽度百分比
const expenseBarWidth = computed(() => {
  const maxAmount = Math.max(annualStats.value.expense, annualStats.value.income, 100)
  return Math.min((annualStats.value.expense / maxAmount) * 100, 100)
})

// 计算收入条宽度百分比
const incomeBarWidth = computed(() => {
  const maxAmount = Math.max(annualStats.value.expense, annualStats.value.income, 100)
  return Math.min((annualStats.value.income / maxAmount) * 100, 100)
})

// 跳转到新增页面
const goToAdd = () => {
  router.push('/add')
}

// 触摸开始
const handleTouchStart = (event, record) => {
  touchStartX.value = event.touches[0].clientX
  touchStartY.value = event.touches[0].clientY
  isSwiping.value = false
}

// 触摸移动
const handleTouchMove = (event, record) => {
  if (!touchStartX.value) return

  const touchX = event.touches[0].clientX
  const touchY = event.touches[0].clientY
  const deltaX = touchX - touchStartX.value
  const deltaY = Math.abs(touchY - touchStartY.value)

  // 判断是否为水平滑动
  if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 10) {
    isSwiping.value = true
    event.preventDefault()

    // 只允许向左滑动（负值）
    const swipeOffset = Math.min(0, Math.max(-80, deltaX))
    record.swipeOffset = swipeOffset
  }
}

// 触摸结束
const handleTouchEnd = (event, record) => {
  if (!isSwiping.value) return

  const deltaX = record.swipeOffset || 0

  // 如果滑动距离超过40px，显示删除按钮
  if (deltaX < -40) {
    record.swipeOffset = -80
  } else {
    record.swipeOffset = 0
  }

  touchStartX.value = 0
  isSwiping.value = false
}

// 删除记录
const deleteRecord = async (recordId) => {
  if (confirm('确定要删除这条记录吗？')) {
    try {
      await deleteRecordFromStorage(recordId)
      await loadRecords() // 重新加载数据
    } catch (error) {
      alert('删除失败：' + error.message)
    }
  }
}

// 编辑记录
const editRecord = (recordId) => {
  // 如果正在滑动，不触发编辑
  if (isSwiping.value) return
  router.push(`/edit/${recordId}`)
}

// 获取分类名称
const getCategoryName = (type, categoryId) => {
  const categories = type === 'expense' ? expenseCategories : incomeCategories
  const category = categories.find(cat => cat.id === categoryId)
  return category ? category.name : '其他'
}

// 获取分类图标
const getCategoryIcon = (type, categoryId) => {
  const categories = type === 'expense' ? expenseCategories : incomeCategories
  const category = categories.find(cat => cat.id === categoryId)
  return category ? category.icon : '⋯'
}

// 获取分类颜色
const getCategoryColor = (type, categoryId) => {
  return 'rgb(255 199 178)'
}

onMounted(() => {
  loadRecords()
  
  // 添加网络状态监听
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
})

onUnmounted(() => {
  // 移除网络状态监听
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})
</script>

<style scoped>
.empty-icon-img {
  max-width: 100px;
  width: 100%;
  height: auto;
}
.content-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 12px;
}

/* 离线状态指示器 */
.offline-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #856404;
}

.offline-icon {
  font-size: 16px;
}

.offline-text {
  font-weight: 500;
}

/* 统计卡片样式 */
.stats-card-wrapper {
  margin-bottom: 20px;
}

.stats-header {
  margin-bottom: 24px;
  position: relative;
}

.stats-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.stats-tab-indicator {
  position: relative;
  height: 2px;
  background: #f0f0f0;
  border-radius: 1px;
}

.tab-line {
  position: absolute;
  left: 10%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background: #ff6b6b;
  border-radius: 1px;
}

.stats-card {
  padding: 20px;
}

.stats-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.stats-row:last-child {
  margin-bottom: 0;
}

.balance-row {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.stats-label {
  flex: 1;
  font-size: 16px;
  color: #666;
}

.stats-bar-container {
  flex: 2;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  margin: 0 12px;
  overflow: hidden;
}

.stats-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.expense-bar {
  background: linear-gradient(90deg, #ff6b6b, #ff8e8e);
}

.income-bar {
  background: linear-gradient(90deg, #ff8a24, #ff9854);
}

.stats-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  min-width: 80px;
  text-align: right;
}

.balance-value {
  font-size: 20px;
  color: #00d2d3;
}

.balance-value.negative {
  color: #ff6b6b;
}

/* 列表头部 */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  /* 禁用双击缩放 */
  touch-action: manipulation;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.add-btn:hover {
  background: #ff5252;
  transform: translateY(-2px);
}

.add-icon {
  font-size: 18px;
  font-weight: bold;
}

/* 记录列表容器 */
.records-container {
  min-height: 200px;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}


.empty-text {
  font-size: 18px;
  color: #666;
  margin-bottom: 8px;
}

.empty-subtext {
  font-size: 14px;
  color: #999;
}

/* 加载状态样式 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ff6b6b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-text {
  font-size: 16px;
  color: #666;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.record-groups {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.record-group-card {
  width: 100%;
}

.record-group {
  padding: 16px;
}

.date-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.date-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-line {
  width: 4px;
  height: 20px;
  background: linear-gradient(135deg, #ffd93d, #ff6b6b);
  border-radius: 2px;
}

.date-text {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.balance-info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.balance-label {
  font-size: 14px;
  color: #999;
}

.balance-amount {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.balance-amount.negative {
  color: #ff6b6b;
}

.records {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.swipeable-record {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid #f0f0f0;
}

.swipeable-record:last-child {
  border-bottom: none;
}

.record-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  background: white;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 2;
  cursor: pointer;
  /* 禁用双击缩放 */
  touch-action: manipulation;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.record-content:hover {
  background: #f8f9fa;
}

.delete-button {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 80px;
  background: #ff6b6b;
  border-left: 6px solid white;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  z-index: 1;
  border-radius: 0 8px 8px 0;
  transition: background-color 0.3s ease;
  /* 禁用双击缩放 */
  touch-action: manipulation;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.delete-button:hover {
  background: #ff5252;
}

.delete-button:active {
  background: #ff4444;
}

.record-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.category-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: white;
}

.record-info {
  flex: 1;
}

.category-name {
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
}

.record-note {
  font-size: 14px;
  color: #999;
}

.record-amount {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.record-amount.income {
  color: #00d2d3;
}

</style>

<style>
body {
  background-image:
    url('/images/cat-paw.png'),
    url('/images/cat-paw.png');
  background-size: 80px 80px, 80px 80px;
  background-position: 0 0, 40px 40px;
  background-repeat: repeat, repeat;
  background-color: #ffe7d6;
}
</style>
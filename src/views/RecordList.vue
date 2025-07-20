<template>
  <div class="container">
    <JaggedCard 
      class="jagged-card"
      border-color="#ff6b6b"
      border-width="4px"
      background="#fff5f5"
    >
      <h3>Vue3 卡片</h3>
      <p>这是一个带有抖动边框的卡片组件</p> 
    </JaggedCard>
  </div>
  <div class="record-list">
    <!-- 头部 -->
    <header class="header">
      <h1 class="title">收支记录</h1>
      <button class="add-btn" @click="goToAdd">
        <span class="add-icon">+</span>
        新建
      </button>
    </header>

    <!-- 记录列表 -->
    <div class="records-container">
      <div v-if="recordGroups.length === 0" class="empty-state">
        <div class="empty-icon">📊</div>
        <p class="empty-text">还没有记录哦</p>
        <p class="empty-subtext">点击右上角"新建"开始记账</p>
      </div>

      <div v-else class="record-groups">
        <div v-for="group in recordGroups" :key="group.date" class="record-group">
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
      </div>
    </div>
  </div>
</template>

<script setup>
import JaggedCard from './JaggedCard.vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getRecords, groupRecordsByDate, formatDate, formatAmount, deleteRecord as deleteRecordFromStorage } from '../utils/storage'
import { expenseCategories, incomeCategories } from '../utils/categories'

const router = useRouter()
const records = ref([])

// 触摸相关状态
const touchStartX = ref(0)
const touchStartY = ref(0)
const isSwiping = ref(false)

// 获取记录数据
const loadRecords = () => {
  records.value = getRecords()
}

// 按日期分组的记录
const recordGroups = computed(() => {
  return groupRecordsByDate(records.value)
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
const deleteRecord = (recordId) => {
  if (confirm('确定要删除这条记录吗？')) {
    deleteRecordFromStorage(recordId)
    loadRecords() // 重新加载数据
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
  const categories = type === 'expense' ? expenseCategories : incomeCategories
  const category = categories.find(cat => cat.id === categoryId)
  return category ? category.color : '#c8d6e5'
}

onMounted(() => {
  loadRecords()
})
</script>

<style scoped>
.jagged-card {
  width: calc(100% - 24px);
  margin: 0 auto;
  display: block; 
  margin-top: 10px;
}

/* 自定义JaggedCard的样式 */
.jagged-card :deep(.jagged-wrapper::before) {
  border-color: #ff0000 !important; /* 纯红色边框 - 测试用 */
  border-width: 10px !important; /* 很粗的边框 - 测试用 */
}

.jagged-card :deep(.card-content) {
  padding: 24px !important; /* 更大的内边距 */
}

.record-list {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  background-image:
    radial-gradient(circle at 20px 20px, rgba(255, 193, 7, 0.1) 2px, transparent 2px),
    radial-gradient(circle at 60px 60px, rgba(255, 193, 7, 0.1) 2px, transparent 2px);
  background-size: 80px 80px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: calc(100% - 24px);
  margin: 0 12px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #ff6b6b;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.add-btn:hover {
  background-color: rgba(255, 107, 107, 0.1);
}

.add-icon {
  font-size: 18px;
  font-weight: bold;
}

.records-container {
  padding: 16px 12px;
  max-width: 100%;
}

@media (min-width: 768px) {
  .records-container {
    padding: 24px 0;
  }

  .record-groups {
    max-width: 600px;
    margin: 0 auto;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
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

.record-groups {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.record-group {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: calc(100% - 24px);
  margin: 0 12px;
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

@media (max-width: 480px) {
  .header {
    padding: 16px 12px;
  }

  .records-container {
    padding: 12px;
  }

  .record-group {
    padding: 12px;
  }
}
</style>
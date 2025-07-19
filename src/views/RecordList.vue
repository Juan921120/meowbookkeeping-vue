<template>
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
            <div v-for="record in group.records" :key="record.id" class="record-item">
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getRecords, groupRecordsByDate, formatDate, formatAmount } from '../utils/storage'
import { expenseCategories, incomeCategories } from '../utils/categories'

const router = useRouter()
const records = ref([])

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
  padding: 20px 0;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
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
  padding: 16px 0;
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
  width: 100%;
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

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.record-item:last-child {
  border-bottom: none;
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
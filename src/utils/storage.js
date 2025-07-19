// 本地存储键名
const RECORDS_KEY = 'meowbookkeeping_records'

// 获取所有记录
export const getRecords = () => {
  try {
    const records = localStorage.getItem(RECORDS_KEY)
    return records ? JSON.parse(records) : []
  } catch (error) {
    console.error('获取记录失败:', error)
    return []
  }
}

// 保存所有记录
export const saveRecords = (records) => {
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records))
  } catch (error) {
    console.error('保存记录失败:', error)
  }
}

// 添加新记录
export const addRecord = (record) => {
  const records = getRecords()
  const newRecord = {
    ...record,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  }
  records.unshift(newRecord)
  saveRecords(records)
  return newRecord
}

// 删除记录
export const deleteRecord = (recordId) => {
  const records = getRecords()
  const filteredRecords = records.filter(record => record.id !== recordId)
  saveRecords(filteredRecords)
}

// 按日期分组记录
export const groupRecordsByDate = (records) => {
  const groups = {}
  
  records.forEach(record => {
    const date = new Date(record.date)
    const dateKey = date.toISOString().split('T')[0]
    
    if (!groups[dateKey]) {
      groups[dateKey] = {
        date: dateKey,
        records: [],
        balance: 0
      }
    }
    
    groups[dateKey].records.push(record)
    
    // 计算当日余额
    if (record.type === 'income') {
      groups[dateKey].balance += record.amount
    } else {
      groups[dateKey].balance -= record.amount
    }
  })
  
  // 按日期排序
  return Object.values(groups).sort((a, b) => new Date(b.date) - new Date(a.date))
}

// 格式化日期显示
export const formatDate = (dateString) => {
  const date = new Date(dateString)
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
}

// 格式化金额显示
export const formatAmount = (amount) => {
  return `¥ ${amount.toFixed(2)}`
} 
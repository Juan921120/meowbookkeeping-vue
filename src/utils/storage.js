import { recordsApi } from './api'

// 本地存储键名
const RECORDS_KEY = 'meowbookkeeping_records'

// 检查是否在线
const isOnline = () => {
  return navigator.onLine
}

// 获取所有记录
export const getRecords = async () => {
  try {
    // 优先使用API
    if (isOnline()) {
      const response = await recordsApi.getList()
      return response.records || []
    }
  } catch (error) {
    console.warn('API获取记录失败，使用本地存储:', error)
  }
  
  // 回退到本地存储
  try {
    const records = localStorage.getItem(RECORDS_KEY)
    return records ? JSON.parse(records) : []
  } catch (error) {
    console.error('获取本地记录失败:', error)
    return []
  }
}

// 保存所有记录（保留兼容性，但实际使用API）
export const saveRecords = (records) => {
  console.warn('saveRecords已废弃，请使用API操作')
  return Promise.resolve()
}

// 添加新记录
export const addRecord = async (record) => {
  try {
    // 优先使用API
    if (isOnline()) {
      const newRecord = await recordsApi.create(record)
      return newRecord
    }
  } catch (error) {
    console.warn('API添加记录失败，使用本地存储:', error)
  }
  
  // 回退到本地存储
  try {
    const records = getRecordsSync()
    const newRecord = {
      ...record,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    records.unshift(newRecord)
    saveRecordsSync(records)
    return newRecord
  } catch (error) {
    console.error('添加本地记录失败:', error)
    throw error
  }
}

// 删除记录
export const deleteRecord = async (recordId) => {
  try {
    // 优先使用API
    if (isOnline()) {
      await recordsApi.delete(recordId)
      return true
    }
  } catch (error) {
    console.warn('API删除记录失败，使用本地存储:', error)
  }
  
  // 回退到本地存储
  try {
    const records = getRecordsSync()
    const filteredRecords = records.filter(record => record.id !== recordId)
    saveRecordsSync(filteredRecords)
    return true
  } catch (error) {
    console.error('删除本地记录失败:', error)
    throw error
  }
}

// 获取单条记录
export const getRecordById = async (recordId) => {
  try {
    // 优先使用API
    if (isOnline()) {
      return await recordsApi.getById(recordId)
    }
  } catch (error) {
    console.warn('API获取记录详情失败，使用本地存储:', error)
  }
  
  // 回退到本地存储
  try {
    const records = getRecordsSync()
    return records.find(record => record.id === recordId)
  } catch (error) {
    console.error('获取本地记录详情失败:', error)
    throw error
  }
}

// 更新记录
export const updateRecord = async (recordId, record) => {
  try {
    // 优先使用API
    if (isOnline()) {
      const updatedRecord = await recordsApi.update(recordId, record)
      return updatedRecord
    }
  } catch (error) {
    console.warn('API更新记录失败，使用本地存储:', error)
  }
  
  // 回退到本地存储
  try {
    const records = getRecordsSync()
    const index = records.findIndex(record => record.id === recordId)
    
    if (index === -1) {
      throw new Error('记录不存在')
    }
    
    records[index] = {
      ...records[index],
      ...record,
      id: recordId,
      updatedAt: new Date().toISOString()
    }
    
    saveRecordsSync(records)
    return records[index]
  } catch (error) {
    console.error('更新本地记录失败:', error)
    throw error
  }
}

// 同步获取记录（用于离线模式）
const getRecordsSync = () => {
  try {
    const records = localStorage.getItem(RECORDS_KEY)
    return records ? JSON.parse(records) : []
  } catch (error) {
    console.error('获取本地记录失败:', error)
    return []
  }
}

// 同步保存记录（用于离线模式）
const saveRecordsSync = (records) => {
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records))
  } catch (error) {
    console.error('保存本地记录失败:', error)
    throw error
  }
}

// 按日期分组记录
export const groupRecordsByDate = (records) => {
  const groups = {}
  
  records.forEach(record => {
    const date = record.date
    if (!groups[date]) {
      groups[date] = {
        date,
        records: [],
        totalIncome: 0,
        totalExpense: 0,
        balance: 0
      }
    }
    
    groups[date].records.push(record)
    
    if (record.type === 'income') {
      groups[date].totalIncome += parseFloat(record.amount) || 0
    } else {
      groups[date].totalExpense += parseFloat(record.amount) || 0
    }
    
    // 计算当日结余
    groups[date].balance = groups[date].totalIncome - groups[date].totalExpense
  })
  
  // 按日期排序
  return Object.values(groups).sort((a, b) => new Date(b.date) - new Date(a.date))
}

// 格式化日期
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
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}.${day}`
  }
}

// 格式化金额
export const formatAmount = (amount) => {
  return parseFloat(amount).toFixed(2)
} 
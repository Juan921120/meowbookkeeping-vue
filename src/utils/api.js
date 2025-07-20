// API基础配置
const API_BASE_URL = 'https://xnwormrvnlfb.sealoshzh.site'

// 重试配置
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1秒
  timeout: 10000 // 10秒
}

// 通用请求函数
const request = async (url, options = {}, retryCount = 0) => {
  const fullUrl = `${API_BASE_URL}${url}`
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    signal: AbortSignal.timeout(RETRY_CONFIG.timeout)
  }

  try {
    const response = await fetch(fullUrl, { ...defaultOptions, ...options })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.code !== 200) {
      throw new Error(data.message || '请求失败')
    }
    
    return data.data
  } catch (error) {
    console.error(`API请求失败 (尝试 ${retryCount + 1}/${RETRY_CONFIG.maxRetries + 1}):`, error)
    
    // 如果是网络错误且还有重试次数，则重试
    if (retryCount < RETRY_CONFIG.maxRetries && 
        (error.name === 'TypeError' || error.name === 'AbortError')) {
      console.log(`等待 ${RETRY_CONFIG.retryDelay}ms 后重试...`)
      await new Promise(resolve => setTimeout(resolve, RETRY_CONFIG.retryDelay))
      return request(url, options, retryCount + 1)
    }
    
    throw error
  }
}

// 记录相关API
export const recordsApi = {
  // 获取记录列表
  getList: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = `/api/records${queryString ? '?' + queryString : ''}`
    return await request(url)
  },

  // 获取记录详情
  getById: async (id) => {
    return await request(`/api/records/${id}`)
  },

  // 创建记录
  create: async (record) => {
    return await request('/api/records', {
      method: 'POST',
      body: JSON.stringify(record)
    })
  },

  // 更新记录
  update: async (id, record) => {
    return await request(`/api/records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(record)
    })
  },

  // 删除记录
  delete: async (id) => {
    return await request(`/api/records/${id}`, {
      method: 'DELETE'
    })
  }
}

// 分类相关API
export const categoriesApi = {
  // 获取分类列表
  getList: async (type) => {
    const params = type ? { type } : {}
    const queryString = new URLSearchParams(params).toString()
    const url = `/api/categories${queryString ? '?' + queryString : ''}`
    return await request(url)
  }
}

// 统计相关API
export const statisticsApi = {
  // 获取年度统计
  getAnnual: async (year) => {
    const params = year ? { year } : {}
    const queryString = new URLSearchParams(params).toString()
    const url = `/api/statistics/annual${queryString ? '?' + queryString : ''}`
    return await request(url)
  },

  // 获取月度统计
  getMonthly: async (year, month) => {
    const params = { year, month }
    const queryString = new URLSearchParams(params).toString()
    const url = `/api/statistics/monthly?${queryString}`
    return await request(url)
  },

  // 获取分类统计
  getByCategory: async (type, startDate, endDate) => {
    const params = { type, startDate, endDate }
    const queryString = new URLSearchParams(params).toString()
    const url = `/api/statistics/by-category?${queryString}`
    return await request(url)
  }
} 
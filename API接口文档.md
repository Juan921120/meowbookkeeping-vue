# 猫猫记账 API 接口文档

## 基础信息

- **基础URL**: `https://api.meowbookkeeping.com/v1`
- **认证方式**: Bearer Token
- **数据格式**: JSON
- **字符编码**: UTF-8

## 通用响应格式

### 成功响应
```json
{
  "code": 200,
  "message": "success",
  "data": {
    // 具体数据
  }
}
```

### 错误响应
```json
{
  "code": 400,
  "message": "错误信息",
  "data": null
}
```

## 1. 用户认证接口

### 1.1 用户登录
- **接口**: `POST /auth/login`
- **描述**: 用户登录获取token
- **请求参数**:
```json
{
  "username": "string",
  "password": "string"
}
```
- **响应数据**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123",
      "username": "caojuan",
      "nickname": "猫猫",
      "avatar": "https://example.com/avatar.jpg",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 1.2 用户注册
- **接口**: `POST /auth/register`
- **描述**: 新用户注册
- **请求参数**:
```json
{
  "username": "string",
  "password": "string",
  "nickname": "string",
  "email": "string"
}
```

### 1.3 刷新Token
- **接口**: `POST /auth/refresh`
- **描述**: 刷新访问token
- **请求头**: `Authorization: Bearer {refresh_token}`

## 2. 记录管理接口

### 2.1 获取记录列表
- **接口**: `GET /records`
- **描述**: 获取用户的记账记录列表
- **请求头**: `Authorization: Bearer {token}`
- **查询参数**:
  - `page`: 页码 (默认: 1)
  - `limit`: 每页数量 (默认: 20)
  - `type`: 记录类型 (income/expense, 可选)
  - `category`: 分类ID (可选)
  - `startDate`: 开始日期 (YYYY-MM-DD, 可选)
  - `endDate`: 结束日期 (YYYY-MM-DD, 可选)
- **响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [
      {
        "id": "record_123",
        "type": "expense",
        "category": "dining",
        "amount": 25.50,
        "note": "午餐",
        "date": "2024-01-15",
        "createdAt": "2024-01-15T12:30:00Z",
        "updatedAt": "2024-01-15T12:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

### 2.2 获取记录详情
- **接口**: `GET /records/{recordId}`
- **描述**: 获取单条记录的详细信息
- **请求头**: `Authorization: Bearer {token}`

### 2.3 创建记录
- **接口**: `POST /records`
- **描述**: 创建新的记账记录
- **请求头**: `Authorization: Bearer {token}`
- **请求参数**:
```json
{
  "type": "expense",
  "category": "dining",
  "amount": 25.50,
  "note": "午餐",
  "date": "2024-01-15"
}
```

### 2.4 更新记录
- **接口**: `PUT /records/{recordId}`
- **描述**: 更新现有记录
- **请求头**: `Authorization: Bearer {token}`
- **请求参数**: 同创建记录

### 2.5 删除记录
- **接口**: `DELETE /records/{recordId}`
- **描述**: 删除指定记录
- **请求头**: `Authorization: Bearer {token}`

### 2.6 批量删除记录
- **接口**: `DELETE /records/batch`
- **描述**: 批量删除多条记录
- **请求头**: `Authorization: Bearer {token}`
- **请求参数**:
```json
{
  "recordIds": ["record_1", "record_2", "record_3"]
}
```

## 3. 统计接口

### 3.1 获取年度统计
- **接口**: `GET /statistics/annual`
- **描述**: 获取年度收支统计
- **请求头**: `Authorization: Bearer {token}`
- **查询参数**:
  - `year`: 年份 (默认: 当前年份)
- **响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "year": 2024,
    "income": 5520.00,
    "expense": 10175.00,
    "balance": -4655.00,
    "monthlyStats": [
      {
        "month": 1,
        "income": 1200.00,
        "expense": 800.00,
        "balance": 400.00
      }
    ]
  }
}
```

### 3.2 获取月度统计
- **接口**: `GET /statistics/monthly`
- **描述**: 获取月度收支统计
- **请求头**: `Authorization: Bearer {token}`
- **查询参数**:
  - `year`: 年份
  - `month`: 月份
- **响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "year": 2024,
    "month": 1,
    "income": 1200.00,
    "expense": 800.00,
    "balance": 400.00,
    "dailyStats": [
      {
        "date": "2024-01-01",
        "income": 100.00,
        "expense": 50.00,
        "balance": 50.00
      }
    ]
  }
}
```

### 3.3 获取分类统计
- **接口**: `GET /statistics/category`
- **描述**: 获取分类收支统计
- **请求头**: `Authorization: Bearer {token}`
- **查询参数**:
  - `type`: 记录类型 (income/expense)
  - `startDate`: 开始日期
  - `endDate`: 结束日期
- **响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "type": "expense",
    "categories": [
      {
        "categoryId": "dining",
        "categoryName": "餐饮",
        "amount": 1500.00,
        "percentage": 30.5
      }
    ]
  }
}
```

## 4. 分类管理接口

### 4.1 获取分类列表
- **接口**: `GET /categories`
- **描述**: 获取所有分类
- **请求头**: `Authorization: Bearer {token}`
- **查询参数**:
  - `type`: 分类类型 (income/expense)
- **响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "expense": [
      {
        "id": "dining",
        "name": "餐饮",
        "icon": "🍽️",
        "color": "#ff6b6b",
        "sort": 1
      }
    ],
    "income": [
      {
        "id": "salary",
        "name": "工资",
        "icon": "💰",
        "color": "#00d2d3",
        "sort": 1
      }
    ]
  }
}
```

### 4.2 创建自定义分类
- **接口**: `POST /categories`
- **描述**: 创建用户自定义分类
- **请求头**: `Authorization: Bearer {token}`
- **请求参数**:
```json
{
  "type": "expense",
  "name": "自定义分类",
  "icon": "🎯",
  "color": "#ff6b6b"
}
```

### 4.3 更新分类
- **接口**: `PUT /categories/{categoryId}`
- **描述**: 更新分类信息
- **请求头**: `Authorization: Bearer {token}`

### 4.4 删除分类
- **接口**: `DELETE /categories/{categoryId}`
- **描述**: 删除自定义分类
- **请求头**: `Authorization: Bearer {token}`

## 5. 数据导入导出接口

### 5.1 导出数据
- **接口**: `GET /export`
- **描述**: 导出用户数据
- **请求头**: `Authorization: Bearer {token}`
- **查询参数**:
  - `format`: 导出格式 (json/csv/excel)
  - `startDate`: 开始日期
  - `endDate`: 结束日期
- **响应**: 文件下载

### 5.2 导入数据
- **接口**: `POST /import`
- **描述**: 导入数据
- **请求头**: `Authorization: Bearer {token}`
- **请求体**: multipart/form-data
- **参数**:
  - `file`: 数据文件
  - `format`: 文件格式

## 6. 用户设置接口

### 6.1 获取用户设置
- **接口**: `GET /user/settings`
- **描述**: 获取用户设置
- **请求头**: `Authorization: Bearer {token}`
- **响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "currency": "CNY",
    "language": "zh-CN",
    "theme": "light",
    "notifications": {
      "daily": true,
      "weekly": false,
      "monthly": true
    }
  }
}
```

### 6.2 更新用户设置
- **接口**: `PUT /user/settings`
- **描述**: 更新用户设置
- **请求头**: `Authorization: Bearer {token}`
- **请求参数**: 同响应数据

### 6.3 更新用户信息
- **接口**: `PUT /user/profile`
- **描述**: 更新用户基本信息
- **请求头**: `Authorization: Bearer {token}`
- **请求参数**:
```json
{
  "nickname": "新昵称",
  "avatar": "头像URL",
  "email": "新邮箱"
}
```

## 7. 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权，需要登录 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 422 | 数据验证失败 |
| 500 | 服务器内部错误 |

## 8. 前端集成建议

### 8.1 请求拦截器
```javascript
// 添加认证头
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器
axios.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      // 跳转到登录页
      router.push('/login')
    }
    return Promise.reject(error)
  }
)
```

### 8.2 API 封装
```javascript
// api/records.js
export const recordsApi = {
  getList: (params) => axios.get('/records', { params }),
  getById: (id) => axios.get(`/records/${id}`),
  create: (data) => axios.post('/records', data),
  update: (id, data) => axios.put(`/records/${id}`, data),
  delete: (id) => axios.delete(`/records/${id}`)
}
```

### 8.3 状态管理
```javascript
// store/records.js
export const useRecordsStore = defineStore('records', {
  state: () => ({
    records: [],
    loading: false,
    pagination: {}
  }),
  actions: {
    async fetchRecords(params) {
      this.loading = true
      try {
        const response = await recordsApi.getList(params)
        this.records = response.data.records
        this.pagination = response.data.pagination
      } finally {
        this.loading = false
      }
    }
  }
})
```

## 9. 部署建议

### 9.1 环境配置
- 开发环境: `http://localhost:3000`
- 测试环境: `https://test-api.meowbookkeeping.com`
- 生产环境: `https://api.meowbookkeeping.com`

### 9.2 安全建议
- 使用 HTTPS
- 实现 Rate Limiting
- 添加 CORS 配置
- 数据验证和清理
- SQL 注入防护
- XSS 防护

### 9.3 性能优化
- 数据库索引优化
- 缓存策略 (Redis)
- 分页查询
- 数据压缩
- CDN 加速 
# 猫猫记账 API 接口文档

## 基础信息

- **基础URL**: `https://xnwormrvnlfb.sealoshzh.site`
- **数据格式**: JSON
- **字符编码**: UTF-8
- **认证方式**: 暂无（后续可扩展）

## 通用响应格式

### 成功响应格式
```json
{
  "code": 200,
  "message": "success",
  "data": {
    // 具体数据内容
  }
}
```

### 错误响应格式
```json
{
  "code": 400,
  "message": "错误信息描述",
  "data": null
}
```

### 错误码说明
| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 422 | 数据验证失败 |
| 500 | 服务器内部错误 |

---

## 1. 记录管理接口

### 1.1 获取记录列表

**接口地址**: `GET /api/records`

**接口描述**: 获取用户的记账记录列表，支持多种筛选条件

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| type | string | 否 | 记录类型：`income`(收入) 或 `expense`(支出) |
| category | string | 否 | 分类ID |
| startDate | string | 否 | 开始日期，格式：`YYYY-MM-DD` |
| endDate | string | 否 | 结束日期，格式：`YYYY-MM-DD` |

**请求示例**:
```bash
# 获取所有记录
GET /api/records

# 获取支出记录
GET /api/records?type=expense

# 获取指定分类的记录
GET /api/records?category=dining

# 获取指定日期范围的记录
GET /api/records?startDate=2025-07-01&endDate=2025-07-31

# 组合查询
GET /api/records?type=expense&category=dining&startDate=2025-07-01
```

**成功响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [
      {
        "id": "record_1752984703341_kwdym0czv",
        "type": "expense",
        "category": "dining",
        "amount": 25.50,
        "note": "午餐",
        "date": "2025-07-20T00:00:00.000Z",
        "createdAt": "2025-07-20T04:11:43.000Z",
        "updatedAt": "2025-07-20T04:11:43.000Z"
      },
      {
        "id": "record_1752984705756_xdnky4ozf",
        "type": "income",
        "category": "salary",
        "amount": 5000.00,
        "note": "月薪",
        "date": "2025-07-20T00:00:00.000Z",
        "createdAt": "2025-07-20T04:11:45.000Z",
        "updatedAt": "2025-07-20T04:11:45.000Z"
      }
    ]
  }
}
```

**失败响应**:
```json
{
  "code": 422,
  "message": "数据验证失败",
  "data": [
    {
      "type": "field",
      "value": "invalid_date",
      "msg": "开始日期格式无效",
      "path": "startDate",
      "location": "query"
    }
  ]
}
```

---

### 1.2 获取记录详情

**接口地址**: `GET /api/records/{recordId}`

**接口描述**: 获取单条记录的详细信息

**路径参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| recordId | string | 是 | 记录ID |

**请求示例**:
```bash
GET /api/records/record_1752984703341_kwdym0czv
```

**成功响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "record_1752984703341_kwdym0czv",
    "type": "expense",
    "category": "dining",
    "amount": 25.50,
    "note": "午餐",
    "date": "2025-07-20T00:00:00.000Z",
    "createdAt": "2025-07-20T04:11:43.000Z",
    "updatedAt": "2025-07-20T04:11:43.000Z"
  }
}
```

**失败响应**:
```json
{
  "code": 404,
  "message": "记录不存在",
  "data": null
}
```

---

### 1.3 创建记录

**接口地址**: `POST /api/records`

**接口描述**: 创建新的记账记录

**请求头**:
```
Content-Type: application/json
```

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| type | string | 是 | 记录类型：`income`(收入) 或 `expense`(支出) |
| category | string | 是 | 分类ID，必须是已存在的分类 |
| amount | number | 是 | 金额，必须大于0 |
| note | string | 否 | 备注信息 |
| date | string | 是 | 日期，格式：`YYYY-MM-DD` |

**请求示例**:
```bash
curl -X POST https://xnwormrvnlfb.sealoshzh.site/api/records \
  -H "Content-Type: application/json" \
  -d '{
    "type": "expense",
    "category": "dining",
    "amount": 25.50,
    "note": "午餐",
    "date": "2025-07-20"
  }'
```

**成功响应**:
```json
{
  "code": 200,
  "message": "记录创建成功",
  "data": {
    "id": "record_1752984703341_kwdym0czv",
    "type": "expense",
    "category": "dining",
    "amount": 25.50,
    "note": "午餐",
    "date": "2025-07-20T00:00:00.000Z",
    "createdAt": "2025-07-20T04:11:43.000Z",
    "updatedAt": "2025-07-20T04:11:43.000Z"
  }
}
```

**失败响应**:
```json
{
  "code": 422,
  "message": "数据验证失败",
  "data": [
    {
      "type": "field",
      "value": "invalid_type",
      "msg": "类型必须是income或expense",
      "path": "type",
      "location": "body"
    }
  ]
}
```

```json
{
  "code": 400,
  "message": "分类不存在或类型不匹配",
  "data": null
}
```

---

### 1.4 更新记录

**接口地址**: `PUT /api/records/{recordId}`

**接口描述**: 更新现有记录

**请求头**:
```
Content-Type: application/json
```

**路径参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| recordId | string | 是 | 记录ID |

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| type | string | 否 | 记录类型：`income`(收入) 或 `expense`(支出) |
| category | string | 否 | 分类ID |
| amount | number | 否 | 金额，必须大于0 |
| note | string | 否 | 备注信息 |
| date | string | 否 | 日期，格式：`YYYY-MM-DD` |

**请求示例**:
```bash
curl -X PUT https://xnwormrvnlfb.sealoshzh.site/api/records/record_1752984703341_kwdym0czv \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 30.00,
    "note": "午餐加饮料"
  }'
```

**成功响应**:
```json
{
  "code": 200,
  "message": "记录更新成功",
  "data": {
    "id": "record_1752984703341_kwdym0czv",
    "type": "expense",
    "category": "dining",
    "amount": 30.00,
    "note": "午餐加饮料",
    "date": "2025-07-20T00:00:00.000Z",
    "createdAt": "2025-07-20T04:11:43.000Z",
    "updatedAt": "2025-07-20T04:11:45.000Z"
  }
}
```

**失败响应**:
```json
{
  "code": 404,
  "message": "记录不存在",
  "data": null
}
```

```json
{
  "code": 400,
  "message": "没有提供更新数据",
  "data": null
}
```

---

### 1.5 删除记录

**接口地址**: `DELETE /api/records/{recordId}`

**接口描述**: 删除指定记录

**路径参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| recordId | string | 是 | 记录ID |

**请求示例**:
```bash
curl -X DELETE https://xnwormrvnlfb.sealoshzh.site/api/records/record_1752984703341_kwdym0czv
```

**成功响应**:
```json
{
  "code": 200,
  "message": "记录删除成功",
  "data": null
}
```

**失败响应**:
```json
{
  "code": 404,
  "message": "记录不存在",
  "data": null
}
```

---

## 2. 分类管理接口

### 2.1 获取分类列表

**接口地址**: `GET /api/categories`

**接口描述**: 获取所有分类，支持按类型筛选

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| type | string | 否 | 分类类型：`income`(收入) 或 `expense`(支出) |

**请求示例**:
```bash
# 获取所有分类
GET /api/categories

# 获取支出分类
GET /api/categories?type=expense

# 获取收入分类
GET /api/categories?type=income
```

**成功响应**:
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
      },
      {
        "id": "transport",
        "name": "交通",
        "icon": "🚗",
        "color": "#4ecdc4",
        "sort": 2
      },
      {
        "id": "shopping",
        "name": "购物",
        "icon": "🛍️",
        "color": "#45b7d1",
        "sort": 3
      },
      {
        "id": "entertainment",
        "name": "娱乐",
        "icon": "🎮",
        "color": "#96ceb4",
        "sort": 4
      },
      {
        "id": "health",
        "name": "医疗",
        "icon": "🏥",
        "color": "#feca57",
        "sort": 5
      },
      {
        "id": "education",
        "name": "教育",
        "icon": "📚",
        "color": "#ff9ff3",
        "sort": 6
      }
    ],
    "income": [
      {
        "id": "salary",
        "name": "工资",
        "icon": "💰",
        "color": "#00d2d3",
        "sort": 1
      },
      {
        "id": "bonus",
        "name": "奖金",
        "icon": "🎁",
        "color": "#54a0ff",
        "sort": 2
      },
      {
        "id": "investment",
        "name": "投资",
        "icon": "📈",
        "color": "#5f27cd",
        "sort": 3
      },
      {
        "id": "other_income",
        "name": "其他收入",
        "icon": "💎",
        "color": "#00d2d3",
        "sort": 4
      }
    ]
  }
}
```

**失败响应**:
```json
{
  "code": 422,
  "message": "数据验证失败",
  "data": [
    {
      "type": "field",
      "value": "invalid_type",
      "msg": "类型必须是income或expense",
      "path": "type",
      "location": "query"
    }
  ]
}
```

---

## 3. 统计接口

### 3.1 获取年度统计

**接口地址**: `GET /api/statistics/annual`

**接口描述**: 获取年度收支统计

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| year | number | 否 | 年份，默认当前年份 |

**请求示例**:
```bash
# 获取当前年度统计
GET /api/statistics/annual

# 获取指定年度统计
GET /api/statistics/annual?year=2024
```

**成功响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "year": 2025,
    "income": 7000.00,
    "expense": 225.50,
    "balance": 6774.50
  }
}
```

**失败响应**:
```json
{
  "code": 422,
  "message": "数据验证失败",
  "data": [
    {
      "type": "field",
      "value": 1800,
      "msg": "年份必须在1900-2100之间",
      "path": "year",
      "location": "query"
    }
  ]
}
```

---

### 3.2 获取月度统计

**接口地址**: `GET /api/statistics/monthly`

**接口描述**: 获取月度收支统计

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| year | number | 否 | 年份，默认当前年份 |
| month | number | 否 | 月份，默认当前月份 |

**请求示例**:
```bash
# 获取当前月度统计
GET /api/statistics/monthly

# 获取指定月度统计
GET /api/statistics/monthly?year=2025&month=7
```

**成功响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "year": 2025,
    "month": 7,
    "income": 7000.00,
    "expense": 225.50,
    "balance": 6774.50
  }
}
```

**失败响应**:
```json
{
  "code": 422,
  "message": "数据验证失败",
  "data": [
    {
      "type": "field",
      "value": 13,
      "msg": "月份必须在1-12之间",
      "path": "month",
      "location": "query"
    }
  ]
}
```

---

### 3.3 获取分类统计

**接口地址**: `GET /api/statistics/by-category`

**接口描述**: 获取按分类的收支统计

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| type | string | 是 | 统计类型：`income`(收入) 或 `expense`(支出) |
| startDate | string | 否 | 开始日期，格式：`YYYY-MM-DD` |
| endDate | string | 否 | 结束日期，格式：`YYYY-MM-DD` |

**请求示例**:
```bash
# 获取支出分类统计
GET /api/statistics/by-category?type=expense

# 获取收入分类统计
GET /api/statistics/by-category?type=income

# 获取指定日期范围的分类统计
GET /api/statistics/by-category?type=expense&startDate=2025-07-01&endDate=2025-07-31
```

**成功响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "categories": [
      {
        "id": "dining",
        "name": "餐饮",
        "icon": "🍽️",
        "color": "#ff6b6b",
        "total": 125.50,
        "count": 5
      },
      {
        "id": "shopping",
        "name": "购物",
        "icon": "🛍️",
        "color": "#45b7d1",
        "total": 100.00,
        "count": 2
      },
      {
        "id": "transport",
        "name": "交通",
        "icon": "🚗",
        "color": "#4ecdc4",
        "total": 0.00,
        "count": 0
      }
    ]
  }
}
```

**失败响应**:
```json
{
  "code": 422,
  "message": "数据验证失败",
  "data": [
    {
      "type": "field",
      "value": "invalid_type",
      "msg": "类型必须是income或expense",
      "path": "type",
      "location": "query"
    }
  ]
}
```

---

## 4. 系统接口

### 4.1 健康检查

**接口地址**: `GET /health`

**接口描述**: 检查服务运行状态

**请求示例**:
```bash
GET /health
```

**成功响应**:
```json
{
  "code": 200,
  "message": "服务运行正常",
  "timestamp": "2025-07-20T04:15:42.088Z",
  "uptime": 2.012815261
}
```

---

## 5. 前端对接示例

### JavaScript 示例

```javascript
// 基础配置
const API_BASE_URL = 'https://xnwormrvnlfb.sealoshzh.site';

// 通用请求函数
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (data.code === 200) {
      return { success: true, data: data.data };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// 获取记录列表
async function getRecords(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/api/records${queryString ? '?' + queryString : ''}`;
  return await apiRequest(endpoint);
}

// 创建记录
async function createRecord(recordData) {
  return await apiRequest('/api/records', {
    method: 'POST',
    body: JSON.stringify(recordData)
  });
}

// 更新记录
async function updateRecord(recordId, updateData) {
  return await apiRequest(`/api/records/${recordId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
}

// 删除记录
async function deleteRecord(recordId) {
  return await apiRequest(`/api/records/${recordId}`, {
    method: 'DELETE'
  });
}

// 获取分类列表
async function getCategories(type = null) {
  const params = type ? { type } : {};
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/api/categories${queryString ? '?' + queryString : ''}`;
  return await apiRequest(endpoint);
}

// 获取年度统计
async function getAnnualStatistics(year = null) {
  const params = year ? { year } : {};
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/api/statistics/annual${queryString ? '?' + queryString : ''}`;
  return await apiRequest(endpoint);
}

// 使用示例
async function example() {
  // 获取所有记录
  const recordsResult = await getRecords();
  if (recordsResult.success) {
    console.log('记录列表:', recordsResult.data.records);
  }

  // 创建新记录
  const newRecord = {
    type: 'expense',
    category: 'dining',
    amount: 25.50,
    note: '午餐',
    date: '2025-07-20'
  };
  
  const createResult = await createRecord(newRecord);
  if (createResult.success) {
    console.log('创建成功:', createResult.data);
  }

  // 获取年度统计
  const statsResult = await getAnnualStatistics();
  if (statsResult.success) {
    console.log('年度统计:', statsResult.data);
  }
}
```

### React Hook 示例

```javascript
import { useState, useEffect } from 'react';

// 自定义Hook：获取记录列表
export function useRecords(params = {}) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecords() {
      try {
        setLoading(true);
        const result = await getRecords(params);
        if (result.success) {
          setRecords(result.data.records);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecords();
  }, [JSON.stringify(params)]);

  return { records, loading, error };
}

// 自定义Hook：获取分类列表
export function useCategories(type = null) {
  const [categories, setCategories] = useState({ expense: [], income: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const result = await getCategories(type);
        if (result.success) {
          setCategories(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, [type]);

  return { categories, loading, error };
}

// 组件使用示例
function RecordList() {
  const { records, loading, error } = useRecords({ type: 'expense' });

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div>
      {records.map(record => (
        <div key={record.id}>
          {record.note} - ¥{record.amount}
        </div>
      ))}
    </div>
  );
}
```

---

## 6. 注意事项

### 6.1 数据格式
- 所有日期字段使用 ISO 8601 格式
- 金额字段为数字类型，保留两位小数
- ID 字段为字符串类型

### 6.2 错误处理
- 所有接口都会返回统一的错误格式
- 422 错误包含详细的验证错误信息
- 建议前端对常见错误进行友好提示

### 6.3 分页
- 当前版本暂不支持分页
- 如需分页功能，可后续扩展

### 6.4 缓存
- 分类数据变化较少，建议前端缓存
- 统计数据可根据业务需求设置缓存时间

### 6.5 跨域
- 已配置 CORS，支持跨域请求
- 默认允许所有来源，生产环境建议限制

---

## 7. 更新日志

### v1.0.0 (2025-07-20)
- 初始版本发布
- 实现完整的记录管理功能
- 实现分类管理功能
- 实现统计分析功能
- 提供完整的API文档 
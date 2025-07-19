// 模拟数据
export const mockRecords = [
  {
    id: '1',
    type: 'expense',
    category: 'dining',
    amount: 63.00,
    note: '测试',
    date: '2025-01-19',
    createdAt: '2025-01-19T10:00:00.000Z'
  },
  {
    id: '2',
    type: 'expense',
    category: 'dining',
    amount: 82.00,
    note: '',
    date: '2025-01-19',
    createdAt: '2025-01-19T12:00:00.000Z'
  },
  {
    id: '3',
    type: 'expense',
    category: 'shopping',
    amount: 150.00,
    note: '超市购物',
    date: '2025-01-18',
    createdAt: '2025-01-18T15:00:00.000Z'
  },
  {
    id: '4',
    type: 'income',
    category: 'salary',
    amount: 5000.00,
    note: '月薪',
    date: '2025-01-15',
    createdAt: '2025-01-15T09:00:00.000Z'
  },
  {
    id: '5',
    type: 'expense',
    category: 'transport',
    amount: 25.00,
    note: '打车',
    date: '2025-01-17',
    createdAt: '2025-01-17T18:00:00.000Z'
  }
]

// 初始化模拟数据
export const initMockData = () => {
  const existingRecords = localStorage.getItem('meowbookkeeping_records')
  if (!existingRecords) {
    localStorage.setItem('meowbookkeeping_records', JSON.stringify(mockRecords))
  }
} 
// 支出分类
export const expenseCategories = [
  { id: 'dining', name: '餐饮', icon: '🍽️', color: '#ff9ff3' },
  { id: 'shopping', name: '购物', icon: '🛍️', color: '#feca57' },
  { id: 'daily', name: '日用', icon: '🧻', color: '#48dbfb' },
  { id: 'transport', name: '交通', icon: '🚗', color: '#0abde3' },
  { id: 'sports', name: '运动', icon: '🏊', color: '#ff6b6b' },
  { id: 'entertainment', name: '娱乐', icon: '🎮', color: '#feca57' },
  { id: 'beauty', name: '美容', icon: '💄', color: '#ff9ff3' },
  { id: 'clothing', name: '服饰', icon: '👕', color: '#54a0ff' },
  { id: 'communication', name: '通讯', icon: '📞', color: '#5f27cd' },
  { id: 'housing', name: '住房', icon: '🏠', color: '#00d2d3' },
  { id: 'social', name: '社交', icon: '👥', color: '#ff9ff3' },
  { id: 'travel', name: '旅行', icon: '✈️', color: '#5f27cd' },
  { id: 'study', name: '学习', icon: '📚', color: '#54a0ff' },
  { id: 'medical', name: '医疗', icon: '💊', color: '#ff6b6b' },
  { id: 'pet', name: '宠物', icon: '🐾', color: '#ff9ff3' },
  { id: 'office', name: '办公', icon: '💼', color: '#54a0ff' },
  { id: 'express', name: '快递', icon: '📦', color: '#feca57' },
  { id: 'other', name: '其他', icon: '⋯', color: '#c8d6e5' }
]

// 收入分类
export const incomeCategories = [
  { id: 'salary', name: '工资', icon: '💰', color: '#00d2d3' },
  { id: 'redPacket', name: '红包', icon: '🧧', color: '#ff6b6b' },
  { id: 'rent', name: '租金', icon: '🏠', color: '#54a0ff' },
  { id: 'gift', name: '礼金', icon: '🎁', color: '#ff9ff3' },
  { id: 'dividend', name: '分红', icon: '📈', color: '#00d2d3' },
  { id: 'investment', name: '理财', icon: '💹', color: '#feca57' },
  { id: 'bonus', name: '年终奖', icon: '🎊', color: '#ff6b6b' },
  { id: 'other', name: '其他', icon: '⋯', color: '#c8d6e5' }
]

// 获取分类名称
export const getCategoryName = (type, categoryId) => {
  const categories = type === 'expense' ? expenseCategories : incomeCategories
  const category = categories.find(cat => cat.id === categoryId)
  return category ? category.name : '其他'
}

// 获取分类图标
export const getCategoryIcon = (type, categoryId) => {
  const categories = type === 'expense' ? expenseCategories : incomeCategories
  const category = categories.find(cat => cat.id === categoryId)
  return category ? category.icon : '⋯'
}

// 获取分类颜色
export const getCategoryColor = (type, categoryId) => {
  const categories = type === 'expense' ? expenseCategories : incomeCategories
  const category = categories.find(cat => cat.id === categoryId)
  return category ? category.color : '#c8d6e5'
} 
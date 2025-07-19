# 喵喵记账 - Vue3 记账应用

一个简洁美观的移动端记账应用，使用 Vue3 + Vite 开发。

## 功能特性

### 📱 收支记录列表
- 按日期分组显示收支记录
- 显示每日结余金额
- 支持备注显示
- 美观的卡片式布局
- 响应式设计，适配移动端

### ➕ 新增记录
- 支出/收入类型切换
- 丰富的分类选择（支出18个分类，收入8个分类）
- 自定义数字键盘输入金额
- 可选备注输入
- 日历日期选择
- 实时金额显示

### 🎨 设计特色
- 参考UI图的精美设计
- 爪印背景图案
- 圆形分类图标
- 渐变色彩搭配
- 流畅的交互动画

## 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **Vue Router 4** - 官方路由管理器
- **Vite** - 下一代前端构建工具
- **LocalStorage** - 本地数据存储

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 项目结构

```
src/
├── components/          # 组件目录
├── views/              # 页面视图
│   ├── RecordList.vue  # 收支记录列表
│   └── AddRecord.vue   # 新增记录页面
├── utils/              # 工具函数
│   ├── categories.js   # 分类数据
│   ├── storage.js      # 本地存储
│   └── mockData.js     # 模拟数据
├── router/             # 路由配置
│   └── index.js
├── App.vue             # 根组件
└── main.js             # 入口文件
```

## 分类说明

### 支出分类 (18个)
- 餐饮、购物、日用、交通、运动、娱乐、美容、服饰
- 通讯、住房、社交、旅行、学习、医疗、宠物、办公、快递、其他

### 收入分类 (8个)
- 工资、红包、租金、礼金、分红、理财、年终奖、其他

## 数据存储

应用使用浏览器的 LocalStorage 进行数据存储，数据格式如下：

```javascript
{
  id: "唯一标识",
  type: "expense|income",
  category: "分类ID",
  amount: 金额,
  note: "备注",
  date: "YYYY-MM-DD",
  createdAt: "创建时间"
}
```

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 开发说明

1. 应用采用移动端优先的设计理念
2. 最大宽度限制为414px，模拟手机屏幕
3. 使用CSS Grid和Flexbox进行布局
4. 支持触摸友好的交互设计

## 环境

This project runs on a Debian 12 system with Node.js and Vue.js 3.4.29, which is pre-configured in the Devbox environment. You don't need to worry about setting up Node.js, npm, or Vue dependencies yourself. The development environment includes all necessary tools for building and running Vue applications, including Vite for fast development and optimized builds.

## 项目执行

**开发模式:** 在终端中运行 `npm run dev` 启动开发服务器，支持热重载。

**生产模式:** 运行 `npm run build` 构建优化后的静态文件，然后使用 `npm run preview` 预览。

DevBox: Code. Build. Deploy. We've Got the Rest.

With DevBox, you can focus entirely on writing great code while we handle the infrastructure, scaling, and deployment. Seamless development from start to production. 
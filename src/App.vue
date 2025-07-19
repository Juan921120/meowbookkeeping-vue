<script setup>
// 应用入口组件
</script>

<template>
  <div id="vue-app">
    <router-view />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  width: 100%;
  overflow-x: hidden;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f5f5f5;
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
}

#vue-app {
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  background: transparent;
  min-height: 100vh;
  position: relative;
  box-sizing: border-box !important;
}

/* 全局样式 */
.btn {
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #ff6b6b;
  color: white;
}

.btn-primary:hover {
  background-color: #ff5252;
}

.text-red {
  color: #ff6b6b;
}

.text-gray {
  color: #999;
}

.text-center {
  text-align: center;
}

.flex {
  display: flex;
}

.flex-between {
  justify-content: space-between;
  align-items: center;
}

.flex-center {
  justify-content: center;
  align-items: center;
}
</style>

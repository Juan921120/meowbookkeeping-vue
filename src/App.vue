<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
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
  background: white;
  min-height: 100vh;
  position: relative;
  padding: 0 12px !important;
  box-sizing: border-box !important;
}

/* 移动端优化 */
@media (min-width: 768px) {
  #vue-app {
    max-width: 768px;
    margin: 0 auto;
    padding: 0 24px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }
}

@media (min-width: 1024px) {
  #vue-app {
    max-width: 1024px;
    padding: 0 32px;
  }
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

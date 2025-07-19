import { createRouter, createWebHistory } from 'vue-router'
import RecordList from '../views/RecordList.vue'
import AddRecord from '../views/AddRecord.vue'

const routes = [
  {
    path: '/',
    name: 'RecordList',
    component: RecordList
  },
  {
    path: '/add',
    name: 'AddRecord',
    component: AddRecord
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 
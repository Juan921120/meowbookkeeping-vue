import { createRouter, createWebHistory } from 'vue-router'
import RecordList from '../views/RecordList.vue'
import AddRecord from '../views/AddRecord.vue'
import EditRecord from '../views/EditRecord.vue'

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
  },
  {
    path: '/edit/:id',
    name: 'EditRecord',
    component: EditRecord
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 
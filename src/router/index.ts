import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import TodoPage from '../views/TodoPage/Index.vue'
import Dashboard from "../views/TodoPage/Dashboard.vue"
import Tasks from '../views/TodoPage/Tasks.vue'
import Config from '../views/TodoPage/Configuration.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/app',
    component: TodoPage,
    children: [
      {
        path: '',					
        redirect: '/app/dashboard',
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'tarefas',
        name: 'tasks',
        component: Tasks
      },
      {
        path: 'config',
        name: 'conf',
        component: Config
      }				
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

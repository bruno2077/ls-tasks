import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import TodoPage from '../views/TodoPage/Index.vue'

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
      // {
      //   path: '',					
      //   redirect: 'dashboard',
      // },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import("../views/TodoPage/Dashboard.vue")
      },
      {
        path: 'tarefas',
        name: 'tasks',
        component: () => import('../views/TodoPage/Tasks.vue')
      },
      {
        path: 'config',
        name: 'conf',
        component: () => import('../views/TodoPage/Configuration.vue')
      }				
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  // base: process.env.BASE_URL,
  routes
})

export default router

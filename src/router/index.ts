import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Editor from '../views/Editor/index.vue'
import Home from '../views/Home.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      // requireAuth: true,
      whiteHeader: true
    }
  },
  {
    path: '/Editor',
    name: 'Editor',
    component: Editor,
    meta: {
      // requireAuth: true,
      whiteHeader: true
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

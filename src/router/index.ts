import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Editor from '../views/Editor/index.vue'
import Home from '../views/Home.vue'


// ## 自用组件
const components =  ()=> import('../views/components/index.vue')
// ### 上传
const Upload = ()=> import('../views/components/upload.vue')
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
    path: '/editor',
    name: 'editor',
    component: Editor,
    meta: {
      // requireAuth: true,
      whiteHeader: true
    }
  },
  {
    path: '/components',
    name: 'components',
    component: components,
    meta: {
      // requireAuth: true,
      whiteHeader: true
    },
    children: [
      {
        path: 'upload',
        name: 'upload',
        component: Upload,
        meta: {
          // requireAuth: true,
          whiteHeader: true
        }
      },
    ]
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

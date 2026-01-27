import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/Layout.vue'

Vue.use(Router)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue')
      }
    ]
  },
  {
    path: '/medicine',
    component: Layout,
    children: [
      {
        path: 'list',
        name: 'MedicineList',
        component: () => import('@/views/medicine/MedicineList.vue')
      },
      {
        path: 'scan',
        name: 'ScanMedicine',
        component: () => import('@/views/medicine/ScanMedicine.vue')
      }
    ]
  },
  {
    path: '/medication',
    component: Layout,
    children: [
      {
        path: 'calendar',
        name: 'Calendar',
        component: () => import('@/views/medication/Calendar.vue')
      },
      {
        path: 'records',
        name: 'Records',
        component: () => import('@/views/medication/Records.vue')
      }
    ]
  }
]

const router = new Router({
  mode: 'hash',
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  // 如果访问的是登录页面，且已有token，则跳转到首页
  if (to.path === '/login' && token) {
    next('/home')
    return
  }
  
  // 如果访问的不是登录页面，且没有token，则跳转到登录页
  if (to.path !== '/login' && !token) {
    next('/login')
    return
  }
  
  // 其他情况正常放行
  next()
})

export default router
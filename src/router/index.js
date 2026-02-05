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
    path: '/drug',
    component: Layout,
    children: [
      {
        path: '',
        name: 'DrugList',
        component: () => import('@/views/drug/index.vue'),
        meta: { title: '药品管理' }
      }
    ]
  },
  {
    path: '/category',
    component: Layout,
    children: [
      {
        path: '',
        name: 'CategoryList',
        component: () => import('@/views/category/index.vue'),
        meta: { title: '药品分类管理' }
      }
    ]
  },
  {
    path: '/member',
    component: Layout,
    children: [
      {
        path: '',
        name: 'MemberList',
        component: () => import('@/views/member/index.vue'),
        meta: { title: '家庭成员管理' }
      },
      {
        path: 'archive',
        name: 'MemberArchive',
        component: () => import('@/views/archive/index.vue'),
        meta: { title: '健康档案详情', hidden: true }
      }
    ]
  },
  {
    path: '/medication',
    component: Layout,
    meta: { title: '用药提醒管理', icon: 'el-icon-alarm-clock' },
    children: [
      {
        path: 'plan',
        name: 'MedicationPlan',
        component: () => import('../views/medication/plan/index.vue'),
        meta: { title: '用药计划' }
      },
      {
        path: 'record',
        name: 'MedicationRecord',
        component: () => import('../views/medication/record/index.vue'),
        meta: { title: '服药记录' }
      }
    ]
  },
  {
    path: '/notification',
    component: Layout,
    children: [
      {
        path: '',
        name: 'NotificationList',
        component: () => import('@/views/notification/index.vue'),
        meta: { title: '消息通知管理', icon: 'el-icon-bell' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: '',
        name: 'UserList',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '系统用户管理', icon: 'el-icon-user', roles: [0] }
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
  
  // 权限验证
  if (to.meta.roles) {
    const userInfoStr = localStorage.getItem('userInfo')
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr)
        const userRole = userInfo.role
        // 检查用户角色是否在允许的角色列表中
        if (!to.meta.roles.includes(userRole)) {
          // 无权限，跳转到首页
          next('/home')
          return
        }
      } catch (e) {
        console.error('解析用户信息失败', e)
        next('/login')
        return
      }
    } else {
      next('/login')
      return
    }
  }

  //其他情况正常放行
  next()
})

export default router

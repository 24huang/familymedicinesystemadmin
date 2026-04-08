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
    path: '/health',
    component: Layout,
    meta: { title: '健康数据管理', icon: 'el-icon-data-line' },
    children: [
      {
        path: 'vital-signs',
        name: 'VitalSigns',
        component: () => import('@/views/health/vital.vue'),
        meta: { title: '体征数据监测' }
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
    path: '/monitor',
    component: Layout,
    meta: { title: '系统监控', icon: 'el-icon-monitor', roles: [0, 1] },
    children: [
      {
        path: 'operlog',
        name: 'Operlog',
        component: () => import('@/views/monitor/operlog/index.vue'),
        meta: { title: '操作日志', roles: [0, 1] }
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
  },
  {
    path: '/*',
    redirect: '/login'
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

  // 如果访问的不是登录页面，且没有token，则强制跳转到登录页
  if (to.path !== '/login' && !token) {
    // 显示提示信息
    import('element-ui').then(({ Message }) => {
      Message({
        message: '请先登录',
        type: 'warning',
        duration: 3 * 1000
      })
    })
    next('/login')
    return
  }
  
  // 权限验证（只有有token时才检查）
  if (to.meta.roles && token) {
    const userInfoStr = localStorage.getItem('userInfo')
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr)
        const userRole = userInfo.role
        // 检查用户角色是否在允许的角色列表中
        if (!to.meta.roles.includes(userRole)) {
          // 无权限，跳转到首页并提示
          import('element-ui').then(({ Message }) => {
            Message({
              message: '您没有权限访问该页面',
              type: 'error',
              duration: 3 * 1000
            })
          })
          next('/home')
          return
        }
      } catch (e) {
        console.error('解析用户信息失败', e)
        // 用户信息异常，清除所有数据并跳转登录
        localStorage.clear()
        next('/login')
        return
      }
    } else {
      // 有token但没有用户信息，可能是数据异常
      localStorage.clear()
      next('/login')
      return
    }
  }

  //其他情况正常放行
  next()
})

export default router

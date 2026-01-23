import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/Layout.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash', // 避免部署问题，毕设推荐
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/',
      redirect: '/home'
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
})
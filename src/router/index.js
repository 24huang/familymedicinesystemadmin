import Vue from 'vue'
import Router from 'vue-router'
// 示例页面（后续你自己创建）

Vue.use(Router)

export default new Router({
  mode: 'hash', // 避免部署问题，毕设推荐
  routes: [
    {
      path: '/',
      redirect: '/home'
    }
  ]
})
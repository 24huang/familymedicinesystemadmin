import Vue from 'vue'
import App from './App.vue'
// 新增：引入路由
import router from './router'
// 新增：引入 Element UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入主题变量（深色/浅色模式）
import '@/assets/css/theme-variables.css'
import '@/assets/css/motion.css'

Vue.config.productionTip = false
// 新增：使用 Element UI 和路由
Vue.use(ElementUI)

new Vue({
  router, // 挂载路由
  render: h => h(App)
}).$mount('#app')

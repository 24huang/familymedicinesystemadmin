import axios from 'axios'
import { Message } from 'element-ui'

// 创建axios实例
const service = axios.create({
  baseURL: '/api', // 使用代理路径
  timeout: 10000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 如果是 blob 类型的响应，直接返回
    if (response.config.responseType === 'blob') {
      return response.data
    }

    const res = response.data
    
    // 如果返回的状态码不是200，说明接口出错了
    if (res.code !== 200) {
      Message({
        message: res.message || '系统错误',
        type: 'error',
        duration: 5 * 1000
      })
      
      // 401: 未登录或token过期
      if (res.code === 401) {
        // 清除用户信息和token
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('username')
        localStorage.removeItem('userInfo')
        localStorage.removeItem('userRole')
        
        // 显示提示信息
        Message({
          message: '登录已过期，请重新登录',
          type: 'warning',
          duration: 3 * 1000
        })
        
        // 延迟跳转，让用户看到提示
        setTimeout(() => {
          window.location.href = '/#/login'
        }, 1000)
      }
      
      return Promise.reject(new Error(res.message || '系统错误'))
    } else {
      return res
    }
  },
  error => {
    console.error('响应错误:', error)
    
    // 处理 HTTP 状态码错误
    if (error.response) {
      const status = error.response.status
      
      if (status === 401) {
        // Token 过期或无效
        Message({
          message: '登录已过期，请重新登录',
          type: 'warning',
          duration: 3 * 1000
        })
        
        // 清除所有用户信息
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('username')
        localStorage.removeItem('userInfo')
        localStorage.removeItem('userRole')
        
        // 延迟跳转到登录页
        setTimeout(() => {
          window.location.href = '/#/login'
        }, 1000)
      } else if (status === 403) {
        Message({
          message: '没有权限访问该资源',
          type: 'error',
          duration: 5 * 1000
        })
      } else if (status === 500) {
        Message({
          message: '服务器内部错误',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        Message({
          message: error.message || '网络错误',
          type: 'error',
          duration: 5 * 1000
        })
      }
    } else {
      // 网络错误或其他错误
      Message({
        message: '网络连接失败，请检查网络',
        type: 'error',
        duration: 5 * 1000
      })
    }
    
    return Promise.reject(error)
  }
)

export default service

import axios from 'axios'
import { Message } from 'element-ui'
import { clearAuthState } from '@/utils/session'

const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE || '/api',
  timeout: 10000
})

let redirectPending = false
const handleUnauthorized = token => {
  if (!token || token !== localStorage.getItem('token') || redirectPending) return
  redirectPending = true
  clearAuthState()
  Message({ message: '登录已过期，请重新登录', type: 'warning', duration: 3000 })
  setTimeout(() => {
    redirectPending = false
    // 已重新登录时，旧请求不能把用户再次带回登录页。
    if (!localStorage.getItem('token')) window.location.hash = '/login'
  }, 1000)
}

service.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  config.requestToken = token
  if (token) config.headers.Authorization = 'Bearer ' + token
  return config
}, error => Promise.reject(error))

service.interceptors.response.use(response => {
  if (response.config.responseType === 'blob') return response.data
  const res = response.data
  if (res && res.code === 200) return res
  if (res && res.code === 401 && response.config.requestToken) {
    handleUnauthorized(response.config.requestToken)
  } else {
    Message({ message: (res && res.message) || '系统错误', type: 'error', duration: 5000 })
  }
  return Promise.reject(new Error((res && res.message) || '系统错误'))
}, error => {
  const status = error.response && error.response.status
  const token = error.config && error.config.requestToken
  if (status === 401 && token) {
    handleUnauthorized(token)
  } else {
    const message = status === 403 ? '没有权限访问该资源'
      : status === 500 ? '服务器内部错误'
        : (error.response && error.response.data && error.response.data.message) || '网络请求失败，请稍后重试'
    Message({ message, type: 'error', duration: 5000 })
  }
  return Promise.reject(error)
})

export default service

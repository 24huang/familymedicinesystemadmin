import request from './request'

// 用户/管理员登出
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

// 管理员登录 (Admin端)
export function adminLogin(data) {
  return request({
    url: '/auth/admin/login',
    method: 'post',
    data
  })
}

// 获取当前登录用户信息
export function getCurrentUser() {
  return request({
    url: '/auth/current',
    method: 'get'
  })
}

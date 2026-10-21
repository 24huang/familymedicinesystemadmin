// 登录失效时只删除认证数据，保留主题等设备偏好。
export function clearAuthState() {
  const keys = ['token', 'userId', 'username', 'userInfo', 'userRole']
  keys.forEach(key => localStorage.removeItem(key))
}

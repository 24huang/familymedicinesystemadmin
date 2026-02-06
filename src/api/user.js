import request from './request'

// 用户列表
export function getUserList(params) {
  const { current, page, size, ...rest } = params || {}
  const query = {
    page: page != null ? page : (current != null ? current : 1),
    size: size != null ? size : 10,
    ...rest
  }
  return request({
    url: '/admin/user/list',
    method: 'get',
    params: query
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/admin/user/add',
    method: 'post',
    data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/admin/user/update',
    method: 'post',
    data
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: `/admin/user/delete/${id}`,
    method: 'post'
  })
}

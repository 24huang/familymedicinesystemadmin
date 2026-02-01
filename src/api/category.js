import request from './request'

// 获取分类列表 (分页)
export function getCategoryPage(params) {
  return request({
    url: '/admin/category/list',
    method: 'get',
    params
  })
}

// 新增分类
export function addCategory(data) {
  return request({
    url: '/admin/category/add',
    method: 'post',
    data
  })
}

// 修改分类
export function updateCategory(data) {
  return request({
    url: '/admin/category/update',
    method: 'post',
    data
  })
}

// 删除分类
export function deleteCategory(id) {
  return request({
    url: `/admin/category/delete/${id}`,
    method: 'post'
  })
}

// 获取分类下拉选项
export function getCategoryOptions() {
  return request({
    url: '/admin/category/options',
    method: 'get'
  })
}

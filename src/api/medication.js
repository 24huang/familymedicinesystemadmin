import request from './request'

// 分页查询用药计划列表
export function getPlanPage(params) {
  return request({
    url: '/admin/medication/plan/page',
    method: 'get',
    params
  })
}

// 新增用药计划
export function addPlan(data) {
  return request({
    url: '/admin/medication/plan',
    method: 'post',
    data
  })
}

// 修改用药计划
export function updatePlan(data) {
  return request({
    url: '/admin/medication/plan',
    method: 'put',
    data
  })
}

// 删除用药计划
export function deletePlan(id) {
  return request({
    url: `${id}`,
    method: 'delete'
  })
}

// 分页查询服药记录
export function getRecordPage(params) {
  return request({
    url: '/admin/medication/record/page',
    method: 'get',
    params
  })
}

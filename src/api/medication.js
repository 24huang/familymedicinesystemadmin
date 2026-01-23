import request from './request'

// 获取用药计划列表
export function getMedicationPlans(params) {
  return request({
    url: '/medication/plans',
    method: 'get',
    params
  })
}

// 创建用药计划
export function createMedicationPlan(data) {
  return request({
    url: '/medication/plan',
    method: 'post',
    data
  })
}

// 更新用药计划
export function updateMedicationPlan(data) {
  return request({
    url: '/medication/plan',
    method: 'put',
    data
  })
}

// 删除用药计划
export function deleteMedicationPlan(id) {
  return request({
    url: `/medication/plan/${id}`,
    method: 'delete'
  })
}

// 获取用药记录
export function getMedicationRecords(params) {
  return request({
    url: '/medication/records',
    method: 'get',
    params
  })
}

// 确认用药
export function confirmMedication(planId) {
  return request({
    url: '/medication/confirm',
    method: 'post',
    data: { planId }
  })
}

// 获取今日用药提醒
export function getTodayReminders() {
  return request({
    url: '/medication/today',
    method: 'get'
  })
}

import request from './request'

// 创建用药计划
export function createMedicationPlan(data) {
  return request({
    url: '/medication-plan/create',
    method: 'post',
    data
  })
}

// 获取激活状态的用药计划列表
export function getActiveMedicationPlans() {
  return request({
    url: '/medication-plan/active',
    method: 'get'
  })
}

// 根据家庭成员ID获取用药计划列表
export function getMedicationPlansByMember(familyMemberId) {
  return request({
    url: `/medication-plan/member/${familyMemberId}`,
    method: 'get'
  })
}

// 更新用药计划状态
export function updateMedicationPlanStatus(id, status) {
  return request({
    url: `/medication-plan/status/${id}`,
    method: 'put',
    params: { status }
  })
}

// 确认服药记录
export function confirmMedication(recordId) {
  return request({
    url: `/medication-plan/confirm/${recordId}`,
    method: 'post'
  })
}

// 根据ID获取用药计划详情
export function getMedicationPlanById(id) {
  return request({
    url: `/medication-plan/${id}`,
    method: 'get'
  })
}

// 更新用药计划
export function updateMedicationPlan(id, data) {
  return request({
    url: `/medication-plan/${id}`,
    method: 'put',
    data
  })
}

// 删除用药计划
export function deleteMedicationPlan(id) {
  return request({
    url: `/medication-plan/${id}`,
    method: 'delete'
  })
}

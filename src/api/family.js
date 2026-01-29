import request from './request'

// 分页查询家庭成员
export function getFamilyMembersList(params = {}) {
  const { current = 1, size = 10, userId, name, relationship, gender } = params
  return request({
    url: '/api/admin/member/page',
    method: 'get',
    params: { current, size, userId, name, relationship, gender }
  })
}

// 查询家庭成员详情
export function getFamilyMember(id) {
  return request({
    url: `/api/admin/member/${id}`,
    method: 'get'
  })
}

// 添加家庭成员
export function addFamilyMember(data) {
  return request({
    url: '/api/admin/member',
    method: 'post',
    data
  })
}

// 更新家庭成员信息
export function updateFamilyMember(id, data) {
  return request({
    url: `/api/admin/member/${id}`,
    method: 'put',
    data
  })
}

// 删除家庭成员
export function deleteFamilyMember(id) {
  return request({
    url: `/api/admin/member/${id}`,
    method: 'delete'
  })
}

// 启用/禁用家庭成员
export function updateMemberStatus(id, status) {
  return request({
    url: `/api/admin/member/${id}/status`,
    method: 'put',
    params: { status }
  })
}

// 查询用户的家庭成员
export function getMembersByUserId(userId) {
  return request({
    url: `/api/admin/member/user/${userId}`,
    method: 'get'
  })
}

// 更新过敏史
export function updateAllergies(id, allergies) {
  return request({
    url: `/api/admin/member/${id}/allergies`,
    method: 'put',
    params: { allergies }
  })
}

// 更新病史
export function updateMedicalHistory(id, medicalHistory) {
  return request({
    url: `/api/admin/member/${id}/medical-history`,
    method: 'put',
    params: { medicalHistory }
  })
}

// 查询生日提醒
export function getBirthdayReminders(days = 7) {
  return request({
    url: '/api/admin/member/birthday-reminders',
    method: 'get',
    params: { days }
  })
}

// 获取所有家庭成员（不分页）
export function getFamilyMembers() {
  return request({
    url: '/api/admin/member/list',
    method: 'get'
  })
}

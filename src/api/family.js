import request from './request'

// 获取家庭成员列表
export function getFamilyMembers() {
  return request({
    url: '/family/members',
    method: 'get'
  })
}

// 添加家庭成员
export function addFamilyMember(data) {
  return request({
    url: '/family/member',
    method: 'post',
    data
  })
}

// 更新家庭成员
export function updateFamilyMember(data) {
  return request({
    url: '/family/member',
    method: 'put',
    data
  })
}

// 删除家庭成员
export function deleteFamilyMember(id) {
  return request({
    url: `/family/member/${id}`,
    method: 'delete'
  })
}

// 更新过敏史
export function updateAllergies(id, allergies) {
  return request({
    url: '/family/allergies',
    method: 'put',
    data: { id, allergies }
  })
}

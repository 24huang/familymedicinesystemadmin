import request from './request'

// 获取家庭成员列表
export function getFamilyMembersList() {
  return request({
    url: '/family-member/list',
    method: 'get'
  })
}

// 添加家庭成员
export function addFamilyMember(data) {
  return request({
    url: '/family-member/add',
    method: 'post',
    data
  })
}

//获取家庭成员详情
export function getFamilyMember(id) {
  return request({
    url: `/family-member/${id}`,
    method: 'get',
  })
}

// 更新家庭成员
export function updateFamilyMember(id,data) {
  return request({
    url: `/family-member/${id}`,
    method: 'put',
    data
  })
}

// 删除家庭成员
export function deleteFamilyMember(id) {
  return request({
    url: `/family-member/${id}`,
    method: 'delete'
  })
}

//获取过敏史
export function getAllergies(id) {
  return request({
    url: `/family-member/allergies/${id}`,
    method: 'get'
  })
}

// 更新过敏史
export function updateAllergies(id, allergies) {
  return request({
    url: `/family-member/allergies/${id}`,
    method: 'put',
    data: { id, allergies }
  })
}

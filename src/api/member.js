import request from './request'

// 分页查询家庭成员
export function getMemberPage(params) {
  const { current, page, size, ...rest } = params || {}
  const query = {
    current: current != null ? current : (page != null ? page : 1),
    size: size != null ? size : 10,
    ...rest
  }
  return request({
    url: '/admin/member/page',
    method: 'get',
    params: query
  })
}

// 添加家庭成员
export function addMember(data) {
  return request({
    url: '/admin/member/add',
    method: 'post',
    data
  })
}

// 修改成员信息
export function updateMember(data) {
  return request({
    url: '/admin/member/update',
    method: 'post',
    data
  })
}

// 删除成员
export function deleteMember(id) {
  return request({
    url: `/admin/member/delete/${id}`,
    method: 'post'
  })
}

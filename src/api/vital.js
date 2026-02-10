import request from './request'

// 分页获取体征列表
export function getVitalPage(params) {
  const { current, page, size, ...rest } = params || {}
  const query = {
    current: current != null ? current : (page != null ? page : 1),
    size: size != null ? size : 10,
    ...rest
  }
  return request({
    url: '/admin/vital-signs/page',
    method: 'get',
    params: query
  })
}

// 删除记录
export function deleteVital(id) {
  return request({
    url: `/admin/vital-signs/delete/${id}`,
    method: 'post'
  })
}

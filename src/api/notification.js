import request from './request'

// 分页查询通知列表
export function getNotificationPage(params) {
  const { current, page, size, ...rest } = params || {}
  const query = {
    current: current != null ? current : (page != null ? page : 1),
    size: size != null ? size : 10,
    ...rest
  }
  return request({
    url: '/admin/notification/page',
    method: 'get',
    params: query
  })
}

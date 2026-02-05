import request from './request'

// 分页查询通知列表
export function getNotificationPage(params) {
  const { current, page, size, ...rest } = params || {}
  const query = {
    page: page != null ? page : (current != null ? current : 1),
    size: size != null ? size : 10,
    ...rest
  }
  return request({
    url: '/admin/notification/page',
    method: 'get',
    params: query
  })
}

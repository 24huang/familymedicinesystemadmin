import request from './request'

// 获取档案概览
export function getArchiveOverview(memberId) {
  return request({
    url: '/health/archive/overview',
    method: 'get',
    params: { memberId }
  })
}

// 获取用药时间轴
export function getTimeline(memberId, year) {
  return request({
    url: '/health/archive/timeline',
    method: 'get',
    params: { memberId, year }
  })
}

// 导出 PDF 档案
export function exportArchivePdf(memberId) {
  return request({
    url: '/health/archive/export',
    method: 'get',
    params: { memberId },
    responseType: 'blob'
  })
}

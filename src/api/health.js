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

// 通用文件上传 (处方/头像) - 注意：已有 uploadFile 在 drug.js 中，如果共用可以复用，这里单独列出
export function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/common/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

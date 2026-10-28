import request from './request'

// 分页查询药品列表
export function getDrugPage(params) {
  const { current, page, pageSize, size, ...rest } = params || {}
  const query = {
    page: page != null ? page : (current != null ? current : 1),
    size: size != null ? size : (pageSize != null ? pageSize : 10),

    ...rest
  }
  return request({
    url: '/admin/drug/page',
    method: 'get',
    params: query
  })
}

// 根据ID查询药品详情
export function getDrugDetail(id) {
  return request({
    url: `/admin/drug/${id}`,
    method: 'get'
  })
}

// 新增药品
export function addDrug(data) {
  return request({
    url: '/admin/drug/add',
    method: 'post',
    data
  })
}

// 修改药品信息
export function updateDrug(data) {
  return request({
    url: '/admin/drug/update',
    method: 'post',
    data
  })
}

// 删除药品
export function deleteDrug(id) {
  return request({
    url: `/admin/drug/delete/${id}`,
    method: 'post'
  })
}

// 审核药品 status: 1通过 2拒绝
export function auditDrug(id, status) {
  return request({
    url: `/admin/drug/audit/${id}`,
    method: 'post',
    params: { status }
  })
}


// 获取药品分类选项
export function getDrugCategoryOptions() {
  return request({
    url: '/admin/drug/category/options',
    method: 'get'
  })
}

// 上传图片
export function uploadFile(data) {
  return request({
    url: '/admin/drug/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 管理端复用后端扫码查询，返回信息仅供填表，不自动保存或审核。
export function scanDrug(barCode) {
  return request({ url: '/admin/drug/scan', method: 'get', params: { barCode } })
}
export function uploadInstruction(data) {
  return request({ url: '/admin/drug/instruction/upload', method: 'post', data, headers: { 'Content-Type': 'multipart/form-data' } })
}

import request from './request'

// 分页查询药品列表
export function getDrugPage(params) {
  return request({
    url: '/admin/drug/list',
    method: 'post',
    data: {
      page: params.page,
      size: params.pageSize,
      keyword: params.keyword,
      categoryId: params.categoryId,
      categoryType: params.categoryType,
      status: params.status
    }
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

// 扫码获取药品信息
export function scanDrug(code) {
  return request({
    url: `/admin/drug/scan/${code}`,
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

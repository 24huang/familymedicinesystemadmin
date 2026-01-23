import request from './request'

// 获取药品列表
export function getMedicineList(params) {
  return request({
    url: '/medicine/list',
    method: 'get',
    params
  })
}

// 添加药品
export function addMedicine(data) {
  const formData = new FormData()
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key])
    }
  })
  
  return request({
    url: '/medicine/add',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 更新药品
export function updateMedicine(data) {
  const formData = new FormData()
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key])
    }
  })
  
  return request({
    url: '/medicine/update',
    method: 'put',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 删除药品
export function deleteMedicine(id) {
  return request({
    url: `/medicine/delete/${id}`,
    method: 'delete'
  })
}

// 获取药品详情
export function getMedicineDetail(id) {
  return request({
    url: `/medicine/detail/${id}`,
    method: 'get'
  })
}

// 扫码添加药品
export function scanAddMedicine(qrCodeImage) {
  const formData = new FormData()
  formData.append('qrCodeImage', qrCodeImage)
  
  return request({
    url: '/medicine/scan',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 获取即将过期药品
export function getExpiringSoon(days = 30) {
  return request({
    url: '/medicine/expiring',
    method: 'get',
    params: { days }
  })
}

// 获取库存不足药品
export function getLowStock() {
  return request({
    url: '/medicine/low-stock',
    method: 'get'
  })
}

// 更新药品库存
export function updateStock(id, quantity) {
  return request({
    url: '/medicine/stock',
    method: 'put',
    data: { id, quantity }
  })
}

import request from '@/utils/request'

// 添加商品
export function save(data) {
  return request({
    url: 'shop/product/save',
    method: 'post',
    data
  })
}

// 条件分页查询商品列表
export function queryForPage(query) {
  return request({
    url: 'shop/product/queryForPage',
    method: 'get',
    params: query
  })
}

// 更新商品状态
export function updateStatusById(id, type, status) {
  return request({
    url: 'shop/product/updateStatus/' + id + '/' + type + '/' + status,
    method: 'get'
  })
}

// 根据ID删除商品
export function deleteById(id) {
  return request({
    url: 'shop/product/deleteProductById/' + id,
    method: 'delete'
  })
}

// 根据ID查询商品信息
export function findById(id) {
  return request({
    url: 'shop/product/queryProductById/' + id,
    method: 'get'
  })
}

// 根据ID修改商品信息
export function update(data) {
  return request({
    url: 'shop/product/update',
    method: 'put',
    data
  })
}

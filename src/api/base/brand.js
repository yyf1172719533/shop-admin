import request from '@/utils/request'

// 条件分页查询商品品牌信息
export function listForPage(query) {
  return request({
    url: 'shop/brand/listForPage',
    method: 'get',
    params: query
  })
}

// 添加商品品牌
export function save(data) {
  return request({
    url: 'shop/brand/save',
    method: 'post',
    data
  })
}

// 修改商品品牌
export function update(data) {
  return request({
    url: 'shop/brand/update',
    method: 'put',
    data
  })
}

// 根据ID查询商品品牌信息
export function findById(id) {
  return request({
    url: 'shop/brand/findById/' + id,
    method: 'get'
  })
}

// 根据ID删除商品品牌
export function deleteById(id) {
  return request({
    url: 'shop/brand/deleteById/' + id,
    method: 'delete'
  })
}

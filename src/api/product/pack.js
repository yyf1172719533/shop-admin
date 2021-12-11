import request from '@/utils/request'

// 保存商品套装
export function save(data) {
  return request({
    url: 'shop/pack/save',
    method: 'post',
    data
  })
}

// 修改商品套装
export function update(data) {
  return request({
    url: 'shop/pack/update',
    method: 'put',
    data
  })
}

// 条件分页查询
export function listForPage(query) {
  return request({
    url: 'shop/pack/listForPage',
    method: 'get',
    params: query
  })
}

// 根据ID删除
export function deleteById(id) {
  return request({
    url: 'shop/pack/deleteById/' + id,
    method: 'delete'
  })
}

// 根据ID查询
export function findById(id) {
  return request({
    url: 'shop/pack/findById/' + id,
    method: 'get'
  })
}

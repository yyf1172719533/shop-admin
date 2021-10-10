import request from '@/utils/request'

// 条件查询菜单列表
export function list(query) {
  return request({
    url: '/sysMenu/list',
    method: 'get',
    params: query
  })
}

// 添加菜单
export function save(data) {
  return request({
    url: '/sysMenu/save',
    method: 'post',
    data
  })
}

// 修改菜单
export function update(data) {
  return request({
    url: '/sysMenu/update',
    method: 'put',
    data
  })
}

// 根据ID查询菜单
export function findById(id) {
  return request({
    url: '/sysMenu/findById/' + id,
    method: 'get'
  })
}

// 根据ID删除菜单
export function deleteById(id) {
  return request({
    url: '/sysMenu/deleteById/' + id,
    method: 'delete'
  })
}

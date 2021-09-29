import request from '@/utils/request'

// 分页条件查询角色列表
export function listForPage(query) {
  return request({
    url: '/sysRole/queryForPage',
    method: 'get',
    params: query
  })
}

// 添加角色
export function addRole(data) {
  return request({
    url: '/sysRole/saveRole',
    method: 'post',
    data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/sysRole/updateRole',
    method: 'put',
    data
  })
}
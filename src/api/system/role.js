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

// 根据ID查询角色
export function queryRoleById(id) {
  return request({
    url: '/sysRole/queryRoleById/' + id,
    method: 'get'
  })
}

// 根据ID删除角色
export function deleteById(id) {
  return request({
    url: '/sysRole/deleteRoleById/' + id,
    method: 'delete'
  })
}

// 根据角色ID查询当前角色授权的用户
export function queryAuthUserByRoleId(query) {
  return request({
    url: '/sysRole/queryAuthUserByRoleId',
    method: 'get',
    params: query
  })
}

// 取消用户角色
export function unBindUserRole(data) {
  return request({
    url: '/sysRole/cancelAuthUserByRoleId',
    method: 'post',
    data
  })
}

// 授权用户角色
export function bindUserRole(data) {
  return request({
    url: '/sysRole/bindAuthUserByRoleId',
    method: 'post',
    data
  })
}

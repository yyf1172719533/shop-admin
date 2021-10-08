import request from '@/utils/request'
import data from '@/views/pdf/content'

// 查询系统用户列表
export function findUserList(query) {
  return request({
    url: '/sysUser/listForPage',
    method: 'get',
    params: query
  })
}

// 更改用户状态
export function updateStatus(id, status) {
  return request({
    url: '/sysUser/updateStatus/' + id + '/' + status,
    method: 'get'
  })
}

// 添加用户
export function addUser(data) {
  return request({
    url: '/sysUser/save',
    method: 'post',
    data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/sysUser/updateSysUser',
    method: 'put',
    data
  })
}

// 根据ID查询用户
export function getById(id) {
  return request({
    url: '/sysUser/findById/' + id,
    method: 'get'
  })
}

// 根据ID删除系统用户
export function deleteById(id) {
  return request({
    url: '/sysUser/deleteSysUser/' + id,
    method: 'delete'
  })
}

// 根据角色ID查询未授权该角色的用户列表
export function queryAuthUserList(query) {
  return request({
    url: '/sysUser/queryNoAuthUserList',
    method: 'get',
    params: query
  })
}

// 重置密码
export function resetPwd(id) {
  return request({
    url: '/sysUser/resetPwd/' + id,
    method: 'get'
  })
}

// 根据用户ID查询用户信息和角色信息
export function queryUserAndRole(id, pageNum, pageSize) {
  return request({
    url: '/sysUser/queryAuthRoleByUserId/' + id + '/' + pageNum + '/' + pageSize,
    method: 'get'
  })
}

// 授权用户角色
export function bindUserRole(data) {
  return request({
    url: '/sysUser/bindAuthRoleByUserId',
    method: 'post',
    data
  })
}

// 根据用户ID查询角色
export function queryRoleByUserId(data) {
  return request({
    url: '/sysUser/queryUserRoleByUserId',
    method: 'get',
    params: data
  })
}

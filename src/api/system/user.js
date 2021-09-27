import request from '@/utils/request'

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
    url: '/sysUser/updateStatus/' + id + "/" + status,
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

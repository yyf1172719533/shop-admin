import request from '@/utils/request'
const groupName = 'sysUser'

export function login(data) {
  return request({
    url: '/${groupName}/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/${groupName}/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/${groupName}/logout',
    method: 'post'
  })
}

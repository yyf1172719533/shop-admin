import request from '@/utils/request'

// 查询系统用户列表
export function findUserList(query) {
  return request({
    url: '/sysUser/listForPage',
    method: 'get',
    params: query
  })
}

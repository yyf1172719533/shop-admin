import request from '@/utils/request'

// 条件分页查询帮助列表
export function listForPage(query) {
  return request({
    url: '/sysHelp/listForPage',
    method: 'get',
    params: query
  })
}

// 添加帮助
export function save(data) {
  return request({
    url: '/sysHelp/save',
    method: 'post',
    data
  })
}

// 修改帮助
export function update(data) {
  return request({
    url: '/sysHelp/update',
    method: 'put',
    data
  })
}

// 根据ID查询帮助
export function findById(id) {
  return request({
    url: '/sysHelp/findById/' + id,
    method: 'get'
  })
}

// 根据ID删除帮助
export function deleteById(id) {
  return request({
    url: '/sysHelp/deleteById/' + id,
    method: 'delete'
  })
}


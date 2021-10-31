import request from '@/utils/request'

// 条件分页查询通告列表
export function listForPage(query) {
  return request({
    url: '/sysNotice/listForPage',
    method: 'get',
    params: query
  })
}

// 添加通告
export function save(data) {
  return request({
    url: '/sysNotice/save',
    method: 'post',
    data
  })
}

// 修改通告
export function update(data) {
  return request({
    url: '/sysNotice/update',
    method: 'put',
    data
  })
}

// 根据ID查询通告
export function findById(id) {
  return request({
    url: '/sysNotice/findById/' + id,
    method: 'get'
  })
}

// 根据ID删除通告
export function deleteById(id) {
  return request({
    url: '/sysNotice/deleteById/' + id,
    method: 'delete'
  })
}

// 根据ID更改通告状态
export function updateStatus(id, status) {
  return request({
    url: '/sysNotice/updateStatus/' + id + '/' + status,
    method: 'get'
  })
}

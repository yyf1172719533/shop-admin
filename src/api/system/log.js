import request from '@/utils/request'

// 条件分页查询系统日志
export function listForPage(query) {
  return request({
    url: '/sysLog/querySysLogForPage',
    method: 'get',
    params: query
  })
}

// 根据ID查询日志信息
export function findById(id) {
  return request({
    url: '/sysLog/queryLogById/' + id,
    method: 'get'
  })
}

// 根据ID删除日志信息
export function deleteBatchByIds(ids) {
  return request({
    url: '/sysLog/deleteLogById/' + ids,
    method: 'delete'
  })
}

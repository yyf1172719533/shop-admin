import request from '@/utils/request'

export function listForPage(query) {
  return request({
    url: '/shopCoupon/queryForPage',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/shopCoupon/save',
    method: 'post',
    data

  })
}

export function deleteById(id) {
  return request({
    url: '/shopCoupon/delete/' + id,
    method: 'delete'
  })
}

/**
 * 下架优惠券
 * @param {*} id
 * @returns
 */
export function down(id) {
  return request({
    url: '/shopCoupon/down/' + id,
    method: 'get'
  })
}

export function findById(id) {
  return request({
    url: '/shopCoupon/findById/' + id,
    method: 'get'
  })
}

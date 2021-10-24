import request from '@/utils/request'

// 条件分页查询轮播图列表
export function listForPage(query) {
    return request({
        url: '/sysBanner/queryBannerForPage',
        method: 'get',
        params: query
    })
}

// 添加轮播图
export function save(data) {
    return request({
        url: '/sysBanner/save',
        method: 'post',
        data
    })
}

// 修改轮播图
export function update(data) {
    return request({
        url: '/sysBanner/update',
        method: 'put',
        data
    })
}

// 根据ID查询轮播图
export function findById(id) {
    return request({
        url: '/sysBanner/findById/' + id,
        method: 'get'
    })
}

// 根据ID删除轮播图
export function deleteById(id) {
    return request({
        url: '/sysBanner/deleteById/' + id,
        method: 'delete'
    })
}

// 根据ID更改轮播图状态
export function updateStatus(id, status) {
    return request({
        url: '/sysBanner/updateStatus/' + id + "/" + status,
        method: 'get'
    })
}
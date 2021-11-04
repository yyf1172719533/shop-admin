import request from '@/utils/request'

// 查询所有的商品分类
export function queryAll(query) {
    return request({
        url: 'product/category/queryAllList',
        method: 'get',
        params: query
    })
}

// 添加商品分类
export function save(data) {
    return request({
        url: 'product/category/save',
        method: 'post',
        data
    })
}

// 修改商品分类
export function update(data) {
    return request({
        url: 'product/category/update',
        method: 'put',
        data
    })
}

// 根据ID查询商品分类
export function findById(id) {
    return request({
        url: 'product/category/findById/' + id,
        method: 'get'
    })
}

// 根据ID删除商品分类
export function deleteById(id) {
    return request({
        url: 'product/category/deleteById/' + id,
        method: 'delete'
    })
}
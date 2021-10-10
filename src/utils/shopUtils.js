// 条件查询重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields()
  }
}

// 日期范围
export function addDateRange(params, dateRange) {
  const search = params
  search.startTime = ''
  search.endTime = ''
  if (dateRange != null && dateRange !== '' && dateRange !== undefined) {
    search.startTime = dateRange[0]
    search.endTime = dateRange[1]
  }
  return search
}

// 构造菜单树
export function handleTree(data, id, parentId, children, rootId) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || '0'

  // 菜单数据进行深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  // 循环所有数据
  const treeData = cloneData.filter(e1 => {
    const childData = cloneData.filter(e2 => {
      return e1[id] === e2[parentId]
    })
    childData.length > 0 ? e1.children = childData : ''
    // 返回上一层
    return e1[parentId] === rootId
  })
  return treeData !== '' ? treeData : data
}

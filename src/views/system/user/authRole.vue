<template>
  <div class="app-container">
    <h4 class="form-header h4">基本信息</h4>
    <el-form ref="queryForm" :model="form" label-width="80px">
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="用户账号" prop="userName">
            <el-input v-model="form.userName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="form.nickName" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <h4 class="form-header h4">角色信息</h4>
    <el-table
      ref="table"
      v-loading="loading"
      :data="roleDataList"
      @row-click="clickRow"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="角色编号" prop="id" align="center" />
      <el-table-column label="角色名称" prop="roleName" align="center" />
      <el-table-column label="排序值" prop="roleSort" align="center" />
      <el-table-column label="创建时间" prop="createTime" align="center" />
      <el-table-column label="更新时间" prop="updateTime" align="center" />
    </el-table>

    <el-pagination
      style="margin-top: 15px"
      v-show="total > 0"
      :current-page="pageNum"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-form label-width="100px">
      <el-form-item
        style="text-align: center; margin-top: 30px; margin-left: -120px"
      >
        <el-button type="primary" @click="handleSumbit()">提交</el-button>
        <el-button @click="close()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { queryUserAndRole, bindUserRole } from '@/api/system/user'

export default {
  name: 'AuthRole',
  data() {
    return {
      // 遮罩层
      loading: false,
      // 查询参数
      form: {
        userName: undefined,
        nickName: undefined
      },
      // 表格数据
      roleDataList: [],
      // 数据总数
      total: 0,
      // 页码
      pageNum: 1,
      // 每页大小
      pageSize: 10,
      // 选中角色编号
      roleIds: [],
      // 用户ID
      userId: undefined,
      // 用户拥有的角色
      roles: []
    }
  },
  created() {
    const userId = this.$route.params && this.$route.params.userId
    if (userId) {
      this.userId = userId
      this.getAuthRoleList()
    }
  },
  methods: {
    getAuthRoleList() {
      this.loading = true
      queryUserAndRole(this.userId, this.pageNum, this.pageSize).then((res) => {
        this.form = res.data.user
        this.roleDataList = res.data.roles.records
        this.total = Number(res.data.roles.total)
        this.roles = res.data.user.roles
        this.$nextTick(() => {
          this.roleDataList.forEach((e1) => {
            this.roles.forEach((e2) => {
              if (e1.id === e2.id) {
                this.$refs.table.toggleRowSelection(e1)
              }
            })
          })
        })
        this.loading = false
      })
    },
    handleSelectionChange(selection) {
      this.roleIds = selection.map((e) => e.id)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getAuthRoleList()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getAuthRoleList()
    },
    handleSumbit() {
      const userId = this.form.id
      const params = {
        userId: userId,
        roleIds: this.roleIds
      }
      bindUserRole(params).then(res => {
        this.msgSuccess('授权成功')
        this.close()
      }).catch(() => {
        this.msgError('授权失败')
      })
    },
    close() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/sys/user' })
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row)
    }
  }
}
</script>

<style>
.form-header {
  font-size: 15px;
  color: #6379bb;
  border-bottom: 1px solid #ddd;
  margin: 8px 10px 25px 10px;
  padding-bottom: 5px;
}
.h4 {
  font-family: inherit;
  font-weight: 500;
  line-height: 1.1;
}
.el-table {
  font-size: 14px;
  color: #606266;
}
.el-table thead {
  color: #909399;
  font-weight: 500;
}
</style>

<template>
  <el-dialog
    title="选择用户"
    :visible.sync="open"
    append-to-body
    width="1000px"
  >
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="用户名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名"
          clearable
        />
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入用户昵称"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 查询条件结束 -->

    <!-- 表格数据开始 -->
    <el-row>
      <el-table
        v-loading="loading"
        border
        :data="noAuthUserList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="账号" prop="userName" align="center" />
        <el-table-column label="昵称" prop="nickName" align="center" />
        <el-table-column label="邮箱" prop="email" align="center" />
        <el-table-column label="头像" prop="avatar" align="center">
          <template slot-scope="scope">
            <el-avatar
              style="width: 50px; heigth: 50px"
              :src="scope.row.avatar"
              fit="fill"
              :preview-src-list="[scope.row.header]"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          prop="updateTime"
          width="100px"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag>{{ scope.row.status === "1" ? "启用" : "禁用" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center" />
      </el-table>

      <!-- 分页组件开始 -->
      <el-pagination
        v-show="total > 0"
        style="margin-top: 15px"
        :current-page="queryParams.pageNum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <!-- 分页组件结束 -->
    </el-row>
    <!-- 表格数据结束 -->

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSelectUser">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { queryAuthUserList } from '@/api/system/user'
import { bindUserRole } from '@/api/system/role'

export default {
  props: {
    roleId: {
      type: [Number, String]
    }
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 是否打开弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleId: undefined,
        userName: undefined,
        nickName: undefined
      },
      // 表格数据
      noAuthUserList: [],
      // 数据总数
      total: 0,
      // 选中的用户
      userIds: []
    }
  },
  created() {},
  methods: {
    // 查询所有未授权的用户列表
    getNoAuthUserList() {
      this.loading = true
      queryAuthUserList(this.queryParams).then((res) => {
        this.noAuthUserList = res.data
        this.total = Number(res.total)
        this.loading = false
      })
    },
    show() {
      this.queryParams.roleId = this.roleId
      this.open = true
      this.getNoAuthUserList()
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getNoAuthUserList()
    },
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    handleSelectionChange(selection) {
      this.userIds = selection.map((e) => e.id)
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getNoAuthUserList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getNoAuthUserList()
    },
    handleSelectUser() {
      if (this.userIds.length === 0) {
        this.$message({
          message: '请选择至少一个用户进行授权',
          type: 'warning'
        })
        return
      }
      const params = {
        roleId: this.roleId,
        userIds: this.userIds
      }
      this.$confirm('确认要给选中的用户授权该角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        bindUserRole(params)
          .then((res) => {
            this.msgSuccess('授权成功')
            this.open = false
            this.$emit('ok')
          })
          .catch(() => {
            this.msgError('授权失败')
          })
      })
    },
    cancel() {
      this.open = false
      this.userIds = []
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        nickName: undefined
      }
    }
  }
}
</script>

<template>
  <div class="app-container">
    <!-- 搜索条件开始 -->
    <el-form ref="queryForm" :inline="true" :model="queryParams">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="queryParams.userName" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickName">
        <el-input v-model="queryParams.nickName" placeholder="请输入用户昵称" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择用户状态">
          <el-option label="启用" value="1" />
          <el-option label="禁用" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 搜索条件结束 -->

    <!-- 表头按钮开始 -->
    <el-row :gutter="10" style="margin-bottom: 8px">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
    </el-row>
    <!-- 表头按钮结束 -->

    <!-- 表格数据开始 -->
    <el-table v-loading="loading" border :data="userTableList">
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
      <el-table-column label="创建时间" prop="createTime" align="center" />
      <el-table-column label="更新时间" prop="updateTime" align="center" />
      <el-table-column label="登录时间" prop="loginTime" align="center" />
      <el-table-column label="状态" prop="updateTime" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="changeStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-edit"
            size="mini"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格数据结束 -->
  </div>
</template>

<script>
import { findUserList } from '@/api/system/user'

export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 查询参数
      queryParams: {
        userName: undefined,
        nickName: undefined,
        status: undefined
      },
      // 表格数据
      userTableList: []
    }
  },
  created() {
    // 加载用户列表
    this.getUserList()
  },
  methods: {
    getUserList() {
      this.loading = true
      findUserList(this.queryParams).then((res) => {
        this.userTableList = res.data
        this.loading = false
      })
    },
    handleQuery() {
      this.getUserList()
    },
    resetQuery() {
      this.resetForm('queryForm')
      this.getUserList()
    },
    handleAdd() {},
    changeStatus(row) {
      const status = row.status
      if (status === 1) {
        // 禁用
      } else {
        // 启用
      }
    },
    handleUpdate(row) {},
    handleDelete(row) {}
  }
}
</script>

<style scoped>
</style>

<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-form :model="queryParams" ref="queryForm" :inline="true">
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

    <!-- 表格工具栏开始 -->
    <el-row :gutter="10" style="margin-bottom: 8px">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >添加用户</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-circle-close"
          size="mini"
          :disabled="mutiple"
          @click="cancelAuthUserAll"
          >批量取消授权</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-close"
          size="mini"
          @click="handleClose"
          >关闭</el-button
        >
      </el-col>
    </el-row>
    <!-- 表格工具栏结束 -->

    <!-- 表格数据开始 -->
    <el-table
      v-loading="loading"
      border
      :data="authUserList"
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
      <el-table-column label="创建时间" prop="createTime" align="center" />
      <el-table-column label="更新时间" prop="updateTime" align="center" />
      <el-table-column label="登录时间" prop="loginTime" align="center" />
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
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-close"
            @click="cancelAuthUser(scope.row)"
            >取消授权</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格数据结束 -->

    <!-- 分页组件开始 -->
    <el-pagination
      v-show="total > 0"
      :current-page="queryParams.pageNum"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="queryParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 分页组件结束 -->
  </div>
</template>

<script>
import {
  queryAuthUserByRoleId,
  queryRoleById,
  unBindUserRole,
} from "@/api/system/role";

export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中用户
      userIds: [],
      // 非多个禁用
      mutiple: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleId: undefined,
        userName: undefined,
        nickName: undefined,
      },
      // 表格数据
      authUserList: [],
      // 数据总条数
      total: 0,
    };
  },
  created() {
    const roleId = this.$route.params && this.$route.params.roleId;
    if (roleId) {
      this.queryParams.roleId = roleId;
      this.getAuthUserList();
    }
  },
  methods: {
    // 查询已经授权的用户
    getAuthUserList() {
      this.loading = true;
      queryAuthUserByRoleId(this.queryParams).then((res) => {
        this.authUserList = res.data;
        this.total = Number(res.total);
        this.loading = false;
      });
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getAuthUserList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleAdd() {},
    cancelAuthUserAll(row) {
      const roleId = this.queryParams.roleId;
      let roleName = "";
      const params = {
        roleId: roleId,
        userIds: this.userIds,
      };
      queryRoleById(roleId)
        .then((res) => {
          roleName = res.data.roleName;
          this.$confirm('确认要取消选中用户的"' + roleName + '"角色吗?', "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            unBindUserRole(params)
              .then((res) => {
                this.msgSuccess("取消成功");
                this.getAuthUserList();
              })
              .catch(() => {
                this.msgError("取消失败");
              });
          });
        })
        .catch(() => {
          this.msgError("查询角色失败");
          return;
        });
    },
    handleClose() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/sys/role" });
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.getAuthUserList();
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.getAuthUserList();
    },
    handleSelectionChange(selection) {
      this.userIds = selection.map((e) => e.id);
      this.mutiple = !selection.length;
    },
    cancelAuthUser(row) {
      const roleId = this.queryParams.roleId;
      let roleName = "";
      const params = {
        roleId: roleId,
        userIds: [row.id],
      };
      queryRoleById(roleId)
        .then((res) => {
          roleName = res.data.roleName;
          this.$confirm('确认要取消该用户的"' + roleName + '"角色吗?', "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            unBindUserRole(params)
              .then((res) => {
                this.msgSuccess("取消成功");
                this.getAuthUserList();
              })
              .catch(() => {
                this.msgError("取消失败");
              });
          });
        })
        .catch(() => {
          this.msgError("查询角色失败");
          return;
        });
    },
  },
};
</script>

<style>
</style>
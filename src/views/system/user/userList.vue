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
      <el-form-item label="登录时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
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
          >新增</el-button
        >
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
          <el-image
            style="width: 50px; heigth: 50px"
            :src="scope.row.avatar"
            fit="fill"
            :preview-src-list="[scope.row.avatar]"
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
            active-value="1"
            inactive-value="0"
            @change="changeStatus($event, scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-edit"
            size="mini"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            type="text"
            icon="el-icon-delete"
            size="mini"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
          <el-dropdown
            szie="mini"
            @command="(command) => handleCommand(command, scope.row)"
          >
            <span class="el-dropdown-link">
              <i class="el-icon-d-arrow-right el-icon--right" />更多
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handleResetPwd" icon="el-icon-key"
                >重置密码</el-dropdown-item
              >
              <el-dropdown-item
                command="handleAuthRole"
                icon="el-icon-circle-check"
                >分配角色</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
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

    <!-- 添加或修改弹出层开始 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1000px"
      center
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="账号" prop="userName">
              <el-input
                v-model="form.userName"
                placeholder="请输入账号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="form.password"
                show-password
                placeholder="请输入密码"
                clearable
                :disabled="form.id === undefined ? false : true"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="昵称" prop="nickName">
              <el-input
                v-model="form.nickName"
                placeholder="请输入昵称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入邮箱"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="角色" prop="roleIds">
              <el-select v-model="form.roleIds" multiple placeholder="请选择角色">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="form.remark"
                :rows="3"
                type="textarea"
                placeholder="请输入备注"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 添加或修改弹出层结束 -->
  </div>
</template>

<script>
import {
  findUserList,
  updateStatus,
  addUser,
  updateUser,
  getById,
  deleteById,
  resetPwd,
  queryRoleByUserId
} from "@/api/system/user";
import md5 from "js-md5";

export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        nickName: undefined,
        status: undefined,
      },
      // 表格数据
      userTableList: [],
      // 总条数
      total: 0,
      // 对话框标题
      title: "",
      // 是否打开对话框
      open: false,
      // 角色选项
      roleOptions: [],
      // 表单对象
      form: {},
      // 日期范围
      dateRange: [],
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "账号不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, message: "密码不能少于6位", trigger: "change" },
        ],
        nickName: [
          { required: true, message: "昵称不能为空", trigger: "blur" },
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    // 加载用户列表
    this.getUserList();
  },
  methods: {
    getUserList() {
      this.loading = true;
      findUserList(this.addDateRange(this.queryParams, this.dateRange)).then(
        (res) => {
          this.userTableList = res.data;
          this.total = Number(res.total);
          this.loading = false;
        }
      );
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getUserList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.dateRange = [];
      this.handleQuery();
    },
    getRoleByUserId(params) {
      queryRoleByUserId(params).then(res => {
        this.roleOptions = res.data
      })
    },
    handleAdd() {
      let params = { userId: null }
      this.getRoleByUserId(params)
      this.title = "添加用户";
      this.open = true;
      this.reset();
    },
    changeStatus(e, row) {
      if (e === "0") {
        row.status = "1";
      } else {
        row.status = "0";
      }
      const id = row.id;
      const status = e;
      if (row.status === "1") {
        // 禁用
        this.$confirm("此操作将禁用该用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          updateStatus(id, status)
            .then((res) => {
              this.msgSuccess("禁用成功");
              this.getUserList();
            })
            .catch(() => {
              this.msgError("禁用失败");
            });
        });
      } else {
        // 启用
        this.$confirm("此操作将启用该用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          updateStatus(id, status)
            .then((res) => {
              this.msgSuccess("启用成功");
              this.getUserList();
            })
            .catch(() => {
              this.msgError("启用失败");
            });
        });
      }
    },
    handleUpdate(row) {
      let params = { userId: row.id }
      this.getRoleByUserId(params)
      this.title = "修改用户";
      this.open = true;
      this.reset();
      getById(row.id).then((res) => {
        this.form = res.data;
      });
    },
    handleDelete(row) {
      this.$confirm("是否删除该用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteById(row.id)
          .then((res) => {
            this.msgSuccess("删除成功");
            this.getUserList();
          })
          .catch(() => {
            this.msgError("删除失败");
          });
      });
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.getUserList();
    },
    handleSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.form.id === undefined) {
            // 添加
            this.form.password = md5(this.form.password);
            addUser(this.form)
              .then((res) => {
                this.msgSuccess("添加成功");
                this.getUserList();
                this.open = false;
                this.loading = false;
              })
              .catch(() => {
                this.msgError("添加失败");
              });
          } else {
            // 修改
            updateUser(this.form)
              .then((res) => {
                this.msgSuccess("修改成功");
                this.getUserList();
                this.open = false;
                this.loading = false;
              })
              .catch(() => {
                this.msgError("修改失败");
              });
          }
        }
      });
    },
    cancel() {
      this.open = false;
      this.title = "";
    },
    reset() {
      this.form = {
        id: undefined,
        userName: undefined,
        password: undefined,
        nickName: undefined,
        email: undefined,
        role: undefined,
        remark: undefined,
      };
      this.resetForm("form");
    },
    handleCommand(command, row) {
      switch (command) {
        case "handleResetPwd":
          this.handleResetPwd(row);
          break;
        case "handleAuthRole":
          this.handleAuthRole(row);
          break;
        default:
          break;
      }
    },
    handleResetPwd(row) {
      this.$confirm("此操作将重置该用户的密码, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        resetPwd(row.id)
          .then((res) => {
            this.msgSuccess("重置密码成功");
            this.getUserList();
          })
          .catch(() => {
            this.msgError("重置密码失败");
          });
      });
    },
    handleAuthRole(row) {
      const userId = row.id;
      this.$router.push("/system/user-auth/role/" + userId);
    },
  },
};
</script>

<style>
.el-dropdown {
  display: inline-block;
  position: relative;
  color: #606266;
  font-size: 12px;
}
.el-table .el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  margin-left: 5px;
}
</style>

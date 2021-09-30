<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :inline="true" :model="queryParams">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="queryParams.roleName" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="创建时间">
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
    <!-- 查询条件结束 -->

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
    <el-table v-loading="loading" border :data="roleTableList">
      <el-table-column label="角色名称" prop="roleName" align="center" />
      <el-table-column label="排序值" prop="roleSort" align="center" />
      <el-table-column label="创建人" prop="createBy" align="center" />
      <el-table-column label="创建时间" prop="createTime" align="center" />
      <el-table-column label="更新人" prop="updateBy" align="center" />
      <el-table-column label="更新时间" prop="updateTime" align="center" />
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
            size="mini"
            @command="(command) => handleCommand(command, scope.row)"
          >
            <span class="el-dropdown-link">
              <i class="el-icon-d-arrow-right el-icon--right"></i>更多
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                command="handleDataScope"
                icon="el-icon-circle-check"
                >菜单权限</el-dropdown-item
              >
              <el-dropdown-item command="handleAuthUser" icon="el-icon-user"
                >分配用户</el-dropdown-item
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

    <!-- 添加修改弹出层开始 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      center
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="form.roleName"
            size="small"
            style="width: 240px"
            placeholder="请输入角色名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="排序值" prop="roleSort">
          <el-input-number
            v-model="form.roleSort"
            :min="0"
            size="small"
            style="width: 240px"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 添加修改弹出层结束 -->
  </div>
</template>

<script>
import {
  listForPage,
  addRole,
  updateRole,
  queryRoleById,
  deleteById,
} from "@/api/system/role";

export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
      },
      // 日期范围
      dateRange: [],
      // 表格数据
      roleTableList: [],
      // 数据总数
      total: 0,
      // 弹出层标题
      title: "",
      // 是否打开弹出层
      open: false,
      // 表单对象
      form: {
        roleName: undefined,
        roleSort: 0,
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.queryRoleData();
  },
  methods: {
    // 查询表格数据
    queryRoleData() {
      this.loading = true;
      listForPage(this.addDateRange(this.queryParams, this.dateRange)).then(
        (res) => {
          this.roleTableList = res.data;
          this.total = Number(res.total);
          this.loading = false;
        }
      );
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.queryRoleData();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.dateRange = [];
      this.handleQuery()
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.queryRoleData();
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.queryRoleData();
    },
    handleAdd() {
      this.title = "添加角色";
      this.open = true;
      this.reset();
    },
    handleUpdate(row) {
      this.title = "修改角色";
      this.open = true;
      this.reset();
      queryRoleById(row.id).then((res) => {
        this.form = res.data;
      });
    },
    handleDelete(row) {
      this.$confirm("是否删除此角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteById(row.id)
          .then((res) => {
            this.msgSuccess("删除成功");
            this.queryRoleData();
          })
          .catch(() => {
            this.msgError("删除失败");
          });
      });
    },
    handleSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.form.id === undefined) {
            // 添加
            addRole(this.form)
              .then((res) => {
                this.open = false;
                this.loading = false;
                this.msgSuccess("添加成功");
                this.queryRoleData();
              })
              .catch(() => {
                this.msgError("添加失败");
              });
          } else {
            // 修改
            updateRole(this.form)
              .then((res) => {
                this.open = false;
                this.loading = false;
                this.msgSuccess("修改成功");
                this.queryRoleData();
              })
              .catch(() => {
                this.msgError("修改失败");
              });
          }
        }
      });
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleDataScope":
          this.handleDataScope(row);
          break;
        case "handleAuthUser":
          this.handleAuthUser(row);
          break;
        default:
          break;
      }
    },
    // 分配菜单权限
    handleDataScope(row) {},
    // 分配用户
    handleAuthUser(row) {
      const roleId = row.id;
      this.$router.push("/system/role-auth/user/" + roleId);
    },
    cancel() {
      this.title = "";
      this.open = false;
    },
    reset() {
      this.form = {
        id: undefined,
        roleName: undefined,
        roleSort: 0,
      };
      this.resetForm("form");
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
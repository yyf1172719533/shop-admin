<template>
  <div class="app-container">
    <!-- 搜索条件开始 -->
    <el-form ref="queryForm" :inline="true" :model="queryParams">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
        />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          value-format="yyyy-MM-dd"
          type="daterange"
          clearable
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
    <el-table v-loading="loading" border :data="helpDataList">
      <el-table-column label="编号" prop="id" align="center" />
      <el-table-column label="标题" prop="title" align="center" />
      <el-table-column label="创建人" prop="createBy" align="center" />
      <el-table-column label="创建时间" prop="createTime" align="center" />
      <el-table-column label="更新人" prop="updateBy" align="center" />
      <el-table-column label="更新时间" prop="updateTime" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-view"
            size="mini"
            @click="handleView(scope.row)"
            >查看</el-button
          >
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
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格数据结束 -->

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

    <!-- 添加或修改弹出层开始 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1200px"
      center
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="标题" prop="title">
              <el-input
                v-model="form.title"
                placeholder="请输入帮助标题"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="内容">
            <tinymce v-model="form.content" :height="500" />
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 添加或修改弹出层结束 -->

    <!-- 帮助详情弹出层开始 -->
    <el-dialog
      :title="title"
      :visible.sync="helpDetailOpen"
      width="60%"
      center
      append-to-body
    >
      <tinymce v-model="content" :height="500" />
    </el-dialog>
    <!-- 帮助详情弹出层结束 -->
  </div>
</template>

<script>
import {
  listForPage,
  save,
  update,
  findById,
  deleteById,
} from "@/api/system/help";
import Tinymce from '@/components/Tinymce'

export default {
  components: { Tinymce },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        startTime: undefined,
        endTime: undefined,
      },
      // 日期范围
      dateRange: [],
      // 表格数据
      helpDataList: [],
      // 数据总条数
      total: 0,
      // 对话框标题
      title: "",
      // 是否打开对话框
      open: false,
      // 是否打开帮助详情对话框
      helpDetailOpen: false,
      // form表单
      form: {},
      // 表单校验
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
      },
      // 帮助内容
      content: "",
    };
  },
  created() {
    this.getHelpData();
  },
  methods: {
    // 查询帮助列表
    getHelpData() {
      this.loading = true;
      listForPage(this.addDateRange(this.queryParams, this.dateRange)).then(
        (res) => {
          this.helpDataList = res.data;
          this.total = Number(res.total);
          this.loading = false;
        }
      );
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getHelpData();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.dateRange = [];
      this.handleQuery();
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.getHelpData();
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.getHelpData();
    },
    handleAdd() {
      this.reset();
      this.title = "添加帮助";
      this.open = true;
    },
    handleView(row) {
      this.helpDetailOpen = true;
      this.title = row.title;
      this.content = row.content;
    },
    handleUpdate(row) {
      this.reset();
      this.title = "修改帮助";
      this.open = true;
      this.loading = true;
      findById(row.id).then((res) => {
        this.form = res.data;
        this.loading = false;
      });
    },
    handleDelete(row) {
      this.$confirm("是否删除此帮助?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteById(row.id)
          .then((res) => {
            this.msgSuccess(res.msg);
            this.getHelpData();
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
            save(this.form)
              .then((res) => {
                this.msgSuccess(res.msg);
                this.getHelpData();
                this.open = false;
                this.loading = false;
              })
              .catch(() => {
                this.msgError("添加失败");
              });
          } else {
            // 修改
            update(this.form)
              .then((res) => {
                this.msgSuccess(res.msg);
                this.getHelpData();
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
      this.title = "";
      this.open = false;
    },
    reset() {
      this.form = {
        id: undefined,
        title: undefined,
        content: undefined,
      };
      this.resetForm("form");
    },
  },
};
</script>

<style>
</style>

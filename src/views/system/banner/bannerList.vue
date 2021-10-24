<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :inline="true" :model="queryParams">
      <el-form-item label="轮播图名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入轮播图名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
        >
          <el-option label="启用" value="0" />
          <el-option label="禁用" value="1" />
        </el-select>
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

    <!-- 数据表格开始 -->
    <el-table v-loading="loading" :data="bannerData" border>
      <el-table-column label="轮播图名称" prop="name" align="center" />
      <el-table-column label="图片" prop="pictureUrl" align="center">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.pictureUrl"
            fit="fill"
            :preview-src-list="[scope.row.pictureUrl]"
          />
        </template>
      </el-table-column>
      <el-table-column label="链接地址" prop="url" align="center" width="220" />
      <el-table-column label="点击数" prop="clickCount" align="center" />
      <el-table-column label="下单数" prop="orderCount" align="center" />
      <el-table-column label="排序" prop="sort" align="center" />
      <el-table-column
        label="创建时间"
        prop="createTime"
        align="center"
        width="180"
      />
      <el-table-column
        label="更新时间"
        prop="updateTime"
        align="center"
        width="180"
      />
      <el-table-column label="创建人" prop="createBy" align="center" />
      <el-table-column label="更新人" prop="updateBy" align="center" />
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="0"
            :inactive-value="1"
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
        </template>
      </el-table-column>
    </el-table>
    <!-- 数据表格结束 -->

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

    <!-- 添加修改轮播图弹出层开始 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      append-to-body
      center
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input
                v-model="form.name"
                placeholder="请输入轮播图名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input-number
                v-model="form.sort"
                :min="0"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="链接地址" prop="url">
              <el-input
                v-model="form.url"
                placeholder="请输入链接地址"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="图片" prop="pictureUrl">
              <el-upload
                class="avatar-uploader"
                :action="uploadFile"
                :show-file-list="false"
                :data="{ dir: 'banner' }"
                :headers="{ Authorization: token }"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="form.remark"
                placeholder="请输入备注"
                type="textarea"
                :rows="2"
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
    <!-- 添加修改轮播图弹出层结束 -->
  </div>
</template>

<script>
import {
  listForPage,
  save,
  update,
  findById,
  deleteById,
  updateStatus,
} from "@/api/system/banner";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        status: undefined,
        startTime: undefined,
        endTime: undefined,
      },
      // 日期范围
      dateRange: [],
      // 轮播图数据
      bannerData: [],
      // 数据总条数
      total: 0,
      // 弹出层标题
      title: "",
      // 是否打开弹出层
      open: false,
      // 表单对象
      form: {},
      // 头像上传路径
      uploadFile: process.env.VUE_APP_UPLOAD_API,
      // 头像地址
      imageUrl: "",
      // 表单校验
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapGetters(["token"]),
  },
  created() {
    this.getBannerList();
  },
  methods: {
    getBannerList() {
      this.loading = true;
      listForPage(this.addDateRange(this.queryParams, this.dateRange)).then(
        (res) => {
          this.bannerData = res.data;
          this.total = Number(res.total);
          this.loading = false;
        }
      );
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getBannerList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.dateRange = [];
      this.handleQuery();
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.getBannerList();
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.getBannerList();
    },
    handleAdd() {
      this.title = "添加轮播图";
      this.open = true;
      this.reset();
    },
    handleUpdate(row) {
      this.title = "修改轮播图";
      this.open = true;
      this.reset();
      findById(row.id).then((res) => {
        this.form = res.data;
        this.imageUrl = this.form.pictureUrl;
      });
    },
    handleDelete(row) {
      this.$confirm("是否确认删除此轮播图?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteById(row.id)
          .then((res) => {
            this.msgSuccess("删除成功");
            this.getBannerList();
          })
          .catch(() => {
            this.msgError("删除失败");
          });
      });
    },
    handleAvatarSuccess(res, file) {
      this.msgSuccess(res.msg);
      this.imageUrl = res.data;
      this.form.pictureUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > 10) {
        this.msgError("上传头像图片大小不能超过 10MB!");
      }
    },
    handleSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.form.id === undefined) {
            save(this.form)
              .then((res) => {
                this.msgSuccess("添加成功");
                this.getBannerList();
                this.open = false;
                this.loading = false;
              })
              .catch(() => {
                this.msgError("添加失败");
              });
          } else {
            update(this.form)
              .then((res) => {
                this.msgSuccess("修改成功");
                this.getBannerList();
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
    changeStatus(e, row) {
      if (e === 0) {
        row.status = 1;
        this.$confirm("此操作将启用该轮播图, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          updateStatus(row.id, e)
            .then((res) => {
              this.msgSuccess("启用成功");
              this.getBannerList();
            })
            .catch(() => {
              this.msgError("启用失败");
            });
        });
      } else {
        row.status = 0;
        this.$confirm("此操作将禁用该轮播图, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          updateStatus(row.id, e)
            .then((res) => {
              this.msgSuccess("禁用成功");
              this.getBannerList();
            })
            .catch(() => {
              this.msgError("禁用失败");
            });
        });
      }
    },
    cancel() {
      this.open = false;
      this.title = "";
    },
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        sort: 0,
        url: undefined,
        pictureUrl: undefined,
        remark: undefined,
      };
      this.imageUrl = "";
      this.resetForm("form");
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
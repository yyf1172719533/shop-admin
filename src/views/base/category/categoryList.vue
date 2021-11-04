<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          clearable
          placeholder="请输入名称"
        />
      </el-form-item>
      <el-form-item label="导航栏显示" prop="navStatus">
        <el-select
          v-model="queryParams.navStatus"
          clearable
          placeholder="请选择"
        >
          <el-option label="是" :value="1" />
          <el-option label="否" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格按钮开始 -->
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
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
          >展开/折叠</el-button
        >
      </el-col>
    </el-row>
    <!-- 表格按钮结束 -->

    <!-- 表格数据开始 -->
    <el-table
      v-if="refreshTable"
      v-loading="loading"
      border
      :data="categoryList"
      :default-expand-all="isExpandAll"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="名称" prop="name" align="left" />
      <el-table-column label="图片" prop="pictureUrl" align="center">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.pictureUrl"
            fit="fill"
            :preview-src-list="[scope.row.pictureUrl]"
          />
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort" align="center" />
      <el-table-column label="分类级别" prop="level" align="center" />
      <el-table-column label="导航栏显示" prop="navStatus" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.navStatus === 1 ? 'primary' : 'info'">
            {{ scope.row.navStatus === 1 ? "显示" : "隐藏" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            >新增</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格数据结束 -->

    <!-- 添加或修改商品分类对话框开始 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      append-to-body
      center
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="上传图片">
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :show-file-list="false"
                :data="{ dir: 'category' }"
                :headers="{ Authorization: token }"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="上级分类">
              <treeselect
                v-model="form.parentId"
                :options="categoryOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="请选择上级分类"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分类名称" prop="name">
              <el-input
                v-model="form.name"
                placeholder="请输入分类名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序">
              <el-input-number
                v-model="form.sort"
                controls-position="right"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分类级别">
              <el-radio-group v-model="form.level">
                <el-radio :label="1">1级</el-radio>
                <el-radio :label="2">2级</el-radio>
                <el-radio :label="3">3级</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="导航显示" style="margin-left: 25px">
              <el-radio-group v-model="form.navStatus">
                <el-radio :label="1">显示</el-radio>
                <el-radio :label="0">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改商品分类对话框结束 -->
  </div>
</template>

<script>
import {
  queryAll,
  save,
  update,
  findById,
  deleteById,
} from "@/api/base/category";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapGetters } from "vuex";

export default {
  components: {
    Treeselect,
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 查询参数
      queryParams: {
          name: undefined,
          navStatus: undefined
      },
      // 数据表格
      categoryList: [],
      // 是否全部展开  默认全部折叠
      isExpandAll: false,
      // 是否重新渲染表格数据
      refreshTable: true,
      // 弹出层标题
      title: "",
      // 是否打开弹出层
      open: false,
      // 上传图片地址
      uploadUrl: process.env.VUE_APP_UPLOAD_API,
      imageUrl: "",
      // 表单对象
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
      },
      // 树形结构数据
      categoryOptions: [],
    };
  },
  computed: {
    ...mapGetters(["token"]),
  },
  created() {
    this.queryAllCategory();
  },
  methods: {
    // 查询商品分类列表
    queryAllCategory() {
      this.loading = true;
      queryAll(this.queryParams).then((res) => {
        this.categoryList = this.handleTree(res.data, "id");
        this.loading = false;
      });
    },
    handleQuery() {
      this.queryAllCategory();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.queryAllCategory();
    },
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },
    getTreeSelectData() {
      queryAll().then((res) => {
        let categoryList = res.data;
        categoryList = categoryList.filter((e) => e.level !== 3);
        this.categoryOptions = [];
        const category = { id: 0, name: "主类目", children: [] };
        category.children = this.handleTree(categoryList, "id");
        this.categoryOptions.push(category);
      });
    },
    handleAdd(row) {
      this.reset();
      this.getTreeSelectData();
      if (row != null && row.id) {
        this.form.parentId = row.id;
      } else {
        this.form.parentId = 0;
      }
      this.title = "添加商品分类";
      this.open = true;
    },
    handleUpdate(row) {
      this.reset();
      this.getTreeSelectData();
      this.title = "修改商品分类";
      this.open = true;
      findById(row.id).then((res) => {
        this.form = res.data;
        this.imageUrl = this.form.pictureUrl;
      });
    },
    handleDelete(row) {
      this.$confirm(
        '是否确认删除名称为"' + row.name + '"的商品分类？',
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        deleteById(row.id).then((res) => {
          if (res.code === 40000) {
            this.msgError(res.msg);
            this.queryAllCategory();
          } else {
            this.msgSuccess(res.msg);
            this.queryAllCategory();
          }
        });
      });
    },
    // 头像上传成功后的回调
    handleAvatarSuccess(res, file) {
      this.msgSuccess(res.msg);
      this.imageUrl = res.data;
      this.form.pictureUrl = res.data;
    },
    // 上传头像前的回调
    beforeAvatarUpload(file) {
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > 10) {
        this.msgError("上传头像图片大小不能超过 10MB!");
      }
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id === undefined) {
            // 添加
            save(this.form)
              .then((res) => {
                this.msgSuccess(res.msg);
                this.loading = false;
                this.open = false;
                this.queryAllCategory();
              })
              .catch(() => {
                this.msgError("添加失败");
                this.loading = false;
              });
          } else {
            // 修改
            update(this.form)
              .then((res) => {
                this.msgSuccess(res.msg);
                this.loading = false;
                this.open = false;
                this.queryAllCategory();
              })
              .catch(() => {
                this.msgError("修改失败");
                this.loading = false;
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
        parentId: undefined,
        name: undefined,
        sort: 0,
        level: 1,
        navStatus: 1,
      };
      this.imageUrl = "";
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
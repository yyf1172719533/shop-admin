<template>
  <div class="app-container">
    <!-- 搜索条件开始 -->
    <el-form ref="queryForm" :inline="true" :model="queryParams">
      <el-form-item label="品牌标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入品牌标题"
          clearable
        />
      </el-form-item>
      <el-form-item label="是否显示" prop="showStatus">
        <el-select
          v-model="queryParams.showStatus"
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
    <!-- 搜索条件结束 -->

    <!-- 表格按钮开始 -->
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
    <!-- 表格按钮结束 -->

    <!-- 表格数据开始 -->
    <el-table v-loading="loading" :data="brandList" border>
      <el-table-column label="编号" prop="id" align="center" />
      <el-table-column label="品牌名称" prop="name" align="center" />
      <el-table-column label="排序" prop="sort" align="center" />
      <el-table-column label="是否显示" prop="showStatus" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.showStatus === 1 ? 'primary' : 'info'">
            {{ scope.row.showStatus === 1 ? "显示" : "隐藏" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="LOGO" prop="logo" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.logo"
            fit="fill"
            :preview-src-list="[scope.row.logo]"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
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

    <!-- 添加或修改商品品牌对话框开始 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      append-to-body
      center
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="88px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="品牌LOGO">
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :show-file-list="false"
                :data="{ dir: 'brand' }"
                :headers="{ Authorization: token }"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="品牌名称" prop="name">
              <el-input
                v-model="form.name"
                placeholder="请输入品牌名称"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否显示">
              <el-radio-group v-model="form.showStatus">
                <el-radio :label="1">显示</el-radio>
                <el-radio :label="0">隐藏</el-radio>
              </el-radio-group>
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
          <el-col :span="24">
            <el-form-item label="商品分类">
              <el-select
                v-model="form.categoryIds"
                placeholder="请选择"
                style="width: 100%"
                multiple
                clearable
                filterable
              >
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改商品品牌对话框结束 -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  listForPage,
  save,
  update,
  findById,
  deleteById
} from '@/api/base/brand'
import { queryAll } from '@/api/base/category'

export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 数据表格
      brandList: [],
      // 数据总条数
      total: 0,
      // 对话框标题
      title: '',
      // 是否打开弹出层
      open: false,
      // 表单对象
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }]
      },
      // 上传图片地址
      uploadUrl: process.env.VUE_APP_UPLOAD_API,
      // 图片地址
      imageUrl: '',
      // 商品分类
      categoryOptions: []
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  created() {
    this.queryBrandList()
    // 查询所有2级的商品分类
    queryAll().then(res => {
      this.categoryOptions = res.data.filter(e => e.level === 2)
    })
  },
  methods: {
    // 查询商品品牌
    queryBrandList() {
      this.loading = true
      listForPage(this.queryParams).then((res) => {
        this.brandList = res.data
        this.total = Number(res.total)
        this.loading = false
      })
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.queryBrandList()
    },
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.queryBrandList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.queryBrandList()
    },
    handleAdd() {
      this.reset()
      this.title = '添加品牌'
      this.open = true
    },
    handleUpdate(row) {
      this.reset()
      this.title = '修改品牌'
      this.open = true
      findById(row.id).then((res) => {
        this.form = res.data
        this.imageUrl = this.form.logo
      })
    },
    handleDelete(row) {
      this.$confirm('是否删除选中的商品品牌?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteById(row.id)
          .then((res) => {
            this.msgSuccess(res.msg)
            this.queryBrandList()
          })
          .catch(() => {
            this.msgError('删除失败')
          })
      })
    },
    // 头像上传成功后的回调
    handleAvatarSuccess(res, file) {
      this.msgSuccess(res.msg)
      this.imageUrl = res.data
      this.form.logo = res.data
    },
    // 上传头像前的回调
    beforeAvatarUpload(file) {
      const fileSize = file.size / 1024 / 1024
      if (fileSize > 10) {
        this.msgError('上传头像图片大小不能超过 10MB!')
      }
    },
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.form.id === undefined) {
            // 添加
            save(this.form)
              .then((res) => {
                this.msgSuccess(res.msg)
                this.queryBrandList()
                this.open = false
                this.loading = false
              })
              .catch(() => {
                this.msgError('添加失败')
              })
          } else {
            // 修改
            update(this.form)
              .then((res) => {
                this.msgSuccess(res.msg)
                this.queryBrandList()
                this.open = false
                this.loading = false
              })
              .catch(() => {
                this.msgError('修改失败')
              })
          }
        }
      })
    },
    cancel() {
      this.title = ''
      this.open = false
    },
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        showStatus: 1,
        sort: 0,
        categoryIds: undefined
      }
      this.imageUrl = ''
      this.resetForm('form')
    }
  }
}
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

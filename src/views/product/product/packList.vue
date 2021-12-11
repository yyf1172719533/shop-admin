<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="套装名称" prop="name">
        <el-input
          v-model="queryParams.name"
          clearable
          placeholder="请输入套装名称"
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
    <el-table v-loading="loading" border :data="packDataList">
      <el-table-column label="编号" prop="id" align="center" width="200" />
      <el-table-column label="套装名称" prop="name" align="center" />
      <el-table-column
        label="商品数量"
        prop="productCount"
        align="center"
        width="150"
      />
      <el-table-column
        label="创建时间"
        prop="createTime"
        align="center"
        width="160"
      />
      <el-table-column
        label="创建人"
        prop="createBy"
        align="center"
        width="120"
      />
      <el-table-column label="操作" align="center" width="150">
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

    <!-- 添加或修改商品套装信息弹出层开始 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      append-to-body
      width="800px"
      center
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
        size="small"
      >
        <el-form-item label="套装名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入套装名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="套装商品">
          <el-button @click="selectProduct">选择商品</el-button>
        </el-form-item>
        <el-form-item>
          <el-table
            :data="form.productList"
            border
            style="width: 100%"
            :cell-style="cellStyle"
          >
            <el-table-column
              label="商品名称"
              prop="productName"
              align="center"
            />
            <el-table-column label="商品价格(元)" prop="price" align="center" />
            <el-table-column label="商品库存" prop="stockNum" align="center" />
            <el-table-column label="商品品牌" prop="brandName" align="center">
              <template slot-scope="scope">
                <el-tag type="success">{{ scope.row.brandName }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  @click="deleteProduct(scope.row.id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改商品套装信息弹出层结束 -->

    <el-dialog
      width="70%"
      :visible.sync="openSelectProductDialog"
      append-to-body
      title="选择商品"
      center
    >
      <select-product
        :default-select="form.productList"
        @selectSubmit="selectSubmit"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  save,
  update,
  deleteById,
  listForPage,
  findById
} from '@/api/product/pack'
import selectProduct from './pack-product-select.vue'

export default {
  components: {
    selectProduct
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 日期范围
      dateRange: [],
      // 数据总条数
      total: 0,
      // 套装数据
      packDataList: [],
      // 弹出层标题
      title: '',
      // 是否打开弹出层
      open: false,
      // 表单对象
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: '请输入套装名称', trigger: 'blur' }
        ]
      },
      // 是否打开选择商品弹出层
      openSelectProductDialog: false
    }
  },
  created() {
    this.getProductPackList()
  },
  methods: {
    // 查询套装总数
    getProductPackList() {
      this.loading = true
      listForPage(this.addDateRange(this.queryParams, this.dateRange)).then(
        (res) => {
          this.packDataList = res.data
          this.total = Number(res.total)
          this.loading = false
        }
      )
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getProductPackList()
    },
    resetQuery() {
      this.resetForm('queryForm')
      this.dateRange = []
      this.handleQuery()
    },
    handleAdd() {
      this.reset()
      this.title = '添加商品套装'
      this.open = true
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getProductPackList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getProductPackList()
    },
    handleUpdate(row) {
      this.reset()
      this.title = '修改商品套装'
      this.open = true
      findById(row.id).then((res) => {
        this.form = res.data
      })
    },
    handleDelete(row) {
      this.$confirm(
        '是否确认删除名称为"' + row.name + '"的商品套装？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deleteById(row.id)
          .then((res) => {
            this.msgSuccess(res.msg)
            this.getProductPackList()
          })
          .catch(() => {
            this.msgError('删除成功')
          })
      })
    },
    cellStyle(row) {
      if (row.column.label === '商品库存' && row.row.stockNum <= 100) {
        return 'color: red'
      }
    },
    selectProduct() {
      this.openSelectProductDialog = true
    },
    selectSubmit(val) {
      this.openSelectProductDialog = false
      this.form.productList = val
    },
    deleteProduct(id) {
      this.form.productList.splice(
        this.form.productList.findIndex((item) => id === item.id),
        1
      )
    },
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id === undefined) {
            save(this.form).then(res => {
              this.msgSuccess(res.msg)
              this.open = false
              this.getProductPackList()
            }).catch(() => {
              this.msgSuccess('添加失败')
            })
          } else {
            update(this.form).then(res => {
              this.msgSuccess(res.msg)
              this.open = false
              this.getProductPackList()
            }).catch(() => {
              this.msgSuccess('修改失败')
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
        name: undefined,
        productList: []
      }
    }
  }
}
</script>

<style>
</style>

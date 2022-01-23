<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="优惠券名称" prop="name">
        <el-input
          v-model="queryParams.name"
          clearable
          placeholder="请输入优惠券名称"
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
    <el-table v-loading="loading" border :data="shopCouponList">
      <el-table-column label="编号" prop="id" align="center" width="180" />
      <el-table-column label="名称" prop="name" align="center" />
      <el-table-column
        label="金额(元)"
        prop="amount"
        align="center"
        width="120"
      />
      <el-table-column label="使用门槛(元)" prop="minPoint" align="center" width="120" />
      <el-table-column label="有效期" align="center" width="320">
        <template slot-scope="scope">
          <span>{{ scope.row.startDate }}</span>
          ~
          <span>{{ scope.row.endDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center" width="150">
        <template slot-scope="scope">
          <div>发行量: {{ scope.row.publishCount }}</div>
          <div>剩余数: {{ scope.row.restCount }}</div>
          <div>已领取: {{ scope.row.receiveCount }}</div>
          <div>已使用: {{ scope.row.useCount }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '1'" type="success">上架</el-tag>
          <el-tag v-if="scope.row.status === '0'" type="warning">下架</el-tag>
          <el-tag v-if="scope.row.status === '2'" type="danger">已过期</el-tag>
        </template>
      </el-table-column>
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
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-order"
            @click="handleViewDetail(scope.row)"
          >详情</el-button>
          <el-button
            v-show="scope.row.status === '1'"
            size="mini"
            type="text"
            icon="el-icon-bottom"
            @click="handleDown(scope.row)"
          >下架</el-button>
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

    <!-- 添加优惠券弹出层开始 -->
    <el-dialog
      :title="title"
      :visible.sync="openAddDialog"
      width="35%"
      append-to-body
      center
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        label-width="100px"
        size="small"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="优惠券名称" prop="name">
              <el-input
                v-model="form.name"
                placeholder="请输入优惠券名称"
                style="width: 100%"
                clearable
                :disabled="form.id !== undefined"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="面值" prop="amount">
              <el-input-number
                v-model="form.amount"
                controls-position="right"
                :precision="2"
                :step="0.01"
                :min="0"
                style="width: 100%"
                :disabled="form.id !== undefined"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="优惠券数量" prop="publishCount">
              <el-input-number
                v-model="form.publishCount"
                placeholder="请输入优惠券数量"
                :min="0"
                style="width: 100%"
                :disabled="form.id !== undefined"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用门槛" prop="minPoint">
              <el-input-number
                v-model="form.minPoint"
                controls-position="right"
                :precision="2"
                :step="0.01"
                :min="0"
                style="width: 100%"
                :disabled="form.id !== undefined"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="有效期" prop="timeRange">
              <el-date-picker
                v-model="timeRange"
                style="width: 100%"
                type="datetimerange"
                clearable
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :disabled="form.id !== undefined"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="优惠券类型">
              <el-radio-group
                v-model="form.couponType"
                style="margin-bottom: 30px"
                :disabled="form.id !== undefined"
              >
                <el-radio-button :label="0">全场通用</el-radio-button>
                <el-radio-button :label="1">指定分类</el-radio-button>
                <el-radio-button :label="2">指定商品</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="form.couponType === 1" :gutter="20">
          <el-col :span="24">
            <el-form-item label="选择分类">
              <el-cascader
                :options="categoryOptions"
                :props="{
                  expandTrigger: 'hover',
                  value: 'id',
                  label: 'name',
                }"
                filterable
                clearable
                style="width: 100%"
                placeholder="请选择商品分类"
                :disabled="form.id !== undefined"
                @change="handleChange"
              />
            </el-form-item>
            <el-form-item>
              <el-table
                :data="form.productCategoryList"
                border
                style="width: 100%"
              >
                <el-table-column label="分类名称" prop="name" align="center" />
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      icon="el-icon-delete"
                      :disabled="form.id !== undefined"
                      @click="deleteProductCategory(scope.row.id)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="form.couponType === 2" :gutter="20">
          <el-col :span="24">
            <el-form-item>
              <el-button
                type="primary"
                :disabled="form.id !== undefined"
                @click="selectProduct"
              >选择商品</el-button>
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
                <el-table-column
                  label="商品价格(元)"
                  prop="price"
                  align="center"
                />
                <el-table-column
                  label="商品库存"
                  prop="stockNum"
                  align="center"
                />
                <el-table-column
                  label="商品品牌"
                  prop="brandName"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-tag type="success">{{ scope.row.brandName }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      icon="el-icon-delete"
                      :disabled="form.id !== undefined"
                      @click="deleteProduct(scope.row.id)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div v-show="form.id === undefined" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
      <div v-show="form.id !== undefined" slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 添加优惠券弹出层结束 -->

    <el-dialog
      width="70%"
      :visible.sync="openSelectProductDialog"
      append-to-body
      title="选择商品"
      center
    >
      <product-select
        :default-select="form.productList"
        @selected="setProductList"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  listForPage,
  save,
  deleteById,
  down,
  findById
} from '@/api/market/product/shopCoupon'
import { queryAll } from '@/api/base/category'
import productSelect from '../../product/product/product-select.vue'

export default {
  components: { productSelect },
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
      // 表格数据
      shopCouponList: [],
      // 数据总数
      total: 0,
      // 是否打开添加优惠券弹出层
      openAddDialog: false,
      // 弹出层标题
      title: '',
      // 表单对象
      form: {
        couponType: 0,
        // 分类
        productCategoryList: [],
        // 商品
        productList: [],
        // 优惠券数量
        publishCount: 0,
        // 使用门槛
        minPoint: 0.0,
        // 优惠券面值
        amount: 0.0
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请输入优惠券面值', trigger: 'blur' }
        ],
        publishCount: [
          { required: true, message: '请输入优惠券数量', trigger: 'blur' }
        ],
        minPoint: [
          { required: true, message: '请输入优惠券使用门槛', trigger: 'blur' }
        ]
      },
      // 有效期
      timeRange: [],
      // 商品分类数据
      categoryOptions: [],
      // 是否打开选择商品弹出层
      openSelectProductDialog: false
    }
  },
  watch: {
    timeRange: {
      immediate: true,
      deep: true,
      handler: function(newVal) {
        if (newVal && newVal[0]) {
          this.form.startDate = newVal[0]
          this.form.endDate = newVal[1]
        } else {
          this.form.startDate = null
          this.form.endDate = null
        }
      }
    }
  },
  created() {
    this.getCouponList()
    queryAll().then((res) => {
      this.categoryOptions = this.handleTree(res.data, 'id')
    })
  },
  methods: {
    // 查询优惠券列表
    getCouponList() {
      this.loading = true
      listForPage(this.addDateRange(this.queryParams, this.dateRange)).then(
        (res) => {
          this.shopCouponList = res.data
          this.total = Number(res.total)
          this.loading = false
        }
      )
    },
    handleQuery() {
      this.getCouponList()
    },
    resetQuery() {
      this.resetForm('queryForm')
      this.dateRange = []
      this.getCouponList()
    },
    handleAdd() {
      this.title = '添加优惠券'
      this.reset()
      this.openAddDialog = true
    },
    handleViewDetail(row) {
      this.title = '查看' + row.name + '的优惠券'
      this.openAddDialog = true
      this.reset()
      findById(row.id).then(res => {
        this.form = res.data
        this.timeRange.push(this.form.startDate, this.form.endDate)
      })
    },
    handleDown(row) {
      this.$confirm(
        '是否确认下架名称为"' + row.name + '"的优惠券？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        down(row.id)
          .then((res) => {
            this.msgSuccess(res.msg)
            this.getCouponList()
          })
          .catch(() => {
            this.msgError('下架成功')
          })
      })
    },
    handleDelete(row) {
      this.$confirm(
        '是否确认删除名称为"' + row.name + '"的优惠券？',
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
            this.getCouponList()
          })
          .catch(() => {
            this.msgError('删除成功')
          })
      })
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getCouponList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getCouponList()
    },
    deleteProductCategory(id) {
      this.form.productCategoryList.splice(
        this.form.productCategoryList.findIndex((e) => e.id === id),
        1
      )
    },
    handleChange(value) {
      if (!value || !value[0]) {
        return
      }
      let name = ''
      this.categoryOptions.forEach((e) => {
        if (e.id === value[0]) {
          name += e.name
          // 获取子节点，根据第二个下标找到二级分类
          e.children.forEach((c1) => {
            if (c1.id === value[1]) {
              name += ' > ' + c1.name
              // 获取子节点，根据第三个下标找到三级分类
              c1.children.forEach((c2) => {
                if (c2.id === value[2]) {
                  name += ' > ' + c2.name
                  // 找到了
                  this.form.productCategoryList.push({
                    name: name,
                    id: c2.id
                  })
                  value = []
                  return
                }
              })
            }
          })
        }
      })
    },
    selectProduct() {
      this.openSelectProductDialog = true
    },
    setProductList(productList) {
      this.form.productList = productList
      this.openSelectProductDialog = false
    },
    cellStyle(row) {
      if (row.column.label === '商品库存' && row.row.stockNum <= 100) {
        return 'color: red'
      }
    },
    deleteProduct(id) {
      this.form.productList.splice(
        this.form.productList.findIndex((item) => item.id === id),
        1
      )
    },
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          save(this.form)
            .then((res) => {
              this.msgSuccess(res.msg)
              this.openAddDialog = false
              this.getCouponList()
            })
            .catch(() => {
              this.msgError('添加失败')
            })
        }
      })
    },
    cancel() {
      this.openAddDialog = false
    },
    reset() {
      this.form = {
        name: undefined,
        amount: 0.0,
        publishCount: 0,
        minPoint: 0.0,
        couponType: 0,
        productCategoryList: [],
        productList: []
      }
      this.timeRange = []
      this.resetForm('form')
    }
  }
}
</script>

<style>
</style>

<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="商品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          clearable
          placeholder="请输入商品名称"
        />
      </el-form-item>
      <el-form-item label="商品品牌">
        <el-select
          v-model="queryParams.brandId"
          filterable
          remote
          clearable
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="keyWorkLoading"
        >
          <el-option
            v-for="item in brandOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否上架" prop="upStatus">
        <el-select
          v-model="queryParams.upStatus"
          clearable
          placeholder="请选择"
        >
          <el-option label="是" :value="1" />
          <el-option label="否" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否新品" prop="newStatus">
        <el-select
          v-model="queryParams.newStatus"
          clearable
          placeholder="请选择"
        >
          <el-option label="是" :value="1" />
          <el-option label="否" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否推荐" prop="recommendStatus">
        <el-select
          v-model="queryParams.recommendStatus"
          clearable
          placeholder="请选择"
        >
          <el-option label="是" :value="1" />
          <el-option label="否" :value="0" />
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
      <el-button type="success" @click="handleSelect">选中</el-button>
    </el-form>

    <!-- 表格数据开始 -->
    <el-table
      ref="selectTable"
      v-loading="loading"
      border
      :data="productList"
      :cell-style="cellStyle"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商品名称" prop="productName" align="center" />
      <el-table-column
        label="价格(元)"
        prop="price"
        align="center"
        width="100"
      />
      <el-table-column label="销量" prop="saleNum" align="center" width="100" />
      <el-table-column
        label="库存"
        prop="stockNum"
        align="center"
        width="100"
      />
      <el-table-column
        label="品牌"
        prop="brandName"
        align="center"
        width="120"
      />
      <el-table-column
        label="分类"
        prop="categoryName"
        align="center"
        width="120"
      />
      <el-table-column label="标签" align="center" width="150">
        <template slot-scope="scope">
          <div class="switch-group">
            <div class="switch-item">
              是否上架：
              <el-switch
                v-model="scope.row.upStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
                disabled
              />
            </div>
            <div class="switch-item">
              是否新品：
              <el-switch
                v-model="scope.row.newStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
                disabled
              />
            </div>
            <div class="switch-item">
              是否推荐：
              <el-switch
                v-model="scope.row.recommendStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
                disabled
              />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
        align="center"
        width="160"
      />
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
  </div>
</template>

<script>
import { queryForPage } from '@/api/product/product'
import { queryBrandByKeyWord } from '@/api/base/brand'

export default {
  props: {
    defaultSelect: {
      type: Array,
      default: null
    }
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
      // 商品品牌数据
      brandOptions: [],
      // 日期范围
      dateRange: [],
      // 商品数据
      productList: [],
      // 数据总条数
      total: 0,
      // 远程搜索遮罩层
      keyWorkLoading: false,
      // 当前选中数据
      currentSelectVal: []
    }
  },
  watch: {
    defaultSelect: {
      immediate: true,
      handler: function(newVal, oldVal) {
        this.setCurrentSelect()
      }
    }
  },
  created() {
    this.getProductList()
  },
  methods: {
    // 查询表格数据
    getProductList() {
      this.loading = true
      queryForPage(this.addDateRange(this.queryParams, this.dateRange)).then(
        (res) => {
          this.productList = res.data
          this.total = Number(res.total)
          this.setCurrentSelect()
          this.loading = false
        }
      )
    },
    // 回显
    setCurrentSelect() {
      this.$nextTick(() => {
        this.$refs.selectTable.clearSelection()
        if (this.defaultSelect && this.defaultSelect[0]) {
          this.defaultSelect.forEach((e) => {
            const index = this.productList.findIndex(item => e.id === item.id)
            this.$refs.selectTable.toggleRowSelection(this.productList[index], true)
          })
        }
      })
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getProductList()
    },
    resetQuery() {
      this.resetForm('queryForm')
      this.dateRange = []
      this.brandOptions = []
      this.queryParams.brandId = ''
      this.handleQuery()
    },
    cellStyle(row) {
      if (row.column.label === '销量' && row.row.saleNum >= 500) {
        return 'color: red'
      }
    },
    remoteMethod(value) {
      if (value !== '') {
        this.keyWorkLoading = true
        queryBrandByKeyWord(value)
          .then((res) => {
            this.brandOptions = res.data
            this.keyWorkLoading = false
          })
          .catch(() => {
            this.msgError('查询商品品牌失败')
            this.keyWorkLoading = false
          })
      } else {
        this.brandOptions = []
      }
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getProductList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getProductList()
    },
    handleSelectionChange(val) {
      this.currentSelectVal = val
    },
    handleSelect() {
      this.$emit('selectSubmit', this.currentSelectVal)
    }
  }
}
</script>

<style>
.el-button--success {
  color: #ffffff;
  background-color: #13ce66;
  border-color: #13ce66;
  float: right;
}
</style>

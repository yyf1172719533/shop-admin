<template>
  <div class="app-container">
    <!-- 表格数据开始 -->
    <el-table
      ref="productTable"
      v-loading="loading"
      border
      :data="productDataList"
      @selection-change="handleSelectionChange"
    >
      >
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column label="编号" prop="id" align="center" width="150" />
      <el-table-column label="商品名称" prop="productName" align="center" />
      <el-table-column
        label="商品价格(元)"
        prop="price"
        align="center"
        width="150"
      />
      <el-table-column
        label="商品库存"
        prop="stockNum"
        align="center"
        width="120"
      />
      <el-table-column
        label="商品品牌"
        prop="brandName"
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
    <div style="text-align: center; margin-top: 20px">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="cancel()">取 消</el-button>
      </span>
    </div>
  </div>
</template>

<script>
import { queryForPage } from '@/api/product/product'

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
      // 商品数据
      productDataList: [],
      // 数据总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 选中的数据
      multipleSelection: []
    }
  },
  watch: {
    defaultSelect: {
      immediate: true,
      handler(newVal, oldVal) {
        this.setCurrentSelect()
      }
    }
  },
  created() {
    this.getProductList()
  },
  methods: {
    // 查询套装总数
    getProductList() {
      this.loading = true
      queryForPage(this.queryParams).then((res) => {
        this.productDataList = res.data
        this.total = Number(res.total)
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getProductList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getProductList()
    },
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },
    handleSubmit() {
      this.$emit('selected', this.multipleSelection)
    },
    cancel() {
      this.$refs.productTable.clearSelection()
    },
    setCurrentSelect() {
      this.$nextTick(() => {
        this.$refs.productTable.clearSelection()
        if (this.defaultSelect && this.defaultSelect[0]) {
          this.defaultSelect.forEach((e) => {
            const index = this.productDataList.findIndex(
              (item) => e.id === item.id
            )
            this.$refs.productTable.toggleRowSelection(
              this.productDataList[index],
              true
            )
          })
        }
      })
    }
  }
}
</script>

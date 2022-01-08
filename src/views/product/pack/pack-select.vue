<template>
  <div class="app-container">
    <!-- 表格数据开始 -->
    <el-table
      ref="packTable"
      v-loading="loading"
      border
      :data="packDataList"
      highlight-current-row
      @current-change="currentChange"
    >
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
import { listForPage } from '@/api/product/pack'

export default {
  props: {
    defaultSelect: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 套装数据
      packDataList: [],
      // 数据总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 当前选择行
      currentRow: null
    }
  },
  created() {
    this.getProductPackList()
  },
  methods: {
    // 查询套装总数
    getProductPackList() {
      this.loading = true
      listForPage(this.queryParams).then((res) => {
        this.packDataList = res.data
        this.total = Number(res.total)
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getProductPackList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getProductPackList()
    },
    currentChange(val) {
      this.currentRow = val
    },
    handleSubmit() {
      this.$emit('selected', this.currentRow)
    },
    cancel(row) {
      this.$refs.packTable.setCurrentRow(row)
    }
  }
}
</script>

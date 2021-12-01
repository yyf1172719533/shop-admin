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
      <el-form-item label="创建人" prop="createBy">
        <el-input
          v-model="queryParams.createBy"
          clearable
          placeholder="请输入创建人"
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
    <el-table
      v-loading="loading"
      border
      :data="productList"
      :cell-style="cellStyle"
    >
      <el-table-column label="编号" prop="id" align="center" width="180" />
      <el-table-column label="商品名称" prop="productName" align="center" />
      <el-table-column label="副标题" prop="subTitle" align="center" />
      <el-table-column
        label="图片"
        prop="productPicture"
        align="center"
        width="150"
      >
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.productPicture"
            fit="fill"
            :preview-src-list="[scope.row.productPicture]"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="轮播图"
        prop="bannerPicture"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          <el-carousel height="150px" indicator-position="none">
            <el-carousel-item
              v-for="item in scope.row.albumPicList"
              :key="item"
            >
              <el-image :src="item" fit="fill" />
            </el-carousel-item>
          </el-carousel>
        </template>
      </el-table-column>
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
        label="库存预警值"
        prop="dangerStockNum"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag type="danger">{{ scope.row.stockNum }}</el-tag>
        </template>
      </el-table-column>
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
                @change="changeStatus1($event, scope.row)"
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
                @change="changeStatus2($event, scope.row)"
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
                @change="changeStatus3($event, scope.row)"
              />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort" align="center" width="100" />
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
        width="100"
      />
      <el-table-column
        label="更新时间"
        prop="updateTime"
        align="center"
        width="160"
      />
      <el-table-column
        label="更新人"
        prop="updateBy"
        align="center"
        width="100"
      />
      <el-table-column label="操作" align="center" fixed="right" width="150">
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
  </div>
</template>

<script>
import {
  queryForPage,
  updateStatusById,
  deleteById
} from '@/api/product/product'
import { queryBrandByKeyWord } from '@/api/base/brand'

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
      // 商品品牌数据
      brandOptions: [],
      // 日期范围
      dateRange: [],
      // 商品数据
      productList: [],
      // 数据总条数
      total: 0,
      // 远程搜索遮罩层
      keyWorkLoading: false
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
          this.loading = false
        }
      )
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
    handleAdd() {
      this.$router.push({ path: '/product/add' })
    },
    handleUpdate(row) {
      const id = row.id
      this.$router.push({ path: '/product/update/' + id })
    },
    handleDelete(row) {
      this.$confirm('是否删除此商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteById(row.id)
          .then((res) => {
            this.msgSuccess(res.msg)
            this.getProductList()
          })
          .catch(() => {
            this.msgError('删除失败')
          })
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
    changeStatus1(e, row) {
      if (e === 1) {
        // 上架
        row.upStatus = 0
        this.$confirm('此操作将上架该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateStatusById(row.id, 1, e)
            .then((res) => {
              this.msgSuccess('上架成功')
              this.getProductList()
            })
            .catch(() => {
              this.msgError('上架失败')
            })
        })
      } else {
        // 下架
        row.upStatus = 1
        this.$confirm('此操作将下架该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateStatusById(row.id, 1, e)
            .then((res) => {
              this.msgSuccess('下架成功')
              this.getProductList()
            })
            .catch(() => {
              this.msgError('下架失败')
            })
        })
      }
    },
    changeStatus2(e, row) {
      if (e === 1) {
        // 新品
        row.newStatus = 0
        this.$confirm('是否将该商品设为新品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateStatusById(row.id, 2, e)
            .then((res) => {
              this.msgSuccess('更改成功')
              this.getProductList()
            })
            .catch(() => {
              this.msgError('更改失败')
            })
        })
      } else {
        // 不是新品
        row.newStatus = 1
        this.$confirm('是否将该商品设为不是新品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateStatusById(row.id, 2, e)
            .then((res) => {
              this.msgSuccess('更改成功')
              this.getProductList()
            })
            .catch(() => {
              this.msgError('更改失败')
            })
        })
      }
    },
    changeStatus3(e, row) {
      if (e === 1) {
        // 推荐
        row.recommendStatus = 0
        this.$confirm('是否将该商品设为推荐状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateStatusById(row.id, 3, e)
            .then((res) => {
              this.msgSuccess('更改成功')
              this.getProductList()
            })
            .catch(() => {
              this.msgError('更改失败')
            })
        })
      } else {
        // 不推荐
        row.recommendStatus = 1
        this.$confirm('是否将该商品设为不推荐状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateStatusById(row.id, 3, e)
            .then((res) => {
              this.msgSuccess('更改成功')
              this.getProductList()
            })
            .catch(() => {
              this.msgError('更改失败')
            })
        })
      }
    }
  }
}
</script>

<style>
</style>

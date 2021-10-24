<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="请求方式" prop="requestMethod">
        <el-select
          v-model="queryParams.requestMethod"
          clearable
          placeholder="请选择请求方式"
        >
          <el-option label="GET" value="GET" />
          <el-option label="POST" value="POST" />
          <el-option label="PUT" value="PUT" />
          <el-option label="DELETE" value="DELETE" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          clearable
          placeholder="请选择状态"
        >
          <el-option label="成功" :value="1" />
          <el-option label="失败" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="请求时间">
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

    <!-- 表头工具栏开始 -->
    <el-row :gutter="10" style="margin-bottom: 8px">
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >批量删除</el-button>
      </el-col>
    </el-row>
    <!-- 表头工具栏结束 -->

    <!-- 数据表格开始 -->
    <el-table
      v-loading="loading"
      border
      :data="logData"
      :cell-style="cellStyle"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" prop="id" align="center" />
      <el-table-column label="请求路径" prop="requestUrl" align="center" />
      <el-table-column label="控制层" prop="requestController" align="center" />
      <el-table-column
        label="请求方式"
        prop="requestMethod"
        align="center"
        width="88"
      />
      <el-table-column
        label="请求IP"
        prop="requestIp"
        align="center"
        width="120"
      />
      <el-table-column label="状态" prop="status" align="center" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
            {{ scope.row.status === 1 ? "成功" : "失败" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="响应时间（毫秒）"
        prop="responseTime"
        align="center"
        width="120"
      />
      <el-table-column label="请求时间" prop="createTime" align="center" />
      <el-table-column
        label="操作人"
        prop="createBy"
        align="center"
        width="120"
      />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-view"
            size="mini"
            @click="handleView(scope.row)"
          >详情</el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除</el-button>
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

    <!-- 日志详情开始 -->
    <el-dialog title="日志详情" :visible.sync="open" center width="800px">
      <el-form v-loading="loading" label-width="68px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="请求路径">{{ form.requestUrl }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="控制层">{{
              form.requestController
            }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="请求方式">{{
              form.requestMethod
            }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="响应时间(毫秒)">{{
              form.responseTime
            }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="请求IP">{{ form.requestIp }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="请求时间">
              {{ form.createTime }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-tag :type="form.status === 1 ? 'success' : 'danger'">
                {{ form.status === 1 ? "成功" : "失败" }}
              </el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作人">
              {{ form.createBy }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="浏览器">
              {{ form.ua }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col v-if="form.message" :span="24">
            <el-form-item label="异常信息">
              {{ form.message }}
            </el-form-item>
          </el-col>
          <el-col v-else>
            <el-form-item label="异常信息"> 无 </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="json-container">
          <el-col :span="24">
            <el-form-item label="请求参数"><json-editor v-if="form.requestParams" v-model="form.requestParams" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="json-container">
          <el-col :span="24">
            <el-form-item label="响应结果"><json-editor v-if="form.result" v-model="form.result" /></el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 日志详情结束 -->
  </div>
</template>

<script>
import { listForPage, findById, deleteBatchByIds } from '@/api/system/log'
import JsonEditor from '@/components/JsonEditor'

export default {
  components: { JsonEditor },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        requestMethod: undefined,
        status: undefined,
        startTime: undefined,
        endTime: undefined
      },
      // 日期范围
      dateRange: [],
      // 日志信息
      logData: [],
      // 数据总数
      total: 0,
      // 选中日志ID
      idList: [],
      // 是否打开日志详情弹出层
      open: false,
      // 日志对象
      form: {},
      // 选中多条
      multiple: true
    }
  },
  created() {
    this.getSysLogList()
  },
  methods: {
    // 查询日志信息
    getSysLogList() {
      this.loading = true
      listForPage(this.addDateRange(this.queryParams, this.dateRange)).then(
        (res) => {
          this.logData = res.data
          this.total = Number(res.total)
          this.loading = false
        }
      )
    },
    cellStyle(row) {
      if (
        row.column.label === '响应时间（毫秒）' &&
        row.row.responseTime >= 200
      ) {
        return 'color: red'
      }
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getSysLogList()
    },
    resetQuery() {
      this.resetForm('queryForm')
      this.dateRange = []
      this.handleQuery()
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getSysLogList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getSysLogList()
    },
    handleSelectionChange(selection) {
      this.idList = selection.map((item) => item.id)
      this.multiple = !selection.length
    },
    handleView(row) {
      this.open = true
      this.loading = true
      findById(row.id).then((res) => {
        this.form = res.data
        if (res.data.requestParams) {
          this.form.requestParams = JSON.parse(JSON.stringify(res.data.requestParams))
        }
        if (res.data.result) {
          this.form.result = JSON.parse(res.data.result)
        }
        this.loading = false
      })
    },
    handleDelete(row) {
      const ids = row.id || this.idList
      this.$confirm('是否确定删除选中的日志记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBatchByIds(ids)
        .then((res) => {
          this.msgSuccess('删除成功')
          this.handleQuery()
        })
        .catch(() => {
          this.msgError('删除失败')
          this.handleQuery()
        })
      })
    }
  }
}
</script>

<style>
.header-image {
  margin: auto;
  width: 100px;
  height: 100px;
}
.image-container {
  text-align: center;
}
.CodeMirror pre {
  line-height: 16px !important;
}
.json-editor {
  min-height: 200px;
  max-height: 500px;
  overflow-y: scroll;
}
</style>

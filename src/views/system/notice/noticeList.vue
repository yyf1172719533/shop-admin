<template>
  <div class="app-container">
    <!-- 搜索条件开始 -->
    <el-form ref="queryForm" :inline="true" :model="queryParams">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择通告状态"
          clearable
        >
          <el-option label="启用" value="1" />
          <el-option label="禁用" value="0" />
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
    <!-- 搜索条件结束 -->

    <!-- 表头按钮开始 -->
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
    <!-- 表头按钮结束 -->

    <!-- 表格数据开始 -->
    <el-table v-loading="loading" border :data="noticeDataList">
      <el-table-column label="编号" prop="id" align="center" />
      <el-table-column label="标题" prop="title" align="center" />
      <el-table-column label="排序" prop="sorted" align="center" />
      <el-table-column label="创建人" prop="createBy" align="center" />
      <el-table-column label="创建时间" prop="createTime" align="center" />
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="changeStatus($event, scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-view"
            size="mini"
            @click="handleView(scope.row)"
          >查看</el-button>
          <el-button
            type="text"
            icon="el-icon-edit"
            size="mini"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            size="mini"
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

    <!-- 添加或修改弹出层开始 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500"
      center
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="标题" prop="title">
              <el-input
                v-model="form.title"
                placeholder="请输入通告标题"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="排序">
              <el-input-number
                v-model="form.sorted"
                controls-position="right"
                :min="0"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="内容">
            <markdown-editor
              ref="markdownEditor"
              v-model="form.content"
              language="zh_CN"
              height="500px"
            />
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 添加或修改弹出层结束 -->

    <!-- 通告详情弹出层开始 -->
    <el-dialog
      title="通告详情"
      :visible.sync="noticeDetailOpen"
      width="60%"
      append-to-body
    >
      <el-form v-loading="loading" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="标题">
              {{ form.title }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="排序值">
              {{ form.sorted }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建人">
              {{ form.createBy }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              {{ form.createTime }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="内容">
            <span v-html="form.content" />
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 通告详情弹出层结束 -->
  </div>
</template>

<script>
import {
  listForPage,
  save,
  update,
  findById,
  deleteById,
  updateStatus
} from '@/api/system/notice'
import MarkdownEditor from '@/components/MarkdownEditor'

export default {
  components: { MarkdownEditor },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        status: undefined,
        startTime: undefined,
        endTime: undefined
      },
      // 日期范围
      dateRange: [],
      // 表格数据
      noticeDataList: [],
      // 数据总条数
      total: 0,
      // 对话框标题
      title: '',
      // 是否打开对话框
      open: false,
      // 是否打开通告详情对话框
      noticeDetailOpen: false,
      // form表单
      form: {},
      // 表单校验
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getNoticeData()
  },
  methods: {
    // 查询通告列表
    getNoticeData() {
      this.loading = true
      listForPage(this.addDateRange(this.queryParams, this.dateRange)).then(
        (res) => {
          this.noticeDataList = res.data
          this.total = Number(res.total)
          this.loading = false
        }
      )
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getNoticeData()
    },
    resetQuery() {
      this.resetForm('queryForm')
      this.dateRange = []
      this.handleQuery()
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getNoticeData()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getNoticeData()
    },
    handleAdd() {
      this.reset()
      this.title = '添加通告'
      this.open = true
    },
    handleView(row) {
      this.reset()
      this.noticeDetailOpen = true
      this.loading = true
      findById(row.id).then((res) => {
        this.form = res.data
        this.loading = false
      })
    },
    handleUpdate(row) {
      this.reset()
      this.title = '修改通告'
      this.open = true
      this.loading = true
      findById(row.id).then((res) => {
        this.form = res.data
        if (this.form.content) {
          this.$refs.markdownEditor.setHtml(this.form.content)
        }
        this.loading = false
      })
    },
    handleDelete(row) {
      this.$confirm('是否删除此通告?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteById(row.id)
          .then((res) => {
            this.msgSuccess(res.msg)
            this.getUserList()
          })
          .catch(() => {
            this.msgError('删除失败')
          })
      })
    },
    changeStatus(e, row) {
      if (e === 0) {
        row.status = 1
        this.$confirm('此操作将禁用此通告, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateStatus(row.id, e)
            .then((res) => {
              this.msgSuccess('禁用成功')
              this.getNoticeData()
            })
            .catch(() => {
              this.msgError('禁用失败')
            })
        })
      } else {
        row.status = 0
        this.$confirm('此操作将启用此通告, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateStatus(row.id, e)
            .then((res) => {
              this.msgSuccess('启用成功')
              this.getNoticeData()
            })
            .catch(() => {
              this.msgError('启用失败')
            })
        })
      }
    },
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid && this.form.content) {
          this.form.content = this.$refs.markdownEditor.getHtml()
          this.loading = true
          if (this.form.id === undefined) {
            // 添加
            save(this.form)
              .then((res) => {
                this.msgSuccess(res.msg)
                this.getNoticeData()
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
                this.getNoticeData()
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
        title: undefined,
        sorted: 0,
        content: undefined
      }
      this.resetForm('form')
    }
  }
}
</script>

<style>
</style>

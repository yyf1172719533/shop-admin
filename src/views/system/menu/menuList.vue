<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          v-model="queryParams.menuName"
          clearable
          placeholder="请输入菜单名称"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          clearable
          placeholder="请选择菜单状态"
        >
          <el-option label="正常" :value="1" />
          <el-option label="停用" :value="0" />
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
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
        >展开/折叠</el-button>
      </el-col>
    </el-row>
    <!-- 表格按钮结束 -->

    <!-- 表格数据开始 -->
    <el-table
      v-if="refreshTable"
      v-loading="loading"
      border
      :data="menuList"
      :default-expand-all="isExpandAll"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="菜单名称" prop="menuName" align="left" />
      <el-table-column label="图标" prop="icon" align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.icon && scope.row.icon.indexOf('el-icon') >= 0" :class="scope.row.icon" />
          <svg-icon v-else-if="scope.row.icon" :icon-class="scope.row.icon" class-name="disabled" />
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="orderNum" align="center" />
      <el-table-column label="权限标识" prop="permission" align="center" />
      <el-table-column label="组件路径" prop="componentUrl" align="center" />
      <el-table-column label="菜单类型" prop="menuType" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="
              scope.row.menuType === '1'
                ? 'primary'
                : scope.row.menuType === '3'
                  ? 'danger'
                  : 'success'
            "
          >
            {{
              scope.row.menuType === "1"
                ? "目录"
                : scope.row.menuType === "3"
                  ? "按钮"
                  : "菜单"
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === '0' ? 'danger' : 'primary'">
            {{ scope.row.status === "0" ? "停用" : "正常" }}
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
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
          >新增</el-button>
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

    <!-- 添加或修改菜单对话框开始 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="680px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="请选择上级菜单"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="1">目录</el-radio>
                <el-radio label="2">菜单</el-radio>
                <el-radio label="3">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单图标" prop="icon">
              <el-popover
                placement="bottom-start"
                width="560"
                trigger="click"
                @show="$refs['selectIcon'].reset()"
              >
                <SelectIcon ref="selectIcon" @selected="selected" />
                <el-input
                  slot="reference"
                  v-model="form.icon"
                  clearable
                  placeholder="请选择菜单图标"
                >
                  <i
                    v-if="
                      form.icon &&
                        form.icon.indexOf('el-icon') >= 0
                    "
                    slot="prefix"
                    :class="form.icon"
                    style="height: 32px; width: 16px"
                  />
                  <svg-icon
                    v-else-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px; width: 16px"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input
                v-model="form.menuName"
                placeholder="请输入菜单名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示顺序" prop="orderNum">
              <el-input-number
                v-model="form.orderNum"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType !== '3'" prop="visible">
              <span slot="label">
                <el-tooltip
                  content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                显示状态
              </span>
              <el-radio-group v-model="form.visible">
                <el-radio label="1">显示</el-radio>
                <el-radio label="0">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType !== '3'" prop="routerPath">
              <span slot="label">
                <el-tooltip
                  content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                路由地址
              </span>
              <el-input
                v-model="form.routerPath"
                placeholder="请输入路由地址"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType === '2'" prop="componentUrl">
              <span slot="label">
                <el-tooltip
                  content="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                组件路径
              </span>
              <el-input
                v-model="form.componentUrl"
                placeholder="请输入组件路径"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType !== '1'" prop="permission">
              <span slot="label">
                <el-tooltip
                  content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                权限标识
              </span>
              <el-input
                v-model="form.permission"
                placeholder="请输入权限标识"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType !== '3'" prop="status">
              <span slot="label">
                <el-tooltip
                  content="选择停用则路由将不会出现在侧边栏，也不能被访问"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                菜单状态
              </span>
              <el-radio-group v-model="form.status">
                <el-radio label="1">正常</el-radio>
                <el-radio label="0">停用</el-radio>
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
    <!-- 添加或修改菜单对话框结束 -->
  </div>
</template>

<script>
import { list, save, update, findById, deleteById } from '@/api/system/menu'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import SelectIcon from '@/components/SelectIcon'

export default {
  components: {
    Treeselect,
    SelectIcon
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 查询参数
      queryParams: {},
      // 表格菜单数据
      menuList: [],
      // 菜单选项
      menuOptions: [],
      // 是否展开所有菜单 默认全部折叠
      isExpandAll: false,
      // 对话框标题
      title: '',
      // 是否打开对话框
      open: false,
      // 是否重新渲染表格数据
      refreshTable: true,
      // 表单对象
      form: {},
      // 表单校验
      rules: {
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '菜单显示顺序不能为空', trigger: 'blur' }
        ],
        routerPath: [
          { required: true, message: '路由地址不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.queryAllMenu()
  },
  methods: {
    // 查询菜单列表
    queryAllMenu() {
      this.loading = true
      list(this.queryParams).then((res) => {
        this.menuList = this.handleTree(res.data, 'id')
        this.loading = false
      })
    },
    handleQuery() {
      this.queryAllMenu()
    },
    resetQuery() {
      this.resetForm('queryForm')
      this.queryAllMenu()
    },
    toggleExpandAll() {
      this.refreshTable = false
      this.isExpandAll = !this.isExpandAll
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.menuName,
        children: node.children
      }
    },
    getTreeSelectMenu() {
      list().then((res) => {
        this.menuOptions = []
        const menu = { id: 0, menuName: '主类目', children: [] }
        menu.children = this.handleTree(res.data, 'id')
        this.menuOptions.push(menu)
      })
    },
    // 选择图标
    selected(name) {
      this.form.icon = name
    },
    handleUpdate(row) {
      this.reset()
      this.getTreeSelectMenu()
      findById(row.id).then((res) => {
        this.form = res.data
        this.open = true
        this.title = '修改菜单'
      })
    },
    handleAdd(row) {
      this.reset()
      this.getTreeSelectMenu()
      if (row != null && row.id) {
        this.form.parentId = row.id
      } else {
        this.form.parentId = 0
      }
      this.title = '添加菜单'
      this.open = true
    },
    handleDelete(row) {
      this.$confirm(
        '是否确认删除名称为"' + row.menuName + '"的数据项？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deleteById(row.id).then((res) => {
          this.msgSuccess(res.msg)
          this.queryAllMenu()
        })
      })
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id === undefined) {
            // 添加
            save(this.form).then(res => {
              this.msgSuccess('添加成功')
              this.loading = false
              this.open = false
              this.queryAllMenu()
            }).catch(() => {
              this.msgError('添加失败')
              this.loading = false
              this.open = false
              this.queryAllMenu()
            })
          } else {
            // 修改
            update(this.form).then(res => {
              this.msgSuccess('修改成功')
              this.loading = false
              this.open = false
              this.queryAllMenu()
            }).catch(() => {
              this.msgError('修改失败')
              this.loading = false
              this.open = false
              this.queryAllMenu()
            })
          }
        }
      })
    },
    cancel() {
      this.open = false
      this.reset()
    },
    reset() {
      this.form = {
        id: undefined,
        parentId: 0,
        menuName: undefined,
        menuType: '1',
        icon: undefined,
        orderNum: 0,
        routerPath: undefined,
        visible: '1',
        componentUrl: undefined,
        permission: undefined,
        status: '1'
      }
      this.resetForm('form')
    }
  }
}
</script>

<style>
</style>

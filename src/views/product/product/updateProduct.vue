<template>
  <div class="app-container">
    <div class="product-info">
      <el-card shadow="never">
        <el-steps :active="activeStep" finish-status="success" align-center>
          <el-step title="商品信息" />
          <el-step title="商品营销" />
          <el-step title="商品详情" />
          <el-step title="商品关联" />
        </el-steps>

        <el-form
          ref="form"
          :model="form"
          label-width="100px"
          size="small"
          :rules="rules"
        >
          <div v-show="activeStep === 0" class="product-form">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="商品分类" prop="categoryId">
                  <el-cascader
                    v-model="form.categoryId"
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
                    @change="handleChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品品牌" prop="brandId">
                  <el-select
                    v-model="form.brandId"
                    placeholder="请选择商品品牌"
                    style="width: 100%"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in brandList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="商品名称" prop="productName">
                  <el-input
                    v-model="form.productName"
                    placeholder="请输入商品名称"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="商品副标题">
                  <el-input
                    v-model="form.subTitle"
                    placeholder="请输入商品副标题"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="商品库存" prop="stockNum">
                  <el-input-number
                    v-model="form.stockNum"
                    controls-position="right"
                    style="width: 100%"
                    :min="1"
                    placeholder="请输入商品库存"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="库存预警值" prop="dangerStockNum">
                  <el-input-number
                    v-model="form.dangerStockNum"
                    controls-position="right"
                    style="width: 100%"
                    :min="0"
                    placeholder="请输入库存预警值"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="商品排序">
                  <el-input-number
                    v-model="form.sort"
                    placeholder="请输入商品排序值"
                    style="width: 100%"
                    :min="0"
                    controls-position="right"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品规格">
                  <el-input
                    v-model="form.specification"
                    placeholder="请输入商品规格"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="商品描述">
                  <el-input
                    v-model="form.productDescription"
                    type="textarea"
                    :rows="5"
                    placeholder="请输入商品描述"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <div align="center">
              <el-button
                style="margin-top: 12px"
                type="primary"
                @click="activeStep++"
              >下一步，填写商品营销</el-button>
            </div>
          </div>
          <div v-show="activeStep === 1" class="product-form">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="商品价格" prop="price">
                  <el-input-number
                    v-model="form.price"
                    controls-position="right"
                    :min="0"
                    placeholder="请输入商品价格"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="是否上架">
                  <el-switch
                    v-model="form.upStatus"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="1"
                    :inactive-value="0"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否新品">
                  <el-switch
                    v-model="form.newStatus"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="1"
                    :inactive-value="0"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否推荐">
                  <el-switch
                    v-model="form.recommendStatus"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="1"
                    :inactive-value="0"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="商品积分">
                  <el-input-number
                    v-model="form.point"
                    controls-position="right"
                    placeholder="请输入商品积分"
                    :min="0"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="运费">
                  <el-input-number
                    v-model="form.transFee"
                    controls-position="right"
                    placeholder="请输入运费"
                    style="width: 100%"
                    :min="0"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <div align="center">
              <el-button
                style="margin-top: 12px"
                @click="activeStep--"
              >上一步，填写商品信息</el-button>
              <el-button
                style="margin-top: 12px"
                type="primary"
                @click="activeStep++"
              >下一步，填写商品详情</el-button>
            </div>
          </div>
          <div v-show="activeStep === 2" class="product-form">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="商品图片">
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadUrl"
                    :show-file-list="false"
                    :data="{ dir: 'product' }"
                    :headers="{ Authorization: token }"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>
                  <div class="product-text">
                    请上传商品封面图片，该图片用于列表页展示
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="轮播图">
                  <el-upload
                    :action="uploadUrl"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :data="{ dir: 'product' }"
                    :headers="{ Authorization: token }"
                    :file-list="albumPicList"
                    :on-success="handleBannerSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <i class="el-icon-plus" />
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog>
                  <div class="product-text">
                    请上传商品详情轮播图，如果不上传，默认采用上面的图片
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="商品详情">
                  <div class="product-text">
                    商品详情建议采用上传多图的方式。文字内容过多可能会影响加载效果
                  </div>
                  <tinymce ref="content" v-model="form.productDetail" :height="500" />
                </el-form-item>
              </el-col>
            </el-row>
            <div align="center">
              <el-button
                style="margin-top: 12px"
                @click="activeStep--"
              >上一步，填写商品营销</el-button>
              <el-button
                style="margin-top: 12px"
                type="primary"
                @click="activeStep++"
              >下一步，填写商品关联</el-button>
            </div>
          </div>
          <div v-show="activeStep === 3" class="product-form">
            <div align="center">
              <el-button
                style="margin-top: 12px"
                @click="activeStep--"
              >上一步，填写商品详情</el-button>
              <el-button
                style="margin-top: 12px"
                type="primary"
                @click="submitForm"
              >提交商品信息</el-button>
            </div>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Tinymce from '@/components/Tinymce'
import { queryAll } from '@/api/base/category'
import { queryBrandByCategoryId } from '@/api/base/brand'
import { update, findById } from '@/api/product/product'

export default {
  components: { Tinymce },
  data() {
    return {
      // 步骤条数
      activeStep: 0,
      // 表单对象
      form: {},
      // 表单校验
      rules: {
        categoryId: [
          {
            required: true,
            message: '请选择商品分类',
            trigger: ['change', 'blur']
          }
        ],
        brandId: [
          {
            required: true,
            message: '请选择商品品牌',
            trigger: ['change', 'blur']
          }
        ],
        productName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        stockNum: [
          { required: true, message: '请输入商品库存', trigger: 'blur' }
        ],
        dangerStockNum: [
          { required: true, message: '请输入商品库存预警值', trigger: 'blur' }
        ],
        price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }]
      },
      // 商品分类数据
      categoryOptions: [],
      // 品牌数据
      brandList: [],
      // 图片上传地址
      uploadUrl: process.env.VUE_APP_UPLOAD_API,
      // 图片地址
      imageUrl: '',
      // 是否打开查看轮播图对话框
      dialogVisible: false,
      // 轮播图图片地址
      dialogImageUrl: '',
      // 轮播图数据
      albumPicList: []
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  created() {
    queryAll().then((res) => {
      this.categoryOptions = this.handleTree(res.data, 'id')
    })
    const productId = this.$route.params.id
    findById(productId).then(res => {
      this.form = res.data
      if (res.data.productPicture) {
        this.imageUrl = res.data.productPicture
      }
      const bannerList = res.data.albumPicList
      if (bannerList && bannerList[0]) {
        bannerList.forEach(e => this.albumPicList.push({ url: e }))
      }
      this.$nextTick(() => {
        this.$refs.content.setContent(res.data.productDetail)
      })
      this.getBrandList()
    })
  },
  methods: {
    getBrandList() {
      queryBrandByCategoryId(this.form.categoryId).then((res) => {
        this.brandList = res.data
      })
    },
    handleChange(item) {
      if (!item || !item[0]) {
        this.brandList = []
        this.$set(this.form, 'categoryId', null)
        this.$set(this.form, 'brandId', null)
        return
      }
      const leafCategoryId = item[item.length - 1]
      this.$set(this.form, 'categoryId', leafCategoryId)
      this.getBrandList()
    },
    // 头像上传成功后的回调
    handleAvatarSuccess(res, file) {
      this.msgSuccess(res.msg)
      this.imageUrl = res.data
      this.form.productPicture = res.data
    },
    // 上传头像前的回调
    beforeAvatarUpload(file) {
      if (file.type.indexOf('image') === -1) {
        this.msgError('上传文件必须是图片格式')
        return false
      }
      const fileSize = file.size / 1024 / 1024
      if (fileSize > 10) {
        this.msgError('上传头像图片大小不能超过 10MB!')
        return false
      }
    },
    handleRemove(file, fileList) {
      if (file.status === 'ready') {
        return false
      }
      this.albumPicList.splice(
        this.albumPicList.findIndex((e) => e.uid === file.uid, 1)
      )
      this.msgSuccess('删除成功')
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleBannerSuccess(res, file) {
      this.msgSuccess(res.msg)
      this.albumPicList.push({
        uid: file.uid,
        url: res.data
      })
    },
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const albumPicList = []
          this.albumPicList.forEach((e) => albumPicList.push(e.url))
          this.form.albumPicList = albumPicList
          update(this.form)
            .then((res) => {
              this.msgSuccess(res.msg)
              this.$router.push({ path: '/product/list' })
            })
            .catch(() => {
              this.msgError('添加失败')
            })
        } else {
          this.$message({
            message: '请先将商品信息填写完整',
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.product-info {
  width: 880px;
  margin: auto;
  padding: 20px;
}
.product-form {
  margin-top: 50px;
}
.product-text {
  color: red;
  font-weight: bold;
}
</style>

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
  height: 200px;
  line-height: 200px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 200px;
  display: block;
}
</style>

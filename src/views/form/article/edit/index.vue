<template>
  <div class="app-container" >
    <el-form ref="form" :model="form" label-width="120px" v-loading="loading">
      <el-form-item label="操作" style="position: sticky;top: 0px;z-index: 1501;background-color: white">
        <el-button type="primary" @click="onSubmit">修改</el-button>
        <el-button @click="onCancel">返回</el-button>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.artInfoStatus" placeholder="当前状态">
          <template v-for="item in statusOption">
            <el-option :key="item.value" :label="item.label" :value="item.value" />
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="置顶">
        <el-switch
          v-model="form.artInfoIsTop"
          :active-value=1
          :inactive-value=0
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </el-form-item>
      <el-form-item label="封面(可选)">
        <el-upload
          class="img-uploader"
          action="123"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload">
          <div v-if="form.coverUrl">
            <img :src="form.coverUrl" class="avatar"/>
            <div style="position: absolute;left: 200px;bottom: 0;display: flex">
              <el-button type="info" circle icon="el-icon-zoom-in" @click.stop="coverShow"></el-button>
              <el-button type="danger" circle icon="el-icon-delete" @click.stop="coverDel"></el-button>
            </div>
          </div>
          <i v-else  class="el-icon-plus img-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="form.artInfoTitle" />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="form.articleSort.sortId" placeholder="选择一个分类">
          <template v-for="item in classifyData">
            <el-option :key="item.sortId" :label="item.sortName" :value="item.sortId" />
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间">
          <el-input v-model="form.artInfoCreatedTime" type="fixed-time"  style="width: 100%;" readonly />
      </el-form-item>
      <el-form-item label="修改时间">
      <el-input v-model="form.artInfoModifiedTime" type="fixed-time"  style="width: 100%;" readonly/>
      </el-form-item>
      <el-form-item label="文章">
        <mavon-editor ref="md" v-model="form.articleContent.artContentMd" @change='getContentHtml' @imgAdd="$imgAdd" @imgDel="$imgDel"/>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="imgShowDialogVisible">
      <img width="100%" :src="form.coverUrl" alt="">
    </el-dialog>
    <el-dialog :visible.sync="uploadVisible" :close-on-click-modal="false" :show-close="uploadShowClose" >
      <el-steps  :active="uploadStepActive" :process-status="processStatus" finish-status="success">
        <el-step title="上传图片"></el-step>
        <el-step title="上传文章"></el-step>
      </el-steps>
    </el-dialog>
  </div>
</template>

<script>
import { getArticleById, uptArticleById } from '@/api/article'
import { getClassifyList } from '@/api/classify'
import { addImage, delImage } from '@/api/util'

export default {
  data() {
    return {
      id: '',
      loading: true,
      // 封面图临时文件
      coverFile: '',
      // 查看大图是否显示
      imgShowDialogVisible: false,
      // 上传封面进度
      upCoverProgress: 0,
      // 是否展示上传窗口进度
      uploadVisible: false,
      // 步骤条是否可以点击关闭
      uploadShowClose: false,
      // 步骤条当前步骤激活序号
      uploadStepActive: 0,
      // 步骤条处理时的状态
      processStatus: 'process',
      form: {
        artInfoStatus: '',
        artInfoIsTop: 0,
        coverUrl: '',
        artInfoTitle: '',
        articleSort: '',
        artInfoCreatedTime: '',
        artInfoModifiedTime: '',
        articleContent: {
          artContentMd: '',
          artContent: ''
        }
      },
      classifyData: [],
      statusOption: [
        {
          label: '正常',
          value: 0
        },
        {
          label: '审核',
          value: 1
        },
        {
          label: '下架',
          value: 2
        }
      ]
    }
  },
  created() {
    this.id = this.$route.params.id
    this.fetchData()
  },
  methods: {
    // 初始化数据
    fetchData() {
      getArticleById(this.id).then(response => {
        this.form = response.data
        getClassifyList().then(response => {
          this.classifyData = response.data
          this.loading = false
        })
      })
    },
    // 修改文章按钮
    async onSubmit() {
      this.initProgress()
      this.uploadVisible = true
      try { // 第一步
        await this.upCoverFile()
        // 第二步
        await this.uptArticle()
        // 可以关闭对话框
        this.uploadShowClose = true
        this.$message({
          type: 'success',
          message: '修改文章成功'
        })
      } catch (e) {
        // 可以关闭对话框
        this.uploadShowClose = true
        this.processStatus = 'error'
        this.$message({
          type: 'error',
          message: '修改文章失败(' + e + ')'
        })
      }
    },
    onCancel() {
      this.$router.push({
        name: 'ArticleTable'
      })
    },
    getContentHtml(value, render) {
      this.form.articleContent.artContent = render
    },
    // 上传图片
    $imgAdd(pos, $file) {
      const that = this
      var formdata = new FormData()
      formdata.append('image', $file)
      addImage(formdata).then(res => {
        that.$refs['md'].$img2Url(pos, res.data.url)
      }).catch(res => {
        that.$refs['md'].$refs.toolbar_left.$imgDelByFilename($file._name)
      })
    },
    // 删除图片
    $imgDel($file) {
      const data = {
        fileUrl: $file[0]
      }
      delImage(data).then(res => {
        this.$message({
          type: 'info',
          message: '图片已删除'
        })
      })
    },
    // 图片转换成src
    convertSrc(file) {
      return window.URL.createObjectURL(file)
    },
    // 上传封面图片前
    beforeAvatarUpload(file) {
      this.coverFile = file
      this.form.coverUrl = this.convertSrc(file)
      return false
    },
    // 封面显示大图
    coverShow() {
      this.imgShowDialogVisible = true
    },
    // 删除封面临时文件
    coverDel() {
      this.coverFile = ''
      this.form.coverUrl = ''
    },
    // 上传封面
    upCoverFile() {
      return new Promise((resolve, reject) => {
        if (!this.coverFile) {
          this.uploadStepActive = 1
          return resolve('无封面')
        }
        const formdata = new FormData()
        formdata.append('image', this.coverFile)
        addImage(formdata, e => {
          const completeProgress = ((e.loaded / e.total * 100) | 0)
          this.upCoverProgress = completeProgress
        }).then(res => {
          this.form.coverUrl = res.data.url
          this.uploadStepActive = 1
          this.coverFile = ''
          return resolve('上传封面成功')
        }).catch(err => {
          return reject('上传封面失败')
        })
      })
    },
    // 修改文章
    uptArticle() {
      return new Promise((resolve, reject) => {
        uptArticleById(this.id, this.form).then(response => {
          this.uploadStepActive = 2
          return resolve('修改文章成功')
        }).catch(error => {
          return reject('修改文章失败')
        })
      })
    },
    // 初始化步骤条
    initProgress() {
      this.uploadShowClose = false
      this.finishStatus = 'finish'
      this.processStatus = 'process'
      this.uploadStepActive = 0
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
.img-uploader{
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  width: 180px;
  height: 90px;
}
.avatar{
  width: 180px;
  height: 90px;
}
.img-uploader-icon{
  font-size: 28px;
  color: #8c939d;
  width: 180px;
  height: 90px;
  line-height: 90px;
  text-align: center;
}
</style>


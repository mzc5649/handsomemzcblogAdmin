<template>
  <div class="app-container" >
    <el-form ref="form" :model="form" label-width="120px" v-loading="loading">
      <el-form-item label="封面(可选)">
          <el-upload
            class="img-uploader"
            action="123"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload">
            <div v-if="coverFile">
                <img :src="coverFile.src" class="avatar"/>
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
      <el-form-item label="文章">
        <mavon-editor ref="md" v-model="form.articleContent.artContentMd" @change='getContentHtml' @imgAdd="$imgAdd" @imgDel="$imgDel"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">返回</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="imgShowDialogVisible">
      <img width="100%" :src="coverFile.src" alt="">
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
import { addArticle } from '@/api/article'
import { getClassifyList } from '@/api/classify'
import { addImage, delImage } from '@/api/util'
export default {
  components: {
  },
  data() {
    return {
      loading: true,
      upCoverProgress: 0,
      // 封面图临时文件
      coverFile: '',
      // 查看大图是否显示
      imgShowDialogVisible: false,
      // 是否展示上传窗口进度
      uploadVisible: false,
      // 步骤条是否可以点击关闭
      uploadShowClose: false,
      // 步骤条当前步骤激活序号
      uploadStepActive: 0,
      // 步骤条处理时的状态
      processStatus: 'process',
      form: {
        coverUrl: '',
        artInfoTitle: '',
        articleSort: {
          sortId: null
        },
        articleContent: {
          artContentMd: '',
          artContent: ''
        }
      },
      classifyData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getClassifyList().then(response => {
        this.classifyData = response.data
        this.loading = false
      })
    },
    // 发布文章按钮
    async onSubmit() {
      this.initProgress()
      this.uploadVisible = true
      try {
        // 第一步 上传封面
        await this.upCoverFile()
        // 第二步 上传文章信息
        await this.upArticle()
        this.uploadShowClose = true
        this.$message({
          type: 'success',
          message: '发布文章成功'
        })
      } catch (error) {
        this.uploadShowClose = true
        this.processStatus = 'error'
        this.$message({
          type: 'error',
          message: '发布文章失败(' + e + ')'
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
      const formdata = new FormData()
      formdata.append('image', $file)
      addImage(formdata).then(res => {
        that.$refs['md'].$img2Url(pos, res.data)
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
      this.coverFile.src = this.convertSrc(file)
      return false
    },
    // 封面显示大图
    coverShow() {
      this.imgShowDialogVisible = true
    },
    // 删除封面临时文件
    coverDel() {
      this.coverFile = ''
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
          this.form.coverUrl = res.data
          this.uploadStepActive = 1
          return resolve()
        }).catch(err => {
          return reject('上传封面失败')
        })
      })
    },
    // 上传文章内容
    upArticle() {
      return new Promise((resolve, reject) => {
        addArticle(this.form).then(response => {
          this.uploadStepActive = 2
          resolve()
        }).catch(error => {
          return reject('上传文章失败')
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


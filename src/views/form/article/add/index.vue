<template>
  <div class="app-container">
    <el-form ref="form" v-loading="loading" :model="form" label-width="120px">
      <el-form-item label="媒体" style="position: sticky;top: 0px;z-index: 1501;background-color: white">
        <el-button  @click="openMediaStock">添加媒体</el-button>
      </el-form-item>
      <el-form-item label="封面(可选)">
        <div class="coverBox" @click="selectCover()">
          <div v-if="coverFile.src">
            <img :src="coverFile.src" class="avatar">
            <div style="position: absolute;left: 200px;bottom: 0;display: flex">
              <el-button type="info" circle icon="el-icon-zoom-in" @click.stop="coverShow" />
              <el-button type="danger" circle icon="el-icon-delete" @click.stop="coverDel" />
            </div>
          </div>
          <i v-else class="el-icon-plus img-uploader-icon" />
        </div>
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
        <mavon-editor ref="md" v-model="form.articleContent.artContentMd" @change="getContentHtml" @imgAdd="$imgAdd" @imgDel="$imgDel" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">返回</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="imgShowDialogVisible">
      <img width="100%" :src="coverFile.src" alt="">
    </el-dialog>
    <MediaStock :is-show="mediaStock.isShow" @closeMediaStock="closeMediaStock" @confirmMedia="confirmMedia" />
  </div>
</template>

<script>
import { addArticle } from '@/api/article'
import { getClassifyList } from '@/api/classify'
import { addImage, delImage } from '@/api/util'
import { Message } from 'element-ui'
import MediaStock from '@/components/MediaStock'
export default {
  components: {
    MediaStock
  },
  data() {
    return {
      loading: true,
      upCoverProgress: 0,
      // 封面图临时文件
      coverFile: {
        src: ''
      },
      // 查看大图是否显示
      imgShowDialogVisible: false,
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
      classifyData: [],
      mediaStock: {
        isShow: false,
        selectMediaMode: 1
      }
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
    onSubmit() {
      this.loading = true
      // 上传文章信息
      this.upArticle()
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
    // 图片转换成src（暂时不用）
    convertSrc(file) {
      return window.URL.createObjectURL(file)
    },
    // 封面显示大图
    coverShow() {
      this.imgShowDialogVisible = true
    },
    // 删除封面临时文件
    coverDel() {
      this.coverFile = ''
    },
    // 上传文章内容
    upArticle() {
      // 添加封面
      this.form.coverUrl = this.coverFile.src
      addArticle(this.form).then(response => {
        this.loading = false
        this.$message({
          type: 'success',
          message: '发布文章成功'
        })
      }).catch(e => {
        this.loading = false
      })
    },
    // 打开媒体库 用于将图片插入文章
    openMediaStock() {
      this.mediaStock.selectMediaMode = 1
      this.mediaStock.isShow = true
    },
    // 选择封面
    selectCover() {
      this.mediaStock.selectMediaMode = 2
      this.mediaStock.isShow = true
    },
    // 关闭媒体库
    closeMediaStock() {
      this.mediaStock.isShow = false
    },
    // 选择媒体后
    confirmMedia(media) {
      const md = '![' + media.mediaInfoTitle + '](' + media.mediaInfoUrl + ')'
      if (this.mediaStock.selectMediaMode === 1) {
        this.form.articleContent.artContentMd += md
      } else if (this.mediaStock.selectMediaMode === 2) {
        this.coverFile.src = media.mediaInfoUrl
      }
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
.coverBox{
  width: 180px;
  height: 90px;
  border: 1px dashed #d9d9d9;
  cursor: pointer;
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


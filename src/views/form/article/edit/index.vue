<template>
  <div class="app-container">
    <el-form ref="form" v-loading="loading" :model="form" label-width="120px">
      <el-form-item label="操作">
        <el-button type="primary" @click="onSubmit">修改</el-button>
        <el-button @click="onCancel">返回</el-button>
      </el-form-item>
      <el-form-item label="媒体"  style="position: sticky;top: 0px;z-index: 1501;background-color: white">
        <el-button @click="openMediaStock">添加媒体</el-button>
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
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
      <el-form-item label="封面(可选)">
        <div class="coverBox" @click="selectCover()">
          <div v-if="form.coverUrl">
            <img :src="form.coverUrl" class="avatar">
            <div style="position: absolute;left: 200px;bottom: 0;display: flex">
              <el-button type="info" circle icon="el-icon-zoom-in" @click.stop="coverShow" />
              <el-button type="danger" circle icon="el-icon-delete" @click.stop="coverDel" />
            </div>
          </div>
          <span v-else>
            <i  class="el-icon-plus img-uploader-icon" />
             <el-button @click.stop="renewCover" v-if="oldCoverUrl" size="small" type="primary" style="position: absolute;left: 200px;bottom: 0">还原</el-button>
          </span>
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
      <el-form-item label="发布时间">
        <el-input v-model="form.artInfoCreatedTime" type="fixed-time" style="width: 100%;" readonly />
      </el-form-item>
      <el-form-item label="修改时间">
        <el-input v-model="form.artInfoModifiedTime" type="fixed-time" style="width: 100%;" readonly />
      </el-form-item>
      <el-form-item label="文章">
        <mavon-editor ref="md" v-model="form.articleContent.artContentMd" @change="getContentHtml" @imgAdd="$imgAdd" @imgDel="$imgDel" />
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="imgShowDialogVisible">
      <img width="100%" :src="form.coverUrl" alt="">
    </el-dialog>
    <MediaStock :is-show="mediaStock.isShow" @closeMediaStock="closeMediaStock" @confirmMedia="confirmMedia"></MediaStock>
  </div>
</template>

<script>
import { getArticleById, uptArticleById } from '@/api/article'
import { getClassifyList } from '@/api/classify'
import { addImage, delImage } from '@/api/util'
import MediaStock from "@/components/MediaStock";

export default {
  components: { MediaStock },
  data() {
    return {
      id: '',
      loading: true,
      // 封面图临时文件
      coverFile: {
        src: ''
      },
      // 查看大图是否显示
      imgShowDialogVisible: false,
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
      ],
      mediaStock: {
        isShow: false,
        selectMediaMode: 1
      }
    }
  },
  created() {
    this.id = this.$route.params.id
    this.fetchData()
  },
  computed: {
    oldCoverUrl() {
      return this.$store.getters.oldCoverUrl
    }
  },
  methods: {
    // 初始化数据
    fetchData() {
      getArticleById(this.id).then(response => {
        this.form = response.data
        // 存储旧的封面
        this.$store.dispatch('article/saveEditOldCoverUrl', this.form.coverUrl)
        getClassifyList().then(response => {
          this.classifyData = response.data
          this.loading = false
        })
      })
    },
    // 修改文章按钮
    onSubmit() {
      this.loading = true
      this.uptArticle()
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
    // 图片转换成src(暂时不用)
    convertSrc(file) {
      return window.URL.createObjectURL(file)
    },
    // 封面显示大图
    coverShow() {
      this.imgShowDialogVisible = true
    },
    // 删除封面临时文件
    coverDel() {
      this.coverFile.src = ''
      this.form.coverUrl = ''
    },
    // 修改文章
    uptArticle() {
      uptArticleById(this.id, this.form).then(response => {
        this.loading = false
        this.$message({
          type: 'success',
          message: '修改文章成功'
        })
      }).catch(() => {
        this.loading = false
      })
    },
    // 打开媒体库
    openMediaStock() {
      this.mediaStock.selectMediaMode = 1
      this.mediaStock.isShow = true
    },
    // 关闭媒体库
    closeMediaStock() {
      this.mediaStock.isShow = false
    },
    // 从媒体库选择封面图片
    selectCover() {
      this.mediaStock.selectMediaMode = 2
      this.mediaStock.isShow = true
    },
    // 选择媒体后
    confirmMedia(media) {
      const md = '![' + media.mediaInfoTitle + '](' + media.mediaInfoUrl + ')'
      if (this.mediaStock.selectMediaMode === 1) {
        this.form.articleContent.artContentMd += md
      } else if (this.mediaStock.selectMediaMode === 2) {
        this.form.coverUrl = media.mediaInfoUrl
      }
    },
    // 还原为初始的封面
    renewCover() {
      this.form.coverUrl = this.$store.getters.oldCoverUrl
    }
  }
}
</script>

<style scoped>
  .coverBox{
    width: 180px;
    height: 90px;
    border: 1px dashed #d9d9d9;
    cursor: pointer;
  }
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


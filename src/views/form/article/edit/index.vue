<template>
  <div class="app-container" >
    <el-form ref="form" :model="form" label-width="120px" v-loading="loading">
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
        <mavon-editor v-model="form.articleContent.artContentMd" @change='getContentHtml' @imgAdd="$imgAdd" @imgDel="$imgDel"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">修改</el-button>
        <el-button @click="onCancel">返回</el-button>
      </el-form-item>
    </el-form>
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
      form: {
        artInfoTitle: '',
        articleSort: '',
        artInfoCreatedTime: '',
        artInfoModifiedTime: '',
        articleContent: {
          artContentMd: '',
          artContent: ''
        }
      },
      classifyData: []
    }
  },
  created() {
    this.id = this.$route.params.id
    this.fetchData()
  },
  methods: {
    fetchData() {
      getArticleById(this.id).then(response => {
        this.form = response.data
        getClassifyList().then(response => {
          this.classifyData = response.data
          this.loading = false
        })
      })
    },
    onSubmit() {
      this.loading = true
      uptArticleById(this.id, this.form).then(response => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.loading = false
      })
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
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>


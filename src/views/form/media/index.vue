<template>
  <div class="app-container">
    <el-alert
      type="warning"
      description="只能上传图片文件,最大上传文件5MB"
      show-icon>
    </el-alert>
    <div class="uploadMedia">
      <el-upload
        class="upload-demo"
        :on-change="handlerChange"
        :auto-upload="true"
        :show-file-list="false"
        :http-request="uploadFile"
        :before-upload="beforeUpload"
        drag
        action="">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </div>
    <template v-for="(item, index) in fileList">
      <div :key="index" style="margin-bottom: 1px">
        <el-alert
          show-icon
          effect="dark"
          :title="item.name"
          :type="item.type">
        </el-alert>
      </div>
    </template>

  </div>
</template>

<script>
import { addImage, delImage } from '@/api/util'
export default {
  name: 'Index',
  data() {
    return {
      fileList: []
    }
  },
  methods: {
    // 判断是否为图片类型
    isPic(suffix) {
      return [
        'png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff']
        .indexOf(suffix.toLowerCase()) !== -1
    },
    // 上传文件前
    beforeUpload(file) {
      const flag = this.isPic(file.name.substring(file.name.lastIndexOf('.') + 1))
      if (!flag) {
        this.$message({
          type: 'error',
          message: '请选择正确的文件!'
        })
        return false
      }
      if (file.size > 20 * 1024 * 1024) {
        this.$message({
          type: 'error',
          message: '单个文件不能超过20MB!'
        })
        return false
      }
      return true
    },
    // 上传文件
    uploadFile(param) {
      const file = param.file
      const formdata = new FormData()
      formdata.append('image', file)
      addImage(formdata, (e) => {
        console.log(parseInt((e.loaded / e.total) * 100))
      }).then(res => {
        const data = {
          name: file.name,
          type: 'success'
        }
        this.fileList.unshift(data)
      }).catch(() => {
        const data = {
          name: file.name,
          type: 'error'
        }
        this.fileList.unshift(data)
      })
    },
    handlerChange(file, fileList) {

    }
  }
}
</script>

<style scoped>
  .uploadMedia {
    display: flex;
    justify-content: center;
  }
</style>

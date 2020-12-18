<template>
  <div class="app-container" v-loading="loading">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="分类名称">
        <el-input v-model="form.classifyName" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">创建</el-button>
        <el-button @click="onCancel">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addClassiy } from '@/api/classify'
export default {
  data() {
    return {
      loading: false,
      form: {
        classifyName: ''
      }
    }
  },
  methods: {
    async onSubmit() {
      var reg = /^[^\s]+$/
      if (!reg.test(this.form.classifyName)) {
        this.$message({
          type: 'warning',
          message: '分类不能包含空格且不能为空'
        })
        return false
      }
      this.loading = true
      const data = {
        sortName: this.form.classifyName
      }
      addClassiy(data).then(res => {
        this.loading = false
        this.$message({
          type: 'success',
          message: '添加分类成功'
        })
        this.form.classifyName = ''
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    onCancel() {
      this.form.classifyName = ''
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>


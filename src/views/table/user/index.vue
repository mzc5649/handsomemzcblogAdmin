<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.uId}}
        </template>
      </el-table-column>
      <el-table-column label="头像" align="center" width="70">
        <template slot-scope="scope">
          <img :src="scope.row.uIcon" class="user-avatar">
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" >
        <template slot-scope="scope">
          {{ scope.row.uUsername }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态"  align="center">
        <template slot-scope="scope">
          <el-switch
            :active-value="0"
            :inactive-value="1"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeSwitch(scope.row)"
            v-model="scope.row.uState"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center"  label="注册时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.uRegTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"  label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next, sizes"
      :page-size="page.pageSize"
      :current-page="page.currentPage"
      :total="total"
      :page-sizes="[10, 20, 50, 100, 200]"
      @current-change="pageChange"
      @size-change="pageSizeChange"
    >
    </el-pagination>
    <el-drawer
      :key="999"
      title="我是标题"
      :visible.sync="drawer"
      size="50%"
      :with-header="false">
        <div style="padding-top: 50px">
          <el-form ref="uptForm" :model="uptForm" label-width="80px">
            <el-form-item label="ID">
              <el-input v-model="uptForm.uId" disabled></el-input>
            </el-form-item>
            <el-form-item label="Icon">
                <img :src="uptForm.uIcon" class="user-avatar">
            </el-form-item>
            <el-form-item label="UName">
              <el-input v-model="uptForm.uUsername" disabled></el-input>
            </el-form-item>
            <el-form-item label="Pwd">
              <el-input v-model="uptForm.uPwd" disabled></el-input>
            </el-form-item>
            <el-form-item label="NewPwd" v-show="isEdit">
              <el-input  v-model="uptForm.uNewPassword"></el-input>
            </el-form-item>
            <el-form-item label="Email">
              <el-input v-model="uptForm.uEmail" disabled></el-input>
            </el-form-item>
            <el-form-item>
              <el-button v-show="!isEdit" type="primary" @click="onUptUser">修改</el-button>
              <div v-show="isEdit">
                <el-button type="primary" @click="onUptUserConfirm" :loading="uptFormLoading">确认</el-button>
                <el-button  @click="onUptUserCancel">取消</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
    </el-drawer>
  </div>
</template>

<script>
import { getUserList, delUserById, uptUser } from '@/api/user'

export default {
  filters: {
  },
  data() {
    return {
      isEdit: false,
      drawer: false,
      uptForm: {},
      uptFormLoading: false,
      list: null,
      listLoading: true,
      tempData: {},
      page: {
        currentPage: 1,
        pageSize: 10
      },
      total: 0
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getUserList(this.page).then(response => {
        this.list = response.data.recordList
        this.total = response.data.recordCount
        this.listLoading = false
      })
    },
    handleEdit(index, row) {
      this.uptForm = row
      this.drawer = true
    },
    handleDelete(index, row) {
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUserById(row.uId).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.list.splice(index, 1)
          this.total -= 1
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    onUptUser() {
      this.isEdit = true
    },
    onUptUserConfirm() {
      this.uptForm.uPassword = this.uptForm.uNewPassword
      this.uptFormLoading = true
      uptUser(this.uptForm).then(response => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.uptFormLoading = false
        this.isEdit = false
      })
    },
    onUptUserCancel() {
      this.isEdit = false
    },
    changeSwitch(data) {
      uptUser(data).then(response => {
        this.$message({
          type: 'success',
          message: '切换状态成功!'
        })
        this.uptFormLoading = false
        this.isEdit = false
      }).catch(() => {
        data.uState = data.uState === 0 ? 1 : 0
      })
    },
    pageChange(index) {
      this.page.pageIndex = index
      this.fetchData()
    },
    // 每页数量改变
    pageSizeChange(index) {
      this.page.pageSize = index
      this.fetchData()
    }
  }
}
</script>
<style scoped>
  .user-avatar {
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }
</style>

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
      <el-table-column align="center" prop="ID" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.artInfoId }}
        </template>
      </el-table-column>
      <el-table-column label="Title" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.artInfoTitle }}
        </template>
      </el-table-column>
      <el-table-column label="Classify" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.articleSort?scope.row.articleSort.sortName : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.user?scope.row.user.uUsername:'' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="置顶">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.artInfoIsTop"
            @change="changeIsTop(scope.row.artInfoId,scope.row.artInfoIsTop,scope.row)"
            :active-value=1
            :inactive-value=0
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="scope.row.artInfoStatus | statusFilterType"
            effect="dark"
          >{{ scope.row.artInfoStatus | statusFilterText }}</el-tag>
          <el-tag
            size="mini"
            v-if="scope.row.artInfoIsTop === 1"
            style="margin-left: 10px">
            置顶
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="CreateTime">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.artInfoCreatedTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="ModifiedTime">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.artInfoModifiedTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Action">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleOpen(scope.row.artInfoId)">查看
          </el-button>
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            style="margin-top: 10px"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :page-size="page.pageNum"
      :current-page="page.pageIndex"
      :total="total"
      @current-change="pageChange">
    </el-pagination>
  </div>
</template>

<script>
import { getArticleList, delArticle, uptArticleIsTopById } from '@/api/article'

export default {
  filters: {
    statusFilterType(status) {
      const statusMap = {
        0: 'success',
        1: 'info',
        2: 'danger'
      }
      return statusMap[status]
    },
    statusFilterText(status) {
      const statusMap = {
        0: '正常',
        1: '审核',
        2: '下架'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
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
      getArticleList(this.page).then(response => {
        this.list = response.data.recordList
        this.total = response.data.recordCount
        this.listLoading = false
      })
    },
    /* 改变置顶状态 */
    changeIsTop(id, value, row) {
      // 改变状态
      uptArticleIsTopById(id).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
      }).catch(function() {
        // 恢复原状
        row.artInfoIsTop = value ? 0 : 1
      })
    },
    pageChange(index) {
      this.page.currentPage = index
      this.fetchData()
    },
    handleOpen(id) {
      window.open('https://handsomemzc.cn/#/blog/article/' + id, '_blank')
    },
    handleEdit(index, row) {
      this.$router.push(
        {
          name: 'EditArticle', params: {id: row.artInfoId}
        })
    },
    handleDelete(index, row) {
      this.$confirm('此操作将删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delArticle(row.artInfoId).then(response => {
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
    }
  }
}
</script>

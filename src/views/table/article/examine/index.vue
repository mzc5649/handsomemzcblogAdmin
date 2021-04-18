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
      <el-table-column label="标题" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.artInfoTitle }}
        </template>
      </el-table-column>
      <el-table-column label="分类" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.articleSort?scope.row.articleSort.sortName : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.user?scope.row.user.uUsername:'' }}
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
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.artInfoCreatedTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.artInfoModifiedTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
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
            @click="handleStatus(scope.$index, scope.row)">状态
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
      layout="total, prev, pager, next, sizes"
      :page-size="page.pageSize"
      :current-page="page.pageIndex"
      :total="total"
      :page-sizes="[10, 20, 50, 100, 200]"
      @current-change="pageChange"
      @size-change="pageSizeChange"
    >
    </el-pagination>
    <el-dialog title="修改状态" :visible.sync="statusVisible">
      <el-form :model="statusForm" label-width="50px">
        <el-form-item label="操作">
          <el-select v-model="statusForm.artInfoStatus">
            <template v-for="item in statusOption">
              <el-option :key="item.value" :label="item.label" :value="item.value" />
            </template>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="statusVisible = false">取 消</el-button>
        <el-button type="primary" :loading="statusFormLoading" @click="uptStatusSubmit(statusForm.artInfoId,statusForm.artInfoStatus)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listArticleOfExamine, delArticle, uptArticleStatusById } from '@/api/article'

export default {
  filters: {
    statusFilterType(status) {
      const statusMap = {
        0: 'success',
        1: 'danger',
        2: 'info'
      }
      return statusMap[status]
    },
    statusFilterText(status) {
      const statusMap = {
        0: '正常',
        1: '下架',
        2: '审核'
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
      total: 0,
      statusVisible: false,
      statusForm: {
      },
      statusFormLoading: false,
      statusOption: [
        {
          label: '正常',
          value: 0
        },
        {
          label: '禁用',
          value: 1
        },
        {
          label: '审核',
          value: 2
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      listArticleOfExamine(this.page).then(response => {
        this.list = response.data.recordList
        this.total = response.data.recordCount
        this.listLoading = false
      })
    },
    pageChange(index) {
      this.page.currentPage = index
      this.fetchData()
    },
    // 每页数量改变
    pageSizeChange(index) {
      this.page.pageSize = index
      this.fetchData()
    },
    handleOpen(id) {
      window.open('https://handsomemzc.cn/blog/article/' + id, '_blank')
    },
    handleEdit(index, row) {
      this.$router.push(
        {
          name: 'EditArticle', params: { id: row.artInfoId }
        })
    },
    // 修改状态
    handleStatus(index, row) {
      this.statusForm = row
      this.statusVisible = true
    },
    // 修改状态提交
    uptStatusSubmit(id, status) {
      this.statusFormLoading = true
      uptArticleStatusById(id, { status: status }).then(res => {
        this.statusFormLoading = false
        this.statusVisible = false
        this.fetchData()
        this.$message({
          type: 'success',
          message: res.msg || '修改成功!'
        })
      }).catch(() => {
        this.fetchData()
        this.statusFormLoading = false
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
          this.fetchData()
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

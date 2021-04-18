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
          {{ scope.row.artCmtId }}
        </template>
      </el-table-column>
      <el-table-column label="内容" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.artCmtContent }}
        </template>
      </el-table-column>
      <el-table-column label="文章id" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.artId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布者" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.user?scope.row.user.uUsername:'' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="scope.row.artCmtStatus | statusFilterType"
            effect="dark"
          >{{ scope.row.artCmtStatus | statusFilterText }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.artCmtCreatedTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.artCmtModifiedTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleOpen(scope.row.artId)"
          >查看
          </el-button>
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >状态
          </el-button>
          <el-button
            size="mini"
            type="danger"
            style="margin-top: 10px"
            @click="handleDelete(scope.$index, scope.row)"
          >删除
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
      <!--修改对话框-->
    </el-pagination>
    <el-dialog title="修改状态" :visible.sync="commentEditFormVisible">
      <el-form :model="commentEditForm" label-width="50px">
        <el-form-item label="内容">
          <el-input v-model="commentEditForm.artCmtContent" autosize type="textarea" readonly />
        </el-form-item>
        <el-form-item label="操作">
          <el-select v-model="commentEditForm.artCmtStatus">
            <template v-for="item in statusOption">
              <el-option :key="item.value" :label="item.label" :value="item.value" />
            </template>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="commentEditFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="editCommentLoading" @click="editCommentSubmit(commentEditForm.artCmtId,commentEditForm.artCmtStatus)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listArticleComment, uptArticleCommentStatus, delArticleCommentById } from '@/api/articleComment'

export default {
  filters: {
    statusFilterType(status) {
      const statusMap = {
        0: 'success',
        1: 'danger'
      }
      return statusMap[status]
    },
    statusFilterText(status) {
      const statusMap = {
        0: '正常',
        1: '禁用'
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
      commentEditFormVisible: false,
      commentEditForm: {
        artCmtId: '',
        artCmtContent: '',
        artCmtStatus: ''
      },
      editCommentLoading: false,
      statusOption: [
        {
          label: '正常',
          value: 0
        },
        {
          label: '禁用',
          value: 1
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
      listArticleComment(this.page).then(response => {
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
    // 每页数量改变
    pageSizeChange(index) {
      this.page.pageSize = index
      this.fetchData()
    },
    handleOpen(id) {
      window.open('https://handsomemzc.cn/blog/article/' + id, '_blank')
    },
    // 修改按钮
    handleEdit(index, row) {
      this.commentEditForm = row
      this.commentEditFormVisible = true
    },
    // 修改提交
    editCommentSubmit(id, status) {
      this.editCommentLoading = true
      uptArticleCommentStatus(id, { status: status }).then(res => {
        this.fetchData()
        this.editCommentLoading = false
        this.commentEditFormVisible = false
        this.$message({
          type: 'success',
          message: '修改成功'
        })
      }).catch(() => {
        this.fetchData()
        this.editCommentLoading = false
      })
    },
    handleDelete(index, row) {
      this.$confirm('此操作将删除该评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delArticleCommentById(row.artCmtId).then(response => {
          this.fetchData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.fetchData()
      })
    }
  }
}
</script>

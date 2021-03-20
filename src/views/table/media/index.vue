<template>
  <div class="app-container">
    <div v-loading="listLoading">
      <ul class="image-list">
        <li
          v-for="(item,index) in mediaList"
          :key="item.mediaInfoId"
        >
          <el-image
            class="image"
            :src="item.mediaInfoUrl"
            @click="selectMedia(index)"
            fit="cover"
            lazy
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </li>
      </ul>
    </div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :page-size="page.pageSize"
      :current-page="page.pageIndex"
      :total="total"
      @current-change="pageChange"
    />
    <MediaBox
      :media="mediaBox.media"
      :is-show="mediaBox.isShow"
      :index="mediaBox.index"
      @closeMediaBox="closeMediaBox"
      @changeMedia="changeMedia"
    />
  </div>
</template>

<script>
import { getMediaList } from '@/api/media'
import MediaBox from '@/layout/components/MediaBox'

export default {
  components: { MediaBox },
  filters: {

  },
  data() {
    return {
      mediaList: [],
      listLoading: true,
      page: {
        currentPage: 1,
        pageSize: 20
      },
      total: 0,
      mediaBox: {
        media: '',
        isShow: false,
        index: 0
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取数据
    fetchData() {
      this.listLoading = true
      getMediaList(this.page).then(response => {
        this.mediaList = response.data.recordList
        this.total = response.data.recordCount
        this.listLoading = false
      })
    },
    // 页数改变
    pageChange(index) {
      this.page.currentPage = index
      this.fetchData()
    },
    // 选择媒体查看
    selectMedia(index) {
      this.mediaBox.index = index
      this.mediaBox.media = this.mediaList[index]
      this.mediaBox.isShow = true
    },
    // 关闭媒体查看窗口
    closeMediaBox() {
      this.mediaBox.isShow = false
    },
    // 切换查看媒体
    changeMedia(index) {
      if (index < 0) {
        this.$message({
          type: 'warn',
          message: '前面再也没有啦!'
        })
        return
      }
      if (index > this.mediaList.length - 1) {
        this.$message({
          type: 'warn',
          message: '后面再也没有啦!'
        })
        return
      }
      this.mediaBox.index = index
      this.mediaBox.media = this.mediaList[index]
    }
  }
}
</script>
<style lang="scss">
  .image-list{
    padding: 0px;
    display: flex;
    flex-wrap: wrap;
    li{
      list-style: none;
      max-width: 150px;
      min-width: 150px;
      min-height: 150px;
      max-height: 150px;
      .image{
        padding: 8px;
        width: 100%;
        height: 100%;
        transition: 0.5s;
        cursor: pointer;
        .image-slot{
          width: 100%;
          height: 100%;
          display: flex;
          font-size: 20px;
          align-items: center;
          justify-content: center;
          background-color: gray;
        }
      }
      .image:hover{
        transform: scale(0.9);
      }
    }

  }
</style>

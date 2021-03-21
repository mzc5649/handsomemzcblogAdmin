<template >
  <div v-if="isShow">
    <div class="media-stock">
      <div class="media-header-edit">
        <button class="close" @click="closeMediaStock" ><i class="el-icon-close" /></button>
      </div>
      <div class="media-header">
        <h1>媒体库</h1>
      </div>
      <div class="media-content">
            <el-row style="height: 100%">
              <el-col :xs="24" :sm="16" style="height: 100%">
                <div class="media-view" >
                  <ul class="media-list" v-infinite-scroll="loadMore" :infinite-scroll-disabled="page.currentPage == page.pageTotal">
                    <li class="test test1 test2" v-for="(item,index) in mediaList" :key="item.mediaInfoId"  @click="selectMedia(index,$event)">
                      <el-image
                        class="image"
                        :src="item.mediaInfoUrl"
                        fit="cover"
                        lazy
                      >
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline" />
                        </div>
                      </el-image>
                      <button type="button" class="check">
                        <i class="el-icon-check"/>
                      </button>
                    </li>
                  </ul>
                </div>
              </el-col>
              <el-col :xs="24" :sm="8"  style="height: 100%">
                  <div class="media-info" >
                    <div v-show="media">
                    <div class="upload-time"><strong>上传于：</strong>{{media.createTime}}</div>
                    <div class="upload-uptime"><strong>更新于：</strong>{{media.updateTime}}</div>
                    <div class="upload-by" v-if="media.user"><strong>上传者：</strong>{{media.user.uUsername}}</div>
                    <div class="upload-to"><strong>上传至：</strong></div>
                    <div class="file-name"><strong>文件名：</strong>{{media.mediaInfoTitle}}</div>
                    <div class="file-type"><strong>文件类型：</strong>{{media.mediaInfoTypeDtl}}</div>
                    <div class="file-size"><strong>文件大小：</strong>{{media.mediaInfoSize}}</div>
                    <div class="file-url"><strong>文件URL：</strong>{{media.mediaInfoUrl}}</div>
                    <div class="media-comment"><strong>描述：</strong>{{media.mediaInfoComment}}</div>
                  </div>
                </div>

              </el-col>
            </el-row>
      </div>
      <div class="media-toolbar">
        <div class="media-toolbar-selection" v-show="media">
            <div class="media-toolbar-selection-info">
              <div class="count">
                已选择项目
              </div>
              <el-link type="danger" class="clean-section" @click="clearSelectedMedia">清空</el-link>
            </div>
            <ul>
              <li>
                <el-image
                  class="media-toolbar-selection-image"
                  :src="media.mediaInfoUrl"
                  fit="cover"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
              </li>
            </ul>
        </div>
        <div class="media-toolbar-primary">
          <el-button type="primary" :disabled="!media" @click="confirmMedia">插入至文章</el-button>
        </div>
      </div>
    </div>
    <div class="drawer-bg" @touchmove.prevent="">
    </div>
  </div>
</template>
<script>
import { getMediaList } from '@/api/media'
export default {
  name: 'MediaStock',
  props: ['isShow'],
  data() {
    return {
      mediaList: [],
      media: '',
      total: 0,
      page: {
        currentPage: 1,
        pageTotal: 0,
        pageSize: 50
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取数据
    fetchData() {
      getMediaList(this.page).then(response => {
        this.mediaList = this.mediaList.concat(response.data.recordList)
        this.total = response.data.recordCount
        this.page.pageTotal = response.data.pageTotal
      })
    },
    // 加载更多
    loadMore() {
      if (this.page.currentPage + 1 > this.page.pageTotal) {
        return
      }
      this.page.currentPage = this.page.currentPage + 1
      this.fetchData()
    },
    // 关闭媒体库窗口
    closeMediaStock() {
      this.clearSelectedMedia()
      this.$emit('closeMediaStock')
    },
    // 选择媒体
    selectMedia(index, e) {
      let flag = false
      this.clearSelectedMedia()
      this.media = this.mediaList[index]
      e.currentTarget.classList.forEach(function(c) {
        if (c === 'media-selected-active') {
          flag = true
          return
        }
      })
      flag === true ? e.currentTarget.classList.remove('media-selected-active') : e.currentTarget.classList.add('media-selected-active')
    },
    // 插入媒体
    confirmMedia() {
      const data = this.media
      this.clearSelectedMedia()
      this.$emit('confirmMedia', data)
      this.closeMediaStock()
    },
    // 清空已选择的媒体
    clearSelectedMedia() {
      this.media = ''
      const arrays = document.getElementsByClassName('media-selected-active')
      Array.prototype.forEach.call(arrays, function(e) {
        e.classList.remove('media-selected-active')
      })
    }
  }
}
</script>
<style>
  .media-selected-active{
    box-shadow: inset 0 0 0 3px #fff, inset 0 0 0 7px #0073aa;
  }
</style>
<style scoped lang="scss">
  .drawer-bg{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,.5);
    backdrop-filter: blur(5px);
    z-index: 1501;
  }
.media-stock{
  position: fixed;
  top: 30px;
  left: 30px;
  right: 30px;
  bottom: 30px;
  background-color: white;
  z-index: 1502;
  .media-header{
    position: absolute;
    height: 50px;
    left: 0px;
    right: 51px;
    background-color: #fcfcfc;
    h1{
      margin: 0;
      font-size: 22px;
      line-height: 50px;
      padding: 0 10px;
    }
  }
  .media-header-edit{
    .close{
      position: absolute;
      padding: 0;
      margin: 0;
      width: 50px;
      height: 50px;
      box-sizing: content-box;
      right: 0;
      background-color: #fcfcfc;
      cursor: pointer;
      border-radius: 3px;
      border: 0;
      border-left: 1px solid #ddd;
      &:hover{
        background-color: #DDDDDD;
      }
    }
  }
  .media-content{
    position: absolute;
    top: 50px;
    left: 0px;
    right: 0px;
    bottom: 60px;
    .media-view{
      height: 100%;
      .media-list{
        margin: 0;
        bottom: 60px;
        padding: 2px 8px;
        display: flex;
        height: 100%;
        flex-wrap: wrap;
        overflow: auto;
        justify-content: flex-start;
        li{
          position: relative;
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
          .check{
            display: none;
          }
        }
        .media-selected-active{
          .check{
            width: 24px;
            height: 24px;
            border: 0;
            padding: 0;
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            top: 0;
            right: 0;
            color: white;
            background-color: #0073aa;
            box-shadow: 0 0 0 1px #fff, 0 0 0 2px #0073aa;
            cursor: pointer;
          }
        }
      }

    }
    .media-info{
      width: 100%;
      height: 100%;
      padding: 12px 16px;
      background-color: #f3f3f3;
      min-height: 100%;
      font-size: 12px;
      color: rgb(102,102,102);
      box-sizing: border-box;
      overflow-y: auto;
      word-break: break-all;
      line-height: 18px;
    }
  }
  .media-toolbar{
    padding: 0 16px;
    position: absolute;
    height: 60px;
    bottom: 0px;
    width: 100%;
    background-color: #fcfcfc;
    border-top: 1px solid #ddd;
    .media-toolbar-selection{
      .media-toolbar-selection-info{
        float: left;
        margin-right: 10px;
        .count{
          font-size: 14px;
          font-weight: 600;
          padding-top: 12px;
        }
        .clean-section{
          font-size: 12px;
        }
      }
      ul{
        list-style: none;
        margin: 0;
        padding: 0;
        height: 48px;
        margin: 6px;
        float: left;
        li{
         height: 48px;
          .media-toolbar-selection-image{
            width: 48px;
            height: 48px;
          }
        }
      }
    }
    .media-toolbar-primary{
      float: right;
      line-height: 60px;
    }
  }
}
  @media screen and (max-height: 400px) {
    .media-stock{
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
  @media screen and (max-width: 640px) {
    .media-stock{
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
</style>

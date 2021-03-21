<template>
  <div v-show="isShow" >
  <div class="media-box" >
      <div class="media-header-edit">
      <button class="left" @click="selectLastMedia"><i class="el-icon-arrow-left"/></button>
      <button class="right" @click="selectNextMedia"><i class="el-icon-arrow-right"/></button>
      <button class="close" @click="closeMediaBox" ><i class="el-icon-close" /></button>
      </div>
      <div class="media-header">
        <h1>附件详情</h1>
      </div>
    <div class="media-content" >
          <el-row style="height: 100%">
            <el-col :xs="24" :sm="16" style="height: 100%">
              <div class="media-view">
                <img :src="media.mediaInfoUrl"/>
              </div>
            </el-col>
            <el-col :xs="24" :sm="8"  style="height: 100%">
              <div class="media-info" >
                <div class="upload-time"><strong>上传于：</strong>{{media.createTime}}</div>
                <div class="upload-uptime"><strong>更新于：</strong>{{media.updateTime}}</div>
                <div class="upload-by" v-if="media.user"><strong>上传者：</strong>{{media.user.uUsername}}</div>
                <div class="upload-to"><strong>上传至：</strong></div>
                <div class="file-name"><strong>文件名：</strong>{{media.mediaInfoTitle}}</div>
                <div class="file-type"><strong>文件类型：</strong>{{media.mediaInfoTypeDtl}}</div>
                <div class="file-ratio" v-if="media.mediaInfoWidth && media.mediaInfoHeight"><strong>分辨率：</strong>{{media.mediaInfoWidth}}:{{media.mediaInfoHeight}}</div>
                <div class="file-size"><strong>文件大小：</strong>{{media.mediaInfoSize}}</div>
                <div class="file-url"><strong>文件URL：</strong>{{media.mediaInfoUrl}}</div>
                <div class="media-comment"><strong>描述：</strong>{{media.mediaInfoComment}}</div>
              </div>
            </el-col>
          </el-row>
    </div>
  </div>
    <div class="drawer-bg" @touchmove.prevent="">
    </div>
  </div>
</template>

<script>
export default {
  name: 'MediaBox',
  props: ['media', 'isShow', 'index'],
  methods: {
    closeMediaBox() {
      this.$emit('closeMediaBox')
    },
    selectLastMedia() {
      this.$emit('changeMedia', this.index - 1)
    },
    selectNextMedia() {
      this.$emit('changeMedia', this.index + 1)
    }
  }
}
</script>

<style scoped lang="scss">
  .drawer-bg{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,.5);
    backdrop-filter: blur(5px);
    z-index: 1002;
  }
.media-box{
  position: fixed;
  top: 30px;
  left: 30px;
  right: 30px;
  bottom: 30px;
  background-color: white;
  overflow-y: auto;
  z-index: 1003;
  .media-header{
    position: absolute;
    height: 50px;
    left: 0px;
    right: 153px;
    background-color: #fcfcfc;
    h1{
      margin: 0;
      font-size: 22px;
      line-height: 50px;
      padding: 0 10px;
    }
  }

  .media-header-edit{
    .left,
    .right,
    .close{
      position: absolute;
      padding: 0;
      margin: 0;
      width: 50px;
      height: 50px;
      box-sizing: content-box;
      border: 0;
      border-left: 1px solid #ddd;
      background-color: #fcfcfc;
      cursor: pointer;
      border-radius: 3px;
      &:hover{
        background-color: #DDDDDD;
      }
    }
    .left{
      right: 102px;

    }
    .right{
      right: 51px;
    }
    .close{
      right: 0;
    }
  }
  .media-content{
    position: absolute;
    top: 50px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    .media-view{
      padding: 16px;
      height: 100%;
      display: flex;
      justify-content: center;
      img{
        max-width: 100%;
        max-height: calc(100% - 42px);
        margin: 0 auto 16px;
        object-fit:cover
      }
    }
    .media-info{
      width: 100%;
      padding: 12px 16px;
      background-color: #f3f3f3;
      height: 100%;
      font-size: 12px;
      color: rgb(102,102,102);
      box-sizing: border-box;
      overflow-y: scroll;
      word-break: break-all;
      line-height: 18px;
    }
  }
}
@media screen and (max-height: 400px) {
  .media-box{
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
@media screen and (max-width: 640px) {
  .media-box{
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>

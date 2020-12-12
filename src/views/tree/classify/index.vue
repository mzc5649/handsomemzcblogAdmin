<template>
  <div class="app-container" :v-loading="treeLoading">
    <el-input v-model="filterText" placeholder="输入关键字过滤" style="margin-bottom:30px;"/>
    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class='filter-tree'
      :expand-on-click-node='false'
      default-expand-all

    >
         <span class="custom-tree-node" slot-scope="{ node, data }">
           <span>{{ node.label }}</span>
           <span>
               <el-button
                 type="text"
                 size="mini"
                 @click="() => info(node,data)">
            详情
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => edit(node,data)">
            修改
          </el-button>
                <el-button
                  type="text"
                  size="mini"
                  style="color: red"
                  @click="() => delete(node,data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog title="输入新的分类名称" :visible.sync="editClassifyFormVisible">
      <el-form :model="editClassifyForm">
        <el-form-item label="旧的分类名称">
          <el-input v-model="editClassifyForm.oldClassifyName" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="新的分类名称">
          <el-input v-model="editClassifyForm.newClassifyName" autocomplete="off" placeholder="输入新的分类名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editClassifyFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editClassifyFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分类信息" :visible.sync="classifyInfoFormVisible">
      <el-form :model="classifyInfoForm">
        <el-form-item label="分类名称">
          <el-input v-model="classifyInfoForm.sortName" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="classifyInfoForm.sortCreatedTime" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="修改时间">
          <el-input v-model="classifyInfoForm.sortModifiedTime" autocomplete="off" readonly></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getClassifyList } from '@/api/classify'
export default {
  data() {
    return {
      treeLoading: true,
      filterText: '',
      data2: [],
      defaultProps: {
        children: 'bbsSections',
        label: 'cName'
      },
      editClassifyFormVisible: false,
      editClassifyForm: {
        id: '',
        oldClassifyName: '',
        newClassifyName: ''
      },
      classifyInfoFormVisible: false,
      classifyInfoForm: {

      }
    }
  },
  created() {
    getClassifyList().then(response => {
      response.data.forEach(i => {
        i.cName = i.sortName
      })
      this.data2 = response.data
      this.treeLoading = false
    })
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.cName.indexOf(value) !== -1
    },
    edit(node, data) {
      this.editClassifyForm.id = data.sortId
      this.editClassifyForm.oldClassifyName = data.sortName
      this.editClassifyFormVisible = true
    },
    info(node, data) {
      this.classifyInfoForm = data
      this.classifyInfoFormVisible = true
    }
  }
}
</script>
<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>

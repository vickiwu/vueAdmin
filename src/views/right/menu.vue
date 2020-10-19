<template>
  <section>
    <div class="condition">
      <el-input v-model="input" placeholder="请输入内容" class="setWidth" />
      <el-button type="success" size="small" icon="el-icon-search" style="margin-left: 10px;">搜索</el-button>
      <el-button v-permission="['right:menu:add']" type="primary" size="small" icon="el-icon-plus" @click="dialogFormVisible = true">新增</el-button>
      <el-table class="table" :data="tableData" border :height="tableHeight" style="width: 100%;margin:10px 0" row-key="id" default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column type="index" sortable label="序号" width="50" />
        <el-table-column prop="name" sortable label="菜单名称" />
        <el-table-column prop="path" sortable label="菜单路由" />
        <el-table-column prop="css" sortable label="图标样式" />
        <el-table-column prop="types" sortable label="菜单类型" />
        <el-table-column prop="clientId" sortable label="所属应用" />
        <el-table-column prop="sort" sortable label="排序" />
        <el-table-column fixed="right" label="操作" width="280">
          <template slot-scope="scope">
            <el-button v-permission="['right:menu:insert']" type="primary" size="mini" icon="el-icon-plus">添加</el-button>
            <el-button v-permission="['right:menu:update']" type="warning" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.$index, scope.row)">修改</el-button>
            <el-button v-permission="['right:menu:del']" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      />
      <!-- Form 新增修改-->
      <el-dialog title="菜单管理" :visible.sync="dialogFormVisible">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-row :gutter="20" style="margin:0">
            <el-col :span="12">
              <el-form-item label="菜单名称" prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入菜单名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上级菜单" prop="password">
                <el-input v-model="ruleForm.password" type="password" placeholder="请输入菜单路由" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单样式" prop="css">
                <el-input v-model="ruleForm.css" placeholder="请输入用户名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属应用" prop="clientId">
                <el-select v-model="ruleForm.clientId" placeholder="请选择用户类型">
                  <el-option label="后台用户" value="shanghai" />
                  <el-option label="机构用户" value="beijing" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否隐藏" prop="hidden">
                <el-radio-group v-model="ruleForm.hidden" placeholder="请选择性别">
                  <el-radio label="男" />
                  <el-radio label="女" />
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单类型" prop="types">
                <el-radio-group v-model="ruleForm.types">
                  <el-radio label="是" />
                  <el-radio label="否" />
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="显示顺序" prop="sort">
                <el-input v-model="ruleForm.sort" placeholder="请输入顺序" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div></section>
</template>

<script>
// import { tableList } from '@/api/right/user'
export default {
  data() {
    return {
      input: '',
      row: [],
      tableData: [{
        id: 1,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        id: 2,
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        id: 3,
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        children: [{
          id: 31,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          id: 32,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }]
      }, {
        id: 4,
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      tableData1: [{
        id: 1,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        id: 2,
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        id: 3,
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        hasChildren: true
      }, {
        id: 4,
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      dialogFormVisible: false,
      dialogVisible: false,
      ruleForm: {
        name: '',
        path: '',
        css: '',
        types: '',
        hidden: '',
        clientId: '',
        sort: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入角色编码', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择角色类型', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.tableHeight = this.getTableHeight('table')
  },
  methods: {
    // 查看行事件
    handleClick(index, row) {
      this.dialogVisible = true
      this.row = row
    },
    // 修改行事件
    handleUpdate(index, row) {
      this.dialogFormVisible = true
      this.row = row
    },
    // 删除行
    handleDelete(index, row) {
      console.log(index, row)
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取单表格高度
    getTableHeight(dom) {
      const winH = document.body.clientHeight || window.innerHeight
      return winH - document.getElementsByClassName(dom)[0].offsetTop
    },
    // 获取表格数据
    fetchTableData() {
      // tableList().then(response => {
      //   // 嘻嘻嘻
      // })
    },
    // 分页事件
    handleCurrentChange(page) {
      this.page = page
      this.listLoading = true
      // authApi.getPageResult({ limit: this.pageSize, page }).then((response) => {
      //   const { data } = response
      //   this.list = data.data
      //   this.total = data.count
      //   this.listLoading = false
      // }).catch(error => error)
    }

  }
}
</script>
 <style lang='scss' scoped>
 section{
   height:100vh;
 }
.setWidth {
  width: 180px;
}
.right{
  float: right;
}
// .condition{
//      clear: both;
//     margin-bottom: 15px;
//     width: 100%;
//     padding: 15px 20px;
//     border-bottom: 2px solid #409eff;
// }
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

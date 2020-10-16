<template>
  <section>
    <div class="condition">
      <el-select v-model="value" placeholder="请选择对应列" style="margin-right: 10px;">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input v-model="input" placeholder="请输入内容" class="setWidth" />
      <div class="right">
        <el-button type="success" size="small" icon="el-icon-search">搜索</el-button>
        <el-button v-permission="['right:role:add']" type="primary" size="small" icon="el-icon-plus" @click="dialogFormVisible = true">新增</el-button>
      </div>
      <el-table class="table" :data="tableData" border :height="tableHeight" style="width: 100%">
        <el-table-column type="index" sortable label="序号" width="50" />
        <el-table-column prop="code" sortable label="角色编码" />
        <el-table-column prop="name" sortable label="角色名称" />
        <el-table-column prop="type" sortable label="角色类型" />
        <el-table-column prop="description" sortable label="描述" />
        <el-table-column prop="clientId" sortable label="所属应用" />
        <el-table-column prop="createTime" sortable label="创建时间" />
        <el-table-column fixed="right" label="操作" width="300">
          <template slot-scope="scope">
            <el-button v-permission="['right:role:update']" type="warning" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.$index, scope.row)">修改</el-button>
            <el-button v-permission="['right:role:del']" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button v-permission="['right:role:set']" type="primary" size="mini" icon="el-icon-s-custom">角色设置</el-button>
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
      <el-dialog title="角色管理" :visible.sync="dialogFormVisible">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-row :gutter="20" style="margin:0">
            <el-col :span="24">
              <el-form-item label="角色名称" prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入角色名称" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="角色编码" prop="code" autocomplete="off">
                <el-input v-model="ruleForm.code" type="password" placeholder="请输入角色编码" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="所属应用" prop="clientId">
                <el-input v-model="ruleForm.clientId" placeholder="请选择所属应用" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="角色类型" prop="type">
                <el-select v-model="ruleForm.type" placeholder="请选择用户类型">
                  <el-option label="后台用户" value="shanghai" />
                  <el-option label="机构用户" value="beijing" />
                  <el-option label="枚举拿" value="beij1ing" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="描述" prop="description">
                <el-input
                  v-model="ruleForm.description"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入描述"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- Form 查看没有查看该设置-->
      <!-- <el-dialog title="角色管理" :visible.sync="dialogVisible">
        <el-form
          :model="row"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-row :gutter="20" style="margin:0">
            <el-col :span="6">
              <div>tu</div>
            </el-col>
            <el-col :span="18">
              <el-form-item label="用户标识：">
                {{ row.name }}
              </el-form-item>
              <el-form-item label="登录账号：">
                {{ row.username }}
              </el-form-item>
              <el-form-item label="手机号码：">
                {{ row.phone }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别：">
                {{ row.sex }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出生日期：">
                {{ row.birthday }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="座机号码：">
                {{ row.landLine }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否多点：">
                {{ row.isMorePoint==1?'是':'否' }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户类型：">
                {{ row.region }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电子邮箱：">
                {{ row.eMail }}
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="所属单位：">
                {{ row.post }}
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="居住地址：">
                {{ row.address }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建时间：">
                {{ row.createTime }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="更新时间：">
                {{ row.updateTime }}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog> -->
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
        headImgUrl: 'tu', id: 1, username: '123', password: '12222', personName: '用户名', phone: '1234556666', type: 1, enabled: 'zaocdf'
      }
      ],
      dialogFormVisible: false,
      dialogVisible: false,
      ruleForm: {
        name: '',
        code: '',
        clientId: '',
        type: '',
        description: '',
        createTime: ''
      },
      options: [{
        value: 'code',
        label: '角色编码'
      }, {
        value: 'name',
        label: '角色名称'
      }, {
        value: 'type',
        label: '角色类型'
      }, {
        value: 'description',
        label: '描述'
      }, {
        value: 'clientId',
        label: '所属应用'
      }, {
        value: 'createTime',
        label: '创建时间'
      }],
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
    // 上传
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    // 上传
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
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
.condition{
     clear: both;
    margin-bottom: 15px;
    width: 100%;
    padding: 15px 20px;
    border-bottom: 2px solid #409eff;
}
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

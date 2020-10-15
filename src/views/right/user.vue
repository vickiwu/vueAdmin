<template>
  <section>
    <div class="condition">
      <el-select
        v-model="value"
        placeholder="请选择对应列"
        style="margin-right: 10px;"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input
        v-model="input"
        placeholder="请输入内容"
        class="setWidth"
      />
      <div class="right">
        <el-button
          type="success"
          icon="el-icon-search"
        >搜索</el-button>
        <el-button
          v-permission="['right:user:add']"
          type="primary"
          icon="el-icon-plus"
          @click="dialogFormVisible = true"
        >新增</el-button>
        <el-button
          v-permission="['right:user:export']"
          type="warning"
          icon="el-icon-download"
        >导出</el-button>
      </div>
    </div>
    <el-table
      class="table"
      :data="tableData"
      border
      :height="tableHeight"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        sortable
        label="序号"
        width="50"
      />
      <el-table-column
        prop="headImgUrl"
        sortable
        label="头像"
      />
      <el-table-column
        prop="id"
        sortable
        label="用户ID"
      />
      <el-table-column
        prop="username"
        sortable
        label="登录账号"
      />
      <el-table-column
        prop="password"
        sortable
        label="登录密码"
      />
      <el-table-column
        prop="personName"
        sortable
        label="用户名称"
      />
      <el-table-column
        prop="phone"
        sortable
        label="手机号码"
      />
      <el-table-column
        prop="type"
        sortable
        label="类型"
      />
      <el-table-column
        prop="enabled"
        sortable
        label="状态"
      >
        <el-switch
          v-model="tableData.enabled"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="180"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['right:user:info']"
            type="text"
            size="small"
            @click="handleClick(scope.$index,scope.row)"
          >查看</el-button>
          <el-button
            v-permission="['right:user:update']"
            type="text"
            size="small"
            @click="handleUpdate(scope.$index, scope.row)"
          >修改</el-button>
          <el-button
            v-permission="['right:user:del']"
            type="text"
            size="small"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
          <el-button
            v-permission="['right:user:list']"
            type="text"
            size="small"
          >黑白名单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <span class="demonstration">页数较少时的效果</span>
      <el-pagination
        layout="prev, pager, next"
        :total="50"
      />
    </div>
    <!-- Form 新增修改-->
    <el-dialog
      title="用户管理"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-row
          :gutter="20"
          style="margin:0"
        >
          <el-col :span="12">
            <el-form-item
              label="登录账号"
              prop="username"
            >
              <el-input
                v-model="ruleForm.username"
                placeholder="请输入登录账号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="登录密码"
              prop="password"
              autocomplete="off"
            >
              <el-input
                v-model="ruleForm.password"
                type="password"
                placeholder="请输入登录密码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="用户名称"
              prop="personName"
            >
              <el-input
                v-model="ruleForm.personName"
                placeholder="请输入用户名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-radio-group
                v-model="ruleForm.sex"
                placeholder="请选择性别"
              >
                <el-radio label="男" />
                <el-radio label="女" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="用户类型"
              prop="type"
            >
              <el-select
                v-model="ruleForm.region"
                placeholder="请选择用户类型"
              >
                <el-option
                  label="后台用户"
                  value="shanghai"
                />
                <el-option
                  label="机构用户"
                  value="beijing"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="是否多点"
              prop="isMorePoint"
            >
              <el-radio-group v-model="ruleForm.isMorePoint">
                <el-radio label="是" />
                <el-radio label="否" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="出生日期"
              prop="birthday"
            >
              <el-input
                v-model="ruleForm.birthday"
                placeholder="请输入出生日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="手机号码"
              prop="phone"
            >
              <el-input
                v-model="ruleForm.phone"
                placeholder="请输入手机号码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="电子邮箱"
              prop="eMail"
            >
              <el-input
                v-model="ruleForm.eMail"
                placeholder="请输入电子邮箱"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="座机号码"
              prop="landLine"
            >
              <el-input
                v-model="ruleForm.landLine"
                placeholder="请输入座机号码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="职务"
              prop="post"
            >
              <el-input
                v-model="ruleForm.post"
                placeholder="请输入职务"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="居住地址"
              prop="address"
            >
              <el-input
                v-model="ruleForm.address"
                placeholder="请输入居住地址"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="上传头像"
              prop="headImgUrl"
            >
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img
                  v-if="imageUrl"
                  :src="ruleForm.headImgUrl"
                  class="avatar"
                >
                <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
                />
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- Form 查看-->
    <el-dialog
      title="用户管理"
      :visible.sync="dialogVisible"
    >
      <el-form
        :model="row"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-row
          :gutter="20"
          style="margin:0"
        >
          <el-col :span="6">
            <div>tu</div>
          </el-col>
          <el-col :span="18">
            <el-form-item label="用户标识">
              {{ row.name }}
            </el-form-item>
            <el-form-item label="登录账号">
              {{ row.username }}
            </el-form-item>
            <el-form-item label="手机号码">
              {{ row.phone }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别">
              {{ row.sex }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期">
              {{ row.birthday }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="座机号码">
              {{ row.landLine }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否多点">
              {{ row.isMorePoint==1?'是':'否' }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户类型">
              {{ row.region }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电子邮箱">
              {{ row.eMail }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所属单位">
              {{ row.post }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="居住地址">
              {{ row.address }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              {{ row.createTime }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="更新时间">
              {{ row.updateTime }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </section>
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
        id: '',
        username: '',
        password: '',
        personName: '',
        phone: '',
        landLine: '',
        birthday: '',
        sex: 1,
        eMail: '',
        post: '',
        address: '',
        type: '',
        isMorePoint: '',
        headImgUrl: '',
        enabled: '',
        createTime: '',
        updateTime: ''
      },
      options: [{
        value: 'id',
        label: '用户ID'
      }, {
        value: 'username',
        label: '登录账号'
      }, {
        value: 'personName',
        label: '用户名称'
      }, {
        value: 'phone',
        label: '手机号码'
      }, {
        value: 'type',
        label: '性别'
      }, {
        value: 'enabled',
        label: '状态'
      }],
      rules: {
        username: [
          { required: true, message: '请输入登录账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ],
        personName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择一种用户类型', trigger: 'blur' }
        ],
        isMorePoint: [
          { required: true, message: '请设置是否多点', trigger: 'change' }
        ],
        phone: [
          { required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机格式', trigger: 'blur' }
        ],
        eMail: [
          { required: true, type: 'email', message: '请输入正确格式的电子邮箱', trigger: 'blur' }
        ],
        landLine: [
          { required: true, pattern: /0\d{2,3}-\d{7,8}|\(?0\d{2,3}[)-]?\d{7,8}|\(?0\d{2,3}[)-]*\d{7,8}/, message: '请输入正确格式的座机号码', trigger: 'blur' }
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
      tableList().then(response => {
        // 嘻嘻嘻
      })
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
    }

  }
}
</script>
 <style lang='scss' scoped>
section {
  height: 100vh;
}
.setWidth {
  width: 180px;
}
.right {
  float: right;
}
.condition {
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
  border-color: #409eff;
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

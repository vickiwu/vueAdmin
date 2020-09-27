<template>
  <section>
    <div class="condition">
      <el-input v-model="input" placeholder="请输入内容" class="setWidth" />
      <div class="right">
        <el-button type="success">搜索</el-button>
        <el-button type="primary" @click="dialogFormVisible = true">新增</el-button>
      </div>
    </div>
    <el-table class="table" :data="tableData" border :height="tableHeight" style="width: 100%">
      <el-table-column prop="date" label="序号" width="50" />
      <el-table-column prop="name" label="头像" />
      <el-table-column prop="name" label="用户ID" />
      <el-table-column prop="address" label="登录账号" />
      <el-table-column prop="address" label="登录密码" />
      <el-table-column prop="address" label="用户名称" />
      <el-table-column prop="address" label="手机号码" />
      <el-table-column prop="address" label="类型" />
      <el-table-column prop="address" label="状态" />
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
          <el-button type="text" size="small">修改</el-button>
          <el-button type="text" size="small">删除</el-button>
          <el-button type="text" size="small">黑白名单</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Form -->
    <el-dialog title="用户管理" :visible.sync="dialogFormVisible">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-row :gutter="20" style="margin:0">
          <el-col :span="12">
            <el-form-item label="登录账号" prop="name">
              <el-input v-model="ruleForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录密码" prop="name">
              <el-input v-model="ruleForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="name">
              <el-input v-model="ruleForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-radio-group v-model="ruleForm.name">
                <el-radio label="男" />
                <el-radio label="女" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="name">
              <el-input v-model="ruleForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否多点">
              <el-radio-group v-model="ruleForm.name">
                <el-radio label="是" />
                <el-radio label="否" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
          <el-form-item label="应用秘钥" prop="name">
            <el-select v-model="ruleForm.name" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col> -->
          <el-col :span="12">
            <el-form-item label="出生日期" prop="name">
              <el-input v-model="ruleForm.region" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
          <el-form-item label="手机号码" prop="name">
            <el-select v-model="ruleForm.name" multiple placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col> -->
          <el-col :span="12">
            <el-form-item label="手机号码" prop="name">
              <el-input v-model="ruleForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电子邮箱" prop="name">
              <el-input v-model="ruleForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="座机号码" prop="name">
              <el-input v-model="ruleForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职务" prop="name">
              <el-input v-model="ruleForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="居住地址" prop="name">
              <el-input v-model="ruleForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上传头像" prop="name">
              <el-input v-model="ruleForm.name" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
export default {
  data() {
    return {
      input: '',
      tableData: [
      ],
      dialogFormVisible: false,
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        date2: [
          {
            type: 'date',
            required: true,
            message: '请选择时间',
            trigger: 'change'
          }
        ],
        type: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个活动性质',
            trigger: 'change'
          }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.tableHeight = this.getTableHeight('table')
  },
  methods: {
    handleClick(row) {
      console.log(row)
    },
    // 获取单表格高度
    getTableHeight: function(dom) {
      const winH = document.body.clientHeight || window.innerHeight
      return winH - document.getElementsByClassName(dom)[0].offsetTop
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
</style>

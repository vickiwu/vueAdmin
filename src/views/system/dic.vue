<template>
  <div class="app-container">
    <!-- <small>认证中心-应用管理页面</small> -->
    <div class="filter-container">
      <el-input
        v-model="searchWords"
        placeholder="请输入关键字"
        style="width: 200px;margin-right: 10px;"
        class="filter-item"
      />
      <el-button
        class="filter-item"
        size="small"
        type="primary"
        icon="el-icon-search"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        size="small"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="dialogFormVisible=true"
      >
        新增
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;margin: 10px 0;"
    >
      <el-table-column
        label="序号"
        prop="id"
        sortable="custom"
        align="center"
        header-align="center"
        width="80"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="应用标识"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.appId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="应用名称"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.appName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="应用秘钥"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.appKey }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="回调地址"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="授权方式"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.authMethod }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>
            {{ row.status }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="right"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <el-tag v-for="n in row.edit" :key="n" style="margin-right:5px">
            {{ n }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :total="total"
    />
    <el-dialog
      title="新增应用"
      :visible.sync="dialogFormVisible"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="应用标识" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入应用标识" />
        </el-form-item>
        <el-form-item label="应用名称" prop="region">
          <el-input v-model="ruleForm.name" placeholder="请输入应用名称" />
        </el-form-item>
        <el-form-item label="活动时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker v-model="ruleForm.date1" type="date" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker v-model="ruleForm.date2" type="fixed-time" placeholder="选择时间" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="即时配送" prop="delivery">
          <el-switch v-model="ruleForm.delivery" />
        </el-form-item>
        <el-form-item label="活动性质" prop="type">
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox label="美食/餐厅线上活动" name="type" />
            <el-checkbox label="地推活动" name="type" />
            <el-checkbox label="线下主题活动" name="type" />
            <el-checkbox label="单纯品牌曝光" name="type" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="特殊资源" prop="resource">
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="线上品牌商赞助" />
            <el-radio label="线下场地免费" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动形式" prop="desc">
          <el-input v-model="ruleForm.desc" type="textarea" />
        </el-form-item>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data() {
    return {
      searchWords: '',
      listLoading: false,
      dialogFormVisible: false,
      list: [
        { id: 1, appId: 'webApp', appName: '管理后台', appKey: '加密内容', url: 'http://www....', authMethod: '密码模式，客户端授权模式', status: 0, edit: ['edit', 'del', 'apply'] },
        { id: 2, appId: 'webApp', appName: '管理后台', appKey: '加密内容', url: 'http://www....', authMethod: '密码模式，客户端授权模式', status: 0, edit: ['edit', 'del', 'apply'] }
      ],
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
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    total() {
      return this.list.length
    }
  },
  created() {},
  methods: {}
}
</script>
 <style lang="scss">

 </style>

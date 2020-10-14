<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="searchWords"
        placeholder="请输入关键字"
        style="width: 200px;margin-right: 10px;"
        class="filter-item"
      />
      <el-button
        class=""
        size="small"
        type="success"
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
        @click="openNew"
      >
        新增
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      class="auth-table"
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
        label="appId"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.appId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="appSecret"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.appSecret }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.appType }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="描述"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.appDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="生效日期"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.entryTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="到期日期"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.dueTime }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="300"
        align="right"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div style="display: flex;justify-content: flex-end;">
            <el-button v-for="n in row.edit" :key="n.txt" size="mini" :icon="n.icon" :type="n.class" @click="handelClick(n,row)">{{ n.txt }}</el-button>

          </div>
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
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="service-ruleForm">
        <el-row :gutter="20">
          <el-col :span="21">
            <el-form-item label="appId" prop="appId">
              <el-input v-model="ruleForm.appId" placeholder="请输入appId" />
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :gutter="20">

          <el-col :span="21">
            <el-form-item label="secret" prop="appSecret">
              <el-input v-model="ruleForm.appSecret" placeholder="请输入secret" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">

          <el-col :span="21">
            <el-form-item label="秘钥类型" prop="appType">
              <el-input v-model="ruleForm.appType" placeholder="请输入秘钥类型" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="21">
            <el-form-item label="生效日期" prop="entryTime">
              <el-input v-model="ruleForm.entryTime" placeholder="请选择生效日期" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="21">
            <el-form-item label="到期日期" prop="dueTime">
              <el-input v-model="ruleForm.dueTime" placeholder="请选择到期日期" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="21">
            <el-form-item label="描述" prop="appDesc">
              <el-input v-model="ruleForm.appDesc" type="textarea" placeholder="请输入描述" />
            </el-form-item>
          </el-col>
        </el-row>

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
      dialogApply: false,
      list: [
        { id: 1, appId: '认证中心', appSecret: '/api-auth', appType: '服务', appDesc: '2020-08-11 10:10:10', entryTime: '1', dueTime: ' 2021-08-11', edit: [{ txt: '修改', class: '', icon: 'el-icon-edit' }, { txt: '删除', class: 'danger', icon: 'el-icon-delete' }] },
        { id: 2, appId: '认证中心', appSecret: '/api-auth', appType: '服务', appDesc: '2020-08-11 10:10:10', entryTime: '1', dueTime: ' 2021-08-11', edit: [{ txt: '修改', class: '', icon: 'el-icon-edit' }, { txt: '删除', class: 'danger', icon: 'el-icon-delete' }] }
      ],
      ruleForm: {
        appId: '',
        appSecret: '',
        appType: '',
        higherService: '',
        entryTime: '',
        dueTime: '',
        appDesc: ''
      },

      rules: {
        appId: [
          { required: true, message: '请输入appId', trigger: 'blur' }
        ],
        appSecret: [
          { required: true, message: '请输入secret', trigger: 'blur' }
        ],
        appType: [
          { required: true, message: '请输入秘钥类型', trigger: 'blur' }
        ]

      }
    }
  },
  computed: {
    total() {
      return this.list.length
    }
  },
  created() {
  },
  methods: {
    openNew() {
      this.dialogFormVisible = true
      for (const k of Object.keys(this.ruleForm)) {
        this.ruleForm[k] = ''
      }
    },
    handelClick(item, row) {
      if (item.txt === '修改') {
        this.dialogFormVisible = true
        this.ruleForm = { ...row }
      } else if (item.txt === '删除') {
        this.$confirm('确认删除吗？')
          .then(_ => {
            console.log(_, '删除了')
          })
          .catch(_ => {
            console.log(_, '取消删除了')
          })
      }
    }
  }
}
</script>
 <style lang="scss">
 .auth-table{
 .el-button--mini, .el-button--mini.is-round {
    padding: 5px 10px;
}
 }

  .search-btn{
    background-color: rgba(0, 204, 102, 1);
  }
  .service-ruleForm{
    .el-select{
      width: 85%;
    }

  }
 </style>

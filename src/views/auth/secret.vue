<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="appId"
        placeholder="请输入关键字"
        style="width: 200px;margin-right: 10px;"
        class="filter-item"
      />
      <el-button
        class=""
        size="small"
        type="success"
        icon="el-icon-search"
        @click="loadTable()"
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
        show-overflow-tooltip
        label="序号"
        type="index"
        
        align="center"
        header-align="center"
        width="80"
      />
      <el-table-column
        show-overflow-tooltip
        label="appId"
        
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.appId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="appSecret"
        
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.appSecret }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="类型"
        
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="描述"
        
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="生效日期"
        
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.validityDateStr }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="到期日期"
        
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.expireDateStr }}</span>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        label="操作"
        width="300"
        align="right"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div style="display: flex;justify-content: flex-end;">
            <div style="display: flex;justify-content: flex-end;">
              <el-button
                key="修改"
                size="mini"
                icon="el-icon-edit"
                @click="handelClick('修改',row)"
              >修改</el-button>
              <el-button
                key="删除"
                size="mini"
                icon="el-icon-delete"
                type="danger"
                @click="handelClick('删除',row)"
              >删除</el-button>
            </div>
          </div>
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
    <el-dialog
      :title="dialogTitle"
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
            <el-form-item label="秘钥类型" prop="type">
              <el-input v-model="ruleForm.type" placeholder="请输入秘钥类型" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="21">
            <el-form-item label="生效日期" prop="validityDateStr">
              <el-input v-model="ruleForm.validityDateStr" placeholder="请选择生效日期" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="21">
            <el-form-item label="到期日期" prop="expireDateStr">
              <el-input v-model="ruleForm.expireDateStr" placeholder="请选择到期日期" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="21">
            <el-form-item label="描述" prop="description">
              <el-input v-model="ruleForm.description" type="textarea" placeholder="请输入描述" />
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
        <el-button type="primary" @click="handleSave">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import authApi from '@/api/auth'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      appId: '',
      listLoading: true,
      dialogFormVisible: false,
      dialogTitle: '新增应用',
      dialogApply: false,
      list: [],
      page: 1,
      pageSize: 5,
      total: 0,
      ruleForm: {
        appId: '',
        appSecret: '',
        type: '',
        higherService: '',
        validityDateStr: '',
        expireDateStr: '',
        description: ''
      },

      rules: {
        appId: [
          { required: true, message: '请输入appId', trigger: 'blur' }
        ],
        appSecret: [
          { required: true, message: '请输入secret', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入秘钥类型', trigger: 'blur' }
        ]

      }
    }
  },
  computed: {

  },
  created() {
    this.loadTable()
  },
  methods: {
    async loadTable(pageSize, page) {
      await authApi.getSysSecretPageResult({ limit: this.pageSize, page: this.page, appId: this.appId }).then((response) => {
        const { data } = response
        this.list = data.data
        this.total = data.count
        this.listLoading = false
      }).catch(error => error)
    },
    handleCurrentChange(page) {
      this.page = page
      this.listLoading = true
      this.loadTable()
    },
    handleSave() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          authApi.saveSysSecret({ ...this.ruleForm }).then((response) => {
            Message({
              message: response.msg,
              type: 'success',
              duration: 2 * 1000
            })
            if (response.code === 200) {
              this.listLoading = true
              this.loadTable()
              this.dialogFormVisible = false
            }
          }).catch(error => error)
        } else {
          console.log('验证出错')
          return false
        }
      })
    },
    openNew() {
      this.dialogFormVisible = true
      for (const k of Object.keys(this.ruleForm)) {
        this.ruleForm[k] = ''
      }
    },
    handelClick(item, row) {
      if (item === '修改') {
        this.dialogTitle = '修改应用'
        this.dialogFormVisible = true
        this.ruleForm = { ...row }
      } else if (item === '删除') {
        this.$confirm('确认删除吗？')
          .then(_ => {
            authApi.deleteSysSecret({ id: row.id }).then((response) => {
              Message({
                message: response.msg,
                type: 'success',
                duration: 2 * 1000
              })
              if (response.code === 200) {
                this.loadTable()
              }
            }).catch(error => {
              console.log(error, 'eee')
            })
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

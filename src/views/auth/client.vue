<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="appId"
        placeholder="请输入关键字"
        style="width: 200px; margin-right: 10px"
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
        style="margin-left: 10px"
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
      style="width: 100%; margin: 10px 0"
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
        label="客户名称"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="客户类型"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.type === 1 ? '托运商' : '承运商' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="联系人姓名"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.contactName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="联系人手机号"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.contactPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="联系人地址"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="操作"
        width="180"
        align="right"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div style="display: flex; justify-content: flex-end">
            <div style="display: flex; justify-content: flex-end">
              <el-button
                key="修改"
                size="mini"
                icon="el-icon-edit"
                @click="handelClick('修改', row)"
              >
                修改
              </el-button>
              <el-button
                key="删除"
                size="mini"
                icon="el-icon-delete"
                type="danger"
                @click="handelClick('删除', row)"
              >
                删除
              </el-button>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form
        ref="clientForm"
        :model="clientForm"
        :rules="rules"
        label-width="140px"
        class="service-clientForm"
      >
        <el-row :gutter="20">
          <el-col :span="21">
            <el-form-item label="客户名称" prop="name">
              <el-input
                v-model="clientForm.name"
                placeholder="请输入客户名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="21">
            <el-form-item label="联系人姓名" prop="contactName">
              <el-input
                v-model="clientForm.contactName"
                placeholder="请输入联系人姓名"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="21">
            <el-form-item label="联系人手机号" prop="contactPhone">
              <el-input
                v-model="clientForm.contactPhone"
                placeholder="请输入联系人手机号"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="21">
            <el-form-item label="联系人地址" prop="address">
              <el-input
                v-model="clientForm.address"
                placeholder="请输入联系人地址"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="21">
            <el-form-item label="客户类型" prop="type">
              <el-radio-group v-model="clientForm.type">
                <el-radio :label="1">托运商</el-radio>
                <el-radio :label="2">承运商</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="handleSave"> 确认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getClientList, addClient, editClient, delClient } from '@/api/people'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      appId: '',
      listLoading: false,
      dialogFormVisible: false,
      dialogTitle: '新增客户',
      dialogApply: false,
      list: [{}],
      page: 1,
      pageSize: 5,
      total: 0,
      clientForm: {
        name: '',
        contactName: '',
        contactPhone: '',
        address: '',
        type: 1
      },
      rules: {
        name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
        contactName: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '请输入联系人手机号', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入联系人地址', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId', 'deptId', 'userId'])
  },
  created() {
    this.loadTable()
  },
  methods: {
    loadTable() {
      this.listLoading = true
      getClientList({
        pageSize: this.pageSize,
        page: this.page // 1 y 10
      })
        .then((response) => {
          const data = response.d
          this.list = data
          this.total = response.z
          this.listLoading = false
        })
        .catch((error) => error)
    },
    handleCurrentChange(page) {
      this.page = page
      this.listLoading = true
      this.loadTable()
    },
    addClient() {
      this.listLoading = true
      addClient({
        ...this.clientForm,
        companyId: this.companyId,
        deptId: this.deptId,
        userId: this.userId
      })
        .then((response) => {
          Message({
            message: response.m || '添加成功',
            type: 'success',
            duration: 2 * 1000
          })
          this.loadTable()
          this.dialogFormVisible = false
        })
        .catch((error) => {
          error
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    editClient() {
      this.listLoading = true
      editClient({
        ...this.clientForm
      })
        .then((response) => {
          Message({
            message: response.m || '修改成功',
            type: 'success',
            duration: 2 * 1000
          })

          this.loadTable()
          this.dialogFormVisible = false
        })
        .catch((error) => {
          error
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    handleSave() {
      this.$refs['clientForm'].validate((valid) => {
        if (valid) {
          switch (this.dialogTitle) {
            case '新增客户':
              this.addClient()
              break
            case '修改客户':
              this.editClient()
              break
            default:
              break
          }
        } else {
          console.log('验证出错')
          return false
        }
      })
    },
    openNew() {
      this.dialogFormVisible = true
      for (const k of Object.keys(this.clientForm)) {
        this.clientForm[k] = ''
      }
    },
    handelClick(item, row) {
      if (item === '修改') {
        this.dialogTitle = '修改客户'
        this.dialogFormVisible = true
        this.clientForm = { ...row }
      } else if (item === '删除') {
        this.$confirm('确认删除吗？')
          .then((_) => {
            delClient({ id: row.id })
              .then((response) => {
                Message({
                  message: response.m || '删除成功',
                  type: 'success',
                  duration: 2 * 1000
                })
                if (response.a === 200) {
                  this.loadTable()
                }
              })
              .catch((error) => {
                console.log(error, 'eee')
              })
          })
          .catch((_) => {
            console.log(_, '取消删除了')
          })
      }
    }
  }
}
</script>
 <style lang="scss">
.auth-table {
  .el-button--mini,
  .el-button--mini.is-round {
    padding: 5px 10px;
  }
}

.search-btn {
  background-color: rgba(0, 204, 102, 1);
}
.service-clientForm {
  .el-select {
    width: 85%;
  }
}
</style>

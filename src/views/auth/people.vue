<template>
  <div class="app-container">
    <!-- <small>认证中心-应用管理页面</small> -->
    <div class="filter-container">
      <el-input
        v-model="phone"
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
        label="序号"
        type="index"
        align="center"
        header-align="center"
        width="80"
      />
      <el-table-column
        label="姓名"
        align="left"
        width="120"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="手机号"
        align="left"
        width="280"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="部门名称" align="left" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色类型" align="left" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.roleType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" align="left" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.roleName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="400"
        align="right"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div style="display: flex; justify-content: flex-end">
            <el-button
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
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="client-ruleForm"
      >
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="姓名" prop="userName">
              <el-input v-model="ruleForm.userName" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="ruleForm.phone"
                placeholder="请输入手机号"
                :disabled="dialogTitle === '修改人员'"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="部门">
              <el-select-tree
                v-model="ruleForm.deptId"
                :popper-append-to-body="false"
                placeholder="请选择部门"
                :data="selectTreeData"
                :props="props"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="角色">
              <el-select
                v-model="ruleForm.roleId"
                filterable
                clearable
                placeholder="请选择角色s"
              >
                <el-option
                  v-for="item in roleOption"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="handleSave()"> 确认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ElSelectTree from 'el-select-tree'
import {
  getPeopleList,
  getRoleList,
  getDeportList,
  addPeople,
  delPeople,
  editPeople
} from '@/api/people'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
export default {
  components: {
    ElSelectTree
  },
  data() {
    return {
      dialogTitle: '新增人员',
      phone: '',
      listLoading: false,
      dialogFormVisible: false,
      list: [],
      roleValue: '',
      roleOption: [],
      selectTreeValue: '',
      selectTreeData: [],
      props: {
        value: 'id',
        label: 'name',
        children: 'd'
      },
      page: 1,
      pageSize: 10,
      total: 0,
      ruleForm: {
        userName: null,
        phone: null,
        deptId: '',
        roleId: ''
      },

      rules: {
        userName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        deptId: [{ required: true, message: '请选择部门', trigger: 'change' }],
        roleId: [{ required: true, message: '请选择角色', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId', 'deptId'])
  },
  created() {
    this.loadTable()
  },
  mounted() {
    this.getRoleList()
    this.getDeportList()
  },
  methods: {
    loadTable() {
      getPeopleList({
        pageSize: this.pageSize,
        page: this.page, // 1 y 10
        deptId: this.deptId,
        companyId: this.companyId
      })
        .then((response) => {
          const data = response.d
          this.list = data
          this.total = response.z
          this.listLoading = false
        })
        .catch((error) => error)
    },
    getRoleList() {
      getRoleList({
        pageSize: 9999,
        page: 1, // 1 y 10
        deptId: this.deptId,
        companyId: this.companyId
      })
        .then((response) => {
          const data = response.d
          this.roleOption = data
        })
        .catch((error) => error)
    },
    getDeportList() {
      getDeportList({
        pageSize: 9999,
        page: 1, // 1 y 10
        id: this.deptId,
        // parentId: 1, // 固定传1
        companyId: this.companyId
      })
        .then((response) => {
          const data = response.d

          this.selectTreeData = data
        })
        .catch((error) => error)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleCurrentChange(page) {
      this.page = page
      this.listLoading = true
      this.loadTable()
    },
    handleSave(type) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          switch (this.dialogTitle) {
            case '新增人员':
              this.addPeople()
              break
            case '修改人员':
              this.editPeople()
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
    addPeople() {
      this.listLoading = true
      addPeople({
        ...this.ruleForm,
        password: '123456',
        companyId: this.companyId
      })
        .then((response) => {
          Message({
            message: response.m || '添加成功',
            type: 'success',
            duration: 2 * 1000
          })
          this.listLoading = false
          this.loadTable()
          this.dialogFormVisible = false
        })
        .catch((error) => error)
    },
    editPeople() {
      this.listLoading = true
      editPeople({
        ...this.ruleForm,
        password: '123456',
        companyId: this.companyId
      })
        .then((response) => {
          Message({
            message: response.m || '修改成功',
            type: 'success',
            duration: 2 * 1000
          })
          this.dialogFormVisible = false
          this.listLoading = false
          this.loadTable()
        })
        .catch((error) => error)
    },
    openNew() {
      this.dialogFormVisible = true
      this.dialogTitle = '新增人员'
      for (const k of Object.keys(this.ruleForm)) {
        this.ruleForm[k] = null
      }
    },
    handelClick(item, row) {
      switch (item) {
        case '修改':
          this.dialogTitle = '修改人员'

          this.dialogFormVisible = true
          this.ruleForm = { ...row }
          break
        case '删除':
          this.$confirm('确认删除吗？')
            .then((_) => {
              delPeople({ userId: row.userId })
                .then((response) => {
                  Message({
                    message: response.m || '删除成功',
                    type: 'success',
                    duration: 2 * 1000
                  })

                  this.loadTable()
                })
                .catch((error) => {
                  console.log(error, 'eee')
                })
            })
            .catch((_) => {
              console.log(_, '取消删除了')
            })
          break

        default:
          break
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
.client-ruleForm {
  .el-select {
    width: 100%;
  }
}
</style>

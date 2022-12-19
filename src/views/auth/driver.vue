<template>
  <div class="app-container">
    <!-- <small>认证中心-应用管理页面</small> -->
    <div class="filter-container">
      <el-input
        v-model="name"
        placeholder="请输入司机姓名"
        style="width: 200px; margin-right: 10px"
        class="filter-item"
      />
      <el-button
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
        @click="addDriverHandle"
      >
        新增司机
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
        label="司机姓名"
        align="left"
        header-align="center"
        width="150"
      >
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门名称" align="left" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号" align="left" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.idcard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="left" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="出生日期" align="left" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.birthDay }}</span>
        </template>
      </el-table-column>

      <el-table-column label="备注" align="left" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规则" align="left" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.rule }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200"
        align="right"
        header-align="center"
      >
        <template slot-scope="{ row }">
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
      :visible.sync="driveFromVisible"
      class="dialog-driveFrom"
    >
      <el-form
        ref="driveFrom"
        :model="driveFrom"
        :rules="rules"
        label-width="100px"
        class="client-driveFrom"
      >
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="driveFrom.name" placeholder="请输入司机姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="driveFrom.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="身份证号">
              <el-input
                v-model="driveFrom.idcard"
                placeholder="请输入身份证号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="出生日期">
              <el-date-picker
                v-model="driveFrom.birthDay"
                type="date"
                placeholder="选择出生日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="driveFrom.remark"
                type="textarea"
                placeholder="请输入备注内容"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>

          <el-col :span="11">
            <el-form-item label="规则" prop="rule">
              <el-input
                v-model="driveFrom.rule"
                type="textarea"
                placeholder="请输入规则内容"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="driveFromVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="handleSave"> 确认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDriveList, addDriver, editDriver, delDriver } from '@/api/people'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
import { isPhone } from '@/utils/validate.js'
export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!isPhone(value)) {
        callback(new Error('手机号码格式不正确'))
      } else {
        callback()
      }
    }
    return {
      name: '',
      dialogTitle: '新增司机',
      listLoading: false,
      driveFromVisible: false,
      driveAddVisible: false,
      list: [],
      page: 1,
      pageSize: 10,
      total: 0,
      driveFrom: {
        name: '',
        deptId: '',
        idcard: '',
        phone: '',
        birthDay: null,
        remark: '',
        rule: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'change'
          }
        ],
        idcard: [{ required: true, message: '请输入身份证', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId', 'deptId'])
  },
  created() {
    this.loadTable()
  },
  methods: {
    addDriver() {
      this.listLoading = true
      addDriver({
        ...this.driveFrom,
        companyId: this.companyId,
        deptId: this.deptId,
        isDriver: 1,
        isEscort: 2,
        classify: 1
      })
        .then((response) => {
          Message({
            message: response.m || '添加成功',
            type: 'success',
            duration: 2 * 1000
          })

          this.loadTable()
          this.driveFromVisible = false
        })
        .catch((error) => {
          error
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    editDriver() {
      this.listLoading = true
      editDriver({
        ...this.driveFrom,
        companyId: this.companyId,
        deptId: this.deptId
      })
        .then((response) => {
          Message({
            message: response.m || '修改成功',
            type: 'success',
            duration: 2 * 1000
          })

          this.loadTable()
          this.driveFromVisible = false
        })
        .catch((error) => {
          error
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    handleSave() {
      this.$refs['driveFrom'].validate((valid) => {
        if (valid) {
          switch (this.dialogTitle) {
            case '新增司机':
              this.addDriver()
              break
            case '修改司机':
              this.editDriver()
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
    loadTable() {
      this.listLoading = true
      getDriveList({
        pageSize: this.pageSize,
        page: this.page, // 1 y 10
        deptId: this.deptId,
        companyId: this.companyId,
        name: this.name ? this.name : undefined
      })
        .then((response) => {
          const data = response.d
          this.list = data
          this.total = response.z
        })
        .catch((error) => error)
        .finally(() => {
          this.listLoading = false
        })
    },
    handleCurrentChange(page) {
      this.page = page
      this.listLoading = true
      this.loadTable()
    },
    addDriverHandle() {
      this.dialogTitle = '新增司机'
      this.driveFromVisible = true
      this.driveFrom = {
        name: '',
        deptId: '',
        idcard: '',
        phone: '',
        isDriver: '', // 1 是 2否
        isEscort: '', // 1 是 2 否
        birthDay: null,
        classify: '', // 1 自有 2外协
        remark: '',
        rule: ''
      }
    },
    handelClick(item, row) {
      if (item === '修改') {
        this.driveFromVisible = true
        this.dialogTitle = '修改司机'
        this.driveFrom = { ...row }
      } else if (item === '删除') {
        this.$confirm('确认删除吗？')
          .then((_) => {
            delDriver({ id: row.id })
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
  .cell {
    span {
      word-break: initial;
    }
  }
}

.search-btn {
  background-color: rgba(0, 204, 102, 1);
}
.dialog-driveFrom {
  .el-select {
    width: 100%;
  }
  .el-date-editor {
    width: 100%;
  }
}
</style>

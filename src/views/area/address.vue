<template>
  <div class="app-container">
    <!-- <small>认证中心-应用管理页面</small> -->
    <div class="filter-container">
      <el-input
        v-model="addrTwo"
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
        show-overflow-tooltip
        width="80"
      />
      <el-table-column
        show-overflow-tooltip
        label="省"
        align="left"
        width="120"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.addrOne }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="市"
        align="left"
        width="280"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.addrTwo }}</span>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        label="区"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.addrThree }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="详细地址"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="联系人名称"
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
        label="经度"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.jd }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="纬度"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.wd }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180"
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="client-ruleForm"
      >
        <el-row>
          <el-col :span="22">
            <el-form-item label="省/市/区" prop="addrOne">
              <area-select
                v-model="selected"
                :data="pcaa"
                type="text"
                :level="2"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="详细地址">
              <el-input
                v-model="ruleForm.address"
                placeholder="请输入详细地址"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="经度">
              <el-input v-model="ruleForm.address" placeholder="请输入经度" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="纬度">
              <el-input v-model="ruleForm.address" placeholder="请输入纬度" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="联系人名称">
              <el-input
                v-model="ruleForm.address"
                placeholder="请输入联系人名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="手机号">
              <el-input
                v-model="ruleForm.address"
                placeholder="请输入联系人手机号"
              />
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
import { pca, pcaa } from 'area-data' // v5 or higher
import { getAreaList, addArea, delArea, editArea } from '@/api/people'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    return {
      pcaa,
      pca,
      selected: [],
      dialogTitle: '新增区域',
      addrTwo: '',
      listLoading: false,
      dialogFormVisible: false,
      list: [],
      page: 1,
      pageSize: 10,
      total: 0,
      ruleForm: {
        addrOne: null,
        addrTwo: null,
        deptId: '',
        roleId: ''
      },

      rules: {
        addrOne: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        addrTwo: [{ required: true, message: '请输入市', trigger: 'blur' }],
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
  mounted() {},
  methods: {
    loadTable() {
      getAreaList({
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
            case '新增区域':
              this.addArea()
              break
            case '修改区域':
              this.editArea()
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
    addArea() {
      this.listLoading = true
      addArea({
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
    editArea() {
      this.listLoading = true
      editArea({
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
      this.dialogTitle = '新增区域'
      for (const k of Object.keys(this.ruleForm)) {
        this.ruleForm[k] = null
      }
    },
    handelClick(item, row) {
      switch (item) {
        case '修改':
          this.dialogTitle = '修改区域'

          this.dialogFormVisible = true
          this.ruleForm = { ...row }
          break
        case '删除':
          this.$confirm('确认删除吗？')
            .then((_) => {
              delArea({ userId: row.userId })
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
 <style lang="scss" scoped>
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

::v-deep {
  .el-form-item__content {
    .area-select-wrap {
      line-height: 16px;
      display: flex;
      .area-select.medium {
        flex: 1;
      }
    }
  }
}
</style>

<template>
  <div class="app-container">
    <el-row type="flex" :gutter="20" class="depart-cont">
      <el-col :span="6">
        <el-card class="left-bg">
          <div slot="header" class="clearfix">
            <span>部门</span>
            {{ roleType }}
            <el-button
              v-if="![2, 3].includes(roleType)"
              size="small"
              style="float: right; padding: 0"
              type="text"
              icon="el-icon-edit"
              @click="addDepartClick"
            >
              新增部门
            </el-button>
          </div>
          <el-tree
            v-loading="departLoading"
            :data="departData"
            :props="defaultProps"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span>
                <!-- <el-tooltip effect="dark" content="新增部门" placement="top">
                  <i
                    v-if="node.id == 1"
                    class="el-icon-circle-plus-outline tree-btn btn-succ"
                    @click="() => append(data)"
                  />
                </el-tooltip> -->
                <el-tooltip effect="dark" content="修改部门" placement="top">
                  <i
                    v-if="![2, 3].includes(roleType)"
                    class="el-icon-edit tree-btn btn-edit"
                    @click="() => editDepart(node, data)"
                  />
                </el-tooltip>
                <el-tooltip effect="dark" content="删除部门" placement="top">
                  <i
                    v-if="![2, 3].includes(roleType)"
                    class="el-icon-delete tree-btn btn-del"
                    @click="() => remove(node, data)"
                  />
                </el-tooltip>
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="left-bg">
          <div slot="header" class="filter-container">
            <el-input
              v-model="userName"
              placeholder="请输入人员姓名"
              style="width: 200px; margin-right: 10px"
              class="filter-item"
            />
            <el-button
              class=""
              size="small"
              type="success"
              icon="el-icon-search"
              @click="loadPeople(currentDept.id)"
            >
              搜索
            </el-button>
            <el-button
              v-if="![2, 3].includes(roleType)"
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

            <el-table-column
              label="部门名称"
              align="left"
              header-align="center"
            >
              <template slot-scope="{ row }">
                <span>{{ row.deptName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="角色类型"
              align="left"
              header-align="center"
            >
              <template slot-scope="{ row }">
                <span>{{ row.roleType }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="角色名称"
              align="left"
              header-align="center"
            >
              <template slot-scope="{ row }">
                <span>{{ row.roleName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              v-if="![2, 3].includes(roleType)"
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
        </el-card>
      </el-col>
    </el-row>

    <el-dialog :title="dialogDepartTitle" :visible.sync="dialogDepart">
      <el-form
        ref="deportForm"
        :model="deportForm"
        :rules="rules"
        label-width="100px"
        class="client-deportForm"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="部门名称" prop="name">
              <el-input
                v-model="deportForm.name"
                placeholder="请输入部门名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDepart = false"> 取消 </el-button>
        <el-button type="primary" @click="handleSave"> 确认 </el-button>
      </div>
    </el-dialog>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rulesPeople"
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
          <!-- <el-col :span="11">
            <el-form-item label="部门">
              {{ ruleForm.deptId }}
              <el-select-tree
                v-model="ruleForm.deptId"
                :popper-append-to-body="false"
                placeholder="请选择部门"
                :data="selectTreeData"
                :props="props"
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="11">
            <el-form-item label="角色" prop="roleId">
              <el-select v-model="ruleForm.roleId" placeholder="请选择角色">
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
        <el-button type="primary" @click="handleSavePeople()"> 确认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import {
  getRoleList,
  getDeportList,
  addDeport,
  editDeport,
  delDeport,
  addPeople,
  editPeople,
  delPeople
} from '@/api/people'
import { mapGetters } from 'vuex'
import { getPeopleList } from '../../api/people'
// import ElSelectTree from 'el-select-tree'
export default {
  components: {
    // ElSelectTree
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogTitle: '新增人员',
      dialogDepartTitle: '新增部门',
      currentDept: null,
      dialogDepart: false,
      userName: '',
      listLoading: false,
      departLoading: false,
      list: [],
      roleValue: '',
      roleOption: [],
      selectTreeValue: '',
      // selectTreeData: [],
      // props: {
      //   value: 'id',
      //   label: 'name',
      //   children: 'd'
      // },
      deportForm: {
        name: ''
      },
      higherServiceList: [],
      page: 1,
      pageSize: 10,
      total: 0,
      ruleForm: {
        userName: null,
        phone: null,
        deptId: '',
        roleId: ''
      },
      rulesPeople: {
        userName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        deptId: [{ required: true, message: '请选择部门', trigger: 'change' }],
        roleId: [{ required: true, message: '请选择角色', trigger: 'change' }]
      },
      rules: {
        name: [{ required: true, message: '请输入服务名称', trigger: 'blur' }],
        companyId: [
          { required: true, message: '请输入服务路径', trigger: 'blur' }
        ]
      },
      departData: [],
      defaultProps: {
        children: 'd',
        label: 'name'
      }
    }
  },
  computed: {
    ...mapGetters(['companyId', 'deptId', 'roleType'])
  },
  created() {
    this.getDeportList()
    this.getRoleList()
  },
  methods: {
    openNew() {
      this.dialogFormVisible = true
      this.dialogTitle = '新增人员'
      for (const k of Object.keys(this.ruleForm)) {
        this.ruleForm[k] = null
      }
      this.ruleForm.deptId = this.currentDept.id
    },
    addDepartClick() {
      // 新增子部门
      this.dialogDepartTitle = '新增部门'
      this.dialogDepart = true
    },
    handleNodeClick(data) {
      // 加载当前部门得人员
      this.currentDept = data
      this.loadPeople(data.id)
    },
    loadPeople(deptId) {
      getPeopleList({
        pageSize: this.pageSize,
        page: this.page, // 1 y 10
        deptId: deptId,
        companyId: this.companyId,
        userName: this.userName ? this.userName : undefined
      })
        .then((response) => {
          const data = response.d
          this.list = data
          this.total = response.z
          this.listLoading = false
        })
        .catch((error) => error)
    },
    getDeportList() {
      getDeportList({
        pageSize: 9999,
        page: 1, // 1 y 10
        id: this.deptId,
        companyId: this.companyId
      })
        .then((response) => {
          if (response.d && response.d.length > 0) {
            const data = response.d
            this.departData = data
            this.currentDept = data[0]
            this.loadPeople(this.deptId)
          }
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
          // this.selectTreeData = data
        })
        .catch((error) => error)
    },
    handleCurrentChange(page) {
      this.page = page
      this.listLoading = true
      this.loadPeople(this.currentDept.id)
    },
    editDepart(node, data) {
      this.dialogDepartTitle = '修改部门'
      this.dialogDepart = true
      this.currentDept = data
      this.deportForm.name = data.name
    },
    remove(node, data) {
      this.$confirm('确认删除吗？')
        .then((_) => {
          delDeport({ id: data.id })
            .then((response) => {
              Message({
                message: response.m || '删除成功',
                type: 'success',
                duration: 2 * 1000
              })

              if (response.a === 200) {
                this.getDeportList()
                this.dialogDepart = false
              }
            })
            .catch((error) => {
              console.log(error, 'eee')
            })
        })
        .catch((_) => {
          console.log(_, '取消删除了')
        })
    },
    handleSavePeople(type) {
      this.ruleForm.deptId = this.currentDept.id
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
    handleSave() {
      this.$refs['deportForm'].validate((valid) => {
        if (valid) {
          this.departLoading = true

          switch (this.dialogDepartTitle) {
            case '新增部门':
              addDeport({
                ...this.deportForm,
                parentId: 1,
                companyId: this.companyId
              })
                .then((response) => {
                  Message({
                    message: response.m || '添加成功',
                    type: 'success',
                    duration: 2 * 1000
                  })
                  if (response.a === 200) {
                    this.getDeportList()
                    this.dialogDepart = false
                  }
                })
                .catch((error) => error)
                .finally(() => {
                  this.departLoading = false
                })
              break
            case '修改部门':
              editDeport({
                ...this.deportForm,
                id: this.currentDept.id
              })
                .then((response) => {
                  Message({
                    message: response.m || '修改成功',
                    type: 'success',
                    duration: 2 * 1000
                  })
                  if (response.a === 200) {
                    this.getDeportList()
                    this.dialogDepart = false
                  }
                })
                .catch((error) => error)
                .finally(() => {
                  this.departLoading = false
                })
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
          this.dialogFormVisible = false
          this.loadPeople(this.currentDept.id)
        })
        .catch((error) => error)
    },
    editPeople() {
      this.listLoading = true
      editPeople({
        ...this.ruleForm,
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
          this.loadPeople(this.currentDept.id)
        })
        .catch((error) => error)
    },
    handelClick(item, row) {
      this.ruleForm.deptId = this.currentDept.id
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
                  this.loadPeople(this.currentDept.id)
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
.depart-cont {
  height: 100%;
  .left-bg {
    height: 100%;
  }
  .tree-btn {
    margin-left: 10px;
    &.btn-succ {
      color: #67c23a;
    }
    &.btn-edit {
      color: #66b1ff;
    }
    &.btn-del {
      color: #f56c6c;
    }
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
}

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
.service-deportForm {
  .el-select {
    width: 85%;
  }
}
</style>

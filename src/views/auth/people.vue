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
        show-overflow-tooltip
        width="80"
      />
      <el-table-column
        show-overflow-tooltip
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
        show-overflow-tooltip
        label="手机号"
        align="left"
        width="280"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        show-overflow-tooltip
        label="公司id"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.companyId }}</span>

        </template>
      </el-table-column> -->
      <el-table-column
        show-overflow-tooltip
        label="部门名称"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="角色类型"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.roleType }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="角色名称"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.roleName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        show-overflow-tooltip
        label="人员id"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="操作"
        width="400"
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
            <el-button
              key="角色设置"
              size="mini"
              type="primary"
              icon="el-icon-share"
              @click="handelClick('角色设置', row)"
            >
              角色设置
            </el-button>
            <el-button
              key="部门设置"
              size="mini"
              type="primary"
              icon="el-icon-share"
              @click="handelClick('部门设置', row)"
            >
              部门设置
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
              <el-input v-model="ruleForm.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="公司id" prop="companyId">
              <el-input
                v-model="ruleForm.companyId"
                placeholder="请输入公司id"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="ruleForm.password"
                type="password"
                placeholder="请输入密码"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="部门" prop="deptId">
              <el-select-tree
                v-model="selectTreeValue"
                :popper-append-to-body="false"
                placeholder="请选择部门"
                :data="selectTreeData"
                :props="props"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="角色" prop="roleId">
              <el-select v-model="roleValue" placeholder="请选择角色">
                <el-option
                  v-for="item in roleOption"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="handleSave"> 确认 </el-button>
      </div>
    </el-dialog>
    <el-dialog title="部门设置" :visible.sync="dialogApply">
      <el-tree
        :data="data"
        show-checkbox
        node-key="id"
        :default-expanded-keys="[3]"
        :props="defaultProps"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogApply = false"> 取消 </el-button>
        <el-button type="primary"> 确认 </el-button>
      </div>
    </el-dialog>
    <el-dialog title="角色设置" :visible.sync="dialogAuthApply">
      <el-tree
        :data="data"
        show-checkbox
        node-key="id"
        :default-expanded-keys="[3]"
        :props="defaultProps"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAuthApply = false"> 取消 </el-button>
        <el-button type="primary"> 确认 </el-button>
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
      dialogTitle: '新增人员',
      phone: '',
      listLoading: false,
      dialogFormVisible: false,
      dialogApply: false,
      dialogAuthApply: false,
      list: [{}],
      roleValue: '',
      roleOption: [
        {
          roleId: '1',
          roleName: '角色1'
        },
        {
          roleId: '2',
          roleName: '角色2'
        },
        {
          roleId: '3',
          roleName: '角色3'
        },
        {
          roleId: '4',
          roleName: '角色4'
        },
        {
          roleId: '5',
          roleName: '角色5'
        }
      ],
      selectTreeValue: '',
      selectTreeData: [
        {
          id: 1,
          name: 1,
          child: [{ id: 2, name: 2 }]
        }
      ],
      props: {
        value: 'id',
        label: data => data.name,
        children: 'child'
      },
      page: 1,
      pageSize: 5,
      total: 0,
      ruleForm: {
        accessTokenValidity: null,
        additionalInformation: null,
        authorities: null,
        roleType: null,
        autoapprove: null,
        userName: null,
        phone: null,
        companyId: null,
        clientSecretStr: null,
        createTime: null,
        delFlag: null,
        id: null,
        ifLimit: null,
        limitCount: null,
        refreshTokenValidity: null,
        resourceIds: null,
        scope: null,
        updateTime: null,
        deptId: null
      },

      rules: {
        userName: [
          { required: true, message: '请输入应用标识', trigger: 'blur' }
        ],
        phone: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
        roleType: [
          {
            required: true,
            message: '请选择至少一种授权方式',
            trigger: 'change'
          }
        ],
        accessTokenValidity: [
          {
            required: true,
            message: '请输入access token有效期',
            trigger: 'blur'
          }
        ],
        refreshTokenValidity: [
          {
            required: true,
            message: '请输入refresh token有效期',
            trigger: 'blur'
          }
        ]
      },
      activeName: 'first',
      data: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1'
                },
                {
                  id: 10,
                  label: '三级 1-1-2'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '一级 2',
          children: [
            {
              id: 5,
              label: '二级 2-1'
            },
            {
              id: 6,
              label: '二级 2-2'
            }
          ]
        },
        {
          id: 3,
          label: '一级 3',
          children: [
            {
              id: 7,
              label: '二级 3-1'
            },
            {
              id: 8,
              label: '二级 3-2'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {},
  created() {
    // const obj = {
    //   a: '苏BH1190',
    //   b: 1627729920674,
    //   c: 1631069591000
    // }
    // const objData = {
    //   data: obj,
    //   type: [0, 0x0a, 0]
    // }
    // const carObj = {
    //   a: ['苏BH1190', '苏BH1191', '苏BH1192']
    // }
    // const carData = {
    //   data: carObj,
    //   type: [0, 0x20, 0]
    // }
    // 在使用地方调用
    // 发送消息
    // this.$setWs.emit(loginData)
    // this.$setWs.emit(objData)
    // this.$setWs.emit(carData)
  },
  methods: {
    async loadTable(pageSize, page) {
      await authApi
        .getPageResult({
          limit: this.pageSize,
          page: this.page,
          phone: this.phone
        })
        .then(response => {
          const { data } = response
          this.list = data.data
          this.total = data.count
          this.listLoading = false
        })
        .catch(error => error)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleCurrentChange(page) {
      this.page = page
      this.listLoading = true
      authApi
        .getPageResult({ limit: this.pageSize, page })
        .then(response => {
          const { data } = response
          this.list = data.data
          this.total = data.count
          this.listLoading = false
        })
        .catch(error => error)
    },
    handleSave() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          authApi
            .saveClient({ ...this.ruleForm })
            .then(response => {
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
            })
            .catch(error => error)
        } else {
          console.log('验证出错')
          return false
        }
      })
    },
    openNew() {
      this.dialogFormVisible = true
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
            .then(_ => {
              authApi
                .deleteClient({ id: row.id })
                .then(response => {
                  Message({
                    message: response.msg,
                    type: 'success',
                    duration: 2 * 1000
                  })
                  if (response.code === 200) {
                    this.loadTable()
                  }
                })
                .catch(error => {
                  console.log(error, 'eee')
                })
            })
            .catch(_ => {
              console.log(_, '取消删除了')
            })
          break
        case '部门设置':
          this.dialogApply = true
          break
        case '角色设置':
          this.dialogAuthApply = true
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

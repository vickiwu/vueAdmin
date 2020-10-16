<template>
  <div class="app-container">
    <!-- <small>认证中心-应用管理页面</small> -->
    <div class="filter-container">
      <el-input
        v-model="clientName"
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
        label="序号"
        type="index"
        sortable="custom"
        align="center"
        header-align="center"
        show-overflow-tooltip
        width="80"
      />
      <el-table-column
        show-overflow-tooltip
        label="应用标识"
        sortable="custom"
        align="left"
        width="120"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.clientId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="应用名称"
        sortable="custom"
        align="left"
        width="120"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.clientName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="应用秘钥"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.clientSecret }}</span>
          <!-- <el-tooltip effect="light" :visible-arrow="false" :content="row.clientSecret" placement="bottom-start">
            <span>{{ row.clientSecret }}</span>
          </el-tooltip> -->
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="回调地址"
        sortable="custom"
        align="left"
        width="180"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.webServerRedirectUri }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="授权方式"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.authorizedGrantTypes }}</span>
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
            <el-button
              key="应用设置"
              size="mini"
              type="primary"
              icon="el-icon-share"
              @click="handelClick('应用设置',row)"
            >应用设置</el-button>

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
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="client-ruleForm"
      >
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item
              label="应用标识"
              prop="clientId"
            >
              <el-input
                v-model="ruleForm.clientId"
                placeholder="请输入应用标识"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="应用名称"
              prop="clientName"
            >
              <el-input
                v-model="ruleForm.clientName"
                placeholder="请输入应用名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item
              label="应用密钥"
              prop="clientSecret"
            >
              <el-input
                v-model="ruleForm.clientSecret"
                placeholder="请输入应用秘钥"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="范围"
              prop="scope"
            >
              <el-select
                v-model="ruleForm.scope"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in appScopeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item
              label="授权方式"
              prop="authorizedGrantTypes"
            >
              <el-select
                v-model="ruleForm.authorizedGrantTypes"
                placeholder="请选择授权方式"
              >
                <el-option
                  v-for="item in methodList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="回调地址"
              prop="webServerRedirectUri"
            >
              <el-input
                v-model="ruleForm.webServerRedirectUri"
                placeholder="请输入回调地址"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item
              label="有效期1"
              prop="accessTokenValidity"
            >
              <el-input
                v-model="ruleForm.accessTokenValidity"
                placeholder="请输入access token有效期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="有效期2"
              prop="refreshTokenValidity"
            >
              <el-input
                v-model="ruleForm.refreshTokenValidity"
                placeholder="请输入refresh token有效期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item
              label="自动授权"
              prop="autoapprove"
            >
              <el-radio-group v-model="ruleForm.autoapprove">
                <el-radio label="true">是</el-radio>
                <el-radio label="false">否</el-radio>
              </el-radio-group>
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
    <el-dialog
      title="应用设置"
      :visible.sync="dialogApply"
    >
      <el-tabs
        v-model="activeName"
        type="card"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="菜单"
          name="first"
        >
          <div>
            <el-tree
              :data="data"
              show-checkbox
              node-key="id"
              :default-expanded-keys="[2, 3]"
              :default-checked-keys="[5]"
              :props="defaultProps"
            />

          </div>
        </el-tab-pane>
        <el-tab-pane
          label="配置管理"
          name="second"
        >
          <el-tree
            :data="data"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[1,2, 3]"
            :default-checked-keys="[5]"
            :props="defaultProps"
          />
        </el-tab-pane>
        <el-tab-pane
          label="角色管理"
          name="third"
        >
          <el-tree
            :data="data"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[3]"
            :props="defaultProps"
          />
        </el-tab-pane>
      </el-tabs>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogApply = false">
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
import authApi from '@/api/auth'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      dialogTitle: '新增应用',
      clientName: '',
      listLoading: true,
      dialogFormVisible: false,
      dialogApply: false,
      btnList: [{ txt: '修改', class: '', icon: 'el-icon-edit' }, { txt: '删除', class: 'danger', icon: 'el-icon-delete' }, { txt: '应用设置', class: 'primary', icon: 'el-icon-share' }],
      list: [],
      page: 1,
      pageSize: 5,
      total: 0,
      ruleForm: {
        accessTokenValidity: null,
        additionalInformation: null,
        authorities: null,
        authorizedGrantTypes: null,
        autoapprove: null,
        clientId: null,
        clientName: null,
        clientSecret: null,
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
        webServerRedirectUri: null
      },
      appScopeList: [{
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
      methodList: [{
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
        clientId: [
          { required: true, message: '请输入应用标识', trigger: 'blur' }
        ],
        clientName: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ],
        authorizedGrantTypes: [{ required: true, message: '请选择至少一种授权方式', trigger: 'change' }],
        accessTokenValidity: [
          { required: true, message: '请输入access token有效期', trigger: 'blur' }
        ],
        refreshTokenValidity: [
          { required: true, message: '请输入refresh token有效期', trigger: 'blur' }
        ]

      },
      activeName: 'first',
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
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
      await authApi.getPageResult({ limit: this.pageSize, page: this.page, clientName: this.clientName }).then((response) => {
        const { data } = response
        this.list = data.data
        this.total = data.count
        this.listLoading = false
      }).catch(error => error)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleCurrentChange(page) {
      this.page = page
      this.listLoading = true
      authApi.getPageResult({ limit: this.pageSize, page }).then((response) => {
        const { data } = response
        this.list = data.data
        this.total = data.count
        this.listLoading = false
      }).catch(error => error)
    },
    handleSave() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          authApi.saveClient({ ...this.ruleForm }).then((response) => {
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
        this.ruleForm[k] = null
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
            authApi.deleteClient({ id: row.id }).then((response) => {
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
      } else if (item === '应用设置') {
        this.dialogApply = true
        // this.$router.push({ path: '/auth/client/add' })
      }
    }
  }
}
</script>
 <style lang="scss">
.auth-table {
  .el-button--mini,.el-button--mini.is-round {
    padding: 5px 10px;
  }
}

.search-btn {
  background-color: rgba(0, 204, 102, 1);
}
.client-ruleForm {
  .el-select {
    width: 85%;
  }
}
</style>

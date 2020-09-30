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
        width="100"
        sortable="custom"
        align="center"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.status"
            disabled
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
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
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="client-ruleForm">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="应用标识" prop="appId">
              <el-input v-model="ruleForm.appId" placeholder="请输入应用标识" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="应用名称" prop="appName">
              <el-input v-model="ruleForm.appName" placeholder="请输入应用名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="应用密钥" prop="appKey">
              <el-input v-model="ruleForm.appKey" placeholder="请输入应用秘钥" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="范围" prop="appScope">
              <el-select v-model="ruleForm.appScope" placeholder="请选择">
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
            <el-form-item label="授权方式" prop="method">
              <el-select v-model="ruleForm.method" placeholder="请选择授权方式">
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
            <el-form-item label="回调地址" prop="appAddress">
              <el-input v-model="ruleForm.appAddress" placeholder="请输入回调地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="自动授权" prop="auto">
              <el-radio-group v-model="ruleForm.auto">
                <el-radio label="是" />
                <el-radio label="否" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="ruleForm.status">
                <el-radio label="正常" />
                <el-radio label="锁定" />
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="有效期1" prop="validity1">
              <el-input v-model="ruleForm.validity1" placeholder="请输入access token有效期" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="有效期2" prop="validity2">
              <el-input v-model="ruleForm.validity2" placeholder="请输入refresh token有效期" />
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
    <el-dialog
      title="应用设置"
      :visible.sync="dialogApply"
    >
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="菜单" name="first">
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
        <el-tab-pane label="配置管理" name="second">
          <el-tree
            :data="data"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[1,2, 3]"
            :default-checked-keys="[5]"
            :props="defaultProps"
          />
        </el-tab-pane>
        <el-tab-pane label="角色管理" name="third">
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

export default {
  data() {
    return {
      searchWords: '',
      listLoading: false,
      dialogFormVisible: false,
      dialogApply: false,
      list: [
        { id: 1, appId: 'webApp', appName: '管理后台', appKey: '加密内容', url: 'http://www....', authMethod: '密码模式，客户端授权模式', status: 0, edit: [{ txt: '修改', class: '', icon: 'el-icon-edit' }, { txt: '删除', class: 'danger', icon: 'el-icon-delete' }, { txt: '应用设置', class: 'primary', icon: 'el-icon-share' }] },
        { id: 2, appId: 'webApp', appName: '管理后台', appKey: '加密内容', url: 'http://www....', authMethod: '密码模式，客户端授权模式', status: 0, edit: [{ txt: '修改', class: '', icon: 'el-icon-edit' }, { txt: '删除', class: 'danger', icon: 'el-icon-delete' }, { txt: '应用设置', class: 'primary', icon: 'el-icon-share' }] }
      ],
      ruleForm: {
        appId: '',
        appName: '',
        appKey: '',
        appScope: '',
        method: '',
        appAddress: '',
        auto: '',
        status: '',
        validity1: '',
        validity2: ''

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
        appId: [
          { required: true, message: '请输入应用标识', trigger: 'blur' }
        ],
        appName: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ],
        method: [{ required: true, message: '请选择至少一种授权方式', trigger: 'change' }],
        validity1: [
          { required: true, message: '请输入access token有效期', trigger: 'blur' }
        ],
        validity2: [
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
    total() {
      return this.list.length
    }
  },
  created() {
    // console.log(1)
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
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
      } else if (item.txt === '应用设置') {
        this.dialogApply = true
        // this.$router.push({ path: '/auth/client/add' })
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
  .client-ruleForm{
    .el-select{
      width: 85%;
    }
  }
 </style>

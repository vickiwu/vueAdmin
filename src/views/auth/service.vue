<template>
  <div class="app-container">
    <!-- <small>认证中心-应用管理页面</small> -->
    <div class="filter-container">
      <el-input
        v-model="name"
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
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      border
      fit
      highlight-current-row
      style="width: 100%;margin: 10px 0;"
    >
      <el-table-column
        show-overflow-tooltip
        label="序号"
        type="index"
        sortable="custom"
        align="center"
        header-align="center"
        width="80"
      />
      <el-table-column
        show-overflow-tooltip
        label="服务名称"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="服务路径"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="服务类型"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="创建时间"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.createTimeStr }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="排序"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.sort }}</span>
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
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="新增应用"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="service-ruleForm"
      >
        <el-row :gutter="20">
          <el-col :span="21">
            <el-form-item
              label="服务名称"
              prop="name"
            >
              <el-input
                v-model="ruleForm.name"
                placeholder="请输入服务名称"
              />
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :gutter="20">

          <el-col :span="21">
            <el-form-item
              label="服务路径"
              prop="path"
            >
              <el-input
                v-model="ruleForm.path"
                placeholder="请输入服务路径"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="21">
            <el-form-item
              label="上级服务"
              prop="parentId"
            >
              <el-select
                v-model="ruleForm.parentId"
                placeholder="请选择上级服务"
              >
                <el-option
                  v-for="item in higherServiceList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="21">
            <el-form-item
              label="排序"
              prop="sort"
            >
              <el-input
                v-model="ruleForm.sort"
                placeholder="请输入显示序号"
              />
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
        <el-button
          type="primary"
          @click="handleSave"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="应用设置"
      :visible.sync="dialogApply"
    >
      应用设置
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
      name: '',
      listLoading: true,
      dialogFormVisible: false,
      dialogApply: false,
      list: [
        {
          id: 1, name: '认证中心', path: '/api-auth',
          children: [
            { id: 2, name: '认证中心', path: '/api-auth', typeName: '服务', createTimeStr: '2020-08-11 10:10:10', sort: '1', edit: [{ txt: '修改', class: '', icon: 'el-icon-edit' }, { txt: '删除', class: 'danger', icon: 'el-icon-delete' }] },
            { id: 3, name: '认证中心', path: '/api-auth', typeName: '服务', createTimeStr: '2020-08-11 10:10:10', sort: '1', edit: [{ txt: '修改', class: '', icon: 'el-icon-edit' }, { txt: '删除', class: 'danger', icon: 'el-icon-delete' }] }
          ],
          typeName: '服务', createTimeStr: '2020-08-11 10:10:10', sort: '1', edit: [{ txt: '修改', class: '', icon: 'el-icon-edit' }, { txt: '删除', class: 'danger', icon: 'el-icon-delete' }]
        },
        { id: 4, name: '认证中心', path: '/api-auth', typeName: '服务', createTimeStr: '2020-08-11 10:10:10', sort: '1', edit: [{ txt: '修改', class: '', icon: 'el-icon-edit' }, { txt: '删除', class: 'danger', icon: 'el-icon-delete' }] }
      ],
      ruleForm: {
        name: '',
        path: '',
        typeName: '',
        parentId: '',
        sort: ''
      },
      higherServiceList: [],

      rules: {
        name: [
          { required: true, message: '请输入服务名称', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入服务路径', trigger: 'blur' }
        ]

      }
    }
  },
  computed: {

  },
  created() {
    this.loadTable()
    this.getHigherServiceList()
  },
  methods: {
    async getHigherServiceList() {
      await authApi.getSysServiceSelect().then((response) => {
        const { data } = response
        this.higherServiceList = data
      })
    },
    async loadTable() {
      await authApi.getSysServiceTableTree({ name: this.name }).then((response) => {
        const { data } = response
        this.list = data
        this.listLoading = false
      }).catch(error => error)
    },
    handleSave() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          authApi.saveService({ ...this.ruleForm }).then((response) => {
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
            authApi.deleteService({ id: row.id }).then((response) => {
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
.service-ruleForm {
  .el-select {
    width: 85%;
  }
}
</style>

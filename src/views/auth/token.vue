<template>
  <div class="app-container">
    <!-- <small>认证中心-应用管理页面</small> -->
    <div class="filter-container">
      <el-input
        v-model="userName"
        placeholder="请输入关键字"
        style="width: 200px;margin-right: 10px;"
        class="filter-item"
      />
      <el-button
        class=""
        size="small-dd"
        type="success"
        icon="el-icon-search"
        @click="loadTable()"
      >
        搜索
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
        width="80"
      />
      <el-table-column
        label="令牌"
        sortable="custom"
        align="left"
        header-align="center"
        width="300"
      >
        <template slot-scope="{ row }">
          <span :title="row.tokenValue">{{ row.tokenValue }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户ID"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span :title="row.id">{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="登录账户"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span :title="row.userName">{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="应用标识"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span :title="row.clientId">{{ row.clientId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span :title="row.tokenType">{{ row.tokenType }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="授权方式"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span :title="row.grantType">{{ row.grantType }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="过期时间"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span :title="row.expiresDate">{{ row.expiresDate }}</span>
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
            <el-button
              key="查看"
              size="mini"
              icon="el-icon-search"
              @click="handelClick('查看',row)"
            >查看</el-button>
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
    <el-pagination
      background
      layout="total, prev, pager, next"
      :total="total"
      :page-size="pageSize"
      @current-change="handleCurrentChange"
    />
    <el-dialog
      title="查看令牌"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="tokenForm"
        label-width="100px"
      >
        <el-form-item label="验证令牌：">
          {{ tokenForm.tokenValue }}
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户ID：">
              {{ tokenForm.id }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录账号：">
              {{ tokenForm.userName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名称：">
              {{ tokenForm.personName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型：">
              {{ tokenForm.tokenType }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="应用标识：">
              {{ tokenForm.clientId }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授权方式：">
              {{ tokenForm.grantType }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建时间：">
              {{ tokenForm.createTimeStr }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期限：">
              {{ tokenForm.expiresDate }}
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

    </el-dialog>

  </div>
</template>

<script>
import authApi from '@/api/auth'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      userName: '',
      listLoading: true,
      dialogFormVisible: false,
      dialogApply: false,
      list: [],
      page: 1,
      pageSize: 5,
      total: 0,
      tokenForm: {
        tokenValue: '',
        id: '',
        userName: '',
        personName: '',
        tokenType: '',
        grantType: '',
        clientId: '',
        expiresDate: '',
        createTimeStr: ''
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
      await authApi.getTokenList({ limit: this.pageSize, page: this.page, userName: this.userName }).then((response) => {
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
    handelClick(item, row) {
      if (item === '查看') {
        this.dialogFormVisible = true
        this.tokenForm = { ...row }
      } else if (item === '删除') {
        this.$confirm('确认删除吗？')
          .then(_ => {
            authApi.removeToken({ id: row.id }).then((response) => {
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

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
        label="访问IP地址"
        sortable="custom"
        align="left"
        header-align="center"
        show-overflow-tooltip
        width="150"
      >
        <template slot-scope="{ row }">
          <span>{{ row.ipAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="AccessToken"
        sortable="custom"
        align="left"
        header-align="center"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <span>{{ row.accessToken }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="RefreshToken"
        sortable="custom"
        align="left"
        header-align="center"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <span>{{ row.refreshToken }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="应用名称"
        sortable="custom"
        align="left"
        header-align="center"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <span>{{ row.clientName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="授权方式"
        sortable="custom"
        align="left"
        header-align="center"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <span>{{ row.grantType }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="被授权账号"
        sortable="custom"
        align="left"
        header-align="center"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="授权时间"
        sortable="custom"
        align="left"
        header-align="center"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <span>{{ row.authDateStr }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="300"
        align="right"
        header-align="center"
        show-overflow-tooltip
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
      title="查看授权记录"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="tokenForm"
        label-width="100px"
      >
        <el-form-item label="访问令牌：">
          {{ tokenForm.accessToken }}
        </el-form-item>
        <el-form-item label="刷新令牌：">
          {{ tokenForm.refreshToken }}
        </el-form-item>
        <el-form-item label="授权码：">
          {{ tokenForm.authCode }}
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户ID：">
              {{ tokenForm.userId }}
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
            <el-form-item label="授权方式：">
              {{ tokenForm.grantType }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="应用名称： ">
              {{ tokenForm.clientName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="访问IP：">
              {{ tokenForm.ipAddress }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="授权时间：">
              {{ tokenForm.authDateStr }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="失效时间： ">
              {{ tokenForm.expireDateStr }}
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
      clientName: '',
      listLoading: true,
      dialogFormVisible: false,
      dialogApply: false,
      list: [],
      page: 1,
      pageSize: 5,
      total: 0,
      tokenForm: {
        accessToken: '',
        refreshToken: '',
        authCode: '',
        userId: '',
        userName: '',
        personName: '',
        grantType: '',
        clientName: '',
        ipAddress: '',
        authDateStr: '',
        expireDateStr: ''

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
      await authApi.getSysAuthPageResult({ limit: this.pageSize, page: this.page, clientName: this.clientName }).then((response) => {
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
            authApi.deleteSysAuthLog({ id: row.logId }).then((response) => {
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

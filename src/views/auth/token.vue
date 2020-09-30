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
        label="令牌"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.token }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户ID"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="登录账户"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.userName }}</span>
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
        label="类型"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.appType }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="授权方式"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.appMethod }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="过期时间"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.failureTime }}</span>
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
      title="查看令牌"
      :visible.sync="dialogFormVisible"
    >
      <el-form ref="tokenForm" label-width="100px">
        <el-form-item label="验证令牌：">
          {{ tokenForm.token }}
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
              {{ tokenForm.userName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型：">
              {{ tokenForm.appType }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="应用标识：">
              {{ tokenForm.appId }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授权方式：">
              {{ tokenForm.appMethod }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建时间：">
              {{ tokenForm.failureTime }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期限：">
              {{ tokenForm.failureTime }}
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

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
        { id: 1, token: '认证中心', userId: '/api-auth', userName: '服务', appId: 'webApp', appType: '1', 'appMethod': '密码模式', failureTime: '2020-08-11 12:12:12', edit: [{ txt: '查看', class: 'primary', icon: 'el-icon-search' }, { txt: '删除', class: 'danger', icon: 'el-icon-delete' }] },
        { id: 2, token: '认证中心', userId: '/api-auth', userName: '服务', appId: 'webApp', appType: '1', 'appMethod': '密码模式', failureTime: '2020-08-11 12:12:12', edit: [{ txt: '查看', class: 'primary', icon: 'el-icon-search' }, { txt: '删除', class: 'danger', icon: 'el-icon-delete' }] }
      ],
      tokenForm: {
        token: '2fdcc07b-b657-4379-a396-d951a22e1872',
        userId: '',
        userName: '',
        appType: '',
        appMethod: '',
        appId: '',
        failureTime: ''
      }

    }
  },
  computed: {
    total() {
      return this.list.length
    }
  },
  created() {
    console.log(1)
  },
  methods: {
    handelClick(item, row) {
      if (item.txt === '查看') {
        this.dialogFormVisible = true
        this.tokenForm = { ...row }
      } else if (item.txt === '删除') {
        this.$confirm('确认删除吗？')
          .then(_ => {
            console.log(_, '删除了')
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
 .auth-table{
 .el-button--mini, .el-button--mini.is-round {
    padding: 5px 10px;
}
 }

  .search-btn{
    background-color: rgba(0, 204, 102, 1);
  }
  .service-ruleForm{
    .el-select{
      width: 85%;
    }

  }
 </style>

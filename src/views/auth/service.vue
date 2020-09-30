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
        label="服务名称"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.serviceName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="服务路径"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.servicePath }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="服务类型"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.serviceType }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="排序"
        sortable="custom"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.order }}</span>
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
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="service-ruleForm">
        <el-row :gutter="20">
          <el-col :span="21">
            <el-form-item label="服务名称" prop="serviceName">
              <el-input v-model="ruleForm.serviceName" placeholder="请输入服务名称" />
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :gutter="20">

          <el-col :span="21">
            <el-form-item label="服务路径" prop="servicePath">
              <el-input v-model="ruleForm.servicePath" placeholder="请输入服务路径" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="21">
            <el-form-item label="上级服务" prop="higherService">
              <el-select v-model="ruleForm.higherService" placeholder="请选择上级服务">
                <el-option
                  v-for="item in higherServiceList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="21">
            <el-form-item label="排序" prop="order">
              <el-input v-model="ruleForm.order" placeholder="请输入显示序号" />
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
export default {
  data() {
    return {
      searchWords: '',
      listLoading: false,
      dialogFormVisible: false,
      dialogApply: false,
      list: [
        { id: 1, serviceName: '认证中心', servicePath: '/api-auth', serviceType: '服务', time: '2020-08-11 10:10:10', order: '1', edit: [{ txt: '修改', class: '', icon: 'el-icon-edit' }, { txt: '删除', class: 'danger', icon: 'el-icon-delete' }] },
        { id: 2, serviceName: '认证中心', servicePath: '/api-auth', serviceType: '服务', time: '2020-08-11 10:10:10', order: '1', edit: [{ txt: '修改', class: '', icon: 'el-icon-edit' }, { txt: '删除', class: 'danger', icon: 'el-icon-delete' }] }
      ],
      ruleForm: {
        serviceName: '',
        servicePath: '',
        serviceType: '',
        higherService: '',
        order: ''
      },
      higherServiceList: [{
        value: '选项1',
        label: '认证中心'
      }, {
        value: '选项2',
        label: '用户中心'
      }, {
        value: '选项3',
        label: '文件中心'
      }, {
        value: '选项4',
        label: '短信中心'
      }, {
        value: '选项5',
        label: '注册中心'
      }],

      rules: {
        serviceName: [
          { required: true, message: '请输入服务名称', trigger: 'blur' }
        ],
        servicePath: [
          { required: true, message: '请输入服务路径', trigger: 'blur' }
        ]

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
        // this.dialogApply = true
        this.$router.push({ path: '/auth/client/add' })
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

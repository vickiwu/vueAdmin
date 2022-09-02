<template>
  <div class="app-container">
    <!-- <small>认证中心-应用管理页面</small> -->
    <div class="filter-container">
      <el-input
        v-model="searchStr"
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
        width="80"
      />
      <el-table-column
        label="类型"
        align="left"
        width="80"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{
            row.type === 1 ? '装货地' : row.type === 2 ? '卸货地' : '--'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="省" align="left" width="80" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.addrOne }}</span>
        </template>
      </el-table-column>
      <el-table-column label="市" width="80" align="left" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.addrTwo }}</span>
        </template>
      </el-table-column>

      <el-table-column label="区" width="80" align="left" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.addrThree }}</span>
        </template>
      </el-table-column>
      <el-table-column label="详细地址" align="left" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="联系人名称"
        width="150"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.contactName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="联系人手机号"
        width="110"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.contactPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="经度"
        width="110"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.jd }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="纬度"
        width="110"
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
  </div>
</template>

<script>
import { setAreaDetail } from '@/utils/auth'
import { getAreaList, delArea } from '@/api/people'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    return {
      searchStr: '',
      listLoading: false,
      list: [],
      page: 1,
      pageSize: 10,
      total: 0
    }
  },
  computed: {
    ...mapGetters(['companyId', 'deptId', 'userId'])
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

    handleCurrentChange(page) {
      this.page = page
      this.listLoading = true
      this.loadTable()
    },

    openNew() {
      this.$router.push('/area/add')
    },
    handelClick(item, row) {
      switch (item) {
        case '修改':
          this.$router.push('/area/edit')
          // 存local 数据
          setAreaDetail(row)
          break
        case '删除':
          this.$confirm('确认删除吗？')
            .then((_) => {
              delArea({ id: row.id })
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
</style>

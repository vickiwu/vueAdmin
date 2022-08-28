<template>
  <div class="list-card">
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
        订单发布
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      class="order-table scrollBar"
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
        width="50"
      />
      <el-table-column
        show-overflow-tooltip
        label="订单编号"
        width="120"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="产品牌号"
        width="120"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.msdsName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="提货时间"
        width="120"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.planGetMsdsTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="装货吨数"
        width="120"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.loadNum }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="托运方"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.customerName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="客户"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.customerContactName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="客户电话"
        width="120"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.customerPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="承运方"
        width="120"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.transportName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="起运市"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.loadTwo }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="起运详细地址"
        width="130"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.loadAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="送达城市"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.unLoadTwo }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="送货详细地址"
        width="130"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.unLoadAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="车型要求"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.carNeed }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="备注"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="车牌号"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.carNo }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="东华备注"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.dhRemark }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        :width="width"
        align="right"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div style="display: flex; justify-content: flex-end">
            <el-button
              v-if="[1, 3, 4].includes(orderType)"
              size="mini"
              @click="handelClick('编辑', row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="[1].includes(orderType)"
              size="mini"
              @click="handelClick('派车', row)"
            >
              派车
            </el-button>
            <el-button
              v-if="[3, 4, 8, 10].includes(orderType)"
              size="mini"
              @click="handelClick('轨迹', row)"
            >
              轨迹
            </el-button>

            <el-button
              v-if="[8].includes(orderType)"
              size="mini"
              @click="handelClick('查看回单', row)"
            >
              查看回单
            </el-button>
            <el-button
              v-if="[3, 4].includes(orderType)"
              size="mini"
              @click="handelClick('上传回单', row)"
            >
              上传回单
            </el-button>
            <el-button
              v-if="[8].includes(orderType)"
              size="mini"
              @click="handelClick('完成', row)"
            >
              完成
            </el-button>
            <el-button
              v-if="[1, 3, 4].includes(orderType)"
              size="mini"
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
import { getOrderList, getOrderListCustom, delOrder } from '@/api/order'
import { setOrderDetail } from '@/utils/auth'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
export default {
  name: 'ListCard',
  components: {},
  props: {
    orderType: {
      type: Number,
      required: true
    }
  },
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
    ...mapGetters(['companyId', 'deptId', 'userId', 'roleType'])
  },
  created() {
    switch (this.roleType) {
      case 10:
      case 11:
        this.loadCustomTable()
        break
      default:
        this.loadTable()
        break
    }
    switch (this.orderType) {
      case 3:
      case 4:
        this.width = 260 // 4个
        break
      case 1:
        this.width = 180 // 3个
        break
      case 8:
        this.width = 200 // 3个
        // this.width = 150 // 2个
        break
      default:
        this.width = 70
        break
    }
  },
  mounted() {},
  methods: {
    loadTable() {
      getOrderList({
        pageSize: this.pageSize,
        page: this.page, // 1 y 10
        deptId: this.deptId,
        companyId: this.companyId,
        status: +this.orderType
      })
        .then((response) => {
          const data = response.d
          console.log(
            '%c 🦐 data: ',
            'font-size:20px;background-color: #42b983;color:#fff;',
            data
          )
          this.list = data
          this.total = response.z
          this.listLoading = false
          if (data === null) {
            this.list = [{}]
          }
        })
        .catch((error) => error)
    },
    loadCustomTable() {
      getOrderListCustom({
        pageSize: this.pageSize,
        page: this.page, // 1 y 10
        deptId: this.deptId,
        companyId: this.companyId,
        status: +this.orderType
      })
        .then((response) => {
          const data = response.d

          this.list = data
          this.total = response.z
          this.listLoading = false
          if (!data) {
            this.list = [{}]
          }
        })
        .catch((error) => error)
    },

    handleCurrentChange(page) {
      this.page = page
      this.listLoading = true
      this.loadTable()
    },

    openNew() {
      this.$router.push('/order/publish')
    },
    handelClick(item, row) {
      switch (item) {
        case '编辑':
          this.$router.push('/order/detail')
          this.ruleForm = { ...row }
          setOrderDetail(row)
          break
        case '删除':
          this.$confirm('确认删除吗？')
            .then((_) => {
              delOrder({ id: row.id })
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
        case '派车': // 弹框
          this.$router.push('/order/addCar')
          setOrderDetail(row)
          break
        case '上传回单': // 弹框
          // this.$router.push('/order/detail')
          this.ruleForm = { ...row }
          break
        case '查看回单': // 弹框
          // this.$router.push('/order/detail')
          this.ruleForm = { ...row }
          break
        case '轨迹':
          this.$router.push('/map/index')
          this.ruleForm = { ...row }
          setOrderDetail(row)
          break
        default:
          break
      }
    }
  }
}
</script>
 <style lang="scss" scoped>
.order-table {
  .el-button--mini,
  .el-button--mini.is-round {
    padding: 5px 10px;
  }
}

.search-btn {
  background-color: rgba(0, 204, 102, 1);
}
.list-card {
  margin-top: 10px;
  margin-left: 10px;
}
</style>

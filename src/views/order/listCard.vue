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
        v-if="![10, 11].includes(roleType)"
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
          <span>{{ row.planGetMsdsTime | parseTime('{y}-{m}-{d}') }}</span>
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
        v-if="![1].includes(orderType)"
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
              v-if="
                [1, 3, 4].includes(orderType) && ![10, 11].includes(roleType)
              "
              size="mini"
              @click="handelClick('编辑', row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="[1].includes(orderType) && ![10, 11].includes(roleType)"
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
              v-if="[3, 4].includes(orderType) && ![10, 11].includes(roleType)"
              size="mini"
              @click="handelClick('上传回单', row)"
            >
              上传回单
            </el-button>

            <el-button
              v-if="[8].includes(orderType) && ![10, 11].includes(roleType)"
              size="mini"
              @click="handelClick('完成', row)"
            >
              完成
            </el-button>
            <el-button
              v-if="
                [1, 3, 4].includes(orderType) && ![10, 11].includes(roleType)
              "
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
    <el-dialog :visible.sync="upImgShow" width="30%" title="上传回单">
      <div class="img-wrap">
        <el-upload
          drag
          :action="FILE_UPLOAD"
          :limit="1"
          accept="image/*"
          :on-success="($event) => upLoadSucc(index, $event)"
          :on-preview="handlePreview"
          :on-remove="onRemove"
          list-type="picture"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="shangCarOrderApi">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="imgShow" width="30%" title="查看回单">
      <div class="img-wrap">
        <el-image style="width: 100%; height: 260px" :src="currentImg" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getOrderList, getOrderListCustom, delOrder } from '@/api/order'

import { getCarOrderList, shangCarOrder, finishOrder } from '@/api/carOrder'
import { parseTime } from '@/utils'
import { setOrderDetail } from '@/utils/auth'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
import { HIGH_IMG_URL, FILE_UPLOAD } from '@/settings'
export default {
  name: 'ListCard',
  components: {},
  filters: {
    parseTime
  },
  props: {
    orderType: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      upDisabled: false,
      fileList: [],
      upImgShow: false,
      imgShow: false,
      currentImg: '',
      searchStr: '',
      listLoading: false,
      list: [],
      page: 1,
      pageSize: 10,
      total: 0,
      currentOrder: null,
      HIGH_IMG_URL,
      FILE_UPLOAD,
      currentCarOrderId: null
    }
  },
  computed: {
    ...mapGetters(['companyId', 'deptId', 'userId', 'roleType', 'phone'])
  },
  created() {
    this.loadTable()
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
    handlePreview(file, fileList) {
      console.log(file, fileList)
    },
    onRemove(file, fileList) {
      console.log(file, fileList)
    },
    shangCarOrderApi() {
      shangCarOrder({
        id: this.currentCarOrderId,
        fileId: this.currentFileId,
        orderId: this.currentOrder.id
      }).then((res) => {
        if (res.a === 200) {
          Message({
            message: '上传回单成功',
            type: 'success',
            duration: 2 * 1000
          })
          this.upImgShow = false
          this.loadTable()
        }
      })
    },
    loadTable() {
      switch (this.roleType) {
        case 10:
        case 11:
          this.loadCustomTable()
          break
        default:
          this.loadOrderTable()
          break
      }
    },
    loadOrderTable() {
      getOrderList({
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
        })
        .catch((error) => error)
    },
    loadCustomTable() {
      getOrderListCustom({
        pageSize: this.pageSize,
        page: this.page, // 1 y 10
        deptId: this.deptId,
        companyId: this.companyId,
        status: +this.orderType,
        phone: this.phone
      })
        .then((response) => {
          const data = response.d
          this.list = data
          this.total = response.z
          this.listLoading = false
        })
        .catch((error) => error)
    },
    upLoadSucc(index, $event) {
      this.currentFileId = $event.a
      Message({
        message: '上传成功',
        type: 'success',
        duration: 2 * 1000
      })
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
          this.currentOrder = { ...row }

          // 获取车单id
          this.getCarOrder().then((res) => {
            if (+res.a === 200 && res.d.length > 0) {
              this.currentCarOrderId = res.d[0].id
            }
            this.upImgShow = true
          })

          break
        case '查看回单': // 弹框
          this.currentOrder = { ...row }
          // 获取车单id
          this.getCarOrder().then((res) => {
            this.currentImg = HIGH_IMG_URL + res.d[0].fileId
            this.imgShow = true
          })
          break
        case '轨迹':
          this.$router.push('/order/map')
          setOrderDetail(row)
          break
        case '完成':
          this.currentOrder = { ...row }
          // 完成
          this.getCarOrder().then((res) => {
            if (+res.a === 200 && res.d.length > 0) {
              this.currentCarOrderId = res.d[0].id
              finishOrder({
                id: this.currentCarOrderId,
                orderId: this.currentOrder.id
              }).then((data) => {
                if (data.a === 200) {
                  Message({
                    message: data.m || '订单已完成',
                    type: 'success',
                    duration: 2 * 1000
                  })
                  this.loadTable()
                }
              })
            }
          })

          break
        default:
          break
      }
    },
    getCarOrder() {
      return getCarOrderList({
        orderId: this.currentOrder.id,
        page: 1, //  当前页
        pageSize: 1000 //  条数
      })
    }
  }
}
</script>
 <style lang="scss" scoped>
.img-wrap {
  display: flex;
  justify-content: center;
}
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

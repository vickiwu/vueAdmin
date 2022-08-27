<template>
  <div class="app-container">
    <el-page-header content="派车" class="page-header" @back="goBack" />
    {{ orderDetail }}
    <el-form
      ref="orderDetail"
      v-loading="formLoading"
      :model="orderDetail"
      label-width="120px"
      :rules="rules"
      class="car-add-form"
    >
      <el-card>
        <div slot="header">
          <span>订单信息</span>
        </div>
        <div>
          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="订单编号">
                <el-input
                  v-model="orderDetail.orderNo"
                  :disabled="true"
                  placeholder="订单编号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产品名称">
                <el-input
                  v-model="orderDetail.msdsName"
                  :disabled="true"
                  placeholder="产品名称"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="卸货地">
                <el-input
                  v-model="orderDetail.unLoadAddress"
                  :disabled="true"
                  placeholder="卸货地"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="装货地">
                <el-input
                  v-model="orderDetail.loadAddress"
                  :disabled="true"
                  placeholder="装货地"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="托运方">
                <el-input
                  v-model="orderDetail.customerName"
                  :disabled="true"
                  placeholder="托运方"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="托运方电话">
                <el-input
                  v-model="orderDetail.customerPhone"
                  :disabled="true"
                  placeholder="联系人电话"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="承运方">
                <el-input
                  v-model="orderDetail.transportName"
                  :disabled="true"
                  placeholder="承运方"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="承运方电话">
                <el-input
                  v-model="orderDetail.transportPhone"
                  :disabled="true"
                  placeholder="联系人电话"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card>
        <div slot="header">
          <span>派车信息</span>
        </div>
        <div>
          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="司机姓名" prop="customerId">
                <el-select
                  v-model="orderDetail.driverId"
                  placeholder="请选择司机"
                  @change="driverChange"
                >
                  <el-option
                    v-for="item in driveList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="司机手机号">
                <el-input
                  v-model="orderDetail.phone"
                  :disabled="true"
                  placeholder="司机手机号"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="车辆" prop="transportId">
                <el-select
                  v-model="orderDetail.carId"
                  placeholder="请选择车辆"
                  @change="carChange"
                >
                  <el-option
                    v-for="item in carList"
                    :key="item.id"
                    :label="item.carNo"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="车辆类型">
                <el-input
                  v-model="carObj.type"
                  :disabled="true"
                  placeholder="车辆类型"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="设备" prop="transportId">
                <el-select
                  v-model="orderDetail.deviceId"
                  placeholder="请选择设备"
                  @change="deviceChange"
                >
                  <el-option
                    v-for="item in deviceList"
                    :key="item.id"
                    :label="item.deviceNo"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="费用总额">
                <el-input
                  v-model.number="orderDetail.costTotal"
                  placeholder="请输入费用总额"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="计划卸货吨数">
                <el-input
                  v-model.number="orderDetail.planUnLoadTotal"
                  placeholder="请输入计划卸货吨数"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划装货吨数">
                <el-input
                  v-model.number="orderDetail.planLoadTotal"
                  placeholder="请输入计划装货吨数"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-card>

      <el-form-item class="btn-bottom">
        <el-button type="primary" @click="onSubmit">派车</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import { addCarOrder, getDevice } from '@/api/carOrder'
import { getOrderDetail, removeOrderDetail } from '@/utils/auth'
import { getCarList, getDriveList } from '@/api/people'
import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    return {
      carObj: {
        addrOne: null,
        addrThree: null,
        addrTwo: null,
        address: null,
        companyId: 1,
        contactName: null,
        contactPhone: null,
        createTime: null,
        deptId: null,
        id: null,
        jd: null,
        userId: null,
        wd: null
      },
      driverObj: {
        addrOne: null,
        addrThree: null,
        addrTwo: null,
        address: null,
        companyId: 1,
        contactName: null,
        contactPhone: null,
        createTime: null,
        deptId: null,
        id: null,
        jd: null,
        userId: null,
        wd: null
      },
      deviceList: [],
      driveList: [],
      carList: [],
      orderDetail: {
        orderId: '',
        orderNo: '',
        carNo: '',
        carId: '',
        driverId: '',
        driverName: '',
        driverPhone: '',
        msdsName: '',
        loadAddress: '',
        unLoadAddress: '',
        loadAddressId: '',
        unLoadAddressId: '',
        planLoadTotal: '',
        planUnLoadTotal: '',
        costTotal: '',
        deviceId: ''
      },
      rules: {
        carId: [{ required: true, message: '请选择车辆', trigger: 'change' }],
        driverId: [
          { required: true, message: '请选择司机', trigger: 'change' }
        ],
        planLoadTotal: [
          { required: true, message: '请输入计划装货吨数', trigger: 'blur' }
        ],
        planUnLoadTotal: [
          { required: true, message: '请输入计划卸货吨数', trigger: 'blur' }
        ],
        costTotal: [
          { required: true, message: '请输入费用总额', trigger: 'blur' }
        ],
        deviceId: [{ required: true, message: '请选择设备', trigger: 'blur' }]
      },
      formLoading: false
    }
  },
  computed: {
    ...mapGetters(['companyId', 'deptId', 'userId', 'userName'])
  },
  created() {
    this.orderDetail = getOrderDetail()

    console.log(
      '%c 🥡 this.orderDetail: ',
      'font-size:20px;background-color: #FCA650;color:#fff;',
      this.orderDetail
    )
    this.getDriveListApi()
    this.getCarListApi()
    this.getDeviceApi()
  },
  mounted() {},
  methods: {
    setOrderDetail() {},
    goBack() {
      this.$store.dispatch('tagsView/delView', this.$route)
      removeOrderDetail()
      this.$router.push('/order/list')
      // 清空表
    },
    getDeviceApi() {
      getDevice({
        pageSize: 9999,
        page: 1
      })
        .then((res) => {
          console.log(
            '%c 获取设备列表: ',
            'font-size:20px;background-color: #465975;color:#fff;',
            res
          )
          if (+res.a === 200) {
            this.deviceList = res.d
          } else {
            Message({
              message: res.m || '获取设备列表报错',
              type: 'error',
              duration: 2 * 1000
            })
          }
        })
        .catch((error) => error)
        .finally(() => {
          this.listLoading = false
        })
    },
    getDriveListApi() {
      getDriveList({
        pageSize: 9999,
        page: 1, // 1 y 10
        deptId: this.deptId,
        companyId: this.companyId
      })
        .then((res) => {
          console.log(
            '%c 获取司机列表: ',
            'font-size:20px;background-color: #465975;color:#fff;',
            res
          )
          if (+res.a === 200) {
            this.driveList = res.d
          } else {
            Message({
              message: res.m || '获取司机列表报错',
              type: 'error',
              duration: 2 * 1000
            })
          }
        })
        .catch((error) => error)
        .finally(() => {
          this.listLoading = false
        })
    },
    getCarListApi() {
      getCarList({
        pageSize: 9999,
        page: 1, // 1 y 10
        deptId: this.deptId,
        companyId: this.companyId
      }).then((res) => {
        console.log(
          '%c 获取车辆列表报错: ',
          'font-size:20px;background-color: #ED9EC7;color:#fff;',
          res
        )
        if (+res.a === 200) {
          this.carList = res.d
        } else {
          Message({
            message: res.m || '获取车辆列表报错',
            type: 'error',
            duration: 2 * 1000
          })
        }
      })
    },
    carChange(val) {
      const currentAddress = this.carList.filter((item) => {
        return item.id === val
      })
      if (currentAddress && currentAddress.length > 0) {
        this.carObj = currentAddress[0]
        this.orderDetail.carNo = this.carObj.carNo
      }
    },
    driverChange(val) {
      const currentAddress = this.carList.filter((item) => {
        return item.id === val
      })
      if (currentAddress && currentAddress.length > 0) {
        this.driverObj = currentAddress[0]
        this.orderDetail.driverName = this.driverObj.name
        this.orderDetail.driverPhone = this.driverObj.phone
      }
    },
    resetFrom() {
      for (const k of Object.keys(this.orderDetail)) {
        this.orderDetail[k] = null
      }
      for (const k of Object.keys(this.transportObj)) {
        this.transportObj[k] = null
      }
      for (const k of Object.keys(this.orderDetail)) {
        this.orderDetail[k] = null
      }
      for (const k of Object.keys(this.carObj)) {
        this.carObj[k] = null
      }
      for (const k of Object.keys(this.driverObj)) {
        this.driverObj[k] = null
      }
    },
    onSubmit() {
      this.$refs['orderDetail'].validate((valid) => {
        if (valid) {
          this.publishOrderApi()
        } else {
          console.log('验证出错')
          return false
        }
      })
    },
    publishOrderApi() {
      this.formLoading = true
      const paramsData = Object.assign({}, this.orderDetail)
      paramsData.costTotal = paramsData.costTotal * 1000
      paramsData.orderId = paramsData.id
      delete paramsData.id
      addCarOrder(paramsData)
        .then((response) => {
          Message({
            message: response.m || '派车成功',
            type: 'success',
            duration: 2 * 1000
          })
          this.goBack()
        })
        .catch((error) => {
          Message({
            message: '派车失败：' + error,
            type: 'error',
            duration: 2 * 1000
          })
          return error
        })
        .finally(() => {
          this.formLoading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.car-add-form {
  width: 90%;
  margin: 0 auto;
}
.btn-bottom {
  margin-top: 20px;
  text-align: right;
}
.input-row {
  display: flex;
  ::v-deep {
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}
.input-col {
  width: 30%;
  flex: 1;
  margin-right: 15px;
}
::v-deep {
  .el-date-editor {
    width: 100%;
  }
  .el-card {
    margin-top: 20px;
  }
  .el-card__header {
    border-radius: 4px;
    border-left: 5px solid #409eff;
  }
  .el-select {
    width: 100%;
  }
  .el-form-item__content {
    .area-select-wrap {
      line-height: 16px;
      display: flex;
      .area-select.medium {
        flex: 1;
      }
    }
  }
}
</style>

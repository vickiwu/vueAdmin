<template>
  <div class="app-container">
    <el-page-header
      content="绑定设备"
      class="page-header"
      @back="goBack(paramsType)"
    />
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
        </div>
      </el-card>
      <el-card>
        <div slot="header">
          <span>派车信息</span>
        </div>
        <div>
          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="设备" prop="transportId">
                <el-select
                  v-model="orderDetail.deviceId"
                  placeholder="请选择设备"
                  filterable
                  clearable
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
              <el-form-item label="车辆" prop="transportId">
                <el-select
                  v-model="orderDetail.carId"
                  placeholder="请选择车辆"
                  filterable
                  clearable
                  disabled
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
          </el-row>
          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="司机姓名" prop="customerId">
                <el-select
                  v-model="orderDetail.driverId"
                  filterable
                  placeholder="请选择司机"
                  clearable
                  disabled
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
                  v-model="orderDetail.driverPhone"
                  :disabled="true"
                  placeholder="司机手机号"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-card>

      <el-form-item class="btn-bottom">
        <el-button type="primary" @click="onSubmit">绑定设备</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import { editCarOrder, getDevice } from '@/api/carOrder'
import {
  getBindDeviceOrderDetail,
  removeBindDeviceOrderDetail
} from '@/utils/auth'
import { getCarList, getDriveList } from '@/api/people'
import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    return {
      carObj: {
        typeStr: null,
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
        birthday: null,
        classify: null,
        companyId: null,
        deptId: null,
        deptName: null,
        icon: null,
        id: null,
        idcard: null,
        isDriver: null,
        isEscort: null,
        license: null,
        name: null,
        phone: null,
        remark: null,
        rule: null
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
      formLoading: false,
      paramsType: undefined
    }
  },
  computed: {
    ...mapGetters(['companyId', 'deptId', 'userId', 'userName'])
  },
  created() {
    this.orderDetail = getBindDeviceOrderDetail()
    console.log('%c 🍯 orderDetail', 'color:#2eafb0', this.orderDetail)

    this.getDriveListApi()
    this.getCarListApi()
    this.getDeviceApi()
    this.driverChange(this.orderDetail.driverId)
    this.carChange(this.orderDetail.carId)
  },
  mounted() {
    this.paramsType = this.$route.query.type
      ? this.$route.query.type
      : undefined
  },
  methods: {
    goBack(type) {
      this.$store.dispatch('tagsView/delView', this.$route)
      removeBindDeviceOrderDetail()
      this.$router.push({
        path: '/order/list',
        query: { type }
      })
      // 清空表
    },
    getDeviceApi() {
      getDevice({
        pageSize: 9999,
        page: 1
      })
        .then((res) => {
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
        this.carObj.typeStr = this.carObj.type === 1 ? '车头' : '挂车'
        this.orderDetail.carNo = this.carObj.carNo
      }
    },
    driverChange(val) {
      const currentDriver = this.driveList.filter((item) => {
        return item.id === val
      })
      if (currentDriver && currentDriver.length > 0) {
        this.driverObj = currentDriver[0]

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
      editCarOrder(paramsData)
        .then((response) => {
          Message({
            message: response.m || '绑定设备成功',
            type: 'success',
            duration: 2 * 1000
          })
          this.goBack(4)
        })
        .catch((error) => {
          Message({
            message: '绑定设备失败：' + error,
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
  padding-bottom: 20px;
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

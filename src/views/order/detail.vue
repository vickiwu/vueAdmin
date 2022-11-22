<template>
  <div class="app-container">
    <el-page-header content="订单详情" class="page-header" @back="goBack" />
    <el-form
      ref="orderForm"
      v-loading="formLoading"
      :model="orderForm"
      label-width="120px"
      :rules="rules"
      class="edit-form"
    >
      <el-card>
        <div slot="header">
          <span>产品信息</span>
        </div>
        <div>
          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="11">
              <el-form-item label="订单编号">
                <el-input
                  v-model="orderForm.orderNo"
                  placeholder="请输入订单编号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="提货排班时间" prop="planGetMsdsTime">
                <el-date-picker
                  v-model="orderForm.planGetMsdsTime"
                  type="date"
                  value-format="timestamp"
                  placeholder="请选择提货排班时间"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="11">
              <el-form-item label="产品名称" prop="msdsName">
                <el-input
                  v-model="orderForm.msdsName"
                  placeholder="请输入产品名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="产品价格" prop="price">
                <el-input
                  v-model="orderForm.price"
                  placeholder="请输入产品价格（元）"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="11">
              <el-form-item label="装货吨数" prop="loadNum">
                <el-input
                  v-model="orderForm.loadNum"
                  placeholder="请输入装货吨数"
                />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="车型要求">
                <el-input
                  v-model="orderForm.carNeed"
                  placeholder="请输入车型要求"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="11">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="orderForm.remark" placeholder="请输入备注" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="东华备注" prop="dhRemark">
                <el-input
                  v-model="orderForm.dhRemark"
                  placeholder="请输入东华备注"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card>
        <div slot="header">
          <span>托运方信息</span>
        </div>
        <div>
          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="托运方" prop="customerId">
                <el-select
                  v-model="orderForm.customerId"
                  filterable
                  placeholder="请选择托运方"
                  clearable
                  :disabled="[10, 11].includes(roleType) ? true : false"
                  @change="customerIdChange"
                >
                  <el-option
                    v-for="item in customers"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="托运方手机号" prop="customerPhone">
                <el-input
                  v-model="orderForm.customerPhone"
                  :disabled="true"
                  placeholder="托运方手机号"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="地址">
                <el-input
                  v-model="customerObj.address"
                  :disabled="true"
                  placeholder="地址"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人">
                <el-input
                  v-model="customerObj.contactName"
                  :disabled="true"
                  placeholder="联系人"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <!-- <el-card>
        <div slot="header">
          <span>收货方信息</span>
        </div>
        <div>
          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="收货方" prop="transportId">
                <el-select
                filterable
                  v-model="orderForm.transportId"
                  placeholder="请选择收货方"
                  @change="transportIdChange"
                >
                  <el-option
                    v-for="item in transports"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收货方手机号">
                <el-input
                  v-model="orderForm.transportPhone"
                  :disabled="true"
                  placeholder="托运方手机号"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="地址">
                <el-input
                  v-model="transportObj.address"
                  :disabled="true"
                  placeholder="地址"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人">
                <el-input
                  v-model="transportObj.contactName"
                  :disabled="true"
                  placeholder="联系人"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-card> -->

      <el-card>
        <div slot="header">
          <span>装货地信息</span>
        </div>
        <div>
          <el-row :gutter="20" type="flex" justify="left">
            <el-col :span="20">
              <el-form-item v-if="!isCustom" label="装货地">
                <el-select
                  v-model="orderForm.loadAddressId"
                  filterable
                  placeholder="请选择装货地"
                  clearable
                  @change="loadAddressIdChange"
                >
                  <el-option
                    v-for="item in addressList1"
                    :key="item.id"
                    :label="item.address"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="详细地址" prop="loadAddress">
                <el-input
                  v-model="orderForm.loadAddress"
                  placeholder="请输入装货地详细地址"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="省/市/区" class="input-row">
                <div class="input-row">
                  <el-input
                    v-model="loadAddressObj.addrOne"
                    class="input-col"
                    :disabled="true"
                    placeholder="省"
                  />
                  <el-input
                    v-model="loadAddressObj.addrTwo"
                    class="input-col"
                    :disabled="true"
                    placeholder="市"
                  />
                  <el-input
                    v-model="loadAddressObj.addrThree"
                    class="input-col"
                    :disabled="true"
                    placeholder="区"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="联系人">
                <el-input
                  v-model="orderForm.loadAddressContactName"
                  placeholder="请输入联系人姓名"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人电话" prop="loadAddressContactPhone">
                <el-input
                  v-model="orderForm.loadAddressContactPhone"
                  placeholder="请输入联系人电话"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="经度">
                <el-input
                  v-model="loadAddressObj.jd"
                  :disabled="true"
                  placeholder="经度"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="纬度">
                <el-input
                  v-model="loadAddressObj.wd"
                  :disabled="true"
                  placeholder="纬度"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card>
        <div slot="header">
          <span>卸货地信息</span>
        </div>
        <div>
          <el-row :gutter="20" type="flex" justify="left">
            <el-col :span="18">
              <el-form-item v-if="!isCustom" label="卸货地">
                <el-select
                  v-model="orderForm.unLoadAddressId"
                  filterable
                  placeholder="请选择卸货地"
                  clearable
                  @change="unLoadAddressChange"
                >
                  <el-option
                    v-for="item in addressList2"
                    :key="item.id"
                    :label="item.address"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="详细地址" prop="unLoadAddress">
                <el-input
                  v-model="orderForm.unLoadAddress"
                  placeholder="请输入卸货地详细地址"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="省/市/区" class="input-row">
                <div class="input-row">
                  <el-input
                    v-model="unLoadAddressObj.addrOne"
                    class="input-col"
                    :disabled="true"
                    placeholder="省"
                  />
                  <el-input
                    v-model="unLoadAddressObj.addrTwo"
                    class="input-col"
                    :disabled="true"
                    placeholder="市"
                  />
                  <el-input
                    v-model="unLoadAddressObj.addrThree"
                    class="input-col"
                    :disabled="true"
                    placeholder="区"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="联系人">
                <el-input
                  v-model="orderForm.unLoadAddressContactName"
                  placeholder="联系人姓名"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人电话" prop="unLoadAddressContactPhone">
                <el-input
                  v-model="orderForm.unLoadAddressContactPhone"
                  placeholder="联系人电话"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="经度">
                <el-input
                  v-model="unLoadAddressObj.jd"
                  :disabled="true"
                  placeholder="经度"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="纬度">
                <el-input
                  v-model="unLoadAddressObj.wd"
                  :disabled="true"
                  placeholder="纬度"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-card>

      <el-form-item class="btn-bottom">
        <el-button type="primary" @click="onSubmit">修改订单</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { editOrder } from '@/api/order'
import { getAreaList, getClientList } from '@/api/people'
import { getEditOrderDetail, removeEditOrderDetail } from '@/utils/auth'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
import { isPhone, isNum } from '@/utils/validate.js'
export default {
  components: {},
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value && !isPhone(value)) {
        callback(new Error('手机号码格式不正确'))
      } else {
        callback()
      }
    }
    const validateNum = (rule, value, callback) => {
      if (value && !isNum(value)) {
        callback(new Error('请输入合理的数字，支持2位小数'))
      } else {
        callback()
      }
    }
    return {
      loadAddressObj: {
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
      unLoadAddressObj: {
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
      customerObj: {
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
        name: null,
        type: null,
        updateTime: null,
        userId: null,
        wd: null
      },
      transportObj: {
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
        name: null,
        type: null,
        updateTime: null,
        userId: null,
        wd: null
      },
      customers: [],
      transports: [],
      addressList1: [],
      addressList2: [],
      orderForm: {
        customerId: '',
        customerName: '',
        customerPhone: '',
        transportId: '',
        transportPhone: '',
        transportName: '',
        price: undefined,
        msdsName: '',
        loadAddress: '',
        unLoadAddress: '',
        loadAddressId: '',
        unLoadAddressId: '',
        loadNum: undefined,
        loadOne: '',
        loadTwo: '',
        loadThree: '',
        unLoadOne: '',
        unLoadTwo: '',
        unLoadThree: '',
        customerContactName: '',
        transportContactName: '',
        loadAddressContactName: '',
        loadAddressContactPhone: '',
        unLoadAddressContactName: '',
        unLoadAddressContactPhone: ''
      },
      rules: {
        loadAddressContactPhone: [
          {
            required: false,
            message: '请输入正确的手机号',
            trigger: 'change',
            validator: validatePhone
          }
        ],
        unLoadAddressContactPhone: [
          {
            required: false,
            message: '请输入正确的手机号',
            trigger: 'change',
            validator: validatePhone
          }
        ],
        customerPhone: [
          {
            required: false,
            message: '请输入正确的手机号',
            trigger: 'change',
            validator: validatePhone
          }
        ],
        customerId: [
          { required: true, message: '请选择托运方', trigger: 'change' }
        ],
        transportId: [
          { required: true, message: '请选择收货方', trigger: 'change' }
        ],
        price: [{ required: false, trigger: 'blur', validator: validateNum }],
        msdsName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        loadAddressId: [
          { required: true, message: '请选择装货地', trigger: 'change' }
        ],
        loadAddress: [
          { required: true, message: '请输入装货地详细地址', trigger: 'change' }
        ],
        unLoadAddressId: [
          { required: true, message: '请选择卸货地', trigger: 'change' }
        ],
        unLoadAddress: [
          { required: true, message: '请输入卸货地详细地址', trigger: 'blur' }
        ],
        loadNum: [
          {
            required: true,
            trigger: 'blur',
            validator: validateNum
          }
        ],
        carNeed: [
          { required: true, message: '请输入车型要求', trigger: 'blur' }
        ],
        planGetMsdsTime: [
          { required: true, message: '请选择提货排班时间', trigger: 'blur' }
        ]
      },
      formLoading: false,
      paramsType: undefined,
      isCustom: undefined
    }
  },
  computed: {
    ...mapGetters(['companyId', 'deptId', 'userId', 'userName', 'roleType'])
  },
  async created() {
    await this.getCustomers()
    // await this.getTransports()
    await this.getAddressList1()
    await this.getAddressList2()
    const orderDetail = getEditOrderDetail()
    this.orderForm = { ...orderDetail }
    this.orderForm.price = this.orderForm.price
      ? Math.floor((this.orderForm.price / 100) * 100) / 100
      : this.orderForm.price
    this.orderForm.loadNum = this.orderForm.loadNum
      ? Math.floor((this.orderForm.loadNum / 1000) * 1000) / 1000
      : this.orderForm.loadNum
    // 装
    this.loadAddressObj.addrOne = this.orderForm.loadOne
    this.loadAddressObj.addrTwo = this.orderForm.loadTwo
    this.loadAddressObj.addrThree = this.orderForm.loadThree
    this.loadAddressObj.jd = orderDetail.loadJd
    this.loadAddressObj.wd = orderDetail.loadWd

    // 卸
    this.unLoadAddressObj.addrOne = this.orderForm.unLoadOne
    this.unLoadAddressObj.addrTwo = this.orderForm.unLoadTwo
    this.unLoadAddressObj.addrThree = this.orderForm.unLoadThree
    this.unLoadAddressObj.jd = orderDetail.unLoadJd
    this.unLoadAddressObj.wd = orderDetail.unLoadWd
  },
  mounted() {
    this.paramsType = this.$route.query.type
      ? this.$route.query.type
      : undefined
    if (this.$route.query.isCustom) {
      this.isCustom = true
    } else if ([10, 11].includes(this.roleType)) {
      this.isCustom = true
    } else {
      this.isCustom = false
    }
  },
  methods: {
    goBack() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({
        path: '/order/list',
        query: { type: this.paramsType }
      })

      removeEditOrderDetail()
    },
    getCustomers() {
      getClientList({
        pageSize: 9999,
        page: 1,
        type: 1
      }).then((res) => {
        if (+res.a === 200) {
          this.customers = res.d

          this.customerIdChange(this.orderForm.customerId)
        } else {
          Message({
            message: res.m || '获取托运方列表报错',
            type: 'error',
            duration: 2 * 1000
          })
        }
      })
    },
    getTransports() {
      getClientList({
        pageSize: 9999,
        page: 1,
        type: 2
      }).then((res) => {
        if (+res.a === 200) {
          this.transports = res.d
          this.transportIdChange(this.orderForm.transportId)
        } else {
          Message({
            message: res.m || '获取收货方区域列表报错',
            type: 'error',
            duration: 2 * 1000
          })
        }
      })
    },
    getAddressList1() {
      getAreaList({
        pageSize: 9999,
        page: 1, // 1 y 10
        deptId: this.deptId,
        companyId: this.companyId,
        type: 1
      }).then((res) => {
        if (+res.a === 200) {
          this.addressList1 = res.d

          // this.loadAddressIdChange(this.orderForm.loadAddressId)
        } else {
          Message({
            message: res.m || '获取装货区域列表报错',
            type: 'error',
            duration: 2 * 1000
          })
        }
      })
    },
    getAddressList2() {
      getAreaList({
        pageSize: 9999,
        page: 1, // 1 y 10
        deptId: this.deptId,
        companyId: this.companyId,
        type: 2
      }).then((res) => {
        if (+res.a === 200) {
          this.addressList2 = res.d
          // this.unLoadAddressChange(this.orderForm.unLoadAddressId)
        } else {
          Message({
            message: res.m || '获取卸货地区域列表报错',
            type: 'error',
            duration: 2 * 1000
          })
        }
      })
    },
    loadAddressIdChange(val) {
      const currentAddress = this.addressList1.filter((item) => {
        return item.id === val
      })

      if (currentAddress && currentAddress.length > 0) {
        this.loadAddressObj = currentAddress[0]
        this.orderForm.loadAddress = currentAddress[0].address
        this.orderForm.loadOne = currentAddress[0].addrOne
        this.orderForm.loadTwo = currentAddress[0].addrTwo
        this.orderForm.loadThree = currentAddress[0].addrThree
        this.orderForm.loadAddressContactName = currentAddress[0].contactName
        this.orderForm.loadAddressContactPhone = currentAddress[0].contactPhone
      }
    },
    unLoadAddressChange(val) {
      const currentAddress = this.addressList2.filter((item) => {
        return item.id === val
      })
      if (currentAddress && currentAddress.length > 0) {
        this.unLoadAddressObj = currentAddress[0]
        this.orderForm.unLoadAddress = currentAddress[0].address
        this.orderForm.unLoadOne = currentAddress[0].addrOne
        this.orderForm.unLoadTwo = currentAddress[0].addrTwo
        this.orderForm.unLoadThree = currentAddress[0].addrThree
        this.orderForm.unLoadAddressContactName = currentAddress[0].contactName
        this.orderForm.unLoadAddressContactPhone =
          currentAddress[0].contactPhone
      }
    },
    transportIdChange(val) {
      const currentData = this.transports.filter((item) => {
        return item.id === val
      })

      if (currentData && currentData.length > 0) {
        this.transportObj = currentData[0]
        this.orderForm.transportPhone = currentData[0].contactPhone
        this.orderForm.transportName = currentData[0].name
        this.orderForm.transportContactName = currentData[0].contactName
      }
    },
    customerIdChange(val) {
      const currentData = this.customers.filter((item) => {
        return item.id === val
      })
      if (currentData && currentData.length > 0) {
        this.customerObj = currentData[0]
        this.orderForm.customerPhone = this.customerObj.contactPhone
        this.orderForm.customerName = this.customerObj.name
        this.orderForm.customerContactName = this.customerObj.contactName
      }
    },
    onSubmit() {
      this.$refs['orderForm'].validate((valid) => {
        if (valid) {
          this.editOrderApi()
        } else {
          console.log('验证出错')
          return false
        }
      })
    },
    editOrderApi() {
      this.formLoading = true
      const paramsData = Object.assign(
        {
          userId: this.userId,
          companyId: this.companyId,
          deptId: this.deptId,
          userName: this.userName
        },
        this.orderForm
      )

      paramsData.price = Math.round(paramsData.price * 100 * 100) / 100
      paramsData.loadNum = Math.round(paramsData.loadNum * 1000 * 100) / 100
      for (const k of Object.keys(paramsData)) {
        if (!paramsData[k]) {
          paramsData[k] = undefined
        }
      }
      editOrder(paramsData)
        .then((response) => {
          Message({
            message: response.m || '修改成功',
            type: 'success',
            duration: 2 * 1000
          })
          this.formLoading = false
          this.goBack()
        })
        .catch((error) => error)
    }
  }
}
</script>
 <style lang="scss" scoped>
.edit-form {
  width: 90%;
  margin: 0 auto;
}

.page-header {
  margin: 10px auto 30px 10px;
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

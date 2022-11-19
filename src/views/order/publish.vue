<template>
  <div class="app-container">
    <el-form
      ref="orderForm"
      v-loading="formLoading"
      :model="orderForm"
      label-width="120px"
      :rules="rules"
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
                  :disabled="[10, 11].includes(roleType)"
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
              <el-form-item label="产品价格">
                <el-input
                  v-model.number="orderForm.price"
                  placeholder="请输入产品价格（元）"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="11">
              <el-form-item label="装货吨数" prop="loadNum">
                <el-input
                  v-model.number="orderForm.loadNum"
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
                  :disabled="[10, 11].includes(roleType) ? true : false"
                  clearable
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
      <!-- <el-card >
        <div slot="header">
          <span>收货方信息</span>
        </div>
        <div>
          <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="收货方" prop="transportId">
                <el-select
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
            <el-col :span="18">
              <el-form-item label="装货地" prop="loadAddressId">
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
      <el-card class="unload-card">
        <div slot="header">
          <span>卸货地信息</span>
        </div>
        <el-tabs type="border-card">
          <el-tab-pane v-if="![10, 11].includes(roleType)" label="选择">
            <div>
              <el-row :gutter="20" type="flex" justify="left">
                <el-col :span="18">
                  <el-form-item label="卸货地">
                    <el-select
                      v-model="orderForm.unLoadAddressId"
                      filterable
                      clearable
                      placeholder="请选择卸货地"
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
                      placeholder="请输入联系人姓名"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="联系人电话"
                    prop="unLoadAddressContactPhone"
                  >
                    <el-input
                      v-model="orderForm.unLoadAddressContactPhone"
                      placeholder="请输入联系人电话"
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
          </el-tab-pane>
          <el-tab-pane label="全部录入">
            <addArea ref="addArea" @inputunload="inputunload" />
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <el-form-item class="btn-bottom">
        <el-button type="primary" @click="onSubmit">发布订单</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import { publishOrder } from '@/api/order'
import { getAreaList, getClientList } from '@/api/people'
import { mapGetters } from 'vuex'
import addArea from './addArea.vue'
import { isPhone } from '@/utils/validate.js'
export default {
  components: { addArea },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value && !isPhone(value)) {
        callback(new Error('手机号码格式不正确'))
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
      addressList1: [], // 1：装货地、2：卸货地
      addressList2: [],
      orderForm: {
        orderNo: '',
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
        carNeed: '',
        remark: '',
        dhRemark: '',
        planGetMsdsTime: '',
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
        unLoadAddressContactPhone: [
          {
            required: false,
            message: '请输入正确的手机号',
            trigger: 'change',
            validator: validatePhone
          }
        ],
        loadAddressContactPhone: [
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
        price: [
          { required: true, message: '请输入产品价格(元)', trigger: 'blur' }
        ],
        msdsName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        loadAddress: [
          { required: true, message: '请输入装货地详细地址', trigger: 'change' }
        ],
        loadAddressId: [
          { required: true, message: '请选择装货地', trigger: 'change' }
        ],
        unLoadAddressId: [
          { required: true, message: '请选择卸货地', trigger: 'change' }
        ],
        unLoadAddress: [
          { required: true, message: '请输入卸货地详细地址', trigger: 'blur' }
        ],
        loadNum: [
          { required: true, message: '请输入装货吨数', trigger: 'blur' }
        ],
        carNeed: [
          { required: true, message: '请输入车型要求', trigger: 'blur' }
        ],
        planGetMsdsTime: [
          { required: true, message: '请选择提货排班时间', trigger: 'blur' }
        ]
      },
      formLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'companyId',
      'deptId',
      'userId',
      'userName',
      'roleType',
      'customerId'
    ])
  },
  created() {
    this.getCustomers()
    this.getTransports()
    this.getAddressList1() // 装货地
    this.getAddressList2() // 卸货地
  },
  mounted() {},
  methods: {
    inputunload(data) {
      // this.$router.push('/area/add')
      this.orderForm.addrOne = data.addrOne
      this.orderForm.addrThree = data.addrThree
      this.orderForm.addrTwo = data.addrTwo
      this.orderForm.unLoadAddress = data.unLoadAddress
      this.orderForm.unLoadAddressContactName = data.unLoadAddressContactName
      this.orderForm.unLoadAddressContactPhone = data.unLoadAddressContactPhone
    },
    getCustomers() {
      getClientList({
        pageSize: 9999,
        page: 1,
        type: 1
      }).then((res) => {
        if (+res.a === 200) {
          this.customers = res.d
          if ([10, 11].includes(this.roleType)) {
            const currentData = this.customers.filter((item) => {
              return item.id === this.customerId
            })
            if (currentData && currentData.length > 0) {
              this.customerObj = currentData[0]
              this.orderForm.customerId = currentData[0].id
              this.orderForm.customerPhone = currentData[0].contactPhone
              this.orderForm.customerName = currentData[0].name
              this.orderForm.customerContactName = currentData[0].contactName
            }
          }
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
        } else {
          Message({
            message: res.m || '获取收货方列表报错',
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
        type: 1 // 1装货 2
      }).then((res) => {
        if (+res.a === 200) {
          this.addressList1 = res.d
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
        type: 2 // 1装货 2 卸货
      }).then((res) => {
        if (+res.a === 200) {
          this.addressList2 = res.d
        } else {
          Message({
            message: res.m || '获取卸货区域列表报错',
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
        this.orderForm.loadJd = currentAddress[0].jd
        this.orderForm.loadWd = currentAddress[0].wd
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
        this.orderForm.unLoadJd = currentAddress[0].jd
        this.orderForm.unLoadWd = currentAddress[0].wd
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
        this.orderForm.customerPhone = currentData[0].contactPhone
        this.orderForm.customerName = currentData[0].name
        this.orderForm.customerContactName = currentData[0].contactName
      }
    },
    resetFrom() {
      for (const k of Object.keys(this.orderForm)) {
        this.orderForm[k] = undefined
      }
      for (const k of Object.keys(this.transportObj)) {
        this.transportObj[k] = undefined
      }
      for (const k of Object.keys(this.customerObj)) {
        this.customerObj[k] = undefined
      }
      for (const k of Object.keys(this.loadAddressObj)) {
        this.loadAddressObj[k] = undefined
      }
      for (const k of Object.keys(this.unLoadAddressObj)) {
        this.unLoadAddressObj[k] = undefined
      }
    },
    onSubmit() {
      if ([10, 11].includes(this.roleType)) {
        const data = this.$refs.addArea.ruleForm
        console.log('%c Line:791 🍋 data', 'color:#3f7cff', data)
        this.orderForm.addrOne = data.addrOne
        this.orderForm.addrThree = data.addrThree
        this.orderForm.addrTwo = data.addrTwo
        this.orderForm.unLoadAddress = data.unLoadAddress
        this.orderForm.unLoadAddressContactName = data.unLoadAddressContactName
        this.orderForm.unLoadAddressContactPhone =
          data.unLoadAddressContactPhone
      }
      this.$refs['orderForm'].validate((valid) => {
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
      const paramsData = Object.assign(this.orderForm, {
        userId: this.userId,
        companyId: this.companyId,
        deptId: this.deptId,
        userName: this.userName,
        publishUserType: [10, 11].includes(this.roleType) ? 2 : 1
      })
      paramsData.price = paramsData.price * 1000

      for (const k of Object.keys(paramsData)) {
        if (!paramsData[k]) {
          paramsData[k] = undefined
        }
      }
      publishOrder(paramsData)
        .then((response) => {
          Message({
            message: response.m || '发单成功',
            type: 'success',
            duration: 2 * 1000
          })
          this.resetFrom()
        })
        .catch((error) => {
          Message({
            message: '发单失败：' + error,
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
.unload-card {
  ::v-deep {
    .el-card__body {
      padding: 0;
      padding-top: 20px;
    }
    .el-tabs--border-card {
      border-left: 0;
      border-right: 0;
      border-bottom: 0;
    }
  }
}
.app-container {
  width: 95%;
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

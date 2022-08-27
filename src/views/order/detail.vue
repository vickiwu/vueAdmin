<template>
  <div class="app-container">
    <el-page-header content="订单详情" class="page-header" @back="goBack" />
    <el-form
      ref="orderForm"
      v-loading="formLoading"
      :model="orderForm"
      label-width="120px"
      class="edit-form"
    >
      <el-form-item label="托运方">
        <el-select
          v-model="orderForm.customerId"
          placeholder="请选择托运方"
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
      <el-form-item label="托运方手机号">
        <el-input
          v-model="orderForm.customerPhone"
          :disabled="true"
          placeholder="托运方手机号"
        />
      </el-form-item>
      <el-form-item label="承运方">
        <el-select
          v-model="orderForm.transportId"
          placeholder="请选择承运方"
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
      <el-form-item label="承运方手机号">
        <el-input
          v-model="orderForm.transportPhone"
          :disabled="true"
          placeholder="托运方手机号"
        />
      </el-form-item>
      <el-form-item label="产品名称">
        <el-input v-model="orderForm.msdsName" placeholder="请输入产品名称" />
      </el-form-item>
      <el-form-item label="产品价格">
        <el-input
          v-model.number="orderForm.price"
          placeholder="请输入产品价格"
        />
      </el-form-item>
      <el-form-item label="装货地">
        <el-select
          v-model="orderForm.loadAddressId"
          placeholder="请选择装货地"
          @change="loadAddressIdChange"
        >
          <el-option
            v-for="item in addressList"
            :key="item.id"
            :label="item.address"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="卸货地">
        <el-select
          v-model="orderForm.unLoadAddressId"
          placeholder="请选择卸货地"
          @change="unLoadAddressChange"
        >
          <el-option
            v-for="item in addressList"
            :key="item.id"
            :label="item.address"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="装货吨数">
        <el-input
          v-model.number="orderForm.loadNum"
          placeholder="请输入装货吨数"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">修改订单</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { editOrder } from '@/api/order'
import { getAreaList, getClientList } from '@/api/people'
import { getOrderDetail, removeOrderDetail } from '@/utils/auth'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    return {
      customers: [],
      transports: [],
      addressList: [],
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
        loadNum: undefined
      },
      formLoading: false
    }
  },
  computed: {
    ...mapGetters(['companyId', 'deptId', 'userId'])
  },
  created() {
    this.getCustomers()
    this.getTransports()
    this.getAddressList()
    const orderDetail = getOrderDetail()
    this.orderForm = { ...orderDetail }
  },
  mounted() {},
  methods: {
    goBack() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/order/list')
      removeOrderDetail()
    },
    getCustomers() {
      getClientList({
        pageSize: 9999,
        page: 1,
        type: 1
      }).then((res) => {
        if (+res.a === 200) {
          this.customers = res.d
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
            message: res.m || '获取承运方列表报错',
            type: 'error',
            duration: 2 * 1000
          })
        }
      })
    },
    getAddressList() {
      getAreaList({
        pageSize: 9999,
        page: 1, // 1 y 10
        deptId: this.deptId,
        companyId: this.companyId
      }).then((res) => {
        if (+res.a === 200) {
          this.addressList = res.d
        } else {
          Message({
            message: res.m || '获取区域列表报错',
            type: 'error',
            duration: 2 * 1000
          })
        }
      })
    },
    loadAddressIdChange(val) {
      const currentAddress = this.addressList.filter((item) => {
        return item.id === val
      })
      if (currentAddress && currentAddress.length > 0) {
        this.orderForm.loadAddress = currentAddress[0].address
      }
    },
    unLoadAddressChange(val) {
      const currentAddress = this.addressList.filter((item) => {
        return item.id === val
      })
      if (currentAddress && currentAddress.length > 0) {
        this.orderForm.unLoadAddress = currentAddress[0].address
      }
    },
    transportIdChange(val) {
      const currentData = this.transports.filter((item) => {
        return item.id === val
      })
      if (currentData && currentData.length > 0) {
        this.orderForm.transportPhone = currentData[0].contactPhone
        this.orderForm.transportName = currentData[0].name
      }
    },
    customerIdChange(val) {
      const currentData = this.customers.filter((item) => {
        return item.id === val
      })
      if (currentData && currentData.length > 0) {
        this.orderForm.customerPhone = currentData[0].contactPhone
        this.orderForm.customerName = currentData[0].name
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

      paramsData.price = paramsData.price * 1000
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
  width: 80%;
  margin: 0 auto;
  padding-top: 20px;
}

.page-header {
  margin: 10px auto 30px 10px;
}
::v-deep {
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

<template>
  <div class="app-container">
    <el-page-header content="订单详情" class="page-header" @back="goBack" />
    <el-form ref="form" :model="form" label-width="80px" class="order-form">
      <el-form-item label="活动名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="form.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai" />
          <el-option label="区域二" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间">
        <el-col :span="11">
          <el-date-picker
            v-model="form.date1"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker
            v-model="form.date2"
            placeholder="选择时间"
            style="width: 100%"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="即时配送">
        <el-switch v-model="form.delivery" />
      </el-form-item>
      <el-form-item label="活动性质">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="美食/餐厅线上活动" name="type" />
          <el-checkbox label="地推活动" name="type" />
          <el-checkbox label="线下主题活动" name="type" />
          <el-checkbox label="单纯品牌曝光" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="特殊资源">
        <el-radio-group v-model="form.resource">
          <el-radio label="线上品牌商赞助" />
          <el-radio label="线下场地免费" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动形式">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import { getOrderDetail, removeOrderDetail } from '@/utils/auth'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  computed: {
    ...mapGetters(['companyId', 'deptId', 'userId'])
  },
  created() {
    const orderDetail = getOrderDetail()
    this.form = { ...orderDetail }
  },
  mounted() {},
  methods: {
    goBack() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/order/list')
      removeOrderDetail()
    },
    initMap() {
      AMapLoader.load({
        key: '499cf0c29e7adba17f559a42b305d58c', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '1.4.15', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.Geocoder'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        AMapUI: {
          // 是否加载 AMapUI，缺省不加载
          version: '1.1', // AMapUI 缺省 1.1
          plugins: [] // 需要加载的 AMapUI ui插件
        },
        Loca: {
          // 是否加载 Loca， 缺省不加载
          version: '1.3.2' // Loca 版本，缺省 1.3.2
        }
      })
        .then((AMap) => {
          this.mapInstance = new AMap.Map('address-map')
          this.geocoder = new AMap.Geocoder()
          this.marker = new AMap.Marker()
          this.AMap = AMap
          this.mapInstance.on('click', (e) => {
            this.handleMapClick(e.lnglat)
          })
          if (this.dialogTitle === '修改区域') {
            // 地图加点
            this.selected = [
              this.ruleForm.addrOne,
              this.ruleForm.addrTwo,
              this.ruleForm.addrThree
            ]
            const lnglat = [this.ruleForm.jd, this.ruleForm.wd]
            this.marker.setPosition(lnglat)
            this.mapInstance.add(this.marker)
            this.mapInstance.setFitView(this.marker, 12)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    handleMapClick(lnglat) {
      this.geocoder.getAddress(lnglat, (status, result) => {
        if (status === 'complete' && result.regeocode) {
          var address = result.regeocode.formattedAddress
          this.ruleForm.address = address
          this.ruleForm.jd = lnglat.lng + ''
          this.ruleForm.wd = lnglat.lat + ''
        } else {
          console.log('根据经纬度查询地址失败')
        }
        this.marker.setPosition(lnglat)
        this.mapInstance.add(this.marker)
        this.mapInstance.setFitView(this.marker, 12)
      })
    },

    handleSave() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          switch (this.dialogTitle) {
            case '新增区域':
              this.addArea()
              break
            case '修改区域':
              this.editArea()
              break
            default:
              break
          }
        } else {
          console.log('验证出错')
          return false
        }
      })
    },
    addArea() {
      this.listLoading = true
      addArea({
        ...this.ruleForm,
        userId: this.userId,
        companyId: this.companyId,
        deptId: this.deptId
      })
        .then((response) => {
          Message({
            message: response.m || '添加成功',
            type: 'success',
            duration: 2 * 1000
          })
          this.listLoading = false
          this.loadTable()
          this.dialogFormVisible = false
        })
        .catch((error) => error)
    },
    editArea() {
      this.listLoading = true
      editArea({
        ...this.ruleForm,
        userId: this.userId,
        companyId: this.companyId,
        deptId: this.deptId
      })
        .then((response) => {
          Message({
            message: response.m || '修改成功',
            type: 'success',
            duration: 2 * 1000
          })
          this.dialogFormVisible = false
          this.listLoading = false
          this.loadTable()
        })
        .catch((error) => error)
    }
  }
}
</script>
 <style lang="scss" scoped>
.order-form {
  width: 70%;
  margin: 0 auto;
}
.page-header {
  margin: 10px auto 30px 10px;
}
::v-deep {
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

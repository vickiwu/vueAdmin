<template>
  <div class="app-container">
    <el-page-header content="修改" class="page-header" @back="goBack" />
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="add-area-ruleForm"
    >
      <el-row>
        <el-col :span="22">
          <el-form-item label="类型" prop="type">
            <el-radio-group v-model="ruleForm.type">
              <el-radio :label="2">卸货</el-radio>
              <el-radio :label="1">装货</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="省/市/区" prop="addrOne">
            <area-select
              v-model="selected"
              :data="pcaa"
              type="text"
              :level="2"
              @change="areaChange"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="联系人名称" prop="contactName">
            <el-input
              v-model="ruleForm.contactName"
              placeholder="请输入联系人名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="手机号" prop="contactPhone">
            <el-input
              v-model="ruleForm.contactPhone"
              placeholder="请输入正确的手机号"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="ruleForm.address" placeholder="请输入详细地址" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="经度" prop="jd">
            <el-input v-model="ruleForm.jd" placeholder="请输入经度" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="纬度" prop="wd">
            <el-input v-model="ruleForm.wd" placeholder="请输入纬度" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-loading="mapLoading" :span="22">
          <div id="address-map" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <div class="form-btn">
            <el-button type="primary" @click="handleSave()"> 提交 </el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getAreaDetail, removeAreaDetail } from '@/utils/auth'
import { pca, pcaa } from 'area-data' // v5 or higher
import { editArea } from '@/api/people'
import AMapLoader from '@amap/amap-jsapi-loader'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
import { isPhone } from '@/utils/validate.js'
export default {
  components: {},
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!isPhone(value)) {
        callback(new Error('手机号码格式不正确'))
      } else {
        callback()
      }
    }
    return {
      mapLoading: true,
      mapInstance: null,
      geocoder: null,
      marker: null,
      AMap: null,
      pcaa,
      pca,
      selected: [],
      ruleForm: {
        addrOne: null,
        addrTwo: null,
        addrThree: null,
        address: '',
        jd: '',
        wd: '',
        contactName: '',
        contactPhone: '',
        type: 1
      },
      rules: {
        addrOne: [{ required: true, message: '请选择省', trigger: 'change' }],
        addrTwo: [{ required: true, message: '请选择市', trigger: 'change' }],
        addrThree: [{ required: true, message: '请选择区', trigger: 'change' }],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        jd: [{ required: true, message: '请输入经度', trigger: 'blur' }],
        wd: [{ required: true, message: '请输入纬度', trigger: 'blur' }],
        contactName: [
          { required: true, message: '请输入联系人名称', trigger: 'blur' }
        ],
        contactPhone: [
          {
            required: true,
            message: '请输入正确的手机号',
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId', 'deptId', 'userId'])
  },
  created() {
    const areaDetail = getAreaDetail()
    this.ruleForm = { ...areaDetail }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    goBack() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/area/address')
      // 清空cookie中areaDetail
      removeAreaDetail()
    },
    formReset() {
      for (const k of Object.keys(this.ruleForm)) {
        this.ruleForm[k] = undefined
      }
    },
    areaChange(areaValue) {
      this.ruleForm.addrOne = areaValue[0] + ''
      this.ruleForm.addrTwo = areaValue[1] + ''
      this.ruleForm.addrThree = areaValue[2] + ''
      this.mapInstance.setCity(areaValue[2])
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
          // var bounds = this.mapInstance.getBounds()
          // this.mapInstance.setLimitBounds(bounds)
          this.geocoder = new AMap.Geocoder()
          this.marker = new AMap.Marker()
          this.AMap = AMap
          this.mapInstance.on('click', (e) => {
            this.handleMapClick(e.lnglat)
          })
          // 地图加点
          this.selected = [
            this.ruleForm.addrOne,
            this.ruleForm.addrTwo,
            this.ruleForm.addrThree
          ]

          const lnglat = [this.ruleForm.jd, this.ruleForm.wd]
          this.marker.setPosition(lnglat)
          this.mapInstance.add(this.marker)
          this.mapLoading = false
        })
        .catch((e) => {
          console.log(e)
        })
    },
    handleMapClick(lnglat) {
      this.geocoder.getAddress(lnglat, (status, result) => {
        if (status === 'complete' && result.regeocode) {
          var address = result.regeocode.formattedAddress
          const { province, city, district } = result.regeocode.addressComponent

          // 地图加点
          this.selected = [province, city, district]
          this.ruleForm.address = address
          this.ruleForm.jd = lnglat.lng + ''
          this.ruleForm.wd = lnglat.lat + ''
        } else {
          console.log('根据经纬度查询地址失败')
        }
        this.marker.setPosition(lnglat)
        this.mapInstance.add(this.marker)
        this.mapInstance.setFitView(this.marker, false, null, 14)
      })
    },

    handleSave() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.editArea()
        } else {
          console.log('验证出错')
          return false
        }
      })
    },

    editArea() {
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
          this.goBack()
        })
        .catch((error) => error)
    }
  }
}
</script>
 <style lang="scss" scoped>
#address-map {
  height: 350px;
  margin-left: 100px;
}
.page-header {
  margin: 10px auto 30px 10px;
}
.add-area-ruleForm {
  width: 80%;
  margin: 0 auto;

  .form-btn {
    display: flex;
    justify-content: right;
    margin: 20px 10px 20px 0;
  }
  .el-select {
    width: 100%;
  }
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

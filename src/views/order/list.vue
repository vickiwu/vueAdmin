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
        订单发布
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
        show-overflow-tooltip
        width="80"
      />
      <el-table-column
        show-overflow-tooltip
        label="省"
        align="left"
        width="120"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.addrOne }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="市"
        align="left"
        width="280"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.addrTwo }}</span>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        label="区"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.addrThree }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="详细地址"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="联系人名称"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.contactName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="联系人手机号"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.contactPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="经度"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.jd }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="纬度"
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
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      @opened="initMap"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="client-ruleForm"
      >
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
                placeholder="请输入联系人手机号"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="详细地址" prop="address">
              <el-input
                v-model="ruleForm.address"
                placeholder="请输入详细地址"
              />
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
          <el-col :span="22">
            <div id="address-map" />
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="handleSave()"> 确认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pca, pcaa } from 'area-data' // v5 or higher
import { getAreaList, addArea, delArea, editArea } from '@/api/people'
import AMapLoader from '@amap/amap-jsapi-loader'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    return {
      searchStr: '',
      mapInstance: null,
      geocoder: null,
      marker: null,
      AMap: null,
      pcaa,
      pca,
      selected: [],
      dialogTitle: '新增区域',
      listLoading: false,
      dialogFormVisible: false,
      list: [],
      page: 1,
      pageSize: 10,
      total: 0,
      ruleForm: {
        addrOne: null,
        addrTwo: null,
        addrThree: null,
        address: '',
        jd: '',
        wd: '',
        contactName: '',
        contactPhone: ''
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
          { required: true, message: '请选择联系人名称', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '请选择联系人电话', trigger: 'blur' }
        ]
      }
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
    areaChange(areaValue) {
      this.ruleForm.addrOne = areaValue[0] + ''
      this.ruleForm.addrTwo = areaValue[0] + ''
      this.ruleForm.addrThree = areaValue[0] + ''
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

    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleCurrentChange(page) {
      this.page = page
      this.listLoading = true
      this.loadTable()
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
    },
    openNew() {
      this.dialogFormVisible = true
      this.dialogTitle = '新增区域'
      for (const k of Object.keys(this.ruleForm)) {
        this.ruleForm[k] = null
      }
    },
    handelClick(item, row) {
      switch (item) {
        case '修改':
          this.dialogTitle = '修改区域'

          this.dialogFormVisible = true
          this.ruleForm = { ...row }
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
#address-map {
  height: 350px;
  margin-left: 100px;
}
.auth-table {
  .el-button--mini,
  .el-button--mini.is-round {
    padding: 5px 10px;
  }
}

.search-btn {
  background-color: rgba(0, 204, 102, 1);
}
.client-ruleForm {
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

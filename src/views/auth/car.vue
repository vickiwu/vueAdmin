<template>
  <div class="app-container">
    <!-- <small>认证中心-应用管理页面</small> -->
    <div class="filter-container">
      <el-input
        v-model="carNo"
        placeholder="请输入车牌号"
        style="width: 200px; margin-right: 10px"
        class="filter-item"
      />
      <el-button
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
        @click="addCarHandle"
      >
        新增车辆
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
        width="80"
      />
      <el-table-column label="车牌号" align="left" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.type === 1 ? row.carNo : row.guaNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车辆类型" align="left" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.type === 1 ? '车头' : '挂车' }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column

        label="车型"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.carType === 1 ? '平板' : '--' }}</span>
        </template>
      </el-table-column> -->

      <!-- <el-table-column

        label="类别"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.classify }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="荷载吨数" align="left" header-align="center">
        <template slot-scope="{ row }">
          <span>{{
            row.maxLoad
              ? Math.floor((row.maxLoad / 1000) * 1000) / 1000
              : row.maxLoad
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总重量（kg）" align="left" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.carWeight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="长（m）" align="left" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.carLength }}</span>
        </template>
      </el-table-column>
      <el-table-column label="宽（m）" align="left" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.carWide }}</span>
        </template>
      </el-table-column>
      <el-table-column label="高（m）" align="left" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.carHeight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="left" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column

        label="规则"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.rule }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="操作"
        width="180"
        align="center"
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
      :visible.sync="CarFromVisible"
      class="dialog-CarFrom"
    >
      <el-form
        ref="CarFrom"
        :model="CarFrom"
        :rules="rules"
        label-width="120px"
        class="client-CarFrom"
      >
        <el-row :gutter="20">
          <el-col :span="22">
            <el-form-item label="车型" prop="type">
              <el-radio-group v-model="CarFrom.type">
                <el-radio
                  v-for="item in carTypeOption"
                  :key="item.id"
                  :label="item.id"
                >
                  {{ item.carTypeName }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item
              :label="CarFrom.type === 1 ? '车牌号' : '挂车号'"
              prop="carNo"
            >
              <el-input
                v-model="CarFrom.carNo"
                :placeholder="
                  CarFrom.type === 1 ? '请输入车牌号' : '请输入挂车号'
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="荷载吨数" prop="maxLoad">
              <el-input
                v-model="CarFrom.maxLoad"
                placeholder="请输入荷载吨数"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="总重量（kg）">
              <el-input
                v-model.number="CarFrom.carWeight"
                placeholder="请输入总重量（kg）"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="长（m）">
              <el-input
                v-model.number="CarFrom.carLength"
                placeholder="请输入长（m）"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="宽（m）">
              <el-input
                v-model.number="CarFrom.carWide"
                placeholder="请输入宽（m）"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="高（m）">
              <el-input
                v-model.number="CarFrom.carHeight"
                placeholder="请输入高（m）"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="22">
            <el-form-item label="备注">
              <el-input
                v-model="CarFrom.remark"
                type="textarea"
                placeholder="请输入备注内容"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="CarFromVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="handleSave"> 确认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCarList, addCar, editCar, delCar } from '@/api/people'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
import { isNum } from '@/utils/validate.js'
import lodash from 'lodash'
export default {
  data() {
    const validateNum = (rule, value, callback) => {
      if (value && !isNum(value)) {
        callback(new Error('请输入合理的数字，支持2位小数'))
      } else {
        callback()
      }
    }
    return {
      carNo: '',
      dialogTitle: '新增车辆',
      listLoading: false,
      CarFromVisible: false,
      CarAddVisible: false,
      list: [],
      page: 1,
      pageSize: 10,
      total: 0,
      CarFrom: {
        carNo: '',
        type: 1,
        carType: 1,
        classify: 1, // 1自有；2外协
        remark: '',
        maxLoad: '',
        carWeight: '',
        carLength: '',
        carWide: '',
        carHeight: ''
      },
      rules: {
        carNo: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
        type: [{ required: true, message: '请输入车型', trigger: 'change' }],
        maxLoad: [
          {
            required: false,
            trigger: 'blur',
            validator: validateNum
          }
        ],
        carWeight: [
          {
            required: false,
            trigger: 'blur',
            validator: validateNum
          }
        ],
        carLength: [
          {
            required: false,
            trigger: 'blur',
            validator: validateNum
          }
        ],
        carWide: [
          {
            required: false,
            trigger: 'blur',
            validator: validateNum
          }
        ],
        carHeight: [
          {
            required: false,
            trigger: 'blur',
            validator: validateNum
          }
        ]
      },
      carTypeOption: [
        {
          carTypeName: '车头',
          id: 1
        },
        {
          carTypeName: '挂车',
          id: 2
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['companyId', 'deptId'])
  },
  created() {
    this.loadTable()
  },
  methods: {
    addCar() {
      const tem = Object.assign({}, lodash.pickBy(this.CarFrom))
      tem.maxLoad && (tem.maxLoad = Math.round(tem.maxLoad * 1000 * 100) / 100)
      if (tem.type === 2) {
        // 挂车
        tem.guaNo = tem.carNo
        delete tem.carNo
      }
      this.listLoading = true

      addCar({
        ...tem,
        companyId: this.companyId,
        deptId: this.deptId
      })
        .then((response) => {
          Message({
            message: response.m || '添加成功',
            type: 'success',
            duration: 2 * 1000
          })

          this.loadTable()
          this.CarFromVisible = false
        })
        .catch((error) => {
          error
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    editCar() {
      this.listLoading = true
      const tem = Object.assign({}, lodash.pickBy(this.CarFrom))
      tem.maxLoad && (tem.maxLoad = Math.round(tem.maxLoad * 1000 * 100) / 100)
      if (tem.type === 2) {
        // 挂车
        tem.carNo = tem.guaNo
        delete tem.guaNo
      }
      editCar({
        ...tem,
        companyId: this.companyId,
        deptId: this.deptId
      })
        .then((response) => {
          Message({
            message: response.m || '修改成功',
            type: 'success',
            duration: 2 * 1000
          })

          this.loadTable()
          this.CarFromVisible = false
        })
        .catch((error) => {
          error
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    handleSave() {
      this.$refs['CarFrom'].validate((valid) => {
        if (valid) {
          switch (this.dialogTitle) {
            case '新增车辆':
              this.addCar()
              break
            case '修改车辆':
              this.editCar()
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
    loadTable() {
      this.listLoading = true
      getCarList({
        pageSize: this.pageSize,
        page: this.page, // 1 y 10
        deptId: this.deptId,
        companyId: this.companyId,
        carNo: this.carNo ? this.carNo : undefined
      })
        .then((response) => {
          const data = response.d
          this.list = data
          this.total = response.z
        })
        .catch((error) => error)
        .finally(() => {
          this.listLoading = false
        })
    },
    handleCurrentChange(page) {
      this.page = page
      this.listLoading = true
      this.loadTable()
    },
    addCarHandle() {
      this.dialogTitle = '新增车辆'
      this.CarFromVisible = true
      this.CarFrom = {
        carNo: '',
        deptId: '',
        type: 1,
        carType: 1,
        classify: 1, // 1自有；2外协
        remark: '',
        guaNo: '',
        maxLoad: '',
        carWeight: '',
        carLength: '',
        carWide: '',
        carHeight: ''
      }
    },
    handelClick(item, row) {
      if (item === '修改') {
        row.maxLoad = row.maxLoad
          ? Math.floor((row.maxLoad / 1000) * 1000) / 1000
          : row.maxLoad
        this.CarFromVisible = true
        this.dialogTitle = '修改车辆'
        this.CarFrom = { ...row }
      } else if (item === '删除') {
        this.$confirm('确认删除吗？')
          .then((_) => {
            delCar({ id: row.id })
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
      }
    }
  }
}
</script>
 <style lang="scss">
.auth-table {
  .el-button--mini,
  .el-button--mini.is-round {
    padding: 5px 10px;
  }
  .cell {
    span {
      word-break: initial;
    }
  }
}

.search-btn {
  background-color: rgba(0, 204, 102, 1);
}
.dialog-CarFrom {
  .el-select {
    width: 100%;
  }
  .el-date-editor {
    width: 100%;
  }
}
</style>

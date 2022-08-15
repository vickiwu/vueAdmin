<template>
  <div class="app-container">
    <!-- <small>认证中心-应用管理页面</small> -->
    <div class="filter-container">
      <el-input
        v-model="userName"
        placeholder="请输入关键字"
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
        show-overflow-tooltip
        label="序号"
        type="index"
        align="center"
        header-align="center"
        width="80"
      />
      <el-table-column
        show-overflow-tooltip
        label="车牌号"
        align="left"
        header-align="center"
        width="150"
      >
        <template slot-scope="{ row }">
          <span>{{ row.carNo }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="挂车号"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.guaNo }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="车辆类型"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.type === 1 ? '车头' : '挂车' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="车型"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.carType === 1 ? '平板' : '--' }}</span>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        label="类别"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.classify }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="荷载吨数"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.maxLoad }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="总重量（kg）"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.carWeight }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="长（m）"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.carLength }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="宽（m）"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.carWide }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="高（m）"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.carHeight }}</span>
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
        show-overflow-tooltip
        label="规则"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.rule }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="操作"
        width="200"
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
      :visible.sync="CarFromVisible"
      class="dialog-CarFrom"
    >
      <el-form
        ref="CarFrom"
        :model="CarFrom"
        :rules="rules"
        label-width="100px"
        class="client-CarFrom"
      >
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="车牌号" prop="carNo">
              <el-input v-model="CarFrom.carNo" placeholder="请输入车牌号" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="车型" prop="carType">
              <el-input v-model="CarFrom.carType" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="车辆类型" prop="type">
              <el-input v-model="CarFrom.type" placeholder="请输入身份证号" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="类别">
              <el-date-picker
                v-model="CarFrom.classify"
                type="date"
                placeholder="选择出生日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="CarFrom.remark"
                type="textarea"
                placeholder="请输入备注内容"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>

          <el-col :span="11">
            <el-form-item label="规则" prop="rule">
              <el-input
                v-model="CarFrom.rule"
                type="textarea"
                placeholder="请输入规则内容"
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
export default {
  data() {
    return {
      userName: '',
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
        deptId: '',
        type: '',
        carType: '',
        classify: null,
        remark: '',
        rule: ''
      },
      rules: {
        carNo: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
        carType: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        type: [{ required: true, message: '请输入身份证', trigger: 'blur' }]
      }
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
      this.listLoading = true
      addCar({
        ...this.CarFrom,
        companyId: this.companyId,
        deptId: this.deptId,
        isCar: 1,
        isEscort: 2,
        classify: 1
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
      editCar({
        ...this.CarFrom,
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
        companyId: this.companyId
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
        type: '',
        carType: '',
        isCar: '', // 1 是 2否
        isEscort: '', // 1 是 2 否
        classify: null,
        classify: '', // 1 自有 2外协
        remark: '',
        rule: ''
      }
    },
    handelClick(item, row) {
      if (item === '修改') {
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

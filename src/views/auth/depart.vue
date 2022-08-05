<template>
  <div class="app-container">
    <el-row type="flex" :gutter="20" class="depart-cont">
      <el-col :span="6">
        <el-card class="left-bg">
          <div slot="header" class="clearfix">
            <span>部门</span>
            <el-button
              size="small"
              style="float: right; padding: 0"
              type="text"
              icon="el-icon-edit"
              @click="addDepartClick"
            >
              新增部门
            </el-button>
          </div>
          <el-tree
            v-loading="departLoading"
            :data="departData"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span>
                <!-- <el-tooltip effect="dark" content="新增部门" placement="top">
                  <i
                    v-if="node.id == 1"
                    class="el-icon-circle-plus-outline tree-btn btn-succ"
                    @click="() => append(data)"
                  />
                </el-tooltip> -->
                <el-tooltip effect="dark" content="修改部门" placement="top">
                  <i
                    class="el-icon-edit tree-btn btn-edit"
                    @click="() => editDepart(node, data)"
                  />
                </el-tooltip>
                <el-tooltip effect="dark" content="删除部门" placement="top">
                  <i
                    class="el-icon-delete tree-btn btn-del"
                    @click="() => remove(node, data)"
                  />
                </el-tooltip>
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="left-bg">
          <div slot="header" class="filter-container">
            <el-input
              v-model="name"
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
              label="姓名"
              align="left"
              width="120"
              header-align="center"
            >
              <template slot-scope="{ row }">
                <span>{{ row.userName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="手机号"
              align="left"
              width="280"
              header-align="center"
            >
              <template slot-scope="{ row }">
                <span>{{ row.phone }}</span>
              </template>
            </el-table-column>

            <el-table-column
              show-overflow-tooltip
              label="部门名称"
              align="left"
              header-align="center"
            >
              <template slot-scope="{ row }">
                <span>{{ row.deptName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              show-overflow-tooltip
              label="角色名称"
              align="left"
              header-align="center"
            >
              <template slot-scope="{ row }">
                <span>{{ row.roleName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              show-overflow-tooltip
              label="操作"
              width="100"
              align="right"
              header-align="center"
            >
              <template slot-scope="{ row }">
                <div style="display: flex; justify-content: flex-end">
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
        </el-card>
      </el-col>
    </el-row>

    <el-dialog :title="dialogDepartTitle" :visible.sync="dialogDepart">
      <el-form
        ref="deportForm"
        :model="deportForm"
        :rules="rules"
        label-width="100px"
        class="client-deportForm"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="部门名称" prop="name">
              <el-input
                v-model="deportForm.name"
                placeholder="请输入部门名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDepart = false"> 取消 </el-button>
        <el-button type="primary" @click="handleSave"> 确认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import {
  getDeportList,
  addDeport,
  editDeport,
  delDeport,
  delPeople
} from '@/api/people'
import { mapGetters } from 'vuex'
import { getPeopleList } from '../../api/people'
export default {
  data() {
    return {
      dialogDepartTitle: '新增部门',
      currentParent: null,
      dialogDepart: false,
      name: '',
      listLoading: false,
      departLoading: false,
      list: [],
      deportForm: {
        name: ''
      },
      higherServiceList: [],
      page: 1,
      pageSize: 10,
      total: 0,
      rules: {
        name: [{ required: true, message: '请输入服务名称', trigger: 'blur' }],
        companyId: [
          { required: true, message: '请输入服务路径', trigger: 'blur' }
        ]
      },
      departData: [],
      defaultProps: {
        children: 'd',
        label: 'name'
      }
    }
  },
  computed: {
    ...mapGetters(['companyId', 'deptId'])
  },
  created() {
    this.getDeportList()
  },
  methods: {
    addDepartClick() {
      // 新增子部门
      this.dialogDepartTitle = '新增部门'
      this.dialogDepart = true
      // this.currentParent = data
    },
    handleNodeClick(data) {
      // 加载当前部门得人员
      this.loadPeople(data.id)
    },
    loadPeople(deptId) {
      getPeopleList({
        pageSize: this.pageSize,
        page: this.page, // 1 y 10
        deptId: deptId,
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
    getDeportList() {
      getDeportList({
        pageSize: 9999,
        page: 1, // 1 y 10
        id: this.deptId,
        companyId: this.companyId
      })
        .then((response) => {
          const data = response.d
          this.departData = data
          this.loadPeople(this.deptId)
        })
        .catch((error) => error)
    },

    handleCurrentChange(page) {
      this.page = page
      this.listLoading = true
      this.loadPeople(this.currentParent.id)
    },
    editDepart(node, data) {
      this.dialogDepartTitle = '修改部门'
      this.dialogDepart = true
      this.currentParent = data
    },
    remove(node, data) {
      this.$confirm('确认删除吗？')
        .then((_) => {
          delDeport({ id: data.id })
            .then((response) => {
              Message({
                message: response.m || '删除成功',
                type: 'success',
                duration: 2 * 1000
              })

              if (response.a === 200) {
                this.getDeportList()
                this.dialogDepart = false
              }
            })
            .catch((error) => {
              console.log(error, 'eee')
            })
        })
        .catch((_) => {
          console.log(_, '取消删除了')
        })
    },

    handleSave() {
      this.$refs['deportForm'].validate((valid) => {
        if (valid) {
          this.departLoading = true

          switch (this.dialogDepartTitle) {
            case '新增部门':
              addDeport({
                ...this.deportForm,
                parentId: 1,
                companyId: this.companyId
              })
                .then((response) => {
                  Message({
                    message: response.m || '添加成功',
                    type: 'success',
                    duration: 2 * 1000
                  })
                  if (response.a === 200) {
                    this.getDeportList()
                    this.dialogDepart = false
                  }
                })
                .catch((error) => error)
                .finally(() => {
                  this.departLoading = false
                })
              break
            case '修改部门':
              editDeport({
                ...this.deportForm,
                id: this.currentParent.id
              })
                .then((response) => {
                  Message({
                    message: response.m || '修改成功',
                    type: 'success',
                    duration: 2 * 1000
                  })
                  if (response.a === 200) {
                    this.getDeportList()
                    this.dialogDepart = false
                  }
                })
                .catch((error) => error)
                .finally(() => {
                  this.departLoading = false
                })
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

    handelClick(item, row) {
      this.$confirm('确认删除吗？')
        .then((_) => {
          delPeople({ userId: row.userId })
            .then((response) => {
              Message({
                message: response.m || '删除成功',
                type: 'success',
                duration: 2 * 1000
              })

              this.loadPeople(row.deptId)
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
</script>
 <style lang="scss">
.depart-cont {
  height: 100%;
  .left-bg {
    height: 100%;
  }
  .tree-btn {
    margin-left: 10px;
    &.btn-succ {
      color: #67c23a;
    }
    &.btn-edit {
      color: #66b1ff;
    }
    &.btn-del {
      color: #f56c6c;
    }
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
}

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
.service-deportForm {
  .el-select {
    width: 85%;
  }
}
</style>

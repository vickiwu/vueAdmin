<template>
  <div>
    <el-row>
      <el-col :span="5">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          @node-click="treeClick"
        ></el-tree>
      </el-col>
      <el-col :span="15">
        <div v-show="isOrg">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="">
              <el-input
                v-model="tableInputText"
                style="height: 30px"
                placeholder="请输入关键字"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="query()"
                >搜索</el-button
              >
            </el-form-item>
          </el-form>
          <el-table
            ref="multipleTable"
            border
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="序号" width="120">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column label="头像">
              <template slot-scope="scope">
                <img :src="scope.row.ImageUrl" style="height: 50px" />
              </template>
            </el-table-column>
            <el-table-column prop="name" label="用户ID" width="120">
            </el-table-column>
            <el-table-column
              prop="address"
              label="登录账号"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="address"
              label="用户名称"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="address"
              label="手机号码"
              show-overflow-tooltip
            >
            </el-table-column>
          </el-table>
          <el-pagination style='margin-top:10px;text-align:right'
            background
            layout="prev, pager, next"
            @current-change="clickChange"
            :total="100"
          >
          </el-pagination>
          <div style="margin-top: 20px; text-align: right">
            <el-button type="primary" @click="saveDD()">保存</el-button>
            <el-button @click="toggleSelection()">取消</el-button>
          </div>
        </div>
        <div v-show="!isOrg">
          <el-form :inline="true" label-width="153px" class="demo-form-inline">
            <el-row>
              <el-col :span="12">
                <el-form-item label="执法证编号" prop="deptName">
                  <el-input
                    class="input"
                    v-model="ruleForm.code"
                    placeholder="请输入执法证编号"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="管辖行政区域" prop="orgLevel">
                  <el-select
                    v-model="ruleForm.orgLevel"
                    placeholder="请选择管辖行政区域"
                  >
                    <!-- <el-option
                            v-for="(item, index) in orgLevelArryTemp"
                            :key="index"
                            :label="item.enumName"
                            :value="item.enumCode"
                            ></el-option>-->
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="环境保护部执法证编号" prop="deptName">
                  <el-input
                    class="input"
                    v-model="ruleForm.code"
                    placeholder="请输入执法证编号"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="管理部门" prop="orgLevel">
                  <el-select
                    v-model="ruleForm.orgLevel"
                    placeholder="请选择管理部门"
                  >
                    <!-- <el-option
                            v-for="(item, index) in orgLevelArryTemp"
                            :key="index"
                            :label="item.enumName"
                            :value="item.enumCode"
                            ></el-option>-->
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="其他证件名称及编号" prop="deptName">
                  <el-input
                    class="input"
                    v-model="ruleForm.code"
                    placeholder="请输入执法证编号"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否参与现场执法" prop="orgLevel">
                  <el-select
                    v-model="ruleForm.orgLevel"
                    placeholder="请选择是否参与现场执法"
                  >
                    <!-- <el-option
                            v-for="(item, index) in orgLevelArryTemp"
                            :key="index"
                            :label="item.enumName"
                            :value="item.enumCode"
                            ></el-option>-->
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="23" style="text-align: right">
                <el-form-item>
                  <el-button type="primary" @click="saveDD()">保存</el-button>
                  <el-button @click="cancel()">取消</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableInputText: "",
      multipleSelection: [], //表格选中数组
      isOrg: true,
      ruleForm: {
        code: "",
        orgLevel: "",
      },
      treeData: [
        {
          label: "一级 1",
          type: "org",
          children: [
            {
              label: "二级 1-1",
              type: "org",
              children: [
                {
                  label: "老姚",
                  type: "user",
                },
              ],
            },
          ],
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1",
                },
              ],
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1",
                },
              ],
            },
          ],
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1",
                },
              ],
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1",
                },
              ],
            },
          ],
        },
      ],
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  mounted() {},
  methods: {
    handleSelectionChange(val) {
      //表格多选

      this.multipleSelection = val;
    },
    toggleSelection() {
      //取消多选

      this.$refs.multipleTable.clearSelection();
    },
    query() {
      //表格查询
    },
    clickChange(data) {
      //点击分页
      console.log(data);
    },
    // prevClick(data){//上一页
    //      console.log(data)
    // },
    // nextClick(data){//下一页
    //      console.log(data)
    // },
    treeClick(data) {
      console.log(data);
      if (data.type == "org") {
        this.isOrg = true;
      } else {
        this.isOrg = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>>
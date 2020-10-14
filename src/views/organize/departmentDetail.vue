<template>
  <div>
    <el-row>
      <el-col :span="5">
        <el-radio-group v-model="tabPosition" style="margin-bottom: 10px">
          <el-radio-button label="add">添加</el-radio-button>
          <el-radio-button v-show="isShow" label="edit">编辑</el-radio-button>
          <el-radio-button v-show="isShow" label="del">删除</el-radio-button>
        </el-radio-group>
        <el-tree
          :data="treeData"
          :props="defaultProps"
          @node-click="treeClick"
        ></el-tree>
      </el-col>
      <el-col :span="12">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          label-width="80px"
          style="margin-top: 50px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="部门名称" prop="deptName" required>
                <el-input
                  class="input"
                  v-model="ruleForm.deptName"
                  placeholder="请输入部门名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="部门编码" prop="deptCode">
                <el-input
                  v-model="ruleForm.deptCode"
                  placeholder="请输入部门编码"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="上级部门" prop="pdeptId">
                <el-select
                  v-model="TopOrgLable"
                  placeholder="请选择上级部门"
                  class="selectTree"
                >
                  <el-option :value="TopOrgLable" style="height: auto">
                    <el-tree
                      :data="treeData"
                      node-key="id"
                      ref="tree"
                      :props="defaultProps"
                      @node-click="SJBMTreeClick"
                    ></el-tree>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="部门职责" prop="deptDuty">
                <el-select
                  multiple
                  collapse-tags
                  v-model="ruleForm.deptDuty"
                  placeholder="请选择部门职责"
                >
                  <el-option
                    v-for="(item, index) in responsibilitiesData"
                    :key="index"
                    :value="item.enumCode"
                    :label="item.enumName"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="显示顺序" prop="sort">
                <el-input
                  v-model="ruleForm.sort"
                  placeholder="请输入显示顺序"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注信息" prop="remark">
                <el-input type="textarea" v-model="ruleForm.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item style="text-align: right">
            <el-button type="primary" @click="saveDD()">保存</el-button>
            <el-button @click="cancel()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import organize from "@/api/organize";
export default {
  data() {
    return {
      tabPosition: "add",
      isShow: false,
      responsibilitiesData: [], //部门职责数据
      treeData: [],
      TopOrgLable: "", //上级部门

      ruleForm: {
        deptName: "",
        orgId: "",
        deptCode: "",
        deptDuty: "", //职责
        deptId: "", //部门id
        pdeptId: "", //上级部门id
        sort: "",
        remark: "",
      },
      rules: {
        deptName: [
          { required: true, message: "请输入部门名称", trigger: "blur" },
        ],
      },
      defaultProps: {
        children: "children",
        label: "deptName",
        id: "deptId",
      },
    };
  },
  mounted() {
    var id = this.$route.query.orgId;
    //var id = 13923;
    this.ruleForm.orgId = id;
    this.getTreeData(this.ruleForm.orgId);
    this.getResponsibilitiesData();
  },
  methods: {
    getTreeData(id) {
      //获取树
      organize.getBMTree({ orgId: id }).then((response) => {
        console.log(response.data);
        this.treeData = response.data;
      });
    },
    getResponsibilitiesData() {
      //获取部门职责数据
      var that = this;
      organize.getResponsibilities().then((response) => {
        console.log(response.data);
        that.responsibilitiesData = response.data;
      });
    },
    getEditData(id) {
      //根据部门id获取部门信息(编辑)
      // var that = this;
      organize.getEditData({ deptId: id }).then((response) => {
        var data = response.data;
        this.TopOrgLable = data.pdeptName; //上级部门文字
        this.ruleForm.deptName = data.deptName;
        this.ruleForm.deptCode = data.deptCode;
        this.ruleForm.deptDuty = data.deptDuty.split(",");
        this.ruleForm.deptId = data.deptId; //部门id
        this.ruleForm.pdeptId = data.pdeptId; //上级部门id
        this.ruleForm.sort = data.sort;
        this.ruleForm.remark = data.remark;
      });
    },

    treeClick(data) {
      this.isShow = true;
      this.resetForm("ruleForm");
      this.ruleForm.deptId = "";
      this.TopOrgLable = "";
      if (this.tabPosition == "edit") {
        this.ruleForm.deptId = ""; //部门id
      }
      if (this.tabPosition == "edit") {
         this.getEditData(data.deptId)
        //this.getEditData(6180203999313431);
      }
      if (this.tabPosition == "del") {
          this.delBM(data.deptId);
      }
    },
    SJBMTreeClick(data) {
      console.log(data);
      this.ruleForm.pdeptId = data.deptId;
      this.TopOrgLable = data.deptName;
    },
    delBM(id) {
      var that = this;
        this.$confirm("是否确认删除?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            organize.delBM({ deptId: id }).then((response) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.tabPosition = "add";
              this.getTreeData(this.ruleForm.orgId);
              this.getResponsibilitiesData();
            });
          })
    },
    saveDD() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.$confirm("是否确认提交?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
              this.ruleForm.deptDuty = this.ruleForm.deptDuty.join()
            organize.saveDD(this.ruleForm).then((response) => {
              this.$message({
                type: "success",
                message: "保存成功!",
              });
              this.tabPosition = "add";

               this.getTreeData(this.ruleForm.orgId);
              this.getResponsibilitiesData();
              this.resetForm("ruleForm");
              this.ruleForm.deptId = "";
              this.TopOrgLable = "";
            });
          });
        } else {
          return false;
        }
      });
    },
    cancel() {
         this.resetForm("ruleForm");
        this.TopOrgLable = "";
    },
    // 清空表单数据
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-input__inner {
  width: 205px !important;
}

</style>
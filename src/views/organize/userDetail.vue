<template>
  <div>
    <el-row>
      <el-col :span="5">
        <el-tree
          ref="tree"
          :data="treeData"
          :props="defaultProps"
          :expand-on-click-node="false"
          :load="loadNode"
          lazy
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
            height="500"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="序号" width="120">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column label="头像">
              <template slot-scope="scope">
                <img :src="scope.row.imgStr" style="height: 50px" />
              </template>
            </el-table-column>
            <el-table-column prop="userId" label="用户ID" width="120">
            </el-table-column>
            <el-table-column
              prop="loginName"
              label="登录账号"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="userName"
              label="用户名称"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="phone"
              label="手机号码"
              show-overflow-tooltip
            >
            </el-table-column>
          </el-table>
          <!-- <el-pagination
            style="margin-top: 10px; text-align: right"
            background
            layout="prev, pager, next"
            @current-change="clickChange"
            :total="total"
          >
          </el-pagination> -->
          <div style="margin-top: 20px; text-align: right">
            <el-button type="primary" @click="saveTable()">保存</el-button>
            <el-button @click="toggleSelection()">取消</el-button>
          </div>
        </div>
        <div v-show="!isOrg">
          <el-form
            :inline="true"
            :model="ruleForm"
            label-width="153px"
            ref="ruleForm"
            class="demo-form-inline"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="执法证编号" prop="cardNO">
                  <el-input
                    class="input"
                    v-model="ruleForm.cardNO"
                    placeholder="请输入执法证编号"
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="环境保护部执法证编号" prop="cardNO2">
                  <el-input
                    class="input"
                    v-model="ruleForm.cardNO2"
                    placeholder="请输入执法证编号"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="管理部门" prop="deptIds">

              
                    <tree-select :data="treeSelectData"
                                :defaultProps="defaultPropsSelectTree" multiple :collapse-tags="collapsetags"
                                :nodeKey="deptIdedId" :checkedKeys="defaultCheckedKeys" :checkedName="checkedName"
                                @change="selectChange"></tree-select>
                       
                




                  <!-- <el-select
                    v-model="tempMRLabelShow"
                    placeholder="请选择管理部门"
                    class="selectTree"
                    multiple
                   
                    @change="selectChange"
                  >
                    <el-option :value="tempMRValueShow"  style="height: auto">
                      <el-tree
                        :data="treeSelectData"
                        node-key="deptId"
                        ref="tree"
                        show-checkbox
                       
                        :props="defaultPropsSelectTree"
                        @check-change="handleCheckChange"
                      ></el-tree>
                    </el-option>
                  </el-select> -->
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="其他证件名称及编号" prop="otherCardNO">
                  <el-input
                    class="input"
                    v-model="ruleForm.otherCardNO"
                    placeholder="请输入执法证编号"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否参与现场执法" prop="isPart">
                  <el-select
                    v-model="ruleForm.isPart"
                    placeholder="请选择是否参与现场执法"
                  >
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="23" style="text-align: right">
                <el-form-item>
                  <el-button type="primary" @click="saveLawEnforcement()"
                    >保存</el-button
                  >
                  <el-button @click="resetForm('ruleForm')">取消</el-button>
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
import org from "@/api/organize/org";
import TreeSelect from '@/components/SelectTree'
export default {
   components: {
     TreeSelect
   },
  data() {
    return {
      tableInputText: "",
      multipleSelection: [], //表格选中数组
      isOrg: true,
      orgId: "",
      ruleForm: {
        cardNO: "",
        cardNO2: "",
        deptIds: [],
       // deptNames: [],
        isPart: "",
        otherCardNO: "",
        userId: "",
      },
      treeData: [],
      treeSelectData: [],
      tableData: [],
      selectionResult: [], //提交的选中数据
      defaultCheckedKeys: [],//默认选中的下拉树数据
      checkedName:[],//默认选中的下拉树文字
      treeTypeId: {
        type: null,
        id: null,
        queryType: null,
      },
      treeNode: null,
      defaultProps: {
        children: "children",
        label: "comName",
        id: "comId",
      },
      defaultPropsSelectTree: {
        children: "children",
        label: "deptName",
        id: "deptId",
      },
      deptIdedId:"deptId",
      collapsetags:true,
    };
  },
  mounted() {
    this.orgId = this.$route.query.orgId;
    this.getTreeData(this.orgId, 1);
     this.getSelectTreeData(this.orgId); //表单管理部门下拉树
  },
  methods: {
    getTreeData(id, type) {
      //获取树

      org.getDepartmentTree({ id: id, type: type }).then((response) => {
        this.treeData = response.data;
        this.treeClick(this.treeData[0]);
      });
    },
    getSelectTreeData(id) {
      //下拉树
      //获取树
      org.getBMTree({ orgId: id }).then((response) => {
        this.treeSelectData = response.data;
      });
    },
    loadNode(node, resolve) {
      //tree懒加载

      if (node.level === 0) {
        return;
      } else {
        var types;

        if (node.data.type == 1) {
          types = 2;
        }
        if (node.data.type == 2) {
          types = 3;
        }
        if (node.data.type == 3) {
          types = 4;
        }
        org
          .getDepartmentTree({ id: node.data.comId, type: types })
          .then((response) => {
            resolve(response.data);
          });
      }
    },
    refreshNodeBy(id) {
      let node = this.$refs.tree.getNode(this.treeNode); // 通过节点id找到对应树节点对象
      node.loaded = false;
      //node.isLeaf = false;
      node.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节点
    },
    treeClick(data, node) {
      this.treeNode = node;
      //点击tree事件
      if (data.type == 1) {
        //comId
        this.isOrg = true;
        this.treeTypeId.queryType = 1;
        this.treeTypeId.type = 1;
        this.treeTypeId.id = data.comId;

        this.getUserList(data.comId, 1);
      } else if (data.type == 2) {
        //comId
        this.isOrg = true;
        this.treeTypeId.queryType = 11;
        this.treeTypeId.type = 2;
        this.treeTypeId.id = data.comId;
        this.getUserList(data.comId, 11);
      } else {
        this.isOrg = false;
        // this.ruleForm.userId = data.comId;
        this.ruleForm.userId = 1;
        this.getLawEnforcementByUser();
      }
    },
    getUserList(id, type) {
      //表格数据
      let params = {
        limit: this.pageSize,
        page: this.page,
        userName: this.tableInputText,
        id: id,
        type: type,
      };
      var that = this;
      org.getUserList(params).then((response) => {
        this.tableData = response.data;
        that.multipleSelection = [];
        response.data.forEach(function (v, i) {
          if (v.userIdIn > 0) {
            that.multipleSelection.push(v);
          }
        });
        that.toggleSelection(this.multipleSelection);
      });
    },
    handleSelectionChange(val) {
      //表格多选

      this.multipleSelection = val;
    },
    toggleSelection(rows) {
      //选中表格方法
      if (rows) {
        rows.forEach((row) => {
          this.$nextTick(() => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    query() {
      //表格查询
      this.getUserList(this.treeTypeId.id, this.treeTypeId.queryType);
    },
    saveTable() {
      //表格保存
      this.selectionResult = [];
      this.multipleSelection.forEach((row) => {
        this.selectionResult.push(row.userId);
      });
      var paramType1 = {
        id: this.treeTypeId.id,
        type: this.treeTypeId.type,
        userIds: this.selectionResult.join(),
      };
      org.saveOrgUser(paramType1).then((response) => {
        this.$confirm("是否确认提交?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          if (this.treeTypeId.type === 1) {
            this.$message({
              type: "success",
              message: "保存成功!",
            });
            this.refreshNodeBy(this.treeTypeId.id);
          }
          if (this.treeTypeId.type === 2) {
            var paramType2 = {
              deptId: this.treeTypeId.id,
              userIdList: this.selectionResult.join(),
            };
            org.saveDepartmentUser(paramType2).then((response) => {
              this.$message({
                type: "success",
                message: "保存成功!",
              });
              this.refreshNodeBy(this.treeTypeId.id);
            });
          }
        });
      });
    },
    getLawEnforcementByUser() {
      //获取人员信息
      org
        .getLawEnforcementByUser({ userId: this.ruleForm.userId })
        .then((response) => {
          var data = response.data;
          if (data.isPart == true) {
            this.ruleForm.isPart = "1";
          } else if (data.isPart == false) {
            this.ruleForm.isPart = "0";
          }
          this.ruleForm.cardNO = data.cardNO;
          this.ruleForm.cardNO2 = data.cardNO2;
          this.ruleForm.otherCardNO = data.otherCardNO;
          this.ruleForm.deptIds = data.deptIds.split(",");
          this.defaultCheckedKeys = data.deptIds.split(",");//默认选中的下拉树数据
          this.checkedName = data.deptNames.split(",");//默认选中的下拉树数据
          //this.$refs.tree.setCheckedKeys(["6187982494243841","6237215887765504"]);
         
        });
    },
     // 改变默认选中的节点数据
    initChecked () {
      this.defaultCheckedKeys = [];
    },
    //获取选中的值
    // popoverHide (checkedIds, checkedData) {
    //     this.ruleForm.deptIds=[];
    //     this.ruleForm.deptIds = checkedIds
    // },
      selectChange(data){//下拉树数据改变
         this.ruleForm.deptIds=[];
        this.ruleForm.deptIds = data
      },
    saveLawEnforcement() {
      
      //人员的表单保存
      this.$confirm("是否确认提交?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.ruleForm.deptIds = this.ruleForm.deptIds.join(",");
        org.saveLawEnforcement(this.ruleForm).then((response) => {
          this.$message({
            type: "success",
            message: "保存成功!",
          });
          this.resetForm("ruleForm");
        });
      });
    },
    // 清空表单数据
    resetForm(formName) {
      this.TopOrgLable = "";
      this.$refs[formName].resetFields();
      this.initChecked();
    },
  },
  watch: {
    // 默认点击Tree第一个节点
    treeData(val) {
      if (val) {
        this.$nextTick(() => {
          document.querySelector(".el-tree-node__content").click();
        });
      }
    },
  },
};
</script>
<style lang="scss">
.el-tree {
  min-width: 100%;
  display: inline-block;
}
</style>>
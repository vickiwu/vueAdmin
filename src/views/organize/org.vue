<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="">
        <el-input
          v-model="inputText"
          style="height: 30px"
          placeholder="请输入关键字"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit"
          >搜索</el-button
        >
      </el-form-item>
     
      <el-form-item>
        <el-button
          v-permission="['organize:oper:add']"
          type="primary"
          icon="el-icon-plus"
          @click="modalShow('new', '')"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%"
      row-key="orgId"
      border
      lazy
      :load="load"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="序号" min-width="4%">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="orgName" label="机构名称" min-width="15%">
      </el-table-column>
      <el-table-column prop="orgCode" label="机构编码" min-width="5%">
      </el-table-column>
      <el-table-column prop="orgType" min-width="5%" label="类型">
      </el-table-column>
      <el-table-column prop="orgLevel" min-width="5%" label="级别">
        <template slot-scope="scope">
          <span v-if="scope.row.orgLevel == 'province'">省</span>
          <span v-else-if="scope.row.orgLevel == 'city'">市</span>
          <span v-else-if="scope.row.orgLevel == 'district'">区</span>
          <span v-else-if="scope.row.orgLevel == 'county'">县</span>
          <span v-else-if="scope.row.orgLevel == 'street'">街道</span>
          <span v-else-if="scope.row.orgLevel == 'village'">村</span>
          <span v-else-if="scope.row.orgLevel == 'other'">其他</span>
        </template>
      </el-table-column>
      <el-table-column min-width="25%" label="操作">
        <template slot-scope="scope">
          <el-button
            type="success"
            icon="el-icon-plus"
            size="mini"
            style="padding: 7px"
            @click="modalShow('add', scope.row)"
            >添加</el-button
          >
          <el-button
            icon="el-icon-edit"
            size="mini"
            style="padding: 7px"
            @click="modalShow('edit', scope.row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            style="padding: 7px"
            @click="onDel(scope.row)"
            >删除</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            style="padding: 7px"
            @click="onBM(scope.row)"
            >部门</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-user"
            size="mini"
            style="padding: 7px"
            @click="onUser(scope.row)"
            >人员</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 模态框 -->
    <el-dialog :title="modalText" :visible.sync="dialogVisible" width="674px">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="90px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="机构名称" prop="orgName" required>
              <el-input
                v-model="ruleForm.orgName"
                placeholder="请输入机构名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机构编码" prop="orgCode">
              <el-input
                v-model="ruleForm.orgCode"
                placeholder="请输入机构编码"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="机构类型" prop="orgType" required>
              <el-select
                v-model="ruleForm.orgType"
                placeholder="请选择机构类型"
              >
                <el-option v-for="val in orgTypeArryTemp" :key="val.orgTypeId" :value="val.orgTypeId" :label="val.orgTypeName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上级机构" prop="pOrgId">
              <!-- <el-select v-model="ruleForm.TopOrg" placeholder="请选择上级机构">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select> -->

              <el-select
                v-model="TopOrgLable"
                placeholder="请选择"
                
                collapse-tags
              >
                <el-option  :value="TopOrgLable" style="height: auto">
                  <el-tree
                    :data="orgTopArryTemp"
                    node-key="id"
                    ref="tree"
                    :props="defaultProps"
                    @node-click="handleClcik"
                  ></el-tree>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="机构级别" prop="orgLevel">
              <el-select v-model="ruleForm.orgLevel" placeholder="请选择机构级别">
                <el-option
                  v-for="(item, index) in orgLevelArryTemp"
                  :key="index"
                  :label="item.enumName"
                  :value="item.enumCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="中心坐标">
              <el-col :span="11">
                <el-form-item prop="longitude">
                  <el-input
                    v-model="ruleForm.longitude"
                    placeholder="请输入经度"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" style="margin-left: 15px">
                <el-form-item prop="latitude">
                  <el-input
                    v-model="ruleForm.latitude"
                    placeholder="请输入纬度"
                  ></el-input>
                </el-form-item>
              </el-col>
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
            <el-form-item label="备注信息" prop="remarks">
              <el-input type="textarea" v-model="ruleForm.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item style="text-align: right">
          <el-button type="primary" @click="save()">保存</el-button>
          <el-button @click="cancel()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
    

<script>
import org from "@/api/organize/org";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      inputText: "",
      dialogVisible: false,
      tableData: [],
      modalText: "",
      TopOrgLable:"",//上级机构的中文
      orgTypeArry:[],
      orgTypeArryTemp:[],
      orgTopArry:[],
      orgTopArryTemp:[],
      orgLevelArry:[],
      orgLevelArryTemp:[],
       defaultProps: {
          children: 'childOrgs',
          label: 'orgName',
          id:'orgId'
        },
      ruleForm: {
        orgId: null,
        pOrgId: null,
        orgName: "",
        orgCode: "",
        orgType: "",
        orgLevel: "",
        longitude: "",
        latitude: "",
        sort: "",
        remarks: "",
      },
      rules: {
        orgName: [
          { required: true, message: "请输入机构名称", trigger: "blur" },
        ],
        orgType: [
          { required: true, message: "请输入机构类型", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getData("", "");
    this.getOrgTypeList();
    this.getOrgTopList();
    this.getOrgLevelList();
  },
  methods: {
    getData(name, orgId) {
      var that = this;
      org.getTableList({ orgName: name, orgId: orgId }).then((response) => {
        this.tableData = response.data;
      });
    },
    onSubmit() {
      this.getData(this.inputText,"");
    },
  //  懒加载表格树
   load(tree, treeNode, resolve) {
      org.getTableList({ orgName: "", orgId: tree.orgId }).then((response) => {
        resolve(response.data);
      });
    },
    modalShow(type, data) {
      this.dialogVisible = true;
      this.TopOrgLable = "";
      this.ruleForm.pOrgId = "";//清空下拉树
      this.orgTypeArryTemp = this.orgTypeArry;
      this.orgTopArryTemp = this.orgTopArry;
      this.orgLevelArryTemp = this.orgLevelArry;
      this.$nextTick(() => {
        this.resetForm("ruleForm");
       
      });
      if (type == "new") {
        this.modalText = "新增";
        this.ruleForm.orgId = null;
        //  console.log(this.ruleForm)
      } else if (type == "add") {
        this.modalText = "添加";
        this.ruleForm.orgId = null;
        console.log(data.porgId)
        this.TopOrgLable = data.orgName;
        this.ruleForm.pOrgId = data.orgId;
       console.log(data)
      } else if (type == "edit") {
        this.modalText = "修改";
        this.getEditData(data);
      }
    },

    onDel(data) {
      var that = this;
       this.$confirm("是否确认删除?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
             org.del({"orgId":data.orgId}).then((response) => {
               this.$message({
                  type: "success",
                  message: "删除成功!",
                });
               this.getData(that.inputText, "");
             });
          })
    },
    onBM(data) {
       this.$router.push({path:'/organize/departmentDetail',query:{orgId:data.orgId}})
       
    },
    onUser(data) {
      // this.$router.push({path:'/organize/userDetail',query:{orgId:data.orgId}})
       this.$router.push({path:'/organize/userDetail',query:{orgId:data.orgId}})
    },
    // 机构类型列表
    getOrgTypeList(){
      var that = this;
      org.getOrgTypeList().then((response) => {
           this.orgTypeArry =  response.data;
      });
    },
     // 机构类型列表
    getOrgTopList(){
      var that = this;
      org.getOrgTopList().then((response) => {
           this.orgTopArry.push(response.data);
         });
    },
    //机构级别列表
    getOrgLevelList(){
      var that = this;
      org.getOrgLevelList().then((response) => {
            this.orgLevelArry =  response.data;
         });
    },
    // 下拉树方法
    handleClcik(data) {
      console.log(data)
      var that = this;
      //let res = this.$refs.tree.getCheckedNodes(false, true); //true，1. 是否只是叶子节点 2.选择的时候不包含父节点）
       this.ruleForm.TopOrg = data.orgId;
       this.TopOrgLable = data.orgName;
    },
    //编辑获取数据
    getEditData(data){
       org.getEditData({"orgId":data.orgId}).then((response) => {
        var tempData = response.data;
        this.TopOrgLable = tempData.pOrgName;
        this.ruleForm = {...response.data};
      
       })
    },
    // 保存表单
    save() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.$confirm("是否确认提交?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            org.save(this.ruleForm).then((response) => {
              this.$message({
                type: "success",
                message: "保存成功!",
              });
              this.dialogVisible = false;
              this.getData(this.inputText, "");
            });
          });
        } else {
          return false;
        }
      });
    },
    //取消保存
    cancel() {
      //this.resetForm("ruleForm");
      this.dialogVisible = false;
    },
    // 清空表单数据
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<style lang="scss" scoped>
	// ::v-deep .el-input__inner{
  //       width: 205px !important;
  //   }
    // ::v-deep .el-select-dropdown__item,.selected,.hover{
    //     padding:0 !important;
    // }
</style>

<template>
  <div class="app-container">
    <!-- <small>字典管理</small> -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="">
        <el-input
          v-model="tableQuery.vagueName"
          style="height: 30px"
          placeholder="请输入关键字"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search"  size="small" @click="getTableList"
          >搜索</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="['system:dic:add']"
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="modalShow('add', '')"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
    class="auth-table"
      :data="tableData"
      style="width: 100%"
      border
      :show-overflow-tooltip="true"
      @sort-change="sortChange"
    >
      <el-table-column label="序号" width="100">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="groupCode" label="字典代码" sortable>
      </el-table-column>
      <el-table-column prop="groupName" label="字典名称" sortable >
      </el-table-column>
      <el-table-column prop="groupTypeName" label="字典类别" sortable >
      </el-table-column>

      <el-table-column prop="remark" label="备注信息" sortable >
      </el-table-column>
      <el-table-column label="操作" width="250" header-align="left"  align="right">
        <template slot-scope="scope">

          <el-button
            v-permission="['system:dic:update']"
            icon="el-icon-edit"
            size="mini"
            @click="modalShow('edit', scope.row)"
            >修改</el-button
          >
          <el-button
            v-permission="['system:dic:del']"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="del(scope.row)"
            >删除</el-button
          >
          <el-button
            v-permission="['system:dic:item']"
            type="primary"
            size="mini"
            @click="goDic(scope.row)"
            ><svg-icon  icon-class="zidianxiang" class-name="icon"/>字典项</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="total, prev, pager, next"
      :hide-on-single-page="hidePage"
      :total="total"
    />
    <el-dialog :title="modalText" :visible.sync="dialogVisible" width="500px">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="字典代码" prop="groupCode" >
          <el-input v-model="ruleForm.groupCode" placeholder="请输入字典代码" />
        </el-form-item>
        <el-form-item label="字典名称" prop="groupName" >
          <el-input v-model="ruleForm.groupName" placeholder="请输入字典名称" />
        </el-form-item>
        
        <el-form-item label="字典类型" prop="groupType" >
          <el-select v-model="ruleForm.groupType" placeholder="请选择字典类型">
            <el-option
              v-for="(item, index) in dicTypeArr"
              :key="index"
              :label="item.enumName"
              :value="item.enumCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input type="textarea" v-model="ruleForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save()"> 确认 </el-button>
        <el-button @click="dialogVisible = false"> 取消 </el-button>
        
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dic from "@/api/system/dic.js";
export default {
  data() {
    return {
      hidePage:true,
      tableData: [],
      total:null,
      dialogVisible: false,
      modalText:"",
      dicTypeArrTemp:[],
      dicTypeArr:[],//字典类型数组
      ruleForm: {
        groupCode: "",
        groupName: "",
        groupType: "",
        remark: ""
      },
      tableQuery: {
        limit: 5,
        page: 1,
        sort: "groupCode",
        sortOrder: "asc",
        vagueName: "",
      },
      rules: {
        groupCode: [
          { required: true, message: "请输入字典代码", trigger: "blur" },
        ],
        groupName: [
          { required: true, message: "请输入字典名称", trigger: "blur" },
        ],
         groupType: [
          { required: true, message: "请选择字典类型",  trigger: 'change' },
        ],
      },
    };
  },
  mounted() {
    this.getTableList();
    this.getDicType()
  },
  methods: {
    getTableList() {
      var params = {
        limit: this.tableQuery.limit,
        page: this.tableQuery.page,
        sort: this.tableQuery.sort,
        sortOrder: this.tableQuery.sortOrder,
        vagueName: this.tableQuery.vagueName,
      };
      dic.getTableList(params).then((response) => {
        this.total = response.data.count
        this.tableData = response.data.data;
      });
    },
    sortChange(	column, prop, order) {//表格排序
      this.tableQuery.sort = column.prop
      this.tableQuery.sortOrder = column.order
      this.getTableList()
    },
    modalShow(type,data) {
     this.dicTypeArr = this.dicTypeArrTemp
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.resetForm("ruleForm");
       
      });
       if (type == "add") {
        this.modalText = "添加";
      } else if (type == "edit") {
        this.modalText = "修改";
        this.getDicEdit(data.groupCode);
      }
      
    },
    getDicType(){
       dic.getDicType().then((response) => {
         this.dicTypeArrTemp = response.data
      });
    },
    getDicEdit(groupCode){
      dic.getDicEdit({groupCode:groupCode}).then((response) => {
        response.data.groupType = response.data.groupType.toString()
       this.ruleForm = {...response.data}
      });
    },
    del(row) {
       this.$confirm("是否确认删除?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            dic.del({groupCode:row.groupCode}).then((response) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.dialogVisible = false;
              this. getTableList()
            });
          });
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
            dic.save(this.ruleForm).then((response) => {
              this.$message({
                type: "success",
                message: "保存成功!",
              });
              this.dialogVisible = false;
              this. getTableList()
            });
          });
        } else {
          return false;
        }
      });
    },
    goDic(row){
         this.$router.push({path:'/system/dicItem',query:{groupCode:row.groupCode,groupType:row.groupType}})
    },
     // 清空表单数据
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
 <style lang="scss" scoped>
 .demo-ruleForm ::v-deep .el-input__inner{
          width: 200px;
 }
 	.auth-table {
    .el-button--mini,
    .el-button--mini.is-round {
      padding: 5px 10px;
    }

  }
  .icon{
    margin-right:5px;
  }
</style>

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
        <el-button type="primary" icon="el-icon-search" @click="getTableList"
          >搜索</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="['organize:oper:add']"
          type="primary"
          icon="el-icon-plus"
          @click="modalShow('add', '')"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      :show-overflow-tooltip="true"
      @sort-change="sortChange"
    >
      <el-table-column label="序号" width="50">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="groupCode" label="字典代码" sortable width="150">
      </el-table-column>
      <el-table-column prop="groupName" label="字典名称" sortable width="150">
      </el-table-column>
      <el-table-column prop="groupTypeName" label="字典类别" sortable width="150">
      </el-table-column>

      <el-table-column prop="remark" label="备注信息" sortable width="150">
      </el-table-column>
      <el-table-column label="操作">
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
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="total, prev, pager, next"
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
          <el-input v-model="ruleForm. groupCode" placeholder="请输入字典代码" />
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
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="save()"> 确认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dic from "@/api/system/dic.js";
export default {
  data() {
    return {
      searchWords: "",
      listLoading: false,
      dialogFormVisible: false,
      tableData: [],
      total:null,
      dialogVisible: false,
      modalText:"",
      dicTypeArr:[],//字典类型数组
      ruleForm: {
        groupCode: "",
        groupName: "",
        groupType: "",
        remark: ""
      },
      tableQuery: {
        limit: 2,
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
      this.resetForm("ruleForm");
      this.dialogVisible = true;
       if (type == "add") {
        this.modalText = "添加";
      } else if (type == "edit") {
        this.modalText = "修改";
      }

    },
    getDicDetail(){
      dic.getDicDetail(params).then((response) => {
        // this.total = response.data.count
        // this.tableData = response.data.data;
      });
    },
    onDel() {},
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
              this. getTableList()
            });
          });
        } else {
          return false;
        }
      });
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
</style>

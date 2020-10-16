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
          @click="modalShow('new', '')"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
  <el-table
    :data="tableData"
    style="width: 100%"
    border
     :show-overflow-tooltip='true'
     @sort-change="sortChange"
    :default-sort = "{prop: 'date', order: 'descending'}"
    >
     <el-table-column label="序号" width="50">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
     </el-table-column>
    <el-table-column
      prop="date"
      label="监测因子代码"
      sortable
      width="150">
    </el-table-column>
    <el-table-column
      prop="name"
      label="监测因子名称"
      sortable
      width="150">
    </el-table-column>
    <el-table-column
      prop="address"
      label="监测因子类别"
       width="150"
      >
    </el-table-column>

     <el-table-column
      prop="address"
      label="因子监测类型"
       width="150"
      >
    </el-table-column>
     <el-table-column
      prop="address"
      label="缺省单位"
       width="100"
      >
    </el-table-column>
     <el-table-column
      prop="address"
      label="浓度单位"
       width="100"
     >
    </el-table-column>
     <el-table-column
      prop="address"
      label="排放量单位"
       width="100"
      >
    </el-table-column>
     <el-table-column
      prop="address"
      label="监测因子类别">
    </el-table-column>
     <el-table-column  label="操作">
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
    <el-dialog
      title="新增应用"
      :visible.sync="dialogFormVisible"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="应用标识" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入应用标识" />
        </el-form-item>
        <el-form-item label="应用名称" prop="region">
          <el-input v-model="ruleForm.name" placeholder="请输入应用名称" />
        </el-form-item>
        <el-form-item label="活动时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker v-model="ruleForm.date1" type="date" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker v-model="ruleForm.date2" type="fixed-time" placeholder="选择时间" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="即时配送" prop="delivery">
          <el-switch v-model="ruleForm.delivery" />
        </el-form-item>
        <el-form-item label="活动性质" prop="type">
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox label="美食/餐厅线上活动" name="type" />
            <el-checkbox label="地推活动" name="type" />
            <el-checkbox label="线下主题活动" name="type" />
            <el-checkbox label="单纯品牌曝光" name="type" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="特殊资源" prop="resource">
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="线上品牌商赞助" />
            <el-radio label="线下场地免费" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动形式" prop="desc">
          <el-input v-model="ruleForm.desc" type="textarea" />
        </el-form-item>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dic from "@/api/system/dic.js";
export default {
  data() {
    return {
      searchWords: '',
      listLoading: false,
      dialogFormVisible: false,
      tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
      
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      tableQuery:{
        limit:5,
        page:1,
        sort:"groupCode",
        sortOrder:"ascending",
        vagueName:""
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    total() {
      return this.tableData.length
    }
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    getTableList(){
      var params = {
        limit:this.tableQuery.limit,
        page:this.tableQuery.page,
        sort:this.tableQuery.sort,
        sortOrder:this.tableQuery.sortOrder,
        vagueName:this.tableQuery.vagueName
      }
      dic.getTableList(params).then((response) => {
        //this.tableData = response.data;
      });
    },
    sortChange(){

    },
     modalShow(){

     },
     onDel(){}
  }
}
</script>
 <style lang="scss">

 </style>

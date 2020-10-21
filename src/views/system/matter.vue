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
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="getTableList"
          >搜索</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="['system:matter:add']"
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
      @sort-change="sortChange"
    >
      <el-table-column label="序号" width="100">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="matterCode"
        width="200"
        label="监测因子代码"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="matterName"
        show-overflow-tooltip
        width="200"
        label="监测因子名称"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="matterTypeName"
        width="200"
        label="监测因子类别"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="matterMoniterTypeName"
        width="200"
        label="监测因子类型"
        sortable
      >
      </el-table-column>
      <el-table-column prop="defaultUnit" width="120" label="缺省单位" sortable>
      </el-table-column>
      <el-table-column prop="disUnit" width="120" label="浓度单位" sortable>
      </el-table-column>
      <el-table-column
        prop="matterMoniterType"
        width="120"
        label="排放量单位"
        sortable
      >
      </el-table-column>

      <el-table-column
        label="操作"
        width="250"
        header-align="left"
        align="right"
      >
        <template slot-scope="scope">
          <!-- v-permission="['system:dic:update']" -->
          <el-button
            icon="el-icon-search"
            size="mini"
            type="primary"
            @click="modalShow('look', scope.row)"
            >查看</el-button
          >
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
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 20px"
      background
      layout="total, prev, pager, next"
      :hide-on-single-page="hidePage"
      :page-size="tableQuery.limit"
      :total="total"
      @current-change="currentChange"
    />
    <el-dialog :title="modalText" :visible.sync="dialogVisible" width="750px">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="因子代码" prop="matterCode">
              <el-input
                v-if="isShow"
                v-model="ruleForm.matterCode"
                placeholder="请输入字典代码"
              />
              <span v-if="!isShow">{{ ruleForm.matterCode }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="因子名称" prop="matterName">
              <el-input
                v-if="isShow"
                v-model="ruleForm.matterName"
                placeholder="请输入字典名称"
              />
              <span v-if="!isShow">{{ ruleForm.matterName }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="因子类型" prop="matterType">
              <el-select
                v-if="isShow"
                v-model="ruleForm.matterType"
                placeholder="请选择因子类型"
              >
                <el-option
                  v-for="val in matterTypeArryTemp"
                  :key="val.enumCode"
                  :value="val.enumCode"
                  :label="val.enumName"
                />
              </el-select>
              <span v-if="!isShow">{{ ruleForm.matterTypeName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="因子监测类型" prop="matterMoniterType">
              <el-select
                v-if="isShow"
                v-model="ruleForm.matterMoniterType"
                placeholder="请选择因子类型"
              >
                <el-option
                  v-for="val in matterMoniterTypeArryTemp"
                  :key="val.enumCode"
                  :value="val.enumCode"
                  :label="val.enumName"
                />
              </el-select>
              <span v-if="!isShow">{{ ruleForm.matterMoniterTypeName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="缺省单位" prop="defaultUnit">
              <el-input
                v-if="isShow"
                v-model="ruleForm.defaultUnit"
                placeholder="请输入字典代码"
              />
              <span v-if="!isShow">{{ ruleForm.defaultUnit }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="浓度单位" prop="conUnit">
              <el-input
                v-if="isShow"
                v-model="ruleForm.conUnit"
                placeholder="请输入字典名称"
              />
              <span v-if="!isShow">{{ ruleForm.conUnit }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排放量单位" prop="disUnit">
              <el-input
                v-if="isShow"
                v-model="ruleForm.disUnit"
                placeholder="请输入字典代码"
              />
              <span v-if="!isShow">{{ ruleForm.disUnit }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数值长度">
              <el-col :span="11">
                <el-form-item prop="intLen">
                  <el-input
                    v-if="isShow"
                    v-model="ruleForm.intLen"
                    placeholder="整位数长度"
                  ></el-input>

                  <span v-if="!isShow">{{ ruleForm.intLen }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="11" style="margin-left: 15px">
                <el-form-item prop="decLen">
                  <el-input
                    v-if="isShow"
                    v-model="ruleForm.decLen"
                    placeholder="小位数长度"
                  ></el-input>

                  <span v-if="!isShow">{{ ruleForm.decLen }}</span>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否可计算" prop="canCalc">
              <el-radio-group v-model="ruleForm.canCalc" v-if="isShow">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
              <span v-if="!isShow">{{ canCalced }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否常用" prop="isUsual">
              <el-radio-group v-model="ruleForm.isUsual" v-if="isShow">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
              <span v-if="!isShow">{{ isUsualed }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="自动监测" prop="isAutoMonitor">
              <el-radio-group v-model="ruleForm.isAutoMonitor" v-if="isShow">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
              <span v-if="!isShow">{{ isAutoMonitored }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="大气监测因子" prop="isAirMatter">
              <el-radio-group v-model="ruleForm.isAirMatter" v-if="isShow">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
              <span v-if="!isShow">{{ isAirMattered }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="备注信息" prop="remark">
              <el-input
                type="textarea"
                v-model="ruleForm.remark"
                v-if="isShow"
              ></el-input>
              <span v-if="!isShow">{{ ruleForm.remark }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save()"> 确认 </el-button>
        <el-button @click="dialogVisible = false"> 取消 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import matter from "@/api/system/matter.js";
export default {
  data() {
    return {
      hidePage: true,
      tableData: [],
      total: null,
      dialogVisible: false,
      modalText: "",
      isShow: true,
      matterTypeArry: null, //因子类别数组
      matterMoniterTypeArry: null, //因子监测类型
      matterTypeArryTemp: null, //因子类别数组
      matterMoniterTypeArryTemp: null, //因子监测类型
      ruleForm: {
        matterCode: null, // 因子代码
        matterName: null, // 因子名称
        matterType: null, // 因子类别
        matterTypeName: "", // 因子类别名称
        matterMoniterType: null, // 因子监测类型
        matterMoniterTypeName: "", // 因子监测类型名称
        defaultUnit: null, // 缺省单位
        conUnit: null, // 浓度单位
        disUnit: null, // 排放量单位
        intLen: null, // 整数位长度
        decLen: null, // 小数位长度
        canCalc: null, // 是否可计算
        isUsual: null, // 是否常用因子
        isAutoMonitor: null, // 是否自动监测因子
        isAirMatter: null, // 是否大气监测因子
        remark: null, // 备注
      },
      tableQuery: {
        limit: 10,
        page: 1,
        sort: "matterCode",
        sortOrder: "ascending",
        vagueName: "",
      },
      rules: {
        matterCode: [
          { required: true, message: "请输入因子代码", trigger: "blur" },
        ],
        matterName: [
          { required: true, message: "请输入因子名称", trigger: "blur" },
        ],
        matterType: [
          { required: true, message: "请选择因子类别", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getTableList();
    this.getmatterType();
    this.getMatterMoniterType();
  },
  computed: {
    canCalced: function () {
      if(this.ruleForm.canCalc==1){
        return "是"
      }else if(this.ruleForm.canCalc==0){
        return "否"
      }
    },
     isUsualed: function () {
      if(this.ruleForm.isUsual==1){
        return "是"
      }else if(this.ruleForm.isUsual==0){
        return "否"
      }
    },
     isAutoMonitored: function () {
     if(this.ruleForm.isAutoMonitor==1){
        return "是"
      }else if(this.ruleForm.isAutoMonitor==0){
        return "否"
      }
    },
     isAirMattered: function () {
     if(this.ruleForm.isAirMatter==1){
        return "是"
      }else if(this.ruleForm.isAirMatter==0){
        return "否"
      }
    },
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
      matter.getTableList(params).then((response) => {
        this.total = response.data.count;
        this.tableData = response.data.data;
      });
    },
    sortChange(column, prop, order) {
      //表格排序
      if (column.order == null) {
        return;
      } else {
        this.tableQuery.sort = column.prop;
        this.tableQuery.sortOrder = column.order;
        this.getTableList();
      }
    },
    modalShow(type, data) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.resetForm("ruleForm");
      });
      this.matterTypeArryTemp = this.matterTypeArry; //因子类别数组
      this.matterMoniterTypeArryTemp = this.matterMoniterTypeArry; //因子监测类型
      if (type == "add") {
        this.modalText = "新增";
        this.isShow = true;
      } else if (type == "look") {
        this.modalText = "查看";
        this.isShow = false;
        this.getMatterByCode(data.matterCode)
      } else if (type == "edit") {
        this.modalText = "修改";
        this.isShow = true;
        this.getMatterByCode(data.matterCode)
      }
    },
    getmatterType() {
      //因子类别请求
      matter.getMatterType().then((response) => {
        this.matterTypeArry = response.data;
      });
    },
    getMatterMoniterType() {
      //因子监测类型请求
      matter.getMatterMoniterType().then((response) => {
        this.matterMoniterTypeArry = response.data;
      });
    },
    getMatterByCode(code) {
     ///获取因子信息
      matter.getMatterByCode({matterCode:code}).then((response) => {
        this.ruleForm = {...response.data};
      });
    },
    
    del(row) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        matter.removeMatter({ matterCode: row.matterCode }).then((response) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.dialogVisible = false;
          this.getTableList();
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
            matter.saveMatter(this.ruleForm).then((response) => {
              this.$message({
                type: "success",
                message: "保存成功!",
              });
              this.dialogVisible = false;
              this.getTableList();
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
    currentChange(page) {
      //分页
      this.tableQuery.page = page;
      this.getTableList();
    },
  },
};
</script>
 <style lang="scss" scoped>
.auth-table {
  .el-button--mini,
  .el-button--mini.is-round {
    padding: 5px 10px;
  }
}
.icon {
  margin-right: 5px;
}
</style>

<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-button
          v-permission="['organize:oper:add']"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="addTable()"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <el-table class="auth-table" :data="tableData" style="width: 100%" border>
      <el-table-column label="字典项代码" width="180">
        <template scope="scope">
          <el-input
            size="small"
            v-model="scope.row.enumCode"
            placeholder="请输入字典项代码"
            @change="handleEdit(scope.$index, scope.row)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="字典项名称" width="180">
        <template scope="scope">
          <el-input
            size="small"
            v-model="scope.row.enumName"
            placeholder="请输入字典项名称"
            @change="handleEdit(scope.$index, scope.row)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="所属机构" width="250" v-if="isShowOrgTree">
        <template slot-scope="scope">
          <tree-select
            :data="treeSelectData"
            :dataIndexs="scope.$index"
            :defaultProps="defaultPropsSelectTree"
            multiple
            :collapse-tags="collapsetags"
            :nodeKey="deptIdedId"
            :checkedKeys="scope.row.dicOrgList"
            @change="selectChange"
          ></tree-select>
        </template>
      </el-table-column>
      <el-table-column label="附加信息1" width="120">
        <template scope="scope">
          <el-input
            size="small"
            v-model="scope.row.addOne"
            placeholder="请输入附加信息1"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="附加信息1说明" width="180">
        <template scope="scope">
          <el-input
            size="small"
            v-model="scope.row.addOneDesc"
            placeholder="请输入附加信息1说明"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="附加信息2" width="120">
        <template scope="scope">
          <el-input
            size="small"
            v-model="scope.row.addTwo"
            placeholder="请输入附加信息2"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="附加信息2说明" width="180">
        <template scope="scope">
          <el-input
            size="small"
            v-model="scope.row.addTwoDesc"
            placeholder="请输入附加信息2说明"
            @change="handleEdit(scope.$index, scope.row)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template scope="scope">
          <el-switch
            v-model="scope.row.statuss"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="排序" width="180">
        <template scope="scope">
          <el-input
            size="small"
            v-model="scope.row.sort"
            placeholder="请输入排序"
            @change="handleEdit(scope.$index, scope.row)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
        header-align="left"
        align="right"
      >
        <template scope="scope">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="del(scope.$index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-form style="text-align: right;margin-top:20px">
      <el-form-item>
        <el-button type="primary" @click="save()">保存</el-button>
        <el-button @click="cancel()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
    

<script>
import dic from "@/api/system/dic.js";
import TreeSelect from "@/components/SelectTree";
export default {
  components: {
    TreeSelect,
  },
  data() {
    return {
      groupCode: "",
      groupType: "",
      isShowOrgTree: null,
      defalut: {
        groupCode: this.$route.query.groupCode,
        enumCode: "", //字典项代码
        enumName: "", //字典项名称
        dicOrgList: [], //机构树
        addOne: "", //附加信息1
        addOneDesc: "", //附加信息1说明
        addTwo: "", //附加信息2
        addTwoDesc: "", //附加信息2说明
        status: 0, //状态
        statuss:true,//状态
        sort: "", //排序
        id: "", //(必须有，但不需要传)
        dicOrgs: "", //(必须有，但不需要传)
        remark: "", //(必须有，但不需要传)
      },
      tableData: [],
      treeSelectData: [],
      defaultPropsSelectTree: {
        children: "childOrgs",
        label: "orgName",
        id: "orgId",
      },
      collapsetags: true,
      defaultCheckedKeys: [], //默认选中的下拉树数据
      deptIdedId: "orgId",
      indexs: null,
    };
  },
  mounted() {
    this.groupCode = this.$route.query.groupCode;
    this.groupType = this.$route.query.groupType;
    if (this.groupType == "1") {
      this.isShowOrgTree = false;
    } else if (this.groupType == "2") {
      this.isShowOrgTree = true;
    }

    this.getOrgTree();
  },
  methods: {
    getDicDetail() {
      dic.getDicDetail({ groupCode: this.groupCode }).then((response) => {
        this.tableData = response.data;
      });
    },
    getOrgTree() {
      dic.getOrgTree().then((response) => {
        this.treeSelectData = response.data;
        this.getDicDetail(this.groupCode);
      });
    },
    selectChange(data, index) {
      //下拉树数据改变
      this.tableData[index].dicOrgListTemp = [];
      this.tableData[index].dicOrgListTemp = data;
    },
    addTable() {
      this.tableData.push(this.defalut);
    },
    del(index) {
      this.tableData.splice(index, 1);
      console.log(this.tableData);
    },
    save() {
      this.$confirm("是否确认提交?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        dic.saveDic(this.tableData).then((response) => {
          this.$message({
            type: "success",
            message: "保存成功!",
          });
        });
      });
    },
    cancel() {
       this.$router.push({path:'/system/dic'})
    },
  },
  cumputed: {},
};
</script>
<style lang="scss" scoped>
</style>



<template>
  <div class="app-container">
    <!-- <small>字典管理</small> -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="">
        <el-input
          v-model="tableQuery.vagueName"
          style="height: 30px"
          placeholder="请输入关键字"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="getTableList"
        >搜索</el-button>
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
      <el-table-column prop="id" width="200" label="文件ID" sortable />
      <el-table-column
        prop="name"
        show-overflow-tooltip
        width="200"
        label="文件名称"
        sortable
      />
      <el-table-column prop="suffix" width="110" label="文件后缀" sortable />
      <el-table-column prop="size" width="130" label="文件大小(B)" sortable />
      <el-table-column prop="clientName" width="120" label="所属应用" sortable />
      <el-table-column prop="fileShow" width="120" label="文件展示" sortable>
        <template slot-scope="scope">
          <a :href="$options.filters.downLoad(scope.row)" target="_blank">
            <img
              v-if="$options.filters.getImgType(scope.row)"
              :src="$options.filters.getImgUrl(scope.row)"
              alt=""
              style="
                overflow: hidden;
                margin: 0px;
                width: 42.5px;
                height: 42.5px;
              "
            >
          </a>
          <div
            v-if="!$options.filters.getImgType(scope.row)"
            class="imgOtherType"
          >
            <a :href="$options.filters.downLoad(scope.row)" target="_blank">{{
              scope.row.suffix
            }}</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="time" width="160" label="上传时间" sortable />

      <el-table-column label="操作" header-align="left" align="right">
        <template slot-scope="scope">
          <!-- v-permission="['system:dic:update']" -->
          <el-button
            icon="el-icon-search"
            size="mini"
            type="primary"
            @click="modalShow(scope.row)"
          >查看</el-button>
          <el-button
            v-permission="['system:dic:del']"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="del(scope.row.id)"
          >删除</el-button>
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
    <el-dialog title="查看文件" :visible.sync="dialogVisible" width="500px">
      <div style="display: flex;margin-bottom:20px;">
        <div style="margin-right: 20px; width: 150px; height: 110px">
          <img
            :src="$options.filters.getImgUrl(id)"
            alt=""
            style="width: 150px; height: 110px"
          >
        </div>

        <div>
          <div
            class="margin-bottom"
            style="font-size: 18px"
            :title="this.detail.name"
          >
            {{ detailName }}
          </div>
          <div class="margin-bottom">
            <span>所属应用：</span>
            <span>{{ detail.clientName }}</span>
          </div>

          <div class="margin-bottom">
            <span>所属模块：</span>
            <span>{{ detail.module }}</span>
          </div>

          <div class="margin-bottom">
            <span>上传时间：</span>
            <span>{{ detail.time }}</span>
          </div>
        </div>
      </div>
      <div class="margin-bottom">
        <span>文件编号：</span>
        <span>{{ detail.id }}</span>
      </div>
      <div class="margin-bottom">
        <span>业务编号：</span>
        <span>{{ detail.bussId }}</span>
      </div>
      <div style="display: flex">
        <div class="margin-bottom" style="width: 50%">
          <span>文件后缀：</span>
          <span>{{ detail.suffix }}</span>
        </div>
        <div class="margin-bottom" style="width: 50%">
          <span>文件大小：</span>
          <span>{{ detail.size }}</span>
        </div>
      </div>
      <div class="margin-bottom">
        <span>存储位置：</span>
        <span>{{ detail.path }}</span>
      </div>
      <div class="margin-bottom">
        <span>文件描述：</span>
        <span>{{ detail.remark }}</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import file from '@/api/system/file.js'
export default {
  filters: {
    // 获取表格图片
    getImgUrl(row) {
      if (row.suffix === 'jpg' || row.suffix === 'png' || row.suffix === 'jpeg') {
        if (row.id && row.id !== -1) {
          return (
            process.env.VUE_APP_BASE_API + 'files/files/showImage?id=' + row.id
          )
        } else {
          return require('@/icons/png//noImg.png')
        }
      } else {
        return require('@/icons/png/noImg.png')
      }
    },
    downLoad(row) {
      return process.env.VUE_APP_BASE_API + '/files/files/downLoad?id=' + row.id
    },
    getImgType(row) {
      if (row.suffix === 'jpg' || row.suffix === 'png' || row.suffix === 'jpeg') {
        return true
      } else {
        return false
      }
    }
  },
  data() {
    return {
      id: '',
      hidePage: true,
      tableData: [],
      total: null,
      dialogVisible: false,
      tableQuery: {
        limit: 10,
        page: 1,
        sort: 'name',
        sortOrder: 'ascending',
        vagueName: ''
      },
      detail: {
        name: ''
      }
    }
  },
  computed: {
    detailName: function() {
      if (this.detail.name.length > 16) {
        return this.detail.name.substring(0, 15) + '...'
      } else {
        return this.detail.name
      }
    }
  },
  mounted() {
    this.getTableList()
    // this.getImage()
  },
  methods: {
    getTableList() {
      var params = {
        limit: this.tableQuery.limit,
        page: this.tableQuery.page,
        sort: this.tableQuery.sort,
        sortOrder: this.tableQuery.sortOrder,
        vagueName: this.tableQuery.vagueName
      }
      file.getTableList(params).then((response) => {
        this.total = response.data.count
        this.tableData = response.data.data
      })
    },
    sortChange(column, prop, order) {
      // 表格排序
      if (column.order == null) {
        return
      } else {
        this.tableQuery.sort = column.prop
        this.tableQuery.sortOrder = column.order
        this.getTableList()
      }
    },
    modalShow(data) {
      this.dialogVisible = true
      this.id = data
      this.getSingleResult(data)
    },
    getSingleResult(data) {
      file.getSingleResult({ id: data.id }).then((response) => {
        this.detail = response.data
      })
    },
    del(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        file.del({ id: id }).then((response) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getTableList()
        })
      })
    },

    currentChange(page) {
      // 分页
      this.tableQuery.page = page
      this.getTableList()
    }
  }
}
</script>
 <style lang="scss" scoped>
.auth-table {
  .el-button--mini,
  .el-button--mini.is-round {
    padding: 5px 10px;
  }
}
.margin-bottom {
  margin-bottom: 14px;
}
.imgOtherType {
  width: 42.5px;
  height: 42.5px;
  line-height: 42.5px;
  background-color: #409eff;
  border-radius: 5px;
  a {
    display: block;
    text-align: center;
    color: #fff;
  }
}
</style>

<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="菜单" name="first">
        <div>
          <el-tree
            :data="data"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
            :props="defaultProps"
          />

        </div>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">服务</el-tab-pane>
      <el-tab-pane label="角色管理" name="third">角色</el-tab-pane>
    </el-tabs>
    <el-button
      class="filter-item"
      size="small"
      style="margin-left: 10px;"
      type="primary"
      icon="el-icon-edit"
      @click="cancelClick"
    >
      取消
    </el-button>
  </div>

</template>
<script>
export default {
  data() {
    return {
      activeName: 'first',
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    cancelClick() {
      // 首先获取当前路由
      const view = this.$router.currentRoute

      // 跳转页面
      this.$router.push({ path: '/auth/client' })

      // 从标签栏中关闭当前标签
      this.$store.dispatch('tagsView/delView', view)
    }
  }
}
</script>

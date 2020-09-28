<template>
  <div>新增
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
    return {}
  },
  methods: {
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

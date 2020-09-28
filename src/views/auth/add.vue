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
    isActive(route) {
      return route.path === this.$route.path
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    cancelClick() {
      const view = this.$router.currentRoute
      this.$router.push({ path: '/auth/client' })
      this.$store.dispatch('tagsView/delView', view)
    }
  }
}
</script>

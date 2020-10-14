<template>
  <div class="">
    首页，无子菜单
    <div class="">获取当前登录用户名: {{ name }}</div>
    <div>按钮权限</div>
    <div v-permission="['system:user:add','system:user:update','system:user:editor']">system:user:update</div>
    <div v-permission="['system:user:update']">system:user:update</div>
    <div v-permission="['editor']">system:user:info</div>
    <div v-permission="['editor']">dsaf4</div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'current_permission'
    ])
  },
  created() {
  }
}
</script>

<style lang="scss" scoped>

</style>

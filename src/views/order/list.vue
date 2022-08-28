<template>
  <div class="app-container">
    <el-tabs type="card">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date" /> 待调配</span>
        <ListCard :order-type="1" />
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date" /> 待提货</span>
        <ListCard :order-type="3" />
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date" /> 运输中</span>
        <ListCard :order-type="4" />
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date" /> 已送达</span>
        <ListCard :order-type="8" />
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date" /> 已完结</span>
        <ListCard :order-type="10" />
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date" /> 已锁定</span>
        <ListCard :order-type="0" />
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date" /> 已作废</span>
        <ListCard :order-type="0" />
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date" /> 全部</span>
        <ListCard :order-type="0" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ListCard from './listCard.vue'

import { mapGetters } from 'vuex'
export default {
  components: { ListCard },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['companyId', 'deptId', 'userId', 'roleType'])
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>
 <style lang="scss" scoped>
</style>

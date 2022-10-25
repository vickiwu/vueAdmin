<template>
  <div class="app-container">
    <el-tabs
      ref="tabOrder"
      v-model="orderType"
      type="card"
      @tab-click="tabClick"
    >
      <el-tab-pane key="card1" name="card1">
        <span slot="label"><i class="el-icon-date" /> 待调配</span>
        <listCardCustom ref="card1" :order-type="1" />
      </el-tab-pane>
      <el-tab-pane key="card3" name="card3">
        <span slot="label"><i class="el-icon-date" /> 待提货</span>
        <listCardCustom ref="card3" :order-type="3" />
      </el-tab-pane>
      <el-tab-pane key="card4" name="card4">
        <span slot="label"><i class="el-icon-date" /> 运输中</span>
        <listCardCustom ref="card4" :order-type="4" />
      </el-tab-pane>
      <el-tab-pane key="card8" name="card8">
        <span slot="label"><i class="el-icon-date" /> 已送达</span>
        <listCardCustom ref="card8" :order-type="8" />
      </el-tab-pane>
      <el-tab-pane key="card10" name="card10">
        <span slot="label"><i class="el-icon-date" /> 已完结</span>
        <listCardCustom ref="card10" :order-type="10" />
      </el-tab-pane>
      <el-tab-pane key="card11" name="card11">
        <span slot="label"><i class="el-icon-date" /> 已锁定</span>
        <listCardCustom ref="card11" :order-type="-1" />
      </el-tab-pane>
      <el-tab-pane key="card12" name="card12">
        <span slot="label"><i class="el-icon-date" /> 已作废</span>
        <listCardCustom ref="card12" :order-type="-1" />
      </el-tab-pane>
      <el-tab-pane key="card0" name="card0">
        <span slot="label"><i class="el-icon-date" /> 全部</span>
        <listCardCustom ref="card0" :order-type="0" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import listCardCustom from './listCardCustom.vue'

import { mapGetters } from 'vuex'
export default {
  components: { listCardCustom },
  data() {
    return {
      orderType: 'card1'
    }
  },

  computed: {
    ...mapGetters(['companyId', 'deptId', 'userId', 'roleType'])
  },
  watch: {
    $route: {
      handler: 'handlerRouteChange',
      immediate: true,
      deep: true
    }
  },
  created() {
    if (this.$route.query.type) {
      this.orderType = 'card' + this.$route.query.type
    } else {
      this.orderType = 'card1'
    }
    this.$forceUpdate()
  },
  mounted() {
    this.orderType !== 'card-1' && this.$refs[`${this.orderType}`].loadTable()
  },
  methods: {
    handlerRouteChange() {
      // this.orderType = this.$route.query.type + ''
    },
    tabClick() {
      this.$refs[`${this.orderType}`].loadTable()
    },
    loadingData(type) {
      alert(type)
    }
  }
}
</script>
 <style lang="scss" scoped>
</style>

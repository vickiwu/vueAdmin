<template>
  <div class="dashboard-container">
    <!-- <div v-permission="['system:user:add','system:user:update','system:user:editor']">system:user:update</div> -->
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row :gutter="32" class="chartGroup">
      <el-col :xs="24" :sm="24" :lg="8">
        <el-card class="box-card">
          <div slot="header" class="chart-card">
            <span class="chart-title">
              <svg-icon
                icon-class="zhuzhuangtu"
                class-name="chart-title-icon"
              />
              不同用户类型人数统计
            </span>
          </div>
          <bar-chart :height="height" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <el-card class="box-card">
          <div slot="header" class="chart-card">
            <span class="chart-title">
              <svg-icon icon-class="-meiguitu" class-name="chart-title-icon" />
              授权次数统计
            </span>
            <el-button-group
              style="float: right; padding: 3px 0"
              class="chart-title-button"
            >
              <el-button
                size="small"
                :class="authChart === '本周' ? 'isActive' : ''"
                @click="changeAuthChart('本周')"
                >本周</el-button
              >
              <el-button
                size="small"
                :class="authChart === '本月' ? 'isActive' : ''"
                @click="changeAuthChart('本月')"
                >本月</el-button
              >
              <el-button
                size="small"
                :class="authChart === '本年' ? 'isActive' : ''"
                @click="changeAuthChart('本年')"
                >本年</el-button
              >
            </el-button-group>
          </div>
          <pie-chart :height="height" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <el-card id="www" class="box-card">
          <div slot="header" class="chart-card">
            <span class="chart-title">
              <svg-icon
                icon-class="paimingkaoqian-01"
                class-name="chart-title-icon"
              />用户登录次数排名
            </span>
            <el-button-group
              style="float: right; padding: 3px 0"
              class="chart-title-button"
            >
              <el-button
                size="small"
                :class="userChart === '本周' ? 'isActive' : ''"
                @click="changeUserChart('本周')"
                >本周</el-button
              >
              <el-button
                size="small"
                :class="userChart === '本月' ? 'isActive' : ''"
                @click="changeUserChart('本月')"
                >本月</el-button
              >
              <el-button
                size="small"
                :class="userChart === '本年' ? 'isActive' : ''"
                @click="changeUserChart('本年')"
                >本年</el-button
              >
            </el-button-group>
          </div>
          <raddar-chart :height="height" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelGroup from './components/PanelGroup'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
export default {
  name: 'Dashboard',
  components: {
    PanelGroup,
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      height: '0',
      userChart: '本周',
      authChart: '本周'
    }
  },

  computed: {
    ...mapGetters(['name'])
  },
  watch: {
    $route: {
      handler: val => {},
      immediate: true,
      deep: true
    }
  },
  created() {
    window.onresize = params => {
      this.getHeight()
    }
  },
  mounted() {
    this.getHeight()
  },
  methods: {
    getHeight() {
      const $chart = document.getElementById('www')
      const height = window.getComputedStyle($chart).getPropertyValue('height')
      this.height = parseInt(height) - 120 + 'px'
    },
    handleSetLineChartData(type) {
      alert(type)
    },
    changeUserChart(userChart) {
      this.userChart = userChart
    },
    changeAuthChart(authChart) {
      this.authChart = authChart
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  height: 100%;
  padding-top: 18px;
  position: relative;
  .chartGroup {
    height: calc(100% - 170px);
    margin-left: 0px !important;
    margin-right: 0px !important;
    .el-col {
      height: 95%;
      .box-card {
        height: 100%;
      }
    }
    .chart-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .chart-title {
        font-size: 18px;
        color: #707070;
        .chart-title-icon {
          font-size: 25px;

          vertical-align: sub;
          margin-right: 8px;
        }
      }
      .chart-title-button {
        .isActive {
          color: #409eff;
          border-color: #c6e2ff;
          background-color: #ecf5ff;
        }
      }
    }
  }

  .chart-wrapper {
    background-color: rgb(240, 242, 245);
    border-radius: 5px;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

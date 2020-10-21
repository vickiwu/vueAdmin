<template>
  <el-row
    :gutter="32"
    class="panel-group"
  >
    <el-col
      :xs="12"
      :sm="12"
      :lg="6"
      class="card-panel-col"
    >
      <div class="box-card">
        <div
          class="card-panel  no1"
          @click="handleSetLineChartData('newVisitis')"
        >
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon
              icon-class="denglvlingpai"
              class-name="card-panel-icon"
            />
          </div>
          <div class="card-panel-description">
            <count-to
              :start-val="0"
              :end-val="102400"
              :duration="2600"
              class="card-panel-num"
            />
            <div class="card-panel-text">
              有效令牌数量
            </div>

          </div>
        </div>
        <div class="card-detail  no1">
          <span>查看更多</span>
          <svg-icon
            icon-class="youjiantou"
            style="font-size:18px;"
          />
        </div>
      </div>

    </el-col>
    <el-col
      :xs="12"
      :sm="12"
      :lg="6"
      class="card-panel-col"
    >
      <div class="box-card">
        <div
          class="card-panel no2"
          @click="handleSetLineChartData('messages')"
        >
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon
              icon-class="fuwuqi"
              class-name="card-panel-icon"
            />
          </div>
          <div class="card-panel-description">

            <count-to
              :start-val="0"
              :end-val="81212"
              :duration="3000"
              class="card-panel-num"
            />
            <div class="card-panel-text">
              启动服务数量
            </div>
          </div>
        </div>
        <div class="card-detail no2">
          <span>查看更多</span>
          <svg-icon
            icon-class="youjiantou"
            style="font-size:18px;"
          />
        </div>
      </div>

    </el-col>
    <el-col
      :xs="12"
      :sm="12"
      :lg="6"
      class="card-panel-col"
    >
      <div class="card-box">
        <div
          class="card-panel no3"
          @click="handleSetLineChartData('purchases')"
        >
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon
              icon-class="redis"
              class-name="card-panel-icon"
            />
          </div>
          <div class="card-panel-description">

            <count-to
              :start-val="0"
              :end-val="9280"
              :duration="3200"
              class="card-panel-num"
            />
            <div class="card-panel-text">
              Redis Key数量
            </div>
          </div>
        </div>
        <div class="card-detail no3">
          <span>查看更多</span>
          <svg-icon
            icon-class="youjiantou"
            style="font-size:18px;"
          />
        </div>
      </div>

    </el-col>
    <el-col
      :xs="12"
      :sm="12"
      :lg="6"
      class="card-panel-col"
    >
      <div class="card-box">
        <div
          class="card-panel no4"
          @click="handleSetLineChartData('shoppings')"
        >
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon
              icon-class="shujukulianjie"
              class-name="card-panel-icon"
            />
          </div>
          <div class="card-panel-description">

            <count-to
              :start-val="0"
              :end-val="13600"
              :duration="3600"
              class="card-panel-num"
            />
            <div class="card-panel-text">
              数据库连接数量
            </div>
          </div>
        </div>
        <div class="card-detail no4">
          <span>查看更多</span>
          <svg-icon
            icon-class="youjiantou"
            style="font-size:18px;"
          />

        </div>
      </div>

    </el-col>
  </el-row>

</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-left: 0px !important;
  margin-right: 0px !important;

  .card-detail {
    display: flex;
    cursor: pointer;
    height: 30px;
    line-height: 30px;
    color: #fff;
    background: #2a92d9;
    box-shadow: 0px -7px 4px 0px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    border-radius: 0 0 5px 5px;
    font-size: 15px;
    padding:0 15px;
    align-items: center;
    justify-content: space-between;

    &.no1 {
      background:#2a92d9;
    }
    &.no2 {
      background:#e6434e;
    }
    &.no3 {
      background:#2dbcc8;
    }
    &.no4 {
      background:#8640a3;
    }
  }

  .card-panel-col {
    margin-bottom: 32px;
    .box-card{
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    }
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #ffffff;
    background: #3598dc;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    border-radius: 5px 5px 0 0;

    &.no1 {
      background: #3598dc;
      .card-panel-icon{
        font-size: 65px;
      }
    }
    &.no2 {
      background: #e7505a;
      .card-panel-icon{
        font-size: 58px;
      }
    }
    &.no3 {
      background: #32c5d2;
      .card-panel-icon{
        font-size: 65px;
      }
    }
    &.no4 {
      background:#8e44ad;
      .card-panel-icon{
        font-size: 62px;
      }
    }
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        // background: #b4dbf0;
      }

      .icon-message {
        // background: #ecb7b9;
      }

      .icon-money {
        // background: #abf0ee;
      }

      .icon-shopping {
        // background:#de79cd;
      }
    }

    .icon-people {
      color: #82d2fd;
    }

    .icon-message {
      color: #ff9094;
    }

    .icon-money {
      color: #7dece9;
    }

    .icon-shopping {
      color: #f2e6f0;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 13px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 60px;
    }

    .card-panel-description {
      float: right;

      margin: 26px;
      margin-left: 0px;
      text-align: end;

      .card-panel-text {
        line-height: 16px;
        color: #fff;
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        display: inline-block;
        font-size: 22px;
        font-weight: bold;
        margin-bottom: 3px;
        height: 40px;
        line-height: 40px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>

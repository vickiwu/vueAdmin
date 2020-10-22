<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px',
      required: true
    }
  },
  data () {
    return {
      chart: null
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart () {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '5',
          data: ['简单模式', '密码模式', '客户端模式', '授权码模式',]
        },
        series: [
          {
            name: '授权次数统计',
            type: 'pie',
            roseType: 'radius',
            radius: ['10%', '75%'],
            center: ['50%', '42%'],
            label: {
              formatter: '{c}'
            },
            data: [
              { value: 320, name: '简单模式' },
              { value: 240, name: '密码模式' },
              { value: 149, name: '客户端模式' },
              { value: 100, name: '授权码模式' },
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }

  }
}
</script>

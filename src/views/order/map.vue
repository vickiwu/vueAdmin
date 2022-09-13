<template>
  <div class="app-container">
    <el-page-header content="轨迹" class="page-header" @back="goBack" />
    <div v-loading="!hasDetail" class="main-cont">
      <el-row type="flex" :gutter="20" class="map-cont">
        <el-col :span="6">
          <el-card class="card-bg card-bg-left">
            <div slot="header" class="clearfix">
              <span>订单信息</span>
            </div>
            <div>
              <div class="detail-list">
                订单编码：
                {{ orderDetail.orderNo }}
              </div>

              <div class="detail-list">
                订单状态： {{ orderDetail.statusStr || '-' }}
              </div>
              <div class="detail-list">
                创建时间：
                {{ orderDetail.createTime | parseTime('{y}-{m}-{d}  {h}:{i}') }}
              </div>
              <div class="detail-list">
                产品名称： {{ orderDetail.msdsName || '-' }}
              </div>
              <div v-if="orderDetail.price" class="detail-list">
                产品价格： {{ orderDetail.price }}
              </div>

              <div v-if="orderDetail.carNeed" class="detail-list">
                车型要求： {{ orderDetail.carNeed }}
              </div>
              <div class="detail-list">
                车牌号： {{ orderDetail.carNo || '-' }}
              </div>
              <div class="detail-list">
                提货排班时间：
                {{
                  orderDetail.planGetMsdsTime
                    | parseTime('{y}-{m}-{d}  {h}:{i}')
                }}
              </div>
              <div class="detail-list">
                备注： {{ orderDetail.remark || '-' }}
              </div>
              <div class="detail-list">
                东华备注： {{ orderDetail.dhRemark || '-' }}
              </div>

              <div class="detail-list">
                托运方：{{ orderDetail.customerName || '-' }}
              </div>
              <div class="detail-list">
                托运方联系人： {{ orderDetail.customerPhone || '-' }}
              </div>
              <div class="detail-list">
                托运方电话： {{ orderDetail.customerName || '-' }}
              </div>
              <div v-if="orderDetail.transportName" class="detail-list">
                收货方：{{ orderDetail.transportName }}
              </div>
              <div v-if="orderDetail.transportContactName" class="detail-list">
                收货方联系人： {{ orderDetail.transportContactName }}
              </div>
              <div v-if="orderDetail.transportPhone" class="detail-list">
                收货方电话： {{ orderDetail.transportPhone }}
              </div>
              <div class="detail-list">
                装货地： {{ orderDetail.loadAddress || '-' }}
              </div>
              <div class="detail-list">
                卸货地： {{ orderDetail.unLoadAddress || '-' }}
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col v-loading="mapLoading" :span="18">
          <div class="detail-top">
            <div
              v-if="![8, 10].includes(orderDetail.status)"
              class="detail-top-dis"
            >
              距离目标地： {{ allDistence }}公里（{{ allTime }}）
            </div>
            <!-- <el-date-picker
              v-if="[8, 10].includes(orderDetail.status)"
              v-model="value1"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="timestamp"
              @change="timeChange"
            /> -->
          </div>

          <el-card class="card-bg card-bg-right map_container">
            <div id="log-map" />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { getMapOrderDetail, removeMapOrderDetail } from '@/utils/auth'
import AMapLoader from '@amap/amap-jsapi-loader'
const wsUrl = 'ws://120.48.162.194/ws'
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  name: 'LogMap',
  filters: {
    parseTime
  },
  data() {
    return {
      value1: [1661809246000, 1661830846000],
      startTime: undefined,
      endTime: undefined,
      hasDetail: false,
      AMap: null,
      mapInstance: null,
      mapLoading: true,
      allDistence: '--',
      orderDetail: {},
      carMap: new Map(),
      carMarkerMap: new Map(),
      allCarList: [],
      paramsType: undefined,
      linePolyline: null,
      lastPoint: null,
      firstPoint: null
    }
  },
  computed: {
    ...mapGetters({
      socket: 'carLog/socket',
      currentCarData: 'carLog/currentCar',
      carEventData: 'carLog/carEventData',
      lineData: 'carLog/lineData'
    }),
    allTime() {
      if (!this.orderDetail.deviceNo) {
        return '未绑定设备'
      }
      if (this.currentCarData && this.currentCarData.f === 2) {
        return '当前设备已离线'
      }

      if (this.allDistence === '--') {
        return '--'
      } else {
        // 速度按60算
        const time = (this.allDistence / 60).toFixed(2)
        if (parseInt(time) === 0) {
          return (
            Math.round((Number(time.substring(time.length - 2)) / 100) * 60) +
            '分钟'
          )
        } else {
          return (
            parseInt(time) +
            '小时' +
            Math.round((Number(time.substring(time.length - 2)) / 100) * 60) +
            '分钟'
          )
        }
      }
    }
  },
  watch: {
    lineData(data) {
      if ([8, 10].includes(this.orderDetail.status)) {
        data && this.drawCarLine(data)
      }
    },
    currentCarData(data) {
      // 处理数据
      if (!this.carMap.has(data.a)) {
        // 先画点
        const carMarker = this.drawCarMark(
          data.a,
          `${data.b / 1000000},${data.c / 1000000}`,
          data.f,
          true
        )
        this.carMarkerMap.set(data.a, carMarker)
      } else {
        // 有车执行动画
        const fCar = this.carMap.get(data.a)
        if (fCar.b !== data.b && fCar.c !== data.c) {
          const currentMark = this.carMarkerMap.get(data.a)[0]
          const currentText = this.carMarkerMap.get(data.a)[1]
          this.carMoving(
            currentMark,
            currentText,
            `${data.b / 1000000},${data.c / 1000000}`,
            +data.d
          )
        }
      }
      this.carMap.set(data.a, data)
    }
  },

  created() {
    const that = this
    const currentDetail = getMapOrderDetail()

    if (!currentDetail) {
      this.hasDetail = false
      this.$alert('请先前往订单列表选择订单', {
        confirmButtonText: '确定',
        callback: (action) => {
          that.goBack()
        }
      })

      // this.goBack()
    } else {
      this.hasDetail = true
      this.orderDetail = currentDetail
      switch (this.orderDetail.status) {
        case 1:
          this.orderDetail.statusStr = '待调配'
          break
        case 3:
          this.orderDetail.statusStr = '待提货'
          break
        case 4:
          this.orderDetail.statusStr = '运输中'
          this.startTime = this.orderDetail.transportTime
          this.endTime = new Date().getTime()
          break
        case 8:
          this.orderDetail.statusStr = '已送达'
          this.startTime = this.orderDetail.transportTime
          this.endTime = this.orderDetail.finishTime
            ? this.orderDetail.finishTime
            : new Date().getTime()

          break
        case 10:
          this.orderDetail.statusStr = '已完结'
          this.startTime = this.orderDetail.transportTime
          // this.endTime = this.orderDetail.finishTime
          this.endTime = this.orderDetail.finishTime
            ? this.orderDetail.finishTime
            : new Date().getTime()
          break
        default:
          this.orderDetail.statusStr = '--'
          break
      }
      this.orderDetail.price =
        Math.floor((this.orderDetail.price / 1000) * 100) / 100
    }
  },
  mounted() {
    this.paramsType = this.$route.query.type
      ? this.$route.query.type
      : undefined
    this.hasDetail && this.initMap()
  },
  destroyed() {
    this.hasDetail && this.$store.dispatch('carLog/CLOSE_SOCKED')
  },
  methods: {
    goBack() {
      this.$store.dispatch('tagsView/delView', this.$route)

      this.$router.push({
        path: '/order/list',
        query: { type: this.paramsType }
      })
      removeMapOrderDetail()
    },
    // timeChange(value) {
    //   if (value[0] && value[1]) {
    //     if (value[1] - value[0] > 24 * 60 * 60 * 1000) {
    //       this.$alert('所选时间区间不能大于24小时，请重新选择', {
    //         confirmButtonText: '确定'
    //       })
    //     } else {
    //       this.mapInstance.remove([
    //         this.linePolyline,
    //         this.lastPoint,
    //         this.firstPoint
    //       ])
    //       if (this.orderDetail.deviceNo) {
    //         const deviceObj = {
    //           a: this.orderDetail.deviceNo,
    //           b: value[0], // kais
    //           c: value[1] // 结束时间
    //         }
    //         // 清空当前线路 重新画
    //         this.$store.dispatch('carLog/SOCKET_SEND', {
    //           msg: deviceObj,
    //           type: [0, 0x0a, 0]
    //         })
    //       }
    //     }
    //   }
    // },
    initMap() {
      AMapLoader.load({
        key: '499cf0c29e7adba17f559a42b305d58c', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '1.4.15', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [
          'AMap.Geocoder',
          'AMap.Driving',
          'AMap.MoveAnimation',
          'AMap.MouseTool',
          'AMap.LabelMarker'
        ],
        AMapUI: {
          // 是否加载 AMapUI，缺省不加载
          version: '1.1', // AMapUI 缺省 1.1
          plugins: [] // 需要加载的 AMapUI ui插件
        },
        Loca: {
          // 是否加载 Loca， 缺省不加载
          version: '1.3.2' // Loca 版本，缺省 1.3.2
        }
      })
        .then((AMap) => {
          this.mapInstance = new AMap.Map('log-map')
          this.geocoder = new AMap.Geocoder()
          this.AMap = AMap

          this.mapLoading = false
        })
        .catch((e) => {
          console.log(e)
        })
        .finally(() => {
          this.$store.dispatch('carLog/SOCKET_INIT', wsUrl)
          this.$store.dispatch('carLog/SOCKET_OPEN', {
            msg: 'login',
            type: [0, 1, 0]
          })
          if (this.orderDetail.deviceNo) {
            this.sendSocketCar([this.orderDetail.deviceNo])
            if ([8, 10].includes(this.orderDetail.status)) {
              this.sendSocketCarLine(this.orderDetail.deviceNo)
            }
          }

          // let myView = toView(obj, 0, 0x0a, 0); // 发送给websocket
        })
    },
    drawMarker(data, type) {
      // type: 1-出 2-收
      const marker = new AMap.Marker()
      if (+type === 1) {
        const startIcon = new AMap.Icon({
          size: new AMap.Size(24, 24),
          image: require('./img/chu.png')
        })
        marker.setIcon(startIcon)
      } else if (+type === 2) {
        const endIcon = new AMap.Icon({
          size: new AMap.Size(24, 24),
          image: require('./img/shou.png'),
          imageSize: new AMap.Size(24, 24)
        })
        marker.setIcon(endIcon)
      }
      if (data.lnglat) {
        const lnglat = new AMap.LngLat(...data.lnglat.split(','))
        marker.setPosition(lnglat)
        this.mapInstance.add(marker)
      }
      this.mapInstance.setFitView()
    },
    drawCarLine(data) {
      // 轨迹绘画
      const lnglatList = data || []
      const PolylineList = lnglatList.map((item) => {
        return item.lnglat.split(',')
      })
      this.linePolyline = new AMap.Polyline({
        map: this.mapInstance,
        path: PolylineList,
        showDir: true,
        strokeColor: '#00BD02', // 线颜色
        strokeWeight: 6 // 线宽
      })
      this.lastPoint = lnglatList[lnglatList.length - 1].lnglat
      this.firstPoint = lnglatList[0].lnglat
      this.drawMarker({ lnglat: this.firstPoint }, 1)
      this.drawMarker({ lnglat: this.lastPoint }, 2)
      this.mapInstance.setFitView()
    },
    carMoving(mark, text, carLngLat, speed) {
      const lnglat = new AMap.LngLat(...carLngLat.split(','))
      mark.moveTo(lnglat, speed)
      text.moveTo(lnglat, speed)
    },
    sendSocketCarLine(device) {
      // 结束时间：当前时间，开始时间往前8小时
      // const currentTime = new Date().getTime()
      // const startTime = currentTime - 24 * 60 * 60 * 1000
      if (this.startTime && this.endTime) {
        const deviceObj = {
          a: device,
          b: this.startTime, // kais
          c: this.endTime // 结束时间
        }
        this.$store.dispatch('carLog/SOCKET_SEND', {
          msg: deviceObj,
          type: [0, 0x0a, 0]
        })
      }
    },
    sendSocketCar(device) {
      const deviceObj = {
        a: device
      }
      this.$store.dispatch('carLog/SOCKET_SEND', {
        msg: deviceObj,
        type: [0, 2, 0]
      })
    },
    loadCarLine(lnglat, endA) {
      const ring = [lnglat, endA]
      const line = AMap.GeometryUtil.distanceOfLine(ring) / 1000
      return Math.round(line)
    },
    drawCarMark(drivceId, carLngLat, angle) {
      const markHtml2 = `<div class="bg-car2" >${this.orderDetail.carNo}</div>`
      const img = require('./img/carPng2.png')
      // 创建一个 Icon
      var startIcon = new this.AMap.Icon({
        // 图标尺寸
        size: new AMap.Size(24, 24),
        // 图标的取图地址
        image: img,
        // 图标所用图片大小
        imageSize: new AMap.Size(24, 24)
        // 图标取图偏移量
      })
      const marker = new AMap.Marker({
        position: new AMap.LngLat(...carLngLat.split(',')),
        icon: startIcon, // 添加 Icon 图标 URL
        title: `${this.orderDetail.carNo}`,
        offset: new AMap.Pixel(-9, -9),
        angle,
        autoRotation: true
      })
      if (this.orderDetail.unLoadJd && this.orderDetail.unLoadWd) {
        this.allDistence = this.loadCarLine(carLngLat.split(','), [
          this.orderDetail.unLoadJd,
          this.orderDetail.unLoadWd
        ])
      }

      // 将 markers 添加到地图
      this.mapInstance.add(marker)
      const text = new AMap.Text({
        text: markHtml2,
        position: new AMap.LngLat(...carLngLat.split(',')),
        anchor: 'top-left'
      })
      this.mapInstance.add(text)
      // 设置label标签
      // marker.setLabel({
      //   content: markHtml, //设置文本标注内容
      //   direction: "top", //设置文本标注方位
      // });
      // this.mapInstance.setFitView();
      return [marker, text]
    }
  }
}
</script>

<style lang="scss" scoped>
.main-cont {
  margin-left: 40px;
  height: calc(100% - 10px - 24px - 20px);
}
.map-cont {
  height: 100%;

  .card-bg {
    height: 100%;
  }
  .card-bg-right {
    height: calc(100% - 40px);
  }
  .card-bg-left {
    ::v-deep.el-card__body {
      height: calc(100% - 55px);
      overflow: auto;
    }
  }
}
.page-header {
  margin: 10px auto 20px 10px;
}
.detail-list {
  display: flex;
  margin-bottom: 16px;
  color: #5a6073;
  font-size: 14px;
}
.detail-top {
  display: flex;
  height: 40px;
  line-height: 40px;
  margin-left: 10px;
}
.detail-top-dis {
  color: #5a6073;
  font-size: 16px;
  font-weight: bold;
  margin-right: 20px;
}
.map_container {
  ::v-deep {
    .el-card__body {
      padding: 0;
      width: 100%;
      height: 100%;
    }
  }

  #log-map {
    height: 100%;
    width: 100%;
  }
}
</style>

<style lang="scss">
.amap-marker-label {
  border: none;
  background: none;
}
.bg-car2 {
  height: 23px;
  width: 65px;
  text-align: center;
  font-size: 12px;
  color: #04122b;
  line-height: 23px;
  // background: #0d1b36;
  // background: #4385ff;
  background: url('./img/carBg2.png') no-repeat;
  background-size: 100% 100%;
  border-radius: 2px;
}
.amap-overlay-text-container {
  border: none;
  background: none;
}
</style>

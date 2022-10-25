<template>
  <div v-loading="mapLoading" class="dashboard-container">
    <div id="index-map" />
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
const wsUrl = 'ws://120.48.162.194/ws'
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'
import { getOrderList, getOrderListCustom } from '@/api/order'
export default {
  name: 'IndexMap',
  filters: {
    parseTime
  },
  data() {
    return {
      startTime: undefined,
      endTime: undefined,
      AMap: null,
      mapInstance: null,
      mapLoading: true,
      allDistence: '--',
      orderDetail: {},
      deviceList: [],
      carMap: new Map(),
      carMarkerMap: new Map(),
      allOrderList: [],
      linePolyline: null,
      lastPoint: null,
      firstPoint: null
    }
  },
  computed: {
    ...mapGetters({
      socket: 'carLog/socket',
      currentCarData: 'carLog/currentCar',
      carEventData: 'carLog/carEventData'
      // lineData: 'carLog/lineData'
    }),
    ...mapGetters(['companyId', 'deptId', 'userId', 'roleType', 'phone']),
    speed() {
      if (this.currentCarData) {
        return this.currentCarData.d + '公里/小时'
      } else {
        return 0 + '公里/小时'
      }
    }
  },
  watch: {
    // 行车日志
    // lineData(data) {
    //   if ([8, 10].includes(this.orderDetail.status)) {
    //     data && this.drawCarLine(data)
    //   }
    // },
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
            +data.d,
            +data.f
          )
        }
      }
      this.carMap.set(data.a, data)
    }
  },

  created() {},
  mounted() {
    this.mapLoading = true
    this.initMap()
  },
  destroyed() {
    this.$store.dispatch('carLog/CLOSE_SOCKED')
  },
  methods: {
    loadTable() {
      // 加载订单列表
      switch (this.roleType) {
        // 客户维度
        case 10:
        case 11:
          this.loadCustomTable()
          break
        default:
          // 部门维度
          this.loadOrderTable()
          break
      }
    },
    loadOrderTable() {
      getOrderList({
        pageSize: 9999,
        page: 1, // 1 y 10
        deptId: this.deptId,
        companyId: this.companyId,
        status: 4,
        customerName: undefined,
        beginTime: undefined,
        endTime: undefined
      })
        .then((response) => {
          const data = response.d
          this.allOrderList = data
          this.deviceList = data.map((item) => {
            return item.deviceNo
          })
          if (this.deviceList.length > 0) {
            this.sendSocketCar(this.deviceList)
            // 行车日志
            //   this.sendSocketCarLine(this.orderDetail.deviceNo)
          }
          this.mapLoading = false
        })
        .catch((error) => error)
    },
    loadCustomTable() {
      getOrderListCustom({
        pageSize: 9999,
        page: 1, // 1 y 10
        deptId: this.deptId,
        companyId: this.companyId,
        status: 4,
        phone: this.phone,
        customerName: undefined,
        beginTime: undefined,
        endTime: undefined
      })
        .then((response) => {
          const data = response.d
          this.allOrderList = data
          this.deviceList = data.map((item) => {
            return item.deviceNo
          })
          if (this.deviceList.length > 0) {
            this.sendSocketCar(this.deviceList)
            // 行车日志
            //   this.sendSocketCarLine(this.orderDetail.deviceNo)
          }
          this.mapLoading = false
        })
        .catch((error) => error)
    },
    getCarId(deviceNo) {
      const currentCar = this.allOrderList.find((item) => {
        return item.deviceNo === deviceNo
      })
      return currentCar
    },
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
          this.mapInstance = new AMap.Map('index-map')
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
          // 获取运输中的设备
          this.loadTable()
          // let myView = toView(obj, 0, 0x0a, 0); // 发送给websocket
        })
    },
    drawMarker(data, type) {
      // type: 1-出 2-收
      const marker = new AMap.Marker()
      if (+type === 1) {
        const startIcon = new AMap.Icon({
          // size: new AMap.Size(24, 24),
          // image: require('@/assets/mapImg/chu.png')
          // 图标尺寸
          size: new AMap.Size(25, 34),
          // 图标的取图地址
          image:
            '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
          // 图标所用图片大小
          imageSize: new AMap.Size(135, 40),
          // 图标取图偏移量
          imageOffset: new AMap.Pixel(-9, -3)
        })
        marker.setIcon(startIcon)
      } else if (+type === 2) {
        const endIcon = new AMap.Icon({
          // size: new AMap.Size(24, 24),
          // image: require('@/assets/mapImg/shou.png'),
          // imageSize: new AMap.Size(24, 24)
          size: new AMap.Size(25, 34),
          image:
            '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
          imageSize: new AMap.Size(135, 40),
          imageOffset: new AMap.Pixel(-95, -3)
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
    carMoving(mark, text, carLngLat, speed, angle) {
      const lnglat = new AMap.LngLat(...carLngLat.split(','))
      mark.moveTo(lnglat, speed)
      text.moveTo(lnglat, speed)
      mark.setAngle(angle)
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
      this.orderDetail = this.getCarId(drivceId)
      const carNo = this.orderDetail ? this.orderDetail.carNo : '未知车'
      const markHtml2 = `<div class="bg-car2" >${carNo}</div>`
      const img = require('@/assets/mapImg/car.png')
      // 创建一个 Icon
      var startIcon = new this.AMap.Icon({
        // 图标尺寸
        size: new AMap.Size(26, 52),
        // 图标的取图地址
        image: img,
        // 图标所用图片大小
        imageSize: new AMap.Size(26, 52)
        // 图标取图偏移量
      })
      const marker = new AMap.Marker({
        position: new AMap.LngLat(...carLngLat.split(',')),
        icon: startIcon, // 添加 Icon 图标 URL
        title: `${carNo}`,
        offset: new AMap.Pixel(-13, -26),
        angle,
        autoRotation: true
      })
      // 计算公里数
      // if (this.orderDetail.unLoadJd && this.orderDetail.unLoadWd) {
      //   this.allDistence = this.loadCarLine(carLngLat.split(','), [
      //     this.orderDetail.unLoadJd,
      //     this.orderDetail.unLoadWd
      //   ])
      // }

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
      this.mapInstance.setFitView()
      return [marker, text]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  height: 100%;
  // padding-top: 18px;
  position: relative;
  min-height: 100%;
  width: 100%;

  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: #39aef7;
}
#index-map {
  height: 100%;
  width: 100%;
}
</style>
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
  background: url('../../assets/mapImg/carBg2.png') no-repeat;
  background-size: 100% 100%;
  border-radius: 2px;
}
.amap-overlay-text-container {
  border: none;
  background: none;
}
</style>

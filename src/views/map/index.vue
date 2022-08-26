<template>
  <div v-loading="mapLoading" class="map_container">
    <div id="log-map" />
  </div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader'
export default {
  name: 'LogMap',
  data() {
    return {
      mapInstance: null,
      mapLoading: true
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      AMapLoader.load({
        key: '499cf0c29e7adba17f559a42b305d58c', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '1.4.15', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.Geocoder'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
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
          this.marker = new AMap.Marker()
          this.mapInstance.on('click', (e) => {
            this.handleMapClick(e.lnglat)
          })
          if (this.dialogTitle === '修改区域') {
            // 地图加点
            this.selected = [
              this.ruleForm.addrOne,
              this.ruleForm.addrTwo,
              this.ruleForm.addrThree
            ]
            const lnglat = [this.ruleForm.jd, this.ruleForm.wd]
            this.marker.setPosition(lnglat)
            this.mapInstance.add(this.marker)
            this.mapInstance.setFitView(this.marker, 12)
          }
          this.mapLoading = false
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.map_container {
  width: 100%;
  height: 100%;
  #log-map {
    height: 100%;
    width: 100%;
  }
}
</style>

import store from '@/store'
import { toView, parseBetyData } from '@/utils'

const wsConnection = {
  $ws: null,
  lockReturn: false,
  timeout: 60 * 1000 * 5, // 5分钟重连
  timeoutObj: null,
  timeoutNum: null,
  serverTimeoutObj: null,
  // 初始化webSocket长连接
  initWebSocket: function(wsurl) {
    this.$ws = new WebSocket(wsurl)// 写入地址 这里的地址可以在initWebSocket方法加入参数
    this.$ws.binaryType = 'arraybuffer'
    this.$ws.onopen = this.wsOpen
    this.$ws.onclose = this.wsClose
    this.$ws.onmessage = this.wsMsg
    this.$ws.onerror = this.wsError
  },
  wsOpen: function(e) {
    // 开始websocket心跳
    wsConnection.startWsHeartbeat()
    console.log('ws success')
  },
  wsClose: function(e) {
    console.log(e, 'ws close')
  },
  wsMsg: function(msg) {
    // 转成二进制
    const receive = parseBetyData(msg.data)

    // 每次接收到服务端消息后 重置websocket心跳
    wsConnection.resetHeartbeat()
    // 服务端发送来的消息存到vuex
    store.dispatch('socket/WEBSOCKET_REIVE', receive)
  },
  wsError: function(err) {
    console.log(err, 'ws error')
    wsConnection.reconnect()
  },
  // 重启websocket
  reconnect: function() {
    const _this = this
    if (_this.lockReturn) {
      return
    }
    _this.lockReturn = true
    _this.timeoutNum && clearTimeout(_this.timeoutNum)
    _this.timeoutNum = setTimeout(function() {
      _this.initWebSocket()
      _this.lockReturn = false
    }, 3000)
  },
  startWsHeartbeat: function() {
    const _this = this
    _this.timeoutObj && clearTimeout(_this.timeoutObj)
    _this.serverTimeoutObj && clearTimeout(_this.serverTimeoutObj)
    _this.timeoutObj = setInterval(function() {
      // 判断websocket当前状态
      if (_this.$ws.readyState !== 1) {
        _this.reconnect() // 重新连接
      }
    }, _this.timeout)
  },
  // 重置websocket心跳
  resetHeartbeat: function() {
    const _this = this
    clearTimeout(_this.timeoutObj)
    clearTimeout(_this.serverTimeoutObj)
    _this.startWsHeartbeat()
  },
  emit: function(data) {
    const _msg = toView(data.data, ...data.type)
    this.$ws.send(_msg)
  }
}
// 抛出websocket对象
export default wsConnection

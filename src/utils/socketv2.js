import vue from '@/main'
import storage from '@/utils/storage'
import { Notification } from 'element-ui'

var websock = null
var global_callback = null
var serverUri = 'ws://192.168.1.140:8080/ws'	// webSocket 连接地址

function initWebSocket() { // 初始化 weosocket
  // 用户是否登录
  const user = storage.getUser()
  if (!user) {
    return
  }
  websock = new WebSocket(serverUri)
  websock.onmessage = function(e) {
    websocketonmessage(e)
  }
  websock.onclose = function(e) {
    websocketclose(e)
  }
  websock.onopen = function() {
    websocketOpen()
  }

  // 连接发生错误的回调方法
  websock.onerror = function() {
    console.log('WebSocket连接发生错误')
  }
}

// 主动关闭连接
function closeWebSocket() {
  websock.close()
}

// 实际调用的方法
function sendSock(agentData) {
  if (websock.readyState === websock.OPEN) {
    // 若是ws开启状态
    websocketsend(agentData)
  } else if (websock.readyState === websock.CONNECTING) {
    // 若是 正在开启状态，则等待1s后重新调用
    setTimeout(function() {
      sendSock(agentData)
    }, 1000)
  } else {
    // 若未开启 ，则等待 1s 后重新调用
    setTimeout(function() {
      sendSock(agentData)
    }, 1000)
  }
}

// 数据接收
function websocketonmessage(e) {
  // 如果获取到消息 表明连接正常 心跳检测重置
  heartCheck.reset().start()
  // 心跳
  if (e.data === 'PONG') {
    console.log('PONG')
    return
  }

  var data = JSON.parse(e.data)
  console.log(data)
  if (data.newEmergency) {
    Notification.warning({
      title: '有新的呼救信息',
      message: data.newEmergency.message,
      duration: 0
    })
    return
  }

  // 心跳
  if (data === 'PONG') {
    console.log('接收到心跳')
    return
  }

  if (global_callback) {
    global_callback(data)
  }
}

// 数据发送
function websocketsend(agentData) {
  websock.send(JSON.stringify(agentData))
}

// 关闭连接
function websocketclose(e) {
  console.log('connection closed (' + e.code + ')')
  websock = null
  // 自动重连
  setTimeout(() => {
    initWebSocket()
  }, 1000)
}

// 连接打开
function websocketOpen(e) {
  console.log('WebSocket连接已打开')
  var userInfo = storage.getUser()
  // 告诉服务器初始化 WebSocket 连接
  var dataContent = vue.GLOBAL.dataContent
  var msg = vue.GLOBAL.message
  msg.fromId = userInfo.id
  dataContent.message = msg
  dataContent.action = vue.GLOBAL.action.CONNECT
  sendSock(dataContent)
  // 保持心跳
  heartCheck.reset().start()
}

// 心跳检测
var heartCheck = {
  timeout: 30000, // 30s发送一次心跳
  timeoutObj: null,
  serverTimeoutObj: null,
  reset: function() {
    clearTimeout(this.timeoutObj)
    clearTimeout(this.serverTimeoutObj)
    return this
  },
  start: function() {
    var self = this
    this.timeoutObj = setTimeout(function() {
      var userInfo = storage.getUser()
      var dataContent = vue.GLOBAL.dataContent
      var msg = vue.GLOBAL.message
      msg.fromId = userInfo.id
      dataContent.message = msg
      dataContent.action = vue.GLOBAL.action.KEEPALIVE
      // 这里发送一个心跳，后端收到后，返回一个心跳消息
      sendSock(dataContent)
      console.log('PING')
      self.serverTimeoutObj = setTimeout(function() {
        // 如果超过一定时间还没重置，说明后端主动断开了
        // 这时我们主动关闭连接 等待重连
        closeWebSocket()
      }, self.timeout)
    }, this.timeout)
  }
}

function onSockMessage(callback) {
  if (callback) {
    global_callback = callback
  }
}

export { sendSock, initWebSocket, closeWebSocket, onSockMessage }

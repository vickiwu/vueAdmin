import pako from 'pako'
import utfx from 'utfx'

export function stringSource(str) {
  var i = 0
  return function() {
    return i < str.length ? str.charCodeAt(i++) : null
  }
}

export function toView(data, type1, type2, isP) {
  let str
  if (typeof data === 'object') {
    str = JSON.stringify(data)
  } else {
    str = data.toString()
  }
  const strCodes = stringSource(str)
  const length = utfx.calculateUTF16asUTF8(strCodes)[1]
  const buffer = new ArrayBuffer(length + 3) // 初始化长度为UTF8编码后字符串长度+3个Byte的二进制缓冲区
  const view = new DataView(buffer)
  let offset = 3
  view.setUint32(0, length) // 将长度放置在字符串的头部
  view.setUint8(0, type1) // 接口类型  16进制 。
  view.setUint8(1, type2) // 接口类型  16进制 。
  view.setUint8(2, isP) // 是否压缩标识
  utfx.encodeUTF16toUTF8(
    stringSource(str),
    function(b) {
      view.setUint8(offset++, b)
    }
  )
  return view
}

export var socket

export const parseBetyData = function(betyData) {
  // 0 不压缩 1 解压
  const dataBf = betyData.slice(3, betyData.byteLength) // 数据buff 从第4个字节开始
  var typeBfView = new Int8Array(betyData, 2, 1) // 第三个字节是否压缩
  var dataTypeBfView = new Int8Array(betyData, 0, 2) // 第三个字节是否压缩
  var type = dataTypeBfView[1]
  let jsonStr
  if (typeBfView[0] === 0) {
    var byteArray = new Uint8Array(dataBf)
    jsonStr = new TextDecoder().decode(byteArray)
    // console.log("%c 不压缩的 jsonStr: ", "font-size:20px;background-color: #ED9EC7;color:#fff;", jsonStr);
  } else {
    const data = pako.inflate(dataBf)
    jsonStr = new TextDecoder().decode(data)
    // console.log("%c 压缩解压后的 jsonStr: ", "font-size:20px;background-color: #93C0A4;color:#fff;", jsonStr);
  }
  // let type = 0;
  return [JSON.parse(jsonStr), type]
  // return jsonStr;
}

export const Connect = function(url) {
  socket = new WebSocket(url)
  socket.binaryType = 'arraybuffer'
  socket.onopen = function(e) {
    console.log('已连接至服务器', e)
    const loginData = 'tokennnnnnnnn'
    // let obj = {
    //   a: "苏BH1190",
    //   b: 1627729920674,
    //   c: 1631069591000,
    // };

    // let obj = 1
    const loginView = toView(loginData, 0, 1, 0)
    // let myView = toView(obj, 0, 0x0a, 0); // 发送给websocket

    socket.send(loginView)
    // socket.send(myView);
  }
  socket.onclose = function(e) {
    console.log('链接已关闭', e)
  }
  socket.onmessage = function(e) {
    // console.log("%c 接收到消息", "font-size:20px;background-color: #B03734;color:#fff;", e);
    doReceive(e.data)
  }
  socket.onerror = function(e) {
    console.log('出现错误', e)
  }
}

export const doReceive = function(buffer) {
  const receive = parseBetyData(buffer)
  // console.log("%c 处理后的 receive: ", "font-size:20px;background-color: #EA7E5C;color:#fff;", receive);

  return receive
}

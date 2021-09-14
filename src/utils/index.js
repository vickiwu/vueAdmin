/**
 * Created by PanJiaChen on 16/11/18.
 */
import pako from 'pako'
import utfx from 'utfx'
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}
/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export function parseBetyData(betyData) {
  console.log('%c 🍅 betyData: ', 'font-size:20px;background-color: #EA7E5C;color:#fff;', betyData)
  // 0 不压缩 1 解压
  const dataBf = betyData.slice(3, betyData.byteLength) // 数据buff 从第4个字节开始
  const typeBfView = new Int8Array(betyData, 2, 1) // 第三个字节是否压缩
  console.log('%c 🍑 typeBfView: ', 'font-size:20px;background-color: #33A5FF;color:#fff;', typeBfView)
  let jsonStr
  if (typeBfView[0] === 0) {
    var byteArray = new Uint8Array(dataBf)
    jsonStr = new TextDecoder().decode(byteArray)
    console.log('%c 不压缩的 jsonStr: ', 'font-size:20px;background-color: #ED9EC7;color:#fff;', jsonStr)
  } else {
    const data = pako.inflate(dataBf)
    jsonStr = new TextDecoder().decode(data)
    console.log('%c 压缩解压后的 jsonStr: ', 'font-size:20px;background-color: #93C0A4;color:#fff;', jsonStr)
  }
  // return JSON.parse(jsonStr);
  return jsonStr
}
export function stringSource(str) {
  var i = 0
  return function() {
    return i < str.length ? str.charCodeAt(i++) : null
  }
}
export function toView(data, type1, type2, isP) {
  console.log('%c 🥒 type1, type2, isP: ', 'font-size:20px;background-color: #2EAFB0;color:#fff;', type1, type2, isP)
  let str
  if (typeof (data) === 'object') {
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
  utfx.encodeUTF16toUTF8(stringSource(str), function(b) {
    view.setUint8(offset++, b)
  })
  console.log('%c 🍺 view: ', 'font-size:20px;background-color: #33A5FF;color:#fff;', view)
  return view
}

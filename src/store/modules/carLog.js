import { toView, parseBetyData } from '@/utils/parseWs'
const state = {
  socket: null,
  lineData: null,
  carEventData: [],
  currentCar: null,
  errorStack: [],
  carHistoryData: null,
  carHistoryDataNew: null
}

const mutations = {
  SOCKET_INIT(state, url) {
    if ('WebSocket' in window) {
      state.socket = new WebSocket(url)
      state.socket.binaryType = 'arraybuffer'
    }
  },
  SOCKET_RECIVE(state, wsData) {
    // 接收数据 处理
    var data = wsData[0]
    var type = wsData[1]
    switch (type) {
      case 0x0a:
        if (data.d && data.d.length) {
          const list = data.d.map((val) => {
            return {
              lnglat: `${val.b / 1000000},${val.c / 1000000}` // 经纬度
            }
          })
          state.lineData = list
        }
        break
      case 0x20: // 当前车位置
        state.currentCar = data
        break
      case 0x22: // 事件上报
        state.carEventData = Object.freeze(data)
        break
      case 0x24: // 历史轨迹记录
        state.carHistoryData = Object.freeze(data)
        break
      case 0x25:
        state.carHistoryDataNew = Object.freeze(data)
        break
      default:
        false
    }
  },
  CLOSE_SOCKED(state) {
    state.socket.close()
  },
  ERROR_STACK(state, data) {
    state.errorStack.push(data)
  }
}

const actions = {
  SOCKET_INIT({ commit, dispatch }, url) {
    commit('SOCKET_INIT', url)

    state.socket.onclose = function(e) {
      console.log('ws链接已关闭', e)
    }
    state.socket.onmessage = function(e) {
      const receive = parseBetyData(e.data)
      commit('SOCKET_RECIVE', receive)
    }
    state.socket.onerror = function(e) {
      console.log('ws出现错误', e)
    }
  },
  SOCKET_OPEN({ commit, dispatch }, data) {
    state.socket.onopen = function(e) {
      console.log('连接成功！')
      dispatch('SOCKET_SEND', data)
      state.errorStack.forEach((msg) => {
        dispatch('SOCKET_SEND', msg)
      })
      state.errorStack = []
    }
  },
  SOCKET_SEND({ commit, dispatch }, data) {
    const dataView = toView(data.msg, ...data.type)
    if (state.socket.readyState !== 1) {
      commit('ERROR_STACK', data)
      return
    }
    state.socket.send(dataView)
  },
  CLOSE_SOCKED({ commit, dispatch }, data) {
    commit('CLOSE_SOCKED')
  }
}
const getters = {
  lineData: (state) => state.lineData,
  carEventData: (state) => state.carEventData,
  socket: (state) => state.socket,
  currentCar: (state) => state.currentCar,
  carHistoryData: (state) => state.carHistoryData,
  carHistoryDataNew: (state) => state.carHistoryDataNew
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

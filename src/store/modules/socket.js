
const state = {
  msgList: null // onmessage 返回的数据
}

const mutations = {
  // 将接收到的数据赋值
  WEBSOCKET_REIVE(state, data) {
    console.log('%c 🥩 state, data: ', 'font-size:20px;background-color: #F5CE50;color:#fff;', state, data)
    state.msgList = data
  }
}
// actions 改变状态的操作
const actions = {
  WEBSOCKET_REIVE({ commit }, data) {
    console.log('%c 🍼️ type: ', 'font-size:20px;background-color: #E41A6A;color:#fff;', data)
    commit('WEBSOCKET_REIVE', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

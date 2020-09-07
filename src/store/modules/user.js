import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { constantRoutes, resetRouter } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes: [],
    path: '',
    leftMenu: [],
    permission: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PATH: (state, path) => {
    state.path = path
  },
  SET_ROUTES: (state, routes) => {
    if (routes === '-1') {
      state.routes = []
    } else {
      state.addRoutes = routes
      let newRoutes = []
      newRoutes = constantRoutes.concat(routes)
      // 添加到router当中
      newRoutes.push(
        { path: '*', redirect: '/404', hidden: true }
      )
      state.routes = newRoutes
      resetRouter() // 重置路由
      router.addRoutes(state.routes)
    }
  },
  SET_LEFT_MENU: (state, menu) => {
    state.leftMenu = menu
  },
  SET_PERMISSION: (state, permission) => {
    state.permission = permission
  }
}

const actions = {
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('验证失败，请重新登录。')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // 必须先删除token
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // 必须先删除token
      commit('RESET_STATE')
      resolve()
    })
  },
  changePath({ commit }, path) {
    commit('SET_PATH', path)
  },
  setRoutes({ commit }, routes) {
    commit('SET_ROUTES', routes)
  },
  setLeftRoutes({ commit, dispatch }, path) {
    var res = state.routes.find(function de(item) {
      if (item.path === path) return true
      if (item.children) {
        return item.children.filter(de).length
      }
      return false
    })
    if (!res) res = []

    if (!res.hasLeft) {
      dispatch('app/toggleSideBarHide', true, { root: true })
    } else {
      dispatch('app/toggleSideBarHide', false, { root: true })
    }

    commit('SET_LEFT_MENU', res)
  },
  setPermission({ commit, dispatch }, permission) {
    commit('SET_PERMISSION', permission)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


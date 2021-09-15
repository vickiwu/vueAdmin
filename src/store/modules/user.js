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
    menuType: '',
    leftMenu: [],
    topMenu: [],
    permission: [],
    currentPermission: []
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
  SET_MENU_TYPE: (state, type) => {
    state.menuType = type
  },
  SET_LEFT_MENU: (state, menu) => {
    state.leftMenu = menu
  },
  SET_TOP_MENU: (state, menu) => {
    state.topMenu = menu
  },
  SET_PERMISSION: (state, permission) => {
    state.permission = permission
  },
  SET_CURRENT_PERMISSION: (state, permission) => {
    !permission && (permission = [])
    state.currentPermission = permission
  }
}

const actions = {
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.access_token)
        setToken(data.access_token)
        resolve(data)
      }).catch(error => {
        console.log('%c 🍰 error: ', 'font-size:20px;background-color: #ED9EC7;color:#fff;', error)
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

        const { username, headImgUrl, permission } = data

        commit('SET_NAME', username)
        commit('SET_AVATAR', headImgUrl)
        commit('SET_PERMISSION', permission)
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
        console.log('%c 🍫 router: ', 'font-size:20px;background-color: #FCA650;color:#fff;', router.currentRoute)
        router.push(`/login?redirect=${router.currentRoute.fullPath}`)

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
  setRoutes({ commit }, routes, type) {
    commit('SET_ROUTES', routes)
  },
  setMenuType({ commit }, type) {
    commit('SET_MENU_TYPE', type)
  },
  setTopMenu({ commit }, topMenu) {
    commit('SET_TOP_MENU', topMenu)
  },
  setLeftMenu({ commit }, leftMenu) {
    commit('SET_LEFT_MENU', leftMenu)
  },
  setLeftRoutes({ commit, dispatch }, path) {
    // 点头部可以修改侧菜单
    var res = state.topMenu.find(function de(item) {
      if (item.path === path) return true
      if (item.children) {
        return item.children.filter(de).length
      }
      return false
    })
    if (!res) res = {}
    if (res.showSubMenu || !res.children) {
      // 隐藏
      dispatch('app/toggleSideBarHide', true, { root: true })
    } else {
      dispatch('app/toggleSideBarHide', false, { root: true })
    }
    commit('SET_LEFT_MENU', res.children)
  },
  setPermission({ commit, dispatch }, permission) {
    commit('SET_PERMISSION', permission)
  },
  setCurrentPermission({ commit, dispatch }, permission) {
    commit('SET_CURRENT_PERMISSION', permission)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


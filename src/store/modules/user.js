import { login } from '@/api/user'
import { getToken, setToken, removeToken, getBaseData, setBaseData, removeBaseData } from '@/utils/auth'
import { resetRouter } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    companyId: getBaseData() ? getBaseData().companyId : '',
    deptId: getBaseData() ? getBaseData().deptId : '',
    userId: getBaseData() ? getBaseData().userId : '',
    name: '',
    avatar: '',
    path: '',
    roles: []
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
  SET_BASEDATA: (state, baseData) => {
    state.companyId = baseData.companyId
    state.deptId = baseData.deptId
    state.userId = baseData.userId
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

  SET_ROLES: (state, roles) => {
    state.roles = roles
  }

}

const actions = {
  login({ commit }, userInfo) {
    const { phone, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ phone: phone.trim(), password: password }).then(response => {
        const { d } = response
        commit('SET_TOKEN', d.userId)
        commit('SET_BASEDATA', d)

        // cookie 存值
        setToken(d.userId) // 存token 即userId
        setBaseData(d)
        resolve(d)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const baseData = getBaseData()
      if (baseData) {
        commit('SET_NAME', baseData.username)
        commit('SET_AVATAR', baseData.headImgUrl)
        commit('SET_ROLES', [baseData.roleType])
        resolve(baseData)
      } else {
        reject('获取用户信息失败')
      }
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      try {
        removeToken() // 必须先删除token
        removeBaseData()
        resetRouter()
        router.push(`/login?redirect=${router.currentRoute.fullPath}`)
        commit('RESET_STATE')
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // 必须先删除token
      removeBaseData()
      commit('RESET_STATE')
      resolve()
    })
  },
  changePath({ commit }, path) {
    commit('SET_PATH', path)
  },
  setRoles({ commit, dispatch }, roles) {
    commit('SET_ROLES', roles)
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


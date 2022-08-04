import { asyncRoutes, constantRoutes } from '@/router'

/**
 * 通过 meta.role限制是否有权限
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 过滤权限
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: [],
  menuType: '',
  leftMenu: [],
  topMenu: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_MENU_TYPE: (state, type) => {
    state.menuType = type
  },
  SET_LEFT_MENU: (state, menu) => {
    state.leftMenu = menu
  },
  SET_TOP_MENU: (state, menu) => {
    state.topMenu = menu
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes(1)) { // 角色 1 表示超管
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(state.routes)
    })
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
    if (res.meta.hideLeftMenu || res.meta.hideSubMenu || !res.children) {
      // 隐藏
      dispatch('app/toggleSideBarHide', true, { root: true })
    } else {
      dispatch('app/toggleSideBarHide', false, { root: true })
    }
    commit('SET_LEFT_MENU', res.children)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

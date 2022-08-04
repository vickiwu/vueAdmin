const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  permission_routes: state => state.permission.routes,
  menu_type: (state, getters) => {
    return state.permission.menuType || 'top'
  },
  left_menus: (state, getters) => {
    return state.permission.leftMenu || []
  },
  top_menus: (state, getters) => {
    return state.permission.topMenu || []
  },
  roles: state => state.user.roles || [],
  eventlist: (state) => {
    return state.socket.eventlist
  },
  websock: (state) => {
    return state.socket.websock
  }
}
export default getters

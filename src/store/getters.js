const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  companyId: state => state.user.companyId,
  deptId: state => state.user.deptId,
  customerId: state => state.user.customerId,
  roleType: state => state.user.roleType,
  userId: state => state.user.userId,
  userName: state => state.user.userName,
  phone: state => state.user.phone,
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


const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

module.exports = [
  // user login
  {
    url: '/vue-admin-template/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/vue-admin-template/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },
  // 加载路由
  {
    url: '/vue-admin-template/user/routes\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: {
          'routes': [
            {
              path: '/',
              component: 'Layout',
              top: true, // 是否是头部菜单
              showSubMenu: false, // 是否有头部下拉菜单
              redirect: '/dashboard',
              meta: { title: '首页', icon: 'dashboard' },
              children: [{
                path: '/dashboard',
                top: true, //
                name: 'Dashboard',
                component: 'views/dashboard/index',
                meta: { title: '首页', icon: 'dashboard', permission: ['editor', 'del'] }
              }]
            },

            {
              path: '/example',
              component: 'Layout',
              redirect: '/example/table',
              name: 'Example',
              top: true, // 是否是头部菜单
              showSubMenu: true, // 是否有头部下拉菜单
              hasLeft: false,
              meta: { title: 'Example', icon: 'el-icon-s-help' },
              children: [
                {
                  path: '/example/table',
                  name: 'Table',
                  top: true, // 是否是头部菜单
                  component: 'views/table/index',
                  meta: { title: 'Table', icon: 'table' }
                },
                {
                  path: '/example/tree',
                  top: true, // 是否是头部菜单
                  name: 'Tree',
                  component: 'views/tree/index',
                  meta: { title: 'Treqqqe', icon: 'tree' }
                }
              ]
            },

            {
              path: '/form',
              component: 'Layout',
              redirect: '/form/index',
              top: true,
              hasLeft: true,
              meta: { title: 'Forwwm', icon: 'form' },
              children: [
                {
                  top: true,
                  path: '/form/index',
                  name: 'Form',
                  component: 'views/form/index',
                  meta: { title: 'Form', icon: 'form' }
                }
              ]
            },

            {
              path: '/nested',
              top: true,
              hasLeft: true,
              component: 'Layout',
              redirect: '/nested/menu1',
              name: 'Nested',
              meta: {
                title: 'Nested',
                icon: 'nested'
              },
              children: [
                {
                  path: '/nested/menu1',
                  component: 'views/nested/menu1/index', // Parent router-view
                  name: 'Menu1',
                  meta: { title: 'Menu1' },
                  children: [
                    {
                      path: '/nested/menu1/menu1-1',
                      component: 'views/nested/menu1/menu1-1/index',
                      name: 'Menu1-1',
                      meta: { title: 'Menu1-1' }
                    },
                    {
                      path: '/nested/menu1/menu1-2',
                      component: 'views/nested/menu1/menu1-2/index',
                      name: 'Menu1-2',
                      meta: { title: 'Menu1-2' },
                      children: [
                        {
                          path: '/nested/menu1/menu1-2/menu1-2-1',
                          component: 'views/nested/menu1/menu1-2/menu1-2-1/index',
                          name: 'Menu1-2-1',
                          meta: { title: 'Menu1-2-1' }
                        },
                        {
                          path: '/nested/menu1/menu1-2/menu1-2-2',
                          component: 'views/nested/menu1/menu1-2/menu1-2-2/index',
                          name: 'Menu1-2-2',
                          meta: { title: 'Menu1-2-2' }
                        }
                      ]
                    },
                    {
                      path: '/nested/menu1/menu1-3',
                      component: 'views/nested/menu1/menu1-3/index',
                      name: 'Menu1-3',
                      meta: { title: 'Menu1-3' }
                    }
                  ]
                },
                {
                  path: '/nested/menu2',
                  component: 'views/nested/menu2/index',
                  name: 'Menu2',
                  meta: { title: 'menu2' }
                }
              ]
            },

            {
              path: 'external-link',
              component: 'Layout',
              children: [
                {
                  path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
                  meta: { title: 'External Link', icon: 'link' }
                }
              ]
            }

          ]
        }
      }
    }
  },
  // user logout
  {
    url: '/vue-admin-template/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]


const tokens = {
  admin: {
    access_token: 'admin-token'
  },
  editor: {
    access_token: 'editor-token'
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
    url: '/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const access_token = tokens[username]

      // mock error
      if (!access_token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        a: 200,
        d: {
          userName: '姓名',
          phone: '手机号',
          companyId: 1001, // '公司id',
          deptId: 2001, // '部门id',
          roleType: ['admins'], // '角色类型',
          roleName: '角色名称',
          userId: 3001// '人员id'
        }
      }
    }
  },

  // get user info
  {
    url: '/api-user/users/users/current\.*',
    type: 'get',
    response: config => {
      const { access_token } = config.query
      const info = users[access_token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        a: 200,
        d: {
          ...info,
          permission: ['user:del', 'table:edit', 'user:look']
        }
      }
    }
  },
  // 加载路由
  {
    url: '/api-user/menus/getSysMenuByUserId\.*',
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
      const sysURL1 = 'http://127.0.0.1:8080'

      // 路由和组件后台获取放在routes，
      // 菜单后台获取放在menuList中，
      // 菜单类型menuType，top和left两种，
      // 其中top类型包含有下拉无侧菜单，及无下拉有侧边栏两种情况
      return {
        a: 200,
        d: {
          'routes': [
            {
              'redirect': '/dashboard/index',
              'path': '/',
              'component': 'Layout',
              'children': [
                {
                  'path': '/dashboard/index',
                  'component': '/dashboard/index',
                  'meta': {
                    'affix': true,
                    'title': '首页'
                  }
                  // 'name': '0'
                }
              ],
              'meta': {
                'title': '首页'
              }
              // 'name': '/',
              // 'id': 0
            },
            {
              'redirect': '/auth/client',
              'path': '/auth',
              'component': 'Layout',
              'children': [
                {
                  'path': '/auth/client',
                  'component': '/html/index',
                  'meta': {
                    'affix': false,
                    'permission': [
                      'auth:client:add',
                      'auth:client:update',
                      'auth:client:del',
                      'auth:client:set'
                    ],
                    'title': '企业信息',
                    'url': `${sysURL1}/qyxx`
                  },
                  'name': '2',
                  'id': 2
                },
                {
                  'path': '/auth/service',
                  'component': '/html/index',
                  'meta': {
                    'affix': false,
                    'permission': [
                      'auth:service:add',
                      'auth:service:update',
                      'auth:service:del'
                    ],
                    'title': '服务管理',
                    'url': `${sysURL1}/rygl`
                  },
                  'name': '3',
                  'id': 3
                },
                {
                  'path': '/auth/token',
                  'component': '/html/index',
                  'meta': {
                    'affix': false,
                    'permission': [
                      'auth:token:info',
                      'auth:token:del'
                    ],
                    'title': '令牌管理',
                    'url': `${sysURL1}/lpgl`
                  },
                  'name': '4',
                  'id': 4
                },
                {
                  'path': '/auth/secret',
                  'component': '/html/index',
                  'meta': {
                    'affix': false,
                    'permission': [
                      'auth:secret:del',
                      'auth:secret:show',
                      'auth:secret:add',
                      'auth:secret:update'
                    ],
                    'title': '秘钥管理'
                  },
                  'name': '5',
                  'id': 5
                }
              ],
              'meta': {
                'affix': false,
                'title': '基础信息管理',
                'url': 'http://127.0.0.1:8080'
              },
              'name': '1',
              'id': 1
            },
            {
              'redirect': '/right/user',
              'path': '/right',
              'component': 'Layout',
              'children': [
                {
                  'path': '/right/user',
                  'component': '/html/index',
                  'meta': {
                    'affix': false,
                    'permission': [
                      'right:user:list',
                      'right:user:add',
                      'right:user:info',
                      'right:user:update',
                      'right:user:del'
                    ],
                    'title': '人员管理'
                  },
                  'name': '32',
                  'id': 32
                },
                {
                  'path': '/right/role',
                  'component': '/html/index',
                  'meta': {
                    'affix': false,
                    'permission': [
                      'right:role:add',
                      'right:role:update',
                      'right:role:del',
                      'right:role:set'
                    ],
                    'title': '车辆管理'
                  },
                  'name': '33',
                  'id': 33
                },
                {
                  'path': '/right/menu',
                  'component': '/html/index',
                  'meta': {
                    'affix': false,
                    'permission': [
                      'right:menu:update',
                      'right:menu:del',
                      'right:menu:add',
                      'right:menu:insert'
                    ],
                    'title': '运力管理'
                  },
                  'name': '34',
                  'id': 34
                },
                {
                  'path': '/right/permission',
                  'component': '/html/index',
                  'meta': {
                    'affix': false,
                    'permission': [
                      'right:permission:add',
                      'right:permission:update',
                      'right:permission:del'
                    ],
                    'title': '权限管理'
                  },
                  'name': '35',
                  'id': 35
                }
              ],
              'meta': {
                'affix': false,
                'title': '运力管理'
              },
              'name': '31',
              'id': 31
            },
            {
              'redirect': '/organize/oper',
              'path': '/organize',
              'component': 'Layout',
              'children': [
                {
                  'path': '/organize/oper',
                  'component': '/html/index',
                  'meta': {
                    'affix': false,
                    'permission': [
                      'organize:oper:update',
                      'organize:oper:del',
                      'organize:oper:add',
                      'organize:oper:insert'
                    ],
                    'title': '平台订单'
                  },
                  'name': '62',
                  'id': 62
                },
                {
                  'path': '/organize/org',
                  'component': '/html/index',
                  'meta': {
                    'affix': false,
                    'permission': [
                      'organize:org:dept',
                      'organize:org:user',
                      'organize:org:add',
                      'organize:org:insert',
                      'organize:org:update',
                      'organize:org:del'
                    ],
                    'title': '自有订单'
                  },
                  'name': '63',
                  'id': 63
                }
              ],
              'meta': {
                'affix': false,
                'title': '订单管理'
              },
              'name': '61',
              'id': 61
            },
            {
              'redirect': '/system/dic',
              'path': '/system',
              'component': 'Layout',
              'children': [
                {
                  'path': '/system/dic',
                  'component': '/html/index',
                  'meta': {
                    'affix': false,
                    'permission': [
                      'system:dic:add',
                      'system:dic:update',
                      'system:dic:del',
                      'system:dic:item'
                    ],
                    'title': '字典管理'
                  },
                  'name': '92',
                  'id': 92
                },
                {
                  'path': '/system/file',
                  'component': '/html/index',
                  'meta': {
                    'affix': false,
                    'permission': [
                      'system:file:del',
                      'system:file:info'
                    ],
                    'title': '文件管理'
                  },
                  'name': '93',
                  'id': 93
                },
                {
                  'path': '/system/log',
                  'component': '/html/index',
                  'meta': {
                    'affix': false,
                    'permission': [
                      'system:log:info'
                    ],
                    'title': '日志管理'
                  },
                  'name': '94',
                  'id': 94
                },
                {
                  'path': '/system/matter',
                  'component': '/html/index',
                  'meta': {
                    'affix': false,
                    'permission': [
                      'system:matter:add',
                      'system:matter:update'
                    ],
                    'title': '因子管理'
                  },
                  'name': '95',
                  'id': 95
                }
              ],
              'meta': {
                'affix': false,
                'title': '轨迹管理'
              },
              'name': '91',
              'id': 91
            },
            {
              'redirect': '/html/index',
              'path': '/html',
              'component': 'Layout',
              'children': [
                {
                  'path': '/html/index',
                  'component': '/html/index',
                  'meta': {
                    'affix': false,
                    'title': '服务监控',
                    'url': `${sysURL1}/about`
                  },
                  'name': '122',
                  'id': 122
                }
              ],
              'meta': {
                'affix': false,
                'title': '轨迹监控'
              },
              'name': '121',
              'id': 121
            }
          ],
          'menuList': [
            {
              'path': '/dashboard/index',
              'meta': {
                'icon': 'el-icon-menu',
                'title': '首页'
              },
              'id': 0
            },
            {
              'path': '/auth',
              'children': [
                {
                  'path': '/auth/client',
                  'meta': {
                    'icon': 'el-icon-menu',
                    'permission': [
                      'auth:client:add',
                      'auth:client:update',
                      'auth:client:del',
                      'auth:client:set'
                    ],
                    'title': '企业信息'
                  },
                  'id': 2
                },
                {
                  'path': '/auth/service',
                  'meta': {
                    'icon': 'el-icon-menu',
                    'permission': [
                      'auth:service:add',
                      'auth:service:update',
                      'auth:service:del'
                    ],
                    'title': '人员管理'
                  },
                  'id': 3
                },
                {
                  'path': '/auth/token',
                  'meta': {
                    'icon': 'el-icon-menu',
                    'permission': [
                      'auth:token:info',
                      'auth:token:del'
                    ],
                    'title': '令牌管理'
                  },
                  'id': 4
                },
                {
                  'path': '/auth/secret',
                  'meta': {
                    'icon': 'el-icon-menu',
                    'permission': [
                      'auth:secret:del',
                      'auth:secret:show',
                      'auth:secret:add',
                      'auth:secret:update'
                    ],
                    'title': '秘钥管理'
                  },
                  'id': 5
                }
              ],
              'meta': {
                'icon': 'el-icon-menu',
                'title': '基础信息管理'
              },
              'id': 1,
              'hideSubMenu': false
            },
            {
              'path': '/right',
              'children': [
                {
                  'path': '/right/user',
                  'meta': {
                    'icon': 'el-icon-menu',
                    'permission': [
                      'right:user:list',
                      'right:user:add',
                      'right:user:info',
                      'right:user:update',
                      'right:user:del'
                    ],
                    'title': '人员管理'
                  },
                  'id': 32
                },
                {
                  'path': '/right/role',
                  'meta': {
                    'icon': 'el-icon-menu',
                    'permission': [
                      'right:role:add',
                      'right:role:update',
                      'right:role:del',
                      'right:role:set'
                    ],
                    'title': '车辆管理'
                  },
                  'id': 33
                },
                {
                  'path': '/right/menu',
                  'meta': {
                    'icon': 'el-icon-menu',
                    'permission': [
                      'right:menu:update',
                      'right:menu:del',
                      'right:menu:add',
                      'right:menu:insert'
                    ],
                    'title': '运力管理'
                  },
                  'id': 34
                },
                {
                  'path': '/right/permission',
                  'meta': {
                    'icon': 'el-icon-menu',
                    'permission': [
                      'right:permission:add',
                      'right:permission:update',
                      'right:permission:del'
                    ],
                    'title': '权限管理'
                  },
                  'id': 35
                }
              ],
              'meta': {
                'icon': 'el-icon-menu',
                'title': '运力管理'
              },
              'id': 31,
              'hideSubMenu': false
            },
            {
              'path': '/organize',
              'children': [
                {
                  'path': '/organize/oper',
                  'meta': {
                    'icon': 'el-icon-menu',
                    'permission': [
                      'organize:oper:update',
                      'organize:oper:del',
                      'organize:oper:add',
                      'organize:oper:insert'
                    ],
                    'title': '平台订单'
                  },
                  'id': 62
                },
                {
                  'path': '/organize/org',
                  'meta': {
                    'icon': 'el-icon-menu',
                    'permission': [
                      'organize:org:dept',
                      'organize:org:user',
                      'organize:org:add',
                      'organize:org:insert',
                      'organize:org:update',
                      'organize:org:del'
                    ],
                    'title': '自有订单'
                  },
                  'id': 63
                }
              ],
              'meta': {
                'icon': 'el-icon-menu',
                'title': '订单管理'
              },
              'id': 61,
              'hideSubMenu': false
            },
            {
              'path': '/system',
              'children': [
                {
                  'path': '/system/dic',
                  'meta': {
                    'icon': 'el-icon-menu',
                    'permission': [
                      'system:dic:add',
                      'system:dic:update',
                      'system:dic:del',
                      'system:dic:item'
                    ],
                    'title': '字典管理'
                  },
                  'id': 92
                },
                {
                  'path': '/system/file',
                  'meta': {
                    'icon': 'el-icon-menu',
                    'permission': [
                      'system:file:del',
                      'system:file:info'
                    ],
                    'title': '文件管理'
                  },
                  'id': 93
                },
                {
                  'path': '/system/log',
                  'meta': {
                    'icon': 'el-icon-menu',
                    'permission': [
                      'system:log:info'
                    ],
                    'title': '日志管理'
                  },
                  'id': 94
                },
                {
                  'path': '/system/matter',
                  'meta': {
                    'icon': 'el-icon-menu',
                    'permission': [
                      'system:matter:add',
                      'system:matter:update'
                    ],
                    'title': '因子管理'
                  },
                  'id': 95
                }
              ],
              'meta': {
                'icon': 'el-icon-menu',
                'title': '轨迹管理'
              },
              'id': 91,
              'hideSubMenu': false
            },
            {
              'path': '/html',
              'children': [
                {
                  'path': '/html/index',
                  'meta': {
                    'icon': 'el-icon-menu',
                    'title': '服务监控2'
                  },
                  'id': 122
                }
              ],
              'meta': {
                'icon': 'el-icon-menu',
                'title': '轨迹监控3'
              },
              'id': 121,
              'hideSubMenu': false
            }
          ],
          'menuType': 'top'
        }
      }
    }
  },
  // user logout
  {
    url: '/api-auth/oauth/remove/token',
    type: 'post',
    response: _ => {
      return {
        a: 200,
        d: 'success'
      }
    }
  }
]

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * 注意：子菜单仅在路由children.length> = 1时出现
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                  如果设置为true，则项目不会显示在边栏中（默认为false）
 * alwaysShow: true               如果设置为true，将始终显示根菜单
 *                                如果未设置alwaysShow，则当项具有多个子路由时，
 *                                它将变为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置noRedirect，则不会在面包屑中重定向
 * name:'router-name'            该name给<keep-alive>使用（必须设置！！！）
 * meta : {
    roles: ['admin','editor']    控制页面角色（您可以设置多个角色）
    title: 'title'               名称显示在侧边栏和面包屑中（推荐设置）
    icon: 'svg-name'/'el-icon-x' 侧栏中的图标显示
    noCache: true                如果设置为true，将不缓存页面（默认为false）
    affix: true                  如果设置为true，则标签将粘贴在标签视图中
    breadcrumb: false            如果设置为false，则该项目将隐藏在面包屑中（默认为true）
    activeMenu: '/example/list'  如果设置了路径，则侧边栏将突出显示您设置的路径
  }
 */

/**
 * constantRoutes
 * 没有权限要求的基本页面
 * 可以访问所有角色
 */
export const constantRoutes = [{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path(.*)',
    component: () => import('@/views/redirect/index')
  }]
},
{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},
{
  path: '/',
  redirect: '/index',
  component: Layout,
  children: [{
    'path': '/index',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index'), // 父级 router-view ,
    'meta': {
      'affix': true,
      'title': '首页'
    }
  }],
  'meta': {
    'title': '首页',
    'hideSubMenu': false,
    hideLeftMenu: true,
    'icon': 'el-icon-menu'
  }

},
{
  path: '/404',
  component: () => import('@/views/404'),
  hidden: true
}

]

const threeRoute = [
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: '/nested/menu1',
        component: () => import('@/views/nested/menu1/index'), // 父级 router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: '/nested/menu1/menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: '/nested/menu1/menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: '/nested/menu1/menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1zzzzz', roles: ['editor'] }
              },
              {
                path: '/nested/menu1/menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: '/nested/menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: { title: 'menu2' }
      }
    ]
  }
]
export const asyncRoutes = [
  // ...threeRoute,
  {
    'redirect': '/auth/people',
    'path': '/auth',
    component: Layout,
    'children': [{
      'path': '/auth/people',
      component: () => import('@/views/auth/people'),
      'meta': {
        'icon': 'el-icon-menu',
        'affix': false,
        'permission': [
          'auth:people:add',
          'auth:people:update',
          'auth:people:del',
          'auth:people:set'
        ],
        'title': '人员管理'
      },
      'name': '2'
    },
    {
      'path': '/auth/depart',
      component: () => import('@/views/auth/depart'),
      'meta': {
        'icon': 'el-icon-menu',
        'affix': false,
        'permission': [
          'auth:depart:add',
          'auth:depart:update',
          'auth:depart:del'
        ],
        'title': '部门管理'
      },
      'name': '3'
    },
    {
      'path': '/auth/driver',
      component: () => import('@/views/auth/driver'),
      'meta': {
        'icon': 'el-icon-menu',
        'affix': false,
        'permission': [
          'auth:driver:info',
          'auth:driver:del'
        ],
        'title': '司机管理'
      },
      'name': '4',
      'id': 4
    },
    {
      'path': '/auth/client',
      component: () => import('@/views/auth/client'),
      'meta': {
        'icon': 'el-icon-menu',
        'affix': false,
        'permission': [
          'auth:client:del',
          'auth:client:show',
          'auth:client:add',
          'auth:client:update'
        ],
        'title': '客户管理'
      },
      'name': '5',
      'id': 5
    }
    ],
    'meta': {
      'icon': 'el-icon-menu',
      'affix': false,
      'title': '基础信息'
    },
    'name': '1',
    'id': 1
  },
  {
    'redirect': '/right/user',
    'path': '/right',
    component: Layout,
    'children': [{
      'path': '/right/user',
      component: () => import('@/views/html/index'),
      'meta': {
        'icon': 'el-icon-menu',
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
      component: () => import('@/views/html/index'),
      'meta': {
        'icon': 'el-icon-menu',
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
      component: () => import('@/views/html/index'),
      'meta': {
        'icon': 'el-icon-menu',
        'affix': false,
        'permission': [
          'right:menu:update',
          'right:menu:del',
          'right:menu:add',
          'right:menu:insert'
        ],
        'title': '运力管理sss'

      },
      hidden: true,
      'name': '34',
      'id': 34
    },
    {
      'path': '/right/permission',
      component: () => import('@/views/html/index'),
      'meta': {
        'icon': 'el-icon-menu',
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
      'icon': 'el-icon-menu',
      'affix': false,
      'title': '运力管理'
    },
    'name': '31',
    'id': 31
  },
  {
    'redirect': '/organize/oper',
    'path': '/organize',
    component: Layout,
    'children': [{
      'path': '/organize/oper',
      component: () => import('@/views/html/index'),
      'meta': {
        'icon': 'el-icon-menu',
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
      component: () => import('@/views/html/index'),
      'meta': {
        'icon': 'el-icon-menu',
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
      'icon': 'el-icon-menu',
      'affix': false,
      'title': '订单管理'
    },
    'name': '61',
    'id': 61
  },
  {
    'redirect': '/system/dic',
    'path': '/system',
    component: Layout,
    'children': [{
      'path': '/system/dic',
      component: () => import('@/views/html/index'),
      'meta': {
        'icon': 'el-icon-menu',
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
      component: () => import('@/views/html/index'),
      'meta': {
        'icon': 'el-icon-menu',
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
      component: () => import('@/views/html/index'),
      'meta': {
        'icon': 'el-icon-menu',
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
      component: () => import('@/views/html/index'),
      'meta': {
        'icon': 'el-icon-menu',
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
      'icon': 'el-icon-menu',
      'affix': false,
      'title': '系统管理'
    },
    'name': '91',
    'id': 91
  },
  {
    'redirect': '/html/index',
    'path': '/html',
    component: Layout,
    'children': [{
      'path': '/html/index',
      component: () => import('@/views/html/index'),
      'meta': {
        'icon': 'el-icon-menu',
        'affix': false,
        'title': '服务治理'
      },
      'name': '122',
      'id': 122
    }],
    'meta': {
      'icon': 'el-icon-menu',
      'affix': false,
      'title': '系统监控'
    },
    'name': '121',
    'id': 121
  },

  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置路由
}

export default router

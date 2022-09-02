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
    component: () => import('@/views/dashboard/indexBg'), // 父级 router-view ,
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

// const threeRoute = [
//   {
//     path: '/nested',
//     component: Layout,
//     redirect: '/nested/menu1',
//     name: 'Nested',
//     meta: {
//       title: 'Nested',
//       icon: 'nested'
//     },
//     children: [
//       {
//         path: '/nested/menu1',
//         component: () => import('@/views/nested/menu1/index'), // 父级 router-view
//         name: 'Menu1',
//         meta: { title: 'Menu1' },
//         children: [
//           {
//             path: '/nested/menu1/menu1-1',
//             component: () => import('@/views/nested/menu1/menu1-1'),
//             name: 'Menu1-1',
//             meta: { title: 'Menu1-1' }
//           },
//           {
//             path: '/nested/menu1/menu1-2',
//             component: () => import('@/views/nested/menu1/menu1-2'),
//             name: 'Menu1-2',
//             meta: { title: 'Menu1-2' },
//             children: [
//               {
//                 path: '/nested/menu1/menu1-2-1',
//                 component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
//                 name: 'Menu1-2-1',
//                 meta: { title: 'Menu1-2-1zzzzz', roles: ['editor'] }
//               },
//               {
//                 path: '/nested/menu1/menu1-2-2',
//                 component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
//                 name: 'Menu1-2-2',
//                 meta: { title: 'Menu1-2-2' }
//               }
//             ]
//           },
//           {
//             path: 'menu1-3',
//             component: () => import('@/views/nested/menu1/menu1-3'),
//             name: 'Menu1-3',
//             meta: { title: 'Menu1-3' }
//           }
//         ]
//       },
//       {
//         path: '/nested/menu2',
//         component: () => import('@/views/nested/menu2/index'),
//         meta: { title: 'menu2' }
//       }
//     ]
//   }
// ]
export const asyncRoutes = [
  // ...threeRoute,
  {
    'redirect': '/auth/people',
    'path': '/auth',
    component: Layout,
    'children': [
      {
        'path': '/auth/depart',
        component: () => import('@/views/auth/depart'),
        'meta': {
          'icon': 'el-icon-menu',
          'affix': false,
          roles: [1, 2, 3],
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
          roles: [1, 2, 3],
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
        'path': '/auth/car',
        component: () => import('@/views/auth/car'),
        'meta': {
          roles: [1, 2, 3],
          'icon': 'el-icon-menu',
          'affix': false,
          'permission': [
            'auth:car:info',
            'auth:car:del'
          ],
          'title': '车辆管理'
        },
        'name': 'car',
        'id': 5
      },
      {
        'path': '/auth/client',
        component: () => import('@/views/auth/client'),
        'meta': {
          'icon': 'el-icon-menu',
          'affix': false,
          roles: [1, 2, 3],
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
      roles: [1, 2, 3],
      'icon': 'el-icon-menu',
      'affix': false,
      'title': '基础信息'
    },
    'name': '1',
    'id': 1
  },
  {
    'redirect': '/area/address',
    'path': '/area',
    component: Layout,
    'children': [{
      'path': '/area/address',
      component: () => import('@/views/area/address'),
      'meta': {
        'icon': 'el-icon-menu',
        'affix': false,
        roles: [1, 2, 3],
        'permission': [
          'area:user:list',
          'area:user:add',
          'area:user:info',
          'area:user:update',
          'area:user:del'
        ],
        'title': '区域列表'
      },
      'name': '32',
      'id': 32
    },
    {
      'path': '/area/add',
      component: () => import('@/views/area/add'),
      'meta': {
        'icon': 'el-icon-menu',
        'affix': false,
        roles: [1, 2, 3],
        'permission': [
          'area:user:list',
          'area:user:add',
          'area:user:info',
          'area:user:update',
          'area:user:del'
        ],
        'title': '新增区域'
      },
      'name': 'areaAdd',
      hidden: true

    },
    {
      'path': '/area/edit',
      component: () => import('@/views/area/edit'),
      'meta': {
        'icon': 'el-icon-menu',
        'affix': false,
        roles: [1, 2, 3],
        'permission': [
          'area:user:list',
          'area:user:add',
          'area:user:info',
          'area:user:update',
          'area:user:del'
        ],
        'title': '修改区域'
      },
      'name': 'areaEdit',
      hidden: true
    }

    ],
    'meta': {
      roles: [1, 2, 3],
      'icon': 'el-icon-menu',
      'affix': false,
      'title': '区域管理'
    },
    'name': '31',
    'id': 31
  },
  {
    'redirect': '/order/publish',
    'path': '/order',
    component: Layout,
    'children': [{
      'path': '/order/publish',
      component: () => import('@/views/order/publish'),
      'meta': {
        roles: [1, 2, 3],
        'icon': 'el-icon-menu',
        'affix': false,
        'permission': [
          'order:oper:update',
          'order:oper:del',
          'order:oper:add',
          'order:oper:insert'
        ],
        'title': '订单发布'
      },
      'name': 'orderPublish',
      hidden: true
    },
    {
      'path': '/order/list',
      component: () => import('@/views/order/list'),
      'meta': {
        'icon': 'el-icon-menu',
        'affix': false,
        roles: [1, 10, 11, 2, 3],
        'permission': [
          'order:org:dept',
          'order:org:user',
          'order:org:add',
          'order:org:insert',
          'order:org:update',
          'order:org:del'
        ],
        'title': '订单列表'
      },
      'name': '63',
      'id': 63
    },
    {
      'path': '/order/addCar',
      component: () => import('@/views/order/addCar'),
      'meta': {
        roles: [1, 2, 3],
        'icon': 'el-icon-menu',
        'affix': false,
        'permission': [
          'order:org:dept',
          'order:org:user',
          'order:org:add',
          'order:org:insert',
          'order:org:update',
          'order:org:del'
        ],
        'title': '派车'
      },
      'name': 'addCar',
      hidden: true
    },
    {
      'path': '/order/bindDevice',
      component: () => import('@/views/order/bindDevice'),
      'meta': {
        roles: [1, 2, 3],
        'icon': 'el-icon-menu',
        'affix': false,
        'permission': [
          'order:org:dept',
          'order:org:user',
          'order:org:add',
          'order:org:insert',
          'order:org:update',
          'order:org:del'
        ],
        'title': '绑定设备'
      },
      'name': 'bindDevice',
      hidden: true
    },
    {
      'path': '/order/detail',
      component: () => import('@/views/order/detail'),
      'meta': {
        'icon': 'el-icon-menu',
        'affix': false,
        roles: [1, 10, 11, 2, 3],
        'permission': [
          'order:oper:update',
          'order:oper:del',
          'order:oper:add',
          'order:oper:insert'
        ],
        'title': '订单详情'
      },
      'name': 'OrderDetail',
      hidden: true
    }, {
      'path': '/order/map',
      component: () => import('@/views/order/map'),
      'meta': {
        roles: [1, 10, 11, 2, 3],
        'icon': 'el-icon-menu',
        'affix': false,
        'title': '轨迹监控'
      },
      'name': 'orderMap',
      hidden: true
    }
    ],
    'meta': {
      roles: [1, 10, 11, 2, 3],
      'icon': 'el-icon-menu',
      'affix': false,
      'title': '订单管理'
    },
    'name': '61',
    'id': 61
  },
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

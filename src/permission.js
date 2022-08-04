import router from './router'
import { menuType } from './settings'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress配置
store.dispatch('permission/setMenuType', menuType)

const whiteList = ['/login'] // 没有重定向白名单

router.beforeEach(async(to, from, next) => {
  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/index' })
      NProgress.done()
    } else {
      // 获取用户权限
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 重新获取用户信息和路由
          const { roleType } = await store.dispatch('user/getInfo')
          // 根据权限生成权限可访问路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', [roleType])
          if (menuType === 'top') {
            store.dispatch('permission/setTopMenu', accessRoutes)
          } else if (menuType === 'left') {
            store.dispatch('permission/setLeftMenu', accessRoutes)
          }
          // 动态添加路由
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
        } catch (error) {
          console.log(error, 'error')
          // 删除token并进入登录页面重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || '出现错误')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 没有token*/
    if (whiteList.indexOf(to.path) !== -1) {
      //  在免登录白名单中，直接进入
      next()
    } else {
      // 其他无权访问的页面将被重定向到登录页面。
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

<template>
  <div>
    <div class="logo">
      <logo :collapse="isCollapse" />
    </div>
    <div class="top-menu">
      <el-scrollbar class="scroll-container">
        <el-menu
          :default-active="activeMenu"
          :background-color="variables.topBarBackground"
          :text-color="variables.textColor"
          :unique-opened="false"
          :active-text-color="variables.textColor"
          mode="horizontal"
          @select="handleSelect"
        >
          <topbar-item
            v-for="route in top_menus"
            :key="route.path"
            class="nav-item"
            :item="route"
            :base-path="route.path"
          />
        </el-menu>
      </el-scrollbar>
    </div>
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip
          content="Global Size"
          effect="dark"
          placement="bottom"
        />

      </template>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <router-link to="/system/user">
            <el-dropdown-item>用户管理</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import TopbarItem from './TopbarItem'
import Screenfull from '@/components/Screenfull'
import Search from '@/components/HeaderSearch'
import variables from '@/styles/variables.scss'

export default {
  components: {
    TopbarItem,
    Logo,
    Screenfull,
    Search
  },
  data() {
    return {
      routes: this.$store.state.user.routes
    }
  },
  computed: {
    ...mapGetters([
      'top_menus',
      'sidebar',
      'avatar',
      'device'
    ]),

    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // 如果设置了路径，则侧边栏将突出显示设置的路径
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
  },
  methods: {
    handleSelect(key, keyPath) {
      // let route = this.permission_routes.find(item => item.path === key)
      // if (!route) {
      //   route = []
      // }
      // this.setSidebarHide(route)
    },
    // 设置侧边栏的显示和隐藏
    setSidebarHide(route) {
      if (!route.children || route.children.length === 1) {
        this.$store.dispatch('app/toggleSideBarHide', true)
      } else {
        this.$store.dispatch('app/toggleSideBarHide', false)
      }
    },
    async logout() {
      await this.$store.dispatch('user/logout')
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;

  ::v-deep {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__wrap {
      // 56px +17px
      height: 73px;
    }
  }
}
</style>

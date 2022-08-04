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
      <template v-if="device !== 'mobile'">
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
        <el-tooltip content="Global Size" effect="dark" placement="bottom" />
      </template>
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="editPwdOpen">
            修改密码
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="修改密码"
      center
      :visible.sync="dialogFormVisible"
      append-to-body
    >
      <el-form :model="userData">
        <el-form-item label="手机号码：" label-width="120px">
          <el-input v-model="userData.phone" disabled />
        </el-form-item>
        <el-form-item label="新密码：" label-width="120px">
          <el-input
            v-model="userData.newPassword"
            type="password"
            placeholder="请输入新的密码"
          />
        </el-form-item>
        <el-form-item label="确认新密码：" label-width="120px">
          <el-input
            v-model="userData.newPassword"
            type="password"
            placeholder="请再输入新的密码"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPwdBtn"> 确 定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import TopbarItem from './TopbarItem'
import Screenfull from '@/components/Screenfull'
import variables from '@/styles/variables.scss'
import { getBaseData } from '@/utils/auth'
import { editPwd } from '@/api/user'

export default {
  components: {
    TopbarItem,
    Logo,
    Screenfull
  },
  data() {
    return {
      dialogFormVisible: false,
      routes: this.$store.state.user.routes,
      userData: {
        phone: '',
        newPassword: '',
        password: ''
      }
    }
  },
  computed: {
    ...mapGetters(['top_menus', 'sidebar', 'avatar', 'device']),
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
  created() {},
  mounted() {
    const baseData = getBaseData()
    this.userData.phone = baseData.phone
    this.userData.password = baseData.password
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
    },
    editPwdOpen() {
      this.dialogFormVisible = true
    },
    editPwdBtn() {
      editPwd(this.userData).then(res => {
        this.dialogFormVisible = false
      })
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

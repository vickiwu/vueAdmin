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
          <img src="../../../assets/avatar2.jpg" class="user-avatar" />
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
      <el-form :model="userData" :rules="rulesPwd">
        <el-form-item label="手机号码：" label-width="120px">
          <el-input v-model="userData.phone" disabled />
        </el-form-item>
        <el-form-item label="原始密码：" label-width="120px" prop="password">
          <el-input
            v-model="userData.password"
            type="password"
            placeholder="请输入原始密码"
          />
        </el-form-item>
        <el-form-item label="新密码：" label-width="120px" prop="newPassword">
          <el-input
            v-model="userData.newPassword"
            type="password"
            placeholder="请输入新的密码"
          />
        </el-form-item>
        <el-form-item
          label="确认新密码："
          label-width="120px"
          prop="newPassword2"
        >
          <el-input
            v-model="userData.newPassword2"
            type="password"
            placeholder="请再次输入新的密码"
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
import { isPhone, isPassword } from '@/utils/validate.js'
import { Message } from 'element-ui'

export default {
  components: {
    TopbarItem,
    Logo,
    Screenfull
  },
  data() {
    const validatePassword2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.userData.newPassword) {
        callback(new Error('新密码不一致'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value && !isPassword(value)) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!isPhone(value)) {
        callback(new Error('手机号码格式不正确'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      routes: this.$store.state.user.routes,
      userData: {
        phone: '',
        newPassword: '',
        password: '',
        newPassword2: ''
      },
      rulesPwd: {
        phone: [
          { required: true, trigger: 'change', validator: validatePhone }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        newPassword: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        newPassword2: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePassword2
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['top_menus', 'sidebar', 'device']),
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
  mounted() {},
  methods: {
    setPhoneNum() {
      const baseData = getBaseData()
      this.userData.phone = baseData.phone
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
      this.userData = {
        phone: '',
        newPassword: '',
        password: '',
        newPassword2: ''
      }
      this.setPhoneNum()
      this.dialogFormVisible = true
    },
    editPwdBtn() {
      delete this.userData.newPassword2
      editPwd(this.userData).then((res) => {
        if (+res.a === 200) {
          Message({
            message: res.m || '修改成功,请重新登录',
            type: 'success',
            duration: 2 * 1000
          })
          this.dialogFormVisible = false
          this.logout()
        } else {
          Message({
            message: '修改失败',
            type: 'error',
            duration: 2 * 1000
          })
        }
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

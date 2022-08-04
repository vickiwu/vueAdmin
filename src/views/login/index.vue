<template>
  <div class="login-container">
    <el-card class="login-card animation-right">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="top"
        label-width="80px"
      >
        <el-form-item prop="username" label="用户名：">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入用户名"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password" label="密码：">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>

        <!-- <div class="remember-pwd">
          <el-checkbox v-model="checked">记住密码</el-checkbox>
        </div> -->
        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin: 10px 0 10px 0"
          @click.native.prevent="handleLogin"
        >
          登录
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }

    return {
      // checked: true,
      loginForm: {
        username: '13182811030',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    // this.$setWs.initWebSocket('ws://192.168.1.140:8080/ws')
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(res => {
              // cookie 存值

              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
$bg: #283443;
$inputBg: #fff;
$light_gray: #333333;
$cursor: #333333;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    background: none !important;
    color: $cursor;
  }
}

.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $inputBg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item__content {
    border: 1px solid #dddddd;
    background: rgba(0, 0, 0, 0);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #333333;

.login-container {
  min-height: 100%;
  width: 100%;
  background: #d2e8f6 url('~@/assets/bg.png') center fixed no-repeat;
  background-size: cover;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  .el-form-item__label {
    padding: 0;
  }

  .login-card {
    width: 420px;
    max-width: 100%;
    height: 350px;
    .login-form {
      padding: 5px 0px;
      margin: 0 auto;
      overflow: hidden;
      .el-row .el-form-item {
        margin-bottom: 10px;
      }
      .valid-img {
        height: 50px;
        display: flex;
        align-items: center;
        margin-left: 10px;
        cursor: pointer;
      }
      .send-yzm {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 13px;
        color: #409eff;
        cursor: pointer;
      }
    }
  }

  .tips {
    font-size: 14px;
    color: #333;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 3px 5px 3px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    height: 40px;
    padding: 5px 20px;
    margin-bottom: 15px;
    // line-height: 40px;
    .active-line {
      width: 80px;
      height: 3px;
      background: #66b1ff;
      margin: 3px 10px 0 10px;
    }
    .el-row {
      .el-col {
        &.active {
          color: #66b1ff;
        }
        cursor: pointer;
        margin-bottom: 5px;
      }
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.animation-right {
  -webkit-animation: fadeInRight 0.5s 0.1s ease both;
  -moz-animation: fadeInRight 0.5s 0.1s ease both;
}

@-webkit-keyframes fadeInLeft {
  0% {
    opacity: 0;
    -webkit-transform: translateX(0px);
  }
  100% {
    opacity: 1;
    width: 65px;
    -webkit-transform: translateX(179px);
  }
}
@-moz-keyframes fadeInLeft {
  0% {
    opacity: 0;
    -moz-transform: translateX(0px);
  }
  100% {
    opacity: 1;
    -moz-transform: translateX(179px);
  }
}
@-webkit-keyframes fadeInRight {
  0% {
    opacity: 0;
    -webkit-transform: translateX(179px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateX(0);
  }
}
@-moz-keyframes fadeInRight {
  0% {
    opacity: 0;
    -moz-transform: translateX(179px);
  }
  100% {
    opacity: 1;
    -moz-transform: translateX(0);
  }
}
.yzm-icon {
  // color: red;
}
</style>

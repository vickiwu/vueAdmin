<template>
  <div class="login-container">
    <el-card class="login-card">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >

        <div class="title-container">
          <el-row>
            <el-col
              :span="12"
              :class="isActive ==='account'&& 'active'"
              @click.native="isActive='account'"
            >账号密码登录</el-col>
            <el-col
              :span="12"
              :class="isActive==='phone'&& 'active'"
              @click.native="isActive='phone'"
            >验证码登录</el-col>
          </el-row>
          <div
            class="active-line"
            :class="isActive==='phone'?'animation-left':'animation-right'"
          />

        </div>

        <div v-if="isActive==='account'">
          <el-form-item prop="username">
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

          <el-form-item prop="password">
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
            <span
              class="show-pwd"
              @click="showPwd"
            >
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
          <el-row>
            <el-col :span="18">
              <el-form-item prop="validate">
                <span class="svg-container">
                  <svg-icon icon-class="yzm" />
                </span>
                <el-input
                  ref="validate"
                  v-model="loginForm.validate"
                  placeholder="请输入验证码"
                  name="validate"
                  type="text"
                  tabindex="1"
                  auto-complete="on"
                />

              </el-form-item>
            </el-col>
            <el-col :span="6">
              <div class="valid-img">
                <img
                  src="data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAUCAIAAABeYcl+AAAA2UlEQVR42u3W0QnDIBAGYCfJDu0YWaRbdLEOUOhT37JEdmiFgx+5/86obQ0Nig/JSciHnqfh9YctDPTWz0LYAX1/ntF59Hp6mF24sS3TLXb1lQTT+GVepSOISDU6FZtuDy1u+DbRUCp0y0wrKLtTH2Y378arN9ksrkB7KWGihcsrUI6Oz13R5m5rQMOtxC1oL6GRCflF2AFtbkQkQy2aob9Cl29Ebyg/u0r85Zw+OFrFS9Bc8jrVaa53tWhVttvRn5yI+VOQE4PPyK53j3K0VzHS+LiaDvTR0G8iO3BjUHwybgAAAABJRU5ErkJggg=="
                  alt="验证码"
                >

              </div>
            </el-col>
          </el-row>

          <div class="remember-pwd">
            <el-checkbox v-model="checked">记住密码</el-checkbox>
          </div>
        </div>

        <div v-if="isActive==='phone'">
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入手机号码"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </el-form-item>

          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="yzm" class-name="yzm-icon" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入验证码"
              name="username"
              type="text"
              tabindex="1"
            />
            <span class="send-yzm">
              发送验证码
            </span>
          </el-form-item>

        </div>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;margin:20px 0 10px 0;"
          @click.native.prevent="handleLogin"
        >登录</el-button>

      </el-form>
    </el-card>

  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
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
    const validateValidate = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('验证码不能为空'))
      } else {
        callback()
      }
    }
    return {
      checked: true,
      isActive: 'account',
      loginForm: {
        username: 'admin',
        password: 'admin',
        validate: '6DWK'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        validate: [{ required: true, trigger: 'blur', validator: validateValidate }]
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
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
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
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

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

/* reset element-ui css */
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

  .el-form-item {
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
  // background-color: $bg;
  background: #d2e8f6 url('~@/assets/bg.png') center fixed no-repeat;
  background-size: cover;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-card {
    width: 440px;
    max-width: 100%;
    height: 380px;
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
        color: #409EFF;
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
.animation-left {
  -webkit-animation: fadeInLeft 0.5s 0.1s ease both;
  -moz-animation: fadeInLeft 0.5s 0.1s ease both;
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
.yzm-icon{
  // color: red;
}
</style>

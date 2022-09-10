'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || '后台管理框架' // page title

// 端口设置
const port = process.env.port || process.env.npm_config_port || 9528 // 开发端口

// 配置项文档https://cli.vuejs.org/config
module.exports = {

  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // before: require('./mock/mock-server.js')
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://120.48.19.218:9090',
        changeOrigin: true, // 配置跨域
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: process.env.VUE_APP_BASE_API
        }
      },
      '/file': {
        // target: "http://120.48.19.218:6070", //开发
        target: 'http://120.48.162.194', // 测试
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/file': '/file' // 重写接口
        }
      },
      '/sybdfile': {
        // target: "http://120.48.19.218:6070", //开发
        target: 'http://120.48.162.194', // 测试
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/sybdfile': '/sybdfile' // 重写接口
        }
      }

    }

  },
  configureWebpack: {
    // 在webpack的名称字段中提供应用程序的标题，以便
    // 可以在index.html中对其进行访问以注入正确的标题。
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    // 它可以提高第一个屏幕的速度，建议打开预加载
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    config.plugins.delete('prefetch')

    // 设置svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime`必须和runtimeChunk名称相同。默认是“运行时”
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // 仅打包最初依赖的第三方
                },
                elementUI: {
                  name: 'chunk-elementUI', // 将elementUI拆分为一个包
                  priority: 20, // 重量需要大于libs和app，否则将打包到libs或app中
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // 为了适应cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // 可以自定义规则
                  minChunks: 3, //  最小共同数
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}

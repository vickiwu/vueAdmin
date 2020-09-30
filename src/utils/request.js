import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建一个axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // 跨域请求时发送Cookie
  timeout: 5000 // 请求超时
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    config.headers['client_id'] = 'webApp'
    config.headers['client_secret'] = 'webApp'
    // config.headers['Content-Type'] = 'application/json'
    if (store.getters.token) {
      // 让每个请求都携带令牌
      // ['X-Token']是自定义标头键
      // 请根据实际情况进行修改
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }
    return config
  },
  error => {
    // 请求错误处理
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * 如果您想获取http信息（例如标题或状态）
   * 请返回响应=>响应
  */

  /**
   *通过自定义代码确定请求状态
   *这只是一个例子
   *您也可以通过HTTP状态代码来判断状态
   */
  response => {
    const res = response.data

    if (res.code !== 200) {
      Message({
        message: res.msg || '错误',
        type: 'error',
        duration: 5 * 1000
      })

      return Promise.reject(new Error(res.msg || '错误'))
    } else {
      // Message({
      //   message: res.msg || '成功',
      //   type: 'success',
      //   duration: 2 * 1000
      // })
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 2 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

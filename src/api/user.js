import request from '@/utils/request'
// import qs from 'qs'

export function login(data) {
  return request({
    url: '/api-auth/oauth/user/token',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api-user/users/users/current',
    method: 'get',
    params: { access_token: token }
  })
}
export function getRoutesApi(token) {
  return request({
    url: '/api-user/menus/getSysMenuByUserId',
    method: 'get',
    params: { token }
  })
}
export function logout(token) {
  const data = { access_token: token }
  return request({
    url: '/api-auth/oauth/remove/token',
    method: 'post',
    data
  })
}
export function getHtml(token) {
  // this.$http.get(url, param).then((response) => {
  //   this.loading = false
  //   // 处理HTML显示
  //   this.html = response.data
  // }).catch(() => {
  //   this.loading = false
  //   this.html = '加载失败'
  // })
  // console.log(token, 'token')
  // const data = { access_token: token }
  // return request({
  //   url: '/api-auth/oauth/remove/token',
  //   method: 'post',
  //   data: qs.stringify(data)
  // })
}

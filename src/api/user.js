import request from '@/utils/request'
// import qs from 'qs'

export function login(data) {
  return request({
    url: '/wl/?md=081&cmd=001', //     url: '/api-auth/oauth/user/token',
    method: 'post',
    data
  })
}

export function editPwd(data) {
  return request({
    url: '/wl/?md=081&cmd=002',
    method: 'post',
    data
  })
}

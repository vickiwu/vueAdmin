import request from '@/utils/request'
// import qs from 'qs'

export function getPeopleList(data) {
  return request({
    url: '/wl/?md=081&cmd=004', //     url: '/api-auth/oauth/user/token',
    method: 'post',
    data
  })
}
export function addPeople(data) {
  return request({
    url: '/wl/?md=081&cmd=003', //     url: '/api-auth/oauth/user/token',
    method: 'post',
    data
  })
}
export function delPeople(data) {
  return request({
    url: '/wl/?md=081&cmd=006', //     url: '/api-auth/oauth/user/token',
    method: 'post',
    data
  })
}
export function editPeople(data) {
  return request({
    url: '/wl/?md=081&cmd=005', //     url: '/api-auth/oauth/user/token',
    method: 'post',
    data
  })
}

export function getRoleList(data) {
  return request({
    url: '/wl/?md=081&cmd=016', //     url: '/api-auth/oauth/user/token',
    method: 'post',
    data
  })
}

export function getDeportList(data) {
  return request({
    url: '/wl/?md=081&cmd=010', //     url: '/api-auth/oauth/user/token',
    method: 'post',
    data
  })
}
export function addDeport(data) {
  return request({
    url: '/wl/?md=081&cmd=007', //     url: '/api-auth/oauth/user/token',
    method: 'post',
    data
  })
}
export function editDeport(data) {
  return request({
    url: '/wl/?md=081&cmd=008', //     url: '/api-auth/oauth/user/token',
    method: 'post',
    data
  })
}
export function delDeport(data) {
  return request({
    url: '/wl/?md=081&cmd=009', //     url: '/api-auth/oauth/user/token',
    method: 'post',
    data
  })
}
export function getDriveList(data) {
  return request({
    url: '/wl/?md=081&cmd=012', //     url: '/api-auth/oauth/user/token',
    method: 'post',
    data
  })
}
export function addDriver(data) {
  return request({
    url: '/wl/?md=081&cmd=011', //     url: '/api-auth/oauth/user/token',
    method: 'post',
    data
  })
}
export function editDriver(data) {
  return request({
    url: '/wl/?md=081&cmd=014', //     url: '/api-auth/oauth/user/token',
    method: 'post',
    data
  })
}
export function delDriver(data) {
  return request({
    url: '/wl/?md=081&cmd=013', //     url: '/api-auth/oauth/user/token',
    method: 'post',
    data
  })
}
export function getClientList(data) {
  return request({
    url: '/wl/?md=081&cmd=018', //     url: '/api-auth/oauth/user/token',
    method: 'post',
    data
  })
}
export function addClient(data) {
  return request({
    url: '/wl/?md=081&cmd=017', //     url: '/api-auth/oauth/user/token',
    method: 'post',
    data
  })
}
export function editClient(data) {
  return request({
    url: '/wl/?md=081&cmd=020', //     url: '/api-auth/oauth/user/token',
    method: 'post',
    data
  })
}
export function delClient(data) {
  return request({
    url: '/wl/?md=081&cmd=019', //     url: '/api-auth/oauth/user/token',
    method: 'post',
    data
  })
}
// export function getInfo(token) {
//   return request({
//     url: '/api-user/users/users/current',
//     method: 'get',
//     params: { access_token: token }
//   })
// }
// export function getRoutesApi(token) {
//   return request({
//     url: '/api-user/menus/getSysMenuByUserId',
//     method: 'get',
//     params: { token }
//   })
// }
// export function logout(token) {
//   const data = { access_token: token }
//   return request({
//     url: '/api-auth/oauth/remove/token',
//     method: 'post',
//     data
//   })
// }

// export function editPwd(data) {
//   return request({
//     url: '/api-auth/oauth/remove/token',
//     method: 'post',
//     data
//   })
// }

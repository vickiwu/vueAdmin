import request from '@/utils/request'
// import qs from 'qs'

export function getPeopleList(data) {
  return request({
    url: '/wl/?md=081&cmd=004',
    method: 'post',
    data
  })
}
export function addPeople(data) {
  return request({
    url: '/wl/?md=081&cmd=003',
    method: 'post',
    data
  })
}
export function delPeople(data) {
  return request({
    url: '/wl/?md=081&cmd=006',
    method: 'post',
    data
  })
}
export function editPeople(data) {
  return request({
    url: '/wl/?md=081&cmd=005',
    method: 'post',
    data
  })
}

export function getRoleList(data) {
  return request({
    url: '/wl/?md=081&cmd=016',
    method: 'post',
    data
  })
}

export function getDeportList(data) {
  return request({
    url: '/wl/?md=081&cmd=010',
    method: 'post',
    data
  })
}
export function addDeport(data) {
  return request({
    url: '/wl/?md=081&cmd=007',
    method: 'post',
    data
  })
}
export function editDeport(data) {
  return request({
    url: '/wl/?md=081&cmd=008',
    method: 'post',
    data
  })
}
export function delDeport(data) {
  return request({
    url: '/wl/?md=081&cmd=009',
    method: 'post',
    data
  })
}
export function getDriveList(data) {
  return request({
    url: '/wl/?md=081&cmd=012',
    method: 'post',
    data
  })
}
export function addDriver(data) {
  return request({
    url: '/wl/?md=081&cmd=011',
    method: 'post',
    data
  })
}
export function editDriver(data) {
  return request({
    url: '/wl/?md=081&cmd=014',
    method: 'post',
    data
  })
}
export function delDriver(data) {
  return request({
    url: '/wl/?md=081&cmd=013',
    method: 'post',
    data
  })
}

export function getCarList(data) {
  return request({
    url: '/wl/?md=081&cmd=027',
    method: 'post',
    data
  })
}
export function addCar(data) {
  return request({
    url: '/wl/?md=081&cmd=025',
    method: 'post',
    data
  })
}
export function editCar(data) {
  return request({
    url: '/wl/?md=081&cmd=026',
    method: 'post',
    data
  })
}
export function delCar(data) {
  return request({
    url: '/wl/?md=081&cmd=028',
    method: 'post',
    data
  })
}

export function getAreaList(data) {
  return request({
    url: '/wl/?md=081&cmd=023',
    method: 'post',
    data
  })
}
export function addArea(data) {
  return request({
    url: '/wl/?md=081&cmd=021',
    method: 'post',
    data
  })
}
export function delArea(data) {
  return request({
    url: '/wl/?md=081&cmd=024',
    method: 'post',
    data
  })
}
export function editArea(data) {
  return request({
    url: '/wl/?md=081&cmd=022',
    method: 'post',
    data
  })
}

export function getClientList(data) {
  return request({
    url: '/wl/?md=081&cmd=018',
    method: 'post',
    data
  })
}
export function addClient(data) {
  return request({
    url: '/wl/?md=081&cmd=017',
    method: 'post',
    data
  })
}
export function editClient(data) {
  return request({
    url: '/wl/?md=081&cmd=020',
    method: 'post',
    data
  })
}
export function delClient(data) {
  return request({
    url: '/wl/?md=081&cmd=019',
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

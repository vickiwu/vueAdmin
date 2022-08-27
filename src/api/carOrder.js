import request from '@/utils/request'

export function addCarOrder(data) {
  return request({
    url: '/wl/?md=081&cmd=034',
    method: 'post',
    data
  })
}
export function getCarOrderList(data) {
  return request({
    url: '/wl/?md=081&cmd=036',
    method: 'post',
    data
  })
}

export function delCarOrder(data) {
  return request({
    url: '/wl/?md=081&cmd=037',
    method: 'post',
    data
  })
}
export function editCarOrder(data) {
  return request({
    url: '/wl/?md=081&cmd=035',
    method: 'post',
    data
  })
}
// 车单司机接单
export function jieCarOrder(data) {
  return request({
    url: '/wl/?md=081&cmd=038',
    method: 'post',
    data
  })
}
// 车单上传回执单
export function shangCarOrder(data) {
  return request({
    url: '/wl/?md=081&cmd=039',
    method: 'post',
    data
  })
}
// 订单结束
export function finishOrder(data) {
  return request({
    url: '/wl/?md=081&cmd=040',
    method: 'post',
    data
  })
}
// 订单结束
export function getDevice(data) {
  return request({
    url: '/wl/?md=081&cmd=043',
    method: 'post',
    data
  })
}

import request from '@/utils/request'

export function publishOrder(data) {
  return request({
    url: '/wl/?md=081&cmd=029',
    method: 'post',
    data
  })
}
export function getOrderList(data) {
  return request({
    url: '/wl/?md=081&cmd=041',
    method: 'post',
    data
  })
}
export function getOrderListCustom(data) {
  return request({
    url: '/wl/?md=081&cmd=042',
    method: 'post',
    data
  })
}
export function getOrderListCustomPublish(data) {
  return request({
    url: '/wl/?md=081&cmd=046',
    method: 'post',
    data
  })
}
export function delOrder(data) {
  return request({
    url: '/wl/?md=081&cmd=033',
    method: 'post',
    data
  })
}
export function editOrder(data) {
  return request({
    url: '/wl/?md=081&cmd=030',
    method: 'post',
    data
  })
}

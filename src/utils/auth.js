import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_token'
const BaseKey = 'vue_admin_base'
const AreaDetailKey = 'area_detail'
const OrderDetailKey = 'order_detail'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getBaseData() {
  const baseData = Cookies.get(BaseKey)
  return baseData ? JSON.parse(baseData) : undefined
}

export function setBaseData(role) {
  return Cookies.set(BaseKey, role)
}

export function removeBaseData() {
  return Cookies.remove(BaseKey)
}
export function getAreaDetail() {
  const areaDetail = Cookies.get(AreaDetailKey)
  return areaDetail ? JSON.parse(areaDetail) : undefined
}

export function setAreaDetail(areaDetail) {
  return Cookies.set(AreaDetailKey, areaDetail)
}

export function removeAreaDetail() {
  return Cookies.remove(AreaDetailKey)
}

export function getEditOrderDetail() {
  const OrderDetail = Cookies.get(OrderDetailKey)
  return OrderDetail ? JSON.parse(OrderDetail) : undefined
}

export function setEditOrderDetail(OrderDetail) {
  return Cookies.set(OrderDetailKey, OrderDetail)
}

export function removeEditOrderDetail() {
  return Cookies.remove(OrderDetailKey)
}

export function getPcarOrderDetail() {
  const OrderDetail = Cookies.get(OrderDetailKey)
  return OrderDetail ? JSON.parse(OrderDetail) : undefined
}

export function setPcarOrderDetail(OrderDetail) {
  return Cookies.set(OrderDetailKey, OrderDetail)
}

export function removePcarOrderDetail() {
  return Cookies.remove(OrderDetailKey)
}

export function getMapOrderDetail() {
  const OrderDetail = Cookies.get(OrderDetailKey)
  return OrderDetail ? JSON.parse(OrderDetail) : undefined
}

export function setMapOrderDetail(OrderDetail) {
  return Cookies.set(OrderDetailKey, OrderDetail)
}

export function removeMapOrderDetail() {
  return Cookies.remove(OrderDetailKey)
}

export function getBindDeviceOrderDetail() {
  const OrderDetail = Cookies.get(OrderDetailKey)
  return OrderDetail ? JSON.parse(OrderDetail) : undefined
}

export function setBindDeviceOrderDetail(OrderDetail) {
  return Cookies.set(OrderDetailKey, OrderDetail)
}

export function removeBindDeviceOrderDetail() {
  return Cookies.remove(OrderDetailKey)
}

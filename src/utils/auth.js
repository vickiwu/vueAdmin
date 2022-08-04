import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_token'
const BaseKey = 'vue_admin_base'

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

import request from '@/utils/request'

const auth = {
  getPageResult(params) {
    return request({
      url: '/api-auth/client/getPageResult',
      method: 'get',
      params
    })
  },

  deleteClient(data) {
    return request({
      url: '/api-auth/client/deleteClient',
      method: 'delete',
      data
    })
  },
  saveClient(data) {
    return request({
      url: '/api-auth/client/saveClient',
      method: 'post',
      data
    })
  },
  updateEnabled(data) {
    return request({
      url: '/api-auth/client/updateEnabled',
      method: 'post',
      data
    })
  }
}
// 引用使用.xxx方法调用
export default auth

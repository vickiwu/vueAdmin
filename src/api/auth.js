import request from '@/utils/request'

const auth = {
  // 应用管理
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
  },
  // 服务接口
  getSysServiceTableTree(params) {
    return request({
      url: '/api-auth/service/getSysServiceTableTree',
      method: 'get',
      params
    })
  },
  getSysServiceSelect(params) {
    return request({
      url: '/api-auth/service/getSysServiceSelect',
      method: 'get',
      params
    })
  },
  saveService(data) {
    return request({
      url: '/api-auth/service/saveService',
      method: 'post',
      data
    })
  },
  deleteService(data) {
    return request({
      url: '/api-auth/service/deleteService',
      method: 'delete',
      data
    })
  },
  // 令牌管理
  getTokenList(params) {
    return request({
      url: '/api-auth/oauth/token/list',
      method: 'get',
      params
    })
  },
  removeToken(data) {
    return request({
      url: '/api-auth/oauth/remove/token',
      method: 'delete',
      data
    })
  },

  // 密钥管理
  getSysSecretPageResult(params) {
    return request({
      url: '/api-auth/sysSecret/getPageResult',
      method: 'get',
      params
    })
  },
  deleteSysSecret(data) {
    return request({
      url: '/api-auth/sysSecret/deleteSysSecret',
      method: 'delete',
      data
    })
  },
  saveSysSecret(data) {
    return request({
      url: '/api-auth/sysSecret/saveSysSecret',
      method: 'post',
      data
    })
  },
  findById(params) {
    return request({
      url: '/api-auth/sysSecret/findById',
      method: 'get',
      params
    })
  },
  // 授权记录
  getSysAuthPageResult(params) {
    return request({
      url: '/api-back/sysAuthLogBack/getPageResult',
      method: 'get',
      params
    })
  },
  deleteSysAuthLog(data) {
    return request({
      url: '/api-auth/sysAuthLog/deleteSysAuthLog',
      method: 'delete',
      data
    })
  }

}
// 引用使用.xxx方法调用
export default auth

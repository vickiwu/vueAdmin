import request from '@/utils/request'
import qs from 'qs'

const table = {
  getList(params) {
    return request({
      url: '/vue-admin-template/table/list',
      method: 'get',
      params
    })
  },
  getTable(data) {
    return request({
      url: '/api-auth/oauth/user/token',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}
// 引用使用.xxx方法调用
export default table

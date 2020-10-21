
import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import qs from 'qs'
const Token = getToken()
const file={
  // 表格列表
 getTableList(params) {
  return request({
    url: 'api-file/files/files/pageResult',
    method: 'get',
    params
  })
},

getSingleResult(params) {
    return request({
      url: 'api-file/files/files/singleResult',
      method: 'post',
      data:params
    })
  },
 


del(params) {
    return request({
      url: 'api-file/files/files/deleteById',
      method: 'delete',
      data:params
    })
  },


  
}
export default file
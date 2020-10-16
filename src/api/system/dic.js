import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import qs from 'qs'
const Token = getToken()
const dic={
  // 表格列表
 getTableList(params) {
  return request({
    url: 'api-system/dic/getDicGroup',
    method: 'get',
    params
  })
},
//获取字典组（编辑）
getDicDetail(params) {
    return request({
      url: 'api-system/dic/getGroupByCode',
      method: 'get',
      params
    })
  }
}
export default dic
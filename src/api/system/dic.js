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
getDicEdit(params) {
    return request({
      url: 'api-system/dic/getGroupByCode',
      method: 'get',
      params
    })
},
//获取字典类型下拉
getDicType(){
  return request({
    url: 'api-system/dicSystem/getDicType',
    method: 'get',
    
  })
},
//保存新增修改
save(params){
  return request({
    url: 'api-system/dic/insertDicGroup',
    method: 'post',
    data:params
  })
},
del(params){
  return request({
    url: 'api-system/dic/removeDicGroup',
    method: 'delete',
    data:params
  })
},
//获取字典项详情
getDicDetail(params){
  return request({
    url: 'api-system/dic/getDicByGroup',
    method: 'get',
    params
  })
},
//获取字典项详情
getOrgTree(){
  return request({
    url: 'api-system/dic/getOrgList',
    method: 'get',
  })
},
//保存字典项
saveDic(params){
  return request({
    url: 'api-system/dic/saveDicMess',
    method: 'post',
    data:params
  })
},

  
}
export default dic
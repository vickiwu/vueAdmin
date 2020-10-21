
import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import qs from 'qs'
const Token = getToken()
const matter={
  // 表格列表
 getTableList(params) {
  return request({
    url: 'api-system/matter/getMatterList',
    method: 'get',
    params
  })
},
///因子类别
getMatterType(){
  return request({
    url: 'api-system/dicSystem/getMatterType',
    method: 'get',
  })
},
///因子监测类型
getMatterMoniterType(){
  return request({
    url: 'api-system/dicSystem/getMatterMoniterType',
    method: 'get',
  })
},
///保存因子
saveMatter(params){
  return request({
    url: 'api-system/matter/saveMatter',
    method: 'post',
    data:params
  })
},
///获取因子信息
getMatterByCode(params){
  return request({
    url: 'api-system/matter/getMatterByCode',
    method: 'get',
    params
  })
},
///删除
removeMatter(params){
  return request({
    url: 'api-system/matter/removeMatter',
    method: 'delete',
    data:params
  })
},

  
}
export default matter
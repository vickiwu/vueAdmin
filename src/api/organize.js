import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import qs from 'qs'
const Token = getToken()
const organize={
  // 表格列表
 getTableList(params) {
  return request({
    url: 'api-user/orgManages/getOrgManageListByOrgId',
    method: 'get',
    params
  })
},
// 机构类型列表
 getOrgTypeList() {
  return request({
    url: 'api-user/orgManages/getOrgTypeList',
    method: 'get',

  })
},
// 上级机构类型列表
getOrgTopList() {
  return request({
    url: 'api-user/orgs/getOrgTreeByToken',
    method: 'get',
    params:{"access_token":Token}
  })
},
// 机构级别列表
getOrgLevelList() {
  return request({
    url: 'api-user/orgManages/getOrgLevel',
    method: 'get'
  })
},
// 列表删除
del(params) {
  return request({
    url: 'api-user/orgManages/delOrg/'+params.orgId,
    method: 'post',
    //data:params
  })
},
// 编辑获取数据
getEditData(params) {
  return request({
    url: 'api-user/orgManages/getOrgByOrgId',
    method: 'get',
    params
  })
},
// 保存修改新增添加
save(params) {
  return request({
    url: 'api-user/orgManages/saveOrgInfo',
    method: 'post',
    data: params
  })
},
/////////////////////////////// 部门管理接口//////////////////////////////////////////
// 获取树
getBMTree(params) {
  return request({
    url: 'api-user/depts/getDeptListByOrgId2',
    method: 'get',
    params
  })
},
//部门职责下拉
getResponsibilities() {
  return request({
    url: 'api-user/orgManages/getDeptDutys',
    method: 'get',
  })
},
//根据部门id获取部门信息
getEditData(params) {
  return request({
    url: 'api-user/orgManages/getDeptInfoById',
    method: 'get',
    params
  })
},

// 列表删除
delBM(params) {
  return request({
    url: 'api-user/depts/deleteDepartment/'+params.deptId,
    method: 'post',
  })
},
saveDD(params) {
  return request({
    url: 'api-user/depts/saveDepartment',
    method: 'post',
    data: params
  })
},


}
export default organize